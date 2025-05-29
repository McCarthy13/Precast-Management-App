/**
 * FieldService
 * Service for managing field operations in the Field Module
 * 
 * This service provides methods for:
 * - CRUD operations on field operations
 * - Task management
 * - Inspection tracking
 * - Issue reporting and resolution
 * - Photo management
 */

import FieldOperationModel from '../models/FieldOperationModel';

class FieldService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/api/field';
  }

  /**
   * Get all field operations with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array<FieldOperationModel>>}
   */
  async getFieldOperations(filters = {}) {
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
        throw new Error(response.error || 'Failed to fetch field operations');
      }

      return response.data.map(operation => FieldOperationModel.fromJSON(operation));
    } catch (error) {
      console.error('Error fetching field operations:', error);
      throw error;
    }
  }

  /**
   * Get a field operation by ID
   * @param {string} id - Field operation ID
   * @returns {Promise<FieldOperationModel>}
   */
  async getFieldOperationById(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error fetching field operation with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new field operation
   * @param {FieldOperationModel} operation - Field operation data
   * @returns {Promise<FieldOperationModel>}
   */
  async createFieldOperation(operation) {
    try {
      const response = await this.apiClient.post(this.endpoint, operation.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error creating field operation:', error);
      throw error;
    }
  }

  /**
   * Update an existing field operation
   * @param {string} id - Field operation ID
   * @param {FieldOperationModel} operation - Updated field operation data
   * @returns {Promise<FieldOperationModel>}
   */
  async updateFieldOperation(id, operation) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${id}`, operation.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating field operation with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a field operation
   * @param {string} id - Field operation ID
   * @returns {Promise<boolean>}
   */
  async deleteFieldOperation(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete field operation');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting field operation with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add a task to a field operation
   * @param {string} operationId - Field operation ID
   * @param {Object} task - Task data
   * @returns {Promise<FieldOperationModel>}
   */
  async addTask(operationId, task) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${operationId}/tasks`, task);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add task to field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding task to field operation with ID ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Update a task in a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} taskId - Task ID
   * @param {Object} updates - Task updates
   * @returns {Promise<FieldOperationModel>}
   */
  async updateTask(operationId, taskId, updates) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${operationId}/tasks/${taskId}`, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update task in field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating task ${taskId} in field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a task from a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} taskId - Task ID
   * @returns {Promise<FieldOperationModel>}
   */
  async deleteTask(operationId, taskId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${operationId}/tasks/${taskId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete task from field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error deleting task ${taskId} from field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Add an inspection to a field operation
   * @param {string} operationId - Field operation ID
   * @param {Object} inspection - Inspection data
   * @returns {Promise<FieldOperationModel>}
   */
  async addInspection(operationId, inspection) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${operationId}/inspections`, inspection);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add inspection to field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding inspection to field operation with ID ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Update an inspection in a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} inspectionId - Inspection ID
   * @param {Object} updates - Inspection updates
   * @returns {Promise<FieldOperationModel>}
   */
  async updateInspection(operationId, inspectionId, updates) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${operationId}/inspections/${inspectionId}`, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update inspection in field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating inspection ${inspectionId} in field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an inspection from a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} inspectionId - Inspection ID
   * @returns {Promise<FieldOperationModel>}
   */
  async deleteInspection(operationId, inspectionId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${operationId}/inspections/${inspectionId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete inspection from field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error deleting inspection ${inspectionId} from field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Add an issue to a field operation
   * @param {string} operationId - Field operation ID
   * @param {Object} issue - Issue data
   * @returns {Promise<FieldOperationModel>}
   */
  async addIssue(operationId, issue) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${operationId}/issues`, issue);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add issue to field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding issue to field operation with ID ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Update an issue in a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} issueId - Issue ID
   * @param {Object} updates - Issue updates
   * @returns {Promise<FieldOperationModel>}
   */
  async updateIssue(operationId, issueId, updates) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${operationId}/issues/${issueId}`, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update issue in field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating issue ${issueId} in field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Resolve an issue in a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} issueId - Issue ID
   * @param {Object} resolution - Resolution data
   * @returns {Promise<FieldOperationModel>}
   */
  async resolveIssue(operationId, issueId, resolution) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${operationId}/issues/${issueId}/resolve`, resolution);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to resolve issue in field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error resolving issue ${issueId} in field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an issue from a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} issueId - Issue ID
   * @returns {Promise<FieldOperationModel>}
   */
  async deleteIssue(operationId, issueId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${operationId}/issues/${issueId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete issue from field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error deleting issue ${issueId} from field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Upload a photo to a field operation
   * @param {string} operationId - Field operation ID
   * @param {FormData} formData - Form data containing the photo
   * @returns {Promise<FieldOperationModel>}
   */
  async uploadPhoto(operationId, formData) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${operationId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to upload photo to field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error uploading photo to field operation with ID ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a photo from a field operation
   * @param {string} operationId - Field operation ID
   * @param {string} photoId - Photo ID
   * @returns {Promise<FieldOperationModel>}
   */
  async deletePhoto(operationId, photoId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${operationId}/photos/${photoId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete photo from field operation');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error deleting photo ${photoId} from field operation ${operationId}:`, error);
      throw error;
    }
  }

  /**
   * Mark a field operation as completed
   * @param {string} operationId - Field operation ID
   * @param {Object} completionData - Completion data
   * @returns {Promise<FieldOperationModel>}
   */
  async markAsCompleted(operationId, completionData) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${operationId}/complete`, completionData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to mark field operation as completed');
      }

      return FieldOperationModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error marking field operation with ID ${operationId} as completed:`, error);
      throw error;
    }
  }

  /**
   * Generate field operation report
   * @param {string} operationId - Field operation ID
   * @param {string} reportType - Report type
   * @returns {Promise<Blob>}
   */
  async generateReport(operationId, reportType = 'summary') {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${operationId}/reports/${reportType}`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      console.error(`Error generating ${reportType} report for field operation with ID ${operationId}:`, error);
      throw error;
    }
  }
}

export default FieldService;
