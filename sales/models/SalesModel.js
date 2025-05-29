/**
 * Sales Module Models
 * Defines data models for the Sales module
 */

// Lead Model
export class LeadModel {
  constructor(data) {
    this.id = data.id || '';
    this.leadNumber = data.leadNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.source = data.source || '';
    this.status = data.status || 'NEW'; // NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST, INACTIVE
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.type = data.type || '';
    this.category = data.category || '';
    this.value = data.value || 0;
    this.probability = data.probability || 0;
    this.expectedCloseDate = data.expectedCloseDate || null;
    this.actualCloseDate = data.actualCloseDate || null;
    this.companyId = data.companyId || '';
    this.companyName = data.companyName || '';
    this.contactId = data.contactId || '';
    this.contactName = data.contactName || '';
    this.contactEmail = data.contactEmail || '';
    this.contactPhone = data.contactPhone || '';
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
    this.projectDetails = data.projectDetails || {
      projectType: '',
      projectSize: '',
      timeline: '',
      budget: 0,
      specialRequirements: ''
    };
    this.requirements = data.requirements || [];
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.assignedTo = data.assignedTo || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.activities = data.activities || [];
    this.documents = data.documents || [];
    this.proposals = data.proposals || [];
    this.competitors = data.competitors || [];
    this.lostReason = data.lostReason || '';
    this.winReason = data.winReason || '';
    this.nextSteps = data.nextSteps || '';
    this.nextContactDate = data.nextContactDate || null;
  }
}

// Opportunity Model
export class OpportunityModel {
  constructor(data) {
    this.id = data.id || '';
    this.opportunityNumber = data.opportunityNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.source = data.source || '';
    this.status = data.status || 'OPEN'; // OPEN, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST, INACTIVE
    this.stage = data.stage || '';
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.type = data.type || '';
    this.category = data.category || '';
    this.value = data.value || 0;
    this.probability = data.probability || 0;
    this.expectedCloseDate = data.expectedCloseDate || null;
    this.actualCloseDate = data.actualCloseDate || null;
    this.leadId = data.leadId || '';
    this.companyId = data.companyId || '';
    this.companyName = data.companyName || '';
    this.contactId = data.contactId || '';
    this.contactName = data.contactName || '';
    this.contactEmail = data.contactEmail || '';
    this.contactPhone = data.contactPhone || '';
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
    this.projectDetails = data.projectDetails || {
      projectType: '',
      projectSize: '',
      timeline: '',
      budget: 0,
      specialRequirements: ''
    };
    this.requirements = data.requirements || [];
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.assignedTo = data.assignedTo || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.activities = data.activities || [];
    this.documents = data.documents || [];
    this.proposals = data.proposals || [];
    this.competitors = data.competitors || [];
    this.lostReason = data.lostReason || '';
    this.winReason = data.winReason || '';
    this.nextSteps = data.nextSteps || '';
    this.nextContactDate = data.nextContactDate || null;
    this.products = data.products || [];
    this.quotes = data.quotes || [];
    this.contracts = data.contracts || [];
    this.decisionMakers = data.decisionMakers || [];
    this.stakeholders = data.stakeholders || [];
    this.salesTeam = data.salesTeam || [];
    this.timeline = data.timeline || [];
    this.risks = data.risks || [];
    this.successFactors = data.successFactors || [];
  }
}

