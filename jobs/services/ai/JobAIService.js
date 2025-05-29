/**
 * Jobs AI Services
 * Provides AI-powered features for the Jobs module
 */

import { AIService } from '../../../ai/services/AIService';

export class JobAIService {
  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Schedule Optimization
   * Analyzes job data and optimizes schedules based on resource availability, dependencies, and priorities
   */
  async optimizeSchedule(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'SCHEDULE_OPTIMIZATION'
      };

      const result = await this.aiService.getOptimizationPlan(payload);
      return {
        optimizedSchedule: result.optimizedSchedule,
        resourceAllocation: result.resourceAllocation,
        criticalPath: result.criticalPath,
        bottlenecks: result.bottlenecks,
        riskAssessment: result.riskAssessment
      };
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      throw new Error('Failed to optimize schedule');
    }
  }

  /**
   * Resource Allocation
   * Recommends optimal resource allocation based on job requirements and resource availability
   */
  async recommendResourceAllocation(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'RESOURCE_ALLOCATION'
      };

      const result = await this.aiService.getRecommendations(payload);
      return {
        recommendedResources: result.recommendedResources,
        utilizationPlan: result.utilizationPlan,
        skillMatching: result.skillMatching,
        loadBalancing: result.loadBalancing,
        alternativeOptions: result.alternativeOptions
      };
    } catch (error) {
      console.error('Error recommending resource allocation:', error);
      throw new Error('Failed to recommend resource allocation');
    }
  }

  /**
   * Risk Prediction
   * Predicts potential risks based on job characteristics and historical data
   */
  async predictRisks(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'RISK_PREDICTION'
      };

      const result = await this.aiService.getPrediction(payload);
      return {
        predictedRisks: result.predictedRisks,
        riskProbabilities: result.riskProbabilities,
        impactAssessment: result.impactAssessment,
        mitigationStrategies: result.mitigationStrategies,
        similarJobComparison: result.similarJobComparison
      };
    } catch (error) {
      console.error('Error predicting risks:', error);
      throw new Error('Failed to predict risks');
    }
  }

  /**
   * Budget Forecasting
   * Predicts budget performance based on job progress and historical data
   */
  async forecastBudget(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'BUDGET_FORECASTING'
      };

      const result = await this.aiService.getPrediction(payload);
      return {
        forecastedCosts: result.forecastedCosts,
        varianceAnalysis: result.varianceAnalysis,
        costTrends: result.costTrends,
        savingsOpportunities: result.savingsOpportunities,
        budgetRisks: result.budgetRisks
      };
    } catch (error) {
      console.error('Error forecasting budget:', error);
      throw new Error('Failed to forecast budget');
    }
  }

  /**
   * Delivery Optimization
   * Optimizes delivery schedules based on production status, logistics, and site readiness
   */
  async optimizeDelivery(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'DELIVERY_OPTIMIZATION'
      };

      const result = await this.aiService.getOptimizationPlan(payload);
      return {
        optimizedDeliverySchedule: result.optimizedDeliverySchedule,
        loadingSequence: result.loadingSequence,
        transportationPlan: result.transportationPlan,
        siteReadinessAssessment: result.siteReadinessAssessment,
        weatherConsiderations: result.weatherConsiderations
      };
    } catch (error) {
      console.error('Error optimizing delivery:', error);
      throw new Error('Failed to optimize delivery');
    }
  }

  /**
   * Installation Sequence Optimization
   * Recommends optimal installation sequence based on piece characteristics and site conditions
   */
  async optimizeInstallationSequence(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'INSTALLATION_SEQUENCE_OPTIMIZATION'
      };

      const result = await this.aiService.getOptimizationPlan(payload);
      return {
        optimizedSequence: result.optimizedSequence,
        cranePositioning: result.cranePositioning,
        accessConsiderations: result.accessConsiderations,
        safetyPlan: result.safetyPlan,
        contingencyOptions: result.contingencyOptions
      };
    } catch (error) {
      console.error('Error optimizing installation sequence:', error);
      throw new Error('Failed to optimize installation sequence');
    }
  }

  /**
   * Similar Job Analysis
   * Identifies similar past jobs and extracts relevant insights
   */
  async analyzeSimilarJobs(jobData) {
    try {
      const payload = {
        jobData,
        modelType: 'SIMILAR_JOB_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        similarJobs: result.similarJobs,
        keyInsights: result.keyInsights,
        lessonsLearned: result.lessonsLearned,
        performanceComparison: result.performanceComparison,
        recommendedPractices: result.recommendedPractices
      };
    } catch (error) {
      console.error('Error analyzing similar jobs:', error);
      throw new Error('Failed to analyze similar jobs');
    }
  }

  /**
   * Issue Resolution Recommendation
   * Recommends resolution strategies for job issues based on historical data
   */
  async recommendIssueResolution(issueId) {
    try {
      const payload = {
        issueId,
        modelType: 'ISSUE_RESOLUTION_RECOMMENDATION'
      };

      const result = await this.aiService.getRecommendations(payload);
      return {
        recommendedActions: result.recommendedActions,
        rootCauseAnalysis: result.rootCauseAnalysis,
        similarIssues: result.similarIssues,
        preventativeMeasures: result.preventativeMeasures,
        stakeholderCommunication: result.stakeholderCommunication
      };
    } catch (error) {
      console.error('Error recommending issue resolution:', error);
      throw new Error('Failed to recommend issue resolution');
    }
  }

  /**
   * Change Order Impact Analysis
   * Analyzes the impact of change orders on schedule, budget, and resources
   */
  async analyzeChangeOrderImpact(changeOrderId) {
    try {
      const payload = {
        changeOrderId,
        modelType: 'CHANGE_ORDER_IMPACT_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        scheduleImpact: result.scheduleImpact,
        budgetImpact: result.budgetImpact,
        resourceImpact: result.resourceImpact,
        downstreamEffects: result.downstreamEffects,
        mitigationOptions: result.mitigationOptions
      };
    } catch (error) {
      console.error('Error analyzing change order impact:', error);
      throw new Error('Failed to analyze change order impact');
    }
  }

  /**
   * Quality Prediction
   * Predicts potential quality issues based on job characteristics and historical data
   */
  async predictQualityIssues(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'QUALITY_PREDICTION'
      };

      const result = await this.aiService.getPrediction(payload);
      return {
        predictedIssues: result.predictedIssues,
        riskAreas: result.riskAreas,
        qualityCheckpoints: result.qualityCheckpoints,
        preventativeMeasures: result.preventativeMeasures,
        inspectionRecommendations: result.inspectionRecommendations
      };
    } catch (error) {
      console.error('Error predicting quality issues:', error);
      throw new Error('Failed to predict quality issues');
    }
  }

  /**
   * Weather Impact Analysis
   * Analyzes potential weather impacts on job schedule and recommends mitigation strategies
   */
  async analyzeWeatherImpact(jobId, dateRange) {
    try {
      const payload = {
        jobId,
        dateRange,
        modelType: 'WEATHER_IMPACT_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        weatherForecast: result.weatherForecast,
        potentialImpacts: result.potentialImpacts,
        riskPeriods: result.riskPeriods,
        mitigationStrategies: result.mitigationStrategies,
        scheduleAdjustments: result.scheduleAdjustments
      };
    } catch (error) {
      console.error('Error analyzing weather impact:', error);
      throw new Error('Failed to analyze weather impact');
    }
  }

  /**
   * Document Analysis
   * Extracts key information from job documents and provides insights
   */
  async analyzeDocuments(documentIds) {
    try {
      const payload = {
        documentIds,
        modelType: 'DOCUMENT_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        extractedInformation: result.extractedInformation,
        keyInsights: result.keyInsights,
        inconsistencies: result.inconsistencies,
        missingInformation: result.missingInformation,
        recommendedActions: result.recommendedActions
      };
    } catch (error) {
      console.error('Error analyzing documents:', error);
      throw new Error('Failed to analyze documents');
    }
  }

  /**
   * Drawing Analysis
   * Analyzes job drawings to identify potential issues and extract key information
   */
  async analyzeDrawings(drawingIds) {
    try {
      const payload = {
        drawingIds,
        modelType: 'DRAWING_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        extractedElements: result.extractedElements,
        potentialIssues: result.potentialIssues,
        dimensionalAnalysis: result.dimensionalAnalysis,
        constructabilityAssessment: result.constructabilityAssessment,
        recommendedRevisions: result.recommendedRevisions
      };
    } catch (error) {
      console.error('Error analyzing drawings:', error);
      throw new Error('Failed to analyze drawings');
    }
  }

  /**
   * Client Communication Recommendation
   * Recommends communication strategies based on job status and client preferences
   */
  async recommendClientCommunication(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'CLIENT_COMMUNICATION_RECOMMENDATION'
      };

      const result = await this.aiService.getRecommendations(payload);
      return {
        communicationStrategy: result.communicationStrategy,
        keyMessages: result.keyMessages,
        frequencyRecommendation: result.frequencyRecommendation,
        contentSuggestions: result.contentSuggestions,
        riskMitigation: result.riskMitigation
      };
    } catch (error) {
      console.error('Error recommending client communication:', error);
      throw new Error('Failed to recommend client communication');
    }
  }

  /**
   * Performance Prediction
   * Predicts job performance based on current progress and historical data
   */
  async predictPerformance(jobId) {
    try {
      const payload = {
        jobId,
        modelType: 'PERFORMANCE_PREDICTION'
      };

      const result = await this.aiService.getPrediction(payload);
      return {
        schedulePerformance: result.schedulePerformance,
        budgetPerformance: result.budgetPerformance,
        qualityPerformance: result.qualityPerformance,
        riskAssessment: result.riskAssessment,
        improvementOpportunities: result.improvementOpportunities
      };
    } catch (error) {
      console.error('Error predicting performance:', error);
      throw new Error('Failed to predict performance');
    }
  }
}

export default new JobAIService();
