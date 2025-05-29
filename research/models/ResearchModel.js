/**
 * Research & Development (R&D) Models
 * Defines data models for the R&D module
 */

// R&D Project Model
export class RDProjectModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.objective = data.objective || '';
    this.status = data.status || 'PLANNING'; // PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || null;
    this.leadResearcher = data.leadResearcher || '';
    this.team = data.team || [];
    this.budget = data.budget || 0;
    this.actualCost = data.actualCost || 0;
    this.experiments = data.experiments || [];
    this.documents = data.documents || [];
    this.tags = data.tags || [];
    this.outcomes = data.outcomes || [];
    this.nextSteps = data.nextSteps || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Experiment Model
export class ExperimentModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.hypothesis = data.hypothesis || '';
    this.methodology = data.methodology || '';
    this.variables = data.variables || [];
    this.status = data.status || 'PLANNED'; // PLANNED, IN_PROGRESS, COMPLETED, FAILED, INCONCLUSIVE
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || null;
    this.conductedBy = data.conductedBy || '';
    this.results = data.results || '';
    this.conclusion = data.conclusion || '';
    this.documents = data.documents || [];
    this.photos = data.photos || [];
    this.nextSteps = data.nextSteps || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Research Document Model
export class ResearchDocumentModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.experimentId = data.experimentId || '';
    this.title = data.title || '';
    this.type = data.type || ''; // RESEARCH_PAPER, TEST_RESULT, PHOTO, INNOVATION_IDEA, etc.
    this.description = data.description || '';
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.version = data.version || 1;
    this.previousVersions = data.previousVersions || [];
    this.tags = data.tags || [];
    this.uploadedBy = data.uploadedBy || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Research Task Model
export class ResearchTaskModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.experimentId = data.experimentId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'TODO'; // TODO, IN_PROGRESS, REVIEW, COMPLETED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.assignedTo = data.assignedTo || '';
    this.dueDate = data.dueDate || '';
    this.completedDate = data.completedDate || null;
    this.comments = data.comments || [];
    this.attachments = data.attachments || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Research Outcome Model
export class ResearchOutcomeModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // PROCESS_IMPROVEMENT, NEW_PRODUCT, COST_REDUCTION, etc.
    this.impact = data.impact || '';
    this.estimatedValue = data.estimatedValue || 0;
    this.implementationStatus = data.implementationStatus || 'PENDING'; // PENDING, IN_PROGRESS, IMPLEMENTED, REJECTED
    this.implementationDate = data.implementationDate || null;
    this.implementedBy = data.implementedBy || '';
    this.relatedModules = data.relatedModules || []; // PRODUCTION, QC, PURCHASING, etc.
    this.documents = data.documents || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Meeting Model
export class MeetingModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.type = data.type || ''; // KICKOFF, REVIEW, MILESTONE, BRAINSTORMING, etc.
    this.date = data.date || '';
    this.startTime = data.startTime || '';
    this.endTime = data.endTime || '';
    this.location = data.location || '';
    this.organizer = data.organizer || '';
    this.attendees = data.attendees || [];
    this.agenda = data.agenda || '';
    this.notes = data.notes || '';
    this.actionItems = data.actionItems || [];
    this.documents = data.documents || [];
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, COMPLETED, CANCELLED, POSTPONED
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
