/**
 * AI Integration for Shipping/Dispatch
 * Provides AI-powered features for the Shipping/Dispatch module
 */

import { shippingService } from './ShippingService';

/**
 * Service for AI-powered shipping and dispatch features
 */
export class ShippingAIService {
  /**
   * Generate optimal load plan for a shipment
   * @param {String} shipmentId - Shipment ID
   * @returns {Promise<Object>} Optimal load plan
   */
  async generateOptimalLoadPlan(shipmentId) {
    try {
      const response = await fetch(`/api/shipping/ai/optimal-load-plan/${shipmentId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate optimal load plan for shipment ${shipmentId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error generating optimal load plan for shipment ${shipmentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Predict delivery time for a shipment
   * @param {String} shipmentId - Shipment ID
   * @param {Object} params - Additional parameters
   * @param {Boolean} params.considerTraffic - Whether to consider traffic conditions
   * @param {Boolean} params.considerWeather - Whether to consider weather conditions
   * @returns {Promise<Object>} Delivery time prediction
   */
  async predictDeliveryTime(shipmentId, params = {}) {
    try {
      const response = await fetch(`/api/shipping/ai/delivery-time-prediction/${shipmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to predict delivery time for shipment ${shipmentId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error predicting delivery time for shipment ${shipmentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Optimize delivery routes for multiple shipments
   * @param {Array} shipmentIds - Array of shipment IDs
   * @param {Object} params - Additional parameters
   * @param {Boolean} params.minimizeDistance - Whether to minimize total distance
   * @param {Boolean} params.minimizeTime - Whether to minimize total time
   * @param {Boolean} params.balanceLoads - Whether to balance loads across vehicles
   * @returns {Promise<Object>} Optimized routes
   */
  async optimizeDeliveryRoutes(shipmentIds, params = {}) {
    try {
      const response = await fetch('/api/shipping/ai/optimize-routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shipmentIds, ...params }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize delivery routes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error optimizing delivery routes:', error);
      throw error;
    }
  }
  
  /**
   * Predict potential delivery issues
   * @param {String} shipmentId - Shipment ID
   * @returns {Promise<Object>} Potential issues
   */
  async predictDeliveryIssues(shipmentId) {
    try {
      const response = await fetch(`/api/shipping/ai/delivery-issues/${shipmentId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to predict delivery issues for shipment ${shipmentId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error predicting delivery issues for shipment ${shipmentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Recommend optimal driver and vehicle assignment
   * @param {String} shipmentId - Shipment ID
   * @returns {Promise<Object>} Driver and vehicle recommendations
   */
  async recommendDriverAndVehicle(shipmentId) {
    try {
      const response = await fetch(`/api/shipping/ai/driver-vehicle-recommendation/${shipmentId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to recommend driver and vehicle for shipment ${shipmentId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error recommending driver and vehicle for shipment ${shipmentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Analyze delivery performance
   * @param {Object} params - Parameters for analysis
   * @param {String} params.timeframe - Timeframe for analysis (day, week, month)
   * @param {Array} params.drivers - Driver IDs to analyze
   * @param {Array} params.vehicles - Vehicle IDs to analyze
   * @returns {Promise<Object>} Performance analysis
   */
  async analyzeDeliveryPerformance(params = {}) {
    try {
      const response = await fetch('/api/shipping/ai/performance-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze delivery performance');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing delivery performance:', error);
      throw error;
    }
  }
  
  /**
   * Predict optimal shipping schedule
   * @param {Object} params - Parameters for prediction
   * @param {Number} params.daysAhead - Number of days to look ahead
   * @param {Array} params.priorityProjects - Priority project IDs
   * @returns {Promise<Object>} Optimal shipping schedule
   */
  async predictOptimalShippingSchedule(params = {}) {
    try {
      const response = await fetch('/api/shipping/ai/optimal-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Failed to predict optimal shipping schedule');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error predicting optimal shipping schedule:', error);
      throw error;
    }
  }
  
  /**
   * Analyze delivery photos for verification
   * @param {String} deliveryId - Delivery ID
   * @param {Array} photos - Array of photo files
   * @returns {Promise<Object>} Photo analysis results
   */
  async analyzeDeliveryPhotos(deliveryId, photos) {
    try {
      const formData = new FormData();
      formData.append('deliveryId', deliveryId);
      photos.forEach((photo, index) => {
        formData.append(`photo${index}`, photo);
      });
      
      const response = await fetch('/api/shipping/ai/analyze-photos', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to analyze photos for delivery ${deliveryId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error analyzing photos for delivery ${deliveryId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const shippingAIService = new ShippingAIService();
