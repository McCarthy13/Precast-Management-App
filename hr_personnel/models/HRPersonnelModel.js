/**
 * HR/Personnel Management Models
 * Defines data models for the HR/Personnel Management module
 */

// Employee Model
export class EmployeeModel {
  constructor(data) {
    this.id = data.id || '';
    this.userId = data.userId || ''; // Reference to main User table
    this.employeeId = data.employeeId || ''; // Company employee ID
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.dateOfBirth = data.dateOfBirth || null;
    this.ssn = data.ssn || ''; // Social Security Number (encrypted)
    this.gender = data.gender || '';
    this.maritalStatus = data.maritalStatus || '';
    this.emergencyContact = data.emergencyContact || {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    };
    this.department = data.department || '';
    this.position = data.position || '';
    this.supervisor = data.supervisor || '';
    this.employmentType = data.employmentType || 'FULL_TIME'; // FULL_TIME, PART_TIME, CONTRACT, TEMPORARY
    this.employmentStatus = data.employmentStatus || 'ACTIVE'; // ACTIVE, ON_LEAVE, TERMINATED
    this.hireDate = data.hireDate || null;
    this.terminationDate = data.terminationDate || null;
    this.terminationReason = data.terminationReason || '';
    this.salary = data.salary || 0;
    this.payRate = data.payRate || 0;
    this.payType = data.payType || 'HOURLY'; // HOURLY, SALARY
    this.payFrequency = data.payFrequency || 'BI_WEEKLY'; // WEEKLY, BI_WEEKLY, MONTHLY
    this.bankInfo = data.bankInfo || {
      accountNumber: '',
      routingNumber: '',
      accountType: '',
      bankName: ''
    };
    this.taxInfo = data.taxInfo || {
      federalFilingStatus: '',
      stateFilingStatus: '',
      federalAllowances: 0,
      stateAllowances: 0,
      additionalWithholding: 0
    };
    this.benefits = data.benefits || [];
    this.photo = data.photo || '';
    this.notes = data.notes || '';
    this.customFields = data.customFields || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Certification Model
export class CertificationModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.name = data.name || '';
    this.issuingOrganization = data.issuingOrganization || '';
    this.certificationNumber = data.certificationNumber || '';
    this.issueDate = data.issueDate || null;
    this.expirationDate = data.expirationDate || null;
    this.description = data.description || '';
    this.documentUrl = data.documentUrl || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, EXPIRED, PENDING_RENEWAL
    this.reminderEnabled = data.reminderEnabled || true;
    this.reminderDays = data.reminderDays || 30; // Days before expiration to send reminder
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Training Record Model
export class TrainingRecordModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.trainingName = data.trainingName || '';
    this.trainingType = data.trainingType || ''; // SAFETY, TECHNICAL, COMPLIANCE, SOFT_SKILLS, etc.
    this.provider = data.provider || '';
    this.description = data.description || '';
    this.startDate = data.startDate || null;
    this.completionDate = data.completionDate || null;
    this.expirationDate = data.expirationDate || null;
    this.duration = data.duration || 0; // In hours
    this.location = data.location || '';
    this.status = data.status || 'COMPLETED'; // SCHEDULED, IN_PROGRESS, COMPLETED, FAILED, CANCELLED
    this.score = data.score || null;
    this.passingScore = data.passingScore || null;
    this.certificateUrl = data.certificateUrl || '';
    this.notes = data.notes || '';
    this.reminderEnabled = data.reminderEnabled || false;
    this.reminderDays = data.reminderDays || 30; // Days before expiration to send reminder
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Time Entry Model
export class TimeEntryModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.clockInTime = data.clockInTime || null;
    this.clockOutTime = data.clockOutTime || null;
    this.breakStartTime = data.breakStartTime || null;
    this.breakEndTime = data.breakEndTime || null;
    this.totalHours = data.totalHours || 0;
    this.regularHours = data.regularHours || 0;
    this.overtimeHours = data.overtimeHours || 0;
    this.doubleTimeHours = data.doubleTimeHours || 0;
    this.projectId = data.projectId || '';
    this.projectName = data.projectName || '';
    this.taskId = data.taskId || '';
    this.taskName = data.taskName || '';
    this.notes = data.notes || '';
    this.status = data.status || 'PENDING'; // PENDING, APPROVED, REJECTED
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Timesheet Model
export class TimesheetModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.startDate = data.startDate || '';
    this.endDate = data.endDate || '';
    this.status = data.status || 'PENDING'; // PENDING, SUBMITTED, APPROVED, REJECTED, PAID
    this.totalHours = data.totalHours || 0;
    this.regularHours = data.regularHours || 0;
    this.overtimeHours = data.overtimeHours || 0;
    this.doubleTimeHours = data.doubleTimeHours || 0;
    this.timeEntries = data.timeEntries || [];
    this.submittedAt = data.submittedAt || null;
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Leave Request Model
export class LeaveRequestModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.leaveType = data.leaveType || ''; // VACATION, SICK, PERSONAL, BEREAVEMENT, JURY_DUTY, etc.
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.returnDate = data.returnDate || null;
    this.totalDays = data.totalDays || 0;
    this.halfDay = data.halfDay || false;
    this.reason = data.reason || '';
    this.status = data.status || 'PENDING'; // PENDING, APPROVED, REJECTED, CANCELLED
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    this.attachments = data.attachments || [];
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Leave Balance Model
export class LeaveBalanceModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.year = data.year || new Date().getFullYear();
    this.vacationDays = {
      entitled: data.vacationDays?.entitled || 0,
      used: data.vacationDays?.used || 0,
      pending: data.vacationDays?.pending || 0,
      remaining: data.vacationDays?.remaining || 0
    };
    this.sickDays = {
      entitled: data.sickDays?.entitled || 0,
      used: data.sickDays?.used || 0,
      pending: data.sickDays?.pending || 0,
      remaining: data.sickDays?.remaining || 0
    };
    this.personalDays = {
      entitled: data.personalDays?.entitled || 0,
      used: data.personalDays?.used || 0,
      pending: data.personalDays?.pending || 0,
      remaining: data.personalDays?.remaining || 0
    };
    this.carryOverDays = data.carryOverDays || 0;
    this.additionalLeaveTypes = data.additionalLeaveTypes || {};
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
  }
}

