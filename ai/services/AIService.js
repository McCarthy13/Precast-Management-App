/**
 * Core AI Services
 * Provides centralized AI capabilities for all modules
 */

/**
 * Main AI Service class that provides core AI functionality
 * to be used across all modules in the application
 */
export class AIService {
  constructor() {
    this.modelRegistry = {};
    this.telemetryEnabled = true;
  }

  /**
   * Process natural language text for analysis
   * @param {String} text - Text to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeText(text, options = {}) {
    try {
      const response = await fetch('/api/ai/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing text:', error);
      this.logTelemetry('text-analysis-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate text based on a prompt
   * @param {String} prompt - Input prompt
   * @param {Object} options - Generation options
   * @returns {Promise<String>} Generated text
   */
  async generateText(prompt, options = {}) {
    try {
      const response = await fetch('/api/ai/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate text');
      }
      
      const data = await response.json();
      return data.generatedText;
    } catch (error) {
      console.error('Error generating text:', error);
      this.logTelemetry('text-generation-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Analyze an image for content, defects, etc.
   * @param {File|String} image - Image file or URL
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeImage(image, options = {}) {
    try {
      const formData = new FormData();
      
      if (typeof image === 'string') {
        formData.append('imageUrl', image);
      } else {
        formData.append('image', image);
      }
      
      formData.append('options', JSON.stringify(options));
      
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing image:', error);
      this.logTelemetry('image-analysis-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Get personalized recommendations
   * @param {String} userId - User ID
   * @param {String} context - Context for recommendations
   * @param {Object} options - Recommendation options
   * @returns {Promise<Array>} List of recommendations
   */
  async getRecommendations(userId, context, options = {}) {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, context, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const data = await response.json();
      return data.recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      this.logTelemetry('recommendations-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Predict values based on historical data
   * @param {Array} historicalData - Historical data points
   * @param {Object} parameters - Prediction parameters
   * @returns {Promise<Object>} Prediction results
   */
  async predict(historicalData, parameters = {}) {
    try {
      const response = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ historicalData, parameters }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to make prediction');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error making prediction:', error);
      this.logTelemetry('prediction-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Detect anomalies in data
   * @param {Array} data - Data points to analyze
   * @param {Object} options - Detection options
   * @returns {Promise<Array>} Detected anomalies
   */
  async detectAnomalies(data, options = {}) {
    try {
      const response = await fetch('/api/ai/anomalies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect anomalies');
      }
      
      const result = await response.json();
      return result.anomalies;
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      this.logTelemetry('anomaly-detection-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Optimize a process or resource allocation
   * @param {Object} constraints - Optimization constraints
   * @param {Object} objectives - Optimization objectives
   * @param {Object} options - Optimization options
   * @returns {Promise<Object>} Optimization results
   */
  async optimize(constraints, objectives, options = {}) {
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ constraints, objectives, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to perform optimization');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error performing optimization:', error);
      this.logTelemetry('optimization-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract structured data from unstructured content
   * @param {String} content - Unstructured content
   * @param {Object} schema - Expected data schema
   * @returns {Promise<Object>} Extracted structured data
   */
  async extractData(content, schema = {}) {
    try {
      const response = await fetch('/api/ai/extract-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, schema }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error extracting data:', error);
      this.logTelemetry('data-extraction-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Classify content into categories
   * @param {String} content - Content to classify
   * @param {Array} categories - Available categories
   * @returns {Promise<Object>} Classification results
   */
  async classify(content, categories = []) {
    try {
      const response = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, categories }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to classify content');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error classifying content:', error);
      this.logTelemetry('classification-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Perform sentiment analysis on text
   * @param {String} text - Text to analyze
   * @returns {Promise<Object>} Sentiment analysis results
   */
  async analyzeSentiment(text) {
    try {
      const response = await fetch('/api/ai/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      this.logTelemetry('sentiment-analysis-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Summarize long text content
   * @param {String} text - Text to summarize
   * @param {Object} options - Summarization options
   * @returns {Promise<String>} Summarized text
   */
  async summarize(text, options = {}) {
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to summarize text');
      }
      
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Error summarizing text:', error);
      this.logTelemetry('summarization-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Log telemetry data for AI operations
   * @param {String} eventType - Type of event
   * @param {Object} data - Event data
   * @private
   */
  logTelemetry(eventType, data = {}) {
    if (!this.telemetryEnabled) return;
    
    try {
      fetch('/api/ai/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          timestamp: new Date().toISOString(),
          data
        }),
      }).catch(error => {
        console.error('Error logging telemetry:', error);
      });
    } catch (error) {
      console.error('Error logging telemetry:', error);
    }
  }
}

// Module-specific AI service implementations

/**
 * AI service for Contact Management module
 */
export class ContactAIService extends AIService {
  /**
   * Prioritize contacts based on engagement history
   * @param {Array} contacts - List of contacts
   * @returns {Promise<Array>} Prioritized contacts
   */
  async prioritizeContacts(contacts) {
    try {
      const response = await fetch('/api/ai/contacts/prioritize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to prioritize contacts');
      }
      
      const data = await response.json();
      return data.prioritizedContacts;
    } catch (error) {
      console.error('Error prioritizing contacts:', error);
      this.logTelemetry('contact-prioritization-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate follow-up recommendations
   * @param {Object} contact - Contact data
   * @param {Array} interactions - Previous interactions
   * @returns {Promise<Array>} Follow-up recommendations
   */
  async getFollowUpRecommendations(contact, interactions) {
    try {
      const response = await fetch('/api/ai/contacts/follow-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact, interactions }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get follow-up recommendations');
      }
      
      const data = await response.json();
      return data.recommendations;
    } catch (error) {
      console.error('Error getting follow-up recommendations:', error);
      this.logTelemetry('follow-up-recommendations-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract action items from meeting notes
   * @param {String} notes - Meeting notes
   * @returns {Promise<Array>} Extracted action items
   */
  async extractActionItems(notes) {
    try {
      const response = await fetch('/api/ai/contacts/extract-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract action items');
      }
      
      const data = await response.json();
      return data.actionItems;
    } catch (error) {
      console.error('Error extracting action items:', error);
      this.logTelemetry('action-item-extraction-error', { error: error.message });
      throw error;
    }
  }
}

/**
 * AI service for Estimating and Quoting module
 */
export class EstimatingAIService extends AIService {
  /**
   * Generate cost estimate based on project parameters
   * @param {Object} project - Project data
   * @param {Array} historicalProjects - Similar historical projects
   * @returns {Promise<Object>} Cost estimate
   */
  async generateCostEstimate(project, historicalProjects) {
    try {
      const response = await fetch('/api/ai/estimating/cost-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project, historicalProjects }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate cost estimate');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating cost estimate:', error);
      this.logTelemetry('cost-estimate-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Predict win probability for a quote
   * @param {Object} quote - Quote data
   * @param {Object} customer - Customer data
   * @param {Array} historicalQuotes - Historical quotes
   * @returns {Promise<Object>} Win probability prediction
   */
  async predictWinProbability(quote, customer, historicalQuotes) {
    try {
      const response = await fetch('/api/ai/estimating/win-probability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote, customer, historicalQuotes }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to predict win probability');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error predicting win probability:', error);
      this.logTelemetry('win-probability-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Optimize material usage for a project
   * @param {Object} project - Project data
   * @param {Array} materials - Available materials
   * @returns {Promise<Object>} Optimized material plan
   */
  async optimizeMaterials(project, materials) {
    try {
      const response = await fetch('/api/ai/estimating/optimize-materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project, materials }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize materials');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error optimizing materials:', error);
      this.logTelemetry('material-optimization-error', { error: error.message });
      throw error;
    }
  }
}

/**
 * AI service for Safety module
 */
export class SafetyAIService extends AIService {
  /**
   * Predict potential hazards for a job
   * @param {Object} job - Job data
   * @param {Object} conditions - Current conditions
   * @returns {Promise<Array>} Predicted hazards
   */
  async predictHazards(job, conditions) {
    try {
      const response = await fetch('/api/ai/safety/predict-hazards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job, conditions }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to predict hazards');
      }
      
      const data = await response.json();
      return data.hazards;
    } catch (error) {
      console.error('Error predicting hazards:', error);
      this.logTelemetry('hazard-prediction-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate JSA recommendations
   * @param {Object} task - Task data
   * @param {Array} similarJSAs - Similar JSAs
   * @returns {Promise<Object>} JSA recommendations
   */
  async generateJSARecommendations(task, similarJSAs) {
    try {
      const response = await fetch('/api/ai/safety/jsa-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, similarJSAs }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate JSA recommendations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating JSA recommendations:', error);
      this.logTelemetry('jsa-recommendations-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Analyze incident patterns
   * @param {Array} incidents - Historical incidents
   * @returns {Promise<Object>} Pattern analysis
   */
  async analyzeIncidentPatterns(incidents) {
    try {
      const response = await fetch('/api/ai/safety/incident-patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incidents }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze incident patterns');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing incident patterns:', error);
      this.logTelemetry('incident-pattern-analysis-error', { error: error.message });
      throw error;
    }
  }
}

/**
 * AI service for Metrics & Analytics module
 */
export class MetricsAIService extends AIService {
  /**
   * Generate insights from metrics data
   * @param {Array} metrics - Metrics data
   * @returns {Promise<Array>} Generated insights
   */
  async generateInsights(metrics) {
    try {
      const response = await fetch('/api/ai/metrics/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const data = await response.json();
      return data.insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      this.logTelemetry('insight-generation-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Process natural language query for business data
   * @param {String} query - Natural language query
   * @param {Object} context - Query context
   * @returns {Promise<Object>} Query results
   */
  async processNaturalLanguageQuery(query, context = {}) {
    try {
      const response = await fetch('/api/ai/metrics/nlq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, context }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process natural language query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error processing natural language query:', error);
      this.logTelemetry('nlq-processing-error', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate narrative report from data
   * @param {Array} data - Report data
   * @param {Object} options - Report options
   * @returns {Promise<String>} Generated narrative
   */
  async generateNarrativeReport(data, options = {}) {
    try {
      const response = await fetch('/api/ai/metrics/narrative-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, options }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate narrative report');
      }
      
      const result = await response.json();
      return result.narrative;
    } catch (error) {
      console.error('Error generating narrative report:', error);
      this.logTelemetry('narrative-report-error', { error: error.message });
      throw error;
    }
  }
}

// Export singleton instances for each service
export const aiService = new AIService();
export const contactAIService = new ContactAIService();
export const estimatingAIService = new EstimatingAIService();
export const safetyAIService = new SafetyAIService();
export const metricsAIService = new MetricsAIService();
