/**
 * LocationService
 * Service for managing yard locations in the Yard Management Module
 */
const Location = require('../models/LocationModel');

class LocationService {
  constructor(database) {
    this.database = database;
  }

  /**
   * Create a new location
   * @param {Object} locationData - Location data
   * @returns {Promise<Location>} - Created Location object
   */
  async createLocation(locationData) {
    // Validate required fields
    if (!locationData.name || !locationData.type) {
      throw new Error('Missing required fields: name and type are required');
    }
    
    // Validate parent location if provided
    if (locationData.parentId) {
      try {
        const parentLocation = await this.getLocationById(locationData.parentId);
        if (!parentLocation) {
          throw new Error(`Parent location with ID ${locationData.parentId} not found`);
        }
      } catch (error) {
        throw new Error(`Invalid parent location: ${error.message}`);
      }
    }
    
    const location = new Location(locationData);
    
    // In a real implementation, this would save to a database
    return Promise.resolve(location);
  }

  /**
   * Get a location by ID
   * @param {string} id - Location ID
   * @returns {Promise<Location>} - Retrieved Location object
   */
  async getLocationById(id) {
    // In a real implementation, this would fetch from a database
    return Promise.resolve(new Location({ 
      id, 
      name: 'Sample Location', 
      type: 'zone'
    }));
  }

  /**
   * Update a location
   * @param {string} id - Location ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Location>} - Updated Location object
   */
  async updateLocation(id, updateData) {
    const location = await this.getLocationById(id);
    
    // Validate parent location if being updated
    if (updateData.parentId && updateData.parentId !== location.parentId) {
      try {
        const parentLocation = await this.getLocationById(updateData.parentId);
        if (!parentLocation) {
          throw new Error(`Parent location with ID ${updateData.parentId} not found`);
        }
        
        // Prevent circular references
        if (updateData.parentId === id) {
          throw new Error('Location cannot be its own parent');
        }
        
        // In a real implementation, we would check for deeper circular references
      } catch (error) {
        throw new Error(`Invalid parent location: ${error.message}`);
      }
    }
    
    // Apply updates
    Object.assign(location, updateData);
    location.updatedAt = new Date();
    
    // In a real implementation, this would update in a database
    return Promise.resolve(location);
  }

  /**
   * Delete a location
   * @param {string} id - Location ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteLocation(id) {
    // Check if location has child locations
    const childLocations = await this.getChildLocations(id);
    if (childLocations.length > 0) {
      throw new Error('Cannot delete location with child locations');
    }
    
    // Check if location has materials
    const materialService = new (require('./MaterialService'))(this.database);
    const materials = await materialService.getMaterialsByLocation(id);
    if (materials.length > 0) {
      throw new Error('Cannot delete location with assigned materials');
    }
    
    // In a real implementation, this would delete from a database
    return Promise.resolve(true);
  }

  /**
   * Get all locations
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array<Location>>} - Array of Location objects
   */
  async getAllLocations(filters = {}) {
    // In a real implementation, this would query a database with filters
    return Promise.resolve([
      new Location({ 
        id: 'location1', 
        name: 'Yard Zone A', 
        type: 'zone'
      }),
      new Location({ 
        id: 'location2', 
        name: 'Yard Zone B', 
        type: 'zone'
      }),
      new Location({ 
        id: 'location3', 
        name: 'Storage Bay 1', 
        type: 'bay',
        parentId: 'location1'
      })
    ]);
  }

  /**
   * Get child locations
   * @param {string} parentId - Parent location ID
   * @returns {Promise<Array<Location>>} - Array of child Location objects
   */
  async getChildLocations(parentId) {
    // In a real implementation, this would query a database
    return Promise.resolve([
      new Location({ 
        id: 'location3', 
        name: 'Storage Bay 1', 
        type: 'bay',
        parentId
      }),
      new Location({ 
        id: 'location4', 
        name: 'Storage Bay 2', 
        type: 'bay',
        parentId
      })
    ]);
  }

