/**
 * Project Management Services
 * Provides business logic and data access for the Project Management module
 */

import prisma from '../../../lib/prisma';
import { 
  ProjectModel,
  ProjectPhaseModel,
  ProjectMilestoneModel,
  ProjectTaskModel,
  ProjectRiskModel,
  ProjectIssueModel,
  ProjectTeamMemberModel,
  ProjectStakeholderModel,
  ProjectDocumentModel,
  ProjectChangeRequestModel,
  ProjectMeetingModel,
  ProjectActionItemModel,
  ProjectBudgetItemModel,
  ProjectTimesheetModel,
  ProjectTimesheetEntryModel,
  ProjectStatusReportModel,
  ProjectLessonLearnedModel
} from '../models/ProjectManagementModel';

export class ProjectManagementService {
  /**
   * Project Management
   */
  async getProjects(filters = {}) {
    try {
      const { status, priority, managerId, search, clientId } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (managerId) whereClause.managerId = managerId;
      if (clientId) whereClause.clientId = clientId;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const projects = await prisma.project.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { startDate: 'asc' }
        ],
        include: {
          job: {
            select: {
              name: true
            }
          },
          client: {
            select: {
              name: true
            }
          },
          manager: {
            select: {
              name: true
            }
          }
        }
      });
      
      return projects.map(project => new ProjectModel({
        ...project,
        jobName: project.job?.name || '',
        clientName: project.client?.name || '',
        managerName: project.manager?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }
  
  async getProjectById(id) {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          job: {
            select: {
              name: true
            }
          },
          client: {
            select: {
              name: true
            }
          },
          manager: {
            select: {
              name: true
            }
          },
          phases: {
            orderBy: { order: 'asc' },
            include: {
              milestones: true
            }
          },
          milestones: {
            orderBy: { dueDate: 'asc' }
          },
          tasks: {
            orderBy: [
              { priority: 'desc' },
              { dueDate: 'asc' }
            ]
          },
          risks: {
            orderBy: { severity: 'desc' }
          },
          issues: {
            where: { status: { not: 'CLOSED' } },
            orderBy: { priority: 'desc' }
          },
          team: true,
          stakeholders: true,
          documents: {
            orderBy: { updatedAt: 'desc' }
          },
          changeRequests: {
            orderBy: { requestedDate: 'desc' }
          },
          meetings: {
            orderBy: { date: 'desc' }
          },
          budgetItems: true,
          statusReports: {
            orderBy: { reportDate: 'desc' },
            take: 5
          },
          lessonsLearned: true
        }
      });
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      return new ProjectModel({
        ...project,
        jobName: project.job?.name || '',
        clientName: project.client?.name || '',
        managerName: project.manager?.name || '',
        phases: project.phases.map(phase => new ProjectPhaseModel({
          ...phase,
          milestones: phase.milestones.map(milestone => new ProjectMilestoneModel(milestone))
        })),
        milestones: project.milestones.map(milestone => new ProjectMilestoneModel(milestone)),
        tasks: project.tasks.map(task => new ProjectTaskModel(task)),
        risks: project.risks.map(risk => new ProjectRiskModel(risk)),
        issues: project.issues.map(issue => new ProjectIssueModel(issue)),
        team: project.team.map(member => new ProjectTeamMemberModel(member)),
        stakeholders: project.stakeholders.map(stakeholder => new ProjectStakeholderModel(stakeholder)),
        documents: project.documents.map(document => new ProjectDocumentModel(document)),
        changeRequests: project.changeRequests.map(changeRequest => new ProjectChangeRequestModel(changeRequest)),
        meetings: project.meetings.map(meeting => new ProjectMeetingModel(meeting)),
        budgetItems: project.budgetItems.map(budgetItem => new ProjectBudgetItemModel(budgetItem)),
        statusReports: project.statusReports.map(report => new ProjectStatusReportModel(report)),
        lessonsLearned: project.lessonsLearned.map(lesson => new ProjectLessonLearnedModel(lesson))
      });
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw new Error('Failed to fetch project');
    }
  }
  
  async createProject(projectData) {
    try {
      // Validate job and client exist
      if (projectData.jobId) {
        const job = await prisma.job.findUnique({
          where: { id: projectData.jobId }
        });
        
        if (!job) {
          throw new Error('Job not found');
        }
      }
      
      if (projectData.clientId) {
        const client = await prisma.client.findUnique({
          where: { id: projectData.clientId }
        });
        
        if (!client) {
          throw new Error('Client not found');
        }
      }
      
      // Create project
      const project = await prisma.project.create({
        data: {
          name: projectData.name,
          jobId: projectData.jobId,
          clientId: projectData.clientId,
          description: projectData.description,
          type: projectData.type,
          status: projectData.status || 'PLANNING',
          priority: projectData.priority || 'MEDIUM',
          startDate: projectData.startDate ? new Date(projectData.startDate) : null,
          targetCompletionDate: projectData.targetCompletionDate ? new Date(projectData.targetCompletionDate) : null,
          progress: projectData.progress || 0,
          budget: projectData.budget || 0,
          managerId: projectData.managerId,
          tags: projectData.tags || [],
          customFields: projectData.customFields || {},
          createdBy: projectData.createdBy
        }
      });
      
      // Create default phases if provided
      if (projectData.phases && projectData.phases.length > 0) {
        for (let i = 0; i < projectData.phases.length; i++) {
          const phase = projectData.phases[i];
          await prisma.projectPhase.create({
            data: {
              projectId: project.id,
              name: phase.name,
              description: phase.description,
              order: i,
              status: 'PENDING',
              startDate: phase.startDate ? new Date(phase.startDate) : null,
              targetCompletionDate: phase.targetCompletionDate ? new Date(phase.targetCompletionDate) : null
            }
          });
        }
      } else {
        // Create default phases
        const defaultPhases = [
          { name: 'Planning', description: 'Project planning and initiation phase' },
          { name: 'Execution', description: 'Project execution and implementation phase' },
          { name: 'Monitoring', description: 'Project monitoring and control phase' },
          { name: 'Closure', description: 'Project closure and handover phase' }
        ];
        
        for (let i = 0; i < defaultPhases.length; i++) {
          const phase = defaultPhases[i];
          await prisma.projectPhase.create({
            data: {
              projectId: project.id,
              name: phase.name,
              description: phase.description,
              order: i,
              status: 'PENDING'
            }
          });
        }
      }
      
      // Add team members if provided
      if (projectData.team && projectData.team.length > 0) {
        for (const member of projectData.team) {
          await prisma.projectTeamMember.create({
            data: {
              projectId: project.id,
              userId: member.userId,
              name: member.name,
              role: member.role,
              responsibilities: member.responsibilities,
              joinDate: new Date(),
              allocation: member.allocation || 100
            }
          });
        }
      }
      
      // Add stakeholders if provided
      if (projectData.stakeholders && projectData.stakeholders.length > 0) {
        for (const stakeholder of projectData.stakeholders) {
          await prisma.projectStakeholder.create({
            data: {
              projectId: project.id,
              name: stakeholder.name,
              organization: stakeholder.organization,
              role: stakeholder.role,
              contactInfo: stakeholder.contactInfo,
              influence: stakeholder.influence || 'MEDIUM',
              interest: stakeholder.interest || 'MEDIUM',
              expectations: stakeholder.expectations,
              communicationPreference: stakeholder.communicationPreference,
              communicationFrequency: stakeholder.communicationFrequency
            }
          });
        }
      }
      
      // Create initial milestone if provided
      if (projectData.initialMilestone) {
        await prisma.projectMilestone.create({
          data: {
            projectId: project.id,
            name: projectData.initialMilestone.name || 'Project Kickoff',
            description: projectData.initialMilestone.description || 'Project kickoff milestone',
            dueDate: projectData.initialMilestone.dueDate ? new Date(projectData.initialMilestone.dueDate) : null,
            status: 'PENDING',
            priority: 'HIGH'
          }
        });
      }
      
      // Notify relevant parties about new project
      await this.notifyProjectCreation(project);
      
      return new ProjectModel(project);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }
  
  async updateProjectStatus(id, status, progress, notes, userId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id }
      });
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      // Validate status transition
      const validTransitions = {
        PLANNING: ['ACTIVE', 'ON_HOLD', 'CANCELLED'],
        ACTIVE: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
        ON_HOLD: ['PLANNING', 'ACTIVE', 'CANCELLED'],
        COMPLETED: ['ACTIVE'], // Allow reopening if needed
        CANCELLED: ['PLANNING', 'ACTIVE']
      };
      
      if (!validTransitions[project.status].includes(status)) {
        throw new Error(`Invalid status transition from ${project.status} to ${status}`);
      }
      
      // Update project
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          status,
          progress: progress !== undefined ? progress : project.progress,
          actualCompletionDate: status === 'COMPLETED' ? new Date() : project.actualCompletionDate,
          notes: notes ? `${project.notes || ''}\n${notes}` : project.notes,
          updatedAt: new Date()
        }
      });
      
      // Create status report for this change
      await prisma.projectStatusReport.create({
        data: {
          projectId: id,
          reportDate: new Date().toISOString().split('T')[0],
          reportingPeriod: 'Status Change',
          preparedBy: userId,
          overallStatus: this.mapProjectStatusToReportStatus(status),
          executiveSummary: `Project status changed to ${status}${notes ? `: ${notes}` : ''}`,
          metrics: {
            progressPlanned: project.progress,
            progressActual: progress !== undefined ? progress : project.progress
          }
        }
      });
      
      // Notify relevant parties about status change
      await this.notifyProjectStatusChange(updatedProject);
      
      return new ProjectModel(updatedProject);
    } catch (error) {
      console.error(`Error updating project status for ID ${id}:`, error);
      throw new Error('Failed to update project status');
    }
  }
  
  /**
   * Project Phase Management
   */
  async getProjectPhases(projectId) {
    try {
      const phases = await prisma.projectPhase.findMany({
        where: { projectId },
        orderBy: { order: 'asc' },
        include: {
          milestones: {
            orderBy: { dueDate: 'asc' }
          },
          tasks: {
            orderBy: [
              { priority: 'desc' },
              { dueDate: 'asc' }
            ]
          }
        }
      });
      
      return phases.map(phase => new ProjectPhaseModel({
        ...phase,
        milestones: phase.milestones.map(milestone => new ProjectMilestoneModel(milestone)),
        tasks: phase.tasks.map(task => new ProjectTaskModel(task))
      }));
    } catch (error) {
      console.error(`Error fetching phases for project ${projectId}:`, error);
      throw new Error('Failed to fetch project phases');
    }
  }
  
  async updatePhaseStatus(id, status, progress, notes) {
    try {
      const phase = await prisma.projectPhase.findUnique({
        where: { id },
        include: {
          project: true
        }
      });
      
      if (!phase) {
        throw new Error('Project phase not found');
      }
      
      // Update phase
      const updatedPhase = await prisma.projectPhase.update({
        where: { id },
        data: {
          status,
          progress: progress !== undefined ? progress : phase.progress,
          actualCompletionDate: status === 'COMPLETED' ? new Date() : phase.actualCompletionDate,
          notes: notes ? `${phase.notes || ''}\n${notes}` : phase.notes,
          updatedAt: new Date()
        }
      });
      
      // Update project progress
      await this.updateProjectProgress(phase.projectId);
      
      return new ProjectPhaseModel(updatedPhase);
    } catch (error) {
      console.error(`Error updating phase status for ID ${id}:`, error);
      throw new Error('Failed to update phase status');
    }
  }
  
  /**
   * Project Milestone Management
   */
  async getProjectMilestones(filters = {}) {
    try {
      const { projectId, phaseId, status, dueFrom, dueTo, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (phaseId) whereClause.phaseId = phaseId;
      if (status) whereClause.status = status;
      
      if (dueFrom && dueTo) {
        whereClause.dueDate = {
          gte: new Date(dueFrom),
          lte: new Date(dueTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const milestones = await prisma.projectMilestone.findMany({
        where: whereClause,
        orderBy: { dueDate: 'asc' },
        include: {
          project: {
            select: {
              name: true
            }
          },
          phase: {
            select: {
              name: true
            }
          }
        }
      });
      
      return milestones.map(milestone => new ProjectMilestoneModel({
        ...milestone,
        projectName: milestone.project?.name || '',
        phaseName: milestone.phase?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching project milestones:', error);
      throw new Error('Failed to fetch project milestones');
    }
  }
  
  async createMilestone(milestoneData) {
    try {
      // Validate project exists
      const project = await prisma.project.findUnique({
        where: { id: milestoneData.projectId }
      });
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      // Validate phase if provided
      if (milestoneData.phaseId) {
        const phase = await prisma.projectPhase.findUnique({
          where: { id: milestoneData.phaseId }
        });
        
        if (!phase) {
          throw new Error('Project phase not found');
        }
      }
      
      // Create milestone
      const milestone = await prisma.projectMilestone.create({
        data: {
          projectId: milestoneData.projectId,
          phaseId: milestoneData.phaseId,
          name: milestoneData.name,
          description: milestoneData.description,
          dueDate: milestoneData.dueDate ? new Date(milestoneData.dueDate) : null,
          status: milestoneData.status || 'PENDING',
          priority: milestoneData.priority || 'MEDIUM',
          deliverables: milestoneData.deliverables || [],
          dependencies: milestoneData.dependencies || [],
          assignedTo: milestoneData.assignedTo,
          notes: milestoneData.notes
        }
      });
      
      return new ProjectMilestoneModel(milestone);
    } catch (error) {
      console.error('Error creating project milestone:', error);
      throw new Error('Failed to create project milestone');
    }
  }
  
  async updateMilestoneStatus(id, status, notes, userId) {
    try {
      const milestone = await prisma.projectMilestone.findUnique({
        where: { id },
        include: {
          project: true
        }
      });
      
      if (!milestone) {
        throw new Error('Project milestone not found');
      }
      
      // Update milestone
      const updatedMilestone = await prisma.projectMilestone.update({
        where: { id },
        data: {
          status,
          completedDate: status === 'COMPLETED' ? new Date() : milestone.completedDate,
          notes: notes ? `${milestone.notes || ''}\n${notes}` : milestone.notes,
          updatedAt: new Date()
        }
      });
      
      // If milestone is completed, check if we need to update phase status
      if (status === 'COMPLETED' && milestone.phaseId) {
        await this.checkPhaseCompletion(milestone.phaseId);
      }
      
      // Update project progress
      await this.updateProjectProgress(milestone.projectId);
      
      // Notify relevant parties about milestone status change
      await this.notifyMilestoneStatusChange(updatedMilestone);
      
      return new ProjectMilestoneModel(updatedMilestone);
    } catch (error) {
      console.error(`Error updating milestone status for ID ${id}:`, error);
      throw new Error('Failed to update milestone status');
    }
  }
  
  /**
   * Project Task Management
   */
  async getProjectTasks(filters = {}) {
    try {
      const { projectId, phaseId, milestoneId, status, priority, assignedTo, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (phaseId) whereClause.phaseId = phaseId;
      if (milestoneId) whereClause.milestoneId = milestoneId;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const tasks = await prisma.projectTask.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' }
        ],
        include: {
          project: {
            select: {
              name: true
            }
          },
          phase: {
            select: {
              name: true
            }
          },
          milestone: {
            select: {
              name: true
            }
          },
          assignee: {
            select: {
              name: true
            }
          },
          subtasks: true
        }
      });
      
      return tasks.map(task => new ProjectTaskModel({
        ...task,
        projectName: task.project?.name || '',
        phaseName: task.phase?.name || '',
        milestoneName: task.milestone?.name || '',
        assignedToName: task.assignee?.name || '',
        subtasks: task.subtasks.map(subtask => new ProjectTaskModel(subtask))
      }));
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      throw new Error('Failed to fetch project tasks');
    }
  }
  
  async createTask(taskData) {
    try {
      // Validate project exists
      const project = await prisma.project.findUnique({
        where: { id: taskData.projectId }
      });
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      // Validate phase if provided
      if (taskData.phaseId) {
        const phase = await prisma.projectPhase.findUnique({
          where: { id: taskData.phaseId }
        });
        
        if (!phase) {
          throw new Error('Project phase not found');
        }
      }
      
      // Validate milestone if provided
      if (taskData.milestoneId) {
        const milestone = await prisma.projectMilestone.findUnique({
          where: { id: taskData.milestoneId }
        });
        
        if (!milestone) {
          throw new Error('Project milestone not found');
        }
      }
      
      // Validate parent task if provided
      if (taskData.parentTaskId) {
        const parentTask = await prisma.projectTask.findUnique({
          where: { id: taskData.parentTaskId }
        });
        
        if (!parentTask) {
          throw new Error('Parent task not found');
        }
      }
      
      // Create task
      const task = await prisma.projectTask.create({
        data: {
          projectId: taskData.projectId,
          phaseId: taskData.phaseId,
          milestoneId: taskData.milestoneId,
          parentTaskId: taskData.parentTaskId,
          name: taskData.name,
          description: taskData.description,
          type: taskData.type,
          status: taskData.status || 'TODO',
          priority: taskData.priority || 'MEDIUM',
          complexity: taskData.complexity || 'MEDIUM',
          startDate: taskData.startDate ? new Date(taskData.startDate) : null,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          estimatedHours: taskData.estimatedHours || 0,
          progress: taskData.progress || 0,
          assignedTo: taskData.assignedTo,
          watchers: taskData.watchers || [],
          dependencies: taskData.dependencies || [],
          attachments: taskData.attachments || [],
          tags: taskData.tags || [],
          createdBy: taskData.createdBy
        }
      });
      
      // Notify assigned user
      if (task.assignedTo) {
        await this.notifyTaskAssignment(task);
      }
      
      return new ProjectTaskModel(task);
    } catch (error) {
      console.error('Error creating project task:', error);
      throw new Error('Failed to create project task');
    }
  }
  
  async updateTaskStatus(id, status, progress, actualHours, notes, userId) {
    try {
      const task = await prisma.projectTask.findUnique({
        where: { id },
        include: {
          project: true,
          milestone: true
        }
      });
      
      if (!task) {
        throw new Error('Project task not found');
      }
      
      // Update task
      const updatedTask = await prisma.projectTask.update({
        where: { id },
        data: {
          status,
          progress: progress !== undefined ? progress : task.progress,
          completedDate: status === 'COMPLETED' ? new Date() : task.completedDate,
          actualHours: actualHours !== undefined ? actualHours : task.actualHours,
          comments: [
            ...(task.comments || []),
            {
              userId,
              timestamp: new Date(),
              content: `Status updated to ${status}${notes ? `: ${notes}` : ''}`,
              action: 'STATUS_UPDATE'
            }
          ],
          updatedAt: new Date()
        }
      });
      
      // If task is completed, check if we need to update milestone status
      if (status === 'COMPLETED' && task.milestoneId) {
        await this.checkMilestoneCompletion(task.milestoneId);
      }
      
      // Update project progress
      await this.updateProjectProgress(task.projectId);
      
      return new ProjectTaskModel(updatedTask);
    } catch (error) {
      console.error(`Error updating task status for ID ${id}:`, error);
      throw new Error('Failed to update task status');
    }
  }
  
  /**
   * Project Risk Management
   */
  async getProjectRisks(filters = {}) {
    try {
      const { projectId, status, severity, category, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      if (severity) whereClause.severity = severity;
      if (category) whereClause.category = category;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const risks = await prisma.projectRisk.findMany({
        where: whereClause,
        orderBy: [
          { severity: 'desc' },
          { identifiedDate: 'desc' }
        ],
        include: {
          project: {
            select: {
              name: true
            }
          },
          owner: {
            select: {
              name: true
            }
          }
        }
      });
      
      return risks.map(risk => new ProjectRiskModel({
        ...risk,
        projectName: risk.project?.name || '',
        ownerName: risk.owner?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching project risks:', error);
      throw new Error('Failed to fetch project risks');
    }
  }
  
  /**
   * Project Issue Management
   */
  async getProjectIssues(filters = {}) {
    try {
      const { projectId, status, priority, severity, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (severity) whereClause.severity = severity;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const issues = await prisma.projectIssue.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { reportedDate: 'desc' }
        ],
        include: {
          project: {
            select: {
              name: true
            }
          },
          assignee: {
            select: {
              name: true
            }
          }
        }
      });
      
      return issues.map(issue => new ProjectIssueModel({
        ...issue,
        projectName: issue.project?.name || '',
        assignedToName: issue.assignee?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching project issues:', error);
      throw new Error('Failed to fetch project issues');
    }
  }
  
  /**
   * Project Document Management
   */
  async getProjectDocuments(filters = {}) {
    try {
      const { projectId, type, category, status, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { fileName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const documents = await prisma.projectDocument.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          },
          uploader: {
            select: {
              name: true
            }
          }
        }
      });
      
      return documents.map(document => new ProjectDocumentModel({
        ...document,
        projectName: document.project?.name || '',
        uploaderName: document.uploader?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching project documents:', error);
      throw new Error('Failed to fetch project documents');
    }
  }
  
  /**
   * Project Change Request Management
   */
  async getProjectChangeRequests(filters = {}) {
    try {
      const { projectId, status, type, priority, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (priority) whereClause.priority = priority;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { justification: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const changeRequests = await prisma.projectChangeRequest.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { requestedDate: 'desc' }
        ],
        include: {
          project: {
            select: {
              name: true
            }
          },
          requester: {
            select: {
              name: true
            }
          }
        }
      });
      
      return changeRequests.map(changeRequest => new ProjectChangeRequestModel({
        ...changeRequest,
        projectName: changeRequest.project?.name || '',
        requesterName: changeRequest.requester?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching project change requests:', error);
      throw new Error('Failed to fetch project change requests');
    }
  }
  
  /**
   * Project Meeting Management
   */
  async getProjectMeetings(filters = {}) {
    try {
      const { projectId, type, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.date = {
          gte: dateFrom,
          lte: dateTo
        };
      }
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const meetings = await prisma.projectMeeting.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          },
          actionItems: true
        }
      });
      
      return meetings.map(meeting => new ProjectMeetingModel({
        ...meeting,
        projectName: meeting.project?.name || '',
        actionItems: meeting.actionItems.map(item => new ProjectActionItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching project meetings:', error);
      throw new Error('Failed to fetch project meetings');
    }
  }
  
  /**
   * Project Budget Management
   */
  async getProjectBudgetItems(projectId) {
    try {
      const budgetItems = await prisma.projectBudgetItem.findMany({
        where: { projectId },
        orderBy: [
          { category: 'asc' },
          { date: 'asc' }
        ]
      });
      
      return budgetItems.map(item => new ProjectBudgetItemModel(item));
    } catch (error) {
      console.error(`Error fetching budget items for project ${projectId}:`, error);
      throw new Error('Failed to fetch project budget items');
    }
  }
  
  async getProjectBudgetSummary(projectId) {
    try {
      const budgetItems = await prisma.projectBudgetItem.findMany({
        where: { projectId }
      });
      
      const summary = {
        totalBudget: 0,
        totalActual: 0,
        totalVariance: 0,
        totalVariancePercentage: 0,
        expensesByCategory: {},
        incomeByCategory: {}
      };
      
      budgetItems.forEach(item => {
        if (item.type === 'EXPENSE') {
          summary.totalBudget += item.estimatedAmount;
          summary.totalActual += item.actualAmount;
          
          if (!summary.expensesByCategory[item.category]) {
            summary.expensesByCategory[item.category] = {
              estimated: 0,
              actual: 0,
              variance: 0
            };
          }
          
          summary.expensesByCategory[item.category].estimated += item.estimatedAmount;
          summary.expensesByCategory[item.category].actual += item.actualAmount;
          summary.expensesByCategory[item.category].variance += (item.estimatedAmount - item.actualAmount);
        } else if (item.type === 'INCOME') {
          if (!summary.incomeByCategory[item.category]) {
            summary.incomeByCategory[item.category] = {
              estimated: 0,
              actual: 0,
              variance: 0
            };
          }
          
          summary.incomeByCategory[item.category].estimated += item.estimatedAmount;
          summary.incomeByCategory[item.category].actual += item.actualAmount;
          summary.incomeByCategory[item.category].variance += (item.actualAmount - item.estimatedAmount);
        }
      });
      
      summary.totalVariance = summary.totalBudget - summary.totalActual;
      summary.totalVariancePercentage = summary.totalBudget > 0 
        ? (summary.totalVariance / summary.totalBudget) * 100 
        : 0;
      
      return summary;
    } catch (error) {
      console.error(`Error fetching budget summary for project ${projectId}:`, error);
      throw new Error('Failed to fetch project budget summary');
    }
  }
  
  /**
   * Project Timesheet Management
   */
  async getProjectTimesheets(filters = {}) {
    try {
      const { projectId, userId, status, dateFrom, dateTo } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (userId) whereClause.userId = userId;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.OR = [
          {
            weekStartDate: {
              gte: dateFrom,
              lte: dateTo
            }
          },
          {
            weekEndDate: {
              gte: dateFrom,
              lte: dateTo
            }
          }
        ];
      }
      
      const timesheets = await prisma.projectTimesheet.findMany({
        where: whereClause,
        orderBy: { weekStartDate: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              name: true
            }
          },
          entries: true
        }
      });
      
      return timesheets.map(timesheet => new ProjectTimesheetModel({
        ...timesheet,
        projectName: timesheet.project?.name || '',
        userName: timesheet.user?.name || '',
        entries: timesheet.entries.map(entry => new ProjectTimesheetEntryModel(entry))
      }));
    } catch (error) {
      console.error('Error fetching project timesheets:', error);
      throw new Error('Failed to fetch project timesheets');
    }
  }
  
  /**
   * Project Status Report Management
   */
  async getProjectStatusReports(filters = {}) {
    try {
      const { projectId, overallStatus, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (overallStatus) whereClause.overallStatus = overallStatus;
      
      if (dateFrom && dateTo) {
        whereClause.reportDate = {
          gte: dateFrom,
          lte: dateTo
        };
      }
      
      if (search) {
        whereClause.OR = [
          { executiveSummary: { contains: search, mode: 'insensitive' } },
          { reportingPeriod: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const statusReports = await prisma.projectStatusReport.findMany({
        where: whereClause,
        orderBy: { reportDate: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          },
          preparer: {
            select: {
              name: true
            }
          }
        }
      });
      
      return statusReports.map(report => new ProjectStatusReportModel({
        ...report,
        projectName: report.project?.name || '',
        preparerName: report.preparer?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching project status reports:', error);
      throw new Error('Failed to fetch project status reports');
    }
  }
  
  /**
   * Project Lesson Learned Management
   */
  async getProjectLessonsLearned(filters = {}) {
    try {
      const { projectId, category, status, priority, search } = filters;
      
      const whereClause = {};
      if (projectId) whereClause.projectId = projectId;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { recommendation: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const lessonsLearned = await prisma.projectLessonLearned.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { identifiedDate: 'desc' }
        ],
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return lessonsLearned.map(lesson => new ProjectLessonLearnedModel({
        ...lesson,
        projectName: lesson.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching project lessons learned:', error);
      throw new Error('Failed to fetch project lessons learned');
    }
  }
  
  /**
   * Project Dashboard
   */
  async getProjectDashboardData() {
    try {
      const today = new Date();
      
      // Projects by status
      const projectsByStatus = await prisma.project.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      // Projects by priority
      const projectsByPriority = await prisma.project.groupBy({
        by: ['priority'],
        _count: {
          id: true
        }
      });
      
      // Upcoming milestones (next 30 days)
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const upcomingMilestones = await prisma.projectMilestone.findMany({
        where: {
          dueDate: {
            gte: today,
            lte: thirtyDaysFromNow
          },
          status: 'PENDING'
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Overdue milestones
      const overdueMilestones = await prisma.projectMilestone.findMany({
        where: {
          dueDate: {
            lt: today
          },
          status: 'PENDING'
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Recent status changes
      const recentStatusChanges = await prisma.project.findMany({
        where: {
          updatedAt: {
            gte: new Date(today.setDate(today.getDate() - 7))
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      });
      
      // Open issues by priority
      const openIssuesByPriority = await prisma.projectIssue.groupBy({
        by: ['priority'],
        _count: {
          id: true
        },
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS'] }
        }
      });
      
      // Open risks by severity
      const openRisksBySeverity = await prisma.projectRisk.groupBy({
        by: ['severity'],
        _count: {
          id: true
        },
        where: {
          status: { in: ['IDENTIFIED', 'ANALYZING', 'MITIGATING'] }
        }
      });
      
      return {
        projectsByStatus,
        projectsByPriority,
        upcomingMilestones: upcomingMilestones.map(milestone => new ProjectMilestoneModel({
          ...milestone,
          projectName: milestone.project?.name || ''
        })),
        overdueMilestones: overdueMilestones.map(milestone => new ProjectMilestoneModel({
          ...milestone,
          projectName: milestone.project?.name || ''
        })),
        recentStatusChanges: recentStatusChanges.map(project => new ProjectModel(project)),
        openIssuesByPriority,
        openRisksBySeverity
      };
    } catch (error) {
      console.error('Error fetching project dashboard data:', error);
      throw new Error('Failed to fetch project dashboard data');
    }
  }
  
  /**
   * Helper Methods
   */
  async updateProjectProgress(projectId) {
    try {
      // Get all phases for this project
      const phases = await prisma.projectPhase.findMany({
        where: { projectId }
      });
      
      if (phases.length === 0) {
        return;
      }
      
      // Calculate progress based on phase progress
      let totalProgress = 0;
      phases.forEach(phase => {
        totalProgress += phase.progress || 0;
      });
      
      const progress = Math.round(totalProgress / phases.length);
      
      // Update project progress
      await prisma.project.update({
        where: { id: projectId },
        data: {
          progress,
          updatedAt: new Date()
        }
      });
      
      // If progress is 100%, update status to COMPLETED
      if (progress === 100) {
        const project = await prisma.project.findUnique({
          where: { id: projectId }
        });
        
        if (project && project.status !== 'COMPLETED') {
          await prisma.project.update({
            where: { id: projectId },
            data: {
              status: 'COMPLETED',
              actualCompletionDate: new Date(),
              updatedAt: new Date()
            }
          });
        }
      }
      
      return progress;
    } catch (error) {
      console.error(`Error updating project progress for ${projectId}:`, error);
      throw new Error('Failed to update project progress');
    }
  }
  
  async checkPhaseCompletion(phaseId) {
    try {
      // Get all milestones for this phase
      const milestones = await prisma.projectMilestone.findMany({
        where: { phaseId }
      });
      
      // Get all tasks for this phase
      const tasks = await prisma.projectTask.findMany({
        where: { phaseId }
      });
      
      // Check if all milestones and tasks are completed
      const allMilestonesCompleted = milestones.length > 0 && 
        milestones.every(milestone => milestone.status === 'COMPLETED');
      
      const allTasksCompleted = tasks.length > 0 && 
        tasks.every(task => task.status === 'COMPLETED');
      
      // If all are completed, update phase status
      if ((milestones.length > 0 || tasks.length > 0) && 
          (allMilestonesCompleted || allTasksCompleted)) {
        await prisma.projectPhase.update({
          where: { id: phaseId },
          data: {
            status: 'COMPLETED',
            progress: 100,
            actualCompletionDate: new Date(),
            updatedAt: new Date()
          }
        });
        
        // Get project ID and update project progress
        const phase = await prisma.projectPhase.findUnique({
          where: { id: phaseId }
        });
        
        if (phase) {
          await this.updateProjectProgress(phase.projectId);
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error checking phase completion for ${phaseId}:`, error);
      throw new Error('Failed to check phase completion');
    }
  }
  
  async checkMilestoneCompletion(milestoneId) {
    try {
      // Get all tasks for this milestone
      const tasks = await prisma.projectTask.findMany({
        where: { milestoneId }
      });
      
      // Check if all tasks are completed
      const allTasksCompleted = tasks.length > 0 && 
        tasks.every(task => task.status === 'COMPLETED');
      
      // If all tasks are completed, update milestone status
      if (tasks.length > 0 && allTasksCompleted) {
        await prisma.projectMilestone.update({
          where: { id: milestoneId },
          data: {
            status: 'COMPLETED',
            completedDate: new Date(),
            updatedAt: new Date()
          }
        });
        
        // Get milestone details
        const milestone = await prisma.projectMilestone.findUnique({
          where: { id: milestoneId }
        });
        
        // If milestone is part of a phase, check phase completion
        if (milestone && milestone.phaseId) {
          await this.checkPhaseCompletion(milestone.phaseId);
        }
        
        // Update project progress
        if (milestone) {
          await this.updateProjectProgress(milestone.projectId);
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error checking milestone completion for ${milestoneId}:`, error);
      throw new Error('Failed to check milestone completion');
    }
  }
  
  mapProjectStatusToReportStatus(projectStatus) {
    const statusMap = {
      'PLANNING': 'ON_TRACK',
      'ACTIVE': 'ON_TRACK',
      'ON_HOLD': 'AT_RISK',
      'COMPLETED': 'ON_TRACK',
      'CANCELLED': 'OFF_TRACK'
    };
    
    return statusMap[projectStatus] || 'ON_TRACK';
  }
  
  async notifyProjectCreation(project) {
    // This would typically send notifications to relevant parties
    console.log(`Project ${project.name} created`);
    return true;
  }
  
  async notifyProjectStatusChange(project) {
    // This would typically send notifications to relevant parties
    console.log(`Project ${project.name} status changed to ${project.status}`);
    return true;
  }
  
  async notifyMilestoneStatusChange(milestone) {
    // This would typically send notifications to relevant parties
    console.log(`Milestone ${milestone.name} status changed to ${milestone.status}`);
    return true;
  }
  
  async notifyTaskAssignment(task) {
    // This would typically send notifications to assigned user
    console.log(`Task ${task.name} assigned`);
    return true;
  }
}

export default new ProjectManagementService();
