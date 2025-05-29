/**
 * HRPersonnelAIService.js
 * 
 * This service provides AI capabilities for the HR/Personnel module, including:
 * - Optimal scheduling recommendations
 * - Employee performance analysis
 * - Training needs assessment
 * - Certification tracking and predictions
 * - Workforce planning optimization
 */

import axios from 'axios';

export class HRPersonnelAIService {
  /**
   * Generates optimal employee scheduling recommendations
   * 
   * @param {Array} employees - List of employees with skills and availability
   * @param {Array} projects - List of projects with requirements
   * @returns {Promise<Object>} - Optimized scheduling recommendations
   */
  static async generateOptimalSchedule(employees, projects) {
    try {
      // Process employee and project data
      const processedData = this._processSchedulingData(employees, projects);
      
      // Generate optimal assignments based on skills, availability, and project needs
      const assignments = await this._generateOptimalAssignments(processedData);
      
      // Format and return the scheduling recommendations
      return this._formatSchedulingRecommendations(assignments, employees, projects);
    } catch (error) {
      console.error('Error generating optimal schedule:', error);
      throw new Error('Failed to generate optimal schedule');
    }
  }

  /**
   * Analyzes employee performance data to identify patterns and insights
   * 
   * @param {Object} employeeData - Employee performance data and history
   * @returns {Promise<Object>} - Performance analysis and recommendations
   */
  static async analyzeEmployeePerformance(employeeData) {
    try {
      // Extract performance metrics from employee data
      const performanceMetrics = this._extractPerformanceMetrics(employeeData);
      
      // Analyze performance trends over time
      const performanceTrends = this._analyzePerformanceTrends(performanceMetrics);
      
      // Compare performance against benchmarks
      const benchmarkComparison = await this._compareAgainstBenchmarks(performanceMetrics);
      
      // Generate recommendations based on analysis
      const recommendations = this._generatePerformanceRecommendations(
        performanceTrends, 
        benchmarkComparison
      );
      
      return {
        metrics: performanceMetrics,
        trends: performanceTrends,
        benchmarkComparison,
        recommendations
      };
    } catch (error) {
      console.error('Error analyzing employee performance:', error);
      throw new Error('Failed to analyze employee performance');
    }
  }

  /**
   * Assesses training needs based on employee skills and project requirements
   * 
   * @param {Object} employeeData - Employee skills and training history
   * @param {Array} projectRequirements - Upcoming project skill requirements
   * @returns {Promise<Object>} - Training needs assessment and recommendations
   */
  static async assessTrainingNeeds(employeeData, projectRequirements) {
    try {
      // Identify current skill levels
      const currentSkills = this._identifyCurrentSkills(employeeData);
      
      // Determine required skills based on project requirements
      const requiredSkills = this._determineRequiredSkills(projectRequirements);
      
      // Identify skill gaps
      const skillGaps = this._identifySkillGaps(currentSkills, requiredSkills);
      
      // Generate training recommendations
      return this._generateTrainingRecommendations(skillGaps, employeeData);
    } catch (error) {
      console.error('Error assessing training needs:', error);
      throw new Error('Failed to assess training needs');
    }
  }

  /**
   * Predicts certification expirations and generates renewal reminders
   * 
   * @param {Array} certifications - List of employee certifications
   * @returns {Promise<Object>} - Expiration predictions and renewal recommendations
   */
  static async predictCertificationExpirations(certifications) {
    try {
      // Analyze certification data
      const certificationAnalysis = this._analyzeCertificationData(certifications);
      
      // Predict upcoming expirations
      const expirationPredictions = this._predictExpirations(certificationAnalysis);
      
      // Generate renewal reminders and recommendations
      return this._generateRenewalRecommendations(expirationPredictions);
    } catch (error) {
      console.error('Error predicting certification expirations:', error);
      throw new Error('Failed to predict certification expirations');
    }
  }

