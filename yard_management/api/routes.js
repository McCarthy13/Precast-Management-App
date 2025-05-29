/**
 * YardManagementAPI
 * API routes for the Yard Management Module
 */
const express = require('express');
const router = express.Router();

// Import services
const MaterialService = require('../services/MaterialService');
const LocationService = require('../services/LocationService');
const MovementService = require('../services/MovementService');
const EquipmentService = require('../services/EquipmentService');

// Initialize services
// In a real implementation, these would be initialized with database connections
const materialService = new MaterialService();
const locationService = new LocationService();
const movementService = new MovementService();
const equipmentService = new EquipmentService();

// Middleware to handle errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware for authentication and authorization
const authenticate = (req, res, next) => {
  // In a real implementation, this would verify JWT tokens, API keys, etc.
  // For now, we'll just pass through
  next();
};

const authorize = (requiredRole) => (req, res, next) => {
  // In a real implementation, this would check user roles against required permissions
  // For now, we'll just pass through
  next();
};

// Security middleware
const rateLimiter = (req, res, next) => {
  // In a real implementation, this would limit request rates to prevent abuse
  next();
};

const validateInput = (schema) => (req, res, next) => {
  // In a real implementation, this would validate request data against schemas
  next();
};

/**
 * Material Routes
 */

// Get all materials
router.get('/materials', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const filters = req.query;
    const materials = await materialService.getAllMaterials(filters);
    res.json(materials);
  })
);

// Get a specific material
router.get('/materials/:id', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const material = await materialService.getMaterialById(id);
    
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(material);
  })
);

// Create a new material
router.post('/materials', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('material'),
  asyncHandler(async (req, res) => {
    const materialData = req.body;
    const material = await materialService.createMaterial(materialData);
    res.status(201).json(material);
  })
);

// Update a material
router.put('/materials/:id', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('material'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const material = await materialService.updateMaterial(id, updateData);
    
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(material);
  })
);

// Delete a material
router.delete('/materials/:id', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const success = await materialService.deleteMaterial(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.status(204).end();
  })
);

// Update material quantity
router.post('/materials/:id/quantity', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('quantity'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity, reason } = req.body;
    const material = await materialService.updateMaterialQuantity(id, quantity, reason);
    res.json(material);
  })
);

// Get materials by location
router.get('/locations/:locationId/materials', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { locationId } = req.params;
    const materials = await materialService.getMaterialsByLocation(locationId);
    res.json(materials);
  })
);

// Get materials by project
router.get('/projects/:projectId/materials', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const materials = await materialService.getMaterialsByProject(projectId);
    res.json(materials);
  })
);

// Generate inventory report
router.get('/reports/inventory', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const options = req.query;
    const report = await materialService.generateInventoryReport(options);
    res.json(report);
  })
);

/**
 * Location Routes
 */

// Get all locations
router.get('/locations', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const filters = req.query;
    const locations = await locationService.getAllLocations(filters);
    res.json(locations);
  })
);

// Get a specific location
router.get('/locations/:id', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const location = await locationService.getLocationById(id);
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  })
);

// Create a new location
router.post('/locations', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  validateInput('location'),
  asyncHandler(async (req, res) => {
    const locationData = req.body;
    const location = await locationService.createLocation(locationData);
    res.status(201).json(location);
  })
);

// Update a location
router.put('/locations/:id', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  validateInput('location'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const location = await locationService.updateLocation(id, updateData);
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  })
);

// Delete a location
router.delete('/locations/:id', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const success = await locationService.deleteLocation(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.status(204).end();
  })
);

// Get child locations
router.get('/locations/:id/children', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const locations = await locationService.getChildLocations(id);
    res.json(locations);
  })
);

// Get location hierarchy
router.get('/locations/hierarchy', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { rootId } = req.query;
    const hierarchy = await locationService.getLocationHierarchy(rootId);
    res.json(hierarchy);
  })
);

// Generate yard map
router.get('/yard/map', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const options = req.query;
    const mapData = await locationService.generateYardMap(options);
    res.json(mapData);
  })
);

// Optimize yard layout
router.post('/yard/optimize', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  validateInput('optimization'),
  asyncHandler(async (req, res) => {
    const criteria = req.body;
    const optimizationResults = await locationService.optimizeYardLayout(criteria);
    res.json(optimizationResults);
  })
);

/**
 * Movement Routes
 */

// Get all movements
router.get('/movements', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const filters = req.query;
    const movements = await movementService.getAllMovements(filters);
    res.json(movements);
  })
);

// Get a specific movement
router.get('/movements/:id', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movement = await movementService.getMovementById(id);
    
    if (!movement) {
      return res.status(404).json({ error: 'Movement not found' });
    }
    
    res.json(movement);
  })
);

// Create a new movement
router.post('/movements', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('movement'),
  asyncHandler(async (req, res) => {
    const movementData = req.body;
    const movement = await movementService.createMovement(movementData);
    res.status(201).json(movement);
  })
);

