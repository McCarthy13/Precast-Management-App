/**
 * ProjectService
 * Service for managing projects in the Project Management module
 * 
 * This service provides methods for:
 * - CRUD operations on projects
 * - Task management
 * - Resource allocation
 * - Timeline tracking
 * - Budget management
 */

import ProjectModel from '../models/ProjectModel';

class ProjectService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/api/projects';
  }

  /**
   * Get all projects with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array<ProjectModel>>}
   */
  async getProjects(filters = {}) {
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
        throw new Error(response.error || 'Failed to fetch projects');
      }

      return response.data.map(project => ProjectModel.fromJSON(project));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Get a project by ID
   * @param {string} id - Project ID
   * @returns {Promise<ProjectModel>}
   */
  async getProjectById(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch project');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new project
   * @param {ProjectModel} project - Project data
   * @returns {Promise<ProjectModel>}
   */
  async createProject(project) {
    try {
      const response = await this.apiClient.post(this.endpoint, project.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create project');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Update an existing project
   * @param {string} id - Project ID
   * @param {ProjectModel} project - Updated project data
   * @returns {Promise<ProjectModel>}
   */
  async updateProject(id, project) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${id}`, project.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update project');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a project
   * @param {string} id - Project ID
   * @returns {Promise<boolean>}
   */
  async deleteProject(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete project');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add a task to a project
   * @param {string} projectId - Project ID
   * @param {Object} task - Task data
   * @returns {Promise<ProjectModel>}
   */
  async addTask(projectId, task) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${projectId}/tasks`, task);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add task');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding task to project with ID ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Update a task in a project
   * @param {string} projectId - Project ID
   * @param {string} taskId - Task ID
   * @param {Object} updates - Task updates
   * @returns {Promise<ProjectModel>}
   */
  async updateTask(projectId, taskId, updates) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${projectId}/tasks/${taskId}`, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update task');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating task ${taskId} in project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a task from a project
   * @param {string} projectId - Project ID
   * @param {string} taskId - Task ID
   * @returns {Promise<ProjectModel>}
   */
  async deleteTask(projectId, taskId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${projectId}/tasks/${taskId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete task');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error deleting task ${taskId} from project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Add a team member to a project
   * @param {string} projectId - Project ID
   * @param {string} userId - User ID
   * @returns {Promise<ProjectModel>}
   */
  async addTeamMember(projectId, userId) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${projectId}/team`, { userId });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add team member');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error adding team member to project with ID ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a team member from a project
   * @param {string} projectId - Project ID
   * @param {string} userId - User ID
   * @returns {Promise<ProjectModel>}
   */
  async removeTeamMember(projectId, userId) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${projectId}/team/${userId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to remove team member');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error removing team member from project with ID ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Update project progress
   * @param {string} projectId - Project ID
   * @param {number} progress - Progress percentage
   * @returns {Promise<ProjectModel>}
   */
  async updateProgress(projectId, progress) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${projectId}/progress`, { progress });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update project progress');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating progress for project with ID ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Update project budget
   * @param {string} projectId - Project ID
   * @param {Object} budgetData - Budget data
   * @returns {Promise<ProjectModel>}
   */
  async updateBudget(projectId, budgetData) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${projectId}/budget`, budgetData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update project budget');
      }

      return ProjectModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating budget for project with ID ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Get project analytics
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>}
   */
  async getProjectAnalytics(projectId) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${projectId}/analytics`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch project analytics');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching analytics for project with ID ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Generate project report
   * @param {string} projectId - Project ID
   * @param {string} reportType - Report type
   * @returns {Promise<Blob>}
   */
  async generateReport(projectId, reportType = 'summary') {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${projectId}/reports/${reportType}`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      console.error(`Error generating ${reportType} report for project with ID ${projectId}:`, error);
      throw error;
    }
  }
}

export default ProjectService;