// Quote Model
export class QuoteModel {
  constructor(data) {
    this.id = data.id || '';
    this.quoteNumber = data.quoteNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || 'DRAFT'; // DRAFT, SENT, VIEWED, ACCEPTED, REJECTED, EXPIRED, REVISED
    this.version = data.version || '1.0';
    this.opportunityId = data.opportunityId || '';
    this.companyId = data.companyId || '';
    this.companyName = data.companyName || '';
    this.contactId = data.contactId || '';
    this.contactName = data.contactName || '';
    this.contactEmail = data.contactEmail || '';
    this.contactPhone = data.contactPhone || '';
    this.validUntil = data.validUntil || null;
    this.terms = data.terms || '';
    this.notes = data.notes || '';
    this.subtotal = data.subtotal || 0;
    this.discountType = data.discountType || 'PERCENTAGE'; // PERCENTAGE, AMOUNT, NONE
    this.discountValue = data.discountValue || 0;
    this.discountTotal = data.discountTotal || 0;
    this.taxRate = data.taxRate || 0;
    this.taxTotal = data.taxTotal || 0;
    this.shippingTotal = data.shippingTotal || 0;
    this.total = data.total || 0;
    this.currency = data.currency || 'USD';
    this.items = data.items || [];
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.sentAt = data.sentAt || null;
    this.viewedAt = data.viewedAt || null;
    this.acceptedAt = data.acceptedAt || null;
    this.acceptedBy = data.acceptedBy || '';
    this.rejectedAt = data.rejectedAt || null;
    this.rejectedBy = data.rejectedBy || '';
    this.rejectionReason = data.rejectionReason || '';
    this.documents = data.documents || [];
    this.attachments = data.attachments || [];
    this.revisionHistory = data.revisionHistory || [];
    this.paymentTerms = data.paymentTerms || '';
    this.deliveryTerms = data.deliveryTerms || '';
    this.shippingMethod = data.shippingMethod || '';
    this.shippingAddress = data.shippingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.billingAddress = data.billingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
  }
}

// Quote Item Model
export class QuoteItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.quoteId = data.quoteId || '';
    this.productId = data.productId || '';
    this.productName = data.productName || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 1;
    this.unitPrice = data.unitPrice || 0;
    this.unitCost = data.unitCost || 0;
    this.unitOfMeasure = data.unitOfMeasure || '';
    this.discountType = data.discountType || 'PERCENTAGE'; // PERCENTAGE, AMOUNT, NONE
    this.discountValue = data.discountValue || 0;
    this.discountTotal = data.discountTotal || 0;
    this.taxRate = data.taxRate || 0;
    this.taxTotal = data.taxTotal || 0;
    this.total = data.total || 0;
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.sortOrder = data.sortOrder || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Contract Model
export class ContractModel {
  constructor(data) {
    this.id = data.id || '';
    this.contractNumber = data.contractNumber || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || 'DRAFT'; // DRAFT, SENT, NEGOTIATION, SIGNED, ACTIVE, COMPLETED, TERMINATED, EXPIRED
    this.type = data.type || '';
    this.opportunityId = data.opportunityId || '';
    this.quoteId = data.quoteId || '';
    this.companyId = data.companyId || '';
    this.companyName = data.companyName || '';
    this.contactId = data.contactId || '';
    this.contactName = data.contactName || '';
    this.contactEmail = data.contactEmail || '';
    this.contactPhone = data.contactPhone || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.signedDate = data.signedDate || null;
    this.value = data.value || 0;
    this.currency = data.currency || 'USD';
    this.terms = data.terms || '';
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.sentAt = data.sentAt || null;
    this.signedBy = data.signedBy || '';
    this.terminatedAt = data.terminatedAt || null;
    this.terminatedBy = data.terminatedBy || '';
    this.terminationReason = data.terminationReason || '';
    this.documents = data.documents || [];
    this.attachments = data.attachments || [];
    this.revisionHistory = data.revisionHistory || [];
    this.paymentTerms = data.paymentTerms || '';
    this.paymentSchedule = data.paymentSchedule || [];
    this.deliveryTerms = data.deliveryTerms || '';
    this.deliverySchedule = data.deliverySchedule || [];
    this.legalTerms = data.legalTerms || '';
    this.specialConditions = data.specialConditions || '';
    this.warrantiesGuarantees = data.warrantiesGuarantees || '';
    this.confidentialityTerms = data.confidentialityTerms || '';
    this.intellectualPropertyTerms = data.intellectualPropertyTerms || '';
    this.terminationTerms = data.terminationTerms || '';
    this.disputeResolutionTerms = data.disputeResolutionTerms || '';
    this.governingLaw = data.governingLaw || '';
    this.signatories = data.signatories || [];
    this.witnesses = data.witnesses || [];
    this.amendments = data.amendments || [];
  }
}

