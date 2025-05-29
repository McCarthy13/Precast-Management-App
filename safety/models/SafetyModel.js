/**
 * Safety Module Models
 * Defines data structures for the Safety module
 */

// JSA (Job Safety Analysis) Model
export class JSAModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.taskDescription = data.taskDescription || '';
    this.hazards = data.hazards || [];
    this.controls = data.controls || [];
    this.requiredPPE = data.requiredPPE || [];
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.lastReviewDate = data.lastReviewDate || null;
    this.nextReviewDate = data.nextReviewDate || null;
    this.relatedJobs = data.relatedJobs || [];
    this.attachments = data.attachments || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// OSHA Regulation Model
export class RegulationModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.code = data.code || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.fullText = data.fullText || '';
    this.category = data.category || '';
    this.subcategory = data.subcategory || '';
    this.applicableAreas = data.applicableAreas || [];
    this.attachments = data.attachments || [];
    this.links = data.links || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Personnel Certification Model
export class CertificationModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.certificationType = data.certificationType || '';
    this.certificationNumber = data.certificationNumber || '';
    this.issuingAuthority = data.issuingAuthority || '';
    this.issueDate = data.issueDate || null;
    this.expirationDate = data.expirationDate || null;
    this.status = data.status || 'Active'; // Active, Expired, Pending
    this.attachments = data.attachments || [];
    this.notes = data.notes || '';
    this.reminderSent = data.reminderSent || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// PPE (Personal Protective Equipment) Model
export class PPEModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.category = data.category || '';
    this.description = data.description || '';
    this.specifications = data.specifications || '';
    this.requiredFor = data.requiredFor || []; // List of job types/tasks
    this.replacementCriteria = data.replacementCriteria || '';
    this.issuePeriod = data.issuePeriod || 0; // In days
    this.reimbursementEligible = data.reimbursementEligible || false;
    this.reimbursementAmount = data.reimbursementAmount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// PPE Issuance Model
export class PPEIssuanceModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.ppeId = data.ppeId || '';
    this.ppeName = data.ppeName || '';
    this.issueDate = data.issueDate || new Date();
    this.quantity = data.quantity || 1;
    this.issuedBy = data.issuedBy || '';
    this.acknowledgedBy = data.acknowledgedBy || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// PPE Reimbursement Model
export class PPEReimbursementModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.ppeId = data.ppeId || '';
    this.ppeName = data.ppeName || '';
    this.requestDate = data.requestDate || new Date();
    this.purchaseDate = data.purchaseDate || null;
    this.amount = data.amount || 0;
    this.receiptAttachment = data.receiptAttachment || '';
    this.status = data.status || 'Pending'; // Pending, Approved, Rejected
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Worker's Comp Claim Model
export class WorkersCompModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.claimNumber = data.claimNumber || '';
    this.incidentDate = data.incidentDate || null;
    this.reportDate = data.reportDate || new Date();
    this.incidentDescription = data.incidentDescription || '';
    this.injuryType = data.injuryType || '';
    this.bodyPartAffected = data.bodyPartAffected || '';
    this.witnesses = data.witnesses || [];
    this.medicalProvider = data.medicalProvider || '';
    this.status = data.status || 'Open'; // Open, Closed, Disputed
    this.attachments = data.attachments || [];
    this.restrictedWork = data.restrictedWork || false;
    this.restrictionDetails = data.restrictionDetails || '';
    this.followUpDate = data.followUpDate || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Toolbox Talk Model
export class ToolboxTalkModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.topic = data.topic || '';
    this.content = data.content || '';
    this.duration = data.duration || 15; // In minutes
    this.scheduledDate = data.scheduledDate || null;
    this.conductedDate = data.conductedDate || null;
    this.conductor = data.conductor || '';
    this.attendees = data.attendees || [];
    this.attachments = data.attachments || [];
    this.notes = data.notes || '';
    this.status = data.status || 'Scheduled'; // Scheduled, Completed, Cancelled
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Safety Training Model
export class SafetyTrainingModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.frequency = data.frequency || 'Annual'; // Annual, Biannual, Quarterly, One-time
    this.duration = data.duration || 0; // In minutes
    this.requiredFor = data.requiredFor || []; // List of job roles
    this.materials = data.materials || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Employee Training Record Model
export class TrainingRecordModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.trainingId = data.trainingId || '';
    this.trainingTitle = data.trainingTitle || '';
    this.completionDate = data.completionDate || null;
    this.expirationDate = data.expirationDate || null;
    this.instructor = data.instructor || '';
    this.score = data.score || null;
    this.passed = data.passed || false;
    this.attachments = data.attachments || [];
    this.notes = data.notes || '';
    this.reminderSent = data.reminderSent || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
