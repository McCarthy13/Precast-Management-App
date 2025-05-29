/**
 * Environmental/Sustainability Tracking Models
 * Defines data models for the Environmental/Sustainability module
 */

// Carbon Emission Model
export class CarbonEmissionModel {
  constructor(data) {
    this.id = data.id || '';
    this.source = data.source || ''; // FACILITY, PROJECT, PROCESS, VEHICLE, etc.
    this.sourceId = data.sourceId || '';
    this.sourceName = data.sourceName || '';
    this.emissionType = data.emissionType || ''; // CO2, CH4, N2O, etc.
    this.amount = data.amount || 0;
    this.unit = data.unit || 'kg';
    this.date = data.date || '';
    this.calculationMethod = data.calculationMethod || '';
    this.notes = data.notes || '';
    this.reportedBy = data.reportedBy || '';
    this.verified = data.verified || false;
    this.verifiedBy = data.verifiedBy || '';
    this.verifiedDate = data.verifiedDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Energy Usage Model
export class EnergyUsageModel {
  constructor(data) {
    this.id = data.id || '';
    this.source = data.source || ''; // FACILITY, EQUIPMENT, PROCESS, etc.
    this.sourceId = data.sourceId || '';
    this.sourceName = data.sourceName || '';
    this.energyType = data.energyType || ''; // ELECTRICITY, NATURAL_GAS, DIESEL, etc.
    this.amount = data.amount || 0;
    this.unit = data.unit || 'kWh';
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || '';
    this.cost = data.cost || 0;
    this.notes = data.notes || '';
    this.reportedBy = data.reportedBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Waste Tracking Model
export class WasteTrackingModel {
  constructor(data) {
    this.id = data.id || '';
    this.source = data.source || ''; // FACILITY, PROJECT, PROCESS, etc.
    this.sourceId = data.sourceId || '';
    this.sourceName = data.sourceName || '';
    this.wasteType = data.wasteType || ''; // CONCRETE, STEEL, WOOD, HAZARDOUS, etc.
    this.disposalMethod = data.disposalMethod || ''; // LANDFILL, RECYCLING, REUSE, etc.
    this.amount = data.amount || 0;
    this.unit = data.unit || 'kg';
    this.date = data.date || '';
    this.cost = data.cost || 0;
    this.vendor = data.vendor || '';
    this.notes = data.notes || '';
    this.reportedBy = data.reportedBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Recycling Model
export class RecyclingModel {
  constructor(data) {
    this.id = data.id || '';
    this.source = data.source || ''; // FACILITY, PROJECT, PROCESS, etc.
    this.sourceId = data.sourceId || '';
    this.sourceName = data.sourceName || '';
    this.materialType = data.materialType || ''; // CONCRETE, STEEL, WOOD, PLASTIC, etc.
    this.amount = data.amount || 0;
    this.unit = data.unit || 'kg';
    this.date = data.date || '';
    this.vendor = data.vendor || '';
    this.revenue = data.revenue || 0;
    this.notes = data.notes || '';
    this.reportedBy = data.reportedBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Compliance Document Model
export class ComplianceDocumentModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.type = data.type || ''; // PERMIT, INSPECTION, REPORT, CERTIFICATION, etc.
    this.agency = data.agency || ''; // EPA, STATE_DEP, LOCAL, etc.
    this.documentNumber = data.documentNumber || '';
    this.issueDate = data.issueDate || '';
    this.expirationDate = data.expirationDate || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, EXPIRED, PENDING, REVOKED
    this.facility = data.facility || '';
    this.description = data.description || '';
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.uploadedBy = data.uploadedBy || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Sustainability Initiative Model
export class SustainabilityInitiativeModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // ENERGY_REDUCTION, WASTE_REDUCTION, CERTIFICATION, etc.
    this.status = data.status || 'PLANNED'; // PLANNED, IN_PROGRESS, COMPLETED, ON_HOLD
    this.startDate = data.startDate || '';
    this.targetCompletionDate = data.targetCompletionDate || '';
    this.actualCompletionDate = data.actualCompletionDate || null;
    this.goals = data.goals || [];
    this.budget = data.budget || 0;
    this.actualCost = data.actualCost || 0;
    this.leadContact = data.leadContact || '';
    this.team = data.team || [];
    this.documents = data.documents || [];
    this.progress = data.progress || 0; // 0-100%
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Sustainable Material Model
export class SustainableMaterialModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.category = data.category || ''; // CONCRETE, STEEL, WOOD, INSULATION, etc.
    this.supplier = data.supplier || '';
    this.supplierContact = data.supplierContact || '';
    this.description = data.description || '';
    this.sustainabilityFeatures = data.sustainabilityFeatures || [];
    this.certifications = data.certifications || [];
    this.recycledContent = data.recycledContent || 0; // Percentage
    this.carbonFootprint = data.carbonFootprint || 0;
    this.carbonFootprintUnit = data.carbonFootprintUnit || 'kg CO2e/kg';
    this.cost = data.cost || 0;
    this.costUnit = data.costUnit || '$/unit';
    this.documents = data.documents || [];
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Environmental Metric Model
export class EnvironmentalMetricModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.category = data.category || ''; // EMISSIONS, ENERGY, WASTE, WATER, etc.
    this.description = data.description || '';
    this.unit = data.unit || '';
    this.target = data.target || null;
    this.current = data.current || null;
    this.baseline = data.baseline || null;
    this.baselineDate = data.baselineDate || '';
    this.trend = data.trend || 'STABLE'; // IMPROVING, STABLE, WORSENING
    this.dataSource = data.dataSource || '';
    this.calculationMethod = data.calculationMethod || '';
    this.reportingFrequency = data.reportingFrequency || 'MONTHLY'; // DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUALLY
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
