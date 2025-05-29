/**
 * AI Integration for Yard Management
 * Provides AI-powered features for the Yard Management module
 */

import { yardService } from './YardService';

/**
 * Service for AI-powered yard management features
 */
export class YardAIService {
  /**
   * Generate optimal storage recommendations for a piece
   * @param {String} pieceId - Piece ID
   * @returns {Promise<Object>} Storage recommendations
   */
  async getOptimalStorageRecommendation(pieceId) {
    try {
      const response = await fetch(`/api/yard/ai/storage-recommendation/${pieceId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get storage recommendation for piece ${pieceId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error getting storage recommendation for piece ${pieceId}:`, error);
      throw error;
    }
  }
  
  /**
   * Predict optimal yard layout based on current and upcoming production
   * @param {Object} params - Parameters for prediction
   * @param {Number} params.daysAhead - Number of days to look ahead
   * @param {Array} params.priorityProjects - Priority project IDs
   * @returns {Promise<Object>} Yard layout prediction
   */
  async predictOptimalYardLayout(params = {}) {
    try {
      const response = await fetch('/api/yard/ai/optimal-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Failed to predict optimal yard layout');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error predicting optimal yard layout:', error);
      throw error;
    }
  }
  
  /**
   * Detect anomalies in yard operations
   * @param {Object} params - Parameters for anomaly detection
   * @param {String} params.timeframe - Timeframe for analysis (day, week, month)
   * @returns {Promise<Array>} Detected anomalies
   */
  async detectAnomalies(params = {}) {
    try {
      const response = await fetch('/api/yard/ai/anomalies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect yard anomalies');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error detecting yard anomalies:', error);
      throw error;
    }
  }
  
  /**
   * Analyze piece movement patterns
   * @param {Object} params - Parameters for analysis
   * @param {String} params.timeframe - Timeframe for analysis (day, week, month)
   * @param {Array} params.pieceTypes - Types of pieces to analyze
   * @returns {Promise<Object>} Movement pattern analysis
   */
  async analyzeMovementPatterns(params = {}) {
    try {
      const response = await fetch('/api/yard/ai/movement-patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze movement patterns');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing movement patterns:', error);
      throw error;
    }
  }
  
  /**
   * Predict piece readiness for shipping
   * @param {String} pieceId - Piece ID
   * @returns {Promise<Object>} Readiness prediction
   */
  async predictPieceReadiness(pieceId) {
    try {
      const response = await fetch(`/api/yard/ai/piece-readiness/${pieceId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to predict readiness for piece ${pieceId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error predicting readiness for piece ${pieceId}:`, error);
      throw error;
    }
  }
  
  /**
   * Generate yard optimization recommendations
   * @returns {Promise<Object>} Optimization recommendations
   */
  async getYardOptimizationRecommendations() {
    try {
      const response = await fetch('/api/yard/ai/optimization-recommendations', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to get yard optimization recommendations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting yard optimization recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Analyze image for piece identification
   * @param {File} image - Image file
   * @returns {Promise<Object>} Piece identification results
   */
  async identifyPieceFromImage(image) {
    try {
      const formData = new FormData();
      formData.append('image', image);
      
      const response = await fetch('/api/yard/ai/identify-piece', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to identify piece from image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error identifying piece from image:', error);
      throw error;
    }
  }
  
  /**
   * Predict future yard capacity needs
   * @param {Object} params - Parameters for prediction
   * @param {Number} params.daysAhead - Number of days to look ahead
   * @returns {Promise<Object>} Capacity prediction
   */
  async predictFutureCapacityNeeds(params = {}) {
    try {
      const response = await fetch('/api/yard/ai/capacity-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Failed to predict future capacity needs');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error predicting future capacity needs:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const yardAIService = new YardAIService();