// Product Model
export class ProductModel {
  constructor(data) {
    this.id = data.id || '';
    this.productCode = data.productCode || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || '';
    this.category = data.category || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, DISCONTINUED
    this.unitPrice = data.unitPrice || 0;
    this.unitCost = data.unitCost || 0;
    this.unitOfMeasure = data.unitOfMeasure || '';
    this.taxRate = data.taxRate || 0;
    this.taxable = data.taxable || true;
    this.dimensions = data.dimensions || {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      volume: 0
    };
    this.specifications = data.specifications || {};
    this.features = data.features || [];
    this.options = data.options || [];
    this.variants = data.variants || [];
    this.images = data.images || [];
    this.documents = data.documents || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Sales Activity Model
export class SalesActivityModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || ''; // CALL, EMAIL, MEETING, TASK, NOTE, OTHER
    this.subject = data.subject || '';
    this.description = data.description || '';
    this.status = data.status || 'PENDING'; // PENDING, COMPLETED, CANCELLED
    this.priority = data.priority || 'MEDIUM'; // LOW, MEDIUM, HIGH, URGENT
    this.leadId = data.leadId || '';
    this.opportunityId = data.opportunityId || '';
    this.companyId = data.companyId || '';
    this.contactId = data.contactId || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.duration = data.duration || 0;
    this.location = data.location || '';
    this.outcome = data.outcome || '';
    this.followUpType = data.followUpType || '';
    this.followUpDate = data.followUpDate || null;
    this.assignedTo = data.assignedTo || '';
    this.participants = data.participants || [];
    this.documents = data.documents || [];
    this.attachments = data.attachments || [];
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.tags = data.tags || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.completedBy = data.completedBy || '';
    this.completedAt = data.completedAt || null;
    this.cancelledBy = data.cancelledBy || '';
    this.cancelledAt = data.cancelledAt || null;
    this.cancellationReason = data.cancellationReason || '';
  }
}

// Sales Dashboard Model
export class SalesDashboardModel {
  constructor(data) {
    this.leadStats = data.leadStats || {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      won: 0,
      lost: 0,
      inactive: 0
    };
    this.opportunityStats = data.opportunityStats || {
      total: 0,
      open: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      won: 0,
      lost: 0,
      inactive: 0
    };
    this.quoteStats = data.quoteStats || {
      total: 0,
      draft: 0,
      sent: 0,
      viewed: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
      revised: 0
    };
    this.contractStats = data.contractStats || {
      total: 0,
      draft: 0,
      sent: 0,
      negotiation: 0,
      signed: 0,
      active: 0,
      completed: 0,
      terminated: 0,
      expired: 0
    };
    this.salesPerformance = data.salesPerformance || {
      currentPeriodRevenue: 0,
      previousPeriodRevenue: 0,
      revenueGrowth: 0,
      currentPeriodDeals: 0,
      previousPeriodDeals: 0,
      dealGrowth: 0,
      averageDealSize: 0,
      conversionRate: 0,
      winRate: 0,
      salesCycle: 0
    };
    this.salesForecast = data.salesForecast || {
      currentPeriod: 0,
      nextPeriod: 0,
      quarterForecast: 0,
      yearForecast: 0,
      pipelineValue: 0,
      weightedPipelineValue: 0
    };
    this.salesByProduct = data.salesByProduct || [];
    this.salesByCategory = data.salesByCategory || [];
    this.salesByRegion = data.salesByRegion || [];
    this.salesByRepresentative = data.salesByRepresentative || [];
    this.topDeals = data.topDeals || [];
    this.recentActivities = data.recentActivities || [];
    this.upcomingActivities = data.upcomingActivities || [];
    this.leadSources = data.leadSources || [];
    this.salesTrends = data.salesTrends || {
      revenue: [],
      deals: [],
      pipeline: []
    };
  }
}

// Export default models
export default {
  LeadModel,
  OpportunityModel,
  QuoteModel,
  QuoteItemModel,
  ContractModel,
  ProductModel,
  SalesActivityModel,
  SalesDashboardModel
};
