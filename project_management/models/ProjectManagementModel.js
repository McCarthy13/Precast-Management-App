/**
 * Project Management Module Models
 * Defines data models for the Project Management module
 */

// Project Model
export class ProjectModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.jobId = data.jobId || '';
    this.jobName = data.jobName || '';
    this.clientId = data.clientId || '';
    this.clientName = data.clientName || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.status = data.status || 'PLANNING'; // PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.startDate = data.startDate || null;
    this.targetCompletionDate = data.targetCompletionDate || null;
    this.actualCompletionDate = data.actualCompletionDate || null;
    this.progress = data.progress || 0; // 0-100%
    this.budget = data.budget || 0;
    this.actualCost = data.actualCost || 0;
    this.manager = data.manager || '';
    this.managerId = data.managerId || '';
    this.team = data.team || [];
    this.stakeholders = data.stakeholders || [];
    this.phases = data.phases || [];
    this.milestones = data.milestones || [];
    this.tasks = data.tasks || [];
    this.risks = data.risks || [];
    this.issues = data.issues || [];
    this.documents = data.documents || [];
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Phase Model
export class ProjectPhaseModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.order = data.order || 0;
    this.status = data.status || 'PENDING'; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    this.progress = data.progress || 0; // 0-100%
    this.startDate = data.startDate || null;
    this.targetCompletionDate = data.targetCompletionDate || null;
    this.actualCompletionDate = data.actualCompletionDate || null;
    this.dependencies = data.dependencies || [];
    this.milestones = data.milestones || [];
    this.tasks = data.tasks || [];
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Milestone Model
export class ProjectMilestoneModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.phaseId = data.phaseId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.dueDate = data.dueDate || null;
    this.completedDate = data.completedDate || null;
    this.status = data.status || 'PENDING'; // PENDING, COMPLETED, MISSED, RESCHEDULED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.deliverables = data.deliverables || [];
    this.dependencies = data.dependencies || [];
    this.assignedTo = data.assignedTo || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Task Model
export class ProjectTaskModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.phaseId = data.phaseId || '';
    this.milestoneId = data.milestoneId || '';
    this.parentTaskId = data.parentTaskId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.status = data.status || 'TODO'; // TODO, IN_PROGRESS, REVIEW, COMPLETED, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.complexity = data.complexity || 'MEDIUM'; // LOW, MEDIUM, HIGH
    this.startDate = data.startDate || null;
    this.dueDate = data.dueDate || null;
    this.completedDate = data.completedDate || null;
    this.estimatedHours = data.estimatedHours || 0;
    this.actualHours = data.actualHours || 0;
    this.progress = data.progress || 0; // 0-100%
    this.assignedTo = data.assignedTo || '';
    this.assignedToName = data.assignedToName || '';
    this.watchers = data.watchers || [];
    this.dependencies = data.dependencies || [];
    this.subtasks = data.subtasks || [];
    this.attachments = data.attachments || [];
    this.comments = data.comments || [];
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Risk Model
export class ProjectRiskModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.probability = data.probability || 'MEDIUM'; // LOW, MEDIUM, HIGH
    this.impact = data.impact || 'MEDIUM'; // LOW, MEDIUM, HIGH
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.status = data.status || 'IDENTIFIED'; // IDENTIFIED, ANALYZING, MITIGATING, MONITORING, CLOSED
    this.identifiedDate = data.identifiedDate || new Date().toISOString();
    this.identifiedBy = data.identifiedBy || '';
    this.owner = data.owner || '';
    this.ownerName = data.ownerName || '';
    this.mitigationPlan = data.mitigationPlan || '';
    this.contingencyPlan = data.contingencyPlan || '';
    this.triggers = data.triggers || '';
    this.relatedTasks = data.relatedTasks || [];
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Issue Model
export class ProjectIssueModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.reportedDate = data.reportedDate || new Date().toISOString();
    this.reportedBy = data.reportedBy || '';
    this.assignedTo = data.assignedTo || '';
    this.assignedToName = data.assignedToName || '';
    this.dueDate = data.dueDate || null;
    this.resolvedDate = data.resolvedDate || null;
    this.resolvedBy = data.resolvedBy || '';
    this.resolution = data.resolution || '';
    this.impactDescription = data.impactDescription || '';
    this.relatedTasks = data.relatedTasks || [];
    this.relatedRisks = data.relatedRisks || [];
    this.attachments = data.attachments || [];
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Team Member Model
export class ProjectTeamMemberModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.userId = data.userId || '';
    this.name = data.name || '';
    this.role = data.role || '';
    this.responsibilities = data.responsibilities || '';
    this.joinDate = data.joinDate || new Date().toISOString();
    this.endDate = data.endDate || null;
    this.allocation = data.allocation || 100; // Percentage of time allocated to project
    this.skills = data.skills || [];
    this.performance = data.performance || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Stakeholder Model
export class ProjectStakeholderModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.name = data.name || '';
    this.organization = data.organization || '';
    this.role = data.role || '';
    this.contactInfo = data.contactInfo || {
      email: '',
      phone: '',
      address: ''
    };
    this.influence = data.influence || 'MEDIUM'; // LOW, MEDIUM, HIGH
    this.interest = data.interest || 'MEDIUM'; // LOW, MEDIUM, HIGH
    this.expectations = data.expectations || '';
    this.communicationPreference = data.communicationPreference || '';
    this.communicationFrequency = data.communicationFrequency || '';
    this.lastCommunication = data.lastCommunication || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Document Model
