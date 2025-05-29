/**
 * Main entry point for the Yard Management Module
 * Exports all components, services, and utilities for the module
 */

// Import models
const Material = require('./models/MaterialModel');
const Location = require('./models/LocationModel');
const Movement = require('./models/MovementModel');
const Equipment = require('./models/EquipmentModel');

// Import services
const MaterialService = require('./services/MaterialService');
const LocationService = require('./services/LocationService');
const MovementService = require('./services/MovementService');
const EquipmentService = require('./services/EquipmentService');

// Import components (assuming they're properly exported from their respective files)
// Note: In a real implementation, these would be properly imported from the component files
const YardMap = './components/YardMap.jsx';
const MaterialList = './components/MaterialList.jsx';
const MovementForm = './components/MovementForm.jsx';

// Import pages
const YardManagementPage = './pages/YardManagementPage.jsx';

/**
 * Initialize the Yard Management Module
 * @param {Object} config - Configuration options
 * @param {Object} dependencies - External dependencies
 * @returns {Object} - Initialized module
 */
function initializeYardManagementModule(config = {}, dependencies = {}) {
  // Create service instances
  const materialService = new MaterialService(dependencies.database);
  const locationService = new LocationService(dependencies.database);
  const movementService = new MovementService(dependencies.database);
  const equipmentService = new EquipmentService(dependencies.database);
  
  return {
    // Models
    models: {
      Material,
      Location,
      Movement,
      Equipment
    },
    
    // Services
    services: {
      materialService,
      locationService,
      movementService,
      equipmentService
    },
    
    // Component paths (in a real implementation, these would be the actual components)
    components: {
      YardMap,
      MaterialList,
      MovementForm
    },
    
    // Page paths
    pages: {
      YardManagementPage
    },
    
    // Module configuration
    config
  };
}

module.exports = {
  initializeYardManagementModule,
  models: {
    Material,
    Location,
    Movement,
    Equipment
  },
  services: {
    MaterialService,
    LocationService,
    MovementService,
    EquipmentService
  }
};
