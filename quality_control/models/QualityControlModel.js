/**
 * Quality Control Module Models
 * Defines data models for the Quality Control module
 */

// QC Inspection Model
export class QCInspectionModel {
  constructor(data) {
    this.id = data.id || '';
    this.inspectionNumber = data.inspectionNumber || '';
    this.type = data.type || ''; // PRE_POUR, POST_POUR, FINAL, SPECIAL
    this.status = data.status || 'PENDING'; // PENDING, IN_PROGRESS, PASSED, FAILED, WAIVED
    this.pieceId = data.pieceId || '';
    this.pieceNumber = data.pieceNumber || '';
    this.jobId = data.jobId || '';
    this.jobNumber = data.jobNumber || '';
    this.jobName = data.jobName || '';
    this.location = data.location || '';
    this.scheduledDate = data.scheduledDate || null;
    this.startDate = data.startDate || null;
    this.completionDate = data.completionDate || null;
    this.inspectedBy = data.inspectedBy || '';
    this.approvedBy = data.approvedBy || '';
    this.waivedBy = data.waivedBy || '';
    this.waiveReason = data.waiveReason || '';
    this.checklistItems = data.checklistItems || [];
    this.defects = data.defects || [];
    this.measurements = data.measurements || [];
    this.notes = data.notes || '';
    this.images = data.images || [];
    this.documents = data.documents || [];
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// QC Checklist Item Model
export class QCChecklistItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.inspectionId = data.inspectionId || '';
    this.category = data.category || '';
    this.description = data.description || '';
    this.requirement = data.requirement || '';
    this.status = data.status || 'PENDING'; // PENDING, PASSED, FAILED, N/A
    this.result = data.result || '';
    this.notes = data.notes || '';
    this.images = data.images || [];
    this.severity = data.severity || 'NORMAL'; // LOW, NORMAL, HIGH, CRITICAL
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.completedBy = data.completedBy || '';
    this.completedAt = data.completedAt || null;
  }
}

// QC Defect Model
export class QCDefectModel {
  constructor(data) {
    this.id = data.id || '';
    this.defectNumber = data.defectNumber || '';
    this.inspectionId = data.inspectionId || '';
    this.pieceId = data.pieceId || '';
    this.pieceNumber = data.pieceNumber || '';
    this.jobId = data.jobId || '';
    this.jobNumber = data.jobNumber || '';
    this.type = data.type || '';
    this.category = data.category || '';
    this.location = data.location || '';
    this.description = data.description || '';
    this.severity = data.severity || 'NORMAL'; // LOW, NORMAL, HIGH, CRITICAL
    this.status = data.status || 'OPEN'; // OPEN, IN_REVIEW, APPROVED_FOR_REPAIR, REPAIRED, REJECTED, CLOSED
    this.rootCause = data.rootCause || '';
    this.repairMethod = data.repairMethod || '';
    this.repairNotes = data.repairNotes || '';
    this.repairBy = data.repairBy || '';
    this.repairDate = data.repairDate || null;
    this.inspectedAfterRepairBy = data.inspectedAfterRepairBy || '';
    this.inspectedAfterRepairDate = data.inspectedAfterRepairDate || null;
    this.inspectedAfterRepairResult = data.inspectedAfterRepairResult || '';
    this.images = data.images || [];
    this.documents = data.documents || [];
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.closedBy = data.closedBy || '';
    this.closedAt = data.closedAt || null;
    this.closureReason = data.closureReason || '';
  }
}

