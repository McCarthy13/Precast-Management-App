/**
 * DispatchAIService.js
 * 
 * This service provides AI capabilities for the Dispatch module, including:
 * - Route optimization
 * - Delivery time prediction
 * - Load optimization
 * - Driver assignment optimization
 * - Weather impact analysis
 */

import axios from 'axios';

export class DispatchAIService {
  /**
   * Optimizes delivery routes based on multiple factors
   * 
   * @param {Array} deliveries - List of deliveries to be scheduled
   * @param {Array} vehicles - Available vehicles
   * @param {Object} constraints - Delivery constraints and priorities
   * @returns {Promise<Object>} - Optimized routes with time and fuel estimates
   */
  static async optimizeRoutes(deliveries, vehicles, constraints) {
    try {
      // Process delivery and vehicle data
      const processedData = this._processRouteData(deliveries, vehicles, constraints);
      
      // Generate optimized routes
      const optimizedRoutes = await this._generateOptimizedRoutes(processedData);
      
      // Calculate metrics for optimized routes
      return this._calculateRouteMetrics(optimizedRoutes, processedData);
    } catch (error) {
      console.error('Error optimizing routes:', error);
      throw new Error('Failed to optimize routes');
    }
  }

  /**
   * Predicts accurate delivery times based on historical data and current conditions
   * 
   * @param {Array} routes - Planned delivery routes
   * @param {Object} conditions - Current traffic and weather conditions
   * @returns {Promise<Array>} - Routes with predicted delivery times and confidence intervals
   */
  static async predictDeliveryTimes(routes, conditions) {
    try {
      // Extract features for prediction
      const features = this._extractTimePredictionFeatures(routes, conditions);
      
      // Use AI model to predict delivery times
      const predictions = await this._callTimePredictionModel(features);
      
      // Process and format prediction results
      return this._formatTimePredictions(predictions, routes);
    } catch (error) {
      console.error('Error predicting delivery times:', error);
      throw new Error('Failed to predict delivery times');
    }
  }

  /**
   * Optimizes load configuration for maximum efficiency
   * 
   * @param {Array} pieces - Pieces to be loaded
   * @param {Object} vehicle - Vehicle specifications
   * @returns {Promise<Object>} - Optimized loading plan with visualization data
   */
  static async optimizeLoadConfiguration(pieces, vehicle) {
    try {
      // Process piece and vehicle data
      const processedData = this._processLoadData(pieces, vehicle);
      
      // Generate optimized loading configuration
      const optimizedLoad = await this._generateOptimizedLoad(processedData);
      
      // Generate visualization data for the loading plan
      return this._generateLoadingPlan(optimizedLoad, processedData);
    } catch (error) {
      console.error('Error optimizing load configuration:', error);
      throw new Error('Failed to optimize load configuration');
    }
  }

  /**
   * Optimizes driver assignments based on skills, availability, and route requirements
   * 
   * @param {Array} drivers - Available drivers with skills and schedules
   * @param {Array} routes - Routes to be assigned
   * @returns {Promise<Array>} - Optimized driver-route assignments
   */
  static async optimizeDriverAssignments(drivers, routes) {
    try {
      // Process driver and route data
      const processedData = this._processDriverData(drivers, routes);
      
      // Generate optimized driver assignments
      const assignments = await this._generateDriverAssignments(processedData);
      
      // Calculate assignment metrics and format results
      return this._formatDriverAssignments(assignments, drivers, routes);
    } catch (error) {
      console.error('Error optimizing driver assignments:', error);
      throw new Error('Failed to optimize driver assignments');
    }
  }

  /**
   * Analyzes weather impact on delivery schedules
   * 
   * @param {Array} routes - Planned delivery routes
   * @param {Object} weatherForecast - Weather forecast data
   * @returns {Promise<Object>} - Weather impact analysis with recommendations
   */
  static async analyzeWeatherImpact(routes, weatherForecast) {
    try {
      // Process route and weather data
      const processedData = this._processWeatherData(routes, weatherForecast);
      
      // Analyze weather impact on routes
      const impactAnalysis = await this._analyzeWeatherImpact(processedData);
      
      // Generate recommendations based on impact analysis
      return this._generateWeatherRecommendations(impactAnalysis, routes);
    } catch (error) {
      console.error('Error analyzing weather impact:', error);
      throw new Error('Failed to analyze weather impact');
    }
  }

