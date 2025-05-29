/**
 * Project Model
 * Represents a project in the Project Management module
 * 
 * This model handles all project-related data including:
 * - Project details
 * - Timeline
 * - Tasks
 * - Resources
 * - Budget
 */

class ProjectModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.clientId = data.clientId || '';
    this.estimateId = data.estimateId || null;
    this.status = data.status || 'planning';
    this.priority = data.priority || 'medium';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.budget = data.budget || 0;
    this.actualCost = data.actualCost || 0;
    this.progress = data.progress || 0;
    this.managerId = data.managerId || null;
    this.teamMembers = data.teamMembers || [];
    this.tasks = data.tasks || [];
    this.notes = data.notes || '';
    this.attachments = data.attachments || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.customFields = data.customFields || {};
  }

  calculateProgress() {
    if (!this.tasks.length) return 0;
    
    const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / this.tasks.length) * 100);
  }

  updateProgress() {
    this.progress = this.calculateProgress();
    return this.progress;
  }

  calculateBudgetVariance() {
    return this.budget - this.actualCost;
  }

  calculateTimelineVariance() {
    if (!this.startDate || !this.endDate) return null;
    
    const plannedDuration = new Date(this.endDate) - new Date(this.startDate);
    const today = new Date();
    const elapsed = today - new Date(this.startDate);
    
    return Math.round((elapsed / plannedDuration) * 100);
  }

  isOverBudget() {
    return this.actualCost > this.budget;
  }

  isDelayed() {
    if (!this.endDate) return false;
    
    const today = new Date();
    return today > new Date(this.endDate) && this.status !== 'completed';
  }

  addTask(task) {
    this.tasks.push(task);
    this.updateProgress();
    return this;
  }

  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex >= 0) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
      this.updateProgress();
    }
    return this;
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.updateProgress();
    return this;
  }

  addTeamMember(memberId) {
    if (!this.teamMembers.includes(memberId)) {
      this.teamMembers.push(memberId);
    }
    return this;
  }

  removeTeamMember(memberId) {
    this.teamMembers = this.teamMembers.filter(id => id !== memberId);
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      clientId: this.clientId,
      estimateId: this.estimateId,
      status: this.status,
      priority: this.priority,
      startDate: this.startDate,
      endDate: this.endDate,
      budget: this.budget,
      actualCost: this.actualCost,
      progress: this.progress,
      managerId: this.managerId,
      teamMembers: this.teamMembers,
      tasks: this.tasks,
      notes: this.notes,
      attachments: this.attachments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      customFields: this.customFields
    };
  }

  static fromJSON(json) {
    return new ProjectModel(json);
  }

  static getValidStatuses() {
    return ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'];
  }

  static getValidPriorities() {
    return ['low', 'medium', 'high', 'urgent'];
  }
}

export default ProjectModel;
