/**
 * Configuration Module Models
 * Defines data models for the Configuration module
 */

// System Configuration Model
export class SystemConfigModel {
  constructor(data) {
    this.id = data.id || 'system';
    this.companyName = data.companyName || '';
    this.companyLogo = data.companyLogo || '';
    this.primaryColor = data.primaryColor || '#1976d2';
    this.secondaryColor = data.secondaryColor || '#424242';
    this.accentColor = data.accentColor || '#ff4081';
    this.dateFormat = data.dateFormat || 'MM/DD/YYYY';
    this.timeFormat = data.timeFormat || '12h';
    this.timezone = data.timezone || 'America/New_York';
    this.defaultLanguage = data.defaultLanguage || 'en';
    this.supportedLanguages = data.supportedLanguages || ['en'];
    this.currency = data.currency || 'USD';
    this.measurementSystem = data.measurementSystem || 'imperial'; // imperial, metric
    this.emailNotifications = data.emailNotifications !== false;
    this.smsNotifications = data.smsNotifications || false;
    this.pushNotifications = data.pushNotifications || false;
    this.maintenanceMode = data.maintenanceMode || false;
    this.maintenanceMessage = data.maintenanceMessage || '';
    this.systemVersion = data.systemVersion || '1.0.0';
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.updatedBy = data.updatedBy || '';
  }
}

// Module Configuration Model
export class ModuleConfigModel {
  constructor(data) {
    this.id = data.id || '';
    this.moduleName = data.moduleName || '';
    this.moduleKey = data.moduleKey || '';
    this.isEnabled = data.isEnabled !== false;
    this.displayOrder = data.displayOrder || 0;
    this.icon = data.icon || '';
    this.description = data.description || '';
    this.requiredRoles = data.requiredRoles || [];
    this.settings = data.settings || {};
    this.customFields = data.customFields || [];
    this.workflows = data.workflows || [];
    this.integrations = data.integrations || [];
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.updatedBy = data.updatedBy || '';
  }
}

// User Role Model
export class UserRoleModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.isSystem = data.isSystem || false;
    this.isDefault = data.isDefault || false;
    this.permissions = data.permissions || {};
    this.moduleAccess = data.moduleAccess || {};
    this.dataAccess = data.dataAccess || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy || '';
    this.updatedBy = data.updatedBy || '';
  }
}

// Custom Field Model
export class CustomFieldModel {
  constructor(data) {
    this.id = data.id || '';
    this.entityType = data.entityType || ''; // JOB, PIECE, CONTACT, etc.
    this.name = data.name || '';
    this.label = data.label || '';
    this.type = data.type || 'TEXT'; // TEXT, NUMBER, DATE, SELECT, MULTISELECT, CHECKBOX, etc.
    this.description = data.description || '';
    this.placeholder = data.placeholder || '';
    this.defaultValue = data.defaultValue || null;
    this.options = data.options || []; // For SELECT and MULTISELECT types
    this.validation = data.validation || {
      required: false,
      min: null,
      max: null,
      pattern: null,
      customValidator: null
    };
    this.displayOrder = data.displayOrder || 0;
    this.isActive = data.isActive !== false;
    this.isSystem = data.isSystem || false;
    this.isSearchable = data.isSearchable || false;
    this.isFilterable = data.isFilterable || false;
    this.showInList = data.showInList || false;
    this.showInDetail = data.showInDetail !== false;
    this.accessControl = data.accessControl || {
      viewRoles: [],
      editRoles: []
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy || '';
    this.updatedBy = data.updatedBy || '';
  }
}

// Workflow Model
export class WorkflowModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.entityType = data.entityType || ''; // JOB, PIECE, CONTACT, etc.
    this.triggerType = data.triggerType || 'STATUS_CHANGE'; // STATUS_CHANGE, FIELD_CHANGE, SCHEDULED, MANUAL
    this.triggerConditions = data.triggerConditions || {};
    this.isActive = data.isActive !== false;
    this.steps = data.steps || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy || '';
    this.updatedBy = data.updatedBy || '';
  }
}

// Workflow Step Model
export class WorkflowStepModel {
  constructor(data) {
    this.id = data.id || '';
    this.workflowId = data.workflowId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ''; // NOTIFICATION, FIELD_UPDATE, API_CALL, APPROVAL, CUSTOM
    this.order = data.order || 0;
    this.config = data.config || {};
    this.conditions = data.conditions || [];
    this.isActive = data.isActive !== false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Notification Template Model
export class NotificationTemplateModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || 'EMAIL'; // EMAIL, SMS, PUSH, IN_APP
    this.subject = data.subject || '';
    this.content = data.content || '';
    this.variables = data.variables || [];
    this.isSystem = data.isSystem || false;
    this.isActive = data.isActive !== false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy || '';
    this.updatedBy = data.updatedBy || '';
  }
}

// Integration Model
export class IntegrationModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ''; // ERP, CRM, ACCOUNTING, CAD, etc.
    this.provider = data.provider || '';
    this.isEnabled = data.isEnabled || false;
    this.config = data.config || {};
    this.credentials = data.credentials || {};
    this.syncSettings = data.syncSettings || {
      direction: 'BIDIRECTIONAL', // INBOUND, OUTBOUND, BIDIRECTIONAL
      frequency: 'DAILY', // REALTIME, HOURLY, DAILY, WEEKLY
      entities: []
    };
    this.lastSyncAt = data.lastSyncAt || null;
    this.lastSyncStatus = data.lastSyncStatus || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy || '';
    this.updatedBy = data.updatedBy || '';
  }
}

// Audit Log Model
export class AuditLogModel {
  constructor(data) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.userName = data.userName || '';
    this.action = data.action || ''; // CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.
    this.entityType = data.entityType || '';
    this.entityId = data.entityId || '';
    this.entityName = data.entityName || '';
    this.details = data.details || {};
    this.ipAddress = data.ipAddress || '';
    this.userAgent = data.userAgent || '';
    this.timestamp = data.timestamp || new Date().toISOString();
  }
}

// System Health Model
export class SystemHealthModel {
  constructor(data) {
    this.status = data.status || 'HEALTHY'; // HEALTHY, DEGRADED, MAINTENANCE, DOWN
    this.uptime = data.uptime || 0;
    this.lastChecked = data.lastChecked || new Date().toISOString();
    this.components = data.components || [];
    this.metrics = data.metrics || {
      cpu: 0,
      memory: 0,
      storage: 0,
      activeUsers: 0,
      requestsPerMinute: 0
    };
    this.alerts = data.alerts || [];
    this.maintenanceSchedule = data.maintenanceSchedule || [];
  }
}

// Export default models
export default {
  SystemConfigModel,
  ModuleConfigModel,
  UserRoleModel,
  CustomFieldModel,
  WorkflowModel,
  WorkflowStepModel,
  NotificationTemplateModel,
  IntegrationModel,
  AuditLogModel,
  SystemHealthModel
};
