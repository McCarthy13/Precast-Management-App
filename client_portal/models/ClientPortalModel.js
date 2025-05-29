/**
 * Client Portal Models
 * Defines data models for the Client Portal module
 */

// Client User Model
export class ClientUserModel {
  constructor(data) {
    this.id = data.id || '';
    this.userId = data.userId || ''; // Reference to main User table
    this.clientId = data.clientId || ''; // Reference to Client/Company
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.position = data.position || '';
    this.department = data.department || '';
    this.isAdmin = data.isAdmin || false; // Whether this user is a client admin
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, PENDING
    this.lastLogin = data.lastLogin || null;
    this.notificationPreferences = data.notificationPreferences || {
      email: true,
      sms: false,
      projectUpdates: true,
      deliveryUpdates: true,
      documentUpdates: true
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Client Company Model
export class ClientCompanyModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.address = data.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.website = data.website || '';
    this.industry = data.industry || '';
    this.logo = data.logo || '';
    this.primaryContactId = data.primaryContactId || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, PROSPECT
    this.customerSince = data.customerSince || new Date().toISOString();
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Client Project Model
export class ClientProjectModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || ''; // Reference to main Project table
    this.clientId = data.clientId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, COMPLETED, ON_HOLD, CANCELLED
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.progress = data.progress || 0; // 0-100%
    this.contractValue = data.contractValue || 0;
    this.invoicedAmount = data.invoicedAmount || 0;
    this.paidAmount = data.paidAmount || 0;
    this.location = data.location || '';
    this.primaryContactId = data.primaryContactId || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Client Document Model
export class ClientDocumentModel {
  constructor(data) {
    this.id = data.id || '';
    this.documentId = data.documentId || ''; // Reference to main Document table
    this.clientId = data.clientId || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // CONTRACT, DRAWING, SPECIFICATION, INVOICE, etc.
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.version = data.version || '1.0';
    this.status = data.status || 'ACTIVE'; // ACTIVE, ARCHIVED, PENDING_APPROVAL
    this.uploadedBy = data.uploadedBy || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.expirationDate = data.expirationDate || null;
    this.isSharedByClient = data.isSharedByClient || false; // Whether uploaded by client or shared by company
    this.accessLevel = data.accessLevel || 'VIEW'; // VIEW, DOWNLOAD, COMMENT
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Client Message Model
export class ClientMessageModel {
  constructor(data) {
    this.id = data.id || '';
    this.clientId = data.clientId || '';
    this.projectId = data.projectId || '';
    this.subject = data.subject || '';
    this.content = data.content || '';
    this.senderId = data.senderId || '';
    this.senderName = data.senderName || '';
    this.senderType = data.senderType || 'CLIENT'; // CLIENT, COMPANY
    this.recipientIds = data.recipientIds || [];
    this.recipientNames = data.recipientNames || [];
    this.status = data.status || 'UNREAD'; // UNREAD, READ, ARCHIVED
    this.priority = data.priority || 'NORMAL'; // LOW, NORMAL, HIGH
    this.attachments = data.attachments || [];
    this.parentMessageId = data.parentMessageId || null; // For threaded messages
    this.createdAt = data.createdAt || new Date().toISOString();
    this.readAt = data.readAt || null;
  }
}

// Client Delivery Model
export class ClientDeliveryModel {
  constructor(data) {
    this.id = data.id || '';
    this.deliveryId = data.deliveryId || ''; // Reference to main Delivery table
    this.clientId = data.clientId || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, IN_TRANSIT, DELIVERED, CANCELLED
    this.scheduledDate = data.scheduledDate || null;
    this.actualDate = data.actualDate || null;
    this.location = data.location || '';
    this.items = data.items || []; // Array of delivery items
    this.contactPerson = data.contactPerson || '';
    this.contactPhone = data.contactPhone || '';
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Client Approval Request Model
export class ClientApprovalRequestModel {
  constructor(data) {
    this.id = data.id || '';
    this.clientId = data.clientId || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // DRAWING, CHANGE_ORDER, MATERIAL, SCHEDULE, etc.
    this.status = data.status || 'PENDING'; // PENDING, APPROVED, REJECTED, CANCELLED
    this.requestedBy = data.requestedBy || '';
    this.requestedAt = data.requestedAt || new Date().toISOString();
    this.dueDate = data.dueDate || null;
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.rejectedBy = data.rejectedBy || '';
    this.rejectedAt = data.rejectedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    this.items = data.items || []; // Array of items requiring approval
    this.attachments = data.attachments || [];
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Client Invoice Model
export class ClientInvoiceModel {
  constructor(data) {
    this.id = data.id || '';
    this.invoiceId = data.invoiceId || ''; // Reference to main Invoice table
    this.clientId = data.clientId || '';
    this.projectId = data.projectId || '';
    this.invoiceNumber = data.invoiceNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.amount = data.amount || 0;
    this.tax = data.tax || 0;
    this.total = data.total || 0;
    this.currency = data.currency || 'USD';
    this.status = data.status || 'PENDING'; // PENDING, PAID, OVERDUE, CANCELLED
    this.issueDate = data.issueDate || new Date().toISOString();
    this.dueDate = data.dueDate || null;
    this.paidDate = data.paidDate || null;
    this.paidAmount = data.paidAmount || 0;
    this.paymentMethod = data.paymentMethod || '';
    this.paymentReference = data.paymentReference || '';
    this.items = data.items || []; // Array of invoice line items
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Client Notification Model
export class ClientNotificationModel {
  constructor(data) {
    this.id = data.id || '';
    this.clientId = data.clientId || '';
    this.userId = data.userId || '';
    this.projectId = data.projectId || '';
    this.title = data.title || '';
    this.message = data.message || '';
    this.type = data.type || ''; // PROJECT_UPDATE, DELIVERY_UPDATE, DOCUMENT_UPDATE, APPROVAL_REQUEST, etc.
    this.status = data.status || 'UNREAD'; // UNREAD, READ, ARCHIVED
    this.priority = data.priority || 'NORMAL'; // LOW, NORMAL, HIGH
    this.link = data.link || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.readAt = data.readAt || null;
  }
}

// Client Dashboard Widget Model
export class ClientDashboardWidgetModel {
  constructor(data) {
    this.id = data.id || '';
    this.clientId = data.clientId || '';
    this.userId = data.userId || '';
    this.type = data.type || ''; // PROJECT_PROGRESS, DELIVERY_SCHEDULE, INVOICE_SUMMARY, DOCUMENT_ACTIVITY, etc.
    this.title = data.title || '';
    this.position = data.position || 0;
    this.size = data.size || 'MEDIUM'; // SMALL, MEDIUM, LARGE
    this.config = data.config || {};
    this.isEnabled = data.isEnabled || true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
