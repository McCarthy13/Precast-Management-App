/**
 * Movement Model
 * Represents a material movement operation in the yard
 */
class Movement {
  constructor({
    id = null,
    materialId,
    quantity,
    fromLocationId = null,
    toLocationId,
    type = 'transfer', // transfer, receive, ship, return
    status = 'pending', // pending, in-progress, completed, cancelled
    requestedBy,
    requestedAt = new Date(),
    scheduledFor = null,
    completedBy = null,
    completedAt = null,
    equipmentId = null,
    operatorId = null,
    notes = '',
    properties = {}
  }) {
    this.id = id;
    this.materialId = materialId;
    this.quantity = quantity;
    this.fromLocationId = fromLocationId;
    this.toLocationId = toLocationId;
    this.type = type;
    this.status = status;
    this.requestedBy = requestedBy;
    this.requestedAt = requestedAt;
    this.scheduledFor = scheduledFor;
    this.completedBy = completedBy;
    this.completedAt = completedAt;
    this.equipmentId = equipmentId;
    this.operatorId = operatorId;
    this.notes = notes;
    this.properties = properties;
  }

  /**
   * Start the movement operation
   * @param {string} operatorId - ID of the operator performing the movement
   * @param {string} equipmentId - ID of the equipment used
   * @returns {Movement} - Updated Movement object
   */
  start(operatorId, equipmentId = null) {
    this.status = 'in-progress';
    this.operatorId = operatorId;
    if (equipmentId) {
      this.equipmentId = equipmentId;
    }
    return this;
  }

  /**
   * Complete the movement operation
   * @param {string} completedBy - ID of the user who completed the movement
   * @returns {Movement} - Updated Movement object
   */
  complete(completedBy) {
    this.status = 'completed';
    this.completedBy = completedBy;
    this.completedAt = new Date();
    return this;
  }

  /**
   * Cancel the movement operation
   * @param {string} cancelledBy - ID of the user who cancelled the movement
   * @param {string} reason - Reason for cancellation
   * @returns {Movement} - Updated Movement object
   */
  cancel(cancelledBy, reason = '') {
    this.status = 'cancelled';
    this.completedBy = cancelledBy;
    this.completedAt = new Date();
    this.notes += `\nCancelled: ${reason}`;
    return this;
  }

  /**
   * Schedule the movement for a future time
   * @param {Date} scheduledTime - Time when the movement should occur
   * @returns {Movement} - Updated Movement object
   */
  schedule(scheduledTime) {
    this.scheduledFor = scheduledTime;
    return this;
  }

  /**
   * Add notes to the movement
   * @param {string} note - Note to add
   * @returns {Movement} - Updated Movement object
   */
  addNote(note) {
    this.notes += this.notes ? `\n${note}` : note;
    return this;
  }

  /**
   * Convert to a plain object for storage/transmission
   * @returns {Object} - Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      materialId: this.materialId,
      quantity: this.quantity,
      fromLocationId: this.fromLocationId,
      toLocationId: this.toLocationId,
      type: this.type,
      status: this.status,
      requestedBy: this.requestedBy,
      requestedAt: this.requestedAt,
      scheduledFor: this.scheduledFor,
      completedBy: this.completedBy,
      completedAt: this.completedAt,
      equipmentId: this.equipmentId,
      operatorId: this.operatorId,
      notes: this.notes,
      properties: this.properties
    };
  }

  /**
   * Create a Movement object from a plain object
   * @param {Object} data - Plain object data
   * @returns {Movement} - New Movement instance
   */
  static fromObject(data) {
    return new Movement(data);
  }
}

module.exports = Movement;
