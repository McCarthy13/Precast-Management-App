/**
 * Dispatch Model
 * Represents a dispatch record in the Dispatch module
 * 
 * This model handles all dispatch-related data including:
 * - Shipment details
 * - Delivery information
 * - Tracking
 * - Status updates
 */

class DispatchModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.dispatchNumber = data.dispatchNumber || '';
    this.projectId = data.projectId || null;
    this.clientId = data.clientId || null;
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.scheduledDate = data.scheduledDate || null;
    this.actualDate = data.actualDate || null;
    this.deliveryAddress = data.deliveryAddress || '';
    this.contactName = data.contactName || '';
    this.contactPhone = data.contactPhone || '';
    this.items = data.items || [];
    this.vehicles = data.vehicles || [];
    this.drivers = data.drivers || [];
    this.notes = data.notes || '';
    this.specialInstructions = data.specialInstructions || '';
    this.signatureRequired = data.signatureRequired !== undefined ? data.signatureRequired : true;
    this.signedBy = data.signedBy || null;
    this.signatureDate = data.signatureDate || null;
    this.trackingUpdates = data.trackingUpdates || [];
    this.createdBy = data.createdBy || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.customFields = data.customFields || {};
  }

  calculateTotalWeight() {
    return this.items.reduce((sum, item) => sum + (item.weight || 0), 0);
  }

  calculateTotalVolume() {
    return this.items.reduce((sum, item) => sum + (item.volume || 0), 0);
  }

  calculateTotalItems() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  isOverdue() {
    if (!this.scheduledDate) return false;
    
    const today = new Date();
    return today > new Date(this.scheduledDate) && this.status !== 'delivered' && this.status !== 'cancelled';
  }

  isDelivered() {
    return this.status === 'delivered';
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

  addVehicle(vehicle) {
    this.vehicles.push(vehicle);
    return this;
  }

  removeVehicle(vehicleId) {
    this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== vehicleId);
    return this;
  }

  addDriver(driver) {
    this.drivers.push(driver);
    return this;
  }

  removeDriver(driverId) {
    this.drivers = this.drivers.filter(driver => driver.id !== driverId);
    return this;
  }

  addTrackingUpdate(update) {
    this.trackingUpdates.push({
      ...update,
      timestamp: update.timestamp || new Date(),
    });
    return this;
  }

  markAsDelivered(signedBy = null) {
    this.status = 'delivered';
    this.actualDate = new Date();
    this.signedBy = signedBy;
    this.signatureDate = new Date();
    
    this.addTrackingUpdate({
      status: 'delivered',
      location: this.deliveryAddress,
      notes: `Delivered and signed by ${signedBy || 'recipient'}`,
    });
    
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      dispatchNumber: this.dispatchNumber,
      projectId: this.projectId,
      clientId: this.clientId,
      status: this.status,
      priority: this.priority,
      scheduledDate: this.scheduledDate,
      actualDate: this.actualDate,
      deliveryAddress: this.deliveryAddress,
      contactName: this.contactName,
      contactPhone: this.contactPhone,
      items: this.items,
      vehicles: this.vehicles,
      drivers: this.drivers,
      notes: this.notes,
      specialInstructions: this.specialInstructions,
      signatureRequired: this.signatureRequired,
      signedBy: this.signedBy,
      signatureDate: this.signatureDate,
      trackingUpdates: this.trackingUpdates,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      customFields: this.customFields
    };
  }

  static fromJSON(json) {
    return new DispatchModel(json);
  }

  static getValidStatuses() {
    return ['pending', 'scheduled', 'in_transit', 'delivered', 'cancelled', 'delayed'];
  }

  static getValidPriorities() {
    return ['low', 'medium', 'high', 'urgent'];
  }
}

export default DispatchModel;
