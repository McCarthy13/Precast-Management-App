/**
 * HR/Personnel Management Services
 * Provides business logic and data access for the HR/Personnel Management module
 */

import prisma from '../../../lib/prisma';
import { 
  EmployeeModel, 
  CertificationModel, 
  TrainingRecordModel,
  TimeEntryModel,
  TimesheetModel,
  LeaveRequestModel,
  LeaveBalanceModel,
  PerformanceReviewModel,
  EmployeeDocumentModel,
  PayrollRecordModel,
  BenefitPlanModel,
  BenefitEnrollmentModel,
  DependentModel,
  JobPositionModel,
  ScheduleModel,
  ShiftModel,
  ShiftSwapRequestModel
} from '../models/HRPersonnelModel';

export class HRPersonnelService {
  /**
   * Employee Management
   */
  async getEmployees(filters = {}) {
    try {
      const { department, position, employmentType, employmentStatus, search } = filters;
      
      const whereClause = {};
      if (department) whereClause.department = department;
      if (position) whereClause.position = position;
      if (employmentType) whereClause.employmentType = employmentType;
      if (employmentStatus) whereClause.employmentStatus = employmentStatus;
      
      if (search) {
        whereClause.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { employeeId: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const employees = await prisma.employee.findMany({
        where: whereClause,
        orderBy: { lastName: 'asc' }
      });
      
      return employees.map(employee => new EmployeeModel(employee));
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }
  
  async getEmployeeById(id) {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          certifications: {
            where: { status: 'ACTIVE' }
          },
          trainingRecords: {
            orderBy: { completionDate: 'desc' },
            take: 5
          },
          leaveBalance: {
            where: { year: new Date().getFullYear() }
          },
          benefitEnrollments: {
            where: { status: 'ACTIVE' },
            include: {
              benefitPlan: true
            }
          },
          dependents: true
        }
      });
      
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      return new EmployeeModel({
        ...employee,
        certifications: employee.certifications.map(cert => new CertificationModel(cert)),
        trainingRecords: employee.trainingRecords.map(record => new TrainingRecordModel(record)),
        leaveBalance: employee.leaveBalance ? new LeaveBalanceModel(employee.leaveBalance) : null,
        benefitEnrollments: employee.benefitEnrollments.map(enrollment => new BenefitEnrollmentModel({
          ...enrollment,
          planName: enrollment.benefitPlan.name,
          planType: enrollment.benefitPlan.type
        })),
        dependents: employee.dependents.map(dependent => new DependentModel(dependent))
      });
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw new Error('Failed to fetch employee');
    }
  }
  
  async createEmployee(employeeData) {
    try {
      // Generate employee ID if not provided
      if (!employeeData.employeeId) {
        employeeData.employeeId = await this.generateEmployeeId();
      }
      
      // Create user in auth system (this would typically use an auth service)
      const authUser = await this.createAuthUser(employeeData);
      
      // Create employee
      const employee = await prisma.employee.create({
        data: {
          userId: authUser.id,
          employeeId: employeeData.employeeId,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          phone: employeeData.phone,
          address: employeeData.address,
          dateOfBirth: employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth) : null,
          ssn: employeeData.ssn,
          gender: employeeData.gender,
          maritalStatus: employeeData.maritalStatus,
          emergencyContact: employeeData.emergencyContact,
          department: employeeData.department,
          position: employeeData.position,
          supervisor: employeeData.supervisor,
          employmentType: employeeData.employmentType,
          employmentStatus: employeeData.employmentStatus || 'ACTIVE',
          hireDate: employeeData.hireDate ? new Date(employeeData.hireDate) : new Date(),
          salary: employeeData.salary,
          payRate: employeeData.payRate,
          payType: employeeData.payType,
          payFrequency: employeeData.payFrequency,
          bankInfo: employeeData.bankInfo,
          taxInfo: employeeData.taxInfo,
          benefits: employeeData.benefits || [],
          photo: employeeData.photo,
          notes: employeeData.notes,
          customFields: employeeData.customFields
        }
      });
      
      // Initialize leave balance for the employee
      await this.initializeLeaveBalance(employee.id);
      
      return new EmployeeModel(employee);
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  }
  
  async updateEmployee(id, employeeData) {
    try {
      const employee = await prisma.employee.update({
        where: { id },
        data: {
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          phone: employeeData.phone,
          address: employeeData.address,
          dateOfBirth: employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth) : null,
          ssn: employeeData.ssn,
          gender: employeeData.gender,
          maritalStatus: employeeData.maritalStatus,
          emergencyContact: employeeData.emergencyContact,
          department: employeeData.department,
          position: employeeData.position,
          supervisor: employeeData.supervisor,
          employmentType: employeeData.employmentType,
          employmentStatus: employeeData.employmentStatus,
          hireDate: employeeData.hireDate ? new Date(employeeData.hireDate) : null,
          terminationDate: employeeData.terminationDate ? new Date(employeeData.terminationDate) : null,
          terminationReason: employeeData.terminationReason,
          salary: employeeData.salary,
          payRate: employeeData.payRate,
          payType: employeeData.payType,
          payFrequency: employeeData.payFrequency,
          bankInfo: employeeData.bankInfo,
          taxInfo: employeeData.taxInfo,
          benefits: employeeData.benefits,
          photo: employeeData.photo,
          notes: employeeData.notes,
          customFields: employeeData.customFields,
          updatedAt: new Date()
        }
      });
      
      return new EmployeeModel(employee);
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw new Error('Failed to update employee');
    }
  }
  
  /**
   * Certification Management
   */
  async getEmployeeCertifications(employeeId) {
    try {
      const certifications = await prisma.certification.findMany({
        where: { employeeId },
        orderBy: { expirationDate: 'asc' }
      });
      
      return certifications.map(cert => new CertificationModel(cert));
    } catch (error) {
      console.error(`Error fetching certifications for employee ${employeeId}:`, error);
      throw new Error('Failed to fetch certifications');
    }
  }
  
  async addCertification(certificationData) {
    try {
      const certification = await prisma.certification.create({
        data: {
          employeeId: certificationData.employeeId,
          name: certificationData.name,
          issuingOrganization: certificationData.issuingOrganization,
          certificationNumber: certificationData.certificationNumber,
          issueDate: certificationData.issueDate ? new Date(certificationData.issueDate) : null,
          expirationDate: certificationData.expirationDate ? new Date(certificationData.expirationDate) : null,
          description: certificationData.description,
          documentUrl: certificationData.documentUrl,
          status: certificationData.status || 'ACTIVE',
          reminderEnabled: certificationData.reminderEnabled !== false,
          reminderDays: certificationData.reminderDays || 30
        }
      });
      
      // Schedule expiration reminder if enabled
      if (certification.reminderEnabled && certification.expirationDate) {
        await this.scheduleExpirationReminder('CERTIFICATION', certification.id, certification.expirationDate, certification.reminderDays);
      }
      
      return new CertificationModel(certification);
    } catch (error) {
      console.error('Error adding certification:', error);
      throw new Error('Failed to add certification');
    }
  }
  
  /**
   * Training Management
   */
  async getEmployeeTrainingRecords(employeeId) {
    try {
      const trainingRecords = await prisma.trainingRecord.findMany({
        where: { employeeId },
        orderBy: { completionDate: 'desc' }
      });
      
      return trainingRecords.map(record => new TrainingRecordModel(record));
    } catch (error) {
      console.error(`Error fetching training records for employee ${employeeId}:`, error);
      throw new Error('Failed to fetch training records');
    }
  }
  
  async addTrainingRecord(trainingData) {
    try {
      const trainingRecord = await prisma.trainingRecord.create({
        data: {
          employeeId: trainingData.employeeId,
          trainingName: trainingData.trainingName,
          trainingType: trainingData.trainingType,
          provider: trainingData.provider,
          description: trainingData.description,
          startDate: trainingData.startDate ? new Date(trainingData.startDate) : null,
          completionDate: trainingData.completionDate ? new Date(trainingData.completionDate) : null,
          expirationDate: trainingData.expirationDate ? new Date(trainingData.expirationDate) : null,
          duration: trainingData.duration,
          location: trainingData.location,
          status: trainingData.status || 'COMPLETED',
          score: trainingData.score,
          passingScore: trainingData.passingScore,
          certificateUrl: trainingData.certificateUrl,
          notes: trainingData.notes,
          reminderEnabled: trainingData.reminderEnabled || false,
          reminderDays: trainingData.reminderDays || 30
        }
      });
      
      // Schedule expiration reminder if enabled
      if (trainingRecord.reminderEnabled && trainingRecord.expirationDate) {
        await this.scheduleExpirationReminder('TRAINING', trainingRecord.id, trainingRecord.expirationDate, trainingRecord.reminderDays);
      }
      
      return new TrainingRecordModel(trainingRecord);
    } catch (error) {
      console.error('Error adding training record:', error);
      throw new Error('Failed to add training record');
    }
  }
  
  /**
   * Time Tracking
   */
  async getTimeEntries(filters = {}) {
    try {
      const { employeeId, date, dateFrom, dateTo, status, projectId } = filters;
      
      const whereClause = {};
      if (employeeId) whereClause.employeeId = employeeId;
      if (date) whereClause.date = date;
      if (status) whereClause.status = status;
      if (projectId) whereClause.projectId = projectId;
      
      if (dateFrom && dateTo) {
        whereClause.date = {
          gte: dateFrom,
          lte: dateTo
        };
      }
      
      const timeEntries = await prisma.timeEntry.findMany({
        where: whereClause,
        orderBy: [
          { date: 'desc' },
          { clockInTime: 'desc' }
        ],
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return timeEntries.map(entry => new TimeEntryModel({
        ...entry,
        employeeName: `${entry.employee.firstName} ${entry.employee.lastName}`,
        projectName: entry.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw new Error('Failed to fetch time entries');
    }
  }
  
  async clockIn(employeeId, data = {}) {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Check if employee already clocked in today
      const existingEntry = await prisma.timeEntry.findFirst({
        where: {
          employeeId,
          date: today,
          clockOutTime: null
        }
      });
      
      if (existingEntry) {
        throw new Error('Employee already clocked in');
      }
      
      const timeEntry = await prisma.timeEntry.create({
        data: {
          employeeId,
          date: today,
          clockInTime: now.toISOString(),
          projectId: data.projectId,
          taskId: data.taskId,
          notes: data.notes,
          status: 'PENDING'
        }
      });
      
      return new TimeEntryModel(timeEntry);
    } catch (error) {
      console.error(`Error clocking in employee ${employeeId}:`, error);
      throw new Error('Failed to clock in');
    }
  }
  
  async clockOut(employeeId) {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Find active time entry
      const activeEntry = await prisma.timeEntry.findFirst({
        where: {
          employeeId,
          date: today,
          clockOutTime: null
        }
      });
      
      if (!activeEntry) {
        throw new Error('No active clock-in found');
      }
      
      // Calculate hours
      const clockInTime = new Date(activeEntry.clockInTime);
      let totalHours = (now - clockInTime) / (1000 * 60 * 60);
      
      // Subtract break time if applicable
      if (activeEntry.breakStartTime && activeEntry.breakEndTime) {
        const breakStart = new Date(activeEntry.breakStartTime);
        const breakEnd = new Date(activeEntry.breakEndTime);
        const breakHours = (breakEnd - breakStart) / (1000 * 60 * 60);
        totalHours -= breakHours;
      }
      
      // Calculate regular and overtime hours
      const regularHours = Math.min(totalHours, 8);
      const overtimeHours = Math.max(0, totalHours - 8);
      
      const timeEntry = await prisma.timeEntry.update({
        where: { id: activeEntry.id },
        data: {
          clockOutTime: now.toISOString(),
          totalHours,
          regularHours,
          overtimeHours,
          updatedAt: now
        }
      });
      
      return new TimeEntryModel(timeEntry);
    } catch (error) {
      console.error(`Error clocking out employee ${employeeId}:`, error);
      throw new Error('Failed to clock out');
    }
  }
  
  async startBreak(employeeId) {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Find active time entry
      const activeEntry = await prisma.timeEntry.findFirst({
        where: {
          employeeId,
          date: today,
          clockOutTime: null
        }
      });
      
      if (!activeEntry) {
        throw new Error('No active clock-in found');
      }
      
      if (activeEntry.breakStartTime && !activeEntry.breakEndTime) {
        throw new Error('Break already started');
      }
      
      const timeEntry = await prisma.timeEntry.update({
        where: { id: activeEntry.id },
        data: {
          breakStartTime: now.toISOString(),
          updatedAt: now
        }
      });
      
      return new TimeEntryModel(timeEntry);
    } catch (error) {
      console.error(`Error starting break for employee ${employeeId}:`, error);
      throw new Error('Failed to start break');
    }
  }
  
  async endBreak(employeeId) {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Find active time entry with active break
      const activeEntry = await prisma.timeEntry.findFirst({
        where: {
          employeeId,
          date: today,
          clockOutTime: null,
          breakStartTime: { not: null },
          breakEndTime: null
        }
      });
      
      if (!activeEntry) {
        throw new Error('No active break found');
      }
      
      const timeEntry = await prisma.timeEntry.update({
        where: { id: activeEntry.id },
        data: {
          breakEndTime: now.toISOString(),
          updatedAt: now
        }
      });
      
      return new TimeEntryModel(timeEntry);
    } catch (error) {
      console.error(`Error ending break for employee ${employeeId}:`, error);
      throw new Error('Failed to end break');
    }
  }
  
  /**
   * Timesheet Management
   */
  async getTimesheets(filters = {}) {
    try {
      const { employeeId, status, startDate, endDate } = filters;
      
      const whereClause = {};
      if (employeeId) whereClause.employeeId = employeeId;
      if (status) whereClause.status = status;
      
      if (startDate) {
        whereClause.startDate = {
          gte: startDate
        };
      }
      
      if (endDate) {
        whereClause.endDate = {
          lte: endDate
        };
      }
      
      const timesheets = await prisma.timesheet.findMany({
        where: whereClause,
        orderBy: { startDate: 'desc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          timeEntries: true
        }
      });
      
      return timesheets.map(timesheet => new TimesheetModel({
        ...timesheet,
        employeeName: `${timesheet.employee.firstName} ${timesheet.employee.lastName}`,
        timeEntries: timesheet.timeEntries.map(entry => new TimeEntryModel(entry))
      }));
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      throw new Error('Failed to fetch timesheets');
    }
  }
  
  async createTimesheet(timesheetData) {
    try {
      // Validate date range
      if (!timesheetData.startDate || !timesheetData.endDate) {
        throw new Error('Start date and end date are required');
      }
      
      const startDate = new Date(timesheetData.startDate);
      const endDate = new Date(timesheetData.endDate);
      
      if (startDate > endDate) {
        throw new Error('Start date must be before end date');
      }
      
      // Check for existing timesheet in the same period
      const existingTimesheet = await prisma.timesheet.findFirst({
        where: {
          employeeId: timesheetData.employeeId,
          OR: [
            {
              startDate: {
                lte: endDate
              },
              endDate: {
                gte: startDate
              }
            }
          ]
        }
      });
      
      if (existingTimesheet) {
        throw new Error('A timesheet already exists for this period');
      }
      
      // Get time entries for the period
      const timeEntries = await prisma.timeEntry.findMany({
        where: {
          employeeId: timesheetData.employeeId,
          date: {
            gte: startDate.toISOString().split('T')[0],
            lte: endDate.toISOString().split('T')[0]
          }
        }
      });
      
      // Calculate totals
      let totalHours = 0;
      let regularHours = 0;
      let overtimeHours = 0;
      let doubleTimeHours = 0;
      
      timeEntries.forEach(entry => {
        totalHours += entry.totalHours || 0;
        regularHours += entry.regularHours || 0;
        overtimeHours += entry.overtimeHours || 0;
        doubleTimeHours += entry.doubleTimeHours || 0;
      });
      
      // Create timesheet
      const timesheet = await prisma.timesheet.create({
        data: {
          employeeId: timesheetData.employeeId,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          status: timesheetData.status || 'PENDING',
          totalHours,
          regularHours,
          overtimeHours,
          doubleTimeHours,
          notes: timesheetData.notes,
          timeEntries: {
            connect: timeEntries.map(entry => ({ id: entry.id }))
          }
        }
      });
      
      return new TimesheetModel({
        ...timesheet,
        timeEntries: timeEntries.map(entry => new TimeEntryModel(entry))
      });
    } catch (error) {
      console.error('Error creating timesheet:', error);
      throw new Error('Failed to create timesheet');
    }
  }
  
  async submitTimesheet(timesheetId, employeeId) {
    try {
      // Validate timesheet belongs to employee
      const timesheet = await prisma.timesheet.findFirst({
        where: {
          id: timesheetId,
          employeeId
        }
      });
      
      if (!timesheet) {
        throw new Error('Timesheet not found or does not belong to this employee');
      }
      
      if (timesheet.status !== 'PENDING') {
        throw new Error('Timesheet has already been submitted');
      }
      
      const updatedTimesheet = await prisma.timesheet.update({
        where: { id: timesheetId },
        data: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      // Notify supervisor
      await this.notifySupervisorForTimesheetApproval(updatedTimesheet);
      
      return new TimesheetModel(updatedTimesheet);
    } catch (error) {
      console.error(`Error submitting timesheet ${timesheetId}:`, error);
      throw new Error('Failed to submit timesheet');
    }
  }
  
  async approveTimesheet(timesheetId, approverId, notes = '') {
    try {
      const timesheet = await prisma.timesheet.findUnique({
        where: { id: timesheetId }
      });
      
      if (!timesheet) {
        throw new Error('Timesheet not found');
      }
      
      if (timesheet.status !== 'SUBMITTED') {
        throw new Error('Timesheet is not in submitted status');
      }
      
      const updatedTimesheet = await prisma.timesheet.update({
        where: { id: timesheetId },
        data: {
          status: 'APPROVED',
          approvedBy: approverId,
          approvedAt: new Date(),
          notes: notes ? `${timesheet.notes || ''}\nApproval notes: ${notes}` : timesheet.notes,
          updatedAt: new Date()
        }
      });
      
      // Notify payroll
      await this.notifyPayrollForApprovedTimesheet(updatedTimesheet);
      
      return new TimesheetModel(updatedTimesheet);
    } catch (error) {
      console.error(`Error approving timesheet ${timesheetId}:`, error);
      throw new Error('Failed to approve timesheet');
    }
  }
  
  /**
   * Leave Management
   */
  async getLeaveRequests(filters = {}) {
    try {
      const { employeeId, leaveType, status, startDate, endDate } = filters;
      
      const whereClause = {};
      if (employeeId) whereClause.employeeId = employeeId;
      if (leaveType) whereClause.leaveType = leaveType;
      if (status) whereClause.status = status;
      
      if (startDate) {
        whereClause.startDate = {
          gte: new Date(startDate)
        };
      }
      
      if (endDate) {
        whereClause.endDate = {
          lte: new Date(endDate)
        };
      }
      
      const leaveRequests = await prisma.leaveRequest.findMany({
        where: whereClause,
        orderBy: { startDate: 'asc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              department: true
            }
          }
        }
      });
      
      return leaveRequests.map(request => new LeaveRequestModel({
        ...request,
        employeeName: `${request.employee.firstName} ${request.employee.lastName}`,
        department: request.employee.department
      }));
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw new Error('Failed to fetch leave requests');
    }
  }
  
  async requestLeave(leaveData) {
    try {
      // Validate dates
      if (!leaveData.startDate || !leaveData.endDate) {
        throw new Error('Start date and end date are required');
      }
      
      const startDate = new Date(leaveData.startDate);
      const endDate = new Date(leaveData.endDate);
      
      if (startDate > endDate) {
        throw new Error('Start date must be before end date');
      }
      
      // Calculate total days
      const totalDays = this.calculateBusinessDays(startDate, endDate);
      
      // Check leave balance
      const leaveBalance = await this.getEmployeeLeaveBalance(leaveData.employeeId);
      
      if (!leaveBalance) {
        throw new Error('Leave balance not found');
      }
      
      // Validate against leave balance
      let availableDays = 0;
      switch (leaveData.leaveType) {
        case 'VACATION':
          availableDays = leaveBalance.vacationDays.remaining;
          break;
        case 'SICK':
          availableDays = leaveBalance.sickDays.remaining;
          break;
        case 'PERSONAL':
          availableDays = leaveBalance.personalDays.remaining;
          break;
        default:
          // For other leave types, check if defined in additionalLeaveTypes
          if (leaveBalance.additionalLeaveTypes && leaveBalance.additionalLeaveTypes[leaveData.leaveType]) {
            availableDays = leaveBalance.additionalLeaveTypes[leaveData.leaveType].remaining;
          }
      }
      
      // Skip balance check for certain leave types
      const skipBalanceCheck = ['BEREAVEMENT', 'JURY_DUTY', 'MILITARY', 'UNPAID'];
      
      if (!skipBalanceCheck.includes(leaveData.leaveType) && totalDays > availableDays) {
        throw new Error(`Insufficient leave balance. Available: ${availableDays}, Requested: ${totalDays}`);
      }
      
      // Create leave request
      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          employeeId: leaveData.employeeId,
          leaveType: leaveData.leaveType,
          startDate,
          endDate,
          returnDate: leaveData.returnDate ? new Date(leaveData.returnDate) : new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
          totalDays,
          halfDay: leaveData.halfDay || false,
          reason: leaveData.reason,
          status: 'PENDING',
          attachments: leaveData.attachments || [],
          notes: leaveData.notes
        }
      });
      
      // Update leave balance with pending days
      await this.updateLeaveBalancePending(leaveData.employeeId, leaveData.leaveType, totalDays);
      
      // Notify supervisor
      await this.notifySupervisorForLeaveApproval(leaveRequest);
      
      return new LeaveRequestModel(leaveRequest);
    } catch (error) {
      console.error('Error requesting leave:', error);
      throw new Error('Failed to request leave');
    }
  }
  
  async approveLeaveRequest(requestId, approverId, notes = '') {
    try {
      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id: requestId }
      });
      
      if (!leaveRequest) {
        throw new Error('Leave request not found');
      }
      
      if (leaveRequest.status !== 'PENDING') {
        throw new Error('Leave request is not in pending status');
      }
      
      const updatedRequest = await prisma.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          approvedBy: approverId,
          approvedAt: new Date(),
          notes: notes ? `${leaveRequest.notes || ''}\nApproval notes: ${notes}` : leaveRequest.notes,
          updatedAt: new Date()
        }
      });
      
      // Update leave balance
      await this.updateLeaveBalanceOnApproval(leaveRequest.employeeId, leaveRequest.leaveType, leaveRequest.totalDays);
      
      // Notify employee
      await this.notifyEmployeeForLeaveApproval(updatedRequest, 'APPROVED');
      
      return new LeaveRequestModel(updatedRequest);
    } catch (error) {
      console.error(`Error approving leave request ${requestId}:`, error);
      throw new Error('Failed to approve leave request');
    }
  }
  
  async rejectLeaveRequest(requestId, approverId, rejectionReason) {
    try {
      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id: requestId }
      });
      
      if (!leaveRequest) {
        throw new Error('Leave request not found');
      }
      
      if (leaveRequest.status !== 'PENDING') {
        throw new Error('Leave request is not in pending status');
      }
      
      if (!rejectionReason) {
        throw new Error('Rejection reason is required');
      }
      
      const updatedRequest = await prisma.leaveRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          approvedBy: approverId,
          approvedAt: new Date(),
          rejectionReason,
          updatedAt: new Date()
        }
      });
      
      // Remove pending days from leave balance
      await this.updateLeaveBalanceOnRejection(leaveRequest.employeeId, leaveRequest.leaveType, leaveRequest.totalDays);
      
      // Notify employee
      await this.notifyEmployeeForLeaveApproval(updatedRequest, 'REJECTED');
      
      return new LeaveRequestModel(updatedRequest);
    } catch (error) {
      console.error(`Error rejecting leave request ${requestId}:`, error);
      throw new Error('Failed to reject leave request');
    }
  }
  
  async getEmployeeLeaveBalance(employeeId) {
    try {
      const currentYear = new Date().getFullYear();
      
      let leaveBalance = await prisma.leaveBalance.findFirst({
        where: {
          employeeId,
          year: currentYear
        }
      });
      
      if (!leaveBalance) {
        // Initialize leave balance if not found
        leaveBalance = await this.initializeLeaveBalance(employeeId);
      }
      
      return new LeaveBalanceModel(leaveBalance);
    } catch (error) {
      console.error(`Error fetching leave balance for employee ${employeeId}:`, error);
      throw new Error('Failed to fetch leave balance');
    }
  }
  
  /**
   * Performance Review Management
   */
  async getPerformanceReviews(filters = {}) {
    try {
      const { employeeId, reviewerId, reviewType, status, year } = filters;
      
      const whereClause = {};
      if (employeeId) whereClause.employeeId = employeeId;
      if (reviewerId) whereClause.reviewerId = reviewerId;
      if (reviewType) whereClause.reviewType = reviewType;
      if (status) whereClause.status = status;
      
      if (year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        whereClause.reviewPeriodStart = {
          gte: startDate
        };
        whereClause.reviewPeriodEnd = {
          lte: endDate
        };
      }
      
      const reviews = await prisma.performanceReview.findMany({
        where: whereClause,
        orderBy: { scheduledDate: 'desc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              department: true,
              position: true
            }
          },
          reviewer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      
      return reviews.map(review => new PerformanceReviewModel({
        ...review,
        employeeName: `${review.employee.firstName} ${review.employee.lastName}`,
        employeeDepartment: review.employee.department,
        employeePosition: review.employee.position,
        reviewerName: review.reviewer ? `${review.reviewer.firstName} ${review.reviewer.lastName}` : ''
      }));
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      throw new Error('Failed to fetch performance reviews');
    }
  }
  
  /**
   * Employee Document Management
   */
  async getEmployeeDocuments(filters = {}) {
    try {
      const { employeeId, type, status } = filters;
      
      const whereClause = {};
      if (employeeId) whereClause.employeeId = employeeId;
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      const documents = await prisma.employeeDocument.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      
      return documents.map(doc => new EmployeeDocumentModel({
        ...doc,
        employeeName: `${doc.employee.firstName} ${doc.employee.lastName}`
      }));
    } catch (error) {
      console.error('Error fetching employee documents:', error);
      throw new Error('Failed to fetch employee documents');
    }
  }
  
  /**
   * Payroll Management
   */
  async getPayrollRecords(filters = {}) {
    try {
      const { employeeId, status, payPeriodStart, payPeriodEnd } = filters;
      
      const whereClause = {};
      if (employeeId) whereClause.employeeId = employeeId;
      if (status) whereClause.status = status;
      
      if (payPeriodStart) {
        whereClause.payPeriodStart = {
          gte: payPeriodStart
        };
      }
      
      if (payPeriodEnd) {
        whereClause.payPeriodEnd = {
          lte: payPeriodEnd
        };
      }
      
      const payrollRecords = await prisma.payrollRecord.findMany({
        where: whereClause,
        orderBy: { payDate: 'desc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true
            }
          }
        }
      });
      
      return payrollRecords.map(record => new PayrollRecordModel({
        ...record,
        employeeName: `${record.employee.firstName} ${record.employee.lastName}`,
        employeeNumber: record.employee.employeeId
      }));
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      throw new Error('Failed to fetch payroll records');
    }
  }
  
  /**
   * Benefits Management
   */
  async getBenefitPlans(filters = {}) {
    try {
      const { type, status } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      const benefitPlans = await prisma.benefitPlan.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return benefitPlans.map(plan => new BenefitPlanModel(plan));
    } catch (error) {
      console.error('Error fetching benefit plans:', error);
      throw new Error('Failed to fetch benefit plans');
    }
  }
  
  async getEmployeeBenefits(employeeId) {
    try {
      const benefitEnrollments = await prisma.benefitEnrollment.findMany({
        where: {
          employeeId,
          status: 'ACTIVE'
        },
        include: {
          benefitPlan: true,
          dependents: true
        }
      });
      
      return benefitEnrollments.map(enrollment => new BenefitEnrollmentModel({
        ...enrollment,
        planName: enrollment.benefitPlan.name,
        planType: enrollment.benefitPlan.type,
        dependents: enrollment.dependents.map(dependent => new DependentModel(dependent))
      }));
    } catch (error) {
      console.error(`Error fetching benefits for employee ${employeeId}:`, error);
      throw new Error('Failed to fetch employee benefits');
    }
  }
  
  /**
   * Job Position Management
   */
  async getJobPositions(filters = {}) {
    try {
      const { department, isOpen, status } = filters;
      
      const whereClause = {};
      if (department) whereClause.department = department;
      if (isOpen !== undefined) whereClause.isOpen = isOpen;
      if (status) whereClause.status = status;
      
      const positions = await prisma.jobPosition.findMany({
        where: whereClause,
        orderBy: { title: 'asc' }
      });
      
      return positions.map(position => new JobPositionModel(position));
    } catch (error) {
      console.error('Error fetching job positions:', error);
      throw new Error('Failed to fetch job positions');
    }
  }
  
  /**
   * Scheduling
   */
  async getSchedules(filters = {}) {
    try {
      const { department, status, startDate, endDate } = filters;
      
      const whereClause = {};
      if (department) whereClause.department = department;
      if (status) whereClause.status = status;
      
      if (startDate) {
        whereClause.startDate = {
          gte: new Date(startDate)
        };
      }
      
      if (endDate) {
        whereClause.endDate = {
          lte: new Date(endDate)
        };
      }
      
      const schedules = await prisma.schedule.findMany({
        where: whereClause,
        orderBy: { startDate: 'asc' },
        include: {
          shifts: {
            include: {
              employee: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });
      
      return schedules.map(schedule => new ScheduleModel({
        ...schedule,
        shifts: schedule.shifts.map(shift => new ShiftModel({
          ...shift,
          employeeName: shift.employee ? `${shift.employee.firstName} ${shift.employee.lastName}` : ''
        }))
      }));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw new Error('Failed to fetch schedules');
    }
  }
  
  /**
   * Dashboard and Analytics
   */
  async getHRDashboardData() {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      
      // Employee count by department
      const employeesByDepartment = await prisma.employee.groupBy({
        by: ['department'],
        _count: {
          id: true
        },
        where: {
          employmentStatus: 'ACTIVE'
        }
      });
      
      // Employee count by employment type
      const employeesByType = await prisma.employee.groupBy({
        by: ['employmentType'],
        _count: {
          id: true
        },
        where: {
          employmentStatus: 'ACTIVE'
        }
      });
      
      // Upcoming certifications expiring in next 90 days
      const ninetyDaysFromNow = new Date(today);
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
      
      const expiringCertifications = await prisma.certification.findMany({
        where: {
          expirationDate: {
            gte: today,
            lte: ninetyDaysFromNow
          },
          status: 'ACTIVE'
        },
        orderBy: { expirationDate: 'asc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              department: true
            }
          }
        },
        take: 10
      });
      
      // Pending leave requests
      const pendingLeaveRequests = await prisma.leaveRequest.findMany({
        where: {
          status: 'PENDING'
        },
        orderBy: { startDate: 'asc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              department: true
            }
          }
        },
        take: 10
      });
      
      // Upcoming performance reviews
      const upcomingReviews = await prisma.performanceReview.findMany({
        where: {
          scheduledDate: {
            gte: today
          },
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        },
        orderBy: { scheduledDate: 'asc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              department: true,
              position: true
            }
          },
          reviewer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        take: 10
      });
      
      // New hires in current month
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      const newHires = await prisma.employee.findMany({
        where: {
          hireDate: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth
          }
        },
        orderBy: { hireDate: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          department: true,
          position: true,
          hireDate: true
        }
      });
      
      // Open positions
      const openPositions = await prisma.jobPosition.findMany({
        where: {
          isOpen: true,
          status: 'ACTIVE'
        },
        orderBy: { updatedAt: 'desc' }
      });
      
      return {
        employeesByDepartment,
        employeesByType,
        expiringCertifications: expiringCertifications.map(cert => ({
          ...new CertificationModel(cert),
          employeeName: `${cert.employee.firstName} ${cert.employee.lastName}`,
          department: cert.employee.department
        })),
        pendingLeaveRequests: pendingLeaveRequests.map(request => ({
          ...new LeaveRequestModel(request),
          employeeName: `${request.employee.firstName} ${request.employee.lastName}`,
          department: request.employee.department
        })),
        upcomingReviews: upcomingReviews.map(review => ({
          ...new PerformanceReviewModel(review),
          employeeName: `${review.employee.firstName} ${review.employee.lastName}`,
          department: review.employee.department,
          position: review.employee.position,
          reviewerName: review.reviewer ? `${review.reviewer.firstName} ${review.reviewer.lastName}` : ''
        })),
        newHires,
        openPositions: openPositions.map(position => new JobPositionModel(position))
      };
    } catch (error) {
      console.error('Error fetching HR dashboard data:', error);
      throw new Error('Failed to fetch HR dashboard data');
    }
  }
  
  /**
   * Helper Methods
   */
  async generateEmployeeId() {
    // Format: EMP-YYYYMM-XXXX where XXXX is a sequential number
    const today = new Date();
    const yearMonth = today.getFullYear().toString() +
                     (today.getMonth() + 1).toString().padStart(2, '0');
    
    // Get the latest employee ID
    const latestEmployee = await prisma.employee.findFirst({
      where: {
        employeeId: {
          startsWith: `EMP-${yearMonth}`
        }
      },
      orderBy: {
        employeeId: 'desc'
      }
    });
    
    let sequenceNumber = 1;
    if (latestEmployee) {
      const parts = latestEmployee.employeeId.split('-');
      if (parts.length === 3) {
        sequenceNumber = parseInt(parts[2]) + 1;
      }
    }
    
    return `EMP-${yearMonth}-${sequenceNumber.toString().padStart(4, '0')}`;
  }
  
  async createAuthUser(userData) {
    // This would typically use an auth service like Auth0, Firebase Auth, etc.
    // For now, we'll just return a mock user
    return {
      id: 'auth_' + Math.random().toString(36).substring(2, 15),
      email: userData.email
    };
  }
  
  async initializeLeaveBalance(employeeId) {
    try {
      const currentYear = new Date().getFullYear();
      
      // Get employee to check employment type
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: {
          employmentType: true,
          hireDate: true
        }
      });
      
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      // Calculate prorated entitlement based on hire date
      const hireDate = new Date(employee.hireDate);
      const isCurrentYearHire = hireDate.getFullYear() === currentYear;
      
      // Default entitlements
      let vacationEntitled = 10; // 10 days per year
      let sickEntitled = 5;      // 5 days per year
      let personalEntitled = 3;  // 3 days per year
      
      // Adjust for employment type
      if (employee.employmentType === 'PART_TIME') {
        vacationEntitled = 5;
        sickEntitled = 3;
        personalEntitled = 1;
      } else if (employee.employmentType === 'CONTRACT' || employee.employmentType === 'TEMPORARY') {
        vacationEntitled = 0;
        sickEntitled = 0;
        personalEntitled = 0;
      }
      
      // Prorate if hired in current year
      if (isCurrentYearHire) {
        const fullYearDays = 365;
        const hireDay = Math.floor((hireDate - new Date(currentYear, 0, 1)) / (24 * 60 * 60 * 1000)) + 1;
        const remainingDays = fullYearDays - hireDay;
        const prorationFactor = remainingDays / fullYearDays;
        
        vacationEntitled = Math.round(vacationEntitled * prorationFactor);
        sickEntitled = Math.round(sickEntitled * prorationFactor);
        personalEntitled = Math.round(personalEntitled * prorationFactor);
      }
      
      // Create leave balance
      const leaveBalance = await prisma.leaveBalance.create({
        data: {
          employeeId,
          year: currentYear,
          vacationDays: {
            entitled: vacationEntitled,
            used: 0,
            pending: 0,
            remaining: vacationEntitled
          },
          sickDays: {
            entitled: sickEntitled,
            used: 0,
            pending: 0,
            remaining: sickEntitled
          },
          personalDays: {
            entitled: personalEntitled,
            used: 0,
            pending: 0,
            remaining: personalEntitled
          },
          carryOverDays: 0,
          additionalLeaveTypes: {},
          lastUpdated: new Date()
        }
      });
      
      return new LeaveBalanceModel(leaveBalance);
    } catch (error) {
      console.error(`Error initializing leave balance for employee ${employeeId}:`, error);
      throw new Error('Failed to initialize leave balance');
    }
  }
  
  async updateLeaveBalancePending(employeeId, leaveType, days) {
    try {
      const currentYear = new Date().getFullYear();
      
      const leaveBalance = await prisma.leaveBalance.findFirst({
        where: {
          employeeId,
          year: currentYear
        }
      });
      
      if (!leaveBalance) {
        throw new Error('Leave balance not found');
      }
      
      // Update the appropriate leave type
      let updatedBalance;
      switch (leaveType) {
        case 'VACATION':
          updatedBalance = {
            vacationDays: {
              entitled: leaveBalance.vacationDays.entitled,
              used: leaveBalance.vacationDays.used,
              pending: leaveBalance.vacationDays.pending + days,
              remaining: leaveBalance.vacationDays.remaining - days
            }
          };
          break;
        case 'SICK':
          updatedBalance = {
            sickDays: {
              entitled: leaveBalance.sickDays.entitled,
              used: leaveBalance.sickDays.used,
              pending: leaveBalance.sickDays.pending + days,
              remaining: leaveBalance.sickDays.remaining - days
            }
          };
          break;
        case 'PERSONAL':
          updatedBalance = {
            personalDays: {
              entitled: leaveBalance.personalDays.entitled,
              used: leaveBalance.personalDays.used,
              pending: leaveBalance.personalDays.pending + days,
              remaining: leaveBalance.personalDays.remaining - days
            }
          };
          break;
        default:
          // For other leave types, check if defined in additionalLeaveTypes
          if (leaveBalance.additionalLeaveTypes && leaveBalance.additionalLeaveTypes[leaveType]) {
            const currentType = leaveBalance.additionalLeaveTypes[leaveType];
            const updatedType = {
              entitled: currentType.entitled,
              used: currentType.used,
              pending: currentType.pending + days,
              remaining: currentType.remaining - days
            };
            
            updatedBalance = {
              additionalLeaveTypes: {
                ...leaveBalance.additionalLeaveTypes,
                [leaveType]: updatedType
              }
            };
          } else {
            // Skip for leave types that don't affect balance
            return;
          }
      }
      
      await prisma.leaveBalance.update({
        where: { id: leaveBalance.id },
        data: {
          ...updatedBalance,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error(`Error updating leave balance pending for employee ${employeeId}:`, error);
      throw new Error('Failed to update leave balance');
    }
  }
  
  async updateLeaveBalanceOnApproval(employeeId, leaveType, days) {
    try {
      const currentYear = new Date().getFullYear();
      
      const leaveBalance = await prisma.leaveBalance.findFirst({
        where: {
          employeeId,
          year: currentYear
        }
      });
      
      if (!leaveBalance) {
        throw new Error('Leave balance not found');
      }
      
      // Update the appropriate leave type
      let updatedBalance;
      switch (leaveType) {
        case 'VACATION':
          updatedBalance = {
            vacationDays: {
              entitled: leaveBalance.vacationDays.entitled,
              used: leaveBalance.vacationDays.used + days,
              pending: leaveBalance.vacationDays.pending - days,
              remaining: leaveBalance.vacationDays.remaining
            }
          };
          break;
        case 'SICK':
          updatedBalance = {
            sickDays: {
              entitled: leaveBalance.sickDays.entitled,
              used: leaveBalance.sickDays.used + days,
              pending: leaveBalance.sickDays.pending - days,
              remaining: leaveBalance.sickDays.remaining
            }
          };
          break;
        case 'PERSONAL':
          updatedBalance = {
            personalDays: {
              entitled: leaveBalance.personalDays.entitled,
              used: leaveBalance.personalDays.used + days,
              pending: leaveBalance.personalDays.pending - days,
              remaining: leaveBalance.personalDays.remaining
            }
          };
          break;
        default:
          // For other leave types, check if defined in additionalLeaveTypes
          if (leaveBalance.additionalLeaveTypes && leaveBalance.additionalLeaveTypes[leaveType]) {
            const currentType = leaveBalance.additionalLeaveTypes[leaveType];
            const updatedType = {
              entitled: currentType.entitled,
              used: currentType.used + days,
              pending: currentType.pending - days,
              remaining: currentType.remaining
            };
            
            updatedBalance = {
              additionalLeaveTypes: {
                ...leaveBalance.additionalLeaveTypes,
                [leaveType]: updatedType
              }
            };
          } else {
            // Skip for leave types that don't affect balance
            return;
          }
      }
      
      await prisma.leaveBalance.update({
        where: { id: leaveBalance.id },
        data: {
          ...updatedBalance,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error(`Error updating leave balance on approval for employee ${employeeId}:`, error);
      throw new Error('Failed to update leave balance');
    }
  }
  
  async updateLeaveBalanceOnRejection(employeeId, leaveType, days) {
    try {
      const currentYear = new Date().getFullYear();
      
      const leaveBalance = await prisma.leaveBalance.findFirst({
        where: {
          employeeId,
          year: currentYear
        }
      });
      
      if (!leaveBalance) {
        throw new Error('Leave balance not found');
      }
      
      // Update the appropriate leave type
      let updatedBalance;
      switch (leaveType) {
        case 'VACATION':
          updatedBalance = {
            vacationDays: {
              entitled: leaveBalance.vacationDays.entitled,
              used: leaveBalance.vacationDays.used,
              pending: leaveBalance.vacationDays.pending - days,
              remaining: leaveBalance.vacationDays.remaining + days
            }
          };
          break;
        case 'SICK':
          updatedBalance = {
            sickDays: {
              entitled: leaveBalance.sickDays.entitled,
              used: leaveBalance.sickDays.used,
              pending: leaveBalance.sickDays.pending - days,
              remaining: leaveBalance.sickDays.remaining + days
            }
          };
          break;
        case 'PERSONAL':
          updatedBalance = {
            personalDays: {
              entitled: leaveBalance.personalDays.entitled,
              used: leaveBalance.personalDays.used,
              pending: leaveBalance.personalDays.pending - days,
              remaining: leaveBalance.personalDays.remaining + days
            }
          };
          break;
        default:
          // For other leave types, check if defined in additionalLeaveTypes
          if (leaveBalance.additionalLeaveTypes && leaveBalance.additionalLeaveTypes[leaveType]) {
            const currentType = leaveBalance.additionalLeaveTypes[leaveType];
            const updatedType = {
              entitled: currentType.entitled,
              used: currentType.used,
              pending: currentType.pending - days,
              remaining: currentType.remaining + days
            };
            
            updatedBalance = {
              additionalLeaveTypes: {
                ...leaveBalance.additionalLeaveTypes,
                [leaveType]: updatedType
              }
            };
          } else {
            // Skip for leave types that don't affect balance
            return;
          }
      }
      
      await prisma.leaveBalance.update({
        where: { id: leaveBalance.id },
        data: {
          ...updatedBalance,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error(`Error updating leave balance on rejection for employee ${employeeId}:`, error);
      throw new Error('Failed to update leave balance');
    }
  }
  
  calculateBusinessDays(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }
  
  async scheduleExpirationReminder(type, id, expirationDate, reminderDays) {
    // This would typically use a scheduling service
    console.log(`Scheduling ${type} expiration reminder for ${id}, ${reminderDays} days before ${expirationDate}`);
    return true;
  }
  
  async notifySupervisorForTimesheetApproval(timesheet) {
    // This would typically send an email or notification
    console.log(`Notifying supervisor for timesheet approval: ${timesheet.id}`);
    return true;
  }
  
  async notifyPayrollForApprovedTimesheet(timesheet) {
    // This would typically send an email or notification
    console.log(`Notifying payroll for approved timesheet: ${timesheet.id}`);
    return true;
  }
  
  async notifySupervisorForLeaveApproval(leaveRequest) {
    // This would typically send an email or notification
    console.log(`Notifying supervisor for leave approval: ${leaveRequest.id}`);
    return true;
  }
  
  async notifyEmployeeForLeaveApproval(leaveRequest, status) {
    // This would typically send an email or notification
    console.log(`Notifying employee for leave ${status}: ${leaveRequest.id}`);
    return true;
  }
}

export default new HRPersonnelService();