export class ProjectDocumentModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // PLAN, REPORT, CONTRACT, SPECIFICATION, OTHER
    this.category = data.category || '';
    this.version = data.version || '1.0';
    this.status = data.status || 'DRAFT'; // DRAFT, REVIEW, APPROVED, OBSOLETE
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.uploadedBy = data.uploadedBy || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Change Request Model
export class ProjectChangeRequestModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // SCOPE, SCHEDULE, BUDGET, RESOURCE, OTHER
    this.status = data.status || 'SUBMITTED'; // SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, IMPLEMENTED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.requestedBy = data.requestedBy || '';
    this.requestedDate = data.requestedDate || new Date().toISOString();
    this.justification = data.justification || '';
    this.impactAnalysis = data.impactAnalysis || {
      scope: '',
      schedule: '',
      budget: '',
      quality: '',
      resources: '',
      risks: ''
    };
    this.estimatedCost = data.estimatedCost || 0;
    this.estimatedScheduleImpact = data.estimatedScheduleImpact || 0; // In days
    this.reviewedBy = data.reviewedBy || '';
    this.reviewDate = data.reviewDate || null;
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.implementationPlan = data.implementationPlan || '';
    this.implementationDate = data.implementationDate || null;
    this.attachments = data.attachments || [];
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Meeting Model
export class ProjectMeetingModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.type = data.type || ''; // STATUS, PLANNING, REVIEW, STAKEHOLDER, OTHER
    this.date = data.date || null;
    this.startTime = data.startTime || '';
    this.endTime = data.endTime || '';
    this.location = data.location || '';
    this.isVirtual = data.isVirtual || false;
    this.meetingLink = data.meetingLink || '';
    this.organizer = data.organizer || '';
    this.attendees = data.attendees || [];
    this.agenda = data.agenda || [];
    this.notes = data.notes || '';
    this.decisions = data.decisions || [];
    this.actionItems = data.actionItems || [];
    this.attachments = data.attachments || [];
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    this.minutesDocumentId = data.minutesDocumentId || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Action Item Model
export class ProjectActionItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.meetingId = data.meetingId || '';
    this.description = data.description || '';
    this.assignedTo = data.assignedTo || '';
    this.assignedToName = data.assignedToName || '';
    this.dueDate = data.dueDate || null;
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH
    this.completedDate = data.completedDate || null;
    this.completedBy = data.completedBy || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Budget Item Model
export class ProjectBudgetItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.category = data.category || '';
    this.description = data.description || '';
    this.type = data.type || 'EXPENSE'; // EXPENSE, INCOME
    this.estimatedAmount = data.estimatedAmount || 0;
    this.actualAmount = data.actualAmount || 0;
    this.variance = data.variance || 0;
    this.variancePercentage = data.variancePercentage || 0;
    this.status = data.status || 'PLANNED'; // PLANNED, COMMITTED, ACTUAL
    this.date = data.date || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Timesheet Model
export class ProjectTimesheetModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.userId = data.userId || '';
    this.userName = data.userName || '';
    this.role = data.role || '';
    this.weekStartDate = data.weekStartDate || '';
    this.weekEndDate = data.weekEndDate || '';
    this.status = data.status || 'DRAFT'; // DRAFT, SUBMITTED, APPROVED, REJECTED
    this.totalHours = data.totalHours || 0;
    this.entries = data.entries || [];
    this.submittedDate = data.submittedDate || null;
    this.approvedBy = data.approvedBy || '';
    this.approvedDate = data.approvedDate || null;
    this.rejectionReason = data.rejectionReason || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Timesheet Entry Model
export class ProjectTimesheetEntryModel {
  constructor(data) {
    this.id = data.id || '';
    this.timesheetId = data.timesheetId || '';
    this.projectId = data.projectId || '';
    this.taskId = data.taskId || '';
    this.taskName = data.taskName || '';
    this.date = data.date || '';
    this.hours = data.hours || 0;
    this.description = data.description || '';
    this.billable = data.billable || true;
    this.approved = data.approved || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Status Report Model
export class ProjectStatusReportModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.reportDate = data.reportDate || new Date().toISOString().split('T')[0];
    this.reportingPeriod = data.reportingPeriod || '';
    this.preparedBy = data.preparedBy || '';
    this.overallStatus = data.overallStatus || 'ON_TRACK'; // ON_TRACK, AT_RISK, OFF_TRACK
    this.scheduleStatus = data.scheduleStatus || 'ON_TRACK'; // ON_TRACK, AT_RISK, OFF_TRACK
    this.budgetStatus = data.budgetStatus || 'ON_TRACK'; // ON_TRACK, AT_RISK, OFF_TRACK
    this.scopeStatus = data.scopeStatus || 'ON_TRACK'; // ON_TRACK, AT_RISK, OFF_TRACK
    this.resourceStatus = data.resourceStatus || 'ON_TRACK'; // ON_TRACK, AT_RISK, OFF_TRACK
    this.executiveSummary = data.executiveSummary || '';
    this.accomplishments = data.accomplishments || [];
    this.plannedActivities = data.plannedActivities || [];
    this.issues = data.issues || [];
    this.risks = data.risks || [];
    this.decisions = data.decisions || [];
    this.metrics = data.metrics || {
      progressPlanned: 0,
      progressActual: 0,
      costPlanned: 0,
      costActual: 0,
      milestonesPlanned: 0,
      milestonesCompleted: 0
    };
    this.attachments = data.attachments || [];
    this.distributionList = data.distributionList || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Project Lesson Learned Model
export class ProjectLessonLearnedModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.category = data.category || '';
    this.description = data.description || '';
    this.impact = data.impact || '';
    this.rootCause = data.rootCause || '';
    this.recommendation = data.recommendation || '';
    this.phase = data.phase || '';
    this.identifiedBy = data.identifiedBy || '';
    this.identifiedDate = data.identifiedDate || new Date().toISOString();
    this.status = data.status || 'DOCUMENTED'; // DOCUMENTED, REVIEWED, IMPLEMENTED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
