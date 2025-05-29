/**
 * Contact Management Module Models
 * Defines data models for the Contact Management module
 */

// Contact Model
export class ContactModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || 'INDIVIDUAL'; // INDIVIDUAL, COMPANY, VENDOR, CLIENT, PARTNER, OTHER
    this.category = data.category || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, LEAD, PROSPECT, CUSTOMER, ARCHIVED
    this.salutation = data.salutation || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.displayName = data.displayName || '';
    this.jobTitle = data.jobTitle || '';
    this.department = data.department || '';
    this.companyId = data.companyId || '';
    this.companyName = data.companyName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.mobile = data.mobile || '';
    this.fax = data.fax || '';
    this.website = data.website || '';
    this.address = data.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.mailingAddress = data.mailingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.useMailingAddressForBilling = data.useMailingAddressForBilling !== false;
    this.billingAddress = data.billingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.socialMedia = data.socialMedia || {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      other: ''
    };
    this.preferredContactMethod = data.preferredContactMethod || 'EMAIL'; // EMAIL, PHONE, MOBILE, MAIL
    this.timezone = data.timezone || 'America/New_York';
    this.language = data.language || 'en';
    this.birthday = data.birthday || null;
    this.anniversary = data.anniversary || null;
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.profileImage = data.profileImage || '';
    this.assignedTo = data.assignedTo || '';
    this.assignedToName = data.assignedToName || '';
    this.source = data.source || '';
    this.leadSource = data.leadSource || '';
    this.leadStatus = data.leadStatus || '';
    this.leadScore = data.leadScore || 0;
    this.lastContactDate = data.lastContactDate || null;
    this.nextFollowUpDate = data.nextFollowUpDate || null;
    this.relationships = data.relationships || [];
    this.projects = data.projects || [];
    this.jobs = data.jobs || [];
    this.activities = data.activities || [];
    this.documents = data.documents || [];
    this.permissions = data.permissions || {
      viewable: [],
      editable: []
    };
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Company Model
export class CompanyModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || 'COMPANY'; // COMPANY, VENDOR, CLIENT, PARTNER, OTHER
    this.category = data.category || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, LEAD, PROSPECT, CUSTOMER, ARCHIVED
    this.name = data.name || '';
    this.legalName = data.legalName || '';
    this.industry = data.industry || '';
    this.description = data.description || '';
    this.size = data.size || '';
    this.yearFounded = data.yearFounded || null;
    this.revenue = data.revenue || '';
    this.website = data.website || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.fax = data.fax || '';
    this.address = data.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.mailingAddress = data.mailingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.useMailingAddressForBilling = data.useMailingAddressForBilling !== false;
    this.billingAddress = data.billingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.socialMedia = data.socialMedia || {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      other: ''
    };
    this.taxId = data.taxId || '';
    this.registrationNumber = data.registrationNumber || '';
    this.logo = data.logo || '';
    this.primaryContactId = data.primaryContactId || '';
    this.primaryContactName = data.primaryContactName || '';
    this.contacts = data.contacts || [];
    this.parentCompanyId = data.parentCompanyId || '';
    this.parentCompanyName = data.parentCompanyName || '';
    this.subsidiaries = data.subsidiaries || [];
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.assignedTo = data.assignedTo || '';
    this.assignedToName = data.assignedToName || '';
    this.source = data.source || '';
    this.leadSource = data.leadSource || '';
    this.leadStatus = data.leadStatus || '';
    this.leadScore = data.leadScore || 0;
    this.lastContactDate = data.lastContactDate || null;
    this.nextFollowUpDate = data.nextFollowUpDate || null;
    this.relationships = data.relationships || [];
    this.projects = data.projects || [];
    this.jobs = data.jobs || [];
    this.activities = data.activities || [];
    this.documents = data.documents || [];
    this.permissions = data.permissions || {
      viewable: [],
      editable: []
    };
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Relationship Model
export class RelationshipModel {
  constructor(data) {
    this.id = data.id || '';
    this.sourceId = data.sourceId || '';
    this.sourceType = data.sourceType || ''; // CONTACT, COMPANY
    this.sourceName = data.sourceName || '';
    this.targetId = data.targetId || '';
    this.targetType = data.targetType || ''; // CONTACT, COMPANY
    this.targetName = data.targetName || '';
    this.type = data.type || ''; // EMPLOYEE, CUSTOMER, VENDOR, PARTNER, FAMILY, FRIEND, OTHER
    this.role = data.role || '';
    this.description = data.description || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.isActive = data.isActive !== false;
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Activity Model
export class ActivityModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || ''; // CALL, EMAIL, MEETING, TASK, NOTE, OTHER
    this.subject = data.subject || '';
    this.description = data.description || '';
    this.status = data.status || 'PENDING'; // PENDING, COMPLETED, CANCELLED
    this.priority = data.priority || 'NORMAL'; // LOW, NORMAL, HIGH, URGENT
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.duration = data.duration || 0; // In minutes
    this.location = data.location || '';
    this.isAllDay = data.isAllDay || false;
    this.reminder = data.reminder || null;
    this.recurrence = data.recurrence || null;
    this.outcome = data.outcome || '';
    this.relatedTo = data.relatedTo || []; // Array of related entities (contacts, companies, projects, etc.)
    this.assignedTo = data.assignedTo || '';
    this.assignedToName = data.assignedToName || '';
    this.participants = data.participants || [];
    this.attachments = data.attachments || [];
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.completedBy = data.completedBy || '';
    this.completedAt = data.completedAt || null;
  }
}

