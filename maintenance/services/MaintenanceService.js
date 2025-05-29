/**
 * Maintenance Services
 * Provides business logic and data access for the Maintenance module
 */

import prisma from '../../../lib/prisma';
import { 
  AssetModel, 
  MaintenanceScheduleModel, 
  WorkOrderModel,
  BreakdownReportModel,
  PartModel,
  MaintenanceCostModel,
  MaintenanceComplianceModel,
  MaintenanceChecklistModel,
  CompletedChecklistModel
} from '../models/MaintenanceModel';

export class MaintenanceService {
  /**
   * Asset Management
   */
  async getAssets(filters = {}) {
    try {
      const { type, status, location, department, search } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (location) whereClause.location = location;
      if (department) whereClause.department = department;
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { manufacturer: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const assets = await prisma.asset.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return assets.map(asset => new AssetModel(asset));
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw new Error('Failed to fetch assets');
    }
  }
  
  async getAssetById(id) {
    try {
      const asset = await prisma.asset.findUnique({
        where: { id },
        include: {
          maintenanceSchedules: true,
          workOrders: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });
      
      if (!asset) {
        throw new Error('Asset not found');
      }
      
      return new AssetModel({
        ...asset,
        maintenanceSchedules: asset.maintenanceSchedules.map(schedule => new MaintenanceScheduleModel(schedule)),
        workOrders: asset.workOrders.map(workOrder => new WorkOrderModel(workOrder))
      });
    } catch (error) {
      console.error(`Error fetching asset with ID ${id}:`, error);
      throw new Error('Failed to fetch asset');
    }
  }
  
  async createAsset(assetData) {
    try {
      const asset = await prisma.asset.create({
        data: {
          name: assetData.name,
          type: assetData.type,
          category: assetData.category,
          manufacturer: assetData.manufacturer,
          model: assetData.model,
          serialNumber: assetData.serialNumber,
          purchaseDate: assetData.purchaseDate ? new Date(assetData.purchaseDate) : null,
          purchaseCost: assetData.purchaseCost,
          warrantyExpirationDate: assetData.warrantyExpirationDate ? new Date(assetData.warrantyExpirationDate) : null,
          location: assetData.location,
          department: assetData.department,
          assignedTo: assetData.assignedTo,
          status: assetData.status || 'ACTIVE',
          lastMaintenanceDate: assetData.lastMaintenanceDate ? new Date(assetData.lastMaintenanceDate) : null,
          nextMaintenanceDate: assetData.nextMaintenanceDate ? new Date(assetData.nextMaintenanceDate) : null,
          maintenanceFrequency: assetData.maintenanceFrequency,
          maintenanceInstructions: assetData.maintenanceInstructions,
          notes: assetData.notes,
          documents: assetData.documents || [],
          images: assetData.images || [],
          customFields: assetData.customFields || {},
          createdBy: assetData.createdBy
        }
      });
      
      return new AssetModel(asset);
    } catch (error) {
      console.error('Error creating asset:', error);
      throw new Error('Failed to create asset');
    }
  }
  
  async updateAsset(id, assetData) {
    try {
      const asset = await prisma.asset.update({
        where: { id },
        data: {
          name: assetData.name,
          type: assetData.type,
          category: assetData.category,
          manufacturer: assetData.manufacturer,
          model: assetData.model,
          serialNumber: assetData.serialNumber,
          purchaseDate: assetData.purchaseDate ? new Date(assetData.purchaseDate) : null,
          purchaseCost: assetData.purchaseCost,
          warrantyExpirationDate: assetData.warrantyExpirationDate ? new Date(assetData.warrantyExpirationDate) : null,
          location: assetData.location,
          department: assetData.department,
          assignedTo: assetData.assignedTo,
          status: assetData.status,
          lastMaintenanceDate: assetData.lastMaintenanceDate ? new Date(assetData.lastMaintenanceDate) : null,
          nextMaintenanceDate: assetData.nextMaintenanceDate ? new Date(assetData.nextMaintenanceDate) : null,
          maintenanceFrequency: assetData.maintenanceFrequency,
          maintenanceInstructions: assetData.maintenanceInstructions,
          notes: assetData.notes,
          documents: assetData.documents,
          images: assetData.images,
          customFields: assetData.customFields,
          updatedAt: new Date()
        }
      });
      
      return new AssetModel(asset);
    } catch (error) {
      console.error(`Error updating asset with ID ${id}:`, error);
      throw new Error('Failed to update asset');
    }
  }
  
  /**
   * Maintenance Schedule Management
   */
  async getMaintenanceSchedules(filters = {}) {
    try {
      const { assetId, maintenanceType, status, dueStartDate, dueEndDate } = filters;
      
      const whereClause = {};
      if (assetId) whereClause.assetId = assetId;
      if (maintenanceType) whereClause.maintenanceType = maintenanceType;
      if (status) whereClause.status = status;
      if (dueStartDate && dueEndDate) {
        whereClause.nextDueDate = {
          gte: new Date(dueStartDate),
          lte: new Date(dueEndDate)
        };
      }
      
      const schedules = await prisma.maintenanceSchedule.findMany({
        where: whereClause,
        orderBy: { nextDueDate: 'asc' },
        include: {
          asset: {
            select: {
              name: true,
              type: true,
              location: true
            }
          }
        }
      });
      
      return schedules.map(schedule => new MaintenanceScheduleModel({
        ...schedule,
        assetName: schedule.asset.name
      }));
    } catch (error) {
      console.error('Error fetching maintenance schedules:', error);
      throw new Error('Failed to fetch maintenance schedules');
    }
  }
  
  async createMaintenanceSchedule(scheduleData) {
    try {
      // Validate asset exists
      const asset = await prisma.asset.findUnique({
        where: { id: scheduleData.assetId }
      });
      
      if (!asset) {
        throw new Error('Asset not found');
      }
      
      const schedule = await prisma.maintenanceSchedule.create({
        data: {
          assetId: scheduleData.assetId,
          maintenanceType: scheduleData.maintenanceType,
          frequency: scheduleData.frequency,
          interval: scheduleData.interval,
          intervalUnit: scheduleData.intervalUnit,
          lastCompletedDate: scheduleData.lastCompletedDate ? new Date(scheduleData.lastCompletedDate) : null,
          nextDueDate: scheduleData.nextDueDate ? new Date(scheduleData.nextDueDate) : null,
          description: scheduleData.description,
          instructions: scheduleData.instructions,
          estimatedDuration: scheduleData.estimatedDuration,
          assignedDepartment: scheduleData.assignedDepartment,
          assignedTechnician: scheduleData.assignedTechnician,
          priority: scheduleData.priority || 'MEDIUM',
          status: scheduleData.status || 'ACTIVE',
          notificationEnabled: scheduleData.notificationEnabled !== false,
          notificationDays: scheduleData.notificationDays || 7,
          notificationRecipients: scheduleData.notificationRecipients || [],
          createdBy: scheduleData.createdBy
        }
      });
      
      return new MaintenanceScheduleModel({
        ...schedule,
        assetName: asset.name
      });
    } catch (error) {
      console.error('Error creating maintenance schedule:', error);
      throw new Error('Failed to create maintenance schedule');
    }
  }
  
  /**
   * Work Order Management
   */
  async getWorkOrders(filters = {}) {
    try {
      const { status, priority, assetId, type, assignedTo, dateFrom, dateTo } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (assetId) whereClause.assetId = assetId;
      if (type) whereClause.type = type;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      if (dateFrom && dateTo) {
        whereClause.requestedDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      const workOrders = await prisma.workOrder.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { requestedDate: 'desc' }
        ],
        include: {
          asset: {
            select: {
              name: true,
              location: true
            }
          }
        }
      });
      
      return workOrders.map(workOrder => new WorkOrderModel({
        ...workOrder,
        assetName: workOrder.asset.name
      }));
    } catch (error) {
      console.error('Error fetching work orders:', error);
      throw new Error('Failed to fetch work orders');
    }
  }
  