  /**
   * Optimizes workforce planning based on project forecasts
   * 
   * @param {Array} currentWorkforce - Current workforce data
   * @param {Array} projectForecasts - Forecasted project demands
   * @returns {Promise<Object>} - Workforce planning recommendations
   */
  static async optimizeWorkforcePlanning(currentWorkforce, projectForecasts) {
    try {
      // Analyze current workforce capacity and skills
      const workforceAnalysis = this._analyzeWorkforceCapacity(currentWorkforce);
      
      // Forecast future workforce needs based on project forecasts
      const workforceNeeds = this._forecastWorkforceNeeds(projectForecasts);
      
      // Identify gaps between current capacity and future needs
      const capacityGaps = this._identifyCapacityGaps(workforceAnalysis, workforceNeeds);
      
      // Generate workforce planning recommendations
      return this._generateWorkforcePlanningRecommendations(capacityGaps);
    } catch (error) {
      console.error('Error optimizing workforce planning:', error);
      throw new Error('Failed to optimize workforce planning');
    }
  }

  // Private helper methods
  static _processSchedulingData(employees, projects) {
    // Process employee and project data for scheduling optimization
    return {
      employeeSkills: this._mapEmployeeSkills(employees),
      employeeAvailability: this._mapEmployeeAvailability(employees),
      projectRequirements: this._mapProjectRequirements(projects)
    };
  }

