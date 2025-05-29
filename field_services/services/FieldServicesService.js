/**
 * Field Services Module Services
 * Provides business logic and data access for the Field Services module
 */

import prisma from '../../../lib/prisma';
import { 
  FieldInstallationModel,
  FieldPieceModel,
  FieldIssueModel,
  FieldTaskModel,
  FieldChecklistModel,
  FieldChecklistItemModel,
  FieldEquipmentModel,
  FieldMaterialModel,
  FieldCrewMemberModel,
  FieldSafetyIncidentModel,
  FieldDailyReportModel,
  FieldInspectionModel,
  FieldInspectionItemModel,
  FieldPunchListModel,
  FieldPunchListItemModel,
  FieldHandoverModel,
  FieldWarrantyClaimModel
} from '../models/FieldServicesModel';

export class FieldServicesService {
  /**
   * Field Installation Management
   */
  async getInstallations(filters = {}) {
    try {
      const { jobId, projectId, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (jobId) whereClause.jobId = jobId;
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.scheduledDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { jobName: { contains: search, mode: 'insensitive' } },
          { projectName: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const installations = await prisma.fieldInstallation.findMany({
        where: whereClause,
        orderBy: { scheduledDate: 'asc' },
        include: {
          job: {
            select: {
              name: true
            }
          },
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return installations.map(installation => new FieldInstallationModel({
        ...installation,
        jobName: installation.job?.name || '',
        projectName: installation.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching field installations:', error);
      throw new Error('Failed to fetch field installations');
    }
  }
  
  async getInstallationById(id) {
    try {
      const installation = await prisma.fieldInstallation.findUnique({
        where: { id },
        include: {
          job: {
            select: {
              name: true,
              client: {
                select: {
                  name: true
                }
              }
            }
          },
          project: {
            select: {
              name: true
            }
          },
          pieces: {
            orderBy: { pieceNumber: 'asc' }
          },
          tasks: {
            orderBy: { dueDate: 'asc' }
          },
          checklists: {
            include: {
              items: true
            }
          },
          equipment: true,
          materials: true,
          crew: true,
          issues: {
            where: { status: { not: 'CLOSED' } },
            orderBy: { severity: 'desc' }
          },
          safetyIncidents: true,
          dailyReports: {
            orderBy: { date: 'desc' },
            take: 5
          },
          inspections: {
            orderBy: { scheduledDate: 'desc' }
          },
          punchLists: {
            include: {
              items: true
            }
          }
        }
      });
      
      if (!installation) {
        throw new Error('Field installation not found');
      }
      
      return new FieldInstallationModel({
        ...installation,
        jobName: installation.job?.name || '',
        projectName: installation.project?.name || '',
        clientName: installation.job?.client?.name || '',
        pieces: installation.pieces.map(piece => new FieldPieceModel(piece)),
        tasks: installation.tasks.map(task => new FieldTaskModel(task)),
        checklists: installation.checklists.map(checklist => new FieldChecklistModel({
          ...checklist,
          items: checklist.items.map(item => new FieldChecklistItemModel(item))
        })),
        equipment: installation.equipment.map(equipment => new FieldEquipmentModel(equipment)),
        materials: installation.materials.map(material => new FieldMaterialModel(material)),
        crew: installation.crew.map(member => new FieldCrewMemberModel(member)),
        issues: installation.issues.map(issue => new FieldIssueModel(issue)),
        safetyIncidents: installation.safetyIncidents.map(incident => new FieldSafetyIncidentModel(incident)),
        dailyReports: installation.dailyReports.map(report => new FieldDailyReportModel(report)),
        inspections: installation.inspections.map(inspection => new FieldInspectionModel(inspection)),
        punchLists: installation.punchLists.map(punchList => new FieldPunchListModel({
          ...punchList,
          items: punchList.items.map(item => new FieldPunchListItemModel(item))
        }))
      });
    } catch (error) {
      console.error(`Error fetching field installation with ID ${id}:`, error);
      throw new Error('Failed to fetch field installation');
    }
  }
  
  async createInstallation(installationData) {
    try {
      // Validate job and project exist
      const job = await prisma.job.findUnique({
        where: { id: installationData.jobId }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (installationData.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: installationData.projectId }
        });
        
        if (!project) {
          throw new Error('Project not found');
        }
      }
      
      // Create installation
      const installation = await prisma.fieldInstallation.create({
        data: {
          jobId: installationData.jobId,
          projectId: installationData.projectId,
          location: installationData.location,
          scheduledDate: installationData.scheduledDate ? new Date(installationData.scheduledDate) : null,
          status: installationData.status || 'SCHEDULED',
          progress: installationData.progress || 0,
          supervisor: installationData.supervisor,
          supervisorId: installationData.supervisorId,
          clientContact: installationData.clientContact,
          clientContactId: installationData.clientContactId,
          generalContractor: installationData.generalContractor,
          generalContractorId: installationData.generalContractorId,
          weatherConditions: installationData.weatherConditions,
          notes: installationData.notes,
          createdBy: installationData.createdBy
        }
      });
      
      // Create default checklists
      await this.createDefaultChecklists(installation.id);
      
      // Sync pieces from job/project
      if (installationData.syncPieces) {
        await this.syncPiecesFromJob(installation.id, installationData.jobId);
      }
      
      return new FieldInstallationModel(installation);
    } catch (error) {
      console.error('Error creating field installation:', error);
      throw new Error('Failed to create field installation');
    }
  }
  
  async updateInstallationStatus(id, status, progress, notes) {
    try {
      const installation = await prisma.fieldInstallation.findUnique({
        where: { id }
      });
      
      if (!installation) {
        throw new Error('Field installation not found');
      }
      
      // Validate status transition
      const validTransitions = {
        SCHEDULED: ['IN_PROGRESS', 'DELAYED', 'CANCELLED'],
        IN_PROGRESS: ['COMPLETED', 'DELAYED', 'CANCELLED'],
        DELAYED: ['SCHEDULED', 'IN_PROGRESS', 'CANCELLED'],
        CANCELLED: ['SCHEDULED'],
        COMPLETED: ['IN_PROGRESS'] // Allow reopening if needed
      };
      
      if (!validTransitions[installation.status].includes(status)) {
        throw new Error(`Invalid status transition from ${installation.status} to ${status}`);
      }
      
      // Update installation
      const updatedInstallation = await prisma.fieldInstallation.update({
        where: { id },
        data: {
          status,
          progress: progress !== undefined ? progress : installation.progress,
          completedDate: status === 'COMPLETED' ? new Date() : installation.completedDate,
          notes: notes ? `${installation.notes || ''}\n${notes}` : installation.notes,
          updatedAt: new Date()
        }
      });
      
      // Update related records based on status change
      if (status === 'COMPLETED') {
        // Update all pieces to INSTALLED if not already in a final state
        await prisma.fieldPiece.updateMany({
          where: {
            installationId: id,
            status: { notIn: ['INSTALLED', 'COMPLETED', 'REWORK_NEEDED'] }
          },
          data: {
            status: 'INSTALLED',
            installationDate: new Date(),
            updatedAt: new Date()
          }
        });
        
        // Close all open tasks
        await prisma.fieldTask.updateMany({
          where: {
            installationId: id,
            status: { in: ['PENDING', 'IN_PROGRESS'] }
          },
          data: {
            status: 'COMPLETED',
            completedDate: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      // Notify relevant parties about status change
      await this.notifyInstallationStatusChange(updatedInstallation);
      
      // Update job progress
      await this.updateJobProgress(installation.jobId);
      
      return new FieldInstallationModel(updatedInstallation);
    } catch (error) {
      console.error(`Error updating field installation status for ID ${id}:`, error);
      throw new Error('Failed to update field installation status');
    }
  }
  
  /**
   * Field Piece Management
   */
  async getFieldPieces(filters = {}) {
    try {
      const { installationId, status, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { pieceNumber: { contains: search, mode: 'insensitive' } },
          { pieceType: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const pieces = await prisma.fieldPiece.findMany({
        where: whereClause,
        orderBy: { pieceNumber: 'asc' },
        include: {
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return pieces.map(piece => new FieldPieceModel(piece));
    } catch (error) {
      console.error('Error fetching field pieces:', error);
      throw new Error('Failed to fetch field pieces');
    }
  }
  
  async updatePieceStatus(id, status, notes, userId) {
    try {
      const piece = await prisma.fieldPiece.findUnique({
        where: { id },
        include: {
          installation: true
        }
      });
      
      if (!piece) {
        throw new Error('Field piece not found');
      }
      
      // Determine date field to update based on status
      let dateUpdate = {};
      if (status === 'DELIVERED') {
        dateUpdate = { deliveryDate: new Date() };
      } else if (status === 'INSTALLED') {
        dateUpdate = { installationDate: new Date() };
      } else if (status === 'COMPLETED') {
        dateUpdate = { completionDate: new Date() };
      }
      
      // Update piece
      const updatedPiece = await prisma.fieldPiece.update({
        where: { id },
        data: {
          status,
          ...dateUpdate,
          installationNotes: notes ? `${piece.installationNotes || ''}\n${notes}` : piece.installationNotes,
          installedBy: status === 'INSTALLED' ? userId : piece.installedBy,
          updatedAt: new Date()
        }
      });
      
      // Update installation progress
      await this.updateInstallationProgress(piece.installationId);
      
      // If piece status is REWORK_NEEDED, create an issue
      if (status === 'REWORK_NEEDED' && notes) {
        await prisma.fieldIssue.create({
          data: {
            installationId: piece.installationId,
            pieceId: piece.id,
            pieceNumber: piece.pieceNumber,
            title: `Rework needed for piece ${piece.pieceNumber}`,
            description: notes,
            type: 'DISCREPANCY',
            severity: 'MEDIUM',
            status: 'OPEN',
            reportedBy: userId,
            reportedAt: new Date()
          }
        });
      }
      
      // Update yard and shipping status if needed
      if (status === 'DELIVERED' || status === 'INSTALLED') {
        await this.updateYardAndShippingStatus(piece.pieceId, status);
      }
      
      return new FieldPieceModel(updatedPiece);
    } catch (error) {
      console.error(`Error updating field piece status for ID ${id}:`, error);
      throw new Error('Failed to update field piece status');
    }
  }
  
  /**
   * Field Issue Management
   */
  async getFieldIssues(filters = {}) {
    try {
      const { installationId, pieceId, status, type, severity, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (pieceId) whereClause.pieceId = pieceId;
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (severity) whereClause.severity = severity;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { pieceNumber: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const issues = await prisma.fieldIssue.findMany({
        where: whereClause,
        orderBy: [
          { severity: 'desc' },
          { reportedAt: 'desc' }
        ],
        include: {
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return issues.map(issue => new FieldIssueModel(issue));
    } catch (error) {
      console.error('Error fetching field issues:', error);
      throw new Error('Failed to fetch field issues');
    }
  }
  
  async createFieldIssue(issueData) {
    try {
      // Validate installation exists
      const installation = await prisma.fieldInstallation.findUnique({
        where: { id: issueData.installationId }
      });
      
      if (!installation) {
        throw new Error('Field installation not found');
      }
      
      // Create issue
      const issue = await prisma.fieldIssue.create({
        data: {
          installationId: issueData.installationId,
          pieceId: issueData.pieceId,
          pieceNumber: issueData.pieceNumber,
          title: issueData.title,
          description: issueData.description,
          type: issueData.type,
          severity: issueData.severity || 'MEDIUM',
          status: issueData.status || 'OPEN',
          reportedBy: issueData.reportedBy,
          reportedAt: new Date(),
          assignedTo: issueData.assignedTo,
          dueDate: issueData.dueDate ? new Date(issueData.dueDate) : null,
          impactOnSchedule: issueData.impactOnSchedule || 'NONE',
          delayEstimate: issueData.delayEstimate || 0,
          costImpact: issueData.costImpact || 0,
          photos: issueData.photos || [],
          relatedDocuments: issueData.relatedDocuments || [],
          comments: issueData.comments || []
        }
      });
      
      // If issue is related to a piece, update piece status if needed
      if (issue.pieceId && issue.severity === 'HIGH' || issue.severity === 'CRITICAL') {
        await prisma.fieldPiece.update({
          where: { id: issue.pieceId },
          data: {
            status: 'REWORK_NEEDED',
            updatedAt: new Date()
          }
        });
      }
      
      // Notify relevant parties about new issue
      await this.notifyNewIssue(issue);
      
      return new FieldIssueModel(issue);
    } catch (error) {
      console.error('Error creating field issue:', error);
      throw new Error('Failed to create field issue');
    }
  }
  
  async updateIssueStatus(id, status, resolution, userId) {
    try {
      const issue = await prisma.fieldIssue.findUnique({
        where: { id }
      });
      
      if (!issue) {
        throw new Error('Field issue not found');
      }
      
      // Update issue
      const updatedIssue = await prisma.fieldIssue.update({
        where: { id },
        data: {
          status,
          resolution: resolution || issue.resolution,
          resolvedBy: status === 'RESOLVED' || status === 'CLOSED' ? userId : issue.resolvedBy,
          resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : issue.resolvedAt,
          comments: [
            ...(issue.comments || []),
            {
              userId,
              timestamp: new Date(),
              content: `Status updated to ${status}${resolution ? `: ${resolution}` : ''}`,
              action: 'STATUS_UPDATE'
            }
          ],
          updatedAt: new Date()
        }
      });
      
      // If issue is resolved and related to a piece, update piece status if needed
      if ((status === 'RESOLVED' || status === 'CLOSED') && issue.pieceId) {
        const piece = await prisma.fieldPiece.findUnique({
          where: { id: issue.pieceId }
        });
        
        if (piece && piece.status === 'REWORK_NEEDED') {
          await prisma.fieldPiece.update({
            where: { id: issue.pieceId },
            data: {
              status: 'INSTALLED',
              updatedAt: new Date()
            }
          });
        }
      }
      
      return new FieldIssueModel(updatedIssue);
    } catch (error) {
      console.error(`Error updating field issue status for ID ${id}:`, error);
      throw new Error('Failed to update field issue status');
    }
  }
  
  /**
   * Field Task Management
   */
  async getFieldTasks(filters = {}) {
    try {
      const { installationId, status, type, priority, assignedTo, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (priority) whereClause.priority = priority;
      if (assignedTo) whereClause.assignedTo = { has: assignedTo };
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const tasks = await prisma.fieldTask.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' }
        ],
        include: {
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return tasks.map(task => new FieldTaskModel(task));
    } catch (error) {
      console.error('Error fetching field tasks:', error);
      throw new Error('Failed to fetch field tasks');
    }
  }
  
  async createFieldTask(taskData) {
    try {
      // Validate installation exists
      const installation = await prisma.fieldInstallation.findUnique({
        where: { id: taskData.installationId }
      });
      
      if (!installation) {
        throw new Error('Field installation not found');
      }
      
      // Create task
      const task = await prisma.fieldTask.create({
        data: {
          installationId: taskData.installationId,
          title: taskData.title,
          description: taskData.description,
          type: taskData.type,
          status: taskData.status || 'PENDING',
          priority: taskData.priority || 'MEDIUM',
          assignedTo: taskData.assignedTo || [],
          startDate: taskData.startDate ? new Date(taskData.startDate) : null,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          estimatedHours: taskData.estimatedHours || 0,
          dependencies: taskData.dependencies || [],
          checklistItems: taskData.checklistItems || [],
          notes: taskData.notes,
          attachments: taskData.attachments || [],
          createdBy: taskData.createdBy
        }
      });
      
      // Notify assigned crew members
      if (task.assignedTo && task.assignedTo.length > 0) {
        await this.notifyTaskAssignment(task);
      }
      
      return new FieldTaskModel(task);
    } catch (error) {
      console.error('Error creating field task:', error);
      throw new Error('Failed to create field task');
    }
  }
  
  async completeFieldTask(id, actualHours, notes, userId) {
    try {
      const task = await prisma.fieldTask.findUnique({
        where: { id }
      });
      
      if (!task) {
        throw new Error('Field task not found');
      }
      
      if (task.status === 'COMPLETED') {
        throw new Error('Task is already completed');
      }
      
      // Update task
      const updatedTask = await prisma.fieldTask.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedDate: new Date(),
          completedBy: userId,
          actualHours: actualHours || task.actualHours,
          notes: notes ? `${task.notes || ''}\n${notes}` : task.notes,
          updatedAt: new Date()
        }
      });
      
      // Check if all tasks are completed for this installation
      const pendingTasks = await prisma.fieldTask.count({
        where: {
          installationId: task.installationId,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      });
      
      if (pendingTasks === 0) {
        // Update installation progress
        await this.updateInstallationProgress(task.installationId);
      }
      
      return new FieldTaskModel(updatedTask);
    } catch (error) {
      console.error(`Error completing field task for ID ${id}:`, error);
      throw new Error('Failed to complete field task');
    }
  }
  
  /**
   * Field Checklist Management
   */
  async getFieldChecklists(filters = {}) {
    try {
      const { installationId, type, status, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const checklists = await prisma.fieldChecklist.findMany({
        where: whereClause,
        orderBy: { dueDate: 'asc' },
        include: {
          items: true,
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return checklists.map(checklist => new FieldChecklistModel({
        ...checklist,
        items: checklist.items.map(item => new FieldChecklistItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching field checklists:', error);
      throw new Error('Failed to fetch field checklists');
    }
  }
  
  async createFieldChecklist(checklistData) {
    try {
      // Validate installation exists
      const installation = await prisma.fieldInstallation.findUnique({
        where: { id: checklistData.installationId }
      });
      
      if (!installation) {
        throw new Error('Field installation not found');
      }
      
      // Create checklist
      const checklist = await prisma.fieldChecklist.create({
        data: {
          installationId: checklistData.installationId,
          type: checklistData.type,
          title: checklistData.title,
          description: checklistData.description,
          status: checklistData.status || 'PENDING',
          progress: checklistData.progress || 0,
          assignedTo: checklistData.assignedTo,
          dueDate: checklistData.dueDate ? new Date(checklistData.dueDate) : null,
          notes: checklistData.notes,
          attachments: checklistData.attachments || [],
          createdBy: checklistData.createdBy
        }
      });
      
      // Create checklist items
      if (checklistData.items && checklistData.items.length > 0) {
        const items = checklistData.items.map(item => ({
          checklistId: checklist.id,
          title: item.title,
          description: item.description,
          status: item.status || 'PENDING',
          isRequired: item.isRequired !== false,
          notes: item.notes
        }));
        
        await prisma.fieldChecklistItem.createMany({
          data: items
        });
      }
      
      // Get complete checklist with items
      const completeChecklist = await prisma.fieldChecklist.findUnique({
        where: { id: checklist.id },
        include: { items: true }
      });
      
      return new FieldChecklistModel({
        ...completeChecklist,
        items: completeChecklist.items.map(item => new FieldChecklistItemModel(item))
      });
    } catch (error) {
      console.error('Error creating field checklist:', error);
      throw new Error('Failed to create field checklist');
    }
  }
  
  async updateChecklistItemStatus(id, itemId, status, notes, photos, userId) {
    try {
      const checklistItem = await prisma.fieldChecklistItem.findFirst({
        where: {
          id: itemId,
          checklistId: id
        }
      });
      
      if (!checklistItem) {
        throw new Error('Checklist item not found');
      }
      
      // Update checklist item
      const updatedItem = await prisma.fieldChecklistItem.update({
        where: { id: itemId },
        data: {
          status,
          completedBy: status === 'COMPLETED' ? userId : checklistItem.completedBy,
          completedAt: status === 'COMPLETED' ? new Date() : checklistItem.completedAt,
          notes: notes ? `${checklistItem.notes || ''}\n${notes}` : checklistItem.notes,
          photos: photos ? [...(checklistItem.photos || []), ...photos] : checklistItem.photos,
          updatedAt: new Date()
        }
      });
      
      // Update checklist progress
      await this.updateChecklistProgress(id);
      
      return new FieldChecklistItemModel(updatedItem);
    } catch (error) {
      console.error(`Error updating checklist item status for ID ${itemId}:`, error);
      throw new Error('Failed to update checklist item status');
    }
  }
  
  /**
   * Field Daily Report Management
   */
  async getFieldDailyReports(filters = {}) {
    try {
      const { installationId, dateFrom, dateTo, status, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.date = {
          gte: dateFrom,
          lte: dateTo
        };
      }
      
      if (search) {
        whereClause.OR = [
          { workPerformed: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const dailyReports = await prisma.fieldDailyReport.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        include: {
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return dailyReports.map(report => new FieldDailyReportModel(report));
    } catch (error) {
      console.error('Error fetching field daily reports:', error);
      throw new Error('Failed to fetch field daily reports');
    }
  }
  
  async createFieldDailyReport(reportData) {
    try {
      // Validate installation exists
      const installation = await prisma.fieldInstallation.findUnique({
        where: { id: reportData.installationId }
      });
      
      if (!installation) {
        throw new Error('Field installation not found');
      }
      
      // Check if report already exists for this date
      const existingReport = await prisma.fieldDailyReport.findFirst({
        where: {
          installationId: reportData.installationId,
          date: reportData.date
        }
      });
      
      if (existingReport) {
        throw new Error('A daily report already exists for this date');
      }
      
      // Create daily report
      const dailyReport = await prisma.fieldDailyReport.create({
        data: {
          installationId: reportData.installationId,
          date: reportData.date,
          weather: reportData.weather,
          crewPresent: reportData.crewPresent || [],
          workPerformed: reportData.workPerformed,
          areasWorkedOn: reportData.areasWorkedOn || [],
          piecesInstalled: reportData.piecesInstalled || [],
          equipmentUsed: reportData.equipmentUsed || [],
          materialsUsed: reportData.materialsUsed || [],
          delays: reportData.delays || [],
          visitors: reportData.visitors || [],
          safetyIncidents: reportData.safetyIncidents || [],
          qualityIssues: reportData.qualityIssues || [],
          progressPhotos: reportData.progressPhotos || [],
          notes: reportData.notes,
          submittedBy: reportData.submittedBy,
          status: reportData.status || 'DRAFT'
        }
      });
      
      // If report is submitted, update submission info
      if (reportData.status === 'SUBMITTED') {
        await prisma.fieldDailyReport.update({
          where: { id: dailyReport.id },
          data: {
            submittedAt: new Date()
          }
        });
      }
      
      // Update pieces installed if any
      if (reportData.piecesInstalled && reportData.piecesInstalled.length > 0) {
        for (const pieceId of reportData.piecesInstalled) {
          await prisma.fieldPiece.updateMany({
            where: {
              id: pieceId,
              installationId: reportData.installationId
            },
            data: {
              status: 'INSTALLED',
              installationDate: new Date(),
              updatedAt: new Date()
            }
          });
        }
        
        // Update installation progress
        await this.updateInstallationProgress(reportData.installationId);
      }
      
      return new FieldDailyReportModel(dailyReport);
    } catch (error) {
      console.error('Error creating field daily report:', error);
      throw new Error('Failed to create field daily report');
    }
  }
  
  /**
   * Field Inspection Management
   */
  async getFieldInspections(filters = {}) {
    try {
      const { installationId, type, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.scheduledDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { inspectedBy: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const inspections = await prisma.fieldInspection.findMany({
        where: whereClause,
        orderBy: { scheduledDate: 'asc' },
        include: {
          items: true,
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return inspections.map(inspection => new FieldInspectionModel({
        ...inspection,
        items: inspection.items.map(item => new FieldInspectionItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching field inspections:', error);
      throw new Error('Failed to fetch field inspections');
    }
  }
  
  /**
   * Field Punch List Management
   */
  async getFieldPunchLists(filters = {}) {
    try {
      const { installationId, status, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const punchLists = await prisma.fieldPunchList.findMany({
        where: whereClause,
        orderBy: { dueDate: 'asc' },
        include: {
          items: true,
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return punchLists.map(punchList => new FieldPunchListModel({
        ...punchList,
        items: punchList.items.map(item => new FieldPunchListItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching field punch lists:', error);
      throw new Error('Failed to fetch field punch lists');
    }
  }
  
  /**
   * Field Warranty Claim Management
   */
  async getFieldWarrantyClaims(filters = {}) {
    try {
      const { installationId, jobId, status, claimType, severity, search } = filters;
      
      const whereClause = {};
      if (installationId) whereClause.installationId = installationId;
      if (jobId) whereClause.jobId = jobId;
      if (status) whereClause.status = status;
      if (claimType) whereClause.claimType = claimType;
      if (severity) whereClause.severity = severity;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { claimNumber: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const warrantyClaims = await prisma.fieldWarrantyClaim.findMany({
        where: whereClause,
        orderBy: [
          { severity: 'desc' },
          { reportedDate: 'desc' }
        ],
        include: {
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      return warrantyClaims.map(claim => new FieldWarrantyClaimModel(claim));
    } catch (error) {
      console.error('Error fetching field warranty claims:', error);
      throw new Error('Failed to fetch field warranty claims');
    }
  }
  
  /**
   * Field Services Dashboard
   */
  async getFieldServicesDashboardData() {
    try {
      const today = new Date();
      
      // Upcoming installations (next 30 days)
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const upcomingInstallations = await prisma.fieldInstallation.findMany({
        where: {
          scheduledDate: {
            gte: today,
            lte: thirtyDaysFromNow
          },
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
        },
        orderBy: { scheduledDate: 'asc' },
        take: 10,
        include: {
          job: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Active installations
      const activeInstallations = await prisma.fieldInstallation.findMany({
        where: {
          status: 'IN_PROGRESS'
        },
        orderBy: { updatedAt: 'desc' },
        take: 10
      });
      
      // Open issues
      const openIssues = await prisma.fieldIssue.findMany({
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS'] }
        },
        orderBy: [
          { severity: 'desc' },
          { reportedAt: 'desc' }
        ],
        take: 10,
        include: {
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      // Pending inspections
      const pendingInspections = await prisma.fieldInspection.findMany({
        where: {
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
        },
        orderBy: { scheduledDate: 'asc' },
        take: 10,
        include: {
          installation: {
            select: {
              jobName: true,
              location: true
            }
          }
        }
      });
      
      // Open punch list items
      const openPunchListItems = await prisma.fieldPunchListItem.findMany({
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS'] }
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' }
        ],
        take: 10,
        include: {
          punchList: {
            select: {
              title: true,
              installation: {
                select: {
                  jobName: true,
                  location: true
                }
              }
            }
          }
        }
      });
      
      // Installation progress by job
      const installationProgressByJob = await prisma.fieldInstallation.groupBy({
        by: ['jobId'],
        _avg: {
          progress: true
        },
        _count: {
          id: true
        },
        where: {
          status: { in: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'] }
        }
      });
      
      // Get job names for the progress data
      const jobIds = installationProgressByJob.map(item => item.jobId);
      const jobs = await prisma.job.findMany({
        where: {
          id: { in: jobIds }
        },
        select: {
          id: true,
          name: true
        }
      });
      
      const jobMap = jobs.reduce((map, job) => {
        map[job.id] = job.name;
        return map;
      }, {});
      
      const progressByJob = installationProgressByJob.map(item => ({
        jobId: item.jobId,
        jobName: jobMap[item.jobId] || 'Unknown Job',
        averageProgress: item._avg.progress,
        installationCount: item._count.id
      }));
      
      return {
        upcomingInstallations: upcomingInstallations.map(installation => new FieldInstallationModel({
          ...installation,
          jobName: installation.job?.name || ''
        })),
        activeInstallations: activeInstallations.map(installation => new FieldInstallationModel(installation)),
        openIssues: openIssues.map(issue => new FieldIssueModel(issue)),
        pendingInspections: pendingInspections.map(inspection => new FieldInspectionModel(inspection)),
        openPunchListItems: openPunchListItems.map(item => new FieldPunchListItemModel({
          ...item,
          punchListTitle: item.punchList?.title || '',
          jobName: item.punchList?.installation?.jobName || '',
          location: item.punchList?.installation?.location || ''
        })),
        progressByJob
      };
    } catch (error) {
      console.error('Error fetching field services dashboard data:', error);
      throw new Error('Failed to fetch field services dashboard data');
    }
  }
  
  /**
   * Helper Methods
   */
  async createDefaultChecklists(installationId) {
    try {
      // Create pre-installation checklist
      const preInstallationChecklist = await prisma.fieldChecklist.create({
        data: {
          installationId,
          type: 'PRE_INSTALLATION',
          title: 'Pre-Installation Checklist',
          description: 'Tasks to complete before installation begins',
          status: 'PENDING',
          progress: 0
        }
      });
      
      // Create pre-installation checklist items
      const preInstallationItems = [
        { title: 'Site access confirmed', description: 'Verify access to installation site' },
        { title: 'Safety hazards identified', description: 'Identify and document potential safety hazards' },
        { title: 'Required permits obtained', description: 'Confirm all necessary permits are in place' },
        { title: 'Utilities marked', description: 'Confirm utilities have been marked' },
        { title: 'Equipment and materials on site', description: 'Verify all required equipment and materials are on site' },
        { title: 'Crew briefed on installation plan', description: 'Ensure crew understands installation plan and responsibilities' }
      ];
      
      await prisma.fieldChecklistItem.createMany({
        data: preInstallationItems.map(item => ({
          checklistId: preInstallationChecklist.id,
          title: item.title,
          description: item.description,
          status: 'PENDING',
          isRequired: true
        }))
      });
      
      // Create installation checklist
      const installationChecklist = await prisma.fieldChecklist.create({
        data: {
          installationId,
          type: 'INSTALLATION',
          title: 'Installation Checklist',
          description: 'Tasks to complete during installation',
          status: 'PENDING',
          progress: 0
        }
      });
      
      // Create installation checklist items
      const installationItems = [
        { title: 'Foundation/support preparation complete', description: 'Verify foundation or support structure is ready' },
        { title: 'Piece placement verified', description: 'Confirm pieces are placed according to plans' },
        { title: 'Connections properly secured', description: 'Verify all connections are properly secured' },
        { title: 'Alignment and leveling verified', description: 'Confirm proper alignment and leveling' },
        { title: 'Required inspections scheduled', description: 'Schedule all required inspections' }
      ];
      
      await prisma.fieldChecklistItem.createMany({
        data: installationItems.map(item => ({
          checklistId: installationChecklist.id,
          title: item.title,
          description: item.description,
          status: 'PENDING',
          isRequired: true
        }))
      });
      
      // Create post-installation checklist
      const postInstallationChecklist = await prisma.fieldChecklist.create({
        data: {
          installationId,
          type: 'POST_INSTALLATION',
          title: 'Post-Installation Checklist',
          description: 'Tasks to complete after installation',
          status: 'PENDING',
          progress: 0
        }
      });
      
      // Create post-installation checklist items
      const postInstallationItems = [
        { title: 'Final inspection complete', description: 'Complete final inspection of installation' },
        { title: 'Site cleanup complete', description: 'Ensure site is clean and debris removed' },
        { title: 'Documentation complete', description: 'Complete all required documentation' },
        { title: 'Client walkthrough scheduled', description: 'Schedule walkthrough with client' },
        { title: 'Punch list created', description: 'Create punch list of any remaining items' }
      ];
      
      await prisma.fieldChecklistItem.createMany({
        data: postInstallationItems.map(item => ({
          checklistId: postInstallationChecklist.id,
          title: item.title,
          description: item.description,
          status: 'PENDING',
          isRequired: true
        }))
      });
      
      // Create safety checklist
      const safetyChecklist = await prisma.fieldChecklist.create({
        data: {
          installationId,
          type: 'SAFETY',
          title: 'Safety Checklist',
          description: 'Safety requirements for installation',
          status: 'PENDING',
          progress: 0
        }
      });
      
      // Create safety checklist items
      const safetyItems = [
        { title: 'PPE requirements reviewed', description: 'Review personal protective equipment requirements' },
        { title: 'Safety meeting conducted', description: 'Conduct safety meeting with crew' },
        { title: 'Emergency procedures reviewed', description: 'Review emergency procedures' },
        { title: 'First aid kit available', description: 'Confirm first aid kit is available and stocked' },
        { title: 'Fall protection in place', description: 'Verify fall protection is in place where required' }
      ];
      
      await prisma.fieldChecklistItem.createMany({
        data: safetyItems.map(item => ({
          checklistId: safetyChecklist.id,
          title: item.title,
          description: item.description,
          status: 'PENDING',
          isRequired: true
        }))
      });
      
      return true;
    } catch (error) {
      console.error(`Error creating default checklists for installation ${installationId}:`, error);
      throw new Error('Failed to create default checklists');
    }
  }
  
  async syncPiecesFromJob(installationId, jobId) {
    try {
      // Get pieces from job
      const pieces = await prisma.piece.findMany({
        where: {
          jobId,
          status: { in: ['APPROVED', 'PRODUCED', 'QC_PASSED', 'READY_FOR_SHIPPING'] }
        }
      });
      
      if (pieces.length === 0) {
        return [];
      }
      
      // Create field pieces
      const fieldPieces = pieces.map(piece => ({
        installationId,
        pieceId: piece.id,
        pieceNumber: piece.pieceNumber,
        pieceType: piece.pieceType,
        description: piece.description,
        status: 'PENDING',
        deliveryStatus: 'PENDING',
        dimensions: piece.dimensions,
        qcStatus: piece.qcStatus === 'PASSED' ? 'PASSED' : 'PENDING'
      }));
      
      await prisma.fieldPiece.createMany({
        data: fieldPieces
      });
      
      return fieldPieces;
    } catch (error) {
      console.error(`Error syncing pieces from job ${jobId} to installation ${installationId}:`, error);
      throw new Error('Failed to sync pieces from job');
    }
  }
  
  async updateInstallationProgress(installationId) {
    try {
      // Get all pieces for this installation
      const pieces = await prisma.fieldPiece.findMany({
        where: { installationId }
      });
      
      if (pieces.length === 0) {
        return;
      }
      
      // Calculate progress based on piece status
      const statusWeights = {
        PENDING: 0,
        DELIVERED: 0.25,
        STAGED: 0.5,
        INSTALLED: 0.9,
        COMPLETED: 1,
        REWORK_NEEDED: 0.75
      };
      
      let totalProgress = 0;
      pieces.forEach(piece => {
        totalProgress += statusWeights[piece.status] || 0;
      });
      
      const progress = Math.round((totalProgress / pieces.length) * 100);
      
      // Update installation progress
      await prisma.fieldInstallation.update({
        where: { id: installationId },
        data: {
          progress,
          updatedAt: new Date()
        }
      });
      
      // If progress is 100%, update status to COMPLETED
      if (progress === 100) {
        await prisma.fieldInstallation.update({
          where: { id: installationId },
          data: {
            status: 'COMPLETED',
            completedDate: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      return progress;
    } catch (error) {
      console.error(`Error updating installation progress for ${installationId}:`, error);
      throw new Error('Failed to update installation progress');
    }
  }
  
  async updateChecklistProgress(checklistId) {
    try {
      // Get all items for this checklist
      const items = await prisma.fieldChecklistItem.findMany({
        where: { checklistId }
      });
      
      if (items.length === 0) {
        return;
      }
      
      // Calculate progress based on item status
      const completedItems = items.filter(item => item.status === 'COMPLETED').length;
      const progress = Math.round((completedItems / items.length) * 100);
      
      // Determine overall status
      let status = 'PENDING';
      if (progress === 100) {
        status = 'COMPLETED';
      } else if (progress > 0) {
        status = 'IN_PROGRESS';
      }
      
      // Update checklist progress and status
      await prisma.fieldChecklist.update({
        where: { id: checklistId },
        data: {
          progress,
          status,
          completedDate: status === 'COMPLETED' ? new Date() : null,
          updatedAt: new Date()
        }
      });
      
      return progress;
    } catch (error) {
      console.error(`Error updating checklist progress for ${checklistId}:`, error);
      throw new Error('Failed to update checklist progress');
    }
  }
  
  async updateJobProgress(jobId) {
    try {
      // Get all installations for this job
      const installations = await prisma.fieldInstallation.findMany({
        where: { jobId }
      });
      
      if (installations.length === 0) {
        return;
      }
      
      // Calculate overall job progress based on installation progress
      let totalProgress = 0;
      installations.forEach(installation => {
        totalProgress += installation.progress || 0;
      });
      
      const progress = Math.round(totalProgress / installations.length);
      
      // Update job progress
      await prisma.job.update({
        where: { id: jobId },
        data: {
          fieldProgress: progress,
          updatedAt: new Date()
        }
      });
      
      return progress;
    } catch (error) {
      console.error(`Error updating job progress for ${jobId}:`, error);
      throw new Error('Failed to update job progress');
    }
  }
  
  async updateYardAndShippingStatus(pieceId, status) {
    try {
      // Update yard status
      if (status === 'DELIVERED') {
        await prisma.yardPiece.updateMany({
          where: { pieceId },
          data: {
            status: 'SHIPPED',
            updatedAt: new Date()
          }
        });
      }
      
      // Update shipping status
      if (status === 'DELIVERED') {
        await prisma.shippingItem.updateMany({
          where: { pieceId },
          data: {
            status: 'DELIVERED',
            deliveryDate: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Error updating yard and shipping status for piece ${pieceId}:`, error);
      // Don't throw error here, as this is a secondary operation
      return false;
    }
  }
  
  async notifyInstallationStatusChange(installation) {
    // This would typically send notifications to relevant parties
    console.log(`Installation ${installation.id} status changed to ${installation.status}`);
    return true;
  }
  
  async notifyNewIssue(issue) {
    // This would typically send notifications to relevant parties
    console.log(`New issue reported: ${issue.title}`);
    return true;
  }
  
  async notifyTaskAssignment(task) {
    // This would typically send notifications to assigned crew members
    console.log(`Task assigned: ${task.title}`);
    return true;
  }
}

export default new FieldServicesService();
