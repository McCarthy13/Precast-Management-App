/**
 * Maintenance Module Models
 * Defines data models for the Maintenance module
 */

// Asset Model
export class AssetModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.type = data.type || ''; // EQUIPMENT, VEHICLE, MOLD, TOOL, FACILITY
    this.category = data.category || '';
    this.manufacturer = data.manufacturer || '';
    this.model = data.model || '';
    this.serialNumber = data.serialNumber || '';
    this.purchaseDate = data.purchaseDate || null;
    this.purchaseCost = data.purchaseCost || 0;
    this.warrantyExpirationDate = data.warrantyExpirationDate || null;
    this.location = data.location || '';
    this.department = data.department || '';
    this.assignedTo = data.assignedTo || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, MAINTENANCE, RETIRED
    this.lastMaintenanceDate = data.lastMaintenanceDate || null;
    this.nextMaintenanceDate = data.nextMaintenanceDate || null;
    this.maintenanceFrequency = data.maintenanceFrequency || '';
    this.maintenanceInstructions = data.maintenanceInstructions || '';
    this.notes = data.notes || '';
    this.documents = data.documents || []; // Array of document references
    this.images = data.images || []; // Array of image references
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Maintenance Schedule Model
export class MaintenanceScheduleModel {
  constructor(data) {
    this.id = data.id || '';
    this.assetId = data.assetId || '';
    this.assetName = data.assetName || '';
    this.maintenanceType = data.maintenanceType || ''; // PREVENTIVE, INSPECTION, CALIBRATION, etc.
    this.frequency = data.frequency || ''; // DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUALLY, etc.
    this.interval = data.interval || 0; // Numeric interval value
    this.intervalUnit = data.intervalUnit || 'DAYS'; // DAYS, WEEKS, MONTHS, YEARS, HOURS, MILES, etc.
    this.lastCompletedDate = data.lastCompletedDate || null;
    this.nextDueDate = data.nextDueDate || null;
    this.description = data.description || '';
    this.instructions = data.instructions || '';
    this.estimatedDuration = data.estimatedDuration || 0; // In minutes
    this.assignedDepartment = data.assignedDepartment || '';
    this.assignedTechnician = data.assignedTechnician || '';
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.status = data.status || 'ACTIVE'; // ACTIVE, PAUSED, COMPLETED, CANCELLED
    this.notificationEnabled = data.notificationEnabled || true;
    this.notificationDays = data.notificationDays || 7; // Days before due date to send notification
    this.notificationRecipients = data.notificationRecipients || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Work Order Model
export class WorkOrderModel {
  constructor(data) {
    this.id = data.id || '';
    this.workOrderNumber = data.workOrderNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // PREVENTIVE, CORRECTIVE, EMERGENCY, INSPECTION, etc.
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.status = data.status || 'REQUESTED'; // REQUESTED, ASSIGNED, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
    this.assetId = data.assetId || '';
    this.assetName = data.assetName || '';
    this.location = data.location || '';
    this.requestedBy = data.requestedBy || '';
    this.requestedDate = data.requestedDate || new Date().toISOString();
    this.assignedTo = data.assignedTo || '';
    this.assignedDate = data.assignedDate || null;
    this.scheduledStartDate = data.scheduledStartDate || null;
    this.scheduledEndDate = data.scheduledEndDate || null;
    this.actualStartDate = data.actualStartDate || null;
    this.actualEndDate = data.actualEndDate || null;
    this.estimatedHours = data.estimatedHours || 0;
    this.actualHours = data.actualHours || 0;
    this.estimatedCost = data.estimatedCost || 0;
    this.actualCost = data.actualCost || 0;
    this.parts = data.parts || []; // Array of parts used
    this.labor = data.labor || []; // Array of labor entries
    this.instructions = data.instructions || '';
    this.completionNotes = data.completionNotes || '';
    this.photos = data.photos || []; // Array of photo references
    this.documents = data.documents || []; // Array of document references
    this.signatures = data.signatures || {}; // Object with signature references
    this.relatedWorkOrders = data.relatedWorkOrders || []; // Array of related work order IDs
    this.maintenanceScheduleId = data.maintenanceScheduleId || null; // If generated from a schedule
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Breakdown Report Model
export class BreakdownReportModel {
  constructor(data) {
    this.id = data.id || '';
    this.reportNumber = data.reportNumber || '';
    this.assetId = data.assetId || '';
    this.assetName = data.assetName || '';
    this.breakdownDate = data.breakdownDate || new Date().toISOString();
    this.reportedBy = data.reportedBy || '';
    this.description = data.description || '';
    this.impactLevel = data.impactLevel || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.productionImpact = data.productionImpact || '';
    this.estimatedDowntime = data.estimatedDowntime || 0; // In hours
    this.actualDowntime = data.actualDowntime || 0; // In hours
    this.rootCause = data.rootCause || '';
    this.immediateAction = data.immediateAction || '';
    this.correctiveAction = data.correctiveAction || '';
    this.preventiveAction = data.preventiveAction || '';
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    this.workOrderId = data.workOrderId || null; // Associated work order
    this.photos = data.photos || []; // Array of photo references
    this.documents = data.documents || []; // Array of document references
    this.costImpact = data.costImpact || 0;
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Part/Inventory Model
export class PartModel {
  constructor(data) {
    this.id = data.id || '';
    this.partNumber = data.partNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.manufacturer = data.manufacturer || '';
    this.model = data.model || '';
    this.location = data.location || '';
    this.bin = data.bin || '';
    this.unitOfMeasure = data.unitOfMeasure || '';
    this.currentQuantity = data.currentQuantity || 0;
    this.minimumQuantity = data.minimumQuantity || 0;
    this.reorderPoint = data.reorderPoint || 0;
    this.reorderQuantity = data.reorderQuantity || 0;
    this.unitCost = data.unitCost || 0;
    this.vendor = data.vendor || '';
    this.vendorPartNumber = data.vendorPartNumber || '';
    this.leadTime = data.leadTime || 0; // In days
    this.lastOrderDate = data.lastOrderDate || null;
    this.lastReceivedDate = data.lastReceivedDate || null;
    this.compatibleAssets = data.compatibleAssets || []; // Array of asset IDs
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, DISCONTINUED
    this.notes = data.notes || '';
    this.images = data.images || []; // Array of image references
    this.documents = data.documents || []; // Array of document references
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Maintenance Cost Model
export class MaintenanceCostModel {
  constructor(data) {
    this.id = data.id || '';
    this.workOrderId = data.workOrderId || '';
    this.assetId = data.assetId || '';
    this.assetName = data.assetName || '';
    this.costType = data.costType || ''; // LABOR, PARTS, CONTRACTOR, OTHER
    this.description = data.description || '';
    this.amount = data.amount || 0;
    this.quantity = data.quantity || 1;
    this.unitCost = data.unitCost || 0;
    this.date = data.date || new Date().toISOString();
    this.vendor = data.vendor || '';
    this.invoiceNumber = data.invoiceNumber || '';
    this.purchaseOrderNumber = data.purchaseOrderNumber || '';
    this.accountCode = data.accountCode || '';
    this.taxable = data.taxable || false;
    this.taxAmount = data.taxAmount || 0;
    this.totalAmount = data.totalAmount || 0;
    this.notes = data.notes || '';
    this.attachments = data.attachments || []; // Array of attachment references
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Compliance Document Model
export class MaintenanceComplianceModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.documentType = data.documentType || ''; // INSPECTION, CERTIFICATION, PERMIT, REPORT
    this.assetId = data.assetId || '';
    this.assetName = data.assetName || '';
    this.issueDate = data.issueDate || new Date().toISOString();
    this.expirationDate = data.expirationDate || null;
    this.issuingAuthority = data.issuingAuthority || '';
    this.documentNumber = data.documentNumber || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, EXPIRED, PENDING_RENEWAL
    this.description = data.description || '';
    this.requirements = data.requirements || '';
    this.reminderEnabled = data.reminderEnabled || true;
    this.reminderDays = data.reminderDays || 30; // Days before expiration to send reminder
    this.reminderRecipients = data.reminderRecipients || [];
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Maintenance Checklist Model
export class MaintenanceChecklistModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.assetType = data.assetType || ''; // Type of asset this checklist applies to
    this.maintenanceType = data.maintenanceType || ''; // PREVENTIVE, INSPECTION, REPAIR, etc.
    this.items = data.items || []; // Array of checklist items
    this.estimatedDuration = data.estimatedDuration || 0; // In minutes
    this.requiredTools = data.requiredTools || [];
    this.requiredParts = data.requiredParts || [];
    this.safetyRequirements = data.safetyRequirements || '';
    this.instructions = data.instructions || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, ARCHIVED
    this.version = data.version || '1.0';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Maintenance Checklist Item Model
export class ChecklistItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.checklistId = data.checklistId || '';
    this.sequence = data.sequence || 0;
    this.description = data.description || '';
    this.type = data.type || 'CHECKBOX'; // CHECKBOX, TEXT, MEASUREMENT, INSPECTION
    this.required = data.required || true;
    this.expectedValue = data.expectedValue || '';
    this.toleranceMin = data.toleranceMin || null;
    this.toleranceMax = data.toleranceMax || null;
    this.unit = data.unit || '';
    this.instructions = data.instructions || '';
    this.imageUrl = data.imageUrl || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Completed Checklist Model
export class CompletedChecklistModel {
  constructor(data) {
    this.id = data.id || '';
    this.checklistId = data.checklistId || '';
    this.workOrderId = data.workOrderId || '';
    this.assetId = data.assetId || '';
    this.completedBy = data.completedBy || '';
    this.completedDate = data.completedDate || new Date().toISOString();
    this.status = data.status || 'COMPLETED'; // IN_PROGRESS, COMPLETED, FAILED
    this.items = data.items || []; // Array of completed checklist items
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.signature = data.signature || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Completed Checklist Item Model
export class CompletedChecklistItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.completedChecklistId = data.completedChecklistId || '';
    this.checklistItemId = data.checklistItemId || '';
    this.sequence = data.sequence || 0;
    this.description = data.description || '';
    this.type = data.type || 'CHECKBOX';
    this.required = data.required || true;
    this.expectedValue = data.expectedValue || '';
    this.actualValue = data.actualValue || '';
    this.result = data.result || 'PASS'; // PASS, FAIL, NA
    this.notes = data.notes || '';
    this.photos = data.photos || [];
    this.completedBy = data.completedBy || '';
    this.completedDate = data.completedDate || new Date().toISOString();
  }
}
