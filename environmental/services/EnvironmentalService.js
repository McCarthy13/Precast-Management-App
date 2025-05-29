/**
 * Environmental/Sustainability Tracking Services
 * Provides business logic and data access for the Environmental/Sustainability module
 */

import prisma from '../../../lib/prisma';
import { 
  CarbonEmissionModel, 
  EnergyUsageModel, 
  WasteTrackingModel,
  RecyclingModel,
  ComplianceDocumentModel,
  SustainabilityInitiativeModel,
  SustainableMaterialModel,
  EnvironmentalMetricModel
} from '../models/EnvironmentalModel';

export class EnvironmentalService {
  /**
   * Carbon Emissions Management
   */
  async getCarbonEmissions(filters = {}) {
    try {
      const { source, sourceId, startDate, endDate, emissionType } = filters;
      
      const whereClause = {};
      if (source) whereClause.source = source;
      if (sourceId) whereClause.sourceId = sourceId;
      if (emissionType) whereClause.emissionType = emissionType;
      if (startDate && endDate) {
        whereClause.date = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }
      
      const emissions = await prisma.carbonEmission.findMany({
        where: whereClause,
        orderBy: { date: 'desc' }
      });
      
      return emissions.map(emission => new CarbonEmissionModel(emission));
    } catch (error) {
      console.error('Error fetching carbon emissions:', error);
      throw new Error('Failed to fetch carbon emissions');
    }
  }
  
  async createCarbonEmission(emissionData) {
    try {
      const emission = await prisma.carbonEmission.create({
        data: {
          source: emissionData.source,
          sourceId: emissionData.sourceId,
          sourceName: emissionData.sourceName,
          emissionType: emissionData.emissionType,
          amount: emissionData.amount,
          unit: emissionData.unit,
          date: new Date(emissionData.date),
          calculationMethod: emissionData.calculationMethod,
          notes: emissionData.notes,
          reportedBy: emissionData.reportedBy,
          verified: emissionData.verified || false,
          verifiedBy: emissionData.verifiedBy,
          verifiedDate: emissionData.verifiedDate ? new Date(emissionData.verifiedDate) : null
        }
      });
      
      return new CarbonEmissionModel(emission);
    } catch (error) {
      console.error('Error creating carbon emission:', error);
      throw new Error('Failed to create carbon emission');
    }
  }
  
  async updateCarbonEmission(id, emissionData) {
    try {
      const emission = await prisma.carbonEmission.update({
        where: { id },
        data: {
          source: emissionData.source,
          sourceId: emissionData.sourceId,
          sourceName: emissionData.sourceName,
          emissionType: emissionData.emissionType,
          amount: emissionData.amount,
          unit: emissionData.unit,
          date: new Date(emissionData.date),
          calculationMethod: emissionData.calculationMethod,
          notes: emissionData.notes,
          reportedBy: emissionData.reportedBy,
          verified: emissionData.verified,
          verifiedBy: emissionData.verifiedBy,
          verifiedDate: emissionData.verifiedDate ? new Date(emissionData.verifiedDate) : null,
          updatedAt: new Date()
        }
      });
      
      return new CarbonEmissionModel(emission);
    } catch (error) {
      console.error('Error updating carbon emission:', error);
      throw new Error('Failed to update carbon emission');
    }
  }
  
  async deleteCarbonEmission(id) {
    try {
      await prisma.carbonEmission.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting carbon emission:', error);
      throw new Error('Failed to delete carbon emission');
    }
  }
  
  /**
   * Energy Usage Management
   */
  async getEnergyUsage(filters = {}) {
    try {
      const { source, sourceId, startDate, endDate, energyType } = filters;
      
      const whereClause = {};
      if (source) whereClause.source = source;
      if (sourceId) whereClause.sourceId = sourceId;
      if (energyType) whereClause.energyType = energyType;
      if (startDate) {
        whereClause.startDate = {
          gte: new Date(startDate)
        };
      }
      if (endDate) {
        whereClause.endDate = {
          lte: new Date(endDate)
        };
      }
      
      const energyUsage = await prisma.energyUsage.findMany({
        where: whereClause,
        orderBy: { startDate: 'desc' }
      });
      
      return energyUsage.map(usage => new EnergyUsageModel(usage));
    } catch (error) {
      console.error('Error fetching energy usage:', error);
      throw new Error('Failed to fetch energy usage');
    }
  }
  
  async createEnergyUsage(usageData) {
    try {
      const usage = await prisma.energyUsage.create({
        data: {
          source: usageData.source,
          sourceId: usageData.sourceId,
          sourceName: usageData.sourceName,
          energyType: usageData.energyType,
          amount: usageData.amount,
          unit: usageData.unit,
          startDate: new Date(usageData.startDate),
          endDate: new Date(usageData.endDate),
          cost: usageData.cost,
          notes: usageData.notes,
          reportedBy: usageData.reportedBy
        }
      });
      
      return new EnergyUsageModel(usage);
    } catch (error) {
      console.error('Error creating energy usage:', error);
      throw new Error('Failed to create energy usage');
    }
  }
  
