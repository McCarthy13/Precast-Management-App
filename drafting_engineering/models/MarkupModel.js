/**
 * Markup Model
 * Represents markup annotations on drawings in the Drafting/Engineering Module
 */
class Markup {
  constructor({
    id = null,
    drawingId,
    revisionId = null,
    createdBy,
    createdAt = new Date(),
    type = 'comment', // comment, redline, measurement, callout
    position = { x: 0, y: 0 },
    content = '',
    properties = {},
    status = 'active', // active, resolved, archived
    replies = []
  }) {
    this.id = id;
    this.drawingId = drawingId;
    this.revisionId = revisionId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.type = type;
    this.position = position;
    this.content = content;
    this.properties = properties;
    this.status = status;
    this.replies = replies;
  }

  /**
   * Add a reply to this markup
   * @param {Object} reply - Reply data
   * @returns {Markup} - Updated Markup object
   */
  addReply({ text, userId, timestamp = new Date() }) {
    this.replies.push({
      id: `reply_${Date.now()}`,
      text,
      userId,
      timestamp
    });
    return this;
  }

  /**
   * Update the status of this markup
   * @param {string} newStatus - New status value
   * @param {string} userId - User ID who changed the status
   * @returns {Markup} - Updated Markup object
   */
  updateStatus(newStatus, userId) {
    this.status = newStatus;
    this.properties.statusChangedBy = userId;
    this.properties.statusChangedAt = new Date();
    return this;
  }

  /**
   * Update the content of this markup
   * @param {string} newContent - New content value
   * @returns {Markup} - Updated Markup object
   */
  updateContent(newContent) {
    this.content = newContent;
    return this;
  }

  /**
   * Update the position of this markup
   * @param {Object} newPosition - New position coordinates
   * @returns {Markup} - Updated Markup object
   */
  updatePosition(newPosition) {
    this.position = { ...this.position, ...newPosition };
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
      revisionId: this.revisionId,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      type: this.type,
      position: this.position,
      content: this.content,
      properties: this.properties,
      status: this.status,
      replies: this.replies
    };
  }

  /**
   * Create a Markup object from a plain object
   * @param {Object} data - Plain object data
   * @returns {Markup} - New Markup instance
   */
  static fromObject(data) {
    return new Markup(data);
  }
}

module.exports = Markup;
