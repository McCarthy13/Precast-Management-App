/**
 * DispatchService
 * Service for managing dispatches in the Dispatch module
 * 
 * This service provides methods for:
 * - CRUD operations on dispatches
 * - Tracking updates
 * - Delivery confirmation
 * - Route optimization
 */

import DispatchModel from '../models/DispatchModel';

class DispatchService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/api/dispatch';
  }

  /**
   * Get all dispatches with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array<DispatchModel>>}
   */
  async getDispatches(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await this.apiClient.get(`${this.endpoint}${query}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dispatches');
      }

      return response.data.map(dispatch => DispatchModel.fromJSON(dispatch));
    } catch (error) {
      console.error('Error fetching dispatches:', error);
      throw error;
    }
  }

  /**
   * Get a dispatch by ID
   * @param {string} id - Dispatch ID
   * @returns {Promise<DispatchModel>}
   */
  async getDispatchById(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dispatch');
      }

      return DispatchModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error fetching dispatch with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new dispatch
   * @param {DispatchModel} dispatch - Dispatch data
   * @returns {Promise<DispatchModel>}
   */
  async createDispatch(dispatch) {
    try {
      const response = await this.apiClient.post(this.endpoint, dispatch.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create dispatch');
      }

      return DispatchModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error creating dispatch:', error);
      throw error;
    }
  }

  /**
   * Update an existing dispatch
   * @param {string} id - Dispatch ID
   * @param {DispatchModel} dispatch - Updated dispatch data
   * @returns {Promise<DispatchModel>}
   */
  async updateDispatch(id, dispatch) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${id}`, dispatch.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update dispatch');
      }

      return DispatchModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating dispatch with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a dispatch
   * @param {string} id - Dispatch ID
   * @returns {Promise<boolean>}
   */
  async deleteDispatch(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete dispatch');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting dispatch with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add a tracking update to a dispatch
   * @param {string} id - Dispatch ID
   * @param {Object} update - Tracking update data
   * @returns {Promise<DispatchModel>}
   */
  async addTrackingUpdate(id, update) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/tracking`, update);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add tracking update');
      }

      return DispatchModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding tracking update to dispatch with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Mark a dispatch as delivered
   * @param {string} id - Dispatch ID
   * @param {Object} deliveryData - Delivery confirmation data
   * @returns {Promise<DispatchModel>}
   */
  async markAsDelivered(id, deliveryData) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/deliver`, deliveryData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark dispatch as delivered');
      }

      return DispatchModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error marking dispatch with ID ${id} as delivered:`, error);
      throw error;
    }
  }

  /**
   * Cancel a dispatch
   * @param {string} id - Dispatch ID
   * @param {Object} cancellationData - Cancellation data
   * @returns {Promise<DispatchModel>}
   */
  async cancelDispatch(id, cancellationData) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/cancel`, cancellationData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel dispatch');
      }

      return DispatchModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error cancelling dispatch with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Optimize routes for multiple dispatches
   * @param {Array<string>} dispatchIds - Array of dispatch IDs to optimize
   * @param {Object} optimizationParams - Optimization parameters
   * @returns {Promise<Object>}
   */
  async optimizeRoutes(dispatchIds, optimizationParams = {}) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/optimize-routes`, {
        dispatchIds,
        ...optimizationParams
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to optimize routes');
      }

      return response.data;
    } catch (error) {
      console.error('Error optimizing routes:', error);
      throw error;
    }
  }

  /**
   * Generate dispatch documents
   * @param {string} id - Dispatch ID
   * @param {string} documentType - Document type
   * @returns {Promise<Blob>}
   */
  async generateDocument(id, documentType = 'delivery_note') {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}/documents/${documentType}`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      console.error(`Error generating ${documentType} for dispatch with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get dispatch analytics
   * @param {Object} params - Analytics parameters
   * @returns {Promise<Object>}
   */
  async getAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add params to query params
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await this.apiClient.get(`${this.endpoint}/analytics${query}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dispatch analytics');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching dispatch analytics:', error);
      throw error;
    }
  }
}

export default DispatchService;