  async createWorkOrder(workOrderData) {
    try {
      // Generate work order number
      const workOrderNumber = await this.generateWorkOrderNumber();
      
      // Validate asset exists if assetId is provided
      let assetName = '';
      if (workOrderData.assetId) {
        const asset = await prisma.asset.findUnique({
          where: { id: workOrderData.assetId },
          select: { name: true }
        });
        
        if (!asset) {
          throw new Error('Asset not found');
        }
        
        assetName = asset.name;
      }
      
      const workOrder = await prisma.workOrder.create({
        data: {
          workOrderNumber,
          title: workOrderData.title,
          description: workOrderData.description,
          type: workOrderData.type,
          priority: workOrderData.priority || 'MEDIUM',
          status: workOrderData.status || 'REQUESTED',
          assetId: workOrderData.assetId,
          location: workOrderData.location,
          requestedBy: workOrderData.requestedBy,
          requestedDate: new Date(),
          assignedTo: workOrderData.assignedTo,
          assignedDate: workOrderData.assignedTo ? new Date() : null,
          scheduledStartDate: workOrderData.scheduledStartDate ? new Date(workOrderData.scheduledStartDate) : null,
          scheduledEndDate: workOrderData.scheduledEndDate ? new Date(workOrderData.scheduledEndDate) : null,
          estimatedHours: workOrderData.estimatedHours,
          estimatedCost: workOrderData.estimatedCost,
          instructions: workOrderData.instructions,
          parts: workOrderData.parts || [],
          photos: workOrderData.photos || [],
          documents: workOrderData.documents || [],
          maintenanceScheduleId: workOrderData.maintenanceScheduleId,
          customFields: workOrderData.customFields || {},
          createdBy: workOrderData.createdBy
        }
      });
      
      // If this work order is from a maintenance schedule, update the schedule's last completed date
      if (workOrderData.maintenanceScheduleId) {
        await prisma.maintenanceSchedule.update({
          where: { id: workOrderData.maintenanceScheduleId },
          data: {
            lastCompletedDate: new Date()
          }
        });
      }
      
      return new WorkOrderModel({
        ...workOrder,
        assetName
      });
    } catch (error) {
      console.error('Error creating work order:', error);
      throw new Error('Failed to create work order');
    }
  }
  