  // Private helper methods
  static _processRouteData(deliveries, vehicles, constraints) {
    // Process delivery and vehicle data for route optimization
    return {
      deliveryLocations: this._extractDeliveryLocations(deliveries),
      vehicleCapacities: this._extractVehicleCapacities(vehicles),
      timeWindows: this._extractTimeWindows(deliveries, constraints),
      priorities: this._extractPriorities(deliveries, constraints),
      trafficData: this._getTrafficData(deliveries)
    };
  }

  static _extractDeliveryLocations(deliveries) {
    // Extract delivery locations
    return deliveries.map(delivery => ({
      id: delivery.id,
      location: {
        latitude: delivery.location.latitude,
        longitude: delivery.location.longitude
      },
      address: delivery.address
    }));
  }

  static _extractVehicleCapacities(vehicles) {
    // Extract vehicle capacities
    return vehicles.map(vehicle => ({
      id: vehicle.id,
      capacity: vehicle.capacity,
      type: vehicle.type,
      features: vehicle.features || []
    }));
  }

  static _extractTimeWindows(deliveries, constraints) {
    // Extract delivery time windows
    return deliveries.map(delivery => ({
      id: delivery.id,
      earliestDelivery: delivery.timeWindow?.earliest || constraints.defaultEarliestTime,
      latestDelivery: delivery.timeWindow?.latest || constraints.defaultLatestTime
    }));
  }

  static _extractPriorities(deliveries, constraints) {
    // Extract delivery priorities
    return deliveries.map(delivery => ({
      id: delivery.id,
      priority: delivery.priority || constraints.defaultPriority
    }));
  }

  static _getTrafficData(deliveries) {
    // Get traffic data for delivery locations
    // This would typically involve an API call to a traffic service
    return {};
  }

  static async _generateOptimizedRoutes(processedData) {
    // Generate optimized routes
    // This would typically involve a complex optimization algorithm
    
    // Simulate optimization result for demonstration
    return [
      {
        vehicleId: 'V001',
        stops: [
          { deliveryId: 'D001', estimatedArrival: '08:30', sequence: 1 },
          { deliveryId: 'D003', estimatedArrival: '10:15', sequence: 2 },
          { deliveryId: 'D005', estimatedArrival: '13:45', sequence: 3 }
        ],
        totalDistance: 78.5,
        totalTime: 5.25
      },
      {
        vehicleId: 'V002',
        stops: [
          { deliveryId: 'D002', estimatedArrival: '09:00', sequence: 1 },
          { deliveryId: 'D004', estimatedArrival: '11:30', sequence: 2 }
        ],
        totalDistance: 62.3,
        totalTime: 4.5
      }
    ];
  }

  static _calculateRouteMetrics(optimizedRoutes, processedData) {
    // Calculate metrics for optimized routes
    const totalDistance = optimizedRoutes.reduce((sum, route) => sum + route.totalDistance, 0);
    const totalTime = optimizedRoutes.reduce((sum, route) => sum + route.totalTime, 0);
    const vehicleCount = optimizedRoutes.length;
    
    // Calculate fuel consumption and cost
    const fuelConsumption = totalDistance * 0.35; // Liters per km
    const fuelCost = fuelConsumption * 1.5; // Cost per liter
    
    // Calculate CO2 emissions
    const co2Emissions = fuelConsumption * 2.68; // kg CO2 per liter
    
    return {
      routes: optimizedRoutes,
      metrics: {
        totalDistance: totalDistance.toFixed(1) + ' km',
        totalTime: totalTime.toFixed(1) + ' hours',
        vehicleCount,
        fuelConsumption: fuelConsumption.toFixed(1) + ' liters',
        fuelCost: '$' + fuelCost.toFixed(2),
        co2Emissions: co2Emissions.toFixed(1) + ' kg'
      },
      alternatives: [
        {
          description: 'Minimize vehicle count',
          vehicleCount: vehicleCount - 1,
          totalDistance: (totalDistance * 1.15).toFixed(1) + ' km',
          totalTime: (totalTime * 1.2).toFixed(1) + ' hours'
        },
        {
          description: 'Minimize total distance',
          vehicleCount: vehicleCount + 1,
          totalDistance: (totalDistance * 0.9).toFixed(1) + ' km',
          totalTime: (totalTime * 0.95).toFixed(1) + ' hours'
        }
      ]
    };
  }