  /**
   * Waste Tracking Management
   */
  async getWasteTracking(filters = {}) {
    try {
      const { source, sourceId, startDate, endDate, wasteType, disposalMethod } = filters;
      
      const whereClause = {};
      if (source) whereClause.source = source;
      if (sourceId) whereClause.sourceId = sourceId;
      if (wasteType) whereClause.wasteType = wasteType;
      if (disposalMethod) whereClause.disposalMethod = disposalMethod;
      if (startDate && endDate) {
        whereClause.date = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }
      
      const wasteTracking = await prisma.wasteTracking.findMany({
        where: whereClause,
        orderBy: { date: 'desc' }
      });
      
      return wasteTracking.map(waste => new WasteTrackingModel(waste));
    } catch (error) {
      console.error('Error fetching waste tracking:', error);
      throw new Error('Failed to fetch waste tracking');
    }
  }
  
  /**
   * Sustainability Initiatives Management
   */
  async getSustainabilityInitiatives(filters = {}) {
    try {
      const { status, type, startDateFrom, startDateTo } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (startDateFrom && startDateTo) {
        whereClause.startDate = {
          gte: new Date(startDateFrom),
          lte: new Date(startDateTo)
        };
      }
      
      const initiatives = await prisma.sustainabilityInitiative.findMany({
        where: whereClause,
        orderBy: { startDate: 'desc' }
      });
      
      return initiatives.map(initiative => new SustainabilityInitiativeModel(initiative));
    } catch (error) {
      console.error('Error fetching sustainability initiatives:', error);
      throw new Error('Failed to fetch sustainability initiatives');
    }
  }
  
  async createSustainabilityInitiative(initiativeData) {
    try {
      const initiative = await prisma.sustainabilityInitiative.create({
        data: {
          title: initiativeData.title,
          description: initiativeData.description,
          type: initiativeData.type,
          status: initiativeData.status || 'PLANNED',
          startDate: new Date(initiativeData.startDate),
          targetCompletionDate: new Date(initiativeData.targetCompletionDate),
          actualCompletionDate: initiativeData.actualCompletionDate ? new Date(initiativeData.actualCompletionDate) : null,
          goals: initiativeData.goals,
          budget: initiativeData.budget,
          actualCost: initiativeData.actualCost,
          leadContact: initiativeData.leadContact,
          team: initiativeData.team,
          documents: initiativeData.documents,
          progress: initiativeData.progress || 0,
          notes: initiativeData.notes,
          createdBy: initiativeData.createdBy
        }
      });
      
      return new SustainabilityInitiativeModel(initiative);
    } catch (error) {
      console.error('Error creating sustainability initiative:', error);
      throw new Error('Failed to create sustainability initiative');
    }
  }
  
  /**
   * Environmental Metrics Management
   */
  async getEnvironmentalMetrics(filters = {}) {
    try {
      const { category } = filters;
      
      const whereClause = {};
      if (category) whereClause.category = category;
      
      const metrics = await prisma.environmentalMetric.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return metrics.map(metric => new EnvironmentalMetricModel(metric));
    } catch (error) {
      console.error('Error fetching environmental metrics:', error);
      throw new Error('Failed to fetch environmental metrics');
    }
  }
  
  /**
   * Compliance Documents Management
   */
  async getComplianceDocuments(filters = {}) {
    try {
      const { type, status, expirationDateFrom, expirationDateTo } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (expirationDateFrom && expirationDateTo) {
        whereClause.expirationDate = {
          gte: new Date(expirationDateFrom),
          lte: new Date(expirationDateTo)
        };
      }
      
      const documents = await prisma.complianceDocument.findMany({
        where: whereClause,
        orderBy: { expirationDate: 'asc' }
      });
      
      return documents.map(doc => new ComplianceDocumentModel(doc));
    } catch (error) {
      console.error('Error fetching compliance documents:', error);
      throw new Error('Failed to fetch compliance documents');
    }
  }
  
  /**
   * Dashboard and Analytics
   */
  async getEnvironmentalDashboardData() {
    try {
      // Get total emissions by type for current year
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31);
      
      const emissionsByType = await prisma.carbonEmission.groupBy({
        by: ['emissionType'],
        _sum: {
          amount: true
        },
        where: {
          date: {
            gte: startOfYear,
            lte: endOfYear
          }
        }
      });
      
      // Get waste by disposal method
      const wasteByMethod = await prisma.wasteTracking.groupBy({
        by: ['disposalMethod'],
        _sum: {
          amount: true
        },
        where: {
          date: {
            gte: startOfYear,
            lte: endOfYear
          }
        }
      });
      
      // Get initiatives by status
      const initiativesByStatus = await prisma.sustainabilityInitiative.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      // Get upcoming document expirations
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const upcomingExpirations = await prisma.complianceDocument.findMany({
        where: {
          expirationDate: {
            gte: new Date(),
            lte: nextMonth
          },
          status: 'ACTIVE'
        },
        orderBy: {
          expirationDate: 'asc'
        }
      });
      
      return {
        emissionsByType,
        wasteByMethod,
        initiativesByStatus,
        upcomingExpirations: upcomingExpirations.map(doc => new ComplianceDocumentModel(doc))
      };
    } catch (error) {
      console.error('Error fetching environmental dashboard data:', error);
      throw new Error('Failed to fetch environmental dashboard data');
    }
  }
}

export default new EnvironmentalService();
