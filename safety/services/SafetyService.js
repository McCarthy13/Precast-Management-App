/**
 * Safety Module Services
 * Provides API and data handling for the Safety module
 */

import { 
  JSAModel,
  RegulationModel,
  CertificationModel,
  PPEModel,
  PPEIssuanceModel,
  PPEReimbursementModel,
  WorkersCompModel,
  ToolboxTalkModel,
  SafetyTrainingModel,
  TrainingRecordModel
} from '../models/SafetyModel';

/**
 * Service for managing safety-related operations
 */
export class SafetyService {
  /**
   * Get all JSAs (Job Safety Analyses)
   * @param {Object} filters - Optional filters
   * @param {String} filters.title - Filter by title
   * @param {Array} filters.relatedJobs - Filter by related jobs
   * @returns {Promise<Array>} List of JSAs
   */
  async getJSAs(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.title) queryParams.append('title', filters.title);
      if (filters.relatedJobs) {
        filters.relatedJobs.forEach(job => queryParams.append('relatedJobs', job));
      }
      
      const response = await fetch(`/api/safety/jsas?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch JSAs');
      }
      
      const data = await response.json();
      return data.map(item => new JSAModel(item));
    } catch (error) {
      console.error('Error fetching JSAs:', error);
      throw error;
    }
  }
  
  /**
   * Get a single JSA by ID
   * @param {String} id - JSA ID
   * @returns {Promise<JSAModel>} JSA
   */
  async getJSA(id) {
    try {
      const response = await fetch(`/api/safety/jsas/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch JSA with ID ${id}`);
      }
      
      const data = await response.json();
      return new JSAModel(data);
    } catch (error) {
      console.error(`Error fetching JSA ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new JSA
   * @param {JSAModel} jsa - JSA data
   * @returns {Promise<JSAModel>} Created JSA
   */
  async createJSA(jsa) {
    try {
      const response = await fetch('/api/safety/jsas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsa),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create JSA');
      }
      
      const data = await response.json();
      return new JSAModel(data);
    } catch (error) {
      console.error('Error creating JSA:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing JSA
   * @param {String} id - JSA ID
   * @param {JSAModel} jsa - Updated JSA data
   * @returns {Promise<JSAModel>} Updated JSA
   */
  async updateJSA(id, jsa) {
    try {
      const response = await fetch(`/api/safety/jsas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsa),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update JSA with ID ${id}`);
      }
      
      const data = await response.json();
      return new JSAModel(data);
    } catch (error) {
      console.error(`Error updating JSA ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Search OSHA regulations
   * @param {Object} filters - Search filters
   * @param {String} filters.query - Search query
   * @param {String} filters.category - Filter by category
   * @returns {Promise<Array>} List of regulations
   */
  async searchRegulations(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.query) queryParams.append('query', filters.query);
      if (filters.category) queryParams.append('category', filters.category);
      
      const response = await fetch(`/api/safety/regulations/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search regulations');
      }
      
      const data = await response.json();
      return data.map(item => new RegulationModel(item));
    } catch (error) {
      console.error('Error searching regulations:', error);
      throw error;
    }
  }
  
  /**
   * Get a single regulation by ID
   * @param {String} id - Regulation ID
   * @returns {Promise<RegulationModel>} Regulation
   */
  async getRegulation(id) {
    try {
      const response = await fetch(`/api/safety/regulations/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch regulation with ID ${id}`);
      }
      
      const data = await response.json();
      return new RegulationModel(data);
    } catch (error) {
      console.error(`Error fetching regulation ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get employee certifications
   * @param {Object} filters - Optional filters
   * @param {String} filters.employeeId - Filter by employee ID
   * @param {String} filters.status - Filter by status
   * @param {String} filters.certificationType - Filter by certification type
   * @returns {Promise<Array>} List of certifications
   */
  async getCertifications(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.certificationType) queryParams.append('certificationType', filters.certificationType);
      
      const response = await fetch(`/api/safety/certifications?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch certifications');
      }
      
      const data = await response.json();
      return data.map(item => new CertificationModel(item));
    } catch (error) {
      console.error('Error fetching certifications:', error);
      throw error;
    }
  }
  
  /**
   * Create a new certification
   * @param {CertificationModel} certification - Certification data
   * @returns {Promise<CertificationModel>} Created certification
   */
  async createCertification(certification) {
    try {
      const response = await fetch('/api/safety/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certification),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create certification');
      }
      
      const data = await response.json();
      return new CertificationModel(data);
    } catch (error) {
      console.error('Error creating certification:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing certification
   * @param {String} id - Certification ID
   * @param {CertificationModel} certification - Updated certification data
   * @returns {Promise<CertificationModel>} Updated certification
   */
  async updateCertification(id, certification) {
    try {
      const response = await fetch(`/api/safety/certifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certification),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update certification with ID ${id}`);
      }
      
      const data = await response.json();
      return new CertificationModel(data);
    } catch (error) {
      console.error(`Error updating certification ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get PPE requirements
   * @param {Object} filters - Optional filters
   * @param {String} filters.category - Filter by category
   * @param {Array} filters.requiredFor - Filter by required job types/tasks
   * @returns {Promise<Array>} List of PPE items
   */
  async getPPERequirements(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.requiredFor) {
        filters.requiredFor.forEach(job => queryParams.append('requiredFor', job));
      }
      
      const response = await fetch(`/api/safety/ppe?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PPE requirements');
      }
      
      const data = await response.json();
      return data.map(item => new PPEModel(item));
    } catch (error) {
      console.error('Error fetching PPE requirements:', error);
      throw error;
    }
  }
  
  /**
   * Create a new PPE issuance record
   * @param {PPEIssuanceModel} issuance - PPE issuance data
   * @returns {Promise<PPEIssuanceModel>} Created issuance record
   */
  async createPPEIssuance(issuance) {
    try {
      const response = await fetch('/api/safety/ppe/issuances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issuance),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create PPE issuance record');
      }
      
      const data = await response.json();
      return new PPEIssuanceModel(data);
    } catch (error) {
      console.error('Error creating PPE issuance record:', error);
      throw error;
    }
  }
  
  /**
   * Get PPE issuance records
   * @param {Object} filters - Optional filters
   * @param {String} filters.employeeId - Filter by employee ID
   * @param {String} filters.ppeId - Filter by PPE ID
   * @returns {Promise<Array>} List of PPE issuance records
   */
  async getPPEIssuances(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
      if (filters.ppeId) queryParams.append('ppeId', filters.ppeId);
      
      const response = await fetch(`/api/safety/ppe/issuances?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PPE issuance records');
      }
      
      const data = await response.json();
      return data.map(item => new PPEIssuanceModel(item));
    } catch (error) {
      console.error('Error fetching PPE issuance records:', error);
      throw error;
    }
  }
  
  /**
   * Submit a PPE reimbursement request
   * @param {PPEReimbursementModel} reimbursement - Reimbursement request data
   * @returns {Promise<PPEReimbursementModel>} Created reimbursement request
   */
  async submitPPEReimbursement(reimbursement) {
    try {
      const response = await fetch('/api/safety/ppe/reimbursements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reimbursement),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit PPE reimbursement request');
      }
      
      const data = await response.json();
      return new PPEReimbursementModel(data);
    } catch (error) {
      console.error('Error submitting PPE reimbursement request:', error);
      throw error;
    }
  }
  
  /**
   * Approve or reject a PPE reimbursement request
   * @param {String} id - Reimbursement request ID
   * @param {Object} approval - Approval data
   * @param {String} approval.status - New status (Approved or Rejected)
   * @param {String} approval.approvedBy - User ID who approved/rejected
   * @param {String} approval.notes - Notes
   * @returns {Promise<PPEReimbursementModel>} Updated reimbursement request
   */
  async processPPEReimbursement(id, approval) {
    try {
      const response = await fetch(`/api/safety/ppe/reimbursements/${id}/process`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approval),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to process PPE reimbursement request ${id}`);
      }
      
      const data = await response.json();
      return new PPEReimbursementModel(data);
    } catch (error) {
      console.error(`Error processing PPE reimbursement request ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a worker's comp claim
   * @param {WorkersCompModel} claim - Worker's comp claim data
   * @returns {Promise<WorkersCompModel>} Created claim
   */
  async createWorkersCompClaim(claim) {
    try {
      const response = await fetch('/api/safety/workers-comp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claim),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create worker\'s comp claim');
      }
      
      const data = await response.json();
      return new WorkersCompModel(data);
    } catch (error) {
      console.error('Error creating worker\'s comp claim:', error);
      throw error;
    }
  }
  
  /**
   * Get worker's comp claims
   * @param {Object} filters - Optional filters
   * @param {String} filters.employeeId - Filter by employee ID
   * @param {String} filters.status - Filter by status
   * @returns {Promise<Array>} List of worker's comp claims
   */
  async getWorkersCompClaims(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
      if (filters.status) queryParams.append('status', filters.status);
      
      const response = await fetch(`/api/safety/workers-comp?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch worker\'s comp claims');
      }
      