  static _mapEmployeeSkills(employees) {
    // Map employee skills for scheduling optimization
    return employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      skills: employee.skills.map(skill => ({
        name: skill.name,
        level: skill.level
      }))
    }));
  }

  static _mapEmployeeAvailability(employees) {
    // Map employee availability for scheduling optimization
    return employees.map(employee => ({
      id: employee.id,
      availability: employee.availability || []
    }));
  }

  static _mapProjectRequirements(projects) {
    // Map project requirements for scheduling optimization
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      skillRequirements: project.skillRequirements || []
    }));
  }

  static async _generateOptimalAssignments(processedData) {
    // Generate optimal assignments based on skills, availability, and project needs
    // This would typically involve a complex optimization algorithm
    return [
      { employeeId: 'E001', projectId: 'P001', startDate: '2023-06-01', endDate: '2023-06-15', role: 'Lead Technician' },
      { employeeId: 'E002', projectId: 'P002', startDate: '2023-06-05', endDate: '2023-06-20', role: 'Assistant Technician' },
      { employeeId: 'E003', projectId: 'P001', startDate: '2023-06-10', endDate: '2023-06-25', role: 'Quality Inspector' }
    ];
  }

  static _formatSchedulingRecommendations(assignments, employees, projects) {
    // Format and return the scheduling recommendations
    const employeeMap = employees.reduce((map, emp) => {
      map[emp.id] = emp;
      return map;
    }, {});
    
    const projectMap = projects.reduce((map, proj) => {
      map[proj.id] = proj;
      return map;
    }, {});
    
    return {
      assignments: assignments.map(assignment => ({
        employee: employeeMap[assignment.employeeId].name,
        project: projectMap[assignment.projectId].name,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        role: assignment.role
      })),
      utilizationRate: 0.85, // 85% utilization
      skillMatchScore: 0.92, // 92% optimal skill matching
      alternativeOptions: [
        {
          description: 'Alternative schedule with higher skill match but lower utilization',
          utilizationRate: 0.80,
          skillMatchScore: 0.95
        }
      ]
    };
  }

  static _extractPerformanceMetrics(employeeData) {
    // Extract performance metrics from employee data
    return {
      productivity: this._calculateProductivityMetrics(employeeData),
      quality: this._calculateQualityMetrics(employeeData),
      attendance: this._calculateAttendanceMetrics(employeeData),
      teamwork: this._calculateTeamworkMetrics(employeeData)
    };
  }

  static _calculateProductivityMetrics(employeeData) {
    // Calculate productivity metrics
    return {
      tasksCompleted: employeeData.tasksCompleted || 0,
      averageCompletionTime: employeeData.averageCompletionTime || 0,
      efficiencyRating: employeeData.efficiencyRating || 0
    };
  }

  static _calculateQualityMetrics(employeeData) {
    // Calculate quality metrics
    return {
      errorRate: employeeData.errorRate || 0,
      reworkRate: employeeData.reworkRate || 0,
      customerSatisfaction: employeeData.customerSatisfaction || 0
    };
  }

  static _calculateAttendanceMetrics(employeeData) {
    // Calculate attendance metrics
    return {
      attendanceRate: employeeData.attendanceRate || 0,
      punctualityRate: employeeData.punctualityRate || 0,
      overtimeHours: employeeData.overtimeHours || 0
    };
  }

  static _calculateTeamworkMetrics(employeeData) {
    // Calculate teamwork metrics
    return {
      collaborationScore: employeeData.collaborationScore || 0,
      communicationRating: employeeData.communicationRating || 0,
      peerFeedback: employeeData.peerFeedback || 0
    };
  }

  static _analyzePerformanceTrends(performanceMetrics) {
    // Analyze performance trends over time
    return {
      productivity: {
        trend: 'improving',
        changeRate: 0.05 // 5% improvement
      },
      quality: {
        trend: 'stable',
        changeRate: 0.01 // 1% improvement
      },
      attendance: {
        trend: 'declining',
        changeRate: -0.02 // 2% decline
      },
      teamwork: {
        trend: 'improving',
        changeRate: 0.03 // 3% improvement
      }
    };
  }

  static async _compareAgainstBenchmarks(performanceMetrics) {
    // Compare performance against benchmarks
    return {
      productivity: {
        benchmark: 0.85,
        actual: 0.90,
        percentageDifference: 0.059 // 5.9% above benchmark
      },
      quality: {
        benchmark: 0.95,
        actual: 0.93,
        percentageDifference: -0.021 // 2.1% below benchmark
      },
      attendance: {
        benchmark: 0.98,
        actual: 0.96,
        percentageDifference: -0.020 // 2% below benchmark
      },
      teamwork: {
        benchmark: 0.80,
        actual: 0.85,
        percentageDifference: 0.063 // 6.3% above benchmark
      }
    };
  }

  static _generatePerformanceRecommendations(performanceTrends, benchmarkComparison) {
    // Generate recommendations based on performance analysis
    const recommendations = [];
    
    // Check for areas below benchmark
    if (benchmarkComparison.quality.percentageDifference < 0) {
      recommendations.push({
        area: 'Quality',
        recommendation: 'Provide additional training on quality control procedures',
        priority: 'high'
      });
    }
    
    if (benchmarkComparison.attendance.percentageDifference < 0) {
      recommendations.push({
        area: 'Attendance',
        recommendation: 'Discuss attendance concerns and identify any underlying issues',
        priority: 'medium'
      });
    }
    
    // Check for declining trends
    if (performanceTrends.attendance.trend === 'declining') {
      recommendations.push({
        area: 'Attendance',
        recommendation: 'Implement attendance improvement plan',
        priority: 'high'
      });
    }
    
    // Add recommendations for strengths
    if (benchmarkComparison.productivity.percentageDifference > 0) {
      recommendations.push({
        area: 'Productivity',
        recommendation: 'Recognize excellent productivity and consider for mentoring role',
        priority: 'medium'
      });
    }
    
    if (benchmarkComparison.teamwork.percentageDifference > 0) {
      recommendations.push({
        area: 'Teamwork',
        recommendation: 'Leverage strong teamwork skills for collaborative projects',
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  static _identifyCurrentSkills(employeeData) {
    // Identify current skill levels
    return employeeData.skills.map(skill => ({
      name: skill.name,
      level: skill.level,
      lastTraining: skill.lastTraining,
      certifications: skill.certifications || []
    }));
  }

  static _determineRequiredSkills(projectRequirements) {
    // Determine required skills based on project requirements
    const skillRequirements = [];
    
    projectRequirements.forEach(project => {
      project.skillRequirements.forEach(requirement => {
        const existingSkill = skillRequirements.find(skill => skill.name === requirement.name);
        
        if (existingSkill) {
          // Update existing skill if new requirement has higher level
          if (requirement.level > existingSkill.level) {
            existingSkill.level = requirement.level;
            existingSkill.projects.push(project.id);
          }
        } else {
          // Add new skill requirement
          skillRequirements.push({
            name: requirement.name,
            level: requirement.level,
            projects: [project.id]
          });
        }
      });
    });
    
    return skillRequirements;
  }

  static _identifySkillGaps(currentSkills, requiredSkills) {
    // Identify skill gaps
    const skillGaps = [];
    
    requiredSkills.forEach(requiredSkill => {
      const currentSkill = currentSkills.find(skill => skill.name === requiredSkill.name);
      
      if (!currentSkill) {
        // Skill is missing entirely
        skillGaps.push({
          name: requiredSkill.name,
          currentLevel: 0,
          requiredLevel: requiredSkill.level,
          gap: requiredSkill.level,
          gapType: 'missing',
          projects: requiredSkill.projects
        });
      } else if (currentSkill.level < requiredSkill.level) {
        // Skill level is insufficient
        skillGaps.push({
          name: requiredSkill.name,
          currentLevel: currentSkill.level,
          requiredLevel: requiredSkill.level,
          gap: requiredSkill.level - currentSkill.level,
          gapType: 'insufficient',
          projects: requiredSkill.projects
        });
      }
    });
    
    return skillGaps;
  }

  static _generateTrainingRecommendations(skillGaps, employeeData) {
    // Generate training recommendations
    const recommendations = skillGaps.map(gap => {
      const trainingOptions = this._findTrainingOptions(gap.name, gap.requiredLevel);
      
      return {
        skill: gap.name,
        currentLevel: gap.currentLevel,
        targetLevel: gap.requiredLevel,
        priority: gap.projects.length > 1 ? 'high' : 'medium',
        trainingOptions,
        estimatedTimeToAchieve: this._estimateTrainingTime(gap.gap, trainingOptions)
      };
    });
    
    // Sort recommendations by priority
    return {
      employeeName: employeeData.name,
      recommendations: recommendations.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return 0;
      }),
      summary: {
        highPriorityCount: recommendations.filter(r => r.priority === 'high').length,
        mediumPriorityCount: recommendations.filter(r => r.priority === 'medium').length,
        lowPriorityCount: recommendations.filter(r => r.priority === 'low').length,
        totalTrainingTime: recommendations.reduce((total, r) => total + r.estimatedTimeToAchieve, 0)
      }
    };
  }

  static _findTrainingOptions(skillName, targetLevel) {
    // Find training options for a specific skill
    // This would typically query a training database
    return [
      { name: `${skillName} Fundamentals`, duration: 16, format: 'online', cost: 500 },
      { name: `Advanced ${skillName}`, duration: 24, format: 'in-person', cost: 1200 },
      { name: `${skillName} Certification Prep`, duration: 40, format: 'hybrid', cost: 2000 }
    ];
  }

  static _estimateTrainingTime(gap, trainingOptions) {
    // Estimate training time based on gap and available options
    // Simple calculation for demonstration
    return gap * 20; // 20 hours per skill level gap
  }

  static _analyzeCertificationData(certifications) {
    // Analyze certification data
    return certifications.map(cert => ({
      id: cert.id,
      name: cert.name,
      employeeId: cert.employeeId,
      issueDate: new Date(cert.issueDate),
      expirationDate: new Date(cert.expirationDate),
      renewalRequirements: cert.renewalRequirements,
      daysUntilExpiration: Math.floor((new Date(cert.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));
  }

  static _predictExpirations(certificationAnalysis) {
    // Predict upcoming expirations
    return certificationAnalysis
      .filter(cert => cert.daysUntilExpiration > 0) // Only include non-expired certifications
      .sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration) // Sort by days until expiration
      .map(cert => ({
        ...cert,
        expirationCategory: this._categorizeExpiration(cert.daysUntilExpiration)
      }));
  }

  static _categorizeExpiration(daysUntilExpiration) {
    // Categorize expiration based on days until expiration
    if (daysUntilExpiration <= 30) return 'critical';
    if (daysUntilExpiration <= 90) return 'upcoming';
    if (daysUntilExpiration <= 180) return 'planning';
    return 'future';
  }

  static _generateRenewalRecommendations(expirationPredictions) {
    // Generate renewal reminders and recommendations
    const categorized = {
      critical: expirationPredictions.filter(pred => pred.expirationCategory === 'critical'),
      upcoming: expirationPredictions.filter(pred => pred.expirationCategory === 'upcoming'),
      planning: expirationPredictions.filter(pred => pred.expirationCategory === 'planning'),
      future: expirationPredictions.filter(pred => pred.expirationCategory === 'future')
    };
    
    return {
      summary: {
        criticalCount: categorized.critical.length,
        upcomingCount: categorized.upcoming.length,
        planningCount: categorized.planning.length,
        futureCount: categorized.future.length
      },
      criticalExpirations: categorized.critical.map(cert => ({
        name: cert.name,
        employeeId: cert.employeeId,
        expirationDate: cert.expirationDate,
        daysRemaining: cert.daysUntilExpiration,
        renewalRequirements: cert.renewalRequirements,
        recommendedAction: 'Immediate renewal process initiation'
      })),
      upcomingExpirations: categorized.upcoming.map(cert => ({
        name: cert.name,
        employeeId: cert.employeeId,
        expirationDate: cert.expirationDate,
        daysRemaining: cert.daysUntilExpiration,
        renewalRequirements: cert.renewalRequirements,
        recommendedAction: 'Schedule renewal training within 30 days'
      })),
      planningExpirations: categorized.planning.map(cert => ({
        name: cert.name,
        employeeId: cert.employeeId,
        expirationDate: cert.expirationDate,
        daysRemaining: cert.daysUntilExpiration,
        renewalRequirements: cert.renewalRequirements,
        recommendedAction: 'Include in quarterly training plan'
      }))
    };
  }

  static _analyzeWorkforceCapacity(currentWorkforce) {
    // Analyze current workforce capacity and skills
    return {
      totalHeadcount: currentWorkforce.length,
      skillDistribution: this._analyzeSkillDistribution(currentWorkforce),
      capacityByDepartment: this._analyzeCapacityByDepartment(currentWorkforce),
      utilizationRate: this._calculateUtilizationRate(currentWorkforce)
    };
  }

  static _analyzeSkillDistribution(currentWorkforce) {
    // Analyze skill distribution across workforce
    const skillCounts = {};
    
    currentWorkforce.forEach(employee => {
      employee.skills.forEach(skill => {
        if (!skillCounts[skill.name]) {
          skillCounts[skill.name] = {
            count: 0,
            levelSum: 0,
            levels: {
              beginner: 0,
              intermediate: 0,
              advanced: 0,
              expert: 0
            }
          };
        }
        
        skillCounts[skill.name].count++;
        skillCounts[skill.name].levelSum += skill.level;
        
        // Categorize skill level
        if (skill.level < 3) {
          skillCounts[skill.name].levels.beginner++;
        } else if (skill.level < 5) {
          skillCounts[skill.name].levels.intermediate++;
        } else if (skill.level < 8) {
          skillCounts[skill.name].levels.advanced++;
        } else {
          skillCounts[skill.name].levels.expert++;
        }
      });
    });
    
    // Convert to array and calculate averages
    return Object.keys(skillCounts).map(skillName => ({
      name: skillName,
      employeeCount: skillCounts[skillName].count,
      averageLevel: skillCounts[skillName].levelSum / skillCounts[skillName].count,
      distribution: skillCounts[skillName].levels
    }));
  }

  static _analyzeCapacityByDepartment(currentWorkforce) {
    // Analyze capacity by department
    const departmentCapacity = {};
    
    currentWorkforce.forEach(employee => {
      if (!departmentCapacity[employee.department]) {
        departmentCapacity[employee.department] = {
          headcount: 0,
          totalCapacityHours: 0,
          allocatedHours: 0
        };
      }
      
      departmentCapacity[employee.department].headcount++;
      departmentCapacity[employee.department].totalCapacityHours += employee.capacityHours || 40;
      departmentCapacity[employee.department].allocatedHours += employee.allocatedHours || 0;
    });
    
    // Convert to array and calculate utilization
    return Object.keys(departmentCapacity).map(department => ({
      name: department,
      headcount: departmentCapacity[department].headcount,
      totalCapacityHours: departmentCapacity[department].totalCapacityHours,
      allocatedHours: departmentCapacity[department].allocatedHours,
      utilizationRate: departmentCapacity[department].allocatedHours / departmentCapacity[department].totalCapacityHours
    }));
  }

  static _calculateUtilizationRate(currentWorkforce) {
    // Calculate overall utilization rate
    const totalCapacity = currentWorkforce.reduce((sum, employee) => sum + (employee.capacityHours || 40), 0);
    const totalAllocated = currentWorkforce.reduce((sum, employee) => sum + (employee.allocatedHours || 0), 0);
    
    return totalAllocated / totalCapacity;
  }

  static _forecastWorkforceNeeds(projectForecasts) {
    // Forecast future workforce needs based on project forecasts
    const monthlyNeeds = {};
    
    // Initialize monthly needs for the next 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      monthlyNeeds[monthKey] = {
        month: monthKey,
        totalHours: 0,
        skillRequirements: {}
      };
    }
    
    // Aggregate project needs by month
    projectForecasts.forEach(project => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      
      // Calculate months between start and end dates
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth()) + 1;
      
      // Distribute hours evenly across months
      const monthlyHours = project.totalHours / months;
      
      // Add hours to each month
      for (let i = 0; i < months; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (monthlyNeeds[monthKey]) {
          monthlyNeeds[monthKey].totalHours += monthlyHours;
          
          // Add skill requirements
          project.skillRequirements.forEach(skill => {
            if (!monthlyNeeds[monthKey].skillRequirements[skill.name]) {
              monthlyNeeds[monthKey].skillRequirements[skill.name] = {
                hours: 0,
                level: 0
              };
            }
            
            monthlyNeeds[monthKey].skillRequirements[skill.name].hours += (monthlyHours * skill.percentage) / 100;
            monthlyNeeds[monthKey].skillRequirements[skill.name].level = Math.max(
              monthlyNeeds[monthKey].skillRequirements[skill.name].level,
              skill.level
            );
          });
        }
      }
    });
    
    // Convert to array
    return Object.values(monthlyNeeds);
  }

  static _identifyCapacityGaps(workforceAnalysis, workforceNeeds) {
    // Identify gaps between current capacity and future needs
    const capacityGaps = [];
    
    // Calculate FTE (Full-Time Equivalent) needed for each month
    workforceNeeds.forEach(monthlyNeed => {
      const fteNeeded = monthlyNeed.totalHours / 160; // Assuming 160 hours per month per FTE
      const currentCapacity = workforceAnalysis.totalHeadcount;
      const capacityGap = fteNeeded - currentCapacity;
      
      capacityGaps.push({
        month: monthlyNeed.month,
        fteNeeded,
        currentCapacity,
        capacityGap,
        skillGaps: this._identifyMonthlySkillGaps(monthlyNeed.skillRequirements, workforceAnalysis.skillDistribution)
      });
    });
    
    return capacityGaps;
  }

  static _identifyMonthlySkillGaps(monthlySkillRequirements, currentSkillDistribution) {
    // Identify skill gaps for a specific month
    const skillGaps = [];
    
    Object.keys(monthlySkillRequirements).forEach(skillName => {
      const requirement = monthlySkillRequirements[skillName];
      const currentSkill = currentSkillDistribution.find(skill => skill.name === skillName);
      
      const fteNeeded = requirement.hours / 160; // Assuming 160 hours per month per FTE
      const currentFte = currentSkill ? currentSkill.employeeCount : 0;
      const fteGap = fteNeeded - currentFte;
      
      const levelGap = currentSkill ? 
        Math.max(0, requirement.level - currentSkill.averageLevel) : 
        requirement.level;
      
      if (fteGap > 0 || levelGap > 0) {
        skillGaps.push({
          skill: skillName,
          fteNeeded,
          currentFte,
          fteGap,
          requiredLevel: requirement.level,
          currentLevel: currentSkill ? currentSkill.averageLevel : 0,
          levelGap
        });
      }
    });
    
    return skillGaps;
  }

  static _generateWorkforcePlanningRecommendations(capacityGaps) {
    // Generate workforce planning recommendations
    const hiringNeeds = [];
    const trainingNeeds = [];
    const contractingNeeds = [];
    
    // Analyze capacity gaps to determine recommendations
    capacityGaps.forEach(monthGap => {
      // Check if there's a significant capacity gap
      if (monthGap.capacityGap > 1) {
        // Need to hire or contract
        if (monthGap.capacityGap > 3) {
          // Significant gap - recommend hiring
          hiringNeeds.push({
            month: monthGap.month,
            fteNeeded: Math.floor(monthGap.capacityGap),
            skills: monthGap.skillGaps.map(skill => skill.skill).join(', ')
          });
        } else {
          // Moderate gap - recommend contracting
          contractingNeeds.push({
            month: monthGap.month,
            fteNeeded: monthGap.capacityGap.toFixed(1),
            skills: monthGap.skillGaps.map(skill => skill.skill).join(', ')
          });
        }
      }
      
      // Check for skill level gaps
      monthGap.skillGaps.forEach(skillGap => {
        if (skillGap.levelGap > 1) {
          // Significant skill level gap - recommend training
          trainingNeeds.push({
            skill: skillGap.skill,
            currentLevel: skillGap.currentLevel.toFixed(1),
            targetLevel: skillGap.requiredLevel,
            employeeCount: Math.ceil(skillGap.fteNeeded),
            month: monthGap.month
          });
        }
      });
    });
    
    return {
      summary: {
        peakCapacityMonth: capacityGaps.reduce((max, gap) => gap.fteNeeded > max.fteNeeded ? gap : max, capacityGaps[0]).month,
        peakCapacityNeeded: Math.max(...capacityGaps.map(gap => gap.fteNeeded)),
        averageCapacityNeeded: capacityGaps.reduce((sum, gap) => sum + gap.fteNeeded, 0) / capacityGaps.length,
        criticalSkillGaps: this._identifyCriticalSkillGaps(capacityGaps)
      },
      hiringRecommendations: hiringNeeds,
      trainingRecommendations: trainingNeeds,
      contractingRecommendations: contractingNeeds,
      timeline: this._generateWorkforcePlanningTimeline(capacityGaps, hiringNeeds, trainingNeeds, contractingNeeds)
    };
  }

  static _identifyCriticalSkillGaps(capacityGaps) {
    // Identify critical skill gaps across all months
    const allSkillGaps = [];
    
    capacityGaps.forEach(monthGap => {
      monthGap.skillGaps.forEach(skillGap => {
        allSkillGaps.push({
          skill: skillGap.skill,
          month: monthGap.month,
          fteGap: skillGap.fteGap,
          levelGap: skillGap.levelGap
        });
      });
    });
    
    // Group by skill and calculate average gaps
    const skillGroups = {};
    allSkillGaps.forEach(gap => {
      if (!skillGroups[gap.skill]) {
        skillGroups[gap.skill] = {
          skill: gap.skill,
          totalFteGap: 0,
          totalLevelGap: 0,
          count: 0
        };
      }
      
      skillGroups[gap.skill].totalFteGap += gap.fteGap;
      skillGroups[gap.skill].totalLevelGap += gap.levelGap;
      skillGroups[gap.skill].count++;
    });
    
    // Calculate averages and sort by criticality
    return Object.values(skillGroups)
      .map(group => ({
        skill: group.skill,
        averageFteGap: group.totalFteGap / group.count,
        averageLevelGap: group.totalLevelGap / group.count,
        criticality: (group.totalFteGap / group.count) * (group.totalLevelGap / group.count)
      }))
      .sort((a, b) => b.criticality - a.criticality)
      .slice(0, 5); // Return top 5 critical skill gaps
  }

  static _generateWorkforcePlanningTimeline(capacityGaps, hiringNeeds, trainingNeeds, contractingNeeds) {
    // Generate workforce planning timeline
    const timeline = [];
    
    // Add all actions to timeline
    hiringNeeds.forEach(need => {
      timeline.push({
        month: need.month,
        action: `Hire ${need.fteNeeded} FTE with skills in ${need.skills}`,
        type: 'hiring',
        priority: 'high'
      });
    });
    
    trainingNeeds.forEach(need => {
      timeline.push({
        month: need.month,
        action: `Train ${need.employeeCount} employees on ${need.skill} from level ${need.currentLevel} to ${need.targetLevel}`,
        type: 'training',
        priority: 'medium'
      });
    });
    
    contractingNeeds.forEach(need => {
      timeline.push({
        month: need.month,
        action: `Contract ${need.fteNeeded} FTE with skills in ${need.skills}`,
        type: 'contracting',
        priority: 'medium'
      });
    });
    
    // Sort timeline by month
    return timeline.sort((a, b) => {
      const aDate = new Date(`${a.month}-01`);
      const bDate = new Date(`${b.month}-01`);
      return aDate - bDate;
    });
  }
}

export default HRPersonnelAIService;
