/**
 * Document Management Models
 * Defines data models for the Document Management module
 */

// Document Model
export class DocumentModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // CONTRACT, DRAWING, SPECIFICATION, REPORT, CERTIFICATE, etc.
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.version = data.version || '1.0';
    this.status = data.status || 'ACTIVE'; // ACTIVE, ARCHIVED, DRAFT, PENDING_APPROVAL
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.relatedEntities = data.relatedEntities || []; // Array of related entity references (pieces, vendors, etc.)
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedBy = data.updatedBy || '';
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.expirationDate = data.expirationDate || null;
    this.accessLevel = data.accessLevel || 'INTERNAL'; // PUBLIC, INTERNAL, RESTRICTED, CONFIDENTIAL
    this.accessGroups = data.accessGroups || []; // Array of group IDs that can access this document
    this.customFields = data.customFields || {};
  }
}

// Document Version Model
export class DocumentVersionModel {
  constructor(data) {
    this.id = data.id || '';
    this.documentId = data.documentId || '';
    this.version = data.version || '';
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.changeDescription = data.changeDescription || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.status = data.status || 'ACTIVE'; // ACTIVE, SUPERSEDED
  }
}

// Document Folder Model
export class DocumentFolderModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.parentId = data.parentId || null; // Parent folder ID, null if root
    this.path = data.path || '/'; // Full path to folder
    this.accessLevel = data.accessLevel || 'INTERNAL'; // PUBLIC, INTERNAL, RESTRICTED, CONFIDENTIAL
    this.accessGroups = data.accessGroups || []; // Array of group IDs that can access this folder
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedBy = data.updatedBy || '';
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Document Comment Model
export class DocumentCommentModel {
  constructor(data) {
    this.id = data.id || '';
    this.documentId = data.documentId || '';
    this.documentVersion = data.documentVersion || '';
    this.content = data.content || '';
    this.pageNumber = data.pageNumber || null;
    this.coordinates = data.coordinates || null; // For annotations on specific parts of a document
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.status = data.status || 'ACTIVE'; // ACTIVE, RESOLVED, DELETED
    this.parentId = data.parentId || null; // For threaded comments
    this.attachments = data.attachments || []; // Array of attachment references
  }
}

// Document Approval Model
export class DocumentApprovalModel {
  constructor(data) {
    this.id = data.id || '';
    this.documentId = data.documentId || '';
    this.documentVersion = data.documentVersion || '';
    this.approvalWorkflowId = data.approvalWorkflowId || '';
    this.status = data.status || 'PENDING'; // PENDING, APPROVED, REJECTED, CANCELLED
    this.approvers = data.approvers || []; // Array of approver objects with userId, status, date, comments
    this.currentStep = data.currentStep || 0;
    this.startDate = data.startDate || new Date().toISOString();
    this.completionDate = data.completionDate || null;
    this.dueDate = data.dueDate || null;
    this.comments = data.comments || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Approval Workflow Model
export class ApprovalWorkflowModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.documentTypes = data.documentTypes || []; // Array of document types this workflow applies to
    this.steps = data.steps || []; // Array of approval step objects
    this.isSequential = data.isSequential || true; // Whether approvals must happen in sequence
    this.autoStartOnUpload = data.autoStartOnUpload || false; // Whether to auto-start this workflow on document upload
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE
  }
}

// Document Tag Model
export class DocumentTagModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.color = data.color || '#CCCCCC';
    this.category = data.category || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Document Access Log Model
export class DocumentAccessLogModel {
  constructor(data) {
    this.id = data.id || '';
    this.documentId = data.documentId || '';
    this.documentVersion = data.documentVersion || '';
    this.userId = data.userId || '';
    this.userName = data.userName || '';
    this.action = data.action || ''; // VIEW, DOWNLOAD, EDIT, DELETE, SHARE
    this.timestamp = data.timestamp || new Date().toISOString();
    this.ipAddress = data.ipAddress || '';
    this.userAgent = data.userAgent || '';
    this.details = data.details || '';
  }
}

// Document Share Model
export class DocumentShareModel {
  constructor(data) {
    this.id = data.id || '';
    this.documentId = data.documentId || '';
    this.documentVersion = data.documentVersion || '';
    this.shareType = data.shareType || 'INTERNAL'; // INTERNAL, EXTERNAL, PUBLIC
    this.recipientType = data.recipientType || 'USER'; // USER, GROUP, EMAIL, LINK
    this.recipientId = data.recipientId || '';
    this.recipientEmail = data.recipientEmail || '';
    this.accessLevel = data.accessLevel || 'VIEW'; // VIEW, COMMENT, EDIT, FULL
    this.expirationDate = data.expirationDate || null;
    this.shareLink = data.shareLink || '';
    this.password = data.password || null; // For password-protected shares
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.status = data.status || 'ACTIVE'; // ACTIVE, REVOKED, EXPIRED
    this.accessCount = data.accessCount || 0;
    this.lastAccessed = data.lastAccessed || null;
  }
}

// Document Template Model
export class DocumentTemplateModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.category = data.category || '';
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.placeholders = data.placeholders || []; // Array of placeholder objects
    this.defaultTags = data.defaultTags || [];
    this.defaultAccessLevel = data.defaultAccessLevel || 'INTERNAL';
    this.defaultApprovalWorkflowId = data.defaultApprovalWorkflowId || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE
  }
}
