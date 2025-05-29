/**
 * Contact Model
 * Represents a contact in the CRM module
 * 
 * This model handles all contact-related data including:
 * - Personal information
 * - Company information
 * - Contact history
 * - Relationship management
 */

class ContactModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.company = data.company || '';
    this.position = data.position || '';
    this.address = data.address || '';
    this.city = data.city || '';
    this.state = data.state || '';
    this.zip = data.zip || '';
    this.country = data.country || '';
    this.type = data.type || 'client'; // client, vendor, partner, etc.
    this.status = data.status || 'active';
    this.notes = data.notes || '';
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastContactedAt = data.lastContactedAt || null;
    this.assignedTo = data.assignedTo || null;
    this.customFields = data.customFields || {};
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get formattedAddress() {
    const parts = [
      this.address,
      this.city,
      this.state,
      this.zip,
      this.country
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      company: this.company,
      position: this.position,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
      type: this.type,
      status: this.status,
      notes: this.notes,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastContactedAt: this.lastContactedAt,
      assignedTo: this.assignedTo,
      customFields: this.customFields
    };
  }

  static fromJSON(json) {
    return new ContactModel(json);
  }

  static getValidTypes() {
    return ['client', 'vendor', 'partner', 'lead', 'prospect', 'other'];
  }

  static getValidStatuses() {
    return ['active', 'inactive', 'archived'];
  }
}

export default ContactModel;
