/**
 * Revision Model
 * Represents a revision record for a drawing in the Drafting/Engineering Module
 */
class Revision {
  constructor({
    id = null,
    drawingId,
    revisionNumber,
    description = '',
    createdBy,
    createdAt = new Date(),
    status = 'draft', // draft, in-review, approved, rejected
    comments = [],
    changes = [],
    approvedBy = null,
    approvedAt = null,
    fileUrl = null
  }) {
    this.id = id;
    this.drawingId = drawingId;
    this.revisionNumber = revisionNumber;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.status = status;
    this.comments = comments;
    this.changes = changes;
    this.approvedBy = approvedBy;
    this.approvedAt = approvedAt;
    this.fileUrl = fileUrl;
  }

  /**
   * Add a comment to this revision
   * @param {Object} comment - Comment data
   * @returns {Revision} - Updated Revision object
   */
  addComment({ text, userId, timestamp = new Date() }) {
    this.comments.push({
      id: `comment_${Date.now()}`,
      text,
      userId,
      timestamp
    });
    return this;
  }

  /**
   * Add a change record to this revision
   * @param {Object} change - Change data
   * @returns {Revision} - Updated Revision object
   */
  addChange({ field, oldValue, newValue, userId, timestamp = new Date() }) {
    this.changes.push({
      id: `change_${Date.now()}`,
      field,
      oldValue,
      newValue,
      userId,
      timestamp
    });
    return this;
  }

  /**
   * Update the status of this revision
   * @param {string} newStatus - New status value
   * @param {string} userId - User ID who changed the status
   * @returns {Revision} - Updated Revision object
   */
  updateStatus(newStatus, userId) {
    this.status = newStatus;
    
    if (newStatus === 'approved') {
      this.approvedBy = userId;
      this.approvedAt = new Date();
    }
    
    return this;
  }

  /**
   * Convert to a plain object for storage/transmission
   * @returns {Object} - Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      drawingId: this.drawingId,
      revisionNumber: this.revisionNumber,
      description: this.description,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      status: this.status,
      comments: this.comments,
      changes: this.changes,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
      fileUrl: this.fileUrl
    };
  }

  /**
   * Create a Revision object from a plain object
   * @param {Object} data - Plain object data
   * @returns {Revision} - New Revision instance
   */
  static fromObject(data) {
    return new Revision(data);
  }
}

module.exports = Revision;
