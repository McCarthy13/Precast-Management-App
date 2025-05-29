/**
 * EstimateService
 * Service for managing estimates in the Estimating and Quoting module
 * 
 * This service provides methods for:
 * - CRUD operations on estimates
 * - Calculation of pricing
 * - PDF generation
 * - Approval workflows
 * - Conversion to projects
 */

import EstimateModel from '../models/EstimateModel';

class EstimateService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/api/estimating/estimates';
  }

  /**
   * Get all estimates with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array<EstimateModel>>}
   */
  async getEstimates(filters = {}) {
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
        throw new Error(response.error || 'Failed to fetch estimates');
      }

      return response.data.map(estimate => EstimateModel.fromJSON(estimate));
    } catch (error) {
      console.error('Error fetching estimates:', error);
      throw error;
    }
  }

  /**
   * Get an estimate by ID
   * @param {string} id - Estimate ID
   * @returns {Promise<EstimateModel>}
   */
  async getEstimateById(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch estimate');
      }

      return EstimateModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error fetching estimate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new estimate
   * @param {EstimateModel} estimate - Estimate data
   * @returns {Promise<EstimateModel>}
   */
  async createEstimate(estimate) {
    try {
      // Ensure calculations are up to date
      estimate.recalculate();
      
      const response = await this.apiClient.post(this.endpoint, estimate.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create estimate');
      }

      return EstimateModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error creating estimate:', error);
      throw error;
    }
  }

  /**
   * Update an existing estimate
   * @param {string} id - Estimate ID
   * @param {EstimateModel} estimate - Updated estimate data
   * @returns {Promise<EstimateModel>}
   */
  async updateEstimate(id, estimate) {
    try {
      // Ensure calculations are up to date
      estimate.recalculate();
      
      const response = await this.apiClient.put(`${this.endpoint}/${id}`, estimate.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update estimate');
      }

      return EstimateModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating estimate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an estimate
   * @param {string} id - Estimate ID
   * @returns {Promise<boolean>}
   */
  async deleteEstimate(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete estimate');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting estimate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Generate PDF for an estimate
   * @param {string} id - Estimate ID
   * @returns {Promise<Blob>}
   */
  async generatePdf(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}/pdf`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      console.error(`Error generating PDF for estimate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Send an estimate to a client
   * @param {string} id - Estimate ID
   * @param {Object} emailData - Email data (recipient, subject, message)
   * @returns {Promise<Object>}
   */
  async sendEstimate(id, emailData) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/send`, emailData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send estimate');
      }

      return response.data;
    } catch (error) {
      console.error(`Error sending estimate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Approve an estimate
   * @param {string} id - Estimate ID
   * @param {Object} approvalData - Approval data (approver, notes)
   * @returns {Promise<EstimateModel>}
   */
  async approveEstimate(id, approvalData) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/approve`, approvalData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to approve estimate');
      }

      return EstimateModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error approving estimate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reject an estimate
   * @param {string} id - Estimate ID
   * @param {Object} rejectionData - Rejection data (reason, notes)
   * @returns {Promise<EstimateModel>}
   */
  async rejectEstimate(id, rejectionData) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/reject`, rejectionData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to reject estimate');
      }

      return EstimateModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error rejecting estimate with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Convert an estimate to a project
   * @param {string} id - Estimate ID
   * @param {Object} projectData - Additional project data
   * @returns {Promise<Object>}
   */
  async convertToProject(id, projectData = {}) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/convert-to-project`, projectData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to convert estimate to project');
      }

      return response.data;
    } catch (error) {
      console.error(`Error converting estimate with ID ${id} to project:`, error);
      throw error;
    }
  }

  /**
   * Duplicate an estimate
   * @param {string} id - Estimate ID
   * @returns {Promise<EstimateModel>}
   */
  async duplicateEstimate(id) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/duplicate`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to duplicate estimate');
      }

      return EstimateModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error duplicating estimate with ID ${id}:`, error);
      throw error;
    }
  }
}

export default EstimateService;
