/**
 * Shipping/Dispatch Module Services
 * Provides API and data handling for the Shipping/Dispatch module
 */

import { 
  ShipmentModel,
  DeliveryModel,
  DriverModel,
  VehicleModel,
  RouteModel,
  LoadPlanModel,
  DeliveryStatusModel
} from '../models/ShippingModel';

/**
 * Service for managing shipping and dispatch operations
 */
export class ShippingService {
  /**
   * Get all shipments
   * @param {Object} filters - Optional filters
   * @param {String} filters.status - Filter by shipment status
   * @param {String} filters.date - Filter by shipment date
   * @param {String} filters.projectId - Filter by project ID
   * @returns {Promise<Array>} List of shipments
   */
  async getShipments(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.projectId) queryParams.append('projectId', filters.projectId);
      
      const response = await fetch(`/api/shipping/shipments?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch shipments');
      }
      
      const data = await response.json();
      return data.map(item => new ShipmentModel(item));
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw error;
    }
  }
  
  /**
   * Get a single shipment by ID
   * @param {String} id - Shipment ID
   * @returns {Promise<ShipmentModel>} Shipment
   */
  async getShipment(id) {
    try {
      const response = await fetch(`/api/shipping/shipments/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch shipment with ID ${id}`);
      }
      
      const data = await response.json();
      return new ShipmentModel(data);
    } catch (error) {
      console.error(`Error fetching shipment ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new shipment
   * @param {ShipmentModel} shipment - Shipment data
   * @returns {Promise<ShipmentModel>} Created shipment
   */
  async createShipment(shipment) {
    try {
      const response = await fetch('/api/shipping/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }
      
      const data = await response.json();
      return new ShipmentModel(data);
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing shipment
   * @param {String} id - Shipment ID
   * @param {ShipmentModel} shipment - Updated shipment data
   * @returns {Promise<ShipmentModel>} Updated shipment
   */
  async updateShipment(id, shipment) {
    try {
      const response = await fetch(`/api/shipping/shipments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipment),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update shipment with ID ${id}`);
      }
      
      const data = await response.json();
      return new ShipmentModel(data);
    } catch (error) {
      console.error(`Error updating shipment ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Mark pieces as shipped
   * @param {Array} pieceIds - Array of piece IDs
   * @param {Object} shippingData - Shipping data
   * @param {String} shippingData.shipmentId - Shipment ID
   * @param {String} shippingData.shippedBy - User ID who shipped the pieces
   * @param {String} shippingData.shippingDate - Shipping date
   * @returns {Promise<Object>} Result with updated pieces
   */
  async markPiecesAsShipped(pieceIds, shippingData) {
    try {
      const response = await fetch('/api/shipping/mark-shipped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pieceIds, shippingData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark pieces as shipped');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking pieces as shipped:', error);
      throw error;
    }
  }
  
  /**
   * Generate driver paperwork
   * @param {String} shipmentId - Shipment ID
   * @returns {Promise<Object>} Result with paperwork URL
   */
  async generateDriverPaperwork(shipmentId) {
    try {
      // First, verify all pieces in shipment are marked as shipped
      const shipment = await this.getShipment(shipmentId);
      
      // Check if any pieces are not marked as shipped
      const unshippedPieces = shipment.pieces.filter(piece => piece.status !== 'SHIPPED');
      
      if (unshippedPieces.length > 0) {
        throw new Error('Cannot generate paperwork: All pieces must be marked as shipped first');
      }
      
      // If all pieces are shipped, generate paperwork
      const response = await fetch(`/api/shipping/shipments/${shipmentId}/paperwork`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate paperwork for shipment ${shipmentId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error generating paperwork for shipment ${shipmentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get available drivers
   * @param {Object} filters - Optional filters
   * @param {String} filters.date - Filter by availability date
   * @returns {Promise<Array>} List of available drivers
   */
  async getAvailableDrivers(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.date) queryParams.append('date', filters.date);
      
      const response = await fetch(`/api/shipping/drivers/available?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available drivers');
      }
      
      const data = await response.json();
      return data.map(item => new DriverModel(item));
    } catch (error) {
      console.error('Error fetching available drivers:', error);
      throw error;
    }
  }
  
  /**
   * Get available vehicles
   * @param {Object} filters - Optional filters
   * @param {String} filters.date - Filter by availability date
   * @param {String} filters.type - Filter by vehicle type
   * @returns {Promise<Array>} List of available vehicles
   */
  async getAvailableVehicles(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.type) queryParams.append('type', filters.type);
      
      const response = await fetch(`/api/shipping/vehicles/available?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available vehicles');
      }
      
      const data = await response.json();
      return data.map(item => new VehicleModel(item));
    } catch (error) {
      console.error('Error fetching available vehicles:', error);
      throw error;
    }
  }
  
  /**
   * Create a load plan
   * @param {LoadPlanModel} loadPlan - Load plan data
   * @returns {Promise<LoadPlanModel>} Created load plan
   */
  async createLoadPlan(loadPlan) {
    try {
      const response = await fetch('/api/shipping/load-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loadPlan),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create load plan');
      }
      
      const data = await response.json();
      return new LoadPlanModel(data);
    } catch (error) {
      console.error('Error creating load plan:', error);
      throw error;
    }
  }
  
  /**
   * Get load plan for a shipment
   * @param {String} shipmentId - Shipment ID
   * @returns {Promise<LoadPlanModel>} Load plan
   */
  async getLoadPlan(shipmentId) {
    try {
      const response = await fetch(`/api/shipping/shipments/${shipmentId}/load-plan`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch load plan for shipment ${shipmentId}`);
      }
      
      const data = await response.json();
      return new LoadPlanModel(data);
    } catch (error) {
      console.error(`Error fetching load plan for shipment ${shipmentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Generate optimal route
   * @param {String} shipmentId - Shipment ID
   * @returns {Promise<RouteModel>} Generated route
   */
  async generateRoute(shipmentId) {
    try {
      const response = await fetch(`/api/shipping/shipments/${shipmentId}/route`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate route for shipment ${shipmentId}`);
      }
      
      const data = await response.json();
      return new RouteModel(data);
    } catch (error) {
      console.error(`Error generating route for shipment ${shipmentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update delivery status
   * @param {String} deliveryId - Delivery ID
   * @param {String} status - New status
   * @param {Object} statusData - Additional status data
   * @returns {Promise<DeliveryStatusModel>} Updated delivery status
   */
  async updateDeliveryStatus(deliveryId, status, statusData = {}) {
    try {
      const response = await fetch(`/api/shipping/deliveries/${deliveryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, ...statusData }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status for delivery ${deliveryId}`);
      }
      
      const data = await response.json();
      return new DeliveryStatusModel(data);
    } catch (error) {
      console.error(`Error updating status for delivery ${deliveryId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get delivery history
   * @param {String} deliveryId - Delivery ID
   * @returns {Promise<Array>} Delivery status history
   */
  async getDeliveryHistory(deliveryId) {
    try {
      const response = await fetch(`/api/shipping/deliveries/${deliveryId}/history`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch history for delivery ${deliveryId}`);
      }
      
      const data = await response.json();
      return data.map(item => new DeliveryStatusModel(item));
    } catch (error) {
      console.error(`Error fetching history for delivery ${deliveryId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const shippingService = new ShippingService();