// Performance Review Model
export class PerformanceReviewModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.reviewerId = data.reviewerId || '';
    this.reviewerName = data.reviewerName || '';
    this.reviewType = data.reviewType || ''; // ANNUAL, PROBATION, QUARTERLY, etc.
    this.reviewPeriodStart = data.reviewPeriodStart || null;
    this.reviewPeriodEnd = data.reviewPeriodEnd || null;
    this.scheduledDate = data.scheduledDate || null;
    this.completedDate = data.completedDate || null;
    this.status = data.status || 'PENDING'; // PENDING, IN_PROGRESS, COMPLETED, ACKNOWLEDGED
    this.overallRating = data.overallRating || 0; // 1-5 scale
    this.categories = data.categories || []; // Array of category ratings
    this.strengths = data.strengths || '';
    this.areasForImprovement = data.areasForImprovement || '';
    this.goals = data.goals || [];
    this.employeeComments = data.employeeComments || '';
    this.reviewerComments = data.reviewerComments || '';
    this.acknowledgementDate = data.acknowledgementDate || null;
    this.nextReviewDate = data.nextReviewDate || null;
    this.attachments = data.attachments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Employee Document Model
export class EmployeeDocumentModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.type = data.type || ''; // IDENTIFICATION, CONTRACT, PERFORMANCE, TAX, etc.
    this.fileUrl = data.fileUrl || '';
    this.fileName = data.fileName || '';
    this.fileSize = data.fileSize || 0;
    this.fileType = data.fileType || '';
    this.issuedDate = data.issuedDate || null;
    this.expirationDate = data.expirationDate || null;
    this.status = data.status || 'ACTIVE'; // ACTIVE, EXPIRED, ARCHIVED
    this.visibility = data.visibility || 'PRIVATE'; // PRIVATE, HR_ONLY, MANAGEMENT, PUBLIC
    this.uploadedBy = data.uploadedBy || '';
    this.uploadedAt = data.uploadedAt || new Date().toISOString();
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Payroll Record Model
export class PayrollRecordModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.payPeriodStart = data.payPeriodStart || '';
    this.payPeriodEnd = data.payPeriodEnd || '';
    this.payDate = data.payDate || '';
    this.grossPay = data.grossPay || 0;
    this.netPay = data.netPay || 0;
    this.regularHours = data.regularHours || 0;
    this.overtimeHours = data.overtimeHours || 0;
    this.doubleTimeHours = data.doubleTimeHours || 0;
    this.regularEarnings = data.regularEarnings || 0;
    this.overtimeEarnings = data.overtimeEarnings || 0;
    this.doubleTimeEarnings = data.doubleTimeEarnings || 0;
    this.bonuses = data.bonuses || 0;
    this.commissions = data.commissions || 0;
    this.otherEarnings = data.otherEarnings || 0;
    this.federalTax = data.federalTax || 0;
    this.stateTax = data.stateTax || 0;
    this.localTax = data.localTax || 0;
    this.socialSecurity = data.socialSecurity || 0;
    this.medicare = data.medicare || 0;
    this.retirement401k = data.retirement401k || 0;
    this.healthInsurance = data.healthInsurance || 0;
    this.dentalInsurance = data.dentalInsurance || 0;
    this.visionInsurance = data.visionInsurance || 0;
    this.otherDeductions = data.otherDeductions || 0;
    this.status = data.status || 'PENDING'; // PENDING, PROCESSED, PAID
    this.paymentMethod = data.paymentMethod || 'DIRECT_DEPOSIT'; // DIRECT_DEPOSIT, CHECK
    this.checkNumber = data.checkNumber || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Benefit Plan Model
