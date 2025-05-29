/**
 * Yard Management Models
 * Defines data models for the Yard Management module
 */

// Piece Model
export class PieceModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.markNumber = data.markNumber || '';
    this.description = data.description || '';
    this.dimensions = data.dimensions || { length: 0, width: 0, height: 0 };
    this.weight = data.weight || 0;
    this.status = data.status || 'IN_PRODUCTION';
    this.location = data.location || { bay: '', row: '', stack: 0 };
    this.qcStatus = data.qcStatus || 'PENDING';
    this.qcApprovedBy = data.qcApprovedBy || '';
    this.qcApprovedDate = data.qcApprovedDate || null;
    this.readyForShipping = data.readyForShipping || false;
    this.shippingApprovedBy = data.shippingApprovedBy || '';
    this.shippingApprovedDate = data.shippingApprovedDate || null;
    this.specialHandling = data.specialHandling || [];
    this.photos = data.photos || [];
    this.issues = data.issues || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Yard Location Model
export class YardLocationModel {
  constructor(data) {
    this.id = data.id || '';
    this.bay = data.bay || '';  // Number
    this.row = data.row || '';  // Letter
    this.stack = data.stack || 0; // Number (from bottom)
    this.coordinates = data.coordinates || { lat: 0, lng: 0 };
    this.capacity = data.capacity || 0;
    this.currentOccupancy = data.currentOccupancy || 0;
    this.pieceIds = data.pieceIds || [];
    this.specialNotes = data.specialNotes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Movement Log Model
export class MovementLogModel {
  constructor(data) {
    this.id = data.id || '';
    this.pieceId = data.pieceId || '';
    this.fromLocation = data.fromLocation || { bay: '', row: '', stack: 0 };
    this.toLocation = data.toLocation || { bay: '', row: '', stack: 0 };
    this.type = data.type || 'RELOCATION'; // INBOUND, OUTBOUND, RELOCATION
    this.performedBy = data.performedBy || '';
    this.timestamp = data.timestamp || new Date().toISOString();
    this.notes = data.notes || '';
  }
}

// Storage Area Model
export class StorageAreaModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || 'STANDARD'; // STANDARD, SPECIAL_HANDLING, SHIPPING_STAGING
    this.bays = data.bays || [];
    this.capacity = data.capacity || 0;
    this.currentOccupancy = data.currentOccupancy || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Special Handling Model
export class SpecialHandlingModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || ''; // FRAGILE, OVERSIZED, CUSTOM_FINISH, etc.
    this.description = data.description || '';
    this.instructions = data.instructions || '';
    this.requiresApproval = data.requiresApproval || false;
    this.approvedBy = data.approvedBy || '';
    this.approvedDate = data.approvedDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Yard Map Model
export class YardMapModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || 'Main Yard';
    this.description = data.description || '';
    this.storageAreas = data.storageAreas || [];
    this.dimensions = data.dimensions || { width: 0, length: 0 };
    this.gridSize = data.gridSize || { rows: 0, columns: 0 };
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
  }
}

// Issue Report Model
export class IssueReportModel {
  constructor(data) {
    this.id = data.id || '';
    this.pieceId = data.pieceId || '';
    this.type = data.type || ''; // DAMAGE, MISSING, QUALITY_ISSUE, etc.
    this.description = data.description || '';
    this.severity = data.severity || 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    this.reportedBy = data.reportedBy || '';
    this.reportedDate = data.reportedDate || new Date().toISOString();
    this.status = data.status || 'OPEN'; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    this.assignedTo = data.assignedTo || '';
    this.resolution = data.resolution || '';
    this.resolutionDate = data.resolutionDate || null;
    this.photos = data.photos || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
