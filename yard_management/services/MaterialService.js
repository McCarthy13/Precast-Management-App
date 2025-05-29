/**
 * MaterialService
 * Service for managing materials in the Yard Management Module
 */
const Material = require('../models/MaterialModel');

class MaterialService {
  constructor(database) {
    this.database = database;
  }

  /**
   * Create a new material
   * @param {Object} materialData - Material data
   * @returns {Promise<Material>} - Created Material object
   */
  async createMaterial(materialData) {
    // Validate required fields
    if (!materialData.name || !materialData.type || !materialData.category || !materialData.unit) {
      throw new Error('Missing required fields: name, type, category, and unit are required');
    }
    
    // Validate quantity is non-negative
    if (materialData.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    
    const material = new Material(materialData);
    
    // In a real implementation, this would save to a database
    // For now, we'll simulate this with a resolved promise
    return Promise.resolve(material);
  }

  /**
   * Get a material by ID
   * @param {string} id - Material ID
   * @returns {Promise<Material>} - Retrieved Material object
   */
  async getMaterialById(id) {
    // In a real implementation, this would fetch from a database
    // For now, we'll simulate this with a resolved promise
    return Promise.resolve(new Material({ 
      id, 
      name: 'Sample Material', 
      type: 'raw', 
      category: 'concrete', 
      quantity: 100,
      unit: 'cubic yards'
    }));
  }

  /**
   * Update a material
   * @param {string} id - Material ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Material>} - Updated Material object
   */
  async updateMaterial(id, updateData) {
    const material = await this.getMaterialById(id);
    
    // Validate quantity is non-negative if provided
    if (updateData.quantity !== undefined && updateData.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    
    // Apply updates
    Object.assign(material, updateData);
    material.updatedAt = new Date();
    
    // In a real implementation, this would update in a database
    return Promise.resolve(material);
  }

  /**
   * Delete a material
   * @param {string} id - Material ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteMaterial(id) {
    // In a real implementation, this would delete from a database
    // We should also check for dependencies before deletion
    return Promise.resolve(true);
  }

  /**
   * Get all materials
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array<Material>>} - Array of Material objects
   */
  async getAllMaterials(filters = {}) {
    // In a real implementation, this would query a database with filters
    return Promise.resolve([
      new Material({ 
        id: 'material1', 
        name: 'Concrete Mix', 
        type: 'raw', 
        category: 'concrete', 
        quantity: 500,
        unit: 'cubic yards'
      }),
      new Material({ 
        id: 'material2', 
        name: 'Rebar', 
        type: 'raw', 
        category: 'steel', 
        quantity: 1000,
        unit: 'tons'
      }),
      new Material({ 
        id: 'material3', 
        name: 'Precast Panel', 
        type: 'finished', 
        category: 'panel', 
        quantity: 50,
        unit: 'pieces'
      })
    ]);
  }

  /**
   * Get materials by location
   * @param {string} locationId - Location ID
   * @returns {Promise<Array<Material>>} - Array of Material objects
   */
  async getMaterialsByLocation(locationId) {
    // In a real implementation, this would query a database
    return Promise.resolve([
      new Material({ 
        id: 'material1', 
        name: 'Concrete Mix', 
        type: 'raw', 
        category: 'concrete', 
        quantity: 500,
        unit: 'cubic yards',
        location: locationId
      })
    ]);
  }

  /**
   * Get materials by project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array<Material>>} - Array of Material objects
   */
  async getMaterialsByProject(projectId) {
    // In a real implementation, this would query a database
    return Promise.resolve([
      new Material({ 
        id: 'material3', 
        name: 'Precast Panel', 
        type: 'finished', 
        category: 'panel', 
        quantity: 50,
        unit: 'pieces',
        projectId
      })
    ]);
  }

  /**
   * Update material quantity
   * @param {string} id - Material ID
   * @param {number} newQuantity - New quantity value
   * @param {string} reason - Reason for quantity update
   * @returns {Promise<Material>} - Updated Material object
   */
  async updateMaterialQuantity(id, newQuantity, reason = '') {
    const material = await this.getMaterialById(id);
    
    // Validate quantity is non-negative
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    
    // Create audit record for quantity change
    const auditRecord = {
      materialId: id,
      previousQuantity: material.quantity,
      newQuantity,
      change: newQuantity - material.quantity,
      reason,
      timestamp: new Date(),
      userId: 'currentUser' // In a real implementation, this would be the authenticated user
    };
    
    // In a real implementation, this would save the audit record to a database
    
    // Update the material
    material.updateQuantity(newQuantity);
    
    // In a real implementation, this would update in a database
    return Promise.resolve(material);
  }

  /**
   * Move material to a new location
   * @param {string} id - Material ID
   * @param {string} newLocationId - New location ID
   * @param {Object} movementData - Additional movement data
   * @returns {Promise<Object>} - Result object with updated material and movement
   */
  async moveMaterial(id, newLocationId, movementData = {}) {
    const material = await this.getMaterialById(id);
    
    // Create movement record
    const movement = {
      materialId: id,
      quantity: movementData.quantity || material.quantity,
      fromLocationId: material.location,
      toLocationId: newLocationId,
      type: 'transfer',
      status: 'completed',
      requestedBy: 'currentUser',
      completedBy: 'currentUser',
      completedAt: new Date(),
      notes: movementData.notes || ''
    };
    
    // In a real implementation, this would save the movement to a database
    
    // Update the material location
    material.moveToLocation(newLocationId);
    
    // In a real implementation, this would update in a database
    return Promise.resolve({
      material,
      movement
    });
  }

  /**
   * Search materials by criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array<Material>>} - Array of matching Material objects
   */
  async searchMaterials(criteria) {
    // In a real implementation, this would query a database with filters
    return Promise.resolve([
      new Material({ 
        id: 'material1', 
        name: 'Concrete Mix', 
        type: 'raw', 
        category: 'concrete', 
        quantity: 500,
        unit: 'cubic yards'
      })
    ]);
  }

  /**
   * Get low stock materials
   * @param {Object} thresholds - Threshold values by category
   * @returns {Promise<Array<Material>>} - Array of low stock Material objects
   */
  async getLowStockMaterials(thresholds = {}) {
    // In a real implementation, this would query a database for materials below thresholds
    return Promise.resolve([
      new Material({ 
        id: 'material4', 
        name: 'Cement', 
        type: 'raw', 
        category: 'concrete', 
        quantity: 10,
        unit: 'bags'
      })
    ]);
  }

  /**
   * Generate material inventory report
   * @param {Object} options - Report options
   * @returns {Promise<Object>} - Report data
   */
  async generateInventoryReport(options = {}) {
    // In a real implementation, this would generate a comprehensive report
    const materials = await this.getAllMaterials();
    
    const report = {
      generatedAt: new Date(),
      totalMaterials: materials.length,
      categories: {},
      totalValue: 0
    };
    
    // Group by category
    materials.forEach(material => {
      const category = material.category;
      if (!report.categories[category]) {
        report.categories[category] = {
          count: 0,
          totalQuantity: 0,
          value: 0
        };
      }
      
      report.categories[category].count++;
      report.categories[category].totalQuantity += material.quantity;
      
      if (material.cost) {
        const materialValue = material.quantity * material.cost;
        report.categories[category].value += materialValue;
        report.totalValue += materialValue;
      }
    });
    
    return Promise.resolve(report);
  }
}

module.exports = MaterialService;
