/**
 * ProductionScheduleService
 * Service for managing production schedules in the Production Scheduling module
 * 
 * This service provides methods for:
 * - CRUD operations on production schedules
 * - Resource allocation
 * - Capacity planning
 * - Schedule optimization
 */

import ProductionScheduleModel from '../models/ProductionScheduleModel';

class ProductionScheduleService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/api/production/schedules';
  }

  /**
   * Get all production schedules with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array<ProductionScheduleModel>>}
   */
  async getSchedules(filters = {}) {
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
        throw new Error(response.error || 'Failed to fetch production schedules');
      }

      return response.data.map(schedule => ProductionScheduleModel.fromJSON(schedule));
    } catch (error) {
      console.error('Error fetching production schedules:', error);
      throw error;
    }
  }

  /**
   * Get a production schedule by ID
   * @param {string} id - Schedule ID
   * @returns {Promise<ProductionScheduleModel>}
   */
  async getScheduleById(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error fetching production schedule with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new production schedule
   * @param {ProductionScheduleModel} schedule - Schedule data
   * @returns {Promise<ProductionScheduleModel>}
   */
  async createSchedule(schedule) {
    try {
      const response = await this.apiClient.post(this.endpoint, schedule.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error creating production schedule:', error);
      throw error;
    }
  }

  /**
   * Update an existing production schedule
   * @param {string} id - Schedule ID
   * @param {ProductionScheduleModel} schedule - Updated schedule data
   * @returns {Promise<ProductionScheduleModel>}
   */
  async updateSchedule(id, schedule) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${id}`, schedule.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating production schedule with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a production schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<boolean>}
   */
  async deleteSchedule(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete production schedule');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting production schedule with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add an item to a production schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} item - Item data
   * @returns {Promise<ProductionScheduleModel>}
   */
  async addItem(scheduleId, item) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${scheduleId}/items`, item);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add item to production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding item to production schedule with ID ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Update an item in a production schedule
   * @param {string} scheduleId - Schedule ID
   * @param {string} itemId - Item ID
   * @param {Object} updates - Item updates
   * @returns {Promise<ProductionScheduleModel>}
   */
  async updateItem(scheduleId, itemId, updates) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${scheduleId}/items/${itemId}`, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update item in production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating item ${itemId} in production schedule ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an item from a production schedule
   * @param {string} scheduleId - Schedule ID
   * @param {string} itemId - Item ID
   * @returns {Promise<ProductionScheduleModel>}
   */
  async deleteItem(scheduleId, itemId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${scheduleId}/items/${itemId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete item from production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error deleting item ${itemId} from production schedule ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Add a resource to a production schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} resource - Resource data
   * @returns {Promise<ProductionScheduleModel>}
   */
  async addResource(scheduleId, resource) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${scheduleId}/resources`, resource);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add resource to production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding resource to production schedule with ID ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Update a resource in a production schedule
   * @param {string} scheduleId - Schedule ID
   * @param {string} resourceId - Resource ID
   * @param {Object} updates - Resource updates
   * @returns {Promise<ProductionScheduleModel>}
   */
  async updateResource(scheduleId, resourceId, updates) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${scheduleId}/resources/${resourceId}`, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update resource in production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating resource ${resourceId} in production schedule ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a resource from a production schedule
   * @param {string} scheduleId - Schedule ID
   * @param {string} resourceId - Resource ID
   * @returns {Promise<ProductionScheduleModel>}
   */
  async deleteResource(scheduleId, resourceId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${scheduleId}/resources/${resourceId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete resource from production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error deleting resource ${resourceId} from production schedule ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Optimize a production schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} optimizationParams - Optimization parameters
   * @returns {Promise<ProductionScheduleModel>}
   */
  async optimizeSchedule(scheduleId, optimizationParams = {}) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${scheduleId}/optimize`, optimizationParams);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to optimize production schedule');
      }

      return ProductionScheduleModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error optimizing production schedule with ID ${scheduleId}:`, error);
      throw error;
    }
  }

  /**
   * Generate a production schedule report
   * @param {string} scheduleId - Schedule ID
   * @param {string} reportType - Report type
   * @returns {Promise<Blob>}
   */
  async generateReport(scheduleId, reportType = 'summary') {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${scheduleId}/reports/${reportType}`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      console.error(`Error generating ${reportType} report for production schedule with ID ${scheduleId}:`, error);
      throw error;
    }
  }
}

export default ProductionScheduleService;
