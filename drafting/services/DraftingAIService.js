/**
 * Drafting/Engineering AI Service
 * Provides AI capabilities specific to the Drafting/Engineering module
 */

import { AIService } from '../../ai/services/AIService';

/**
 * AI service for Drafting/Engineering module
 */
export class DraftingAIService extends AIService {
  /**
   * Extract elements from drawing
   * @param {File|String} drawing - Drawing file or URL
   * @returns {Promise<Array>} Extracted elements
   */
  async extractElementsFromDrawing(drawing) {
    try {
      const formData = new FormData();
      
      if (typeof drawing === 'string') {
        formData.append('drawingUrl', drawing);
      } else {
        formData.append('drawing', drawing);
      }
      
      const response = await fetch('/api/ai/drafting/extract-elements', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract elements from drawing');
      }
      
      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error extracting elements from drawing:', error);
      this.logTelemetry('element-extraction-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate drawing revision description
   * @param {Object} currentDrawing - Current drawing data
   * @param {Object} previousDrawing - Previous drawing data
   * @returns {Promise<Object>} Generated revision description
   */
  async generateRevisionDescription(currentDrawing, previousDrawing) {
    try {
      const response = await fetch('/api/ai/drafting/revision-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentDrawing, previousDrawing }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate revision description');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating revision description:', error);
      this.logTelemetry('revision-description-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Detect conflicts between drawings
   * @param {Array} drawings - List of drawings to check
   * @returns {Promise<Array>} Detected conflicts
   */
  async detectDrawingConflicts(drawings) {
    try {
      const response = await fetch('/api/ai/drafting/detect-conflicts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drawings }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect drawing conflicts');
      }
      
      const data = await response.json();
      return data.conflicts;
    } catch (error) {
      console.error('Error detecting drawing conflicts:', error);
      this.logTelemetry('conflict-detection-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate drawing from specifications
   * @param {Object} specifications - Drawing specifications
   * @returns {Promise<Object>} Generated drawing data
   */
  async generateDrawingFromSpecifications(specifications) {
    try {
      const response = await fetch('/api/ai/drafting/generate-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specifications }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate drawing from specifications');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating drawing from specifications:', error);
      this.logTelemetry('drawing-generation-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Analyze drawing quality
   * @param {File|String} drawing - Drawing file or URL
   * @returns {Promise<Object>} Quality analysis results
   */
  async analyzeDrawingQuality(drawing) {
    try {
      const formData = new FormData();
      
      if (typeof drawing === 'string') {
        formData.append('drawingUrl', drawing);
      } else {
        formData.append('drawing', drawing);
      }
      
      const response = await fetch('/api/ai/drafting/analyze-quality', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze drawing quality');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing drawing quality:', error);
      this.logTelemetry('quality-analysis-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Suggest drawing improvements
   * @param {File|String} drawing - Drawing file or URL
   * @returns {Promise<Array>} Suggested improvements
   */
  async suggestDrawingImprovements(drawing) {
    try {
      const formData = new FormData();
      
      if (typeof drawing === 'string') {
        formData.append('drawingUrl', drawing);
      } else {
        formData.append('drawing', drawing);
      }
      
      const response = await fetch('/api/ai/drafting/suggest-improvements', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to suggest drawing improvements');
      }
      
      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error('Error suggesting drawing improvements:', error);
      this.logTelemetry('improvement-suggestion-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract text from drawing
   * @param {File|String} drawing - Drawing file or URL
   * @returns {Promise<Object>} Extracted text
   */
  async extractTextFromDrawing(drawing) {
    try {
      const formData = new FormData();
      
      if (typeof drawing === 'string') {
        formData.append('drawingUrl', drawing);
      } else {
        formData.append('drawing', drawing);
      }
      
      const response = await fetch('/api/ai/drafting/extract-text', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract text from drawing');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error extracting text from drawing:', error);
      this.logTelemetry('text-extraction-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate drawing annotations
   * @param {File|String} drawing - Drawing file or URL
   * @param {Object} context - Context information
   * @returns {Promise<Array>} Generated annotations
   */
  async generateDrawingAnnotations(drawing, context = {}) {
    try {
      const formData = new FormData();
      
      if (typeof drawing === 'string') {
        formData.append('drawingUrl', drawing);
      } else {
        formData.append('drawing', drawing);
      }
      
      formData.append('context', JSON.stringify(context));
      
      const response = await fetch('/api/ai/drafting/generate-annotations', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate drawing annotations');
      }
      
      const data = await response.json();
      return data.annotations;
    } catch (error) {
      console.error('Error generating drawing annotations:', error);
      this.logTelemetry('annotation-generation-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Convert drawing format
   * @param {File} drawing - Drawing file
   * @param {String} targetFormat - Target format (e.g., 'DWG', 'PDF', 'DXF')
   * @returns {Promise<Object>} Conversion result with file URL
   */
  async convertDrawingFormat(drawing, targetFormat) {
    try {
      const formData = new FormData();
      formData.append('drawing', drawing);
      formData.append('targetFormat', targetFormat);
      
      const response = await fetch('/api/ai/drafting/convert-format', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to convert drawing format');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error converting drawing format:', error);
      this.logTelemetry('format-conversion-error', { error: error.message });
      throw error;
    }
  }
}

// Export singleton instance
export const draftingAIService = new DraftingAIService();
