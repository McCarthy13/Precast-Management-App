/**
 * Project Management AI Services
 * Provides AI-powered features for the Project Management module
 */

import { AIService } from '../../../ai/services/AIService';

export class ProjectManagementAIService {
  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Project Schedule Optimization
   * Optimizes project schedule based on resource availability, dependencies, and constraints
   */
  async optimizeProjectSchedule(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'SCHEDULE_OPTIMIZATION'
      };

      const result = await this.aiService.getOptimizationPlan(payload);
      return {
        optimizedSchedule: result.optimizedSchedule,
        criticalPath: result.criticalPath,
        resourceAllocation: result.resourceAllocation,
        timelineImpact: result.timelineImpact,
        riskAssessment: result.riskAssessment
      };
    } catch (error) {
      console.error('Error optimizing project schedule:', error);
      throw new Error('Failed to optimize project schedule');
    }
  }

  /**
   * Resource Allocation Optimization
   * Recommends optimal resource allocation based on skills, availability, and project needs
   */
  async optimizeResourceAllocation(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'RESOURCE_OPTIMIZATION'
      };

      const result = await this.aiService.getOptimizationPlan(payload);
      return {
        recommendedAllocations: result.recommendedAllocations,
        skillMatchAnalysis: result.skillMatchAnalysis,
        workloadBalancing: result.workloadBalancing,
        efficiencyGains: result.efficiencyGains,
        alternativeOptions: result.alternativeOptions
      };
    } catch (error) {
      console.error('Error optimizing resource allocation:', error);
      throw new Error('Failed to optimize resource allocation');
    }
  }

  /**
   * Risk Prediction and Analysis
   * Identifies potential risks based on project characteristics and historical data
   */
  async predictProjectRisks(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'RISK_PREDICTION'
      };

      const result = await this.aiService.getPrediction(payload);
      return {
        predictedRisks: result.predictedRisks,
        riskProbabilities: result.riskProbabilities,
        impactAssessment: result.impactAssessment,
        mitigationStrategies: result.mitigationStrategies,
        historicalComparison: result.historicalComparison
      };
    } catch (error) {
      console.error('Error predicting project risks:', error);
      throw new Error('Failed to predict project risks');
    }
  }

  /**
   * Budget Forecasting
   * Predicts budget performance based on current spending patterns and project progress
   */
  async forecastProjectBudget(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'BUDGET_FORECAST'
      };

      const result = await this.aiService.getPrediction(payload);
      return {
        forecastedSpending: result.forecastedSpending,
        varianceAnalysis: result.varianceAnalysis,
        costTrends: result.costTrends,
        savingsOpportunities: result.savingsOpportunities,
        budgetRisks: result.budgetRisks
      };
    } catch (error) {
      console.error('Error forecasting project budget:', error);
      throw new Error('Failed to forecast project budget');
    }
  }

  /**
   * Project Outcome Prediction
   * Predicts project outcomes based on current status, risks, and historical data
   */
  async predictProjectOutcome(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'OUTCOME_PREDICTION'
      };

      const result = await this.aiService.getPrediction(payload);
      return {
        successProbability: result.successProbability,
        timelineProjection: result.timelineProjection,
        qualityProjection: result.qualityProjection,
        keySuccessFactors: result.keySuccessFactors,
        recommendedActions: result.recommendedActions
      };
    } catch (error) {
      console.error('Error predicting project outcome:', error);
      throw new Error('Failed to predict project outcome');
    }
  }

  /**
   * Task Prioritization
   * Recommends task priorities based on project goals, dependencies, and resource constraints
   */
  async prioritizeTasks(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'TASK_PRIORITIZATION'
      };

      const result = await this.aiService.getRecommendations(payload);
      return {
        prioritizedTasks: result.prioritizedTasks,
        prioritizationRationale: result.rationale,
        impactAnalysis: result.impactAnalysis,
        dependencyChains: result.dependencyChains,
        resourceConsiderations: result.resourceConsiderations
      };
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      throw new Error('Failed to prioritize tasks');
    }
  }

  /**
   * Stakeholder Communication Planning
   * Generates personalized communication plans for different stakeholders
   */
  async generateStakeholderCommunicationPlan(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'COMMUNICATION_PLAN'
      };

      const result = await this.aiService.generateContent(payload);
      return {
        communicationPlan: result.communicationPlan,
        stakeholderAnalysis: result.stakeholderAnalysis,
        recommendedFrequency: result.recommendedFrequency,
        contentSuggestions: result.contentSuggestions,
        communicationChannels: result.recommendedChannels
      };
    } catch (error) {
      console.error('Error generating stakeholder communication plan:', error);
      throw new Error('Failed to generate stakeholder communication plan');
    }
  }

  /**
   * Project Status Report Generation
   * Automatically generates project status reports based on current data
   */
  async generateStatusReport(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'STATUS_REPORT_GENERATION'
      };

      const result = await this.aiService.generateContent(payload);
      return {
        reportContent: result.generatedContent,
        keyHighlights: result.highlights,
        issuesAndRisks: result.issuesAndRisks,
        progressMetrics: result.progressMetrics,
        recommendedActions: result.recommendedActions
      };
    } catch (error) {
      console.error('Error generating status report:', error);
      throw new Error('Failed to generate status report');
    }
  }

  /**
   * Team Performance Analysis
   * Analyzes team performance and provides improvement recommendations
   */
  async analyzeTeamPerformance(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'TEAM_PERFORMANCE_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        performanceMetrics: result.performanceMetrics,
        strengthsAndWeaknesses: result.strengthsAndWeaknesses,
        productivityTrends: result.productivityTrends,
        improvementRecommendations: result.recommendations,
        teamDynamicsInsights: result.teamDynamics
      };
    } catch (error) {
      console.error('Error analyzing team performance:', error);
      throw new Error('Failed to analyze team performance');
    }
  }

  /**
   * Change Impact Analysis
   * Analyzes the impact of proposed changes on project scope, schedule, and budget
   */
  async analyzeChangeImpact(changeRequestId) {
    try {
      const payload = {
        changeRequestId,
        modelType: 'CHANGE_IMPACT_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        scopeImpact: result.scopeImpact,
        scheduleImpact: result.scheduleImpact,
        budgetImpact: result.budgetImpact,
        qualityImpact: result.qualityImpact,
        riskImpact: result.riskImpact,
        recommendedApproach: result.recommendedApproach
      };
    } catch (error) {
      console.error('Error analyzing change impact:', error);
      throw new Error('Failed to analyze change impact');
    }
  }

  /**
   * Meeting Agenda Generation
   * Generates meeting agendas based on project status, issues, and goals
   */
  async generateMeetingAgenda(projectId, meetingType) {
    try {
      const payload = {
        projectId,
        meetingType,
        modelType: 'MEETING_AGENDA_GENERATION'
      };

      const result = await this.aiService.generateContent(payload);
      return {
        agenda: result.generatedContent,
        suggestedTopics: result.suggestedTopics,
        timeAllocation: result.timeAllocation,
        requiredParticipants: result.requiredParticipants,
        preparationMaterials: result.preparationMaterials
      };
    } catch (error) {
      console.error('Error generating meeting agenda:', error);
      throw new Error('Failed to generate meeting agenda');
    }
  }

  /**
   * Lessons Learned Analysis
   * Analyzes project data to identify patterns and extract lessons learned
   */
  async analyzeLessonsLearned(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'LESSONS_LEARNED_ANALYSIS'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        keyLessons: result.keyLessons,
        successFactors: result.successFactors,
        challengeAreas: result.challengeAreas,
        processImprovements: result.processImprovements,
        knowledgeTransferRecommendations: result.knowledgeTransferRecommendations
      };
    } catch (error) {
      console.error('Error analyzing lessons learned:', error);
      throw new Error('Failed to analyze lessons learned');
    }
  }

  /**
   * Cross-Project Insights
   * Provides insights by comparing current project with similar past projects
   */
  async getProjectComparisons(projectId) {
    try {
      const payload = {
        projectId,
        modelType: 'PROJECT_COMPARISON'
      };

      const result = await this.aiService.analyzeData(payload);
      return {
        similarProjects: result.similarProjects,
        performanceComparison: result.performanceComparison,
        successPatterns: result.successPatterns,
        riskPatterns: result.riskPatterns,
        applicableLessons: result.applicableLessons
      };
    } catch (error) {
      console.error('Error getting project comparisons:', error);
      throw new Error('Failed to get project comparisons');
    }
  }
}

export default new ProjectManagementAIService();