  static _extractTimePredictionFeatures(routes, conditions) {
    // Extract features for delivery time prediction
    return routes.map(route => ({
      routeId: route.id,
      distance: route.distance,
      stops: route.stops.length,
      vehicleType: route.vehicleType,
      trafficConditions: conditions.traffic || 'normal',
      weatherConditions: conditions.weather || 'clear',
      dayOfWeek: new Date().getDay(),
      timeOfDay: new Date().getHours()
    }));
  }

  static async _callTimePredictionModel(features) {
    // Call AI model to predict delivery times
    // This would typically be an API call to a machine learning service
    
    // Simulate model response for demonstration
    return features.map(feature => ({
      routeId: feature.routeId,
      predictedDuration: feature.distance * 0.012 * this._getTrafficFactor(feature.trafficConditions) * this._getWeatherFactor(feature.weatherConditions),
      confidenceInterval: {
        lower: feature.distance * 0.011 * this._getTrafficFactor(feature.trafficConditions) * this._getWeatherFactor(feature.weatherConditions),
        upper: feature.distance * 0.014 * this._getTrafficFactor(feature.trafficConditions) * this._getWeatherFactor(feature.weatherConditions)
      },
      factors: {
        traffic: this._getTrafficFactor(feature.trafficConditions),
        weather: this._getWeatherFactor(feature.weatherConditions),
        timeOfDay: this._getTimeOfDayFactor(feature.timeOfDay),
        dayOfWeek: this._getDayOfWeekFactor(feature.dayOfWeek)
      }
    }));
  }

  static _getTrafficFactor(trafficCondition) {
    // Get traffic factor based on traffic condition
    switch (trafficCondition.toLowerCase()) {
      case 'light': return 0.9;
      case 'normal': return 1.0;
      case 'heavy': return 1.3;
      case 'severe': return 1.6;
      default: return 1.0;
    }
  }

  static _getWeatherFactor(weatherCondition) {
    // Get weather factor based on weather condition
    switch (weatherCondition.toLowerCase()) {
      case 'clear': return 1.0;
      case 'cloudy': return 1.0;
      case 'rain': return 1.2;
      case 'snow': return 1.5;
      case 'ice': return 1.8;
      case 'fog': return 1.3;
      default: return 1.0;
    }
  }

  static _getTimeOfDayFactor(hour) {
    // Get time of day factor based on hour
    if (hour >= 7 && hour < 9) return 1.3; // Morning rush
    if (hour >= 16 && hour < 18) return 1.3; // Evening rush
    if (hour >= 22 || hour < 5) return 0.8; // Night
    return 1.0; // Normal hours
  }

  static _getDayOfWeekFactor(day) {
    // Get day of week factor
    if (day === 0 || day === 6) return 0.9; // Weekend
    if (day === 5) return 1.1; // Friday
    return 1.0; // Weekday
  }

  static _formatTimePredictions(predictions, routes) {
    // Process and format prediction results
    return routes.map(route => {
      const prediction = predictions.find(p => p.routeId === route.id);
      
      if (!prediction) return route;
      
      const hours = Math.floor(prediction.predictedDuration);
      const minutes = Math.round((prediction.predictedDuration - hours) * 60);
      
      const lowerHours = Math.floor(prediction.confidenceInterval.lower);
      const lowerMinutes = Math.round((prediction.confidenceInterval.lower - lowerHours) * 60);
      
      const upperHours = Math.floor(prediction.confidenceInterval.upper);
      const upperMinutes = Math.round((prediction.confidenceInterval.upper - upperHours) * 60);
      
      return {
        ...route,
        predictedDuration: `${hours}h ${minutes}m`,
        predictedArrival: this._calculateArrivalTime(route.departureTime, prediction.predictedDuration),
        confidenceInterval: {
          lower: `${lowerHours}h ${lowerMinutes}m`,
          upper: `${upperHours}h ${upperMinutes}m`
        },
        impactFactors: prediction.factors,
        delayRisk: this._calculateDelayRisk(prediction.factors)
      };
    });
  }

