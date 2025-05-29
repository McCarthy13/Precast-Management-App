/**
 * Jobs Module Models
 * Defines data models for the Jobs module
 */

// Job Model
export class JobModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobNumber = data.jobNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || 'PENDING'; // PENDING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.type = data.type || '';
    this.category = data.category || '';
    this.clientId = data.clientId || '';
    this.clientName = data.clientName || '';
    this.clientContactId = data.clientContactId || '';
    this.clientContactName = data.clientContactName || '';
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.contractNumber = data.contractNumber || '';
    this.contractValue = data.contractValue || 0;
    this.contractType = data.contractType || '';
    this.startDate = data.startDate || null;
    this.targetCompletionDate = data.targetCompletionDate || null;
    this.actualCompletionDate = data.actualCompletionDate || null;
    this.estimatedHours = data.estimatedHours || 0;
    this.actualHours = data.actualHours || 0;
    this.location = data.location || {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      coordinates: {
        latitude: null,
        longitude: null
      }
    };
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.assignedTo = data.assignedTo || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.completedBy = data.completedBy || '';
    this.completedAt = data.completedAt || null;
    this.cancelledBy = data.cancelledBy || '';
    this.cancelledAt = data.cancelledAt || null;
    this.cancellationReason = data.cancellationReason || '';
    
    // Job-specific fields
    this.generalContractor = data.generalContractor || {
      name: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    };
    this.architect = data.architect || {
      name: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    };
    this.engineer = data.engineer || {
      name: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    };
    this.finishDetails = data.finishDetails || {
      exteriorFinish: '',
      interiorFinish: '',
      specialFinishes: [],
      colorRequirements: '',
      textureRequirements: '',
      samples: []
    };
    this.deliveryInformation = data.deliveryInformation || {
      deliveryMethod: '',
      transportationProvider: '',
      specialRequirements: '',
      accessRestrictions: '',
      unloadingResponsibility: '',
      stagingArea: ''
    };
    this.keyDates = data.keyDates || {
      contractSignedDate: null,
      engineeringStartDate: null,
      engineeringCompletionDate: null,
      productionStartDate: null,
      productionCompletionDate: null,
      firstDeliveryDate: null,
      lastDeliveryDate: null,
      installationStartDate: null,
      installationCompletionDate: null,
      finalInspectionDate: null
    };
    this.budget = data.budget || {
      totalBudget: 0,
      engineeringBudget: 0,
      materialsBudget: 0,
      laborBudget: 0,
      equipmentBudget: 0,
      subcontractorBudget: 0,
      overheadBudget: 0,
      contingencyBudget: 0,
      actualCosts: {
        engineering: 0,
        materials: 0,
        labor: 0,
        equipment: 0,
        subcontractor: 0,
        overhead: 0,
        other: 0
      }
    };
    this.billingInfo = data.billingInfo || {
      billingTerms: '',
      billingCycle: '',
      billingContact: {
        name: '',
        email: '',
        phone: ''
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      invoices: []
    };
    this.documents = data.documents || [];
    this.drawings = data.drawings || [];
    this.permits = data.permits || [];
    this.inspections = data.inspections || [];
    this.meetings = data.meetings || [];
    this.risks = data.risks || [];
    this.issues = data.issues || [];
    this.changeOrders = data.changeOrders || [];
    this.subcontractors = data.subcontractors || [];
    this.pieces = data.pieces || [];
    this.communications = data.communications || [];
    this.qualityChecks = data.qualityChecks || [];
    this.safetyIncidents = data.safetyIncidents || [];
    this.photos = data.photos || [];
  }
}

