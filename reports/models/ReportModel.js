/**
 * Report Model
 * Represents a custom report in the Custom Reports module
 * 
 * This model handles all report-related data including:
 * - Report configuration
 * - Data sources
 * - Filters and parameters
 * - Output formats
 */

class ReportModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.category = data.category || 'general';
    this.dataSources = data.dataSources || [];
    this.fields = data.fields || [];
    this.filters = data.filters || [];
    this.sortBy = data.sortBy || [];
    this.groupBy = data.groupBy || [];
    this.aggregations = data.aggregations || [];
    this.visualizations = data.visualizations || [];
    this.outputFormats = data.outputFormats || ['pdf', 'csv'];
    this.schedule = data.schedule || null;
    this.recipients = data.recipients || [];
    this.isPublic = data.isPublic !== undefined ? data.isPublic : false;
    this.createdBy = data.createdBy || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastRunAt = data.lastRunAt || null;
    this.customStyles = data.customStyles || {};
    this.customScripts = data.customScripts || '';
    this.parameters = data.parameters || [];
  }

  addDataSource(dataSource) {
    this.dataSources.push({
      ...dataSource,
      id: dataSource.id || Date.now().toString(),
    });
    return this;
  }

  removeDataSource(dataSourceId) {
    this.dataSources = this.dataSources.filter(ds => ds.id !== dataSourceId);
    return this;
  }

  addField(field) {
    this.fields.push({
      ...field,
      id: field.id || Date.now().toString(),
    });
    return this;
  }

  removeField(fieldId) {
    this.fields = this.fields.filter(f => f.id !== fieldId);
    return this;
  }

  addFilter(filter) {
    this.filters.push({
      ...filter,
      id: filter.id || Date.now().toString(),
    });
    return this;
  }

  removeFilter(filterId) {
    this.filters = this.filters.filter(f => f.id !== filterId);
    return this;
  }

  addSortBy(sortBy) {
    this.sortBy.push({
      ...sortBy,
      id: sortBy.id || Date.now().toString(),
    });
    return this;
  }

  removeSortBy(sortById) {
    this.sortBy = this.sortBy.filter(s => s.id !== sortById);
    return this;
  }

  addGroupBy(groupBy) {
    this.groupBy.push({
      ...groupBy,
      id: groupBy.id || Date.now().toString(),
    });
    return this;
  }

  removeGroupBy(groupById) {
    this.groupBy = this.groupBy.filter(g => g.id !== groupById);
    return this;
  }

  addAggregation(aggregation) {
    this.aggregations.push({
      ...aggregation,
      id: aggregation.id || Date.now().toString(),
    });
    return this;
  }

  removeAggregation(aggregationId) {
    this.aggregations = this.aggregations.filter(a => a.id !== aggregationId);
    return this;
  }

  addVisualization(visualization) {
    this.visualizations.push({
      ...visualization,
      id: visualization.id || Date.now().toString(),
    });
    return this;
  }

  removeVisualization(visualizationId) {
    this.visualizations = this.visualizations.filter(v => v.id !== visualizationId);
    return this;
  }

  addOutputFormat(format) {
    if (!this.outputFormats.includes(format)) {
      this.outputFormats.push(format);
    }
    return this;
  }

  removeOutputFormat(format) {
    this.outputFormats = this.outputFormats.filter(f => f !== format);
    return this;
  }

  setSchedule(schedule) {
    this.schedule = schedule;
    return this;
  }

  addRecipient(recipient) {
    this.recipients.push({
      ...recipient,
      id: recipient.id || Date.now().toString(),
    });
    return this;
  }

  removeRecipient(recipientId) {
    this.recipients = this.recipients.filter(r => r.id !== recipientId);
    return this;
  }

  addParameter(parameter) {
    this.parameters.push({
      ...parameter,
      id: parameter.id || Date.now().toString(),
    });
    return this;
  }

  removeParameter(parameterId) {
    this.parameters = this.parameters.filter(p => p.id !== parameterId);
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      dataSources: this.dataSources,
      fields: this.fields,
      filters: this.filters,
      sortBy: this.sortBy,
      groupBy: this.groupBy,
      aggregations: this.aggregations,
      visualizations: this.visualizations,
      outputFormats: this.outputFormats,
      schedule: this.schedule,
      recipients: this.recipients,
      isPublic: this.isPublic,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastRunAt: this.lastRunAt,
      customStyles: this.customStyles,
      customScripts: this.customScripts,
      parameters: this.parameters,
    };
  }

  static fromJSON(json) {
    return new ReportModel(json);
  }

  static getValidCategories() {
    return ['general', 'financial', 'production', 'quality', 'field', 'inventory', 'hr', 'custom'];
  }

  static getValidOutputFormats() {
    return ['pdf', 'csv', 'excel', 'html', 'json'];
  }

  static getValidVisualizationTypes() {
    return ['table', 'bar', 'line', 'pie', 'scatter', 'map', 'heatmap', 'gauge', 'custom'];
  }

  static getValidAggregationTypes() {
    return ['sum', 'avg', 'min', 'max', 'count', 'distinct_count', 'custom'];
  }
}

export default ReportModel;