  async updateWorkOrderStatus(id, status, updateData = {}) {
    try {
      const updates = {
        status,
        updatedAt: new Date()
      };
      
      // Add status-specific date fields
      if (status === 'ASSIGNED' && !updateData.assignedDate) {
        updates.assignedDate = new Date();
      } else if (status === 'IN_PROGRESS' && !updateData.actualStartDate) {
        updates.actualStartDate = new Date();
      } else if (['COMPLETED', 'CANCELLED'].includes(status) && !updateData.actualEndDate) {
        updates.actualEndDate = new Date();
      }
      
      // Add any additional update data
      Object.assign(updates, updateData);
      
      const workOrder = await prisma.workOrder.update({
        where: { id },
        data: updates,
        include: {
          asset: {
            select: { name: true }
          }
        }
      });
      
      // If work order is completed and linked to a maintenance schedule, update the schedule
      if (status === 'COMPLETED' && workOrder.maintenanceScheduleId) {
        await this.updateMaintenanceScheduleAfterCompletion(workOrder.maintenanceScheduleId);
      }
      
      // If work order is completed, update the asset's last maintenance date
      if (status === 'COMPLETED' && workOrder.assetId) {
        await prisma.asset.update({
          where: { id: workOrder.assetId },
          data: {
            lastMaintenanceDate: new Date()
          }
        });
      }
      
      return new WorkOrderModel({
        ...workOrder,
        assetName: workOrder.asset?.name || ''
      });
    } catch (error) {
      console.error(`Error updating work order status for ID ${id}:`, error);
      throw new Error('Failed to update work order status');
    }
  }
  
