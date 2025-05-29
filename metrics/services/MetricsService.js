/**
 * Metrics Tracking & Analytics Module Services
 * Provides API and data handling for the Metrics module
 */

import { 
  MetricDefinitionModel, 
  MetricDataPointModel,
  DashboardModel,
  DashboardWidgetModel,
  ReportTemplateModel,
  ReportExecutionModel,
  ContinuousImprovementModel,
  ActionItemModel,
  PredefinedMetrics
} from '../models/MetricsModel';

/**
 * Service for managing metrics definitions and data
 */
export class MetricsService {
  /**
   * Get all metric definitions
   * @param {Object} filters - Optional filters
   * @param {String} filters.category - Filter by category
   * @param {Boolean} filters.isActive - Filter by active status
   * @param {Array} filters.visibleTo - Filter by roles that can view
   * @returns {Promise<Array>} List of metric definitions
   */
  async getMetricDefinitions(filters = {}) {
    try {
      // This would be replaced with an actual API call
      const response = await fetch('/api/metrics/definitions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch metric definitions');
      }
      
      const data = await response.json();
      return data.map(item => new MetricDefinitionModel(item));
    } catch (error) {
      console.error('Error fetching metric definitions:', error);
      throw error;
    }
  }
  
  /**
   * Get a single metric definition by ID
   * @param {String} id - Metric definition ID
   * @returns {Promise<MetricDefinitionModel>} Metric definition
   */
  async getMetricDefinition(id) {
    try {
      const response = await fetch(`/api/metrics/definitions/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metric definition with ID ${id}`);
      }
      
      const data = await response.json();
      return new MetricDefinitionModel(data);
    } catch (error) {
      console.error(`Error fetching metric definition ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new metric definition
   * @param {MetricDefinitionModel} metricDefinition - Metric definition data
   * @returns {Promise<MetricDefinitionModel>} Created metric definition
   */
  async createMetricDefinition(metricDefinition) {
    try {
      const response = await fetch('/api/metrics/definitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metricDefinition),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create metric definition');
      }
      
      const data = await response.json();
      return new MetricDefinitionModel(data);
    } catch (error) {
      console.error('Error creating metric definition:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing metric definition
   * @param {String} id - Metric definition ID
   * @param {MetricDefinitionModel} metricDefinition - Updated metric definition data
   * @returns {Promise<MetricDefinitionModel>} Updated metric definition
   */
  async updateMetricDefinition(id, metricDefinition) {
    try {
      const response = await fetch(`/api/metrics/definitions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metricDefinition),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update metric definition with ID ${id}`);
      }
      
      const data = await response.json();
      return new MetricDefinitionModel(data);
    } catch (error) {
      console.error(`Error updating metric definition ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a metric definition
   * @param {String} id - Metric definition ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteMetricDefinition(id) {
    try {
      const response = await fetch(`/api/metrics/definitions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete metric definition with ID ${id}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting metric definition ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get metric data points
   * @param {String} metricId - Metric definition ID
   * @param {Object} filters - Optional filters
   * @param {Date} filters.startDate - Filter by start date
   * @param {Date} filters.endDate - Filter by end date
   * @returns {Promise<Array>} List of metric data points
   */
  async getMetricDataPoints(metricId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) queryParams.append('endDate', filters.endDate.toISOString());
      
      const response = await fetch(`/api/metrics/data/${metricId}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data points for metric ${metricId}`);
      }
      
      const data = await response.json();
      return data.map(item => new MetricDataPointModel(item));
    } catch (error) {
      console.error(`Error fetching data points for metric ${metricId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a new metric data point
   * @param {MetricDataPointModel} dataPoint - Metric data point
   * @returns {Promise<MetricDataPointModel>} Created data point
   */
  async addMetricDataPoint(dataPoint) {
    try {
      const response = await fetch('/api/metrics/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPoint),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add metric data point');
      }
      
      const data = await response.json();
      return new MetricDataPointModel(data);
    } catch (error) {
      console.error('Error adding metric data point:', error);
      throw error;
    }
  }
  
  /**
   * Get predefined metrics library
   * @returns {Array} List of predefined metrics
   */
  getPredefinedMetrics() {
    return PredefinedMetrics.map(metric => new MetricDefinitionModel(metric));
  }
}

/**
 * Service for managing dashboards
 */
export class DashboardService {
  /**
   * Get all dashboards
   * @param {Object} filters - Optional filters
   * @param {Array} filters.visibleTo - Filter by roles that can view
   * @returns {Promise<Array>} List of dashboards
   */
  async getDashboards(filters = {}) {
    try {
      const response = await fetch('/api/metrics/dashboards', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboards');
      }
      
      const data = await response.json();
      return data.map(item => new DashboardModel(item));
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      throw error;
    }
  }
  
  /**
   * Get a single dashboard by ID
   * @param {String} id - Dashboard ID
   * @returns {Promise<DashboardModel>} Dashboard
   */
  async getDashboard(id) {
    try {
      const response = await fetch(`/api/metrics/dashboards/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard with ID ${id}`);
      }
      
      const data = await response.json();
      return new DashboardModel(data);
    } catch (error) {
      console.error(`Error fetching dashboard ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new dashboard
   * @param {DashboardModel} dashboard - Dashboard data
   * @returns {Promise<DashboardModel>} Created dashboard
   */
  async createDashboard(dashboard) {
    try {
      const response = await fetch('/api/metrics/dashboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashboard),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create dashboard');
      }
      
      const data = await response.json();
      return new DashboardModel(data);
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing dashboard
   * @param {String} id - Dashboard ID
   * @param {DashboardModel} dashboard - Updated dashboard data
   * @returns {Promise<DashboardModel>} Updated dashboard
   */
  async updateDashboard(id, dashboard) {
    try {
      const response = await fetch(`/api/metrics/dashboards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashboard),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update dashboard with ID ${id}`);
      }
      
      const data = await response.json();
      return new DashboardModel(data);
    } catch (error) {
      console.error(`Error updating dashboard ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a dashboard
   * @param {String} id - Dashboard ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteDashboard(id) {
    try {
      const response = await fetch(`/api/metrics/dashboards/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete dashboard with ID ${id}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting dashboard ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get dashboard widgets
   * @param {String} dashboardId - Dashboard ID
   * @returns {Promise<Array>} List of dashboard widgets
   */
  async getDashboardWidgets(dashboardId) {
    try {
      const response = await fetch(`/api/metrics/dashboards/${dashboardId}/widgets`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch widgets for dashboard ${dashboardId}`);
      }
      
      const data = await response.json();
      return data.map(item => new DashboardWidgetModel(item));
    } catch (error) {
      console.error(`Error fetching widgets for dashboard ${dashboardId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a widget to a dashboard
   * @param {String} dashboardId - Dashboard ID
   * @param {DashboardWidgetModel} widget - Widget data
   * @returns {Promise<DashboardWidgetModel>} Created widget
   */
  async addDashboardWidget(dashboardId, widget) {
    try {
      const response = await fetch(`/api/metrics/dashboards/${dashboardId}/widgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(widget),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add widget to dashboard ${dashboardId}`);
      }
      
      const data = await response.json();
      return new DashboardWidgetModel(data);
    } catch (error) {
      console.error(`Error adding widget to dashboard ${dashboardId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update a dashboard widget
   * @param {String} dashboardId - Dashboard ID
   * @param {String} widgetId - Widget ID
   * @param {DashboardWidgetModel} widget - Updated widget data
   * @returns {Promise<DashboardWidgetModel>} Updated widget
   */
  async updateDashboardWidget(dashboardId, widgetId, widget) {
    try {
      const response = await fetch(`/api/metrics/dashboards/${dashboardId}/widgets/${widgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(widget),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update widget ${widgetId} in dashboard ${dashboardId}`);
      }
      
      const data = await response.json();
      return new DashboardWidgetModel(data);
    } catch (error) {
      console.error(`Error updating widget ${widgetId} in dashboard ${dashboardId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a dashboard widget
   * @param {String} dashboardId - Dashboard ID
   * @param {String} widgetId - Widget ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteDashboardWidget(dashboardId, widgetId) {
    try {
      const response = await fetch(`/api/metrics/dashboards/${dashboardId}/widgets/${widgetId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete widget ${widgetId} from dashboard ${dashboardId}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting widget ${widgetId} from dashboard ${dashboardId}:`, error);
      throw error;
    }
  }
}

/**
 * Service for managing reports
 */
export class ReportService {
  /**
   * Get all report templates
   * @param {Object} filters - Optional filters
   * @param {Array} filters.visibleTo - Filter by roles that can view
   * @returns {Promise<Array>} List of report templates
   */
  async getReportTemplates(filters = {}) {
    try {
      const response = await fetch('/api/metrics/reports', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch report templates');
      }
      
      const data = await response.json();
      return data.map(item => new ReportTemplateModel(item));
    } catch (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }
  }
  
  /**
   * Get a single report template by ID
   * @param {String} id - Report template ID
   * @returns {Promise<ReportTemplateModel>} Report template
   */
  async getReportTemplate(id) {
    try {
      const response = await fetch(`/api/metrics/reports/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report template with ID ${id}`);
      }
      
      const data = await response.json();
      return new ReportTemplateModel(data);
    } catch (error) {
      console.error(`Error fetching report template ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new report template
   * @param {ReportTemplateModel} reportTemplate - Report template data
   * @returns {Promise<ReportTemplateModel>} Created report template
   */
  async createReportTemplate(reportTemplate) {
    try {
      const response = await fetch('/api/metrics/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportTemplate),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create report template');
      }
      
      const data = await response.json();
      return new ReportTemplateModel(data);
    } catch (error) {
      console.error('Error creating report template:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing report template
   * @param {String} id - Report template ID
   * @param {ReportTemplateModel} reportTemplate - Updated report template data
   * @returns {Promise<ReportTemplateModel>} Updated report template
   */
  async updateReportTemplate(id, reportTemplate) {
    try {
      const response = await fetch(`/api/metrics/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportTemplate),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update report template with ID ${id}`);
      }
      
      const data = await response.json();
      return new ReportTemplateModel(data);
    } catch (error) {
      console.error(`Error updating report template ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a report template
   * @param {String} id - Report template ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteReportTemplate(id) {
    try {
      const response = await fetch(`/api/metrics/reports/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete report template with ID ${id}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting report template ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Execute a report
   * @param {String} reportTemplateId - Report template ID
   * @param {Object} parameters - Report parameters
   * @returns {Promise<ReportExecutionModel>} Report execution
   */
  async executeReport(reportTemplateId, parameters = {}) {
    try {
      const response = await fetch(`/api/metrics/reports/${reportTemplateId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to execute report template ${reportTemplateId}`);
      }
      
      const data = await response.json();
      return new ReportExecutionModel(data);
    } catch (error) {
      console.error(`Error executing report template ${reportTemplateId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get report executions
   * @param {String} reportTemplateId - Report template ID
   * @returns {Promise<Array>} List of report executions
   */
  async getReportExecutions(reportTemplateId) {
    try {
      const response = await fetch(`/api/metrics/reports/${reportTemplateId}/executions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch executions for report template ${reportTemplateId}`);
      }
      
      const data = await response.json();
      return data.map(item => new ReportExecutionModel(item));
    } catch (error) {
      console.error(`Error fetching executions for report template ${reportTemplateId}:`, error);
      throw error;
    }
  }
}

/**
 * Service for managing continuous improvement items
 */
export class ContinuousImprovementService {
  /**
   * Get all continuous improvement items
   * @param {Object} filters - Optional filters
   * @param {String} filters.status - Filter by status
   * @param {String} filters.priority - Filter by priority
   * @param {String} filters.assignedTo - Filter by assigned user
   * @returns {Promise<Array>} List of continuous improvement items
   */
  async getContinuousImprovementItems(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
      
      const response = await fetch(`/api/metrics/improvements?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch continuous improvement items');
      }
      
      const data = await response.json();
      return data.map(item => new ContinuousImprovementModel(item));
    } catch (error) {
      console.error('Error fetching continuous improvement items:', error);
      throw error;
    }
  }
  
  /**
   * Get a single continuous improvement item by ID
   * @param {String} id - Continuous improvement item ID
   * @returns {Promise<ContinuousImprovementModel>} Continuous improvement item
   */
  async getContinuousImprovementItem(id) {
    try {
      const response = await fetch(`/api/metrics/improvements/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch continuous improvement item with ID ${id}`);
      }
      
      const data = await response.json();
      return new ContinuousImprovementModel(data);
    } catch (error) {
      console.error(`Error fetching continuous improvement item ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new continuous improvement item
   * @param {ContinuousImprovementModel} improvementItem - Continuous improvement item data
   * @returns {Promise<ContinuousImprovementModel>} Created continuous improvement item
   */
  async createContinuousImprovementItem(improvementItem) {
    try {
      const response = await fetch('/api/metrics/improvements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(improvementItem),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create continuous improvement item');
      }
      
      const data = await response.json();
      return new ContinuousImprovementModel(data);
    } catch (error) {
      console.error('Error creating continuous improvement item:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing continuous improvement item
   * @param {String} id - Continuous improvement item ID
   * @param {ContinuousImprovementModel} improvementItem - Updated continuous improvement item data
   * @returns {Promise<ContinuousImprovementModel>} Updated continuous improvement item
   */
  async updateContinuousImprovementItem(id, improvementItem) {
    try {
      const response = await fetch(`/api/metrics/improvements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(improvementItem),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update continuous improvement item with ID ${id}`);
      }
      
      const data = await response.json();
      return new ContinuousImprovementModel(data);
    } catch (error) {
      console.error(`Error updating continuous improvement item ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a continuous improvement item
   * @param {String} id - Continuous improvement item ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteContinuousImprovementItem(id) {
    try {
      const response = await fetch(`/api/metrics/improvements/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete continuous improvement item with ID ${id}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting continuous improvement item ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get action items for a continuous improvement item
   * @param {String} improvementId - Continuous improvement item ID
   * @returns {Promise<Array>} List of action items
   */
  async getActionItems(improvementId) {
    try {
      const response = await fetch(`/api/metrics/improvements/${improvementId}/actions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch action items for improvement ${improvementId}`);
      }
      
      const data = await response.json();
      return data.map(item => new ActionItemModel(item));
    } catch (error) {
      console.error(`Error fetching action items for improvement ${improvementId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add an action item to a continuous improvement item
   * @param {String} improvementId - Continuous improvement item ID
   * @param {ActionItemModel} actionItem - Action item data
   * @returns {Promise<ActionItemModel>} Created action item
   */
  async addActionItem(improvementId, actionItem) {
    try {
      const response = await fetch(`/api/metrics/improvements/${improvementId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionItem),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add action item to improvement ${improvementId}`);
      }
      
      const data = await response.json();
      return new ActionItemModel(data);
    } catch (error) {
      console.error(`Error adding action item to improvement ${improvementId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update an action item
   * @param {String} improvementId - Continuous improvement item ID
   * @param {String} actionItemId - Action item ID
   * @param {ActionItemModel} actionItem - Updated action item data
   * @returns {Promise<ActionItemModel>} Updated action item
   */
  async updateActionItem(improvementId, actionItemId, actionItem) {
    try {
      const response = await fetch(`/api/metrics/improvements/${improvementId}/actions/${actionItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionItem),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update action item ${actionItemId} for improvement ${improvementId}`);
      }
      
      const data = await response.json();
      return new ActionItemModel(data);
    } catch (error) {
      console.error(`Error updating action item ${actionItemId} for improvement ${improvementId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete an action item
   * @param {String} improvementId - Continuous improvement item ID
   * @param {String} actionItemId - Action item ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteActionItem(improvementId, actionItemId) {
    try {
      const response = await fetch(`/api/metrics/improvements/${improvementId}/actions/${actionItemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete action item ${actionItemId} from improvement ${improvementId}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting action item ${actionItemId} from improvement ${improvementId}:`, error);
      throw error;
    }
  }
}
