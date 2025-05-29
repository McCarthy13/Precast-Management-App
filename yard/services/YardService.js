/**
 * Yard Management Module Services
 * Provides API and data handling for the Yard Management module
 */

import { 
  PieceModel,
  YardLocationModel,
  MovementLogModel,
  StorageAreaModel,
  SpecialHandlingModel,
  YardMapModel
} from '../models/YardModel';

/**
 * Service for managing yard inventory and operations
 */
export class YardService {
  /**
   * Get all pieces in the yard
   * @param {Object} filters - Optional filters
   * @param {String} filters.status - Filter by piece status
   * @param {String} filters.location - Filter by location
   * @param {String} filters.projectId - Filter by project ID
   * @returns {Promise<Array>} List of pieces
   */
  async getPieces(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.projectId) queryParams.append('projectId', filters.projectId);
      
      const response = await fetch(`/api/yard/pieces?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch yard pieces');
      }
      
      const data = await response.json();
      return data.map(item => new PieceModel(item));
    } catch (error) {
      console.error('Error fetching yard pieces:', error);
      throw error;
    }
  }
  
  /**
   * Get a single piece by ID
   * @param {String} id - Piece ID
   * @returns {Promise<PieceModel>} Piece
   */
  async getPiece(id) {
    try {
      const response = await fetch(`/api/yard/pieces/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch piece with ID ${id}`);
      }
      
      const data = await response.json();
      return new PieceModel(data);
    } catch (error) {
      console.error(`Error fetching piece ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Update piece location and status
   * @param {String} id - Piece ID
   * @param {Object} updates - Updates to apply
   * @param {String} updates.location - New location
   * @param {String} updates.status - New status
   * @param {Object} updates.coordinates - New coordinates
   * @returns {Promise<PieceModel>} Updated piece
   */
  async updatePieceLocation(id, updates) {
    try {
      const response = await fetch(`/api/yard/pieces/${id}/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update location for piece ${id}`);
      }
      
      const data = await response.json();
      return new PieceModel(data);
    } catch (error) {
      console.error(`Error updating location for piece ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Log a piece movement
   * @param {Object} movement - Movement data
   * @param {String} movement.pieceId - Piece ID
   * @param {String} movement.fromLocation - Source location
   * @param {String} movement.toLocation - Destination location
   * @param {String} movement.type - Movement type (inbound, outbound, relocation)
   * @param {String} movement.performedBy - User ID who performed the movement
   * @returns {Promise<MovementLogModel>} Created movement log
   */
  async logMovement(movement) {
    try {
      const response = await fetch('/api/yard/movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movement),
      });
      
      if (!response.ok) {
        throw new Error('Failed to log piece movement');
      }
      
      const data = await response.json();
      return new MovementLogModel(data);
    } catch (error) {
      console.error('Error logging piece movement:', error);
      throw error;
    }
  }
  
  /**
   * Get movement history for a piece
   * @param {String} pieceId - Piece ID
   * @returns {Promise<Array>} Movement history
   */
  async getMovementHistory(pieceId) {
    try {
      const response = await fetch(`/api/yard/pieces/${pieceId}/movements`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch movement history for piece ${pieceId}`);
      }
      
      const data = await response.json();
      return data.map(item => new MovementLogModel(item));
    } catch (error) {
      console.error(`Error fetching movement history for piece ${pieceId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get yard map with piece locations
   * @returns {Promise<YardMapModel>} Yard map
   */
  async getYardMap() {
    try {
      const response = await fetch('/api/yard/map');
      
      if (!response.ok) {
        throw new Error('Failed to fetch yard map');
      }
      
      const data = await response.json();
      return new YardMapModel(data);
    } catch (error) {
      console.error('Error fetching yard map:', error);
      throw error;
    }
  }
  
  /**
   * Get all storage areas
   * @returns {Promise<Array>} List of storage areas
   */
  async getStorageAreas() {
    try {
      const response = await fetch('/api/yard/storage-areas');
      
      if (!response.ok) {
        throw new Error('Failed to fetch storage areas');
      }
      
      const data = await response.json();
      return data.map(item => new StorageAreaModel(item));
    } catch (error) {
      console.error('Error fetching storage areas:', error);
      throw error;
    }
  }
  
  /**
   * Create a new storage area
   * @param {StorageAreaModel} storageArea - Storage area data
   * @returns {Promise<StorageAreaModel>} Created storage area
   */
  async createStorageArea(storageArea) {
    try {
      const response = await fetch('/api/yard/storage-areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storageArea),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create storage area');
      }
      
      const data = await response.json();
      return new StorageAreaModel(data);
    } catch (error) {
      console.error('Error creating storage area:', error);
      throw error;
    }
  }
  
  /**
   * Report an issue with a piece
   * @param {String} pieceId - Piece ID
   * @param {Object} issue - Issue data
   * @param {String} issue.type - Issue type (damage, missing, etc.)
   * @param {String} issue.description - Issue description
   * @param {String} issue.reportedBy - User ID who reported the issue
   * @param {Array} issue.photos - Photo URLs
   * @returns {Promise<Object>} Created issue
   */
  async reportIssue(pieceId, issue) {
    try {
      const response = await fetch(`/api/yard/pieces/${pieceId}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issue),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to report issue for piece ${pieceId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error reporting issue for piece ${pieceId}:`, error);
      throw error;
    }
  }
  
  /**
   * Mark a piece as ready for shipping
   * @param {String} pieceId - Piece ID
   * @param {Object} shippingData - Shipping data
   * @param {String} shippingData.scheduledDate - Scheduled shipping date
   * @param {String} shippingData.destination - Destination
   * @param {String} shippingData.approvedBy - User ID who approved shipping
   * @returns {Promise<PieceModel>} Updated piece
   */
  async markPieceReadyForShipping(pieceId, shippingData) {
    try {
      const response = await fetch(`/api/yard/pieces/${pieceId}/ready-for-shipping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark piece ${pieceId} as ready for shipping`);
      }
      
      const data = await response.json();
      return new PieceModel(data);
    } catch (error) {
      console.error(`Error marking piece ${pieceId} as ready for shipping:`, error);
      throw error;
    }
  }
  
  /**
   * Get pieces ready for shipping
   * @param {Object} filters - Optional filters
   * @param {String} filters.projectId - Filter by project ID
   * @param {String} filters.scheduledDate - Filter by scheduled shipping date
   * @returns {Promise<Array>} List of pieces ready for shipping
   */
  async getPiecesReadyForShipping(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.projectId) queryParams.append('projectId', filters.projectId);
      if (filters.scheduledDate) queryParams.append('scheduledDate', filters.scheduledDate);
      
      const response = await fetch(`/api/yard/pieces/ready-for-shipping?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pieces ready for shipping');
      }
      
      const data = await response.json();
      return data.map(item => new PieceModel(item));
    } catch (error) {
      console.error('Error fetching pieces ready for shipping:', error);
      throw error;
    }
  }
  
  /**
   * Upload photos for a piece
   * @param {String} pieceId - Piece ID
   * @param {Array} files - Photo files
   * @returns {Promise<Object>} Upload result with photo URLs
   */
  async uploadPiecePhotos(pieceId, files) {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`photo${index}`, file);
      });
      
      const response = await fetch(`/api/yard/pieces/${pieceId}/photos`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload photos for piece ${pieceId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error uploading photos for piece ${pieceId}:`, error);
      throw error;
    }
  }
  
  /**
   * Scan piece barcode/QR code
   * @param {String} code - Barcode/QR code
   * @returns {Promise<PieceModel>} Piece
   */
  async scanPieceCode(code) {
    try {
      const response = await fetch(`/api/yard/scan/${code}`);
      
      if (!response.ok) {
        throw new Error(`Failed to scan piece code ${code}`);
      }
      
      const data = await response.json();
      return new PieceModel(data);
    } catch (error) {
      console.error(`Error scanning piece code ${code}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const yardService = new YardService();
