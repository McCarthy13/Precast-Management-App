/**
 * Purchasing Module Models
 * Defines data models for the Purchasing/Receiving module
 */

// Vendor Model
export class VendorModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.code = data.code || '';
    this.type = data.type || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, PENDING_APPROVAL, BLACKLISTED
    this.isApproved = data.isApproved !== false;
    this.contactInfo = data.contactInfo || {
      primaryContact: '',
      phone: '',
      email: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    };
    this.taxInfo = data.taxInfo || {
      taxId: '',
      taxClassification: '',
      taxExempt: false,
      taxExemptionCertificate: ''
    };
    this.paymentTerms = data.paymentTerms || '';
    this.paymentMethods = data.paymentMethods || [];
    this.shippingTerms = data.shippingTerms || '';
    this.leadTime = data.leadTime || 0; // In days
    this.minimumOrderValue = data.minimumOrderValue || 0;
    this.preferredCurrency = data.preferredCurrency || 'USD';
    this.categories = data.categories || [];
    this.materials = data.materials || [];
    this.services = data.services || [];
    this.performanceRating = data.performanceRating || 0; // 0-5
    this.qualityRating = data.qualityRating || 0; // 0-5
    this.reliabilityRating = data.reliabilityRating || 0; // 0-5
    this.costRating = data.costRating || 0; // 0-5
    this.overallRating = data.overallRating || 0; // 0-5
    this.notes = data.notes || '';
    this.documents = data.documents || [];
    this.certifications = data.certifications || [];
    this.insuranceInfo = data.insuranceInfo || {
      hasInsurance: false,
      insuranceProvider: '',
      policyNumber: '',
      coverageAmount: 0,
      expirationDate: null
    };
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Purchase Agreement Model
export class PurchaseAgreementModel {
  constructor(data) {
    this.id = data.id || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.title = data.title || '';
    this.type = data.type || ''; // BLANKET, FIXED_PRICE, TIME_AND_MATERIALS, COST_PLUS
    this.status = data.status || 'DRAFT'; // DRAFT, PENDING_APPROVAL, ACTIVE, EXPIRED, TERMINATED
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.autoRenew = data.autoRenew || false;
    this.renewalTerms = data.renewalTerms || '';
    this.terminationTerms = data.terminationTerms || '';
    this.description = data.description || '';
    this.items = data.items || [];
    this.totalValue = data.totalValue || 0;
    this.currency = data.currency || 'USD';
    this.paymentTerms = data.paymentTerms || '';
    this.deliveryTerms = data.deliveryTerms || '';
    this.specialTerms = data.specialTerms || '';
    this.approvalWorkflow = data.approvalWorkflow || {
      currentStage: '',
      approvers: [],
      approvalHistory: []
    };
    this.documents = data.documents || [];
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Purchase Agreement Item Model
export class PurchaseAgreementItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.agreementId = data.agreementId || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.unitPrice = data.unitPrice || 0;
    this.currency = data.currency || 'USD';
    this.unit = data.unit || '';
    this.quantity = data.quantity || 0;
    this.minimumOrderQuantity = data.minimumOrderQuantity || 0;
    this.discountPercentage = data.discountPercentage || 0;
    this.taxRate = data.taxRate || 0;
    this.totalPrice = data.totalPrice || 0;
    this.deliveryLeadTime = data.deliveryLeadTime || 0; // In days
    this.warrantyPeriod = data.warrantyPeriod || 0; // In months
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Purchase Order Model
export class PurchaseOrderModel {
  constructor(data) {
    this.id = data.id || '';
    this.poNumber = data.poNumber || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.agreementId = data.agreementId || '';
    this.jobId = data.jobId || '';
    this.jobName = data.jobName || '';
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.type = data.type || 'STANDARD'; // STANDARD, BLANKET_RELEASE, EMERGENCY, RETURN
    this.status = data.status || 'DRAFT'; // DRAFT, PENDING_APPROVAL, APPROVED, SENT, ACKNOWLEDGED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED, CLOSED
    this.priority = data.priority || 'NORMAL'; // LOW, NORMAL, HIGH, URGENT
    this.orderDate = data.orderDate || new Date().toISOString();
    this.expectedDeliveryDate = data.expectedDeliveryDate || null;
    this.deliveryLocation = data.deliveryLocation || '';
    this.shippingMethod = data.shippingMethod || '';
    this.shippingTerms = data.shippingTerms || '';
    this.paymentTerms = data.paymentTerms || '';
    this.currency = data.currency || 'USD';
    this.subtotal = data.subtotal || 0;
    this.taxAmount = data.taxAmount || 0;
    this.shippingAmount = data.shippingAmount || 0;
    this.discountAmount = data.discountAmount || 0;
    this.totalAmount = data.totalAmount || 0;
    this.items = data.items || [];
    this.notes = data.notes || '';
    this.internalNotes = data.internalNotes || '';
    this.attachments = data.attachments || [];
    this.approvalWorkflow = data.approvalWorkflow || {
      currentStage: '',
      approvers: [],
      approvalHistory: []
    };
    this.receivingStatus = data.receivingStatus || {
      fullyReceived: false,
      partiallyReceived: false,
      receivedItems: 0,
      totalItems: 0,
      lastReceiptDate: null
    };
    this.invoiceStatus = data.invoiceStatus || {
      fullyInvoiced: false,
      partiallyInvoiced: false,
      invoicedAmount: 0,
      remainingAmount: 0,
      lastInvoiceDate: null
    };
    this.paymentStatus = data.paymentStatus || {
      fullyPaid: false,
      partiallyPaid: false,
      paidAmount: 0,
      remainingAmount: 0,
      lastPaymentDate: null
    };
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Purchase Order Item Model
export class PurchaseOrderItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.agreementItemId = data.agreementItemId || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.unitPrice = data.unitPrice || 0;
    this.currency = data.currency || 'USD';
    this.unit = data.unit || '';
    this.quantity = data.quantity || 0;
    this.receivedQuantity = data.receivedQuantity || 0;
    this.rejectedQuantity = data.rejectedQuantity || 0;
    this.backorderedQuantity = data.backorderedQuantity || 0;
    this.discountPercentage = data.discountPercentage || 0;
    this.taxRate = data.taxRate || 0;
    this.subtotal = data.subtotal || 0;
    this.taxAmount = data.taxAmount || 0;
    this.discountAmount = data.discountAmount || 0;
    this.totalPrice = data.totalPrice || 0;
    this.deliveryDate = data.deliveryDate || null;
    this.status = data.status || 'PENDING'; // PENDING, PARTIALLY_RECEIVED, RECEIVED, CANCELLED
    this.notes = data.notes || '';
    this.jobId = data.jobId || '';
    this.projectId = data.projectId || '';
    this.costCode = data.costCode || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Receiving Record Model
export class ReceivingRecordModel {
  constructor(data) {
    this.id = data.id || '';
    this.receiptNumber = data.receiptNumber || '';
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.poNumber = data.poNumber || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.receivedBy = data.receivedBy || '';
    this.receivedByName = data.receivedByName || '';
    this.receivedDate = data.receivedDate || new Date().toISOString();
    this.deliveryLocation = data.deliveryLocation || '';
    this.carrierName = data.carrierName || '';
    this.trackingNumber = data.trackingNumber || '';
    this.packageCount = data.packageCount || 0;
    this.status = data.status || 'PENDING_INSPECTION'; // PENDING_INSPECTION, INSPECTED, COMPLETED, REJECTED
    this.items = data.items || [];
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Receiving Item Model
export class ReceivingItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.receivingRecordId = data.receivingRecordId || '';
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.purchaseOrderItemId = data.purchaseOrderItemId || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.description = data.description || '';
    this.orderedQuantity = data.orderedQuantity || 0;
    this.previouslyReceivedQuantity = data.previouslyReceivedQuantity || 0;
    this.receivedQuantity = data.receivedQuantity || 0;
    this.rejectedQuantity = data.rejectedQuantity || 0;
    this.unit = data.unit || '';
    this.lotNumber = data.lotNumber || '';
    this.serialNumbers = data.serialNumbers || [];
    this.expirationDate = data.expirationDate || null;
    this.storageLocation = data.storageLocation || '';
    this.inspectionStatus = data.inspectionStatus || 'PENDING'; // PENDING, PASSED, FAILED, CONDITIONALLY_PASSED
    this.inspectionNotes = data.inspectionNotes || '';
    this.inspectedBy = data.inspectedBy || '';
    this.inspectedDate = data.inspectedDate || null;
    this.qcSampleTaken = data.qcSampleTaken || false;
    this.qcSampleId = data.qcSampleId || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Material Model
export class MaterialModel {
  constructor(data) {
    this.id = data.id || '';
    this.code = data.code || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.type = data.type || '';
    this.unit = data.unit || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, PENDING_APPROVAL, DISCONTINUED
    this.specifications = data.specifications || {};
    this.minimumOrderQuantity = data.minimumOrderQuantity || 0;
    this.reorderPoint = data.reorderPoint || 0;
    this.targetStockLevel = data.targetStockLevel || 0;
    this.leadTime = data.leadTime || 0; // In days
    this.shelfLife = data.shelfLife || 0; // In days
    this.storageRequirements = data.storageRequirements || '';
    this.handlingInstructions = data.handlingInstructions || '';
    this.hazardous = data.hazardous || false;
    this.hazardousInfo = data.hazardousInfo || {
      class: '',
      unNumber: '',
      packingGroup: '',
      properShippingName: ''
    };
    this.defaultVendors = data.defaultVendors || [];
    this.costHistory = data.costHistory || [];
    this.currentCost = data.currentCost || 0;
    this.currency = data.currency || 'USD';
    this.taxRate = data.taxRate || 0;
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.certifications = data.certifications || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Invoice Model
export class InvoiceModel {
  constructor(data) {
    this.id = data.id || '';
    this.invoiceNumber = data.invoiceNumber || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.poNumber = data.poNumber || '';
    this.status = data.status || 'PENDING_APPROVAL'; // PENDING_APPROVAL, APPROVED, REJECTED, PAID, PARTIALLY_PAID, VOIDED
    this.invoiceDate = data.invoiceDate || new Date().toISOString();
    this.dueDate = data.dueDate || null;
    this.currency = data.currency || 'USD';
    this.subtotal = data.subtotal || 0;
    this.taxAmount = data.taxAmount || 0;
    this.shippingAmount = data.shippingAmount || 0;
    this.discountAmount = data.discountAmount || 0;
    this.totalAmount = data.totalAmount || 0;
    this.paidAmount = data.paidAmount || 0;
    this.remainingAmount = data.remainingAmount || 0;
    this.items = data.items || [];
    this.paymentTerms = data.paymentTerms || '';
    this.paymentDueDate = data.paymentDueDate || null;
    this.paymentMethod = data.paymentMethod || '';
    this.paymentReference = data.paymentReference || '';
    this.paymentDate = data.paymentDate || null;
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.approvalWorkflow = data.approvalWorkflow || {
      currentStage: '',
      approvers: [],
      approvalHistory: []
    };
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Invoice Item Model
export class InvoiceItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.invoiceId = data.invoiceId || '';
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.purchaseOrderItemId = data.purchaseOrderItemId || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 0;
    this.unit = data.unit || '';
    this.unitPrice = data.unitPrice || 0;
    this.discountPercentage = data.discountPercentage || 0;
    this.taxRate = data.taxRate || 0;
    this.subtotal = data.subtotal || 0;
    this.taxAmount = data.taxAmount || 0;
    this.discountAmount = data.discountAmount || 0;
    this.totalPrice = data.totalPrice || 0;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Vendor Performance Model
export class VendorPerformanceModel {
  constructor(data) {
    this.id = data.id || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.period = data.period || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.metrics = data.metrics || {
      deliveryPerformance: {
        onTimeDeliveries: 0,
        lateDeliveries: 0,
        averageDelay: 0,
        onTimePercentage: 0
      },
      qualityPerformance: {
        acceptedItems: 0,
        rejectedItems: 0,
        qualityIssues: 0,
        acceptanceRate: 0
      },
      costPerformance: {
        totalSpend: 0,
        savingsAchieved: 0,
        costVariance: 0,
        costVariancePercentage: 0
      },
      responsiveness: {
        averageResponseTime: 0,
        inquiriesResolved: 0,
        outstandingInquiries: 0
      },
      documentationAccuracy: {
        accurateDocuments: 0,
        inaccurateDocuments: 0,
        accuracyRate: 0
      }
    };
    this.overallScore = data.overallScore || 0; // 0-100
    this.rating = data.rating || 0; // 0-5
    this.strengths = data.strengths || [];
    this.weaknesses = data.weaknesses || [];
    this.improvementAreas = data.improvementAreas || [];
    this.notes = data.notes || '';
    this.reviewedBy = data.reviewedBy || '';
    this.reviewDate = data.reviewDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Request for Quote (RFQ) Model
export class RFQModel {
  constructor(data) {
    this.id = data.id || '';
    this.rfqNumber = data.rfqNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'DRAFT'; // DRAFT, SENT, RESPONSES_RECEIVED, AWARDED, CANCELLED, CLOSED
    this.type = data.type || 'STANDARD'; // STANDARD, EMERGENCY, BLANKET
    this.priority = data.priority || 'NORMAL'; // LOW, NORMAL, HIGH, URGENT
    this.jobId = data.jobId || '';
    this.jobName = data.jobName || '';
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.requestedBy = data.requestedBy || '';
    this.requestedByName = data.requestedByName || '';
    this.issueDate = data.issueDate || null;
    this.dueDate = data.dueDate || null;
    this.expectedDeliveryDate = data.expectedDeliveryDate || null;
    this.deliveryLocation = data.deliveryLocation || '';
    this.items = data.items || [];
    this.vendors = data.vendors || [];
    this.attachments = data.attachments || [];
    this.notes = data.notes || '';
    this.termsAndConditions = data.termsAndConditions || '';
    this.evaluationCriteria = data.evaluationCriteria || [];
    this.responses = data.responses || [];
    this.awardedVendorId = data.awardedVendorId || '';
    this.awardedVendorName = data.awardedVendorName || '';
    this.awardDate = data.awardDate || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// RFQ Item Model
export class RFQItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.rfqId = data.rfqId || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 0;
    this.unit = data.unit || '';
    this.targetPrice = data.targetPrice || 0;
    this.specifications = data.specifications || '';
    this.requiredCertifications = data.requiredCertifications || [];
    this.deliveryDate = data.deliveryDate || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// RFQ Response Model
export class RFQResponseModel {
  constructor(data) {
    this.id = data.id || '';
    this.rfqId = data.rfqId || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.status = data.status || 'SUBMITTED'; // SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED
    this.submissionDate = data.submissionDate || new Date().toISOString();
    this.validUntil = data.validUntil || null;
    this.totalPrice = data.totalPrice || 0;
    this.currency = data.currency || 'USD';
    this.deliveryTimeframe = data.deliveryTimeframe || 0; // In days
    this.paymentTerms = data.paymentTerms || '';
    this.shippingTerms = data.shippingTerms || '';
    this.items = data.items || [];
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.evaluationScore = data.evaluationScore || 0; // 0-100
    this.evaluationNotes = data.evaluationNotes || '';
    this.evaluatedBy = data.evaluatedBy || '';
    this.evaluationDate = data.evaluationDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// RFQ Response Item Model
export class RFQResponseItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.responseId = data.responseId || '';
    this.rfqItemId = data.rfqItemId || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 0;
    this.unit = data.unit || '';
    this.unitPrice = data.unitPrice || 0;
    this.totalPrice = data.totalPrice || 0;
    this.currency = data.currency || 'USD';
    this.deliveryDate = data.deliveryDate || null;
    this.alternativeOffered = data.alternativeOffered || false;
    this.alternativeDescription = data.alternativeDescription || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Purchase Requisition Model
export class PurchaseRequisitionModel {
  constructor(data) {
    this.id = data.id || '';
    this.requisitionNumber = data.requisitionNumber || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'DRAFT'; // DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CONVERTED_TO_PO, CANCELLED
    this.priority = data.priority || 'NORMAL'; // LOW, NORMAL, HIGH, URGENT
    this.type = data.type || 'STANDARD'; // STANDARD, EMERGENCY, BLANKET
    this.requestedBy = data.requestedBy || '';
    this.requestedByName = data.requestedByName || '';
    this.departmentId = data.departmentId || '';
    this.departmentName = data.departmentName || '';
    this.jobId = data.jobId || '';
    this.jobName = data.jobName || '';
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.requestDate = data.requestDate || new Date().toISOString();
    this.requiredDate = data.requiredDate || null;
    this.deliveryLocation = data.deliveryLocation || '';
    this.suggestedVendorId = data.suggestedVendorId || '';
    this.suggestedVendorName = data.suggestedVendorName || '';
    this.items = data.items || [];
    this.totalEstimatedCost = data.totalEstimatedCost || 0;
    this.currency = data.currency || 'USD';
    this.budgetCode = data.budgetCode || '';
    this.costCenter = data.costCenter || '';
    this.notes = data.notes || '';
    this.justification = data.justification || '';
    this.attachments = data.attachments || [];
    this.approvalWorkflow = data.approvalWorkflow || {
      currentStage: '',
      approvers: [],
      approvalHistory: []
    };
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.purchaseOrderNumber = data.purchaseOrderNumber || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Purchase Requisition Item Model
export class PurchaseRequisitionItemModel {
  constructor(data) {
    this.id = data.id || '';
    this.requisitionId = data.requisitionId || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 0;
    this.unit = data.unit || '';
    this.estimatedUnitPrice = data.estimatedUnitPrice || 0;
    this.estimatedTotalPrice = data.estimatedTotalPrice || 0;
    this.currency = data.currency || 'USD';
    this.requiredDate = data.requiredDate || null;
    this.suggestedVendorId = data.suggestedVendorId || '';
    this.suggestedVendorName = data.suggestedVendorName || '';
    this.notes = data.notes || '';
    this.status = data.status || 'PENDING'; // PENDING, APPROVED, REJECTED, ORDERED
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.purchaseOrderItemId = data.purchaseOrderItemId || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Vendor Certification Model
export class VendorCertificationModel {
  constructor(data) {
    this.id = data.id || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.name = data.name || '';
    this.type = data.type || '';
    this.issuingAuthority = data.issuingAuthority || '';
    this.certificationNumber = data.certificationNumber || '';
    this.issueDate = data.issueDate || null;
    this.expirationDate = data.expirationDate || null;
    this.status = data.status || 'ACTIVE'; // ACTIVE, EXPIRED, PENDING, REVOKED
    this.description = data.description || '';
    this.documentUrl = data.documentUrl || '';
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Material Certification Model
export class MaterialCertificationModel {
  constructor(data) {
    this.id = data.id || '';
    this.materialId = data.materialId || '';
    this.materialCode = data.materialCode || '';
    this.materialName = data.materialName || '';
    this.vendorId = data.vendorId || '';
    this.vendorName = data.vendorName || '';
    this.purchaseOrderId = data.purchaseOrderId || '';
    this.poNumber = data.poNumber || '';
    this.receivingRecordId = data.receivingRecordId || '';
    this.receiptNumber = data.receiptNumber || '';
    this.lotNumber = data.lotNumber || '';
    this.batchNumber = data.batchNumber || '';
    this.type = data.type || ''; // MILL_CERT, COA, COC, TEST_REPORT, OTHER
    this.certificationNumber = data.certificationNumber || '';
    this.issueDate = data.issueDate || null;
    this.expirationDate = data.expirationDate || null;
    this.status = data.status || 'ACTIVE'; // ACTIVE, EXPIRED, PENDING, REJECTED
    this.specifications = data.specifications || [];
    this.testResults = data.testResults || [];
    this.documentUrl = data.documentUrl || '';
    this.notes = data.notes || '';
    this.verifiedBy = data.verifiedBy || '';
    this.verificationDate = data.verificationDate || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Cost Saving Initiative Model
export class CostSavingInitiativeModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // NEGOTIATION, CONSOLIDATION, STANDARDIZATION, PROCESS_IMPROVEMENT, ALTERNATIVE_SOURCING, OTHER
    this.status = data.status || 'PROPOSED'; // PROPOSED, APPROVED, IN_PROGRESS, COMPLETED, REJECTED
    this.initiatedBy = data.initiatedBy || '';
    this.initiatedByName = data.initiatedByName || '';
    this.startDate = data.startDate || null;
    this.targetCompletionDate = data.targetCompletionDate || null;
    this.actualCompletionDate = data.actualCompletionDate || null;
    this.categories = data.categories || [];
    this.vendors = data.vendors || [];
    this.materials = data.materials || [];
    this.estimatedAnnualSavings = data.estimatedAnnualSavings || 0;
    this.actualAnnualSavings = data.actualAnnualSavings || 0;
    this.implementationCost = data.implementationCost || 0;
    this.roi = data.roi || 0;
    this.currency = data.currency || 'USD';
    this.savingsCalculationMethod = data.savingsCalculationMethod || '';
    this.implementationSteps = data.implementationSteps || [];
    this.stakeholders = data.stakeholders || [];
    this.risks = data.risks || [];
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Purchasing Dashboard Model
export class PurchasingDashboardModel {
  constructor(data) {
    this.purchaseOrderStats = data.purchaseOrderStats || {
      total: 0,
      draft: 0,
      pendingApproval: 0,
      approved: 0,
      sent: 0,
      partiallyReceived: 0,
      received: 0,
      cancelled: 0,
      closed: 0
    };
    this.invoiceStats = data.invoiceStats || {
      total: 0,
      pendingApproval: 0,
      approved: 0,
      rejected: 0,
      paid: 0,
      partiallyPaid: 0,
      overdue: 0
    };
    this.spendByCategory = data.spendByCategory || [];
    this.spendByVendor = data.spendByVendor || [];
    this.spendByMonth = data.spendByMonth || [];
    this.topVendors = data.topVendors || [];
    this.pendingDeliveries = data.pendingDeliveries || [];
    this.recentReceivingRecords = data.recentReceivingRecords || [];
    this.pendingApprovals = data.pendingApprovals || [];
    this.savingsTracking = data.savingsTracking || {
      targetAnnualSavings: 0,
      actualSavingsToDate: 0,
      savingsPercentage: 0,
      savingsByCategory: []
    };
    this.inventoryAlerts = data.inventoryAlerts || [];
    this.vendorPerformance = data.vendorPerformance || {
      onTimeDelivery: 0,
      qualityCompliance: 0,
      responsiveness: 0,
      costCompetitiveness: 0
    };
  }
}
