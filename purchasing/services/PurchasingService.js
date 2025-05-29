/**
 * Purchasing/Receiving Services
 * Provides business logic and data access for the Purchasing/Receiving module
 */

import prisma from '../../../lib/prisma';
import { 
  VendorModel,
  PurchaseAgreementModel,
  PurchaseAgreementItemModel,
  PurchaseOrderModel,
  PurchaseOrderItemModel,
  ReceivingRecordModel,
  ReceivingItemModel,
  MaterialModel,
  InvoiceModel,
  InvoiceItemModel,
  VendorPerformanceModel,
  RFQModel,
  RFQItemModel,
  RFQResponseModel,
  RFQResponseItemModel,
  PurchaseRequisitionModel,
  PurchaseRequisitionItemModel,
  VendorCertificationModel,
  MaterialCertificationModel,
  CostSavingInitiativeModel,
  PurchasingDashboardModel
} from '../models/PurchasingModel';

export class PurchasingService {
  /**
   * Vendor Management
   */
  async getVendors(filters = {}) {
    try {
      const { status, type, category, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      
      if (category) {
        whereClause.categories = {
          has: category
        };
      }
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { 'contactInfo.primaryContact': { contains: search, mode: 'insensitive' } },
          { 'contactInfo.email': { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const vendors = await prisma.vendor.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return vendors.map(vendor => new VendorModel(vendor));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw new Error('Failed to fetch vendors');
    }
  }
  
  async getVendorById(id) {
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id },
        include: {
          agreements: {
            orderBy: { updatedAt: 'desc' }
          },
          purchaseOrders: {
            orderBy: { orderDate: 'desc' },
            take: 10
          },
          certifications: true,
          performance: {
            orderBy: { period: 'desc' },
            take: 5
          }
        }
      });
      
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      
      return new VendorModel({
        ...vendor,
        agreements: vendor.agreements.map(agreement => new PurchaseAgreementModel(agreement)),
        purchaseOrders: vendor.purchaseOrders.map(po => new PurchaseOrderModel(po)),
        certifications: vendor.certifications.map(cert => new VendorCertificationModel(cert)),
        performance: vendor.performance.map(perf => new VendorPerformanceModel(perf))
      });
    } catch (error) {
      console.error(`Error fetching vendor with ID ${id}:`, error);
      throw new Error('Failed to fetch vendor');
    }
  }
  
  async createVendor(vendorData) {
    try {
      // Check if vendor with same name or code already exists
      const existingVendor = await prisma.vendor.findFirst({
        where: {
          OR: [
            { name: vendorData.name },
            { code: vendorData.code }
          ]
        }
      });
      
      if (existingVendor) {
        throw new Error('Vendor with same name or code already exists');
      }
      
      // Create vendor
      const vendor = await prisma.vendor.create({
        data: {
          name: vendorData.name,
          code: vendorData.code || this.generateVendorCode(vendorData.name),
          type: vendorData.type,
          status: vendorData.status || 'ACTIVE',
          isApproved: vendorData.isApproved !== false,
          contactInfo: vendorData.contactInfo,
          taxInfo: vendorData.taxInfo,
          paymentTerms: vendorData.paymentTerms,
          paymentMethods: vendorData.paymentMethods,
          shippingTerms: vendorData.shippingTerms,
          leadTime: vendorData.leadTime,
          minimumOrderValue: vendorData.minimumOrderValue,
          preferredCurrency: vendorData.preferredCurrency,
          categories: vendorData.categories || [],
          materials: vendorData.materials || [],
          services: vendorData.services || [],
          notes: vendorData.notes,
          documents: vendorData.documents || [],
          insuranceInfo: vendorData.insuranceInfo,
          createdBy: vendorData.createdBy
        }
      });
      
      // Create certifications if provided
      if (vendorData.certifications && vendorData.certifications.length > 0) {
        for (const cert of vendorData.certifications) {
          await prisma.vendorCertification.create({
            data: {
              vendorId: vendor.id,
              vendorName: vendor.name,
              name: cert.name,
              type: cert.type,
              issuingAuthority: cert.issuingAuthority,
              certificationNumber: cert.certificationNumber,
              issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
              expirationDate: cert.expirationDate ? new Date(cert.expirationDate) : null,
              status: cert.status || 'ACTIVE',
              description: cert.description,
              documentUrl: cert.documentUrl,
              notes: cert.notes,
              createdBy: vendorData.createdBy
            }
          });
        }
      }
      
      return new VendorModel(vendor);
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw new Error('Failed to create vendor');
    }
  }
  
  async updateVendorStatus(id, status, notes, userId) {
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id }
      });
      
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      
      // Update vendor
      const updatedVendor = await prisma.vendor.update({
        where: { id },
        data: {
          status,
          isApproved: status === 'ACTIVE',
          notes: notes ? `${vendor.notes || ''}\n${notes}` : vendor.notes,
          updatedAt: new Date()
        }
      });
      
      // Log status change
      await this.logVendorStatusChange(id, vendor.status, status, notes, userId);
      
      return new VendorModel(updatedVendor);
    } catch (error) {
      console.error(`Error updating vendor status for ID ${id}:`, error);
      throw new Error('Failed to update vendor status');
    }
  }
  
  /**
   * Purchase Agreement Management
   */
  async getPurchaseAgreements(filters = {}) {
    try {
      const { vendorId, status, type, search } = filters;
      
      const whereClause = {};
      if (vendorId) whereClause.vendorId = vendorId;
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { vendorName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const agreements = await prisma.purchaseAgreement.findMany({
        where: whereClause,
        orderBy: [
          { status: 'asc' },
          { endDate: 'asc' }
        ],
        include: {
          vendor: {
            select: {
              name: true
            }
          },
          items: true
        }
      });
      
      return agreements.map(agreement => new PurchaseAgreementModel({
        ...agreement,
        vendorName: agreement.vendor?.name || agreement.vendorName,
        items: agreement.items.map(item => new PurchaseAgreementItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching purchase agreements:', error);
      throw new Error('Failed to fetch purchase agreements');
    }
  }
  
  async createPurchaseAgreement(agreementData) {
    try {
      // Validate vendor exists
      const vendor = await prisma.vendor.findUnique({
        where: { id: agreementData.vendorId }
      });
      
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      
      // Create agreement
      const agreement = await prisma.purchaseAgreement.create({
        data: {
          vendorId: agreementData.vendorId,
          vendorName: vendor.name,
          title: agreementData.title,
          type: agreementData.type,
          status: agreementData.status || 'DRAFT',
          startDate: agreementData.startDate ? new Date(agreementData.startDate) : null,
          endDate: agreementData.endDate ? new Date(agreementData.endDate) : null,
          autoRenew: agreementData.autoRenew || false,
          renewalTerms: agreementData.renewalTerms,
          terminationTerms: agreementData.terminationTerms,
          description: agreementData.description,
          totalValue: agreementData.totalValue || 0,
          currency: agreementData.currency || 'USD',
          paymentTerms: agreementData.paymentTerms,
          deliveryTerms: agreementData.deliveryTerms,
          specialTerms: agreementData.specialTerms,
          approvalWorkflow: agreementData.approvalWorkflow || {
            currentStage: 'DRAFT',
            approvers: [],
            approvalHistory: []
          },
          documents: agreementData.documents || [],
          notes: agreementData.notes,
          createdBy: agreementData.createdBy
        }
      });
      
      // Create agreement items
      if (agreementData.items && agreementData.items.length > 0) {
        for (const item of agreementData.items) {
          await prisma.purchaseAgreementItem.create({
            data: {
              agreementId: agreement.id,
              materialId: item.materialId,
              materialCode: item.materialCode,
              materialName: item.materialName,
              description: item.description,
              category: item.category,
              unitPrice: item.unitPrice,
              currency: item.currency || agreement.currency,
              unit: item.unit,
              quantity: item.quantity,
              minimumOrderQuantity: item.minimumOrderQuantity,
              discountPercentage: item.discountPercentage,
              taxRate: item.taxRate,
              totalPrice: item.totalPrice,
              deliveryLeadTime: item.deliveryLeadTime,
              warrantyPeriod: item.warrantyPeriod,
              notes: item.notes
            }
          });
        }
      }
      
      // Update agreement total value
      const items = await prisma.purchaseAgreementItem.findMany({
        where: { agreementId: agreement.id }
      });
      
      const totalValue = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      
      await prisma.purchaseAgreement.update({
        where: { id: agreement.id },
        data: {
          totalValue
        }
      });
      
      return new PurchaseAgreementModel({
        ...agreement,
        totalValue,
        items: items.map(item => new PurchaseAgreementItemModel(item))
      });
    } catch (error) {
      console.error('Error creating purchase agreement:', error);
      throw new Error('Failed to create purchase agreement');
    }
  }
  
  /**
   * Purchase Order Management
   */
  async getPurchaseOrders(filters = {}) {
    try {
      const { vendorId, status, type, priority, jobId, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (vendorId) whereClause.vendorId = vendorId;
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (priority) whereClause.priority = priority;
      if (jobId) whereClause.jobId = jobId;
      
      if (dateFrom && dateTo) {
        whereClause.orderDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { poNumber: { contains: search, mode: 'insensitive' } },
          { vendorName: { contains: search, mode: 'insensitive' } },
          { jobName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: whereClause,
        orderBy: [
          { orderDate: 'desc' }
        ],
        include: {
          vendor: {
            select: {
              name: true
            }
          },
          job: {
            select: {
              name: true
            }
          },
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return purchaseOrders.map(po => new PurchaseOrderModel({
        ...po,
        vendorName: po.vendor?.name || po.vendorName,
        jobName: po.job?.name || po.jobName,
        projectName: po.project?.name || po.projectName
      }));
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw new Error('Failed to fetch purchase orders');
    }
  }
  
  async getPurchaseOrderById(id) {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          vendor: {
            select: {
              name: true,
              contactInfo: true
            }
          },
          job: {
            select: {
              name: true
            }
          },
          project: {
            select: {
              name: true
            }
          },
          items: {
            orderBy: { createdAt: 'asc' }
          },
          receivingRecords: {
            orderBy: { receivedDate: 'desc' },
            include: {
              items: true
            }
          },
          invoices: {
            orderBy: { invoiceDate: 'desc' }
          }
        }
      });
      
      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }
      
      return new PurchaseOrderModel({
        ...purchaseOrder,
        vendorName: purchaseOrder.vendor?.name || purchaseOrder.vendorName,
        jobName: purchaseOrder.job?.name || purchaseOrder.jobName,
        projectName: purchaseOrder.project?.name || purchaseOrder.projectName,
        items: purchaseOrder.items.map(item => new PurchaseOrderItemModel(item)),
        receivingRecords: purchaseOrder.receivingRecords.map(record => new ReceivingRecordModel({
          ...record,
          items: record.items.map(item => new ReceivingItemModel(item))
        })),
        invoices: purchaseOrder.invoices.map(invoice => new InvoiceModel(invoice))
      });
    } catch (error) {
      console.error(`Error fetching purchase order with ID ${id}:`, error);
      throw new Error('Failed to fetch purchase order');
    }
  }
  
  async createPurchaseOrder(poData) {
    try {
      // Validate vendor exists
      const vendor = await prisma.vendor.findUnique({
        where: { id: poData.vendorId }
      });
      
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      
      // Validate job if provided
      if (poData.jobId) {
        const job = await prisma.job.findUnique({
          where: { id: poData.jobId }
        });
        
        if (!job) {
          throw new Error('Job not found');
        }
      }
      
      // Validate project if provided
      if (poData.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: poData.projectId }
        });
        
        if (!project) {
          throw new Error('Project not found');
        }
      }
      
      // Generate PO number
      const poNumber = await this.generatePONumber();
      
      // Calculate totals
      let subtotal = 0;
      let taxAmount = 0;
      let discountAmount = 0;
      
      if (poData.items && poData.items.length > 0) {
        poData.items.forEach(item => {
          subtotal += item.subtotal || 0;
          taxAmount += item.taxAmount || 0;
          discountAmount += item.discountAmount || 0;
        });
      }
      
      const shippingAmount = poData.shippingAmount || 0;
      const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
      
      // Create purchase order
      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          poNumber,
          vendorId: poData.vendorId,
          vendorName: vendor.name,
          agreementId: poData.agreementId,
          jobId: poData.jobId,
          jobName: poData.jobName,
          projectId: poData.projectId,
          projectName: poData.projectName,
          type: poData.type || 'STANDARD',
          status: poData.status || 'DRAFT',
          priority: poData.priority || 'NORMAL',
          orderDate: poData.orderDate ? new Date(poData.orderDate) : new Date(),
          expectedDeliveryDate: poData.expectedDeliveryDate ? new Date(poData.expectedDeliveryDate) : null,
          deliveryLocation: poData.deliveryLocation,
          shippingMethod: poData.shippingMethod,
          shippingTerms: poData.shippingTerms || vendor.shippingTerms,
          paymentTerms: poData.paymentTerms || vendor.paymentTerms,
          currency: poData.currency || vendor.preferredCurrency || 'USD',
          subtotal,
          taxAmount,
          shippingAmount,
          discountAmount,
          totalAmount,
          notes: poData.notes,
          internalNotes: poData.internalNotes,
          attachments: poData.attachments || [],
          approvalWorkflow: poData.approvalWorkflow || {
            currentStage: 'DRAFT',
            approvers: [],
            approvalHistory: []
          },
          receivingStatus: {
            fullyReceived: false,
            partiallyReceived: false,
            receivedItems: 0,
            totalItems: poData.items ? poData.items.length : 0,
            lastReceiptDate: null
          },
          invoiceStatus: {
            fullyInvoiced: false,
            partiallyInvoiced: false,
            invoicedAmount: 0,
            remainingAmount: totalAmount,
            lastInvoiceDate: null
          },
          paymentStatus: {
            fullyPaid: false,
            partiallyPaid: false,
            paidAmount: 0,
            remainingAmount: totalAmount,
            lastPaymentDate: null
          },
          createdBy: poData.createdBy
        }
      });
      
      // Create PO items
      if (poData.items && poData.items.length > 0) {
        for (const item of poData.items) {
          await prisma.purchaseOrderItem.create({
            data: {
              purchaseOrderId: purchaseOrder.id,
              agreementItemId: item.agreementItemId,
              materialId: item.materialId,
              materialCode: item.materialCode,
              materialName: item.materialName,
              description: item.description,
              category: item.category,
              unitPrice: item.unitPrice,
              currency: item.currency || purchaseOrder.currency,
              unit: item.unit,
              quantity: item.quantity,
              receivedQuantity: 0,
              rejectedQuantity: 0,
              backorderedQuantity: 0,
              discountPercentage: item.discountPercentage,
              taxRate: item.taxRate,
              subtotal: item.subtotal,
              taxAmount: item.taxAmount,
              discountAmount: item.discountAmount,
              totalPrice: item.totalPrice,
              deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : purchaseOrder.expectedDeliveryDate,
              status: 'PENDING',
              notes: item.notes,
              jobId: item.jobId || purchaseOrder.jobId,
              projectId: item.projectId || purchaseOrder.projectId,
              costCode: item.costCode
            }
          });
        }
      }
      
      // If PO is created from requisition, update requisition status
      if (poData.requisitionId) {
        await prisma.purchaseRequisition.update({
          where: { id: poData.requisitionId },
          data: {
            status: 'CONVERTED_TO_PO',
            purchaseOrderId: purchaseOrder.id,
            purchaseOrderNumber: poNumber,
            updatedAt: new Date()
          }
        });
        
        // Update requisition items
        if (poData.requisitionItems && poData.requisitionItems.length > 0) {
          for (const reqItem of poData.requisitionItems) {
            await prisma.purchaseRequisitionItem.update({
              where: { id: reqItem.id },
              data: {
                status: 'ORDERED',
                purchaseOrderId: purchaseOrder.id,
                updatedAt: new Date()
              }
            });
          }
        }
      }
      
      return new PurchaseOrderModel(purchaseOrder);
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw new Error('Failed to create purchase order');
    }
  }
  
  async updatePurchaseOrderStatus(id, status, notes, userId) {
    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id }
      });
      
      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }
      
      // Validate status transition
      const validTransitions = {
        DRAFT: ['PENDING_APPROVAL', 'APPROVED', 'CANCELLED'],
        PENDING_APPROVAL: ['APPROVED', 'DRAFT', 'CANCELLED'],
        APPROVED: ['SENT', 'CANCELLED'],
        SENT: ['ACKNOWLEDGED', 'CANCELLED'],
        ACKNOWLEDGED: ['PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'],
        PARTIALLY_RECEIVED: ['RECEIVED', 'CANCELLED'],
        RECEIVED: ['CLOSED'],
        CANCELLED: ['DRAFT'],
        CLOSED: []
      };
      
      if (!validTransitions[purchaseOrder.status].includes(status)) {
        throw new Error(`Invalid status transition from ${purchaseOrder.status} to ${status}`);
      }
      
      // Update purchase order
      const updatedPO = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status,
          approvalWorkflow: {
            ...purchaseOrder.approvalWorkflow,
            currentStage: status,
            approvalHistory: [
              ...(purchaseOrder.approvalWorkflow?.approvalHistory || []),
              {
                stage: status,
                date: new Date().toISOString(),
                userId,
                notes: notes || ''
              }
            ]
          },
          notes: notes ? `${purchaseOrder.notes || ''}\n${notes}` : purchaseOrder.notes,
          updatedAt: new Date()
        }
      });
      
      // If status is CANCELLED, update all items to CANCELLED
      if (status === 'CANCELLED') {
        await prisma.purchaseOrderItem.updateMany({
          where: { purchaseOrderId: id },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        });
      }
      
      // If status is CLOSED, ensure all items are received or cancelled
      if (status === 'CLOSED') {
        const items = await prisma.purchaseOrderItem.findMany({
          where: { purchaseOrderId: id }
        });
        
        for (const item of items) {
          if (item.status !== 'RECEIVED' && item.status !== 'CANCELLED') {
            await prisma.purchaseOrderItem.update({
              where: { id: item.id },
              data: {
                status: 'RECEIVED',
                receivedQuantity: item.quantity,
                updatedAt: new Date()
              }
            });
          }
        }
      }
      
      // Notify relevant parties about status change
      await this.notifyPurchaseOrderStatusChange(updatedPO);
      
      return new PurchaseOrderModel(updatedPO);
    } catch (error) {
      console.error(`Error updating purchase order status for ID ${id}:`, error);
      throw new Error('Failed to update purchase order status');
    }
  }
  
  /**
   * Receiving Management
   */
  async getReceivingRecords(filters = {}) {
    try {
      const { purchaseOrderId, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (purchaseOrderId) whereClause.purchaseOrderId = purchaseOrderId;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.receivedDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { receiptNumber: { contains: search, mode: 'insensitive' } },
          { poNumber: { contains: search, mode: 'insensitive' } },
          { vendorName: { contains: search, mode: 'insensitive' } },
          { trackingNumber: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const receivingRecords = await prisma.receivingRecord.findMany({
        where: whereClause,
        orderBy: { receivedDate: 'desc' },
        include: {
          items: true,
          purchaseOrder: {
            select: {
              poNumber: true
            }
          }
        }
      });
      
      return receivingRecords.map(record => new ReceivingRecordModel({
        ...record,
        poNumber: record.purchaseOrder?.poNumber || record.poNumber,
        items: record.items.map(item => new ReceivingItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching receiving records:', error);
      throw new Error('Failed to fetch receiving records');
    }
  }
  
  async createReceivingRecord(receivingData) {
    try {
      // Validate purchase order exists
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id: receivingData.purchaseOrderId },
        include: {
          items: true,
          vendor: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }
      
      // Check if PO status allows receiving
      const validStatuses = ['APPROVED', 'SENT', 'ACKNOWLEDGED', 'PARTIALLY_RECEIVED'];
      if (!validStatuses.includes(purchaseOrder.status)) {
        throw new Error(`Cannot create receiving record for purchase order with status ${purchaseOrder.status}`);
      }
      
      // Generate receipt number
      const receiptNumber = await this.generateReceiptNumber();
      
      // Create receiving record
      const receivingRecord = await prisma.receivingRecord.create({
        data: {
          receiptNumber,
          purchaseOrderId: receivingData.purchaseOrderId,
          poNumber: purchaseOrder.poNumber,
          vendorId: purchaseOrder.vendorId,
          vendorName: purchaseOrder.vendor.name,
          receivedBy: receivingData.receivedBy,
          receivedByName: receivingData.receivedByName,
          receivedDate: receivingData.receivedDate ? new Date(receivingData.receivedDate) : new Date(),
          deliveryLocation: receivingData.deliveryLocation,
          carrierName: receivingData.carrierName,
          trackingNumber: receivingData.trackingNumber,
          packageCount: receivingData.packageCount || 0,
          status: receivingData.status || 'PENDING_INSPECTION',
          notes: receivingData.notes,
          attachments: receivingData.attachments || [],
          createdBy: receivingData.createdBy
        }
      });
      
      // Create receiving items
      if (receivingData.items && receivingData.items.length > 0) {
        for (const item of receivingData.items) {
          // Find corresponding PO item
          const poItem = purchaseOrder.items.find(i => i.id === item.purchaseOrderItemId);
          
          if (!poItem) {
            throw new Error(`Purchase order item with ID ${item.purchaseOrderItemId} not found`);
          }
          
          // Calculate previously received quantity
          const previouslyReceived = await prisma.receivingItem.aggregate({
            where: {
              purchaseOrderItemId: poItem.id,
              receivingRecordId: { not: receivingRecord.id }
            },
            _sum: {
              receivedQuantity: true,
              rejectedQuantity: true
            }
          });
          
          const previouslyReceivedQuantity = (previouslyReceived._sum.receivedQuantity || 0);
          const previouslyRejectedQuantity = (previouslyReceived._sum.rejectedQuantity || 0);
          
          // Create receiving item
          await prisma.receivingItem.create({
            data: {
              receivingRecordId: receivingRecord.id,
              purchaseOrderId: purchaseOrder.id,
              purchaseOrderItemId: poItem.id,
              materialId: poItem.materialId,
              materialCode: poItem.materialCode,
              materialName: poItem.materialName,
              description: poItem.description,
              orderedQuantity: poItem.quantity,
              previouslyReceivedQuantity,
              receivedQuantity: item.receivedQuantity,
              rejectedQuantity: item.rejectedQuantity || 0,
              unit: poItem.unit,
              lotNumber: item.lotNumber,
              serialNumbers: item.serialNumbers || [],
              expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
              storageLocation: item.storageLocation,
              inspectionStatus: item.inspectionStatus || 'PENDING',
              inspectionNotes: item.inspectionNotes,
              qcSampleTaken: item.qcSampleTaken || false,
              notes: item.notes
            }
          });
          
          // Update PO item quantities
          await prisma.purchaseOrderItem.update({
            where: { id: poItem.id },
            data: {
              receivedQuantity: previouslyReceivedQuantity + item.receivedQuantity,
              rejectedQuantity: previouslyRejectedQuantity + (item.rejectedQuantity || 0),
              status: (previouslyReceivedQuantity + item.receivedQuantity) >= poItem.quantity ? 'RECEIVED' : 'PARTIALLY_RECEIVED',
              updatedAt: new Date()
            }
          });
        }
      }
      
      // Update PO receiving status
      await this.updatePOReceivingStatus(purchaseOrder.id);
      
      return new ReceivingRecordModel(receivingRecord);
    } catch (error) {
      console.error('Error creating receiving record:', error);
      throw new Error('Failed to create receiving record');
    }
  }
  
  async updateReceivingRecordStatus(id, status, notes, userId) {
    try {
      const receivingRecord = await prisma.receivingRecord.findUnique({
        where: { id },
        include: {
          items: true
        }
      });
      
      if (!receivingRecord) {
        throw new Error('Receiving record not found');
      }
      
      // Update receiving record
      const updatedRecord = await prisma.receivingRecord.update({
        where: { id },
        data: {
          status,
          notes: notes ? `${receivingRecord.notes || ''}\n${notes}` : receivingRecord.notes,
          updatedAt: new Date()
        }
      });
      
      // If status is INSPECTED, update all items with PENDING inspection status
      if (status === 'INSPECTED') {
        for (const item of receivingRecord.items) {
          if (item.inspectionStatus === 'PENDING') {
            await prisma.receivingItem.update({
              where: { id: item.id },
              data: {
                inspectionStatus: 'PASSED',
                inspectedBy: userId,
                inspectedDate: new Date(),
                updatedAt: new Date()
              }
            });
          }
        }
      }
      
      // If status is REJECTED, update PO item quantities
      if (status === 'REJECTED') {
        for (const item of receivingRecord.items) {
          // Get PO item
          const poItem = await prisma.purchaseOrderItem.findUnique({
            where: { id: item.purchaseOrderItemId }
          });
          
          if (poItem) {
            // Update PO item quantities
            await prisma.purchaseOrderItem.update({
              where: { id: poItem.id },
              data: {
                receivedQuantity: Math.max(0, poItem.receivedQuantity - item.receivedQuantity),
                rejectedQuantity: poItem.rejectedQuantity + item.receivedQuantity,
                status: poItem.receivedQuantity >= poItem.quantity ? 'RECEIVED' : 'PARTIALLY_RECEIVED',
                updatedAt: new Date()
              }
            });
          }
        }
        
        // Update PO receiving status
        await this.updatePOReceivingStatus(receivingRecord.purchaseOrderId);
      }
      
      return new ReceivingRecordModel(updatedRecord);
    } catch (error) {
      console.error(`Error updating receiving record status for ID ${id}:`, error);
      throw new Error('Failed to update receiving record status');
    }
  }
  
  /**
   * Material Management
   */
  async getMaterials(filters = {}) {
    try {
      const { status, category, type, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;
      if (type) whereClause.type = type;
      
      if (search) {
        whereClause.OR = [
          { code: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const materials = await prisma.material.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return materials.map(material => new MaterialModel(material));
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw new Error('Failed to fetch materials');
    }
  }
  
  /**
   * Invoice Management
   */
  async getInvoices(filters = {}) {
    try {
      const { vendorId, purchaseOrderId, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (vendorId) whereClause.vendorId = vendorId;
      if (purchaseOrderId) whereClause.purchaseOrderId = purchaseOrderId;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.invoiceDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { poNumber: { contains: search, mode: 'insensitive' } },
          { vendorName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const invoices = await prisma.invoice.findMany({
        where: whereClause,
        orderBy: { invoiceDate: 'desc' },
        include: {
          vendor: {
            select: {
              name: true
            }
          },
          purchaseOrder: {
            select: {
              poNumber: true
            }
          },
          items: true
        }
      });
      
      return invoices.map(invoice => new InvoiceModel({
        ...invoice,
        vendorName: invoice.vendor?.name || invoice.vendorName,
        poNumber: invoice.purchaseOrder?.poNumber || invoice.poNumber,
        items: invoice.items.map(item => new InvoiceItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  }
  
  /**
   * Vendor Performance Management
   */
  async getVendorPerformance(filters = {}) {
    try {
      const { vendorId, period, dateFrom, dateTo } = filters;
      
      const whereClause = {};
      if (vendorId) whereClause.vendorId = vendorId;
      if (period) whereClause.period = period;
      
      if (dateFrom && dateTo) {
        whereClause.AND = [
          { startDate: { gte: new Date(dateFrom) } },
          { endDate: { lte: new Date(dateTo) } }
        ];
      }
      
      const performance = await prisma.vendorPerformance.findMany({
        where: whereClause,
        orderBy: [
          { vendorName: 'asc' },
          { period: 'desc' }
        ],
        include: {
          vendor: {
            select: {
              name: true
            }
          }
        }
      });
      
      return performance.map(perf => new VendorPerformanceModel({
        ...perf,
        vendorName: perf.vendor?.name || perf.vendorName
      }));
    } catch (error) {
      console.error('Error fetching vendor performance:', error);
      throw new Error('Failed to fetch vendor performance');
    }
  }
  
  /**
   * RFQ Management
   */
  async getRFQs(filters = {}) {
    try {
      const { status, type, priority, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (priority) whereClause.priority = priority;
      
      if (search) {
        whereClause.OR = [
          { rfqNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const rfqs = await prisma.rfq.findMany({
        where: whereClause,
        orderBy: [
          { status: 'asc' },
          { dueDate: 'asc' }
        ],
        include: {
          items: true,
          responses: {
            include: {
              vendor: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
      
      return rfqs.map(rfq => new RFQModel({
        ...rfq,
        items: rfq.items.map(item => new RFQItemModel(item)),
        responses: rfq.responses.map(response => new RFQResponseModel({
          ...response,
          vendorName: response.vendor?.name || response.vendorName
        }))
      }));
    } catch (error) {
      console.error('Error fetching RFQs:', error);
      throw new Error('Failed to fetch RFQs');
    }
  }
  
  /**
   * Purchase Requisition Management
   */
  async getPurchaseRequisitions(filters = {}) {
    try {
      const { status, priority, requestedBy, departmentId, jobId, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (requestedBy) whereClause.requestedBy = requestedBy;
      if (departmentId) whereClause.departmentId = departmentId;
      if (jobId) whereClause.jobId = jobId;
      
      if (search) {
        whereClause.OR = [
          { requisitionNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { requestedByName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const requisitions = await prisma.purchaseRequisition.findMany({
        where: whereClause,
        orderBy: [
          { status: 'asc' },
          { requiredDate: 'asc' }
        ],
        include: {
          items: true,
          department: {
            select: {
              name: true
            }
          },
          job: {
            select: {
              name: true
            }
          },
          project: {
            select: {
              name: true
            }
          },
          requester: {
            select: {
              name: true
            }
          }
        }
      });
      
      return requisitions.map(req => new PurchaseRequisitionModel({
        ...req,
        departmentName: req.department?.name || req.departmentName,
        jobName: req.job?.name || req.jobName,
        projectName: req.project?.name || req.projectName,
        requestedByName: req.requester?.name || req.requestedByName,
        items: req.items.map(item => new PurchaseRequisitionItemModel(item))
      }));
    } catch (error) {
      console.error('Error fetching purchase requisitions:', error);
      throw new Error('Failed to fetch purchase requisitions');
    }
  }
  
  /**
   * Material Certification Management
   */
  async getMaterialCertifications(filters = {}) {
    try {
      const { materialId, vendorId, type, status, search } = filters;
      
      const whereClause = {};
      if (materialId) whereClause.materialId = materialId;
      if (vendorId) whereClause.vendorId = vendorId;
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { certificationNumber: { contains: search, mode: 'insensitive' } },
          { materialName: { contains: search, mode: 'insensitive' } },
          { vendorName: { contains: search, mode: 'insensitive' } },
          { lotNumber: { contains: search, mode: 'insensitive' } },
          { batchNumber: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const certifications = await prisma.materialCertification.findMany({
        where: whereClause,
        orderBy: { issueDate: 'desc' },
        include: {
          material: {
            select: {
              name: true,
              code: true
            }
          },
          vendor: {
            select: {
              name: true
            }
          }
        }
      });
      
      return certifications.map(cert => new MaterialCertificationModel({
        ...cert,
        materialName: cert.material?.name || cert.materialName,
        materialCode: cert.material?.code || cert.materialCode,
        vendorName: cert.vendor?.name || cert.vendorName
      }));
    } catch (error) {
      console.error('Error fetching material certifications:', error);
      throw new Error('Failed to fetch material certifications');
    }
  }
  
  /**
   * Cost Saving Initiatives Management
   */
  async getCostSavingInitiatives(filters = {}) {
    try {
      const { status, type, initiatedBy, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (initiatedBy) whereClause.initiatedBy = initiatedBy;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { initiatedByName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const initiatives = await prisma.costSavingInitiative.findMany({
        where: whereClause,
        orderBy: [
          { status: 'asc' },
          { startDate: 'desc' }
        ],
        include: {
          initiator: {
            select: {
              name: true
            }
          }
        }
      });
      
      return initiatives.map(initiative => new CostSavingInitiativeModel({
        ...initiative,
        initiatedByName: initiative.initiator?.name || initiative.initiatedByName
      }));
    } catch (error) {
      console.error('Error fetching cost saving initiatives:', error);
      throw new Error('Failed to fetch cost saving initiatives');
    }
  }
  
  /**
   * Purchasing Dashboard
   */
  async getPurchasingDashboardData() {
    try {
      // Purchase order stats
      const poStats = await prisma.purchaseOrder.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const purchaseOrderStats = {
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
      
      poStats.forEach(stat => {
        purchaseOrderStats.total += stat._count.id;
        
        switch (stat.status) {
          case 'DRAFT':
            purchaseOrderStats.draft = stat._count.id;
            break;
          case 'PENDING_APPROVAL':
            purchaseOrderStats.pendingApproval = stat._count.id;
            break;
          case 'APPROVED':
            purchaseOrderStats.approved = stat._count.id;
            break;
          case 'SENT':
            purchaseOrderStats.sent = stat._count.id;
            break;
          case 'PARTIALLY_RECEIVED':
            purchaseOrderStats.partiallyReceived = stat._count.id;
            break;
          case 'RECEIVED':
            purchaseOrderStats.received = stat._count.id;
            break;
          case 'CANCELLED':
            purchaseOrderStats.cancelled = stat._count.id;
            break;
          case 'CLOSED':
            purchaseOrderStats.closed = stat._count.id;
            break;
        }
      });
      
      // Invoice stats
      const invoiceStats = await prisma.invoice.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const invoiceStatsData = {
        total: 0,
        pendingApproval: 0,
        approved: 0,
        rejected: 0,
        paid: 0,
        partiallyPaid: 0,
        overdue: 0
      };
      
      invoiceStats.forEach(stat => {
        invoiceStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'PENDING_APPROVAL':
            invoiceStatsData.pendingApproval = stat._count.id;
            break;
          case 'APPROVED':
            invoiceStatsData.approved = stat._count.id;
            break;
          case 'REJECTED':
            invoiceStatsData.rejected = stat._count.id;
            break;
          case 'PAID':
            invoiceStatsData.paid = stat._count.id;
            break;
          case 'PARTIALLY_PAID':
            invoiceStatsData.partiallyPaid = stat._count.id;
            break;
        }
      });
      
      // Count overdue invoices
      const today = new Date();
      const overdueInvoices = await prisma.invoice.count({
        where: {
          dueDate: {
            lt: today
          },
          status: {
            notIn: ['PAID', 'REJECTED', 'VOIDED']
          }
        }
      });
      
      invoiceStatsData.overdue = overdueInvoices;
      
      // Spend by category
      const poItems = await prisma.purchaseOrderItem.findMany({
        where: {
          purchaseOrder: {
            status: {
              notIn: ['DRAFT', 'CANCELLED']
            }
          }
        },
        select: {
          category: true,
          totalPrice: true
        }
      });
      
      const spendByCategory = {};
      poItems.forEach(item => {
        const category = item.category || 'Uncategorized';
        if (!spendByCategory[category]) {
          spendByCategory[category] = 0;
        }
        spendByCategory[category] += item.totalPrice || 0;
      });
      
      const spendByCategoryArray = Object.entries(spendByCategory).map(([category, amount]) => ({
        category,
        amount
      }));
      
      // Spend by vendor
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: {
          status: {
            notIn: ['DRAFT', 'CANCELLED']
          }
        },
        select: {
          vendorId: true,
          vendorName: true,
          totalAmount: true
        }
      });
      
      const spendByVendor = {};
      purchaseOrders.forEach(po => {
        if (!spendByVendor[po.vendorId]) {
          spendByVendor[po.vendorId] = {
            vendorId: po.vendorId,
            vendorName: po.vendorName,
            amount: 0
          };
        }
        spendByVendor[po.vendorId].amount += po.totalAmount || 0;
      });
      
      const spendByVendorArray = Object.values(spendByVendor).sort((a, b) => b.amount - a.amount);
      
      // Spend by month
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const recentPOs = await prisma.purchaseOrder.findMany({
        where: {
          orderDate: {
            gte: sixMonthsAgo
          },
          status: {
            notIn: ['DRAFT', 'CANCELLED']
          }
        },
        select: {
          orderDate: true,
          totalAmount: true
        }
      });
      
      const spendByMonth = {};
      recentPOs.forEach(po => {
        const date = new Date(po.orderDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!spendByMonth[monthYear]) {
          spendByMonth[monthYear] = {
            month: monthYear,
            amount: 0
          };
        }
        
        spendByMonth[monthYear].amount += po.totalAmount || 0;
      });
      
      const spendByMonthArray = Object.values(spendByMonth).sort((a, b) => a.month.localeCompare(b.month));
      
      // Top vendors
      const topVendors = spendByVendorArray.slice(0, 5);
      
      // Pending deliveries
      const pendingDeliveries = await prisma.purchaseOrder.findMany({
        where: {
          status: {
            in: ['APPROVED', 'SENT', 'ACKNOWLEDGED', 'PARTIALLY_RECEIVED']
          },
          expectedDeliveryDate: {
            gte: today
          }
        },
        orderBy: { expectedDeliveryDate: 'asc' },
        take: 10,
        select: {
          id: true,
          poNumber: true,
          vendorName: true,
          expectedDeliveryDate: true,
          totalAmount: true,
          status: true
        }
      });
      
      // Recent receiving records
      const recentReceivingRecords = await prisma.receivingRecord.findMany({
        orderBy: { receivedDate: 'desc' },
        take: 5,
        select: {
          id: true,
          receiptNumber: true,
          poNumber: true,
          vendorName: true,
          receivedDate: true,
          status: true
        }
      });
      
      // Pending approvals
      const pendingApprovals = await prisma.purchaseOrder.findMany({
        where: {
          status: 'PENDING_APPROVAL'
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          poNumber: true,
          vendorName: true,
          totalAmount: true,
          createdAt: true
        }
      });
      
      // Savings tracking
      const costSavings = await prisma.costSavingInitiative.findMany({
        where: {
          status: {
            in: ['APPROVED', 'IN_PROGRESS', 'COMPLETED']
          }
        },
        select: {
          estimatedAnnualSavings: true,
          actualAnnualSavings: true,
          type: true
        }
      });
      
      const savingsTracking = {
        targetAnnualSavings: 0,
        actualSavingsToDate: 0,
        savingsPercentage: 0,
        savingsByCategory: {}
      };
      
      costSavings.forEach(initiative => {
        savingsTracking.targetAnnualSavings += initiative.estimatedAnnualSavings || 0;
        savingsTracking.actualSavingsToDate += initiative.actualAnnualSavings || 0;
        
        const category = initiative.type || 'Other';
        if (!savingsTracking.savingsByCategory[category]) {
          savingsTracking.savingsByCategory[category] = {
            category,
            estimated: 0,
            actual: 0
          };
        }
        
        savingsTracking.savingsByCategory[category].estimated += initiative.estimatedAnnualSavings || 0;
        savingsTracking.savingsByCategory[category].actual += initiative.actualAnnualSavings || 0;
      });
      
      savingsTracking.savingsPercentage = savingsTracking.targetAnnualSavings > 0 
        ? (savingsTracking.actualSavingsToDate / savingsTracking.targetAnnualSavings) * 100 
        : 0;
      
      savingsTracking.savingsByCategory = Object.values(savingsTracking.savingsByCategory);
      
      // Inventory alerts
      const inventoryAlerts = await prisma.material.findMany({
        where: {
          reorderPoint: {
            gt: 0
          }
        },
        orderBy: { name: 'asc' },
        take: 10,
        select: {
          id: true,
          code: true,
          name: true,
          reorderPoint: true,
          targetStockLevel: true,
          leadTime: true
        }
      });
      
      // Vendor performance
      const vendorPerformance = await prisma.vendorPerformance.aggregate({
        _avg: {
          overallScore: true
        }
      });
      
      const avgPerformance = vendorPerformance._avg.overallScore || 0;
      
      // Calculate metrics
      const vendorPerformanceMetrics = {
        onTimeDelivery: avgPerformance * 0.9, // Simulated metrics
        qualityCompliance: avgPerformance * 1.1,
        responsiveness: avgPerformance * 0.95,
        costCompetitiveness: avgPerformance * 1.05
      };
      
      return new PurchasingDashboardModel({
        purchaseOrderStats,
        invoiceStats: invoiceStatsData,
        spendByCategory: spendByCategoryArray,
        spendByVendor: spendByVendorArray,
        spendByMonth: spendByMonthArray,
        topVendors,
        pendingDeliveries,
        recentReceivingRecords,
        pendingApprovals,
        savingsTracking,
        inventoryAlerts,
        vendorPerformance: vendorPerformanceMetrics
      });
    } catch (error) {
      console.error('Error fetching purchasing dashboard data:', error);
      throw new Error('Failed to fetch purchasing dashboard data');
    }
  }
  
  /**
   * Helper Methods
   */
  async generateVendorCode(vendorName) {
    // Generate a code based on vendor name (first 3 letters + random number)
    const prefix = vendorName.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${randomNum}`;
  }
  
  async generatePONumber() {
    // Get current year and month
    const date = new Date();
    const year = date.getFullYear().toString().substring(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Get count of POs in current month
    const poCount = await prisma.purchaseOrder.count({
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1)
        }
      }
    });
    
    // Generate sequence number
    const sequence = (poCount + 1).toString().padStart(4, '0');
    
    return `PO-${year}${month}-${sequence}`;
  }
  
  async generateReceiptNumber() {
    // Get current year and month
    const date = new Date();
    const year = date.getFullYear().toString().substring(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Get count of receiving records in current month
    const receiptCount = await prisma.receivingRecord.count({
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1)
        }
      }
    });
    
    // Generate sequence number
    const sequence = (receiptCount + 1).toString().padStart(4, '0');
    
    return `RCV-${year}${month}-${sequence}`;
  }
  
  async updatePOReceivingStatus(purchaseOrderId) {
    try {
      // Get purchase order
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id: purchaseOrderId },
        include: {
          items: true
        }
      });
      
      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }
      
      // Calculate receiving status
      const totalItems = purchaseOrder.items.length;
      const receivedItems = purchaseOrder.items.filter(item => item.status === 'RECEIVED').length;
      const partiallyReceivedItems = purchaseOrder.items.filter(item => item.status === 'PARTIALLY_RECEIVED').length;
      
      const fullyReceived = receivedItems === totalItems;
      const partiallyReceived = partiallyReceivedItems > 0 || (receivedItems > 0 && receivedItems < totalItems);
      
      // Get last receipt date
      const lastReceipt = await prisma.receivingRecord.findFirst({
        where: { purchaseOrderId },
        orderBy: { receivedDate: 'desc' },
        select: { receivedDate: true }
      });
      
      // Update PO status
      let status = purchaseOrder.status;
      if (fullyReceived && purchaseOrder.status !== 'CLOSED') {
        status = 'RECEIVED';
      } else if (partiallyReceived && purchaseOrder.status !== 'PARTIALLY_RECEIVED') {
        status = 'PARTIALLY_RECEIVED';
      }
      
      await prisma.purchaseOrder.update({
        where: { id: purchaseOrderId },
        data: {
          status,
          receivingStatus: {
            fullyReceived,
            partiallyReceived,
            receivedItems,
            totalItems,
            lastReceiptDate: lastReceipt ? lastReceipt.receivedDate : null
          },
          updatedAt: new Date()
        }
      });
      
      return true;
    } catch (error) {
      console.error(`Error updating PO receiving status for ${purchaseOrderId}:`, error);
      throw new Error('Failed to update PO receiving status');
    }
  }
  
  async logVendorStatusChange(vendorId, oldStatus, newStatus, notes, userId) {
    try {
      await prisma.vendorStatusLog.create({
        data: {
          vendorId,
          oldStatus,
          newStatus,
          notes,
          changedBy: userId,
          changedAt: new Date()
        }
      });
      
      return true;
    } catch (error) {
      console.error(`Error logging vendor status change for ${vendorId}:`, error);
      // Don't throw error here, as this is a secondary operation
      return false;
    }
  }
  
  async notifyPurchaseOrderStatusChange(purchaseOrder) {
    // This would typically send notifications to relevant parties
    console.log(`Purchase order ${purchaseOrder.poNumber} status changed to ${purchaseOrder.status}`);
    return true;
  }
}

export default new PurchasingService();