// Update a movement
router.put('/movements/:id', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('movement'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const movement = await movementService.updateMovement(id, updateData);
    
    if (!movement) {
      return res.status(404).json({ error: 'Movement not found' });
    }
    
    res.json(movement);
  })
);

// Delete a movement
router.delete('/movements/:id', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const success = await movementService.deleteMovement(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Movement not found' });
    }
    
    res.status(204).end();
  })
);

// Execute a movement
router.post('/movements/:id/execute', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('execution'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const executionData = req.body;
    const result = await movementService.executeMovement(id, executionData);
    res.json(result);
  })
);

// Cancel a movement
router.post('/movements/:id/cancel', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('cancellation'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const movement = await movementService.cancelMovement(id, req.user.id, reason);
    res.json(movement);
  })
);

// Schedule a movement
router.post('/movements/:id/schedule', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('schedule'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { scheduledTime } = req.body;
    const movement = await movementService.scheduleMovement(id, new Date(scheduledTime));
    res.json(movement);
  })
);

// Get movements by material
router.get('/materials/:materialId/movements', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { materialId } = req.params;
    const movements = await movementService.getMovementsByMaterial(materialId);
    res.json(movements);
  })
);

// Get movements by location
router.get('/locations/:locationId/movements', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { locationId } = req.params;
    const { direction } = req.query;
    const movements = await movementService.getMovementsByLocation(locationId, direction);
    res.json(movements);
  })
);

// Generate movement report
router.get('/reports/movements', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const options = req.query;
    const report = await movementService.generateMovementReport(options);
    res.json(report);
  })
);

/**
 * Equipment Routes
 */

// Get all equipment
router.get('/equipment', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const filters = req.query;
    const equipment = await equipmentService.getAllEquipment(filters);
    res.json(equipment);
  })
);

// Get a specific equipment
router.get('/equipment/:id', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const equipment = await equipmentService.getEquipmentById(id);
    
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json(equipment);
  })
);

// Create a new equipment
router.post('/equipment', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  validateInput('equipment'),
  asyncHandler(async (req, res) => {
    const equipmentData = req.body;
    const equipment = await equipmentService.createEquipment(equipmentData);
    res.status(201).json(equipment);
  })
);

// Update an equipment
router.put('/equipment/:id', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  validateInput('equipment'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const equipment = await equipmentService.updateEquipment(id, updateData);
    
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json(equipment);
  })
);

// Delete an equipment
router.delete('/equipment/:id', 
  authenticate, 
  authorize('yard_admin'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const success = await equipmentService.deleteEquipment(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.status(204).end();
  })
);

// Assign equipment to operator
router.post('/equipment/:id/assign', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('assignment'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { operatorId } = req.body;
    const equipment = await equipmentService.assignEquipmentToOperator(id, operatorId);
    res.json(equipment);
  })
);

// Release equipment
router.post('/equipment/:id/release', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const equipment = await equipmentService.releaseEquipment(id);
    res.json(equipment);
  })
);

// Schedule equipment maintenance
router.post('/equipment/:id/maintenance', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('maintenance'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const maintenanceData = req.body;
    const equipment = await equipmentService.scheduleEquipmentMaintenance(id, maintenanceData);
    res.json(equipment);
  })
);

// Complete equipment maintenance
router.post('/equipment/:id/maintenance/:maintenanceId/complete', 
  authenticate, 
  authorize('yard_write'),
  rateLimiter,
  validateInput('maintenanceCompletion'),
  asyncHandler(async (req, res) => {
    const { id, maintenanceId } = req.params;
    const completionData = req.body;
    const equipment = await equipmentService.completeEquipmentMaintenance(id, maintenanceId, completionData);
    res.json(equipment);
  })
);

// Get equipment by location
router.get('/locations/:locationId/equipment', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { locationId } = req.params;
    const equipment = await equipmentService.getEquipmentByLocation(locationId);
    res.json(equipment);
  })
);

// Get equipment by operator
router.get('/operators/:operatorId/equipment', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { operatorId } = req.params;
    const equipment = await equipmentService.getEquipmentByOperator(operatorId);
    res.json(equipment);
  })
);

// Get available equipment
router.get('/equipment/available', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const requirements = req.query;
    const equipment = await equipmentService.getAvailableEquipment(requirements);
    res.json(equipment);
  })
);

// Track equipment location
router.get('/equipment/:id/track', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const locationData = await equipmentService.trackEquipmentLocation(id);
    res.json(locationData);
  })
);

// Generate equipment utilization report
router.get('/reports/equipment-utilization', 
  authenticate, 
  authorize('yard_read'),
  rateLimiter,
  asyncHandler(async (req, res) => {
    const options = req.query;
    const report = await equipmentService.generateEquipmentUtilizationReport(options);
    res.json(report);
  })
);

module.exports = router;