  static _calculateArrivalTime(departureTime, durationHours) {
    // Calculate arrival time based on departure time and duration
    if (!departureTime) return 'Unknown';
    
    const departure = new Date(departureTime);
    const durationMs = durationHours * 60 * 60 * 1000;
    const arrival = new Date(departure.getTime() + durationMs);
    
    return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  static _calculateDelayRisk(factors) {
    // Calculate delay risk based on impact factors
    const riskScore = (factors.traffic - 1) * 3 + (factors.weather - 1) * 2 + (factors.timeOfDay - 1) * 1.5 + (factors.dayOfWeek - 1);
    
    if (riskScore > 0.5) return 'High';
    if (riskScore > 0.2) return 'Medium';
    return 'Low';
  }

  static _processLoadData(pieces, vehicle) {
    // Process piece and vehicle data for load optimization
    return {
      pieces: this._processPieceData(pieces),
      vehicle: this._processVehicleData(vehicle)
    };
  }

  static _processPieceData(pieces) {
    // Process piece data
    return pieces.map(piece => ({
      id: piece.id,
      dimensions: {
        length: piece.dimensions.length,
        width: piece.dimensions.width,
        height: piece.dimensions.height
      },
      weight: piece.weight,
      stackable: piece.stackable || false,
      fragile: piece.fragile || false,
      loadingPriority: piece.loadingPriority || 'normal'
    }));
  }

  static _processVehicleData(vehicle) {
    // Process vehicle data
    return {
      id: vehicle.id,
      dimensions: {
        length: vehicle.dimensions.length,
        width: vehicle.dimensions.width,
        height: vehicle.dimensions.height
      },
      maxWeight: vehicle.maxWeight,
      features: vehicle.features || []
    };
  }

  static async _generateOptimizedLoad(processedData) {
    // Generate optimized loading configuration
    // This would typically involve a bin packing algorithm
    
    // Simulate optimization result for demonstration
    return {
      vehicleId: processedData.vehicle.id,
      utilizationRate: 0.85,
      weightUtilization: 0.78,
      piecePositions: processedData.pieces.map((piece, index) => ({
        pieceId: piece.id,
        position: {
          x: (index % 3) * piece.dimensions.width,
          y: Math.floor(index / 3) * piece.dimensions.length,
          z: 0
        },
        rotation: index % 2 === 0 ? 0 : 90
      })),
      weightDistribution: {
        front: 0.52,
        rear: 0.48,
        left: 0.51,
        right: 0.49
      }
    };
  }

  static _generateLoadingPlan(optimizedLoad, processedData) {
    // Generate visualization data for the loading plan
    return {
      ...optimizedLoad,
      loadingSequence: this._generateLoadingSequence(optimizedLoad.piecePositions, processedData),
      visualizationData: this._generateVisualizationData(optimizedLoad, processedData),
      metrics: {
        spaceUtilization: `${(optimizedLoad.utilizationRate * 100).toFixed(1)}%`,
        weightUtilization: `${(optimizedLoad.weightUtilization * 100).toFixed(1)}%`,
        loadingTime: this._estimateLoadingTime(processedData.pieces) + ' minutes',
        balanceQuality: this._evaluateLoadBalance(optimizedLoad.weightDistribution)
      }
    };
  }

  static _generateLoadingSequence(piecePositions, processedData) {
    // Generate loading sequence based on positions and priorities
    return piecePositions
      .map(position => {
        const piece = processedData.pieces.find(p => p.id === position.pieceId);
        return {
          ...position,
          priority: piece ? piece.loadingPriority : 'normal'
        };
      })
      .sort((a, b) => {
        // Sort by z-coordinate (bottom to top)
        if (a.position.z !== b.position.z) {
          return a.position.z - b.position.z;
        }
        
        // Then by y-coordinate (back to front)
        if (a.position.y !== b.position.y) {
          return b.position.y - a.position.y;
        }
        
        // Then by priority
        const priorityOrder = { 'high': 0, 'normal': 1, 'low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .map((position, index) => ({
        sequence: index + 1,
        pieceId: position.pieceId,
        position: position.position
      }));
  }

  static _generateVisualizationData(optimizedLoad, processedData) {
    // Generate visualization data
    return {
      vehicle: {
        dimensions: processedData.vehicle.dimensions,
        color: '#CCCCCC'
      },
      pieces: optimizedLoad.piecePositions.map(position => {
        const piece = processedData.pieces.find(p => p.id === position.pieceId);
        return {
          id: position.pieceId,
          dimensions: piece ? piece.dimensions : { length: 1, width: 1, height: 1 },
          position: position.position,
          rotation: position.rotation,
          color: piece && piece.fragile ? '#FFD700' : '#4CAF50'
        };
      })
    };
  }

  static _estimateLoadingTime(pieces) {
    // Estimate loading time based on piece count and characteristics
    const baseTimePerPiece = 5; // minutes
    const fragileMultiplier = 1.5;
    const heavyMultiplier = 1.3;
    
    return pieces.reduce((totalTime, piece) => {
      let pieceTime = baseTimePerPiece;
      
      if (piece.fragile) pieceTime *= fragileMultiplier;
      if (piece.weight > 1000) pieceTime *= heavyMultiplier;
      
      return totalTime + pieceTime;
    }, 0).toFixed(0);
  }

  static _evaluateLoadBalance(weightDistribution) {
    // Evaluate load balance quality
    const frontRearDifference = Math.abs(weightDistribution.front - weightDistribution.rear);
    const leftRightDifference = Math.abs(weightDistribution.left - weightDistribution.right);
    
    if (frontRearDifference < 0.05 && leftRightDifference < 0.05) {
      return 'Excellent';
    } else if (frontRearDifference < 0.1 && leftRightDifference < 0.1) {
      return 'Good';
    } else if (frontRearDifference < 0.15 && leftRightDifference < 0.15) {
      return 'Fair';
    } else {
      return 'Poor';
    }
  }

  static _processDriverData(drivers, routes) {
    // Process driver and route data
    return {
      drivers: this._processDriverProfiles(drivers),
      routes: this._processRouteRequirements(routes)
    };
  }

  static _processDriverProfiles(drivers) {
    // Process driver profiles
    return drivers.map(driver => ({
      id: driver.id,
      name: driver.name,
      skills: driver.skills || [],
      certifications: driver.certifications || [],
      preferences: driver.preferences || {},
      availability: driver.availability || {},
      hoursWorked: driver.hoursWorked || 0,
      location: driver.location || { latitude: 0, longitude: 0 }
    }));
  }

  static _processRouteRequirements(routes) {
    // Process route requirements
    return routes.map(route => ({
      id: route.id,
      startLocation: route.startLocation,
      requiredSkills: route.requiredSkills || [],
      requiredCertifications: route.requiredCertifications || [],
      estimatedDuration: route.estimatedDuration || 0,
      priority: route.priority || 'normal'
    }));
  }

  static async _generateDriverAssignments(processedData) {
    // Generate optimized driver assignments
    // This would typically involve a complex matching algorithm
    
    // Simulate optimization result for demonstration
    return processedData.routes.map(route => {
      // Find best matching driver based on skills, certifications, and availability
      const matchingDrivers = processedData.drivers
        .filter(driver => {
          // Check if driver has all required skills
          const hasSkills = route.requiredSkills.every(skill => 
            driver.skills.includes(skill)
          );
          
          // Check if driver has all required certifications
          const hasCertifications = route.requiredCertifications.every(cert => 
            driver.certifications.includes(cert)
          );
          
          // Check if driver is available
          const isAvailable = true; // Simplified check
          
          return hasSkills && hasCertifications && isAvailable;
        })
        .map(driver => ({
          driver,
          score: this._calculateMatchScore(driver, route)
        }))
        .sort((a, b) => b.score - a.score);
      
      if (matchingDrivers.length > 0) {
        return {
          routeId: route.id,
          driverId: matchingDrivers[0].driver.id,
          matchScore: matchingDrivers[0].score,
          alternativeDrivers: matchingDrivers.slice(1, 3).map(match => ({
            driverId: match.driver.id,
            matchScore: match.score
          }))
        };
      } else {
        return {
          routeId: route.id,
          driverId: null,
          matchScore: 0,
          alternativeDrivers: []
        };
      }
    });
  }

  static _calculateMatchScore(driver, route) {
    // Calculate match score between driver and route
    let score = 0;
    
    // Skill match
    const skillMatchCount = route.requiredSkills.filter(skill => 
      driver.skills.includes(skill)
    ).length;
    score += (skillMatchCount / Math.max(1, route.requiredSkills.length)) * 40;
    
    // Certification match
    const certMatchCount = route.requiredCertifications.filter(cert => 
      driver.certifications.includes(cert)
    ).length;
    score += (certMatchCount / Math.max(1, route.requiredCertifications.length)) * 30;
    
    // Location proximity (simplified)
    score += 15;
    
    // Workload balance
    const workloadScore = Math.max(0, 15 - (driver.hoursWorked / 10));
    score += workloadScore;
    
    return Math.min(100, score);
  }

  static _formatDriverAssignments(assignments, drivers, routes) {
    // Format driver assignments
    const driverMap = drivers.reduce((map, driver) => {
      map[driver.id] = driver;
      return map;
    }, {});
    
    const routeMap = routes.reduce((map, route) => {
      map[route.id] = route;
      return map;
    }, {});
    
    return {
      assignments: assignments.map(assignment => {
        const driver = assignment.driverId ? driverMap[assignment.driverId] : null;
        const route = routeMap[assignment.routeId];
        
        return {
          routeId: assignment.routeId,
          routeName: route ? route.name : 'Unknown Route',
          driverId: assignment.driverId,
          driverName: driver ? driver.name : 'Unassigned',
          matchScore: `${assignment.matchScore.toFixed(0)}%`,
          requiredSkills: route ? route.requiredSkills : [],
          requiredCertifications: route ? route.requiredCertifications : []
        };
      }),
      metrics: {
        assignedRoutes: assignments.filter(a => a.driverId).length,
        unassignedRoutes: assignments.filter(a => !a.driverId).length,
        averageMatchScore: assignments.filter(a => a.driverId).reduce((sum, a) => sum + a.matchScore, 0) / 
          Math.max(1, assignments.filter(a => a.driverId).length)
      },
      unassignedRoutes: assignments
        .filter(a => !a.driverId)
        .map(a => ({
          routeId: a.routeId,
          routeName: routeMap[a.routeId] ? routeMap[a.routeId].name : 'Unknown Route',
          requiredSkills: routeMap[a.routeId] ? routeMap[a.routeId].requiredSkills : [],
          requiredCertifications: routeMap[a.routeId] ? routeMap[a.routeId].requiredCertifications : []
        }))
    };
  }

  static _processWeatherData(routes, weatherForecast) {
    // Process route and weather data
    return {
      routes: routes.map(route => ({
        id: route.id,
        stops: route.stops.map(stop => ({
          location: stop.location,
          scheduledTime: stop.scheduledTime
        })),
        vehicleType: route.vehicleType
      })),
      weatherForecast: this._processWeatherForecast(weatherForecast)
    };
  }

  static _processWeatherForecast(weatherForecast) {
    // Process weather forecast data
    return weatherForecast.map(forecast => ({
      location: forecast.location,
      time: forecast.time,
      conditions: forecast.conditions,
      temperature: forecast.temperature,
      precipitation: forecast.precipitation,
      windSpeed: forecast.windSpeed,
      visibility: forecast.visibility
    }));
  }

  static async _analyzeWeatherImpact(processedData) {
    // Analyze weather impact on routes
    return processedData.routes.map(route => {
      const routeImpacts = route.stops.map(stop => {
        // Find weather forecast for this stop's location and time
        const forecast = this._findNearestForecast(
          stop.location, 
          stop.scheduledTime, 
          processedData.weatherForecast
        );
        
        if (!forecast) {
          return {
            location: stop.location,
            scheduledTime: stop.scheduledTime,
            impact: 'Unknown',
            delayRisk: 'Unknown'
          };
        }
        
        // Analyze impact of weather conditions
        const impact = this._analyzeWeatherConditionImpact(
          forecast, 
          route.vehicleType
        );
        
        return {
          location: stop.location,
          scheduledTime: stop.scheduledTime,
          forecast,
          impact: impact.impact,
          delayRisk: impact.delayRisk,
          potentialDelay: impact.potentialDelay
        };
      });
      
      // Calculate overall route impact
      const overallImpact = this._calculateOverallRouteImpact(routeImpacts);
      
      return {
        routeId: route.id,
        stopImpacts: routeImpacts,
        overallImpact
      };
    });
  }

  static _findNearestForecast(location, time, forecasts) {
    // Find weather forecast for a specific location and time
    // This is a simplified implementation
    return forecasts[0];
  }

  static _analyzeWeatherConditionImpact(forecast, vehicleType) {
    // Analyze impact of weather conditions
    let impact = 'None';
    let delayRisk = 'Low';
    let potentialDelay = 0;
    
    // Check precipitation
    if (forecast.precipitation > 25) {
      impact = 'Severe';
      delayRisk = 'High';
      potentialDelay = 60; // minutes
    } else if (forecast.precipitation > 10) {
      impact = 'Moderate';
      delayRisk = 'Medium';
      potentialDelay = 30; // minutes
    } else if (forecast.precipitation > 5) {
      impact = 'Minor';
      delayRisk = 'Low';
      potentialDelay = 15; // minutes
    }
    
    // Check visibility
    if (forecast.visibility < 100) {
      impact = 'Severe';
      delayRisk = 'High';
      potentialDelay = Math.max(potentialDelay, 90); // minutes
    } else if (forecast.visibility < 500) {
      impact = impact === 'None' ? 'Moderate' : impact;
      delayRisk = delayRisk === 'Low' ? 'Medium' : delayRisk;
      potentialDelay = Math.max(potentialDelay, 45); // minutes
    }
    
    // Check wind speed
    if (forecast.windSpeed > 60) {
      impact = 'Severe';
      delayRisk = 'High';
      potentialDelay = Math.max(potentialDelay, 120); // minutes
    } else if (forecast.windSpeed > 40) {
      impact = impact === 'None' ? 'Moderate' : impact;
      delayRisk = delayRisk === 'Low' ? 'Medium' : delayRisk;
      potentialDelay = Math.max(potentialDelay, 60); // minutes
    }
    
    // Adjust based on vehicle type
    if (vehicleType === 'flatbed' && forecast.windSpeed > 30) {
      impact = 'Severe';
      delayRisk = 'High';
      potentialDelay = Math.max(potentialDelay, 120); // minutes
    }
    
    return {
      impact,
      delayRisk,
      potentialDelay
    };
  }

  static _calculateOverallRouteImpact(stopImpacts) {
    // Calculate overall route impact
    const impactLevels = {
      'None': 0,
      'Minor': 1,
      'Moderate': 2,
      'Severe': 3,
      'Unknown': 0
    };
    
    const riskLevels = {
      'Low': 0,
      'Medium': 1,
      'High': 2,
      'Unknown': 0
    };
    
    // Find maximum impact and risk
    let maxImpact = 'None';
    let maxRisk = 'Low';
    let totalDelay = 0;
    
    stopImpacts.forEach(impact => {
      if (impactLevels[impact.impact] > impactLevels[maxImpact]) {
        maxImpact = impact.impact;
      }
      
      if (riskLevels[impact.delayRisk] > riskLevels[maxRisk]) {
        maxRisk = impact.delayRisk;
      }
      
      totalDelay += impact.potentialDelay || 0;
    });
    
    // Calculate percentage of stops affected
    const affectedStops = stopImpacts.filter(impact => 
      impact.impact !== 'None' && impact.impact !== 'Unknown'
    ).length;
    
    const percentAffected = (affectedStops / stopImpacts.length) * 100;
    
    return {
      overallImpact: maxImpact,
      overallRisk: maxRisk,
      potentialTotalDelay: totalDelay,
      percentageOfStopsAffected: percentAffected.toFixed(0) + '%'
    };
  }

  static _generateWeatherRecommendations(impactAnalysis, routes) {
    // Generate recommendations based on impact analysis
    const recommendations = [];
    const routeRecommendations = {};
    
    impactAnalysis.forEach(analysis => {
      const routeId = analysis.routeId;
      const route = routes.find(r => r.id === routeId);
      
      if (!route) return;
      
      // Generate recommendations based on overall impact
      if (analysis.overallImpact.overallImpact === 'Severe') {
        recommendations.push({
          routeId,
          routeName: route.name || `Route ${routeId}`,
          recommendation: 'Consider rescheduling this route',
          priority: 'High',
          reason: `Severe weather conditions affecting ${analysis.overallImpact.percentageOfStopsAffected} of stops with potential delay of ${analysis.overallImpact.potentialTotalDelay} minutes`
        });
        
        routeRecommendations[routeId] = 'Reschedule';
      } else if (analysis.overallImpact.overallImpact === 'Moderate') {
        recommendations.push({
          routeId,
          routeName: route.name || `Route ${routeId}`,
          recommendation: 'Adjust delivery time expectations',
          priority: 'Medium',
          reason: `Moderate weather conditions affecting ${analysis.overallImpact.percentageOfStopsAffected} of stops with potential delay of ${analysis.overallImpact.potentialTotalDelay} minutes`
        });
        
        routeRecommendations[routeId] = 'Adjust';
      }
      
      // Generate specific recommendations for severely impacted stops
      analysis.stopImpacts
        .filter(impact => impact.impact === 'Severe')
        .forEach(impact => {
          const stopIndex = analysis.stopImpacts.indexOf(impact) + 1;
          
          recommendations.push({
            routeId,
            routeName: route.name || `Route ${routeId}`,
            recommendation: `Consider rerouting or rescheduling stop #${stopIndex}`,
            priority: 'High',
            reason: `Severe ${impact.forecast.conditions} conditions with ${impact.forecast.precipitation}mm precipitation and ${impact.forecast.windSpeed}km/h winds`
          });
        });
    });
    
    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        routeId: null,
        routeName: 'All Routes',
        recommendation: 'No significant weather impacts expected',
        priority: 'Low',
        reason: 'Current weather forecasts show favorable conditions for deliveries'
      });
    } else {
      // Add driver safety recommendation if there are any weather impacts
      recommendations.push({
        routeId: null,
        routeName: 'All Routes',
        recommendation: 'Brief drivers on weather conditions and safety precautions',
        priority: 'Medium',
        reason: 'Ensure driver awareness of changing weather conditions'
      });
    }
    
    return {
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      routeAdjustments: Object.entries(routeRecommendations).map(([routeId, action]) => {
        const route = routes.find(r => r.id === routeId);
        return {
          routeId,
          routeName: route ? route.name : `Route ${routeId}`,
          recommendedAction: action,
          originalSchedule: route ? route.scheduledStart : 'Unknown',
          adjustedSchedule: action === 'Reschedule' ? 
            this._suggestRescheduleTime(route, impactAnalysis.find(a => a.routeId === routeId)) : 
            'Maintain with delay expectations'
        };
      }),
      summary: {
        routesToReschedule: Object.values(routeRecommendations).filter(action => action === 'Reschedule').length,
        routesToAdjust: Object.values(routeRecommendations).filter(action => action === 'Adjust').length,
        unaffectedRoutes: routes.length - Object.keys(routeRecommendations).length
      }
    };
  }

  static _suggestRescheduleTime(route, analysis) {
    // Suggest reschedule time based on weather impact
    if (!route || !route.scheduledStart || !analysis) {
      return 'Next available clear weather window';
    }
    
    // Parse original schedule time
    const originalTime = new Date(route.scheduledStart);
    
    // Add 24 hours as a simple rescheduling strategy
    const rescheduledTime = new Date(originalTime.getTime() + 24 * 60 * 60 * 1000);
    
    return rescheduledTime.toLocaleString();
  }
}

export default DispatchAIService;
