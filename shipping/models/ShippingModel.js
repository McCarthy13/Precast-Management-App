/**
 * Shipping/Dispatch Models
 * Defines data models for the Shipping/Dispatch module
 */

// Shipment Model
export class ShipmentModel {
  constructor(data) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.shipmentNumber = data.shipmentNumber || '';
    this.status = data.status || 'PLANNED'; // PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    this.scheduledDate = data.scheduledDate || '';
    this.actualDate = data.actualDate || null;
    this.destination = data.destination || {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      coordinates: { lat: 0, lng: 0 }
    };
    this.pieces = data.pieces || [];
    this.driver = data.driver || null;
    this.vehicle = data.vehicle || null;
    this.loadPlan = data.loadPlan || null;
    this.route = data.route || null;
    this.specialInstructions = data.specialInstructions || '';
    this.paperworkGenerated = data.paperworkGenerated || false;
    this.paperworkUrl = data.paperworkUrl || '';
    this.paperworkGeneratedBy = data.paperworkGeneratedBy || '';
    this.paperworkGeneratedDate = data.paperworkGeneratedDate || null;
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Delivery Model
export class DeliveryModel {
  constructor(data) {
    this.id = data.id || '';
    this.shipmentId = data.shipmentId || '';
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, IN_TRANSIT, DELIVERED, FAILED
    this.scheduledDate = data.scheduledDate || '';
    this.actualDeliveryDate = data.actualDeliveryDate || null;
    this.recipient = data.recipient || '';
    this.recipientSignature = data.recipientSignature || '';
    this.deliveryPhotos = data.deliveryPhotos || [];
    this.notes = data.notes || '';
    this.issues = data.issues || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Driver Model
export class DriverModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.employeeId = data.employeeId || '';
    this.licenseNumber = data.licenseNumber || '';
    this.licenseExpiration = data.licenseExpiration || '';
    this.licenseClass = data.licenseClass || '';
    this.endorsements = data.endorsements || [];
    this.phoneNumber = data.phoneNumber || '';
    this.email = data.email || '';
    this.status = data.status || 'AVAILABLE'; // AVAILABLE, ASSIGNED, OFF_DUTY, ON_LEAVE
    this.currentVehicle = data.currentVehicle || null;
    this.currentShipment = data.currentShipment || null;
    this.certifications = data.certifications || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Vehicle Model
export class VehicleModel {
  constructor(data) {
    this.id = data.id || '';
    this.type = data.type || ''; // FLATBED, LOWBOY, BOOM_TRUCK, etc.
    this.make = data.make || '';
    this.model = data.model || '';
    this.year = data.year || '';
    this.licensePlate = data.licensePlate || '';
    this.vin = data.vin || '';
    this.status = data.status || 'AVAILABLE'; // AVAILABLE, ASSIGNED, MAINTENANCE, OUT_OF_SERVICE
    this.currentDriver = data.currentDriver || null;
    this.currentShipment = data.currentShipment || null;
    this.capacity = data.capacity || {
      maxWeight: 0,
      maxLength: 0,
      maxWidth: 0,
      maxHeight: 0
    };
    this.lastMaintenanceDate = data.lastMaintenanceDate || '';
    this.nextMaintenanceDate = data.nextMaintenanceDate || '';
    this.maintenanceNotes = data.maintenanceNotes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Route Model
export class RouteModel {
  constructor(data) {
    this.id = data.id || '';
    this.shipmentId = data.shipmentId || '';
    this.origin = data.origin || {
      name: '',
      address: '',
      coordinates: { lat: 0, lng: 0 }
    };
    this.destination = data.destination || {
      name: '',
      address: '',
      coordinates: { lat: 0, lng: 0 }
    };
    this.waypoints = data.waypoints || [];
    this.estimatedDistance = data.estimatedDistance || 0;
    this.estimatedDuration = data.estimatedDuration || 0;
    this.directions = data.directions || [];
    this.mapUrl = data.mapUrl || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Load Plan Model
export class LoadPlanModel {
  constructor(data) {
    this.id = data.id || '';
    this.shipmentId = data.shipmentId || '';
    this.vehicleId = data.vehicleId || '';
    this.pieces = data.pieces || [];
    this.loadingSequence = data.loadingSequence || [];
    this.loadingInstructions = data.loadingInstructions || '';
    this.specialHandlingNotes = data.specialHandlingNotes || '';
    this.totalWeight = data.totalWeight || 0;
    this.dimensions = data.dimensions || {
      length: 0,
      width: 0,
      height: 0
    };
    this.loadingDiagram = data.loadingDiagram || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Delivery Status Model
export class DeliveryStatusModel {
  constructor(data) {
    this.id = data.id || '';
    this.deliveryId = data.deliveryId || '';
    this.status = data.status || '';
    this.timestamp = data.timestamp || new Date().toISOString();
    this.location = data.location || {
      coordinates: { lat: 0, lng: 0 },
      address: ''
    };
    this.notes = data.notes || '';
    this.photos = data.photos || [];
    this.updatedBy = data.updatedBy || '';
  }
}