// Job Piece Model
export class JobPieceModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.pieceNumber = data.pieceNumber || '';
    this.markNumber = data.markNumber || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.category = data.category || '';
    this.status = data.status || 'PLANNED'; // PLANNED, DESIGNED, APPROVED, IN_PRODUCTION, PRODUCED, QC_PASSED, QC_FAILED, STORED, SHIPPED, DELIVERED, INSTALLED, REWORK
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.dimensions = data.dimensions || {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      volume: 0
    };
    this.quantity = data.quantity || 1;
    this.unitOfMeasure = data.unitOfMeasure || '';
    this.location = data.location || {
      area: '',
      bay: '',
      row: '',
      stack: '',
      coordinates: {
        latitude: null,
        longitude: null
      }
    };
    this.finishDetails = data.finishDetails || {
      exteriorFinish: '',
      interiorFinish: '',
      specialFinishes: [],
      colorRequirements: '',
      textureRequirements: ''
    };
    this.materialRequirements = data.materialRequirements || {
      concreteType: '',
      reinforcement: '',
      embeds: [],
      inserts: [],
      specialMaterials: []
    };
    this.productionDetails = data.productionDetails || {
      plannedStartDate: null,
      plannedCompletionDate: null,
      actualStartDate: null,
      actualCompletionDate: null,
      moldId: '',
      moldName: '',
      castingBay: '',
      productionNotes: ''
    };
    this.qualityControl = data.qualityControl || {
      inspectionStatus: '',
      inspectionDate: null,
      inspectedBy: '',
      defects: [],
      repairStatus: '',
      repairDate: null,
      repairedBy: '',
      approvalStatus: '',
      approvalDate: null,
      approvedBy: '',
      notes: ''
    };
    this.shippingDetails = data.shippingDetails || {
      plannedShipDate: null,
      actualShipDate: null,
      loadNumber: '',
      truckNumber: '',
      deliveryStatus: '',
      deliveryDate: null,
      receivedBy: '',
      notes: ''
    };
    this.installationDetails = data.installationDetails || {
      plannedInstallDate: null,
      actualInstallDate: null,
      installedBy: '',
      inspectionStatus: '',
      inspectionDate: null,
      inspectedBy: '',
      notes: ''
    };
    this.drawings = data.drawings || [];
    this.photos = data.photos || [];
    this.documents = data.documents || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Job Document Model
