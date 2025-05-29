/**
 * Drafting/Engineering Module Models
 * Defines data structures for the Drafting/Engineering module
 */

// Drawing Model
export class DrawingModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.number = data.number || '';
    this.revision = data.revision || '';
    this.type = data.type || ''; // Architectural, Structural, Shop, etc.
    this.format = data.format || ''; // PDF, DWG, RVT, etc.
    this.status = data.status || 'Draft'; // Draft, In Review, Approved, Released
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.description = data.description || '';
    this.tags = data.tags || [];
    this.fileUrl = data.fileUrl || '';
    this.thumbnailUrl = data.thumbnailUrl || '';
    this.createdBy = data.createdBy || '';
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.releasedBy = data.releasedBy || '';
    this.releaseDate = data.releaseDate || null;
    this.revisionHistory = data.revisionHistory || [];
    this.linkedElements = data.linkedElements || [];
    this.viewCount = data.viewCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Revision Model
export class DrawingRevisionModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.drawingId = data.drawingId || '';
    this.revisionNumber = data.revisionNumber || '';
    this.description = data.description || '';
    this.changes = data.changes || [];
    this.fileUrl = data.fileUrl || '';
    this.thumbnailUrl = data.thumbnailUrl || '';
    this.createdBy = data.createdBy || '';
    this.status = data.status || 'Draft'; // Draft, In Review, Approved, Released
    this.approvedBy = data.approvedBy || '';
    this.approvalDate = data.approvalDate || null;
    this.releasedBy = data.releasedBy || '';
    this.releaseDate = data.releaseDate || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Markup Model
export class DrawingMarkupModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.drawingId = data.drawingId || '';
    this.revisionId = data.revisionId || '';
    this.type = data.type || ''; // Text, Line, Rectangle, Circle, Cloud, etc.
    this.content = data.content || '';
    this.position = data.position || { x: 0, y: 0 };
    this.size = data.size || { width: 0, height: 0 };
    this.color = data.color || '#FF0000';
    this.createdBy = data.createdBy || '';
    this.isResolved = data.isResolved || false;
    this.resolvedBy = data.resolvedBy || '';
    this.resolvedAt = data.resolvedAt || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Comment Model
export class DrawingCommentModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.drawingId = data.drawingId || '';
    this.revisionId = data.revisionId || '';
    this.markupId = data.markupId || '';
    this.content = data.content || '';
    this.createdBy = data.createdBy || '';
    this.isResolved = data.isResolved || false;
    this.resolvedBy = data.resolvedBy || '';
    this.resolvedAt = data.resolvedAt || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Release Model
export class DrawingReleaseModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.drawingId = data.drawingId || '';
    this.revisionId = data.revisionId || '';
    this.releaseType = data.releaseType || ''; // For Production, For Field, For Client, etc.
    this.recipients = data.recipients || [];
    this.message = data.message || '';
    this.releasedBy = data.releasedBy || '';
    this.releaseDate = data.releaseDate || new Date();
    this.expirationDate = data.expirationDate || null;
    this.isExpired = data.isExpired || false;
    this.accessCount = data.accessCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Element Model
export class DrawingElementModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.drawingId = data.drawingId || '';
    this.elementType = data.elementType || ''; // Wall, Column, Beam, etc.
    this.elementId = data.elementId || '';
    this.name = data.name || '';
    this.position = data.position || { x: 0, y: 0 };
    this.dimensions = data.dimensions || { width: 0, height: 0, depth: 0 };
    this.properties = data.properties || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Workflow Model
export class DrawingWorkflowModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.drawingId = data.drawingId || '';
    this.revisionId = data.revisionId || '';
    this.workflowType = data.workflowType || ''; // Review, Approval, Release
    this.status = data.status || 'Pending'; // Pending, In Progress, Completed, Rejected
    this.steps = data.steps || [];
    this.currentStep = data.currentStep || 0;
    this.initiatedBy = data.initiatedBy || '';
    this.initiatedAt = data.initiatedAt || new Date();
    this.completedAt = data.completedAt || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Workflow Step Model
export class WorkflowStepModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.workflowId = data.workflowId || '';
    this.stepNumber = data.stepNumber || 0;
    this.stepType = data.stepType || ''; // Review, Approval, Notification
    this.assignedTo = data.assignedTo || '';
    this.status = data.status || 'Pending'; // Pending, Completed, Rejected
    this.comments = data.comments || '';
    this.completedBy = data.completedBy || '';
    this.completedAt = data.completedAt || null;
    this.dueDate = data.dueDate || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// External Tool Integration Model
export class ExternalToolIntegrationModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.toolType = data.toolType || ''; // CAD, BIM, ERP, etc.
    this.toolName = data.toolName || '';
    this.connectionDetails = data.connectionDetails || {};
    this.status = data.status || 'Active'; // Active, Inactive, Error
    this.lastSyncTime = data.lastSyncTime || null;
    this.syncFrequency = data.syncFrequency || 'Manual'; // Manual, Hourly, Daily, etc.
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Drawing Template Model
export class DrawingTemplateModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.format = data.format || '';
    this.fileUrl = data.fileUrl || '';
    this.thumbnailUrl = data.thumbnailUrl || '';
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.isDefault = data.isDefault || false;
    this.usageCount = data.usageCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
