/**
 * Equipment Model
 * Represents yard equipment used for material handling
 */
class Equipment {
  constructor({
    id = null,
    name,
    type, // forklift, crane, truck, etc.
    status = 'available', // available, in-use, maintenance, out-of-service
    capacity,
    capacityUnit,
    currentOperatorId = null,
    currentLocationId = null,
    maintenanceSchedule = [],
    lastMaintenanceDate = null,
    properties = {},
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = status;
    this.capacity = capacity;
    this.capacityUnit = capacityUnit;
    this.currentOperatorId = currentOperatorId;
    this.currentLocationId = currentLocationId;
    this.maintenanceSchedule = maintenanceSchedule;
    this.lastMaintenanceDate = lastMaintenanceDate;
    this.properties = properties;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Assign equipment to an operator
   * @param {string} operatorId - ID of the operator
   * @returns {Equipment} - Updated Equipment object
   */
  assignToOperator(operatorId) {
    if (this.status !== 'available') {
      throw new Error(`Equipment is not available. Current status: ${this.status}`);
    }
    
    this.currentOperatorId = operatorId;
    this.status = 'in-use';
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Release equipment from current operator
   * @returns {Equipment} - Updated Equipment object
   */
  release() {
    this.currentOperatorId = null;
    this.status = 'available';
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Set equipment location
   * @param {string} locationId - ID of the location
   * @returns {Equipment} - Updated Equipment object
   */
  setLocation(locationId) {
    this.currentLocationId = locationId;
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Schedule maintenance for the equipment
   * @param {Date} scheduledDate - Date when maintenance is scheduled
   * @param {string} type - Type of maintenance
   * @param {string} notes - Additional notes
   * @returns {Equipment} - Updated Equipment object
   */
  scheduleMaintenance(scheduledDate, type, notes = '') {
    this.maintenanceSchedule.push({
      id: `maint_${Date.now()}`,
      scheduledDate,
      type,
      notes,
      status: 'scheduled',
      createdAt: new Date()
    });
    
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Complete a maintenance task
   * @param {string} maintenanceId - ID of the maintenance task
   * @param {string} completedBy - ID of the user who completed the maintenance
   * @param {string} notes - Additional notes
   * @returns {Equipment} - Updated Equipment object
   */
  completeMaintenance(maintenanceId, completedBy, notes = '') {
    const maintenanceIndex = this.maintenanceSchedule.findIndex(m => m.id === maintenanceId);
    
    if (maintenanceIndex === -1) {
      throw new Error(`Maintenance task with ID ${maintenanceId} not found`);
    }
    
    this.maintenanceSchedule[maintenanceIndex] = {
      ...this.maintenanceSchedule[maintenanceIndex],
      status: 'completed',
      completedBy,
      completedAt: new Date(),
      notes: this.maintenanceSchedule[maintenanceIndex].notes 
        ? `${this.maintenanceSchedule[maintenanceIndex].notes}\n${notes}`
        : notes
    };
    
    this.lastMaintenanceDate = new Date();
    this.status = 'available';
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Set equipment status
   * @param {string} newStatus - New status value
   * @returns {Equipment} - Updated Equipment object
   */
  setStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Convert to a plain object for storage/transmission
   * @returns {Object} - Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      capacity: this.capacity,
      capacityUnit: this.capacityUnit,
      currentOperatorId: this.currentOperatorId,
      currentLocationId: this.currentLocationId,
      maintenanceSchedule: this.maintenanceSchedule,
      lastMaintenanceDate: this.lastMaintenanceDate,
      properties: this.properties,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create an Equipment object from a plain object
   * @param {Object} data - Plain object data
   * @returns {Equipment} - New Equipment instance
   */
  static fromObject(data) {
    return new Equipment(data);
  }
}

module.exports = Equipment;
