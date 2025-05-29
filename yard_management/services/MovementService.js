/**
 * MovementService
 * Service for managing material movements in the Yard Management Module
 */
const Movement = require('../models/MovementModel');

class MovementService {
  constructor(database) {
    this.database = database;
    this.materialService = new (require('./MaterialService'))(database);
    this.locationService = new (require('./LocationService'))(database);
  }

  /**
   * Create a new movement request
   * @param {Object} movementData - Movement data
   * @returns {Promise<Movement>} - Created Movement object
   */
  async createMovement(movementData) {
    // Validate required fields
    if (!movementData.materialId || !movementData.quantity || !movementData.toLocationId) {
      throw new Error('Missing required fields: materialId, quantity, and toLocationId are required');
    }
    
    // Validate material exists
    const material = await this.materialService.getMaterialById(movementData.materialId);
    if (!material) {
      throw new Error(`Material with ID ${movementData.materialId} not found`);
    }
    
    // Set fromLocationId if not provided
    if (!movementData.fromLocationId) {
      movementData.fromLocationId = material.location;
    }
    
    // Validate locations exist
    if (movementData.fromLocationId) {
      const fromLocation = await this.locationService.getLocationById(movementData.fromLocationId);
      if (!fromLocation) {
        throw new Error(`Source location with ID ${movementData.fromLocationId} not found`);
      }
    }
    
    const toLocation = await this.locationService.getLocationById(movementData.toLocationId);
    if (!toLocation) {
      throw new Error(`Destination location with ID ${movementData.toLocationId} not found`);
    }
    
    // Validate quantity
    if (movementData.quantity <= 0) {
      throw new Error('Movement quantity must be greater than zero');
    }
    
    if (movementData.quantity > material.quantity && movementData.type !== 'receive') {
      throw new Error(`Cannot move more than available quantity (${material.quantity})`);
    }
    
    // Check if destination location can accommodate the material
    if (!toLocation.canAccommodate({ 
      size: material.properties.size,
      weight: material.properties.weight
    })) {
      throw new Error(`Destination location cannot accommodate this material`);
    }
    
    // Create movement object
    const movement = new Movement({
      ...movementData,
      requestedBy: movementData.requestedBy || 'currentUser',
      requestedAt: new Date()
    });
    
    // In a real implementation, this would save to a database
    return Promise.resolve(movement);
  }

  /**
   * Get a movement by ID
   * @param {string} id - Movement ID
   * @returns {Promise<Movement>} - Retrieved Movement object
   */
  async getMovementById(id) {
    // In a real implementation, this would fetch from a database
    return Promise.resolve(new Movement({ 
      id, 
      materialId: 'material1',
      quantity: 100,
      fromLocationId: 'location1',
      toLocationId: 'location2',
      requestedBy: 'user1'
    }));
  }

  /**
   * Update a movement
   * @param {string} id - Movement ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Movement>} - Updated Movement object
   */
  async updateMovement(id, updateData) {
    const movement = await this.getMovementById(id);
    
    // Validate status transitions
    if (updateData.status && updateData.status !== movement.status) {
      const validTransitions = {
        'pending': ['in-progress', 'cancelled'],
        'in-progress': ['completed', 'cancelled'],
        'completed': [],
        'cancelled': []
      };
      
      if (!validTransitions[movement.status].includes(updateData.status)) {
        throw new Error(`Invalid status transition from ${movement.status} to ${updateData.status}`);
      }
    }
    
    // Apply updates
    Object.assign(movement, updateData);
    
    // In a real implementation, this would update in a database
    return Promise.resolve(movement);
  }

  /**
   * Delete a movement
   * @param {string} id - Movement ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteMovement(id) {
    const movement = await this.getMovementById(id);
    
    // Only pending movements can be deleted
    if (movement.status !== 'pending') {
      throw new Error(`Cannot delete movement with status: ${movement.status}`);
    }
    
    // In a real implementation, this would delete from a database
    return Promise.resolve(true);
  }

  /**
   * Get all movements
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array<Movement>>} - Array of Movement objects
   */
  async getAllMovements(filters = {}) {
    // In a real implementation, this would query a database with filters
    return Promise.resolve([
      new Movement({ 
        id: 'movement1', 
        materialId: 'material1',
        quantity: 100,
        fromLocationId: 'location1',
        toLocationId: 'location2',
        status: 'completed',
        requestedBy: 'user1',
        completedBy: 'user2',
        completedAt: new Date(Date.now() - 86400000) // 1 day ago
      }),
      new Movement({ 
        id: 'movement2', 
        materialId: 'material2',
        quantity: 50,
        fromLocationId: 'location3',
        toLocationId: 'location4',
        status: 'pending',
        requestedBy: 'user1'
      })
    ]);
  }

  /**
   * Get movements by material
   * @param {string} materialId - Material ID
   * @returns {Promise<Array<Movement>>} - Array of Movement objects
   */
  async getMovementsByMaterial(materialId) {
    // In a real implementation, this would query a database
    return Promise.resolve([
      new Movement({ 
        id: 'movement1', 
        materialId,
        quantity: 100,
        fromLocationId: 'location1',
        toLocationId: 'location2',
        status: 'completed',
        requestedBy: 'user1',
        completedBy: 'user2',
        completedAt: new Date(Date.now() - 86400000) // 1 day ago
      })
    ]);
  }

