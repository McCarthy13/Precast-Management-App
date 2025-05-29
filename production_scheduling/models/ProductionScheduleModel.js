/**
 * Production Schedule Model
 * Represents a production schedule in the Production Scheduling module
 * 
 * This model handles all production schedule-related data including:
 * - Schedule details
 * - Resource allocation
 * - Timeline
 * - Dependencies
 */

class ProductionScheduleModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.status = data.status || 'draft';
    this.priority = data.priority || 'medium';
    this.projectId = data.projectId || null;
    this.facilityId = data.facilityId || null;
    this.items = data.items || [];
    this.resources = data.resources || [];
    this.shifts = data.shifts || [];
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.customFields = data.customFields || {};
  }

  calculateDuration() {
    if (!this.startDate || !this.endDate) return 0;
    
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    // Calculate difference in days
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  calculateResourceUtilization() {
    const utilization = {};
    
    this.items.forEach(item => {
      if (item.resourceId) {
        if (!utilization[item.resourceId]) {
          utilization[item.resourceId] = 0;
        }
        utilization[item.resourceId] += item.duration || 0;
      }
    });
    
    return utilization;
  }

  calculateCapacityUtilization() {
    if (!this.shifts.length) return 0;
    
    const totalCapacity = this.shifts.reduce((sum, shift) => {
      return sum + (shift.capacity || 0);
    }, 0);
    
    const totalUtilized = this.items.reduce((sum, item) => {
      return sum + (item.capacityRequired || 0);
    }, 0);
    
    return totalCapacity > 0 ? (totalUtilized / totalCapacity) * 100 : 0;
  }

  addItem(item) {
    this.items.push(item);
    return this;
  }

  updateItem(itemId, updates) {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
      this.items[itemIndex] = { ...this.items[itemIndex], ...updates };
    }
    return this;
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    return this;
  }

  addResource(resource) {
    this.resources.push(resource);
    return this;
  }

  updateResource(resourceId, updates) {
    const resourceIndex = this.resources.findIndex(resource => resource.id === resourceId);
    if (resourceIndex >= 0) {
      this.resources[resourceIndex] = { ...this.resources[resourceIndex], ...updates };
    }
    return this;
  }

  removeResource(resourceId) {
    this.resources = this.resources.filter(resource => resource.id !== resourceId);
    return this;
  }

  addShift(shift) {
    this.shifts.push(shift);
    return this;
  }

  updateShift(shiftId, updates) {
    const shiftIndex = this.shifts.findIndex(shift => shift.id === shiftId);
    if (shiftIndex >= 0) {
      this.shifts[shiftIndex] = { ...this.shifts[shiftIndex], ...updates };
    }
    return this;
  }

  removeShift(shiftId) {
    this.shifts = this.shifts.filter(shift => shift.id !== shiftId);
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      priority: this.priority,
      projectId: this.projectId,
      facilityId: this.facilityId,
      items: this.items,
      resources: this.resources,
      shifts: this.shifts,
      notes: this.notes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      customFields: this.customFields
    };
  }

  static fromJSON(json) {
    return new ProductionScheduleModel(json);
  }

  static getValidStatuses() {
    return ['draft', 'published', 'in_progress', 'completed', 'cancelled'];
  }

  static getValidPriorities() {
    return ['low', 'medium', 'high', 'urgent'];
  }
}

export default ProductionScheduleModel;
