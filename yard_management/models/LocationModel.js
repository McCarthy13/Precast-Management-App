/**
 * Location Model
 * Represents a storage location in the yard
 */
class Location {
  constructor({
    id = null,
    name,
    type, // zone, bay, rack, shelf, etc.
    parentId = null, // parent location ID for hierarchical structure
    capacity = null,
    capacityUnit = null,
    dimensions = null, // { length, width, height }
    coordinates = null, // { x, y } for yard mapping
    status = 'active', // active, maintenance, reserved, full
    occupancy = 0, // current occupancy percentage
    materials = [], // array of material IDs stored at this location
    properties = {},
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.parentId = parentId;
    this.capacity = capacity;
    this.capacityUnit = capacityUnit;
    this.dimensions = dimensions;
    this.coordinates = coordinates;
    this.status = status;
    this.occupancy = occupancy;
    this.materials = materials;
    this.properties = properties;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Add a material to this location
   * @param {string} materialId - Material ID to add
   * @returns {Location} - Updated Location object
   */
  addMaterial(materialId) {
    if (!this.materials.includes(materialId)) {
      this.materials.push(materialId);
      this.updateOccupancy();
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Remove a material from this location
   * @param {string} materialId - Material ID to remove
   * @returns {Location} - Updated Location object
   */
  removeMaterial(materialId) {
    this.materials = this.materials.filter(id => id !== materialId);
    this.updateOccupancy();
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Update the occupancy based on materials
   * @returns {Location} - Updated Location object
   */
  updateOccupancy() {
    // In a real implementation, this would calculate based on material volumes
    // For now, we'll use a simple percentage based on material count
    if (this.capacity) {
      this.occupancy = (this.materials.length / this.capacity) * 100;
      
      // Update status based on occupancy
      if (this.occupancy >= 95) {
        this.status = 'full';
      } else if (this.status === 'full') {
        this.status = 'active';
      }
    }
    
    return this;
  }

  /**
   * Check if location can accommodate a material
   * @param {Object} materialSize - Size information of the material
   * @returns {boolean} - Whether the location can accommodate the material
   */
  canAccommodate(materialSize) {
    // In a real implementation, this would check dimensions and capacity
    // For now, we'll use a simple check based on occupancy
    return this.status !== 'full' && this.status !== 'maintenance';
  }

  /**
   * Set location status
   * @param {string} newStatus - New status value
   * @returns {Location} - Updated Location object
   */
  setStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Convert to a plain object for storage/transmission
   * @returns {Object} - Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      parentId: this.parentId,
      capacity: this.capacity,
      capacityUnit: this.capacityUnit,
      dimensions: this.dimensions,
      coordinates: this.coordinates,
      status: this.status,
      occupancy: this.occupancy,
      materials: this.materials,
      properties: this.properties,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create a Location object from a plain object
   * @param {Object} data - Plain object data
   * @returns {Location} - New Location instance
   */
  static fromObject(data) {
    return new Location(data);
  }
}

module.exports = Location;