export class BenefitPlanModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.type = data.type || ''; // HEALTH, DENTAL, VISION, RETIREMENT, LIFE_INSURANCE, etc.
    this.provider = data.provider || '';
    this.description = data.description || '';
    this.planDetails = data.planDetails || '';
    this.cost = data.cost || 0;
    this.employerContribution = data.employerContribution || 0;
    this.employeeContribution = data.employeeContribution || 0;
    this.contributionType = data.contributionType || 'PERCENTAGE'; // PERCENTAGE, FIXED
    this.eligibilityRequirements = data.eligibilityRequirements || '';
    this.enrollmentPeriodStart = data.enrollmentPeriodStart || null;
    this.enrollmentPeriodEnd = data.enrollmentPeriodEnd || null;
    this.planYear = data.planYear || '';
    this.status = data.status || 'ACTIVE'; // ACTIVE, INACTIVE, ARCHIVED
    this.documents = data.documents || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Employee Benefit Enrollment Model
export class BenefitEnrollmentModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.benefitPlanId = data.benefitPlanId || '';
    this.planName = data.planName || '';
    this.planType = data.planType || '';
    this.coverageLevel = data.coverageLevel || ''; // EMPLOYEE_ONLY, EMPLOYEE_SPOUSE, FAMILY, etc.
    this.dependents = data.dependents || [];
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.employeeContribution = data.employeeContribution || 0;
    this.employerContribution = data.employerContribution || 0;
    this.payrollFrequency = data.payrollFrequency || 'BI_WEEKLY'; // WEEKLY, BI_WEEKLY, MONTHLY
    this.status = data.status || 'ACTIVE'; // ACTIVE, PENDING, TERMINATED
    this.electionDate = data.electionDate || new Date().toISOString();
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Dependent Model
export class DependentModel {
  constructor(data) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.relationship = data.relationship || ''; // SPOUSE, CHILD, DOMESTIC_PARTNER, etc.
    this.dateOfBirth = data.dateOfBirth || null;
    this.gender = data.gender || '';
    this.ssn = data.ssn || ''; // Social Security Number (encrypted)
    this.address = data.address || {
      sameAsEmployee: true,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    this.isDisabled = data.isDisabled || false;
    this.isStudent = data.isStudent || false;
    this.documents = data.documents || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Job Position Model
export class JobPositionModel {
  constructor(data) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.department = data.department || '';
    this.location = data.location || '';
    this.description = data.description || '';
    this.responsibilities = data.responsibilities || '';
    this.requirements = data.requirements || '';
    this.qualifications = data.qualifications || '';
    this.employmentType = data.employmentType || 'FULL_TIME'; // FULL_TIME, PART_TIME, CONTRACT, TEMPORARY
    this.salaryRange = data.salaryRange || {
      min: 0,
      max: 0,
      currency: 'USD'
    };
    this.benefits = data.benefits || '';
    this.reportingTo = data.reportingTo || '';
    this.isOpen = data.isOpen || false;
    this.openPositions = data.openPositions || 0;
    this.status = data.status || 'ACTIVE'; // ACTIVE, DRAFT, ARCHIVED
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Schedule Model
export class ScheduleModel {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.department = data.department || '';
    this.location = data.location || '';
    this.shifts = data.shifts || [];
    this.status = data.status || 'ACTIVE'; // ACTIVE, DRAFT, ARCHIVED
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Shift Model
export class ShiftModel {
  constructor(data) {
    this.id = data.id || '';
    this.scheduleId = data.scheduleId || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.position = data.position || '';
    this.date = data.date || '';
    this.startTime = data.startTime || '';
    this.endTime = data.endTime || '';
    this.breakDuration = data.breakDuration || 0; // In minutes
    this.notes = data.notes || '';
    this.status = data.status || 'SCHEDULED'; // SCHEDULED, COMPLETED, MISSED, SWAPPED
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

// Shift Swap Request Model
export class ShiftSwapRequestModel {
  constructor(data) {
    this.id = data.id || '';
    this.requestingEmployeeId = data.requestingEmployeeId || '';
    this.requestingEmployeeName = data.requestingEmployeeName || '';
    this.requestedEmployeeId = data.requestedEmployeeId || '';
    this.requestedEmployeeName = data.requestedEmployeeName || '';
    this.requestingShiftId = data.requestingShiftId || '';
    this.requestedShiftId = data.requestedShiftId || '';
    this.requestingShiftDetails = data.requestingShiftDetails || {};
    this.requestedShiftDetails = data.requestedShiftDetails || {};
    this.reason = data.reason || '';
    this.status = data.status || 'PENDING'; // PENDING, APPROVED, REJECTED, CANCELLED
    this.approvedBy = data.approvedBy || '';
    this.approvedAt = data.approvedAt || null;
    this.rejectionReason = data.rejectionReason || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
