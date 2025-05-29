/**
 * Field Services Module Models
 * Defines data models for the Field Services module
 */

// Field Installation Model
export class FieldInstallationModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.jobName = data.jobName || '';
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.location = data.location || '';
    this.scheduledDate = data.scheduledDate || null;
    this.completedDate = data.completedDate || null;
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, IN_PROGRESS, COMPLETED, DELAYED, CANCELLED
    this.progress = data.progress || 0; // 0-100%
    this.crew = data.crew || [];
    this.supervisor = data.supervisor || '';
    this.supervisorId = data.supervisorId || '';
    this.clientContact = data.clientContact || '';
    this.clientContactId = data.clientContactId || '';
    this.generalContractor = data.generalContractor || '';
    this.generalContractorId = data.generalContractorId || '';
    this.pieces = data.pieces || [];
    this.equipment = data.equipment || [];
    this.materials = data.materials || [];
    this.weatherConditions = data.weatherConditions || '';
    this.notes = data.notes || '';
    this.photos = data.photos || [];
    this.documents = data.documents || [];
    this.issues = data.issues || [];
    this.safetyIncidents = data.safetyIncidents || [];
    this.qualityChecks = data.qualityChecks || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Piece Status Model
export class FieldPieceModel {
  constructor(data) {
    this.id = data.id || '';
    this.pieceId = data.pieceId || '';
    this.pieceNumber = data.pieceNumber || '';
    this.pieceType = data.pieceType || '';
    this.description = data.description || '';
    this.installationId = data.installationId || '';
    this.status = data.status || 'PENDING'; // PENDING, DELIVERED, STAGED, INSTALLED, REWORK_NEEDED, COMPLETED
    this.deliveryStatus = data.deliveryStatus || 'PENDING'; // PENDING, IN_TRANSIT, DELIVERED, REJECTED
    this.deliveryDate = data.deliveryDate || null;
    this.installationDate = data.installationDate || null;
    this.completionDate = data.completionDate || null;
    this.location = data.location || '';
    this.position = data.position || {
      x: 0,
      y: 0,
      z: 0,
      rotation: 0
    };
    this.dimensions = data.dimensions || {
      length: 0,
      width: 0,
      height: 0,
      weight: 0
    };
    this.qcStatus = data.qcStatus || 'PENDING'; // PENDING, PASSED, FAILED, CONDITIONALLY_APPROVED
    this.qcNotes = data.qcNotes || '';
    this.installationNotes = data.installationNotes || '';
    this.issues = data.issues || [];
    this.photos = data.photos || [];
    this.installedBy = data.installedBy || '';
    this.inspectedBy = data.inspectedBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Issue Model
export class FieldIssueModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.pieceId = data.pieceId || '';
    this.pieceNumber = data.pieceNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // DAMAGE, DISCREPANCY, MISSING_PIECE, SITE_CONDITION, SAFETY, OTHER
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    this.reportedBy = data.reportedBy || '';
    this.reportedAt = data.reportedAt || new Date().toISOString();
    this.assignedTo = data.assignedTo || '';
    this.dueDate = data.dueDate || null;
    this.resolvedBy = data.resolvedBy || '';
    this.resolvedAt = data.resolvedAt || null;
    this.resolution = data.resolution || '';
    this.impactOnSchedule = data.impactOnSchedule || 'NONE'; // NONE, MINOR, MODERATE, MAJOR
    this.delayEstimate = data.delayEstimate || 0; // In hours
    this.costImpact = data.costImpact || 0;
    this.photos = data.photos || [];
    this.relatedDocuments = data.relatedDocuments || [];
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Task Model
export class FieldTaskModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // PREPARATION, INSTALLATION, INSPECTION, CLEANUP, OTHER
    this.status = data.status || 'PENDING'; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.assignedTo = data.assignedTo || [];
    this.startDate = data.startDate || null;
    this.dueDate = data.dueDate || null;
    this.completedDate = data.completedDate || null;
    this.completedBy = data.completedBy || '';
    this.estimatedHours = data.estimatedHours || 0;
    this.actualHours = data.actualHours || 0;
    this.dependencies = data.dependencies || [];
    this.checklistItems = data.checklistItems || [];
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Checklist Model
export class FieldChecklistModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.type = data.type || ''; // PRE_INSTALLATION, INSTALLATION, POST_INSTALLATION, SAFETY, QUALITY, PUNCH_LIST
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'PENDING'; // PENDING, IN_PROGRESS, COMPLETED
    this.progress = data.progress || 0; // 0-100%
    this.assignedTo = data.assignedTo || '';
    this.dueDate = data.dueDate || null;
    this.completedDate = data.completedDate || null;
    this.completedBy = data.completedBy || '';
    this.items = data.items || [];
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Checklist Item Model
export class FieldChecklistItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.checklistId = data.checklistId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'PENDING'; // PENDING, COMPLETED, FAILED, NOT_APPLICABLE
    this.isRequired = data.isRequired !== false;
    this.completedBy = data.completedBy || '';
    this.completedAt = data.completedAt || null;
    this.notes = data.notes || '';
    this.photos = data.photos || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Equipment Model
export class FieldEquipmentModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.name = data.name || '';
    this.type = data.type || '';
    this.description = data.description || '';
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, ON_SITE, IN_USE, RETURNED, DAMAGED
    this.rentalInfo = data.rentalInfo || {
      isRental: false,
      vendor: '',
      rentalStart: null,
      rentalEnd: null,
      cost: 0
    };
    this.operator = data.operator || '';
    this.scheduledArrival = data.scheduledArrival || null;
    this.actualArrival = data.actualArrival || null;
    this.scheduledDeparture = data.scheduledDeparture || null;
    this.actualDeparture = data.actualDeparture || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Material Model
export class FieldMaterialModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.name = data.name || '';
    this.type = data.type || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 0;
    this.unit = data.unit || '';
    this.status = data.status || 'ORDERED'; // ORDERED, DELIVERED, IN_USE, DEPLETED
    this.supplier = data.supplier || '';
    this.orderNumber = data.orderNumber || '';
    this.orderDate = data.orderDate || null;
    this.deliveryDate = data.deliveryDate || null;
    this.cost = data.cost || 0;
    this.location = data.location || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Crew Member Model
export class FieldCrewMemberModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.employeeId = data.employeeId || '';
    this.name = data.name || '';
    this.role = data.role || '';
    this.specialties = data.specialties || [];
    this.certifications = data.certifications || [];
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, ON_SITE, ACTIVE, COMPLETED, ABSENT
    this.scheduledHours = data.scheduledHours || 0;
    this.actualHours = data.actualHours || 0;
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Safety Incident Model
export class FieldSafetyIncidentModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // NEAR_MISS, INJURY, PROPERTY_DAMAGE, ENVIRONMENTAL, OTHER
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.location = data.location || '';
    this.date = data.date || new Date().toISOString();
    this.time = data.time || '';
    this.reportedBy = data.reportedBy || '';
    this.witnesses = data.witnesses || [];
    this.involvedPersons = data.involvedPersons || [];
    this.immediateActions = data.immediateActions || '';
    this.rootCause = data.rootCause || '';
    this.correctiveActions = data.correctiveActions || [];
    this.status = data.status || 'REPORTED'; // REPORTED, INVESTIGATING, RESOLVED, CLOSED
    this.reportSubmitted = data.reportSubmitted || false;
    this.reportNumber = data.reportNumber || '';
    this.photos = data.photos || [];
    this.documents = data.documents || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Daily Report Model
export class FieldDailyReportModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.weather = data.weather || {
      conditions: '',
      temperature: '',
      precipitation: '',
      windSpeed: '',
      notes: ''
    };
    this.crewPresent = data.crewPresent || [];
    this.workPerformed = data.workPerformed || '';
    this.areasWorkedOn = data.areasWorkedOn || [];
    this.piecesInstalled = data.piecesInstalled || [];
    this.equipmentUsed = data.equipmentUsed || [];
    this.materialsUsed = data.materialsUsed || [];
    this.delays = data.delays || [];
    this.visitors = data.visitors || [];
    this.safetyIncidents = data.safetyIncidents || [];
    this.qualityIssues = data.qualityIssues || [];
    this.progressPhotos = data.progressPhotos || [];
    this.notes = data.notes || '';
    this.submittedBy = data.submittedBy || '';
    this.submittedAt = data.submittedAt || null;
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.status = data.status || 'DRAFT'; // DRAFT, SUBMITTED, APPROVED, REJECTED
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Inspection Model
export class FieldInspectionModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.type = data.type || ''; // PRE_INSTALLATION, PROGRESS, FINAL, SPECIAL
    this.title = data.title || '';
    this.description = data.description || '';
    this.inspectedBy = data.inspectedBy || '';
    this.inspectorId = data.inspectorId || '';
    this.inspectorType = data.inspectorType || 'INTERNAL'; // INTERNAL, CLIENT, THIRD_PARTY, REGULATORY
    this.scheduledDate = data.scheduledDate || null;
    this.completedDate = data.completedDate || null;
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, IN_PROGRESS, PASSED, FAILED, CONDITIONALLY_PASSED
    this.result = data.result || '';
    this.areas = data.areas || [];
    this.items = data.items || [];
    this.deficiencies = data.deficiencies || [];
    this.followUpRequired = data.followUpRequired || false;
    this.followUpDate = data.followUpDate || null;
    this.photos = data.photos || [];
    this.documents = data.documents || [];
    this.notes = data.notes || '';
    this.signature = data.signature || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Inspection Item Model
export class FieldInspectionItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.inspectionId = data.inspectionId || '';
    this.category = data.category || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'PENDING'; // PENDING, PASSED, FAILED, NOT_APPLICABLE
    this.severity = data.severity || 'NORMAL'; // MINOR, NORMAL, MAJOR, CRITICAL
    this.notes = data.notes || '';
    this.photos = data.photos || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Punch List Model
export class FieldPunchListModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, COMPLETED
    this.progress = data.progress || 0; // 0-100%
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.dueDate = data.dueDate || null;
    this.completedDate = data.completedDate || null;
    this.items = data.items || [];
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Punch List Item Model
export class FieldPunchListItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.punchListId = data.punchListId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.location = data.location || '';
    this.category = data.category || '';
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, COMPLETED
    this.assignedTo = data.assignedTo || '';
    this.dueDate = data.dueDate || null;
    this.completedDate = data.completedDate || null;
    this.completedBy = data.completedBy || '';
    this.verifiedBy = data.verifiedBy || '';
    this.verifiedDate = data.verifiedDate || null;
    this.photos = data.photos || [];
    this.beforePhotos = data.beforePhotos || [];
    this.afterPhotos = data.afterPhotos || [];
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Handover Model
export class FieldHandoverModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.scheduledDate = data.scheduledDate || null;
    this.completedDate = data.completedDate || null;
    this.status = data.status || 'PENDING'; // PENDING, IN_PROGRESS, COMPLETED
    this.clientRepresentative = data.clientRepresentative || '';
    this.clientRepresentativeId = data.clientRepresentativeId || '';
    this.companyRepresentative = data.companyRepresentative || '';
    this.companyRepresentativeId = data.companyRepresentativeId || '';
    this.attendees = data.attendees || [];
    this.checklistCompleted = data.checklistCompleted || false;
    this.punchListCompleted = data.punchListCompleted || false;
    this.documentsProvided = data.documentsProvided || [];
    this.trainingProvided = data.trainingProvided || [];
    this.clientSignature = data.clientSignature || '';
    this.companySignature = data.companySignature || '';
    this.notes = data.notes || '';
    this.photos = data.photos || [];
    this.documents = data.documents || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Field Warranty Claim Model
export class FieldWarrantyClaimModel {
  constructor(data) {
    this.id = data.id || '';
    this.installationId = data.installationId || '';
    this.jobId = data.jobId || '';
    this.jobName = data.jobName || '';
    this.claimNumber = data.claimNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.reportedBy = data.reportedBy || '';
    this.reportedDate = data.reportedDate || new Date().toISOString();
    this.claimType = data.claimType || ''; // STRUCTURAL, COSMETIC, WATER_INTRUSION, OTHER
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.status = data.status || 'REPORTED'; // REPORTED, INVESTIGATING, APPROVED, REJECTED, IN_PROGRESS, COMPLETED
    this.assignedTo = data.assignedTo || '';
    this.scheduledDate = data.scheduledDate || null;
    this.completedDate = data.completedDate || null;
    this.location = data.location || '';
    this.affectedPieces = data.affectedPieces || [];
    this.rootCause = data.rootCause || '';
    this.resolution = data.resolution || '';
    this.cost = data.cost || 0;
    this.laborHours = data.laborHours || 0;
    this.photos = data.photos || [];
    this.documents = data.documents || [];
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