export class JobDocumentModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ''; // CONTRACT, DRAWING, SPECIFICATION, PERMIT, INSPECTION, REPORT, OTHER
    this.category = data.category || '';
    this.version = data.version || '1.0';
    this.status = data.status || 'DRAFT'; // DRAFT, SUBMITTED, APPROVED, REJECTED, REVISED, FINAL
    this.url = data.url || '';
    this.filePath = data.filePath || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.uploadedBy = data.uploadedBy || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.rejectedBy = data.rejectedBy || '';
    this.rejectedAt = data.rejectedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    this.expiryDate = data.expiryDate || null;
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Job Drawing Model
export class JobDrawingModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.pieceId = data.pieceId || '';
    this.drawingNumber = data.drawingNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ''; // ARCHITECTURAL, STRUCTURAL, SHOP, FABRICATION, ERECTION, DETAIL, OTHER
    this.category = data.category || '';
    this.version = data.version || '1.0';
    this.revisionNumber = data.revisionNumber || '';
    this.status = data.status || 'DRAFT'; // DRAFT, SUBMITTED, APPROVED, REJECTED, REVISED, FINAL
    this.url = data.url || '';
    this.filePath = data.filePath || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.scale = data.scale || '';
    this.dimensions = data.dimensions || {
      width: 0,
      height: 0,
      units: ''
    };
    this.drawnBy = data.drawnBy || '';
    this.checkedBy = data.checkedBy || '';
    this.approvedBy = data.approvedBy || '';
    this.drawingDate = data.drawingDate || null;
    this.revisionDate = data.revisionDate || null;
    this.approvalDate = data.approvalDate || null;
    this.revisionHistory = data.revisionHistory || [];
    this.relatedDrawings = data.relatedDrawings || [];
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Job Change Order Model
export class JobChangeOrderModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.changeOrderNumber = data.changeOrderNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // SCOPE_CHANGE, DESIGN_CHANGE, MATERIAL_CHANGE, SCHEDULE_CHANGE, COST_CHANGE, OTHER
    this.status = data.status || 'DRAFT'; // DRAFT, SUBMITTED, APPROVED, REJECTED, IMPLEMENTED, CLOSED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.requestedBy = data.requestedBy || '';
    this.requestedDate = data.requestedDate || new Date().toISOString();
    this.reason = data.reason || '';
    this.scopeChange = data.scopeChange || '';
    this.costImpact = data.costImpact || {
      originalCost: 0,
      additionalCost: 0,
      totalCost: 0,
      currency: 'USD'
    };
    this.scheduleImpact = data.scheduleImpact || {
      originalDate: null,
      newDate: null,
      delayDays: 0
    };
    this.approvalRequirements = data.approvalRequirements || [];
    this.approvals = data.approvals || [];
    this.implementationPlan = data.implementationPlan || '';
    this.implementationDate = data.implementationDate || null;
    this.implementedBy = data.implementedBy || '';
    this.documents = data.documents || [];
    this.drawings = data.drawings || [];
    this.affectedPieces = data.affectedPieces || [];
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Job Risk Model
export class JobRiskModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || ''; // SAFETY, SCHEDULE, COST, QUALITY, TECHNICAL, ENVIRONMENTAL, RESOURCE, OTHER
    this.probability = data.probability || 'MEDIUM'; // LOW, MEDIUM, HIGH, VERY_HIGH
    this.impact = data.impact || 'MEDIUM'; // LOW, MEDIUM, HIGH, VERY_HIGH
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, VERY_HIGH
    this.status = data.status || 'IDENTIFIED'; // IDENTIFIED, ANALYZED, MITIGATED, ACCEPTED, CLOSED
    this.identifiedBy = data.identifiedBy || '';
    this.identifiedDate = data.identifiedDate || new Date().toISOString();
    this.assignedTo = data.assignedTo || '';
    this.dueDate = data.dueDate || null;
    this.mitigationPlan = data.mitigationPlan || '';
    this.contingencyPlan = data.contingencyPlan || '';
    this.mitigationCost = data.mitigationCost || 0;
    this.potentialCost = data.potentialCost || 0;
    this.monitoringFrequency = data.monitoringFrequency || '';
    this.monitoringIndicators = data.monitoringIndicators || [];
    this.relatedRisks = data.relatedRisks || [];
    this.affectedPieces = data.affectedPieces || [];
    this.documents = data.documents || [];
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.closedBy = data.closedBy || '';
    this.closedAt = data.closedAt || null;
    this.closureNotes = data.closureNotes || '';
  }
}

// Job Issue Model
export class JobIssueModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.pieceId = data.pieceId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // DESIGN, PRODUCTION, QUALITY, INSTALLATION, SAFETY, SCHEDULE, COST, OTHER
    this.category = data.category || '';
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, ON_HOLD, RESOLVED, CLOSED
    this.reportedBy = data.reportedBy || '';
    this.reportedDate = data.reportedDate || new Date().toISOString();
    this.assignedTo = data.assignedTo || '';
    this.dueDate = data.dueDate || null;
    this.location = data.location || {
      area: '',
      coordinates: {
        latitude: null,
        longitude: null
      }
    };
    this.rootCause = data.rootCause || '';
    this.resolution = data.resolution || '';
    this.resolutionDate = data.resolutionDate || null;
    this.resolvedBy = data.resolvedBy || '';
    this.verifiedBy = data.verifiedBy || '';
    this.verificationDate = data.verificationDate || null;
    this.costImpact = data.costImpact || 0;
    this.scheduleImpact = data.scheduleImpact || 0;
    this.preventativeMeasures = data.preventativeMeasures || '';
    this.relatedIssues = data.relatedIssues || [];
    this.documents = data.documents || [];
    this.photos = data.photos || [];
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.closedBy = data.closedBy || '';
    this.closedAt = data.closedAt || null;
    this.closureNotes = data.closureNotes || '';
  }
}