      const data = await response.json();
      return data.map(item => new WorkersCompModel(item));
    } catch (error) {
      console.error('Error fetching worker\'s comp claims:', error);
      throw error;
    }
  }
  
  /**
   * Update a worker's comp claim
   * @param {String} id - Claim ID
   * @param {WorkersCompModel} claim - Updated claim data
   * @returns {Promise<WorkersCompModel>} Updated claim
   */
  async updateWorkersCompClaim(id, claim) {
    try {
      const response = await fetch(`/api/safety/workers-comp/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claim),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update worker's comp claim ${id}`);
      }
      
      const data = await response.json();
      return new WorkersCompModel(data);
    } catch (error) {
      console.error(`Error updating worker's comp claim ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Schedule a toolbox talk
   * @param {ToolboxTalkModel} talk - Toolbox talk data
   * @returns {Promise<ToolboxTalkModel>} Scheduled toolbox talk
   */
  async scheduleToolboxTalk(talk) {
    try {
      const response = await fetch('/api/safety/toolbox-talks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(talk),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule toolbox talk');
      }
      
      const data = await response.json();
      return new ToolboxTalkModel(data);
    } catch (error) {
      console.error('Error scheduling toolbox talk:', error);
      throw error;
    }
  }
  
  /**
   * Get toolbox talks
   * @param {Object} filters - Optional filters
   * @param {String} filters.status - Filter by status
   * @param {String} filters.topic - Filter by topic
   * @returns {Promise<Array>} List of toolbox talks
   */
  async getToolboxTalks(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.topic) queryParams.append('topic', filters.topic);
      
      const response = await fetch(`/api/safety/toolbox-talks?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch toolbox talks');
      }
      
      const data = await response.json();
      return data.map(item => new ToolboxTalkModel(item));
    } catch (error) {
      console.error('Error fetching toolbox talks:', error);
      throw error;
    }
  }
  
  /**
   * Record toolbox talk completion
   * @param {String} id - Toolbox talk ID
   * @param {Object} completion - Completion data
   * @param {Date} completion.conductedDate - Date conducted
   * @param {String} completion.conductor - User ID who conducted
   * @param {Array} completion.attendees - List of attendee IDs
   * @param {String} completion.notes - Notes
   * @returns {Promise<ToolboxTalkModel>} Updated toolbox talk
   */
  async completeToolboxTalk(id, completion) {
    try {
      const response = await fetch(`/api/safety/toolbox-talks/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completion),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to complete toolbox talk ${id}`);
      }
      
      const data = await response.json();
      return new ToolboxTalkModel(data);
    } catch (error) {
      console.error(`Error completing toolbox talk ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get safety trainings
   * @param {Object} filters - Optional filters
   * @param {String} filters.type - Filter by type
   * @param {String} filters.frequency - Filter by frequency
   * @returns {Promise<Array>} List of safety trainings
   */
  async getSafetyTrainings(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.frequency) queryParams.append('frequency', filters.frequency);
      
      const response = await fetch(`/api/safety/trainings?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch safety trainings');
      }
      
      const data = await response.json();
      return data.map(item => new SafetyTrainingModel(item));
    } catch (error) {
      console.error('Error fetching safety trainings:', error);
      throw error;
    }
  }
  
  /**
   * Create a new safety training
   * @param {SafetyTrainingModel} training - Safety training data
   * @returns {Promise<SafetyTrainingModel>} Created safety training
   */
  async createSafetyTraining(training) {
    try {
      const response = await fetch('/api/safety/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(training),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create safety training');
      }
      
      const data = await response.json();
      return new SafetyTrainingModel(data);
    } catch (error) {
      console.error('Error creating safety training:', error);
      throw error;
    }
  }
  
  /**
   * Record employee training completion
   * @param {TrainingRecordModel} record - Training record data
   * @returns {Promise<TrainingRecordModel>} Created training record
   */
  async recordTrainingCompletion(record) {
    try {
      const response = await fetch('/api/safety/training-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      if (!response.ok) {
        throw new Error('Failed to record training completion');
      }
      
      const data = await response.json();
      return new TrainingRecordModel(data);
    } catch (error) {
      console.error('Error recording training completion:', error);
      throw error;
    }
  }
  
  /**
   * Get employee training records
   * @param {Object} filters - Optional filters
   * @param {String} filters.employeeId - Filter by employee ID
   * @param {String} filters.trainingId - Filter by training ID
   * @returns {Promise<Array>} List of training records
   */
  async getTrainingRecords(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
      if (filters.trainingId) queryParams.append('trainingId', filters.trainingId);
      
      const response = await fetch(`/api/safety/training-records?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch training records');
      }
      
      const data = await response.json();
      return data.map(item => new TrainingRecordModel(item));
    } catch (error) {
      console.error('Error fetching training records:', error);
      throw error;
    }
  }
  
  /**
   * Get employees due for training
   * @param {Object} filters - Optional filters
   * @param {String} filters.trainingId - Filter by training ID
   * @param {Number} filters.daysUntilExpiration - Filter by days until expiration
   * @returns {Promise<Array>} List of employees due for training
   */
  async getEmployeesDueForTraining(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.trainingId) queryParams.append('trainingId', filters.trainingId);
      if (filters.daysUntilExpiration) queryParams.append('daysUntilExpiration', filters.daysUntilExpiration);
      
      const response = await fetch(`/api/safety/employees-due-for-training?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees due for training');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees due for training:', error);
      throw error;
    }
  }
  
  /**
   * Get employees with expiring certifications
   * @param {Object} filters - Optional filters
   * @param {String} filters.certificationType - Filter by certification type
   * @param {Number} filters.daysUntilExpiration - Filter by days until expiration
   * @returns {Promise<Array>} List of employees with expiring certifications
   */
  async getEmployeesWithExpiringCertifications(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.certificationType) queryParams.append('certificationType', filters.certificationType);
      if (filters.daysUntilExpiration) queryParams.append('daysUntilExpiration', filters.daysUntilExpiration);
      
      const response = await fetch(`/api/safety/employees-expiring-certifications?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees with expiring certifications');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees with expiring certifications:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const safetyService = new SafetyService();