  /**
   * Get movements by location
   * @param {string} locationId - Location ID
   * @param {string} direction - 'from', 'to', or 'both'
   * @returns {Promise<Array<Movement>>} - Array of Movement objects
   */
  async getMovementsByLocation(locationId, direction = 'both') {
    // In a real implementation, this would query a database
    const allMovements = [
      new Movement({ 
        id: 'movement1', 
        materialId: 'material1',
        quantity: 100,
        fromLocationId: 'location1',
        toLocationId: 'location2',
        status: 'completed',
        requestedBy: 'user1',
        completedBy: 'user2',
        completedAt: new Date(Date.now() - 86400000) // 1 day ago
      }),
      new Movement({ 
        id: 'movement2', 
        materialId: 'material2',
        quantity: 50,
        fromLocationId: locationId,
        toLocationId: 'location4',
        status: 'pending',
        requestedBy: 'user1'
      }),
      new Movement({ 
        id: 'movement3', 
        materialId: 'material3',
        quantity: 75,
        fromLocationId: 'location3',
        toLocationId: locationId,
        status: 'in-progress',
        requestedBy: 'user1'
      })
    ];
    
    if (direction === 'from') {
      return Promise.resolve(allMovements.filter(m => m.fromLocationId === locationId));
    } else if (direction === 'to') {
      return Promise.resolve(allMovements.filter(m => m.toLocationId === locationId));
    } else {
      return Promise.resolve(allMovements.filter(m => 
        m.fromLocationId === locationId || m.toLocationId === locationId
      ));
    }
  }

  /**
   * Execute a movement
   * @param {string} id - Movement ID
   * @param {Object} executionData - Execution data
   * @returns {Promise<Object>} - Result object with updated movement and affected entities
   */
  async executeMovement(id, executionData = {}) {
    const movement = await this.getMovementById(id);
    
    // Validate movement status
    if (movement.status !== 'pending' && movement.status !== 'in-progress') {
      throw new Error(`Cannot execute movement with status: ${movement.status}`);
    }
    
    // Get material and locations
    const material = await this.materialService.getMaterialById(movement.materialId);
    
    // Start the movement if not already in progress
    if (movement.status === 'pending') {
      movement.start(executionData.operatorId || 'currentUser', executionData.equipmentId);
    }
    
    // Complete the movement
    movement.complete(executionData.completedBy || 'currentUser');
    
    // Update material location
    await this.materialService.moveMaterial(
      movement.materialId, 
      movement.toLocationId,
      {
        quantity: movement.quantity,
        notes: executionData.notes || ''
      }
    );
    
    // Update location occupancy
    if (movement.fromLocationId) {
      await this.locationService.updateLocationOccupancy(movement.fromLocationId);
    }
    await this.locationService.updateLocationOccupancy(movement.toLocationId);
    
    // In a real implementation, this would update in a database
    return Promise.resolve({
      movement,
      material: await this.materialService.getMaterialById(movement.materialId),
      fromLocation: movement.fromLocationId ? 
        await this.locationService.getLocationById(movement.fromLocationId) : null,
      toLocation: await this.locationService.getLocationById(movement.toLocationId)
    });
  }

  /**
   * Cancel a movement
   * @param {string} id - Movement ID
   * @param {string} cancelledBy - User ID who cancelled the movement
   * @param {string} reason - Reason for cancellation
   * @returns {Promise<Movement>} - Updated Movement object
   */
  async cancelMovement(id, cancelledBy, reason = '') {
    const movement = await this.getMovementById(id);
    
    // Validate movement status
    if (movement.status !== 'pending' && movement.status !== 'in-progress') {
      throw new Error(`Cannot cancel movement with status: ${movement.status}`);
    }
    
    // Cancel the movement
    movement.cancel(cancelledBy, reason);
    
    // In a real implementation, this would update in a database
    return Promise.resolve(movement);
  }

  /**
   * Schedule a movement for a future time
   * @param {string} id - Movement ID
   * @param {Date} scheduledTime - Time when the movement should occur
   * @returns {Promise<Movement>} - Updated Movement object
   */
  async scheduleMovement(id, scheduledTime) {
    const movement = await this.getMovementById(id);
    
    // Validate movement status
    if (movement.status !== 'pending') {
      throw new Error(`Cannot schedule movement with status: ${movement.status}`);
    }
    
    // Validate scheduled time is in the future
    if (scheduledTime <= new Date()) {
      throw new Error('Scheduled time must be in the future');
    }
    
    // Schedule the movement
    movement.schedule(scheduledTime);
    
    // In a real implementation, this would update in a database
    return Promise.resolve(movement);
  }

  /**
   * Generate movement report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} - Report data
   */
  async generateMovementReport(options = {}) {
    // In a real implementation, this would generate a comprehensive report
    const movements = await this.getAllMovements();
    
    const startDate = options.startDate ? new Date(options.startDate) : new Date(Date.now() - 30 * 86400000); // 30 days ago
    const endDate = options.endDate ? new Date(options.endDate) : new Date();
    
    const filteredMovements = movements.filter(movement => {
      const movementDate = movement.completedAt || movement.requestedAt;
      return movementDate >= startDate && movementDate <= endDate;
    });
    
    const report = {
      generatedAt: new Date(),
      period: {
        start: startDate,
        end: endDate
      },
      totalMovements: filteredMovements.length,
      byStatus: {
        pending: filteredMovements.filter(m => m.status === 'pending').length,
        inProgress: filteredMovements.filter(m => m.status === 'in-progress').length,
        completed: filteredMovements.filter(m => m.status === 'completed').length,
        cancelled: filteredMovements.filter(m => m.status === 'cancelled').length
      },
      byType: {
        transfer: filteredMovements.filter(m => m.type === 'transfer').length,
        receive: filteredMovements.filter(m => m.type === 'receive').length,
        ship: filteredMovements.filter(m => m.type === 'ship').length,
        return: filteredMovements.filter(m => m.type === 'return').length
      }
    };
    
    return Promise.resolve(report);
  }
}

module.exports = MovementService;