// Job Meeting Model
export class JobMeetingModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // KICKOFF, PROGRESS, COORDINATION, DESIGN, SAFETY, CLIENT, OTHER
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.location = data.location || '';
    this.isVirtual = data.isVirtual || false;
    this.meetingLink = data.meetingLink || '';
    this.organizer = data.organizer || '';
    this.attendees = data.attendees || [];
    this.agenda = data.agenda || [];
    this.minutes = data.minutes || '';
    this.decisions = data.decisions || [];
    this.actionItems = data.actionItems || [];
    this.documents = data.documents || [];
    this.nextMeetingDate = data.nextMeetingDate || null;
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Job Inspection Model
export class JobInspectionModel {
  constructor(data) {
    this.id = data.id || '';
    this.jobId = data.jobId || '';
    this.pieceId = data.pieceId || '';
    this.inspectionNumber = data.inspectionNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // QUALITY, SAFETY, REGULATORY, PRE_POUR, POST_POUR, PRE_SHIPMENT, INSTALLATION, FINAL, OTHER
    this.category = data.category || '';
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, IN_PROGRESS, PASSED, FAILED, WAIVED, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.scheduledDate = data.scheduledDate || null;
    this.actualDate = data.actualDate || null;
    this.location = data.location || '';
    this.inspector = data.inspector || '';
    this.inspectorType = data.inspectorType || ''; // INTERNAL, CLIENT, THIRD_PARTY, REGULATORY
    this.inspectionCriteria = data.inspectionCriteria || [];
    this.inspectionResults = data.inspectionResults || [];
    this.overallResult = data.overallResult || '';
    this.deficiencies = data.deficiencies || [];
    this.recommendations = data.recommendations || '';
    this.followUpRequired = data.followUpRequired || false;
    this.followUpDate = data.followUpDate || null;
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.documents = data.documents || [];
    this.photos = data.photos || [];
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Job Dashboard Model
export class JobDashboardModel {
  constructor(data) {
    this.jobStats = data.jobStats || {
      total: 0,
      active: 0,
      completed: 0,
      onHold: 0,
      cancelled: 0
    };
    this.pieceStats = data.pieceStats || {
      total: 0,
      planned: 0,
      designed: 0,
      approved: 0,
      inProduction: 0,
      produced: 0,
      qcPassed: 0,
      qcFailed: 0,
      stored: 0,
      shipped: 0,
      delivered: 0,
      installed: 0,
      rework: 0
    };
    this.scheduleStatus = data.scheduleStatus || {
      onSchedule: 0,
      behindSchedule: 0,
      aheadOfSchedule: 0,
      criticalDelay: 0
    };
    this.budgetStatus = data.budgetStatus || {
      underBudget: 0,
      onBudget: 0,
      overBudget: 0,
      criticalOverage: 0
    };
    this.issueStats = data.issueStats || {
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      highPriority: 0
    };
    this.riskStats = data.riskStats || {
      identified: 0,
      mitigated: 0,
      accepted: 0,
      closed: 0,
      highSeverity: 0
    };
    this.upcomingDeliveries = data.upcomingDeliveries || [];
    this.recentIssues = data.recentIssues || [];
    this.upcomingMilestones = data.upcomingMilestones || [];
    this.recentActivities = data.recentActivities || [];
    this.jobsByType = data.jobsByType || [];
    this.jobsByStatus = data.jobsByStatus || [];
    this.jobsByClient = data.jobsByClient || [];
    this.jobPerformance = data.jobPerformance || {
      onTimeCompletion: 0,
      onBudgetCompletion: 0,
      qualityRating: 0,
      clientSatisfaction: 0
    };
  }
}

// Export default models
export default {
  JobModel,
  JobPieceModel,
  JobDocumentModel,
  JobDrawingModel,
  JobChangeOrderModel,
  JobRiskModel,
  JobIssueModel,
  JobMeetingModel,
  JobInspectionModel,
  JobDashboardModel
};