  /**
   * Get location hierarchy
   * @param {string} rootId - Root location ID (optional)
   * @returns {Promise<Object>} - Hierarchical structure of locations
   */
  async getLocationHierarchy(rootId = null) {
    // In a real implementation, this would build a tree structure from database data
    
    // If rootId is provided, start from that location
    // Otherwise, get all top-level locations (no parent)
    
    const buildLocationTree = async (parentId) => {
      const children = await this.getChildLocations(parentId);
      const result = [];
      
      for (const child of children) {
        const childTree = {
          ...child.toObject(),
          children: await buildLocationTree(child.id)
        };
        result.push(childTree);
      }
      
      return result;
    };
    
    if (rootId) {
      const rootLocation = await this.getLocationById(rootId);
      return {
        ...rootLocation.toObject(),
        children: await buildLocationTree(rootId)
      };
    } else {
      // Get all top-level locations (no parent)
      const topLocations = (await this.getAllLocations())
        .filter(location => !location.parentId);
      
      const result = [];
      for (const location of topLocations) {
        const locationTree = {
          ...location.toObject(),
          children: await buildLocationTree(location.id)
        };
        result.push(locationTree);
      }
      
      return { locations: result };
    }
  }

  /**
   * Get available locations for a material
   * @param {Object} materialData - Material data including dimensions, weight, etc.
   * @returns {Promise<Array<Location>>} - Array of suitable Location objects
   */
  async getAvailableLocationsForMaterial(materialData) {
    // In a real implementation, this would query locations based on capacity, dimensions, etc.
    const allLocations = await this.getAllLocations();
    
    // Filter locations based on status and occupancy
    const availableLocations = allLocations.filter(location => 
      location.status === 'active' && location.occupancy < 90
    );
    
    return Promise.resolve(availableLocations);
  }

  /**
   * Update location occupancy
   * @param {string} id - Location ID
   * @returns {Promise<Location>} - Updated Location object
   */
  async updateLocationOccupancy(id) {
    const location = await this.getLocationById(id);
    
    // Get materials at this location
    const materialService = new (require('./MaterialService'))(this.database);
    const materials = await materialService.getMaterialsByLocation(id);
    
    // Update location's materials list
    location.materials = materials.map(material => material.id);
    
    // Update occupancy
    location.updateOccupancy();
    
    // In a real implementation, this would update in a database
    return Promise.resolve(location);
  }

  /**
   * Generate yard map
   * @param {Object} options - Map options
   * @returns {Promise<Object>} - Map data
   */
  async generateYardMap(options = {}) {
    // In a real implementation, this would generate a visual representation of the yard
    const allLocations = await this.getAllLocations();
    
    // Get materials for each location
    const materialService = new (require('./MaterialService'))(this.database);
    const locationMaterials = {};
    
    for (const location of allLocations) {
      if (location.coordinates) {
        const materials = await materialService.getMaterialsByLocation(location.id);
        locationMaterials[location.id] = materials;
      }
    }
    
    const mapData = {
      locations: allLocations.map(location => ({
        id: location.id,
        name: location.name,
        type: location.type,
        coordinates: location.coordinates,
        dimensions: location.dimensions,
        occupancy: location.occupancy,
        status: location.status,
        materialCount: locationMaterials[location.id]?.length || 0
      })),
      dimensions: {
        width: options.width || 1000,
        height: options.height || 800
      }
    };
    
    return Promise.resolve(mapData);
  }

  /**
   * Optimize yard layout
   * @param {Object} criteria - Optimization criteria
   * @returns {Promise<Object>} - Optimization results
   */
  async optimizeYardLayout(criteria = {}) {
    // In a real implementation, this would run optimization algorithms
    // For now, we'll return a mock result
    
    return Promise.resolve({
      optimizationId: `opt_${Date.now()}`,
      criteria,
      suggestedChanges: [
        {
          materialId: 'material1',
          currentLocationId: 'location1',
          suggestedLocationId: 'location3',
          reason: 'Closer to production area',
          potentialSavings: '15 minutes per access'
        },
        {
          materialId: 'material2',
          currentLocationId: 'location2',
          suggestedLocationId: 'location4',
          reason: 'Better space utilization',
          potentialSavings: '20% space efficiency'
        }
      ],
      estimatedImprovements: {
        spaceUtilization: '+15%',
        accessTime: '-20%',
        operationalEfficiency: '+12%'
      }
    });
  }
}

module.exports = LocationService;
