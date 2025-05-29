/**
 * Research & Development (R&D) Services
 * Provides API and data handling for the R&D module
 */

import { 
  RDProjectModel,
  ExperimentModel,
  ResearchDocumentModel,
  ResearchTaskModel,
  ResearchOutcomeModel,
  MeetingModel
} from '../models/ResearchModel';

/**
 * Service for managing research and development operations
 */
export class ResearchService {
  /**
   * Get all R&D projects
   * @param {Object} filters - Optional filters
   * @param {String} filters.status - Filter by project status
   * @param {String} filters.priority - Filter by project priority
   * @param {String} filters.leadResearcher - Filter by lead researcher
   * @returns {Promise<Array>} List of R&D projects
   */
  async getProjects(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.leadResearcher) queryParams.append('leadResearcher', filters.leadResearcher);
      
      const response = await fetch(`/api/research/projects?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch R&D projects');
      }
      
      const data = await response.json();
      return data.map(item => new RDProjectModel(item));
    } catch (error) {
      console.error('Error fetching R&D projects:', error);
      throw error;
    }
  }
  
  /**
   * Get a single R&D project by ID
   * @param {String} id - Project ID
   * @returns {Promise<RDProjectModel>} R&D project
   */
  async getProject(id) {
    try {
      const response = await fetch(`/api/research/projects/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch R&D project with ID ${id}`);
      }
      
      const data = await response.json();
      return new RDProjectModel(data);
    } catch (error) {
      console.error(`Error fetching R&D project ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new R&D project
   * @param {RDProjectModel} project - Project data
   * @returns {Promise<RDProjectModel>} Created project
   */
  async createProject(project) {
    try {
      const response = await fetch('/api/research/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create R&D project');
      }
      
      const data = await response.json();
      return new RDProjectModel(data);
    } catch (error) {
      console.error('Error creating R&D project:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing R&D project
   * @param {String} id - Project ID
   * @param {RDProjectModel} project - Updated project data
   * @returns {Promise<RDProjectModel>} Updated project
   */
  async updateProject(id, project) {
    try {
      const response = await fetch(`/api/research/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update R&D project with ID ${id}`);
      }
      
      const data = await response.json();
      return new RDProjectModel(data);
    } catch (error) {
      console.error(`Error updating R&D project ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete an R&D project
   * @param {String} id - Project ID
   * @returns {Promise<Object>} Result
   */
  async deleteProject(id) {
    try {
      const response = await fetch(`/api/research/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete R&D project with ID ${id}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting R&D project ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all experiments for a project
   * @param {String} projectId - Project ID
   * @param {Object} filters - Optional filters
   * @param {String} filters.status - Filter by experiment status
   * @returns {Promise<Array>} List of experiments
   */
  async getExperiments(projectId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      
      const response = await fetch(`/api/research/projects/${projectId}/experiments?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch experiments for project ${projectId}`);
      }
      
      const data = await response.json();
      return data.map(item => new ExperimentModel(item));
    } catch (error) {
      console.error(`Error fetching experiments for project ${projectId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a single experiment by ID
   * @param {String} id - Experiment ID
   * @returns {Promise<ExperimentModel>} Experiment
   */
  async getExperiment(id) {
    try {
      const response = await fetch(`/api/research/experiments/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch experiment with ID ${id}`);
      }
      
      const data = await response.json();
      return new ExperimentModel(data);
    } catch (error) {
      console.error(`Error fetching experiment ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new experiment
   * @param {ExperimentModel} experiment - Experiment data
   * @returns {Promise<ExperimentModel>} Created experiment
   */
  async createExperiment(experiment) {
    try {
      const response = await fetch('/api/research/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experiment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create experiment');
      }
      
      const data = await response.json();
      return new ExperimentModel(data);
    } catch (error) {
      console.error('Error creating experiment:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing experiment
   * @param {String} id - Experiment ID
   * @param {ExperimentModel} experiment - Updated experiment data
   * @returns {Promise<ExperimentModel>} Updated experiment
   */
  async updateExperiment(id, experiment) {
    try {
      const response = await fetch(`/api/research/experiments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experiment),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update experiment with ID ${id}`);
      }
      
      const data = await response.json();
      return new ExperimentModel(data);
    } catch (error) {
      console.error(`Error updating experiment ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Upload a research document
   * @param {ResearchDocumentModel} document - Document metadata
   * @param {File} file - Document file
   * @returns {Promise<ResearchDocumentModel>} Uploaded document
   */
  async uploadDocument(document, file) {
    try {
      const formData = new FormData();
      formData.append('metadata', JSON.stringify(document));
      formData.append('file', file);
      
      const response = await fetch('/api/research/documents', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload research document');
      }
      
      const data = await response.json();
      return new ResearchDocumentModel(data);
    } catch (error) {
      console.error('Error uploading research document:', error);
      throw error;
    }
  }
  
  /**
   * Get documents for a project or experiment
   * @param {Object} params - Query parameters
   * @param {String} params.projectId - Project ID
   * @param {String} params.experimentId - Experiment ID
   * @param {String} params.type - Document type
   * @returns {Promise<Array>} List of documents
   */
  async getDocuments(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.projectId) queryParams.append('projectId', params.projectId);
      if (params.experimentId) queryParams.append('experimentId', params.experimentId);
      if (params.type) queryParams.append('type', params.type);
      
      const response = await fetch(`/api/research/documents?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch research documents');
      }
      
      const data = await response.json();
      return data.map(item => new ResearchDocumentModel(item));
    } catch (error) {
      console.error('Error fetching research documents:', error);
      throw error;
    }
  }
  
  /**
   * Create a research task
   * @param {ResearchTaskModel} task - Task data
   * @returns {Promise<ResearchTaskModel>} Created task
   */
  async createTask(task) {
    try {
      const response = await fetch('/api/research/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create research task');
      }
      
      const data = await response.json();
      return new ResearchTaskModel(data);
    } catch (error) {
      console.error('Error creating research task:', error);
      throw error;
    }
  }
  
  /**
   * Get tasks for a project or experiment
   * @param {Object} params - Query parameters
   * @param {String} params.projectId - Project ID
   * @param {String} params.experimentId - Experiment ID
   * @param {String} params.status - Task status
   * @param {String} params.assignedTo - User ID assigned to task
   * @returns {Promise<Array>} List of tasks
   */
  async getTasks(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.projectId) queryParams.append('projectId', params.projectId);
      if (params.experimentId) queryParams.append('experimentId', params.experimentId);
      if (params.status) queryParams.append('status', params.status);
      if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
      
      const response = await fetch(`/api/research/tasks?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch research tasks');
      }
      
      const data = await response.json();
      return data.map(item => new ResearchTaskModel(item));
    } catch (error) {
      console.error('Error fetching research tasks:', error);
      throw error;
    }
  }
  
  /**
   * Create a research outcome
   * @param {ResearchOutcomeModel} outcome - Outcome data
   * @returns {Promise<ResearchOutcomeModel>} Created outcome
   */
  async createOutcome(outcome) {
    try {
      const response = await fetch('/api/research/outcomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outcome),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create research outcome');
      }
      
      const data = await response.json();
      return new ResearchOutcomeModel(data);
    } catch (error) {
      console.error('Error creating research outcome:', error);
      throw error;
    }
  }
  
  /**
   * Get outcomes for a project
   * @param {String} projectId - Project ID
   * @param {Object} filters - Optional filters
   * @param {String} filters.implementationStatus - Filter by implementation status
   * @returns {Promise<Array>} List of outcomes
   */
  async getOutcomes(projectId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.implementationStatus) queryParams.append('implementationStatus', filters.implementationStatus);
      
      const response = await fetch(`/api/research/projects/${projectId}/outcomes?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch outcomes for project ${projectId}`);
      }
      
      const data = await response.json();
      return data.map(item => new ResearchOutcomeModel(item));
    } catch (error) {
      console.error(`Error fetching outcomes for project ${projectId}:`, error);
      throw error;
    }
  }
  
  /**
   * Schedule a meeting
   * @param {MeetingModel} meeting - Meeting data
   * @returns {Promise<MeetingModel>} Scheduled meeting
   */
  async scheduleMeeting(meeting) {
    try {
      const response = await fetch('/api/research/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meeting),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule meeting');
      }
      
      const data = await response.json();
      return new MeetingModel(data);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  }
  
  /**
   * Get meetings for a project
   * @param {String} projectId - Project ID
   * @param {Object} filters - Optional filters
   * @param {String} filters.status - Filter by meeting status
   * @param {String} filters.type - Filter by meeting type
   * @returns {Promise<Array>} List of meetings
   */
  async getMeetings(projectId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      
      const response = await fetch(`/api/research/projects/${projectId}/meetings?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch meetings for project ${projectId}`);
      }
      
      const data = await response.json();
      return data.map(item => new MeetingModel(item));
    } catch (error) {
      console.error(`Error fetching meetings for project ${projectId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const researchService = new ResearchService();
