/**
 * DraftingEngineeringModule
 * Main module file that exports all components and services for the Drafting/Engineering Module
 */

// Import models
const Drawing = require('./models/DrawingModel');
const Revision = require('./models/RevisionModel');
const Markup = require('./models/MarkupModel');

// Import services
const DrawingService = require('./services/DrawingService');
const DocumentService = require('./services/DocumentService');
const CADIntegrationService = require('./services/CADIntegrationService');
const WorkflowService = require('./services/WorkflowService');

// Import components (assuming they're properly exported from their respective files)
// Note: In a real implementation, these would be properly imported from the component files
const DrawingViewer = './components/DrawingViewer.jsx';
const DrawingList = './components/DrawingList.jsx';
const RevisionHistory = './components/RevisionHistory.jsx';
const DrawingDetails = './components/DrawingDetails.jsx';

/**
 * Initialize the Drafting/Engineering Module
 * @param {Object} config - Configuration options
 * @param {Object} dependencies - External dependencies
 * @returns {Object} - Initialized module
 */
function initializeDraftingEngineeringModule(config = {}, dependencies = {}) {
  // Create service instances
  const drawingService = new DrawingService(dependencies.database);
  const documentService = new DocumentService(dependencies.database);
  const cadIntegrationService = new CADIntegrationService();
  const workflowService = new WorkflowService(dependencies.database);
  
  return {
    // Models
    models: {
      Drawing,
      Revision,
      Markup
    },
    
    // Services
    services: {
      drawingService,
      documentService,
      cadIntegrationService,
      workflowService
    },
    
    // Component paths (in a real implementation, these would be the actual components)
    components: {
      DrawingViewer,
      DrawingList,
      RevisionHistory,
      DrawingDetails
    },
    
    // Module configuration
    config
  };
}

module.exports = {
  initializeDraftingEngineeringModule,
  models: {
    Drawing,
    Revision,
    Markup
  },
  services: {
    DrawingService,
    DocumentService,
    CADIntegrationService,
    WorkflowService
  }
};
