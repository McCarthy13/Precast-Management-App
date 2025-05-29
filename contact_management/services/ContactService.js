/**
 * ContactService
 * Service for managing contacts in the CRM module
 * 
 * This service provides methods for:
 * - CRUD operations on contacts
 * - Searching and filtering contacts
 * - Contact history tracking
 * - Relationship management
 * - Import/export functionality
 */

import ContactModel from '../models/ContactModel';

class ContactService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/api/crm/contacts';
  }

  /**
   * Get all contacts with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Array<ContactModel>>}
   */
  async getContacts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await this.apiClient.get(`${this.endpoint}${query}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch contacts');
      }

      return response.data.map(contact => ContactModel.fromJSON(contact));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  /**
   * Get a contact by ID
   * @param {string} id - Contact ID
   * @returns {Promise<ContactModel>}
   */
  async getContactById(id) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch contact');
      }

      return ContactModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new contact
   * @param {ContactModel} contact - Contact data
   * @returns {Promise<ContactModel>}
   */
  async createContact(contact) {
    try {
      const response = await this.apiClient.post(this.endpoint, contact.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create contact');
      }

      return ContactModel.fromJSON(response.data);
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  /**
   * Update an existing contact
   * @param {string} id - Contact ID
   * @param {ContactModel} contact - Updated contact data
   * @returns {Promise<ContactModel>}
   */
  async updateContact(id, contact) {
    try {
      const response = await this.apiClient.put(`${this.endpoint}/${id}`, contact.toJSON());
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update contact');
      }

      return ContactModel.fromJSON(response.data);
    } catch (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a contact
   * @param {string} id - Contact ID
   * @returns {Promise<boolean>}
   */
  async deleteContact(id) {
    try {
      const response = await this.apiClient.delete(`${this.endpoint}/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete contact');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search contacts by query
   * @param {string} query - Search query
   * @returns {Promise<Array<ContactModel>>}
   */
  async searchContacts(query) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/search?q=${encodeURIComponent(query)}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to search contacts');
      }

      return response.data.map(contact => ContactModel.fromJSON(contact));
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }
  }

  /**
   * Import contacts from CSV
   * @param {File} file - CSV file
   * @returns {Promise<{total: number, imported: number, errors: Array}>}
   */
  async importContacts(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.apiClient.post(`${this.endpoint}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to import contacts');
      }

      return response.data;
    } catch (error) {
      console.error('Error importing contacts:', error);
      throw error;
    }
  }

  /**
   * Export contacts to CSV
   * @param {Object} filters - Optional filters to apply
   * @returns {Promise<Blob>}
   */
  async exportContacts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await this.apiClient.get(`${this.endpoint}/export${query}`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      console.error('Error exporting contacts:', error);
      throw error;
    }
  }

  /**
   * Add a contact interaction/history entry
   * @param {string} contactId - Contact ID
   * @param {Object} interaction - Interaction data
   * @returns {Promise<Object>}
   */
  async addContactInteraction(contactId, interaction) {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${contactId}/interactions`, interaction);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add contact interaction');
      }

      return response.data;
    } catch (error) {
      console.error(`Error adding interaction for contact with ID ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Get contact interactions/history
   * @param {string} contactId - Contact ID
   * @returns {Promise<Array>}
   */
  async getContactInteractions(contactId) {
    try {
      const response = await this.apiClient.get(`${this.endpoint}/${contactId}/interactions`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch contact interactions');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching interactions for contact with ID ${contactId}:`, error);
      throw error;
    }
  }
}

export default ContactService;
