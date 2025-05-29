/**
 * Material Model
 * Represents a material item in the Yard Management Module
 */
class Material {
  constructor({
    id = null,
    name,
    type, // raw, finished, component
    category,
    description = '',
    quantity = 0,
    unit, // cubic yards, tons, pieces, etc.
    location = null,
    status = 'available', // available, allocated, reserved, depleted
    projectId = null,
    batchNumber = null,
    manufacturingDate = null,
    expirationDate = null,
    supplier = null,
    cost = null,
    tags = [],
    properties = {},
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.category = category;
    this.description = description;
    this.quantity = quantity;
    this.unit = unit;
    this.location = location;
    this.status = status;
    this.projectId = projectId;
    this.batchNumber = batchNumber;
    this.manufacturingDate = manufacturingDate;
    this.expirationDate = expirationDate;
    this.supplier = supplier;
    this.cost = cost;
    this.tags = tags;
    this.properties = properties;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Update the quantity of this material
   * @param {number} newQuantity - New quantity value
   * @returns {Material} - Updated Material object
   */
  updateQuantity(newQuantity) {
    this.quantity = newQuantity;
    this.updatedAt = new Date();
    
    // Update status based on quantity
    if (newQuantity <= 0) {
      this.status = 'depleted';
    } else if (this.status === 'depleted') {
      this.status = 'available';
    }
    
    return this;
  }

  /**
   * Allocate material to a project
   * @param {string} projectId - Project ID to allocate to
   * @param {number} quantity - Quantity to allocate
   * @returns {Material} - Updated Material object
   */
  allocateToProject(projectId, quantity) {
    if (quantity > this.quantity) {
      throw new Error('Cannot allocate more than available quantity');
    }
    
    this.projectId = projectId;
    this.status = 'allocated';
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Move material to a new location
   * @param {string} newLocation - New location ID
   * @returns {Material} - Updated Material object
   */
  moveToLocation(newLocation) {
    this.location = newLocation;
    this.updatedAt = new Date();
    
    return this;
  }

  /**
   * Add tags to this material
   * @param {Array} newTags - Array of tags to add
   * @returns {Material} - Updated Material object
   */
  addTags(newTags) {
    this.tags = [...new Set([...this.tags, ...newTags])];
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
      category: this.category,
      description: this.description,
      quantity: this.quantity,
      unit: this.unit,
      location: this.location,
      status: this.status,
      projectId: this.projectId,
      batchNumber: this.batchNumber,
      manufacturingDate: this.manufacturingDate,
      expirationDate: this.expirationDate,
      supplier: this.supplier,
      cost: this.cost,
      tags: this.tags,
      properties: this.properties,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create a Material object from a plain object
   * @param {Object} data - Plain object data
   * @returns {Material} - New Material instance
   */
  static fromObject(data) {
    return new Material(data);
  }
}

module.exports = Material;
