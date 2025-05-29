/**
 * Metrics Tracking & Analytics Module Models
 * Defines data structures for the Metrics Tracking & Analytics module
 */

// Metric Definition Model
export class MetricDefinitionModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || ''; // Safety, Production, Quality, Financial, etc.
    this.unit = data.unit || '';
    this.formula = data.formula || '';
    this.dataSource = data.dataSource || ''; // Module or table where data is sourced
    this.frequency = data.frequency || 'Daily'; // Daily, Weekly, Monthly, Quarterly, Annual
    this.target = data.target || null;
    this.upperThreshold = data.upperThreshold || null; // For alerts/warnings
    this.lowerThreshold = data.lowerThreshold || null; // For alerts/warnings
    this.isActive = data.isActive || true;
    this.visibleTo = data.visibleTo || []; // Roles that can view this metric
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Metric Data Point Model
export class MetricDataPointModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.metricId = data.metricId || '';
    this.value = data.value || 0;
    this.date = data.date || new Date();
    this.notes = data.notes || '';
    this.source = data.source || 'Manual'; // Manual, Automated
    this.enteredBy = data.enteredBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Dashboard Model
export class DashboardModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.isDefault = data.isDefault || false;
    this.layout = data.layout || [];
    this.metrics = data.metrics || []; // List of metric IDs to display
    this.visibleTo = data.visibleTo || []; // Roles that can view this dashboard
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Dashboard Widget Model
export class DashboardWidgetModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.dashboardId = data.dashboardId || '';
    this.metricId = data.metricId || '';
    this.type = data.type || 'LineChart'; // LineChart, BarChart, PieChart, Gauge, KPI, Table
    this.title = data.title || '';
    this.position = data.position || { x: 0, y: 0 };
    this.size = data.size || { width: 1, height: 1 };
    this.config = data.config || {}; // Widget-specific configuration
    this.timeRange = data.timeRange || 'Last30Days'; // Today, Last7Days, Last30Days, LastQuarter, LastYear, Custom
    this.customTimeRange = data.customTimeRange || { start: null, end: null };
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Report Template Model
export class ReportTemplateModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.metrics = data.metrics || []; // List of metric IDs to include
    this.format = data.format || 'PDF'; // PDF, Excel, CSV
    this.layout = data.layout || {};
    this.filters = data.filters || {};
    this.isScheduled = data.isScheduled || false;
    this.schedule = data.schedule || null; // Cron expression or schedule object
    this.recipients = data.recipients || []; // List of email addresses
    this.visibleTo = data.visibleTo || []; // Roles that can view/run this report
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Report Execution Model
export class ReportExecutionModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.reportTemplateId = data.reportTemplateId || '';
    this.executionDate = data.executionDate || new Date();
    this.parameters = data.parameters || {};
    this.status = data.status || 'Pending'; // Pending, Running, Completed, Failed
    this.fileUrl = data.fileUrl || '';
    this.errorMessage = data.errorMessage || '';
    this.executedBy = data.executedBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Continuous Improvement Item Model
export class ContinuousImprovementModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.metricId = data.metricId || '';
    this.relatedMetrics = data.relatedMetrics || [];
    this.category = data.category || '';
    this.priority = data.priority || 'Medium'; // Low, Medium, High, Critical
    this.status = data.status || 'Open'; // Open, In Progress, Completed, Cancelled
    this.rootCause = data.rootCause || '';
    this.actionItems = data.actionItems || [];
    this.assignedTo = data.assignedTo || '';
    this.dueDate = data.dueDate || null;
    this.completionDate = data.completionDate || null;
    this.attachments = data.attachments || [];
    this.notes = data.notes || '';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Action Item Model
export class ActionItemModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.improvementId = data.improvementId || '';
    this.description = data.description || '';
    this.assignedTo = data.assignedTo || '';
    this.status = data.status || 'Pending'; // Pending, In Progress, Completed, Cancelled
    this.dueDate = data.dueDate || null;
    this.completionDate = data.completionDate || null;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

// Predefined Metrics Library
export const PredefinedMetrics = [
  {
    name: 'On-Time Delivery Rate',
    description: 'Percentage of deliveries made on or before the scheduled delivery date',
    category: 'Delivery',
    unit: '%',
    formula: '(On-Time Deliveries / Total Deliveries) * 100',
    dataSource: 'Dispatch',
    frequency: 'Weekly'
  },
  {
    name: 'First-Time Quality Yield',
    description: 'Percentage of products that pass quality inspection on the first attempt',
    category: 'Quality',
    unit: '%',
    formula: '(Products Passed First Inspection / Total Products Inspected) * 100',
    dataSource: 'Quality Control',
    frequency: 'Daily'
  },
  {
    name: 'Safety Incident Rate',
    description: 'Number of safety incidents per 100 full-time employees per year',
    category: 'Safety',
    unit: 'Rate',
    formula: '(Number of Incidents * 200,000) / Total Hours Worked',
    dataSource: 'Safety',
    frequency: 'Monthly'
  },
  {
    name: 'Raw Material Inspection Approval Rate',
    description: 'Percentage of raw materials that pass inspection upon receipt',
    category: 'Quality',
    unit: '%',
    formula: '(Approved Raw Materials / Total Raw Materials Inspected) * 100',
    dataSource: 'Quality Control',
    frequency: 'Weekly'
  },
  {
    name: 'Production Efficiency',
    description: 'Actual production output compared to planned production output',
    category: 'Production',
    unit: '%',
    formula: '(Actual Production / Planned Production) * 100',
    dataSource: 'Production Scheduling',
    frequency: 'Daily'
  },
  {
    name: 'Cost Per Unit',
    description: 'Average cost to produce one unit of product',
    category: 'Financial',
    unit: '$',
    formula: 'Total Production Cost / Units Produced',
    dataSource: 'Production',
    frequency: 'Monthly'
  },
  {
    name: 'Project Margin',
    description: 'Average profit margin across all projects',
    category: 'Financial',
    unit: '%',
    formula: '((Revenue - Cost) / Revenue) * 100',
    dataSource: 'Project Management',
    frequency: 'Monthly'
  },
  {
    name: 'Employee Training Compliance',
    description: 'Percentage of employees with up-to-date required training',
    category: 'Safety',
    unit: '%',
    formula: '(Employees with Current Training / Total Employees) * 100',
    dataSource: 'Safety',
    frequency: 'Monthly'
  },
  {
    name: 'Equipment Downtime',
    description: 'Percentage of scheduled production time that equipment is non-operational',
    category: 'Production',
    unit: '%',
    formula: '(Downtime Hours / Scheduled Production Hours) * 100',
    dataSource: 'Production',
    frequency: 'Weekly'
  },
  {
    name: 'Inventory Turnover',
    description: 'Number of times inventory is sold or used in a time period',
    category: 'Yard Management',
    unit: 'Ratio',
    formula: 'Cost of Goods Sold / Average Inventory Value',
    dataSource: 'Yard Management',
    frequency: 'Monthly'
  }
];
