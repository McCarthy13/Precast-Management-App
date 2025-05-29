/**
 * Field Module Model
 * Represents a field operation in the Field Module
 * 
 * This model handles all field operation-related data including:
 * - Site information
 * - Installation details
 * - Inspection records
 * - Issue tracking
 */

class FieldOperationModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.operationNumber = data.operationNumber || '';
    this.projectId = data.projectId || null;
    this.clientId = data.clientId || null;
    this.siteAddress = data.siteAddress || '';
    this.status = data.status || 'scheduled';
    this.priority = data.priority || 'medium';
    this.scheduledStartDate = data.scheduledStartDate || null;
    this.scheduledEndDate = data.scheduledEndDate || null;
    this.actualStartDate = data.actualStartDate || null;
    this.actualEndDate = data.actualEndDate || null;
    this.type = data.type || 'installation';
    this.description = data.description || '';
    this.contactName = data.contactName || '';
    this.contactPhone = data.contactPhone || '';
    this.crew = data.crew || [];
    this.equipment = data.equipment || [];
    this.materials = data.materials || [];
    this.tasks = data.tasks || [];
    this.inspections = data.inspections || [];
    this.issues = data.issues || [];
    this.weatherConditions = data.weatherConditions || [];
    this.safetyChecklist = data.safetyChecklist || [];
    this.photos = data.photos || [];
    this.notes = data.notes || '';
    this.signatureRequired = data.signatureRequired !== undefined ? data.signatureRequired : true;
    this.signedBy = data.signedBy || null;
    this.signatureDate = data.signatureDate || null;
    this.createdBy = data.createdBy || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.customFields = data.customFields || {};
  }

  calculateProgress() {
    if (!this.tasks || this.tasks.length === 0) return 0;
    
    const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
    return (completedTasks / this.tasks.length) * 100;
  }

  calculateDuration() {
    if (!this.scheduledStartDate || !this.scheduledEndDate) return 0;
    
    const start = new Date(this.scheduledStartDate);
    const end = new Date(this.scheduledEndDate);
    
    // Calculate difference in days
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  isOverdue() {
    if (!this.scheduledEndDate) return false;
    
    const today = new Date();
    return today > new Date(this.scheduledEndDate) && this.status !== 'completed' && this.status !== 'cancelled';
  }

  isCompleted() {
    return this.status === 'completed';
  }

  addTask(task) {
    this.tasks.push({
      ...task,
      id: task.id || Date.now().toString(),
      status: task.status || 'pending',
      createdAt: task.createdAt || new Date(),
    });
    return this;
  }

  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex >= 0) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    }
    return this;
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    return this;
  }

  addInspection(inspection) {
    this.inspections.push({
      ...inspection,
      id: inspection.id || Date.now().toString(),
      date: inspection.date || new Date(),
      status: inspection.status || 'pending',
    });
    return this;
  }

  updateInspection(inspectionId, updates) {
    const inspectionIndex = this.inspections.findIndex(inspection => inspection.id === inspectionId);
    if (inspectionIndex >= 0) {
      this.inspections[inspectionIndex] = { ...this.inspections[inspectionIndex], ...updates };
    }
    return this;
  }

  removeInspection(inspectionId) {
    this.inspections = this.inspections.filter(inspection => inspection.id !== inspectionId);
    return this;
  }

  addIssue(issue) {
    this.issues.push({
      ...issue,
      id: issue.id || Date.now().toString(),
      reportedDate: issue.reportedDate || new Date(),
      status: issue.status || 'open',
    });
    return this;
  }

  updateIssue(issueId, updates) {
    const issueIndex = this.issues.findIndex(issue => issue.id === issueId);
    if (issueIndex >= 0) {
      this.issues[issueIndex] = { ...this.issues[issueIndex], ...updates };
    }
    return this;
  }

  resolveIssue(issueId, resolution) {
    const issueIndex = this.issues.findIndex(issue => issue.id === issueId);
    if (issueIndex >= 0) {
      this.issues[issueIndex] = { 
        ...this.issues[issueIndex], 
        status: 'resolved',
        resolution,
        resolvedDate: new Date(),
      };
    }
    return this;
  }

  removeIssue(issueId) {
    this.issues = this.issues.filter(issue => issue.id !== issueId);
    return this;
  }

  addPhoto(photo) {
    this.photos.push({
      ...photo,
      id: photo.id || Date.now().toString(),
      uploadDate: photo.uploadDate || new Date(),
    });
    return this;
  }

  removePhoto(photoId) {
    this.photos = this.photos.filter(photo => photo.id !== photoId);
    return this;
  }

  addWeatherCondition(weather) {
    this.weatherConditions.push({
      ...weather,
      id: weather.id || Date.now().toString(),
      date: weather.date || new Date(),
    });
    return this;
  }

  markAsCompleted(signedBy = null) {
    this.status = 'completed';
    this.actualEndDate = new Date();
    this.signedBy = signedBy;
    this.signatureDate = new Date();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      operationNumber: this.operationNumber,
      projectId: this.projectId,
      clientId: this.clientId,
      siteAddress: this.siteAddress,
      status: this.status,
      priority: this.priority,
      scheduledStartDate: this.scheduledStartDate,
      scheduledEndDate: this.scheduledEndDate,
      actualStartDate: this.actualStartDate,
      actualEndDate: this.actualEndDate,
      type: this.type,
      description: this.description,
      contactName: this.contactName,
      contactPhone: this.contactPhone,
      crew: this.crew,
      equipment: this.equipment,
      materials: this.materials,
      tasks: this.tasks,
      inspections: this.inspections,
      issues: this.issues,
      weatherConditions: this.weatherConditions,
      safetyChecklist: this.safetyChecklist,
      photos: this.photos,
      notes: this.notes,
      signatureRequired: this.signatureRequired,
      signedBy: this.signedBy,
      signatureDate: this.signatureDate,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      customFields: this.customFields
    };
  }

  static fromJSON(json) {
    return new FieldOperationModel(json);
  }

  static getValidStatuses() {
    return ['scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled'];
  }

  static getValidPriorities() {
    return ['low', 'medium', 'high', 'urgent'];
  }

  static getValidTypes() {
    return ['installation', 'repair', 'maintenance', 'inspection', 'other'];
  }
}

export default FieldOperationModel;
