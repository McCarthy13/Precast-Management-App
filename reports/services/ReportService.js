/**
 * ReportService
 * Service for managing custom reports in the Custom Reports module
 * 
 * This service provides methods for:
 * - CRUD operations on reports
 * - Report generation and execution
 * - Scheduling and distribution
 * - Data source management
 */

import ReportModel from '../models/ReportModel';

class ReportService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/api/reports';
  }

  /**
   * Get all reports with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array<ReportModel>>}
   */
  async getReports(filters = {}) {
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
        throw new Error(response.error || 'Failed to fetch reports');
      }

      return response.data.map(report => ReportModel.fromJSON(report));
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  /**
   * Get a report by ID
   * @param {string} id - Report ID
   * @returns {Promise<ReportModel>}
   */
  async getReportById(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch report');
      }

      return ReportModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error fetching report with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new report
   * @param {ReportModel} report - Report data
   * @returns {Promise<ReportModel>}
   */
  async createReport(report) {
    try {
      const response = await this.apiClient.post(this.endpoint, report.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create report');
      }

      return ReportModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  /**
   * Update an existing report
   * @param {string} id - Report ID
   * @param {ReportModel} report - Updated report data
   * @returns {Promise<ReportModel>}
   */
  async updateReport(id, report) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${id}`, report.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update report');
      }

      return ReportModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating report with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a report
   * @param {string} id - Report ID
   * @returns {Promise<boolean>}
   */
  async deleteReport(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete report');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting report with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Execute a report with optional parameters
   * @param {string} id - Report ID
   * @param {Object} parameters - Optional parameters for report execution
   * @param {string} format - Output format (pdf, csv, excel, etc.)
   * @returns {Promise<Blob|Object>}
   */
  async executeReport(id, parameters = {}, format = 'pdf') {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/execute`, {
        parameters,
        format,
      }, {
        responseType: format === 'json' ? 'json' : 'blob',
      });
      
      if (!response.success && format === 'json') {
        throw new Error(response.error || 'Failed to execute report');
      }

      return response;
    } catch (error) {
      console.error(`Error executing report with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Schedule a report for recurring execution
   * @param {string} id - Report ID
   * @param {Object} schedule - Schedule configuration
   * @returns {Promise<Object>}
   */
  async scheduleReport(id, schedule) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/schedule`, schedule);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to schedule report');
      }

      return response.data;
    } catch (error) {
      console.error(`Error scheduling report with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled report
   * @param {string} id - Report ID
   * @returns {Promise<boolean>}
   */
  async cancelSchedule(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}/schedule`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel report schedule');
      }

      return true;
    } catch (error) {
      console.error(`Error cancelling schedule for report with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get available data sources for reports
   * @returns {Promise<Array<Object>>}
   */
  async getDataSources() {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/data-sources`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch data sources');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching data sources:', error);
      throw error;
    }
  }

  /**
   * Get available fields for a specific data source
   * @param {string} dataSourceId - Data source ID
   * @returns {Promise<Array<Object>>}
   */
  async getDataSourceFields(dataSourceId) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/data-sources/${dataSourceId}/fields`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch data source fields');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching fields for data source ${dataSourceId}:`, error);
      throw error;
    }
  }

  /**
   * Preview report data based on current configuration
   * @param {Object} reportConfig - Report configuration
   * @param {Object} parameters - Optional parameters for preview
   * @param {number} limit - Maximum number of records to preview
   * @returns {Promise<Object>}
   */
  async previewReport(reportConfig, parameters = {}, limit = 100) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/preview`, {
        reportConfig,
        parameters,
        limit,
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to preview report');
      }

      return response.data;
    } catch (error) {
      console.error('Error previewing report:', error);
      throw error;
    }
  }

  /**
   * Export a report definition for sharing or backup
   * @param {string} id - Report ID
   * @returns {Promise<Object>}
   */
  async exportReportDefinition(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}/export`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to export report definition');
      }

      return response.data;
    } catch (error) {
      console.error(`Error exporting report definition for ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Import a report definition
   * @param {Object} definition - Report definition
   * @returns {Promise<ReportModel>}
   */
  async importReportDefinition(definition) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/import`, definition);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to import report definition');
      }

      return ReportModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error importing report definition:', error);
      throw error;
    }
  }

  /**
   * Clone an existing report
   * @param {string} id - Report ID to clone
   * @param {Object} overrides - Optional property overrides for the cloned report
   * @returns {Promise<ReportModel>}
   */
  async cloneReport(id, overrides = {}) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/clone`, overrides);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to clone report');
      }

      return ReportModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error cloning report with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get execution history for a report
   * @param {string} id - Report ID
   * @param {Object} filters - Optional filters for history
   * @returns {Promise<Array<Object>>}
   */
  async getReportExecutionHistory(id, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await this.apiClient.get(`${this.endpoint}/${id}/history${query}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch report execution history');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching execution history for report with ID ${id}:`, error);
      throw error;
    }
  }
}

export default ReportService;
