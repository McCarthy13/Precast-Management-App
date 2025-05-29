/**
 * Quality Control Services
 * Provides business logic and data access for the Quality Control module
 */

import prisma from '../../../lib/prisma';
import { 
  QCInspectionModel,
  QCChecklistItemModel,
  QCDefectModel,
  QCMeasurementModel,
  ConcreteMixDesignModel,
  ConcreteMixIngredientModel,
  ConcreteTestResultModel,
  QCChecklistTemplateModel,
  QCChecklistTemplateItemModel,
  QCDashboardModel,
  MaterialCertificationModel
} from '../models/QualityControlModel';

export class QualityControlService {
  /**
   * QC Inspection Management
   */
  async getInspections(filters = {}) {
    try {
      const { type, status, jobId, pieceId, startDate, endDate, search } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (jobId) whereClause.jobId = jobId;
      if (pieceId) whereClause.pieceId = pieceId;
      
      if (startDate && endDate) {
        whereClause.scheduledDate = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      } else if (startDate) {
        whereClause.scheduledDate = {
          gte: new Date(startDate)
        };
      } else if (endDate) {
        whereClause.scheduledDate = {
          lte: new Date(endDate)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { inspectionNumber: { contains: search, mode: 'insensitive' } },
          { pieceNumber: { contains: search, mode: 'insensitive' } },
          { jobNumber: { contains: search, mode: 'insensitive' } },
          { jobName: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const inspections = await prisma.qcInspection.findMany({
        where: whereClause,
        orderBy: [
          { scheduledDate: 'desc' }
        ],
        include: {
          piece: {
            select: {
              pieceNumber: true,
              type: true,
              status: true
            }
          },
          job: {
            select: {
              jobNumber: true,
              name: true
            }
          },
          _count: {
            select: {
              checklistItems: true,
              defects: true,
              measurements: true
            }
          }
        }
      });
      
      return inspections.map(inspection => new QCInspectionModel({
        ...inspection,
        pieceNumber: inspection.piece?.pieceNumber || inspection.pieceNumber,
        jobNumber: inspection.job?.jobNumber || inspection.jobNumber,
        jobName: inspection.job?.name || inspection.jobName,
        checklistItemCount: inspection._count.checklistItems,
        defectCount: inspection._count.defects,
        measurementCount: inspection._count.measurements
      }));
    } catch (error) {
      console.error('Error fetching inspections:', error);
      throw new Error('Failed to fetch inspections');
    }
  }
  
  async getInspectionById(id) {
    try {
      const inspection = await prisma.qcInspection.findUnique({
        where: { id },
        include: {
          piece: {
            select: {
              id: true,
              pieceNumber: true,
              type: true,
              status: true,
              location: true
            }
          },
          job: {
            select: {
              id: true,
              jobNumber: true,
              name: true,
              clientName: true
            }
          },
          checklistItems: {
            orderBy: { createdAt: 'asc' }
          },
          defects: {
            orderBy: { createdAt: 'desc' }
          },
          measurements: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
      
      if (!inspection) {
        throw new Error('Inspection not found');
      }
      
      return new QCInspectionModel({
        ...inspection,
        pieceNumber: inspection.piece?.pieceNumber || inspection.pieceNumber,
        jobNumber: inspection.job?.jobNumber || inspection.jobNumber,
        jobName: inspection.job?.name || inspection.jobName,
        checklistItems: inspection.checklistItems.map(item => new QCChecklistItemModel(item)),
        defects: inspection.defects.map(defect => new QCDefectModel(defect)),
        measurements: inspection.measurements.map(measurement => new QCMeasurementModel(measurement))
      });
    } catch (error) {
      console.error(`Error fetching inspection with ID ${id}:`, error);
      throw new Error('Failed to fetch inspection');
    }
  }
  
  async createInspection(inspectionData) {
    try {
      // Validate piece if provided
      if (inspectionData.pieceId) {
        const piece = await prisma.piece.findUnique({
          where: { id: inspectionData.pieceId }
        });
        
        if (!piece) {
          throw new Error('Piece not found');
        }
        
        inspectionData.pieceNumber = piece.pieceNumber;
      }
      
      // Validate job if provided
      if (inspectionData.jobId) {
        const job = await prisma.job.findUnique({
          where: { id: inspectionData.jobId }
        });
        
        if (!job) {
          throw new Error('Job not found');
        }
        
        inspectionData.jobNumber = job.jobNumber;
        inspectionData.jobName = job.name;
      }
      
      // Generate inspection number if not provided
      if (!inspectionData.inspectionNumber) {
        const currentYear = new Date().getFullYear().toString().substr(-2);
        const inspectionCount = await prisma.qcInspection.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          }
        });
        
        inspectionData.inspectionNumber = `QC${currentYear}-${(inspectionCount + 1).toString().padStart(4, '0')}`;
      }
      
      // Create inspection
      const inspection = await prisma.qcInspection.create({
        data: {
          inspectionNumber: inspectionData.inspectionNumber,
          type: inspectionData.type,
          status: inspectionData.status || 'PENDING',
          pieceId: inspectionData.pieceId,
          pieceNumber: inspectionData.pieceNumber,
          jobId: inspectionData.jobId,
          jobNumber: inspectionData.jobNumber,
          jobName: inspectionData.jobName,
          location: inspectionData.location,
          scheduledDate: inspectionData.scheduledDate ? new Date(inspectionData.scheduledDate) : null,
          startDate: inspectionData.startDate ? new Date(inspectionData.startDate) : null,
          completionDate: inspectionData.completionDate ? new Date(inspectionData.completionDate) : null,
          inspectedBy: inspectionData.inspectedBy,
          approvedBy: inspectionData.approvedBy,
          waivedBy: inspectionData.waivedBy,
          waiveReason: inspectionData.waiveReason,
          notes: inspectionData.notes,
          images: inspectionData.images || [],
          documents: inspectionData.documents || [],
          customFields: inspectionData.customFields || {},
          tags: inspectionData.tags || [],
          createdBy: inspectionData.createdBy
        }
      });
      
      // If a checklist template is provided, create checklist items from template
      if (inspectionData.checklistTemplateId) {
        const template = await prisma.qcChecklistTemplate.findUnique({
          where: { id: inspectionData.checklistTemplateId },
          include: {
            items: true
          }
        });
        
        if (template) {
          for (const templateItem of template.items) {
            await prisma.qcChecklistItem.create({
              data: {
                inspectionId: inspection.id,
                category: templateItem.category,
                description: templateItem.description,
                requirement: templateItem.requirement,
                status: 'PENDING',
                severity: templateItem.severity,
                createdBy: inspectionData.createdBy
              }
            });
          }
        }
      }
      
      // If checklist items are provided directly, create them
      if (inspectionData.checklistItems && inspectionData.checklistItems.length > 0) {
        for (const item of inspectionData.checklistItems) {
          await prisma.qcChecklistItem.create({
            data: {
              inspectionId: inspection.id,
              category: item.category,
              description: item.description,
              requirement: item.requirement,
              status: item.status || 'PENDING',
              result: item.result,
              notes: item.notes,
              images: item.images || [],
              severity: item.severity || 'NORMAL',
              createdBy: inspectionData.createdBy
            }
          });
        }
      }
      
      return new QCInspectionModel(inspection);
    } catch (error) {
      console.error('Error creating inspection:', error);
      throw new Error('Failed to create inspection');
    }
  }
  
  async updateInspection(id, inspectionData) {
    try {
      const inspection = await prisma.qcInspection.findUnique({
        where: { id }
      });
      
      if (!inspection) {
        throw new Error('Inspection not found');
      }
      
      // Update inspection
      const updatedInspection = await prisma.qcInspection.update({
        where: { id },
        data: {
          type: inspectionData.type,
          status: inspectionData.status,
          location: inspectionData.location,
          scheduledDate: inspectionData.scheduledDate ? new Date(inspectionData.scheduledDate) : inspection.scheduledDate,
          startDate: inspectionData.startDate ? new Date(inspectionData.startDate) : inspection.startDate,
          completionDate: inspectionData.completionDate ? new Date(inspectionData.completionDate) : inspection.completionDate,
          inspectedBy: inspectionData.inspectedBy,
          approvedBy: inspectionData.approvedBy,
          waivedBy: inspectionData.waivedBy,
          waiveReason: inspectionData.waiveReason,
          notes: inspectionData.notes,
          images: inspectionData.images,
          documents: inspectionData.documents,
          customFields: inspectionData.customFields,
          tags: inspectionData.tags,
          updatedAt: new Date()
        }
      });
      
      // Update piece status based on inspection result if inspection is completed
      if (inspectionData.status === 'PASSED' || inspectionData.status === 'FAILED') {
        if (inspection.pieceId) {
          const pieceStatus = inspectionData.status === 'PASSED' ? 'QC_APPROVED' : 'QC_REJECTED';
          
          await prisma.piece.update({
            where: { id: inspection.pieceId },
            data: {
              status: pieceStatus,
              updatedAt: new Date()
            }
          });
          
          // Notify other modules about the status change
          await this.notifyPieceStatusChange(inspection.pieceId, pieceStatus, {
            inspectionId: id,
            inspectionNumber: inspection.inspectionNumber,
            inspectionType: inspection.type,
            completionDate: inspectionData.completionDate || new Date(),
            inspectedBy: inspectionData.inspectedBy,
            notes: inspectionData.notes
          });
        }
      }
      
      return new QCInspectionModel(updatedInspection);
    } catch (error) {
      console.error(`Error updating inspection with ID ${id}:`, error);
      throw new Error('Failed to update inspection');
    }
  }
  
  /**
   * QC Defect Management
   */
  async getDefects(filters = {}) {
    try {
      const { status, severity, type, category, jobId, pieceId, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (severity) whereClause.severity = severity;
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (jobId) whereClause.jobId = jobId;
      if (pieceId) whereClause.pieceId = pieceId;
      
      if (search) {
        whereClause.OR = [
          { defectNumber: { contains: search, mode: 'insensitive' } },
          { pieceNumber: { contains: search, mode: 'insensitive' } },
          { jobNumber: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const defects = await prisma.qcDefect.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          inspection: {
            select: {
              inspectionNumber: true,
              type: true
            }
          },
          piece: {
            select: {
              pieceNumber: true,
              type: true
            }
          },
          job: {
            select: {
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      return defects.map(defect => new QCDefectModel({
        ...defect,
        inspectionNumber: defect.inspection?.inspectionNumber,
        pieceNumber: defect.piece?.pieceNumber || defect.pieceNumber,
        jobNumber: defect.job?.jobNumber || defect.jobNumber
      }));
    } catch (error) {
      console.error('Error fetching defects:', error);
      throw new Error('Failed to fetch defects');
    }
  }
  
  async getDefectById(id) {
    try {
      const defect = await prisma.qcDefect.findUnique({
        where: { id },
        include: {
          inspection: {
            select: {
              id: true,
              inspectionNumber: true,
              type: true,
              status: true
            }
          },
          piece: {
            select: {
              id: true,
              pieceNumber: true,
              type: true,
              status: true
            }
          },
          job: {
            select: {
              id: true,
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      if (!defect) {
        throw new Error('Defect not found');
      }
      
      return new QCDefectModel({
        ...defect,
        inspectionNumber: defect.inspection?.inspectionNumber,
        pieceNumber: defect.piece?.pieceNumber || defect.pieceNumber,
        jobNumber: defect.job?.jobNumber || defect.jobNumber
      });
    } catch (error) {
      console.error(`Error fetching defect with ID ${id}:`, error);
      throw new Error('Failed to fetch defect');
    }
  }
  
  async createDefect(defectData) {
    try {
      // Validate inspection if provided
      if (defectData.inspectionId) {
        const inspection = await prisma.qcInspection.findUnique({
          where: { id: defectData.inspectionId }
        });
        
        if (!inspection) {
          throw new Error('Inspection not found');
        }
        
        defectData.pieceId = inspection.pieceId;
        defectData.pieceNumber = inspection.pieceNumber;
        defectData.jobId = inspection.jobId;
        defectData.jobNumber = inspection.jobNumber;
      }
      
      // Validate piece if provided directly
      if (defectData.pieceId && !defectData.inspectionId) {
        const piece = await prisma.piece.findUnique({
          where: { id: defectData.pieceId }
        });
        
        if (!piece) {
          throw new Error('Piece not found');
        }
        
        defectData.pieceNumber = piece.pieceNumber;
        defectData.jobId = piece.jobId;
      }
      
      // Validate job if provided directly
      if (defectData.jobId && !defectData.inspectionId && !defectData.pieceId) {
        const job = await prisma.job.findUnique({
          where: { id: defectData.jobId }
        });
        
        if (!job) {
          throw new Error('Job not found');
        }
        
        defectData.jobNumber = job.jobNumber;
      }
      
      // Generate defect number if not provided
      if (!defectData.defectNumber) {
        const currentYear = new Date().getFullYear().toString().substr(-2);
        const defectCount = await prisma.qcDefect.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          }
        });
        
        defectData.defectNumber = `D${currentYear}-${(defectCount + 1).toString().padStart(4, '0')}`;
      }
      
      // Create defect
      const defect = await prisma.qcDefect.create({
        data: {
          defectNumber: defectData.defectNumber,
          inspectionId: defectData.inspectionId,
          pieceId: defectData.pieceId,
          pieceNumber: defectData.pieceNumber,
          jobId: defectData.jobId,
          jobNumber: defectData.jobNumber,
          type: defectData.type,
          category: defectData.category,
          location: defectData.location,
          description: defectData.description,
          severity: defectData.severity || 'NORMAL',
          status: defectData.status || 'OPEN',
          rootCause: defectData.rootCause,
          repairMethod: defectData.repairMethod,
          repairNotes: defectData.repairNotes,
          repairBy: defectData.repairBy,
          repairDate: defectData.repairDate ? new Date(defectData.repairDate) : null,
          inspectedAfterRepairBy: defectData.inspectedAfterRepairBy,
          inspectedAfterRepairDate: defectData.inspectedAfterRepairDate ? new Date(defectData.inspectedAfterRepairDate) : null,
          inspectedAfterRepairResult: defectData.inspectedAfterRepairResult,
          images: defectData.images || [],
          documents: defectData.documents || [],
          customFields: defectData.customFields || {},
          tags: defectData.tags || [],
          createdBy: defectData.createdBy
        }
      });
      
      // Update piece status if defect is critical
      if (defectData.severity === 'CRITICAL' && defectData.pieceId) {
        await prisma.piece.update({
          where: { id: defectData.pieceId },
          data: {
            status: 'DEFECTIVE',
            updatedAt: new Date()
          }
        });
        
        // Notify other modules about the status change
        await this.notifyPieceStatusChange(defectData.pieceId, 'DEFECTIVE', {
          defectId: defect.id,
          defectNumber: defect.defectNumber,
          defectType: defect.type,
          defectSeverity: defect.severity,
          description: defect.description
        });
      }
      
      return new QCDefectModel(defect);
    } catch (error) {
      console.error('Error creating defect:', error);
      throw new Error('Failed to create defect');
    }
  }
  
  async updateDefect(id, defectData) {
    try {
      const defect = await prisma.qcDefect.findUnique({
        where: { id }
      });
      
      if (!defect) {
        throw new Error('Defect not found');
      }
      
      // Update defect
      const updatedDefect = await prisma.qcDefect.update({
        where: { id },
        data: {
          type: defectData.type,
          category: defectData.category,
          location: defectData.location,
          description: defectData.description,
          severity: defectData.severity,
          status: defectData.status,
          rootCause: defectData.rootCause,
          repairMethod: defectData.repairMethod,
          repairNotes: defectData.repairNotes,
          repairBy: defectData.repairBy,
          repairDate: defectData.repairDate ? new Date(defectData.repairDate) : defect.repairDate,
          inspectedAfterRepairBy: defectData.inspectedAfterRepairBy,
          inspectedAfterRepairDate: defectData.inspectedAfterRepairDate ? new Date(defectData.inspectedAfterRepairDate) : defect.inspectedAfterRepairDate,
          inspectedAfterRepairResult: defectData.inspectedAfterRepairResult,
          images: defectData.images,
          documents: defectData.documents,
          customFields: defectData.customFields,
          tags: defectData.tags,
          closedBy: defectData.status === 'CLOSED' ? defectData.closedBy || defectData.updatedBy : defect.closedBy,
          closedAt: defectData.status === 'CLOSED' ? new Date() : defect.closedAt,
          closureReason: defectData.status === 'CLOSED' ? defectData.closureReason : defect.closureReason,
          updatedAt: new Date()
        }
      });
      
      // Update piece status based on defect status changes
      if (defect.pieceId) {
        let pieceStatus = null;
        
        if (defectData.status === 'REPAIRED' && defectData.inspectedAfterRepairResult === 'PASSED') {
          pieceStatus = 'QC_APPROVED';
        } else if (defectData.status === 'REJECTED') {
          pieceStatus = 'REJECTED';
        }
        
        if (pieceStatus) {
          await prisma.piece.update({
            where: { id: defect.pieceId },
            data: {
              status: pieceStatus,
              updatedAt: new Date()
            }
          });
          
          // Notify other modules about the status change
          await this.notifyPieceStatusChange(defect.pieceId, pieceStatus, {
            defectId: id,
            defectNumber: defect.defectNumber,
            defectStatus: defectData.status,
            repairDate: defectData.repairDate,
            inspectedAfterRepairResult: defectData.inspectedAfterRepairResult
          });
        }
      }
      
      return new QCDefectModel(updatedDefect);
    } catch (error) {
      console.error(`Error updating defect with ID ${id}:`, error);
      throw new Error('Failed to update defect');
    }
  }
  
  /**
   * Concrete Mix Design Management
   */
  async getMixDesigns(filters = {}) {
    try {
      const { status, type, category, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      
      if (search) {
        whereClause.OR = [
          { mixDesignNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const mixDesigns = await prisma.concreteMixDesign.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          _count: {
            select: {
              ingredients: true,
              testResults: true
            }
          }
        }
      });
      
      return mixDesigns.map(mixDesign => new ConcreteMixDesignModel({
        ...mixDesign,
        ingredientCount: mixDesign._count.ingredients,
        testResultCount: mixDesign._count.testResults
      }));
    } catch (error) {
      console.error('Error fetching mix designs:', error);
      throw new Error('Failed to fetch mix designs');
    }
  }
  
  async getMixDesignById(id) {
    try {
      const mixDesign = await prisma.concreteMixDesign.findUnique({
        where: { id },
        include: {
          ingredients: {
            orderBy: { createdAt: 'asc' }
          },
          testResults: {
            orderBy: { testDate: 'desc' },
            take: 20
          }
        }
      });
      
      if (!mixDesign) {
        throw new Error('Mix design not found');
      }
      
      return new ConcreteMixDesignModel({
        ...mixDesign,
        ingredients: mixDesign.ingredients.map(ingredient => new ConcreteMixIngredientModel(ingredient)),
        testResults: mixDesign.testResults.map(testResult => new ConcreteTestResultModel(testResult))
      });
    } catch (error) {
      console.error(`Error fetching mix design with ID ${id}:`, error);
      throw new Error('Failed to fetch mix design');
    }
  }
  
  /**
   * Test Result Management
   */
  async getTestResults(filters = {}) {
    try {
      const { testType, status, mixDesignId, jobId, pieceId, startDate, endDate, search } = filters;
      
      const whereClause = {};
      if (testType) whereClause.testType = testType;
      if (status) whereClause.status = status;
      if (mixDesignId) whereClause.mixDesignId = mixDesignId;
      if (jobId) whereClause.jobId = jobId;
      if (pieceId) whereClause.pieceId = pieceId;
      
      if (startDate && endDate) {
        whereClause.testDate = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      } else if (startDate) {
        whereClause.testDate = {
          gte: new Date(startDate)
        };
      } else if (endDate) {
        whereClause.testDate = {
          lte: new Date(endDate)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { testNumber: { contains: search, mode: 'insensitive' } },
          { mixDesignNumber: { contains: search, mode: 'insensitive' } },
          { pieceNumber: { contains: search, mode: 'insensitive' } },
          { jobNumber: { contains: search, mode: 'insensitive' } },
          { testLocation: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const testResults = await prisma.concreteTestResult.findMany({
        where: whereClause,
        orderBy: [
          { testDate: 'desc' }
        ],
        include: {
          mixDesign: {
            select: {
              name: true
            }
          },
          piece: {
            select: {
              pieceNumber: true,
              type: true
            }
          },
          job: {
            select: {
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      return testResults.map(testResult => new ConcreteTestResultModel({
        ...testResult,
        mixDesignName: testResult.mixDesign?.name,
        pieceNumber: testResult.piece?.pieceNumber || testResult.pieceNumber,
        jobNumber: testResult.job?.jobNumber || testResult.jobNumber
      }));
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw new Error('Failed to fetch test results');
    }
  }
  
  /**
   * QC Dashboard
   */
  async getQCDashboardData() {
    try {
      // Inspection stats
      const inspectionStats = await prisma.qcInspection.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const inspectionStatsData = {
        total: 0,
        pending: 0,
        inProgress: 0,
        passed: 0,
        failed: 0,
        waived: 0
      };
      
      inspectionStats.forEach(stat => {
        inspectionStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'PENDING':
            inspectionStatsData.pending = stat._count.id;
            break;
          case 'IN_PROGRESS':
            inspectionStatsData.inProgress = stat._count.id;
            break;
          case 'PASSED':
            inspectionStatsData.passed = stat._count.id;
            break;
          case 'FAILED':
            inspectionStatsData.failed = stat._count.id;
            break;
          case 'WAIVED':
            inspectionStatsData.waived = stat._count.id;
            break;
        }
      });
      
      // Defect stats
      const defectStats = await prisma.qcDefect.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const defectStatsData = {
        total: 0,
        open: 0,
        inReview: 0,
        approvedForRepair: 0,
        repaired: 0,
        rejected: 0,
        closed: 0
      };
      
      defectStats.forEach(stat => {
        defectStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'OPEN':
            defectStatsData.open = stat._count.id;
            break;
          case 'IN_REVIEW':
            defectStatsData.inReview = stat._count.id;
            break;
          case 'APPROVED_FOR_REPAIR':
            defectStatsData.approvedForRepair = stat._count.id;
            break;
          case 'REPAIRED':
            defectStatsData.repaired = stat._count.id;
            break;
          case 'REJECTED':
            defectStatsData.rejected = stat._count.id;
            break;
          case 'CLOSED':
            defectStatsData.closed = stat._count.id;
            break;
        }
      });
      
      // Test result stats
      const testResultStats = await prisma.concreteTestResult.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const testResultStatsData = {
        total: 0,
        pending: 0,
        passed: 0,
        failed: 0
      };
      
      testResultStats.forEach(stat => {
        testResultStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'PENDING':
            testResultStatsData.pending = stat._count.id;
            break;
          case 'PASSED':
            testResultStatsData.passed = stat._count.id;
            break;
          case 'FAILED':
            testResultStatsData.failed = stat._count.id;
            break;
        }
      });
      
      // Inspections by type
      const inspectionsByType = await prisma.qcInspection.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      });
      
      const inspectionsByTypeArray = inspectionsByType.map(item => ({
        type: item.type,
        count: item._count.id
      }));
      
      // Defects by category
      const defectsByCategory = await prisma.qcDefect.groupBy({
        by: ['category'],
        _count: {
          id: true
        },
        where: {
          category: {
            not: null
          }
        }
      });
      
      const defectsByCategoryArray = defectsByCategory.map(item => ({
        category: item.category,
        count: item._count.id
      }));
      
      // Defects by severity
      const defectsBySeverity = await prisma.qcDefect.groupBy({
        by: ['severity'],
        _count: {
          id: true
        }
      });
      
      const defectsBySeverityArray = defectsBySeverity.map(item => ({
        severity: item.severity,
        count: item._count.id
      }));
      
      // Test results by type
      const testResultsByType = await prisma.concreteTestResult.groupBy({
        by: ['testType'],
        _count: {
          id: true
        }
      });
      
      const testResultsByTypeArray = testResultsByType.map(item => ({
        type: item.testType,
        count: item._count.id
      }));
      
      // Upcoming inspections
      const today = new Date();
      const upcomingInspections = await prisma.qcInspection.findMany({
        where: {
          status: 'PENDING',
          scheduledDate: {
            gte: today
          }
        },
        orderBy: {
          scheduledDate: 'asc'
        },
        take: 10,
        include: {
          piece: {
            select: {
              pieceNumber: true,
              type: true
            }
          },
          job: {
            select: {
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      // Recent defects
      const recentDefects = await prisma.qcDefect.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 10,
        include: {
          piece: {
            select: {
              pieceNumber: true,
              type: true
            }
          },
          job: {
            select: {
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      // Recent test results
      const recentTestResults = await prisma.concreteTestResult.findMany({
        orderBy: {
          testDate: 'desc'
        },
        take: 10,
        include: {
          mixDesign: {
            select: {
              name: true
            }
          },
          piece: {
            select: {
              pieceNumber: true,
              type: true
            }
          },
          job: {
            select: {
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      // Quality metrics
      const totalInspections = inspectionStatsData.total;
      const passedInspections = inspectionStatsData.passed;
      const firstTimeQualityRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0;
      
      const totalPieces = await prisma.piece.count();
      const defectsPerPiece = totalPieces > 0 ? defectStatsData.total / totalPieces : 0;
      
      // Calculate average defect resolution time
      const resolvedDefects = await prisma.qcDefect.findMany({
        where: {
          status: 'CLOSED',
          createdAt: {
            not: null
          },
          closedAt: {
            not: null
          }
        },
        select: {
          createdAt: true,
          closedAt: true
        }
      });
      
      let totalResolutionHours = 0;
      resolvedDefects.forEach(defect => {
        const createdDate = new Date(defect.createdAt);
        const closedDate = new Date(defect.closedAt);
        const resolutionHours = (closedDate - createdDate) / (1000 * 60 * 60);
        totalResolutionHours += resolutionHours;
      });
      
      const averageDefectResolutionTime = resolvedDefects.length > 0 ? totalResolutionHours / resolvedDefects.length : 0;
      
      const inspectionCompletionRate = (inspectionStatsData.passed + inspectionStatsData.failed + inspectionStatsData.waived) / totalInspections * 100;
      
      const criticalDefects = await prisma.qcDefect.count({
        where: {
          severity: 'CRITICAL'
        }
      });
      
      const criticalDefectRate = defectStatsData.total > 0 ? (criticalDefects / defectStatsData.total) * 100 : 0;
      
      const qualityMetrics = {
        firstTimeQualityRate,
        defectsPerPiece,
        averageDefectResolutionTime,
        inspectionCompletionRate,
        criticalDefectRate
      };
      
      // Quality trends (simplified)
      const qualityTrends = {
        firstTimeQualityRate: [],
        defectsPerPiece: [],
        averageDefectResolutionTime: []
      };
      
      // Return dashboard data
      return new QCDashboardModel({
        inspectionStats: inspectionStatsData,
        defectStats: defectStatsData,
        testResultStats: testResultStatsData,
        inspectionsByType: inspectionsByTypeArray,
        defectsByCategory: defectsByCategoryArray,
        defectsBySeverity: defectsBySeverityArray,
        testResultsByType: testResultsByTypeArray,
        upcomingInspections,
        recentDefects,
        recentTestResults,
        qualityMetrics,
        qualityTrends
      });
    } catch (error) {
      console.error('Error fetching QC dashboard data:', error);
      throw new Error('Failed to fetch QC dashboard data');
    }
  }
  
  /**
   * Cross-Module Integration
   */
  async notifyPieceStatusChange(pieceId, status, details) {
    try {
      // Get piece information
      const piece = await prisma.piece.findUnique({
        where: { id: pieceId },
        include: {
          job: {
            select: {
              id: true,
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      if (!piece) {
        throw new Error('Piece not found');
      }
      
      // Create notification for Yard Management
      await prisma.notification.create({
        data: {
          type: 'PIECE_STATUS_CHANGE',
          title: `Piece ${piece.pieceNumber} Status Changed to ${status}`,
          message: `Quality Control has changed the status of piece ${piece.pieceNumber} to ${status}`,
          module: 'QUALITY_CONTROL',
          targetModule: 'YARD_MANAGEMENT',
          entityId: pieceId,
          entityType: 'PIECE',
          metadata: {
            pieceId,
            pieceNumber: piece.pieceNumber,
            pieceType: piece.type,
            jobId: piece.jobId,
            jobNumber: piece.job?.jobNumber,
            jobName: piece.job?.name,
            status,
            previousStatus: piece.status,
            details
          },
          isRead: false,
          createdAt: new Date()
        }
      });
      
      // Create notification for Shipping/Dispatch if piece is approved
      if (status === 'QC_APPROVED') {
        await prisma.notification.create({
          data: {
            type: 'PIECE_READY_FOR_SHIPPING',
            title: `Piece ${piece.pieceNumber} Ready for Shipping`,
            message: `Piece ${piece.pieceNumber} has been approved by Quality Control and is ready for shipping`,
            module: 'QUALITY_CONTROL',
            targetModule: 'SHIPPING',
            entityId: pieceId,
            entityType: 'PIECE',
            metadata: {
              pieceId,
              pieceNumber: piece.pieceNumber,
              pieceType: piece.type,
              jobId: piece.jobId,
              jobNumber: piece.job?.jobNumber,
              jobName: piece.job?.name,
              status,
              details
            },
            isRead: false,
            createdAt: new Date()
          }
        });
      }
      
      // Create notification for Production if piece is rejected
      if (status === 'QC_REJECTED' || status === 'DEFECTIVE') {
        await prisma.notification.create({
          data: {
            type: 'PIECE_REJECTED',
            title: `Piece ${piece.pieceNumber} Rejected by Quality Control`,
            message: `Piece ${piece.pieceNumber} has been rejected by Quality Control and requires attention`,
            module: 'QUALITY_CONTROL',
            targetModule: 'PRODUCTION',
            entityId: pieceId,
            entityType: 'PIECE',
            metadata: {
              pieceId,
              pieceNumber: piece.pieceNumber,
              pieceType: piece.type,
              jobId: piece.jobId,
              jobNumber: piece.job?.jobNumber,
              jobName: piece.job?.name,
              status,
              details
            },
            isRead: false,
            createdAt: new Date()
          }
        });
      }
      
      // Update job metrics
      if (piece.jobId) {
        // Get counts for the job
        const totalPieces = await prisma.piece.count({
          where: {
            jobId: piece.jobId
          }
        });
        
        const approvedPieces = await prisma.piece.count({
          where: {
            jobId: piece.jobId,
            status: 'QC_APPROVED'
          }
        });
        
        const rejectedPieces = await prisma.piece.count({
          where: {
            jobId: piece.jobId,
            status: {
              in: ['QC_REJECTED', 'DEFECTIVE', 'REJECTED']
            }
          }
        });
        
        // Calculate quality metrics
        const qualityRate = totalPieces > 0 ? (approvedPieces / totalPieces) * 100 : 0;
        const rejectionRate = totalPieces > 0 ? (rejectedPieces / totalPieces) * 100 : 0;
        
        // Update job metrics
        await prisma.jobMetrics.upsert({
          where: {
            jobId: piece.jobId
          },
          update: {
            qualityRate,
            rejectionRate,
            totalPieces,
            approvedPieces,
            rejectedPieces,
            updatedAt: new Date()
          },
          create: {
            jobId: piece.jobId,
            qualityRate,
            rejectionRate,
            totalPieces,
            approvedPieces,
            rejectedPieces,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Error notifying piece status change for piece ID ${pieceId}:`, error);
      throw new Error('Failed to notify piece status change');
    }
  }
}

export default new QualityControlService();
