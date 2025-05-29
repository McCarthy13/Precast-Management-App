/**
 * Drawing Model
 * Represents a drawing document in the Drafting/Engineering Module
 */
class Drawing {
  constructor({
    id = null,
    title,
    description = '',
    projectId,
    drawingNumber,
    revisionNumber = '0',
    status = 'draft', // draft, in-review, approved, released
    fileUrl,
    fileType,
    uploadedBy,
    uploadedAt = new Date(),
    lastModifiedBy = null,
    lastModifiedAt = null,
    tags = [],
    metadata = {}
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.projectId = projectId;
    this.drawingNumber = drawingNumber;
    this.revisionNumber = revisionNumber;
    this.status = status;
    this.fileUrl = fileUrl;
    this.fileType = fileType;
    this.uploadedBy = uploadedBy;
    this.uploadedAt = uploadedAt;
    this.lastModifiedBy = lastModifiedBy;
    this.lastModifiedAt = lastModifiedAt;
    this.tags = tags;
    this.metadata = metadata;
  }

  /**
   * Create a new revision of this drawing
   * @param {Object} revisionData - Data for the new revision
   * @returns {Drawing} - New Drawing object with updated revision info
   */
  createRevision({ revisionNumber, modifiedBy, description = '' }) {
    const newRevision = { ...this };
    newRevision.id = null; // New revision gets a new ID
    newRevision.revisionNumber = revisionNumber;
    newRevision.lastModifiedBy = modifiedBy;
    newRevision.lastModifiedAt = new Date();
    newRevision.status = 'draft';
    newRevision.description = description || this.description;
    
    return new Drawing(newRevision);
  }

  /**
   * Update the status of this drawing
   * @param {string} newStatus - New status value
   * @param {string} modifiedBy - User ID who changed the status
   * @returns {Drawing} - Updated Drawing object
   */
  updateStatus(newStatus, modifiedBy) {
    this.status = newStatus;
    this.lastModifiedBy = modifiedBy;
    this.lastModifiedAt = new Date();
    return this;
  }

  /**
   * Add tags to this drawing
   * @param {Array} newTags - Array of tags to add
   * @returns {Drawing} - Updated Drawing object
   */
  addTags(newTags) {
    this.tags = [...new Set([...this.tags, ...newTags])];
    return this;
  }

  /**
   * Convert to a plain object for storage/transmission
   * @returns {Object} - Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      projectId: this.projectId,
      drawingNumber: this.drawingNumber,
      revisionNumber: this.revisionNumber,
      status: this.status,
      fileUrl: this.fileUrl,
      fileType: this.fileType,
      uploadedBy: this.uploadedBy,
      uploadedAt: this.uploadedAt,
      lastModifiedBy: this.lastModifiedBy,
      lastModifiedAt: this.lastModifiedAt,
      tags: this.tags,
      metadata: this.metadata
    };
  }

  /**
   * Create a Drawing object from a plain object
   * @param {Object} data - Plain object data
   * @returns {Drawing} - New Drawing instance
   */
  static fromObject(data) {
    return new Drawing(data);
  }
}

module.exports = Drawing;