// QC Measurement Model
export class QCMeasurementModel {
  constructor(data) {
    this.id = data.id || '';
    this.inspectionId = data.inspectionId || '';
    this.pieceId = data.pieceId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.location = data.location || '';
    this.measurementType = data.measurementType || ''; // DIMENSION, WEIGHT, STRENGTH, DENSITY, OTHER
    this.unit = data.unit || '';
    this.expectedValue = data.expectedValue || null;
    this.minimumValue = data.minimumValue || null;
    this.maximumValue = data.maximumValue || null;
    this.actualValue = data.actualValue || null;
    this.tolerance = data.tolerance || null;
    this.status = data.status || 'PENDING'; // PENDING, WITHIN_SPEC, OUT_OF_SPEC
    this.notes = data.notes || '';
    this.images = data.images || [];
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Concrete Mix Design Model
export class ConcreteMixDesignModel {
  constructor(data) {
    this.id = data.id || '';
    this.mixDesignNumber = data.mixDesignNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || 'DRAFT'; // DRAFT, APPROVED, ACTIVE, INACTIVE, ARCHIVED
    this.type = data.type || '';
    this.category = data.category || '';
    this.targetStrength = data.targetStrength || null;
    this.targetSlump = data.targetSlump || null;
    this.maxWaterCementRatio = data.maxWaterCementRatio || null;
    this.airContent = data.airContent || null;
    this.ingredients = data.ingredients || [];
    this.admixtures = data.admixtures || [];
    this.cementType = data.cementType || '';
    this.aggregateType = data.aggregateType || '';
    this.aggregateSize = data.aggregateSize || '';
    this.notes = data.notes || '';
    this.testResults = data.testResults || [];
    this.approvedBy = data.approvedBy || '';
    this.approvedDate = data.approvedDate || null;
    this.documents = data.documents || [];
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Concrete Mix Ingredient Model
export class ConcreteMixIngredientModel {
  constructor(data) {
    this.id = data.id || '';
    this.mixDesignId = data.mixDesignId || '';
    this.name = data.name || '';
    this.type = data.type || ''; // CEMENT, AGGREGATE, WATER, ADMIXTURE, OTHER
    this.quantity = data.quantity || 0;
    this.unit = data.unit || '';
    this.source = data.source || '';
    this.specifications = data.specifications || {};
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Concrete Test Result Model
export class ConcreteTestResultModel {
  constructor(data) {
    this.id = data.id || '';
    this.testNumber = data.testNumber || '';
    this.mixDesignId = data.mixDesignId || '';
    this.mixDesignNumber = data.mixDesignNumber || '';
    this.jobId = data.jobId || '';
    this.jobNumber = data.jobNumber || '';
    this.pieceId = data.pieceId || '';
    this.pieceNumber = data.pieceNumber || '';
    this.testType = data.testType || ''; // SLUMP, COMPRESSION, AIR_CONTENT, TEMPERATURE, OTHER
    this.testDate = data.testDate || null;
    this.testLocation = data.testLocation || '';
    this.testMethod = data.testMethod || '';
    this.testAge = data.testAge || null;
    this.result = data.result || null;
    this.unit = data.unit || '';
    this.expectedValue = data.expectedValue || null;
    this.minimumValue = data.minimumValue || null;
    this.maximumValue = data.maximumValue || null;
    this.status = data.status || 'PENDING'; // PENDING, PASSED, FAILED
    this.notes = data.notes || '';
    this.images = data.images || [];
    this.documents = data.documents || [];
    this.customFields = data.customFields || {};
    this.testedBy = data.testedBy || '';
    this.verifiedBy = data.verifiedBy || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// QC Checklist Template Model
export class QCChecklistTemplateModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ''; // PRE_POUR, POST_POUR, FINAL, SPECIAL
    this.category = data.category || '';
    this.status = data.status || 'ACTIVE'; // DRAFT, ACTIVE, INACTIVE, ARCHIVED
    this.items = data.items || [];
    this.version = data.version || '1.0';
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.approvedBy = data.approvedBy || '';
    this.approvedDate = data.approvedDate || null;
  }
}

// QC Checklist Template Item Model
export class QCChecklistTemplateItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.templateId = data.templateId || '';
    this.category = data.category || '';
    this.description = data.description || '';
    this.requirement = data.requirement || '';
    this.instructions = data.instructions || '';
    this.severity = data.severity || 'NORMAL'; // LOW, NORMAL, HIGH, CRITICAL
    this.isRequired = data.isRequired || true;
    this.sortOrder = data.sortOrder || 0;
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// QC Dashboard Model
export class QCDashboardModel {
  constructor(data) {
    this.inspectionStats = data.inspectionStats || {
      total: 0,
      pending: 0,
      inProgress: 0,
      passed: 0,
      failed: 0,
      waived: 0
    };
    this.defectStats = data.defectStats || {
      total: 0,
      open: 0,
      inReview: 0,
      approvedForRepair: 0,
      repaired: 0,
      rejected: 0,
      closed: 0
    };
    this.testResultStats = data.testResultStats || {
      total: 0,
      pending: 0,
      passed: 0,
      failed: 0
    };
    this.inspectionsByType = data.inspectionsByType || [];
    this.defectsByCategory = data.defectsByCategory || [];
    this.defectsBySeverity = data.defectsBySeverity || [];
    this.testResultsByType = data.testResultsByType || [];
    this.upcomingInspections = data.upcomingInspections || [];
    this.recentDefects = data.recentDefects || [];
    this.recentTestResults = data.recentTestResults || [];
    this.qualityMetrics = data.qualityMetrics || {
      firstTimeQualityRate: 0,
      defectsPerPiece: 0,
      averageDefectResolutionTime: 0,
      inspectionCompletionRate: 0,
      criticalDefectRate: 0
    };
    this.qualityTrends = data.qualityTrends || {
      firstTimeQualityRate: [],
      defectsPerPiece: [],
      averageDefectResolutionTime: []
    };
  }
}

// Material Certification Model
export class MaterialCertificationModel {
  constructor(data) {
    this.id = data.id || '';
    this.certificationNumber = data.certificationNumber || '';
    this.materialType = data.materialType || '';
    this.materialName = data.materialName || '';
    this.supplierName = data.supplierName || '';
    this.supplierId = data.supplierId || '';
    this.batchNumber = data.batchNumber || '';
    this.lotNumber = data.lotNumber || '';
    this.manufacturingDate = data.manufacturingDate || null;
    this.expirationDate = data.expirationDate || null;
    this.receivedDate = data.receivedDate || null;
    this.quantity = data.quantity || 0;
    this.unit = data.unit || '';
    this.status = data.status || 'PENDING'; // PENDING, APPROVED, REJECTED, EXPIRED
    this.specifications = data.specifications || {};
    this.testResults = data.testResults || [];
    this.notes = data.notes || '';
    this.documents = data.documents || [];
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.approvedBy = data.approvedBy || '';
    this.approvedDate = data.approvedDate || null;
    this.rejectedBy = data.rejectedBy || '';
    this.rejectedDate = data.rejectedDate || null;
    this.rejectionReason = data.rejectionReason || '';
  }
}

// Export default models
export default {
  QCInspectionModel,
  QCChecklistItemModel,
  QCDefectModel,
  QCMeasurementModel,
  ConcreteMixDesignModel,
  ConcreteMixIngredientModel,
  ConcreteTestResultModel,
  QCChecklistTemplateModel,
  QCChecklistTemplateItemModel,
  QCDashboardModel,
  MaterialCertificationModel
};