  /**
   * Breakdown Management
   */
  async getBreakdownReports(filters = {}) {
    try {
      const { status, impactLevel, assetId, dateFrom, dateTo } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (impactLevel) whereClause.impactLevel = impactLevel;
      if (assetId) whereClause.assetId = assetId;
      if (dateFrom && dateTo) {
        whereClause.breakdownDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      const reports = await prisma.breakdownReport.findMany({
        where: whereClause,
        orderBy: [
          { impactLevel: 'desc' },
          { breakdownDate: 'desc' }
        ],
        include: {
          asset: {
            select: {
              name: true,
              type: true
            }
          }
        }
      });
      
      return reports.map(report => new BreakdownReportModel({
        ...report,
        assetName: report.asset.name
      }));
    } catch (error) {
      console.error('Error fetching breakdown reports:', error);
      throw new Error('Failed to fetch breakdown reports');
    }
  }
  
  async createBreakdownReport(reportData) {
    try {
      // Generate report number
      const reportNumber = await this.generateReportNumber('BR');
      
      // Validate asset exists
      const asset = await prisma.asset.findUnique({
        where: { id: reportData.assetId },
        select: { name: true }
      });
      
      if (!asset) {
        throw new Error('Asset not found');
      }
      
      const report = await prisma.breakdownReport.create({
        data: {
          reportNumber,
          assetId: reportData.assetId,
          breakdownDate: new Date(reportData.breakdownDate || new Date()),
          reportedBy: reportData.reportedBy,
          description: reportData.description,
          impactLevel: reportData.impactLevel || 'MEDIUM',
          productionImpact: reportData.productionImpact,
          estimatedDowntime: reportData.estimatedDowntime,
          rootCause: reportData.rootCause,
          immediateAction: reportData.immediateAction,
          status: reportData.status || 'OPEN',
          photos: reportData.photos || [],
          documents: reportData.documents || [],
          createdBy: reportData.createdBy
        }
      });
      
      // If a work order should be created for this breakdown
      if (reportData.createWorkOrder) {
        await this.createWorkOrder({
          title: `Breakdown Repair - ${asset.name}`,
          description: reportData.description,
          type: 'EMERGENCY',
          priority: this.mapImpactLevelToPriority(reportData.impactLevel),
          assetId: reportData.assetId,
          requestedBy: reportData.reportedBy,
          instructions: reportData.immediateAction,
          createdBy: reportData.createdBy
        });
      }
      
      return new BreakdownReportModel({
        ...report,
        assetName: asset.name
      });
    } catch (error) {
      console.error('Error creating breakdown report:', error);
      throw new Error('Failed to create breakdown report');
    }
  }
  
  /**
   * Parts & Inventory Management
   */
  async getParts(filters = {}) {
    try {
      const { category, status, belowReorderPoint, search } = filters;
      
      const whereClause = {};
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (belowReorderPoint === true) {
        whereClause.currentQuantity = {
          lte: prisma.part.fields.reorderPoint
        };
      }
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { partNumber: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const parts = await prisma.part.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return parts.map(part => new PartModel(part));
    } catch (error) {
      console.error('Error fetching parts:', error);
      throw new Error('Failed to fetch parts');
    }
  }
  
  /**
   * Maintenance Cost Tracking
   */
  async getMaintenanceCosts(filters = {}) {
    try {
      const { assetId, workOrderId, costType, dateFrom, dateTo } = filters;
      
      const whereClause = {};
      if (assetId) whereClause.assetId = assetId;
      if (workOrderId) whereClause.workOrderId = workOrderId;
      if (costType) whereClause.costType = costType;
      if (dateFrom && dateTo) {
        whereClause.date = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      const costs = await prisma.maintenanceCost.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        include: {
          asset: {
            select: { name: true }
          }
        }
      });
      
      return costs.map(cost => new MaintenanceCostModel({
        ...cost,
        assetName: cost.asset?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching maintenance costs:', error);
      throw new Error('Failed to fetch maintenance costs');
    }
  }
  
  /**
   * Compliance & Documentation
   */
  async getComplianceDocuments(filters = {}) {
    try {
      const { documentType, status, assetId, expiringWithin } = filters;
      
      const whereClause = {};
      if (documentType) whereClause.documentType = documentType;
      if (status) whereClause.status = status;
      if (assetId) whereClause.assetId = assetId;
      
      if (expiringWithin) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(expiringWithin));
        
        whereClause.expirationDate = {
          gte: new Date(),
          lte: expirationDate
        };
      }
      
      const documents = await prisma.maintenanceCompliance.findMany({
        where: whereClause,
        orderBy: { expirationDate: 'asc' },
        include: {
          asset: {
            select: { name: true }
          }
        }
      });
      
      return documents.map(doc => new MaintenanceComplianceModel({
        ...doc,
        assetName: doc.asset?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching compliance documents:', error);
      throw new Error('Failed to fetch compliance documents');
    }
  }
  
  /**
   * Dashboard and Analytics
   */
  async getMaintenanceDashboardData() {
    try {
      // Get work orders by status
      const workOrdersByStatus = await prisma.workOrder.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      // Get upcoming maintenance
      const upcomingMaintenance = await prisma.maintenanceSchedule.findMany({
        where: {
          nextDueDate: {
            gte: new Date(),
            lte: new Date(new Date().setDate(new Date().getDate() + 30))
          },
          status: 'ACTIVE'
        },
        orderBy: {
          nextDueDate: 'asc'
        },
        take: 10,
        include: {
          asset: {
            select: { name: true, location: true }
          }
        }
      });
      
      // Get assets with most work orders (last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const assetsWithMostWorkOrders = await prisma.workOrder.groupBy({
        by: ['assetId'],
        _count: {
          id: true
        },
        where: {
          requestedDate: {
            gte: ninetyDaysAgo
          }
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      });
      
      // Get asset details for the top assets
      const assetIds = assetsWithMostWorkOrders.map(item => item.assetId);
      const assetDetails = await prisma.asset.findMany({
        where: {
          id: { in: assetIds }
        },
        select: {
          id: true,
          name: true
        }
      });
      
      // Map asset names to the work order counts
      const topProblemAssets = assetsWithMostWorkOrders.map(item => {
        const asset = assetDetails.find(a => a.id === item.assetId);
        return {
          assetId: item.assetId,
          assetName: asset ? asset.name : 'Unknown Asset',
          workOrderCount: item._count.id
        };
      });
      
      // Get parts below reorder point
      const partsToReorder = await prisma.part.findMany({
        where: {
          currentQuantity: {
            lte: prisma.part.fields.reorderPoint
          }
        },
        orderBy: [
          {
            currentQuantity: 'asc'
          }
        ],
        take: 10
      });
      
      return {
        workOrdersByStatus,
        upcomingMaintenance: upcomingMaintenance.map(schedule => ({
          ...new MaintenanceScheduleModel(schedule),
          assetName: schedule.asset.name
        })),
        topProblemAssets,
        partsToReorder: partsToReorder.map(part => new PartModel(part))
      };
    } catch (error) {
      console.error('Error fetching maintenance dashboard data:', error);
      throw new Error('Failed to fetch maintenance dashboard data');
    }
  }
  
  /**
   * Helper Methods
   */
  async generateWorkOrderNumber() {
    // Format: WO-YYYYMMDD-XXXX where XXXX is a sequential number
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
                   (today.getMonth() + 1).toString().padStart(2, '0') +
                   today.getDate().toString().padStart(2, '0');
    
    // Get the latest work order for today
    const latestWorkOrder = await prisma.workOrder.findFirst({
      where: {
        workOrderNumber: {
          startsWith: `WO-${dateStr}`
        }
      },
      orderBy: {
        workOrderNumber: 'desc'
      }
    });
    
    let sequenceNumber = 1;
    if (latestWorkOrder) {
      const parts = latestWorkOrder.workOrderNumber.split('-');
      if (parts.length === 3) {
        sequenceNumber = parseInt(parts[2]) + 1;
      }
    }
    
    return `WO-${dateStr}-${sequenceNumber.toString().padStart(4, '0')}`;
  }
  
  async generateReportNumber(prefix) {
    // Format: PREFIX-YYYYMMDD-XXXX where XXXX is a sequential number
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
                   (today.getMonth() + 1).toString().padStart(2, '0') +
                   today.getDate().toString().padStart(2, '0');
    
    // Get the latest report for today
    const latestReport = await prisma.breakdownReport.findFirst({
      where: {
        reportNumber: {
          startsWith: `${prefix}-${dateStr}`
        }
      },
      orderBy: {
        reportNumber: 'desc'
      }
    });
    
    let sequenceNumber = 1;
    if (latestReport) {
      const parts = latestReport.reportNumber.split('-');
      if (parts.length === 3) {
        sequenceNumber = parseInt(parts[2]) + 1;
      }
    }
    
    return `${prefix}-${dateStr}-${sequenceNumber.toString().padStart(4, '0')}`;
  }
  
  async updateMaintenanceScheduleAfterCompletion(scheduleId) {
    try {
      const schedule = await prisma.maintenanceSchedule.findUnique({
        where: { id: scheduleId }
      });
      
      if (!schedule) {
        throw new Error('Maintenance schedule not found');
      }
      
      // Calculate next due date based on frequency
      const nextDueDate = this.calculateNextDueDate(
        schedule.lastCompletedDate || new Date(),
        schedule.frequency,
        schedule.interval,
        schedule.intervalUnit
      );
      
      await prisma.maintenanceSchedule.update({
        where: { id: scheduleId },
        data: {
          lastCompletedDate: new Date(),
          nextDueDate,
          updatedAt: new Date()
        }
      });
      
      return true;
    } catch (error) {
      console.error(`Error updating maintenance schedule after completion for ID ${scheduleId}:`, error);
      throw new Error('Failed to update maintenance schedule');
    }
  }
  
  calculateNextDueDate(lastDate, frequency, interval, intervalUnit) {
    const date = new Date(lastDate);
    
    switch (intervalUnit) {
      case 'DAYS':
        date.setDate(date.getDate() + interval);
        break;
      case 'WEEKS':
        date.setDate(date.getDate() + (interval * 7));
        break;
      case 'MONTHS':
        date.setMonth(date.getMonth() + interval);
        break;
      case 'YEARS':
        date.setFullYear(date.getFullYear() + interval);
        break;
      case 'HOURS':
        // For hour-based maintenance, we typically convert to days
        date.setHours(date.getHours() + interval);
        break;
      default:
        // Default to days if unit is not recognized
        date.setDate(date.getDate() + interval);
    }
    
    return date;
  }
  
  mapImpactLevelToPriority(impactLevel) {
    switch (impactLevel) {
      case 'CRITICAL':
        return 'CRITICAL';
      case 'HIGH':
        return 'HIGH';
      case 'MEDIUM':
        return 'MEDIUM';
      case 'LOW':
        return 'LOW';
      default:
        return 'MEDIUM';
    }
  }
}

export default new MaintenanceService();
