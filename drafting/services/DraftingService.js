/**
 * Drafting/Engineering Module Services
 * Provides API and data handling for the Drafting/Engineering module
 */

import { 
  DrawingModel, 
  DrawingRevisionModel,
  DrawingMarkupModel,
  DrawingCommentModel,
  DrawingReleaseModel,
  DrawingElementModel,
  DrawingWorkflowModel,
  WorkflowStepModel,
  ExternalToolIntegrationModel,
  DrawingTemplateModel
} from '../models/DraftingModel';

/**
 * Service for managing drawings and related entities
 */
export class DraftingService {
  /**
   * Get all drawings
   * @param {Object} filters - Optional filters
   * @param {String} filters.projectId - Filter by project ID
   * @param {String} filters.status - Filter by status
   * @param {String} filters.type - Filter by drawing type
   * @returns {Promise<Array>} List of drawings
   */
  async getDrawings(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.projectId) queryParams.append('projectId', filters.projectId);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      
      const response = await fetch(`/api/drafting/drawings?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch drawings');
      }
      
      const data = await response.json();
      return data.map(item => new DrawingModel(item));
    } catch (error) {
      console.error('Error fetching drawings:', error);
      throw error;
    }
  }
  
  /**
   * Get a single drawing by ID
   * @param {String} id - Drawing ID
   * @returns {Promise<DrawingModel>} Drawing
   */
  async getDrawing(id) {
    try {
      const response = await fetch(`/api/drafting/drawings/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch drawing with ID ${id}`);
      }
      
      const data = await response.json();
      return new DrawingModel(data);
    } catch (error) {
      console.error(`Error fetching drawing ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new drawing
   * @param {DrawingModel} drawing - Drawing data
   * @returns {Promise<DrawingModel>} Created drawing
   */
  async createDrawing(drawing) {
    try {
      const response = await fetch('/api/drafting/drawings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawing),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create drawing');
      }
      
      const data = await response.json();
      return new DrawingModel(data);
    } catch (error) {
      console.error('Error creating drawing:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing drawing
   * @param {String} id - Drawing ID
   * @param {DrawingModel} drawing - Updated drawing data
   * @returns {Promise<DrawingModel>} Updated drawing
   */
  async updateDrawing(id, drawing) {
    try {
      const response = await fetch(`/api/drafting/drawings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawing),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update drawing with ID ${id}`);
      }
      
      const data = await response.json();
      return new DrawingModel(data);
    } catch (error) {
      console.error(`Error updating drawing ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a drawing
   * @param {String} id - Drawing ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteDrawing(id) {
    try {
      const response = await fetch(`/api/drafting/drawings/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete drawing with ID ${id}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting drawing ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Upload a drawing file
   * @param {File} file - Drawing file
   * @param {Object} metadata - Drawing metadata
   * @returns {Promise<Object>} Upload result with file URL
   */
  async uploadDrawingFile(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await fetch('/api/drafting/drawings/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload drawing file');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading drawing file:', error);
      throw error;
    }
  }
  
  /**
   * Get drawing revisions
   * @param {String} drawingId - Drawing ID
   * @returns {Promise<Array>} List of drawing revisions
   */
  async getDrawingRevisions(drawingId) {
    try {
      const response = await fetch(`/api/drafting/drawings/${drawingId}/revisions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch revisions for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return data.map(item => new DrawingRevisionModel(item));
    } catch (error) {
      console.error(`Error fetching revisions for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new drawing revision
   * @param {String} drawingId - Drawing ID
   * @param {DrawingRevisionModel} revision - Revision data
   * @returns {Promise<DrawingRevisionModel>} Created revision
   */
  async createDrawingRevision(drawingId, revision) {
    try {
      const response = await fetch(`/api/drafting/drawings/${drawingId}/revisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(revision),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create revision for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return new DrawingRevisionModel(data);
    } catch (error) {
      console.error(`Error creating revision for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get drawing markups
   * @param {String} drawingId - Drawing ID
   * @param {String} revisionId - Revision ID (optional)
   * @returns {Promise<Array>} List of drawing markups
   */
  async getDrawingMarkups(drawingId, revisionId = null) {
    try {
      let url = `/api/drafting/drawings/${drawingId}/markups`;
      if (revisionId) {
        url += `?revisionId=${revisionId}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch markups for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return data.map(item => new DrawingMarkupModel(item));
    } catch (error) {
      console.error(`Error fetching markups for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new drawing markup
   * @param {String} drawingId - Drawing ID
   * @param {DrawingMarkupModel} markup - Markup data
   * @returns {Promise<DrawingMarkupModel>} Created markup
   */
  async createDrawingMarkup(drawingId, markup) {
    try {
      const response = await fetch(`/api/drafting/drawings/${drawingId}/markups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(markup),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create markup for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return new DrawingMarkupModel(data);
    } catch (error) {
      console.error(`Error creating markup for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get drawing comments
   * @param {String} drawingId - Drawing ID
   * @param {String} revisionId - Revision ID (optional)
   * @param {String} markupId - Markup ID (optional)
   * @returns {Promise<Array>} List of drawing comments
   */
  async getDrawingComments(drawingId, revisionId = null, markupId = null) {
    try {
      const queryParams = new URLSearchParams();
      if (revisionId) queryParams.append('revisionId', revisionId);
      if (markupId) queryParams.append('markupId', markupId);
      
      const response = await fetch(`/api/drafting/drawings/${drawingId}/comments?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return data.map(item => new DrawingCommentModel(item));
    } catch (error) {
      console.error(`Error fetching comments for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new drawing comment
   * @param {String} drawingId - Drawing ID
   * @param {DrawingCommentModel} comment - Comment data
   * @returns {Promise<DrawingCommentModel>} Created comment
   */
  async createDrawingComment(drawingId, comment) {
    try {
      const response = await fetch(`/api/drafting/drawings/${drawingId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create comment for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return new DrawingCommentModel(data);
    } catch (error) {
      console.error(`Error creating comment for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Release a drawing
   * @param {String} drawingId - Drawing ID
   * @param {DrawingReleaseModel} release - Release data
   * @returns {Promise<DrawingReleaseModel>} Created release
   */
  async releaseDrawing(drawingId, release) {
    try {
      const response = await fetch(`/api/drafting/drawings/${drawingId}/releases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(release),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to release drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return new DrawingReleaseModel(data);
    } catch (error) {
      console.error(`Error releasing drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get drawing releases
   * @param {String} drawingId - Drawing ID
   * @returns {Promise<Array>} List of drawing releases
   */
  async getDrawingReleases(drawingId) {
    try {
      const response = await fetch(`/api/drafting/drawings/${drawingId}/releases`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch releases for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return data.map(item => new DrawingReleaseModel(item));
    } catch (error) {
      console.error(`Error fetching releases for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a drawing workflow
   * @param {String} drawingId - Drawing ID
   * @param {DrawingWorkflowModel} workflow - Workflow data
   * @returns {Promise<DrawingWorkflowModel>} Created workflow
   */
  async createWorkflow(drawingId, workflow) {
    try {
      const response = await fetch(`/api/drafting/drawings/${drawingId}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create workflow for drawing ${drawingId}`);
      }
      
      const data = await response.json();
      return new DrawingWorkflowModel(data);
    } catch (error) {
      console.error(`Error creating workflow for drawing ${drawingId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update a workflow step
   * @param {String} workflowId - Workflow ID
   * @param {String} stepId - Step ID
   * @param {WorkflowStepModel} step - Updated step data
   * @returns {Promise<WorkflowStepModel>} Updated step
   */
  async updateWorkflowStep(workflowId, stepId, step) {
    try {
      const response = await fetch(`/api/drafting/workflows/${workflowId}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(step),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update step ${stepId} for workflow ${workflowId}`);
      }
      
      const data = await response.json();
      return new WorkflowStepModel(data);
    } catch (error) {
      console.error(`Error updating step ${stepId} for workflow ${workflowId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get external tool integrations
   * @returns {Promise<Array>} List of external tool integrations
   */
  async getExternalToolIntegrations() {
    try {
      const response = await fetch('/api/drafting/integrations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch external tool integrations');
      }
      
      const data = await response.json();
      return data.map(item => new ExternalToolIntegrationModel(item));
    } catch (error) {
      console.error('Error fetching external tool integrations:', error);
      throw error;
    }
  }
  
  /**
   * Create an external tool integration
   * @param {ExternalToolIntegrationModel} integration - Integration data
   * @returns {Promise<ExternalToolIntegrationModel>} Created integration
   */
  async createExternalToolIntegration(integration) {
    try {
      const response = await fetch('/api/drafting/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(integration),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create external tool integration');
      }
      
      const data = await response.json();
      return new ExternalToolIntegrationModel(data);
    } catch (error) {
      console.error('Error creating external tool integration:', error);
      throw error;
    }
  }
  
  /**
   * Sync with external tool
   * @param {String} integrationId - Integration ID
   * @returns {Promise<Object>} Sync result
   */
  async syncWithExternalTool(integrationId) {
    try {
      const response = await fetch(`/api/drafting/integrations/${integrationId}/sync`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync with external tool integration ${integrationId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error syncing with external tool integration ${integrationId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get drawing templates
   * @param {Object} filters - Optional filters
   * @param {String} filters.type - Filter by template type
   * @returns {Promise<Array>} List of drawing templates
   */
  async getDrawingTemplates(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      
      const response = await fetch(`/api/drafting/templates?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch drawing templates');
      }
      
      const data = await response.json();
      return data.map(item => new DrawingTemplateModel(item));
    } catch (error) {
      console.error('Error fetching drawing templates:', error);
      throw error;
    }
  }
  
  /**
   * Create a drawing from template
   * @param {String} templateId - Template ID
   * @param {Object} drawingData - Drawing data
   * @returns {Promise<DrawingModel>} Created drawing
   */
  async createDrawingFromTemplate(templateId, drawingData) {
    try {
      const response = await fetch(`/api/drafting/templates/${templateId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drawingData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create drawing from template ${templateId}`);
      }
      
      const data = await response.json();
      return new DrawingModel(data);
    } catch (error) {
      console.error(`Error creating drawing from template ${templateId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const draftingService = new DraftingService();