// Group Model
export class GroupModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ''; // STATIC, DYNAMIC
    this.criteria = data.criteria || null; // For dynamic groups
    this.members = data.members || []; // For static groups
    this.memberCount = data.memberCount || 0;
    this.isPublic = data.isPublic || false;
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Import/Export Job Model
export class ImportExportJobModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || 'IMPORT'; // IMPORT, EXPORT
    this.source = data.source || ''; // CSV, EXCEL, API, OTHER
    this.status = data.status || 'PENDING'; // PENDING, PROCESSING, COMPLETED, FAILED
    this.progress = data.progress || 0; // 0-100
    this.totalRecords = data.totalRecords || 0;
    this.processedRecords = data.processedRecords || 0;
    this.successfulRecords = data.successfulRecords || 0;
    this.failedRecords = data.failedRecords || 0;
    this.duplicateRecords = data.duplicateRecords || 0;
    this.errors = data.errors || [];
    this.warnings = data.warnings || [];
    this.mappings = data.mappings || {};
    this.options = data.options || {};
    this.fileUrl = data.fileUrl || '';
    this.resultFileUrl = data.resultFileUrl || '';
    this.startedAt = data.startedAt || null;
    this.completedAt = data.completedAt || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Merge Record Model
export class MergeRecordModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || ''; // CONTACT, COMPANY
    this.primaryRecordId = data.primaryRecordId || '';
    this.secondaryRecordIds = data.secondaryRecordIds || [];
    this.mergeFields = data.mergeFields || {};
    this.status = data.status || 'PENDING'; // PENDING, COMPLETED, FAILED
    this.result = data.result || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.completedAt = data.completedAt || null;
  }
}

// Contact Dashboard Model
export class ContactDashboardModel {
  constructor(data) {
    this.contactStats = data.contactStats || {
      total: 0,
      active: 0,
      inactive: 0,
      leads: 0,
      prospects: 0,
      customers: 0
    };
    this.companyStats = data.companyStats || {
      total: 0,
      active: 0,
      inactive: 0,
      leads: 0,
      prospects: 0,
      customers: 0
    };
    this.activityStats = data.activityStats || {
      total: 0,
      pending: 0,
      completed: 0,
      overdue: 0,
      upcoming: 0
    };
    this.contactsByType = data.contactsByType || [];
    this.contactsBySource = data.contactsBySource || [];
    this.contactsByIndustry = data.contactsByIndustry || [];
    this.contactsByLocation = data.contactsByLocation || [];
    this.recentContacts = data.recentContacts || [];
    this.recentCompanies = data.recentCompanies || [];
    this.upcomingActivities = data.upcomingActivities || [];
    this.overdueActivities = data.overdueActivities || [];
    this.leadConversionRate = data.leadConversionRate || 0;
    this.contactGrowthRate = data.contactGrowthRate || 0;
    this.topPerformers = data.topPerformers || [];
  }
}

// Communication Template Model
export class CommunicationTemplateModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || ''; // EMAIL, SMS, LETTER, OTHER
    this.category = data.category || '';
    this.subject = data.subject || '';
    this.content = data.content || '';
    this.variables = data.variables || [];
    this.attachments = data.attachments || [];
    this.isActive = data.isActive !== false;
    this.isDefault = data.isDefault || false;
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Communication Log Model
export class CommunicationLogModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || ''; // EMAIL, SMS, CALL, MEETING, OTHER
    this.direction = data.direction || 'OUTBOUND'; // INBOUND, OUTBOUND
    this.subject = data.subject || '';
    this.content = data.content || '';
    this.status = data.status || ''; // SENT, DELIVERED, READ, FAILED, DRAFT
    this.recipients = data.recipients || [];
    this.sender = data.sender || '';
    this.senderName = data.senderName || '';
    this.templateId = data.templateId || '';
    this.templateName = data.templateName || '';
    this.attachments = data.attachments || [];
    this.metadata = data.metadata || {};
    this.sentAt = data.sentAt || null;
    this.deliveredAt = data.deliveredAt || null;
    this.readAt = data.readAt || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Contact Preference Model
export class ContactPreferenceModel {
  constructor(data) {
    this.id = data.id || '';
    this.contactId = data.contactId || '';
    this.contactName = data.contactName || '';
    this.emailSubscription = data.emailSubscription || {
      marketing: true,
      newsletter: true,
      productUpdates: true,
      events: true
    };
    this.smsSubscription = data.smsSubscription || {
      marketing: false,
      alerts: true,
      reminders: true
    };
    this.callPreferences = data.callPreferences || {
      allowCalls: true,
      preferredTimes: [],
      notes: ''
    };
    this.mailingPreferences = data.mailingPreferences || {
      allowMail: true,
      preferredAddress: 'PRIMARY' // PRIMARY, MAILING, BILLING
    };
    this.communicationFrequency = data.communicationFrequency || 'NORMAL'; // MINIMAL, NORMAL, FREQUENT
    this.preferredLanguage = data.preferredLanguage || 'en';
    this.doNotContact = data.doNotContact || false;
    this.unsubscribeReason = data.unsubscribeReason || '';
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.updatedBy = data.updatedBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Export default models
export default {
  ContactModel,
  CompanyModel,
  RelationshipModel,
  ActivityModel,
  GroupModel,
  ImportExportJobModel,
  MergeRecordModel,
  ContactDashboardModel,
  CommunicationTemplateModel,
  CommunicationLogModel,
  ContactPreferenceModel
};
