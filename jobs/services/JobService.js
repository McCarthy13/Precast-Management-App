/**
 * Jobs Services
 * Provides business logic and data access for the Jobs module
 */

import prisma from '../../../lib/prisma';
import { 
  JobModel,
  JobPieceModel,
  JobDocumentModel,
  JobDrawingModel,
  JobChangeOrderModel,
  JobRiskModel,
  JobIssueModel,
  JobMeetingModel,
  JobInspectionModel,
  JobDashboardModel
} from '../models/JobModel';

export class JobService {
  /**
   * Job Management
   */
  async getJobs(filters = {}) {
    try {
      const { status, priority, type, category, clientId, search, startDateFrom, startDateTo, tags } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (clientId) whereClause.clientId = clientId;
      
      if (tags && tags.length > 0) {
        whereClause.tags = {
          hasSome: tags
        };
      }
      
      if (startDateFrom && startDateTo) {
        whereClause.startDate = {
          gte: new Date(startDateFrom),
          lte: new Date(startDateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { jobNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { clientName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const jobs = await prisma.job.findMany({
        where: whereClause,
        orderBy: [
          { startDate: 'desc' }
        ],
        include: {
          client: {
            select: {
              name: true
            }
          },
          clientContact: {
            select: {
              displayName: true
            }
          },
          project: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              pieces: true,
              documents: true,
              issues: true
            }
          }
        }
      });
      
      return jobs.map(job => new JobModel({
        ...job,
        clientName: job.client?.name || job.clientName,
        clientContactName: job.clientContact?.displayName || job.clientContactName,
        projectName: job.project?.name || job.projectName,
        pieceCount: job._count.pieces,
        documentCount: job._count.documents,
        issueCount: job._count.issues
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }
  
  async getJobById(id) {
    try {
      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          clientContact: {
            select: {
              id: true,
              displayName: true,
              email: true,
              phone: true
            }
          },
          project: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          pieces: {
            orderBy: { pieceNumber: 'asc' },
            take: 100
          },
          documents: {
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          drawings: {
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          changeOrders: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          risks: {
            orderBy: { severity: 'desc' },
            take: 10
          },
          issues: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          meetings: {
            orderBy: { startDate: 'desc' },
            take: 10
          },
          inspections: {
            orderBy: { scheduledDate: 'desc' },
            take: 10
          }
        }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      return new JobModel({
        ...job,
        clientName: job.client?.name || job.clientName,
        clientContactName: job.clientContact?.displayName || job.clientContactName,
        projectName: job.project?.name || job.projectName,
        pieces: job.pieces.map(piece => new JobPieceModel(piece)),
        documents: job.documents.map(doc => new JobDocumentModel(doc)),
        drawings: job.drawings.map(drawing => new JobDrawingModel(drawing)),
        changeOrders: job.changeOrders.map(co => new JobChangeOrderModel(co)),
        risks: job.risks.map(risk => new JobRiskModel(risk)),
        issues: job.issues.map(issue => new JobIssueModel(issue)),
        meetings: job.meetings.map(meeting => new JobMeetingModel(meeting)),
        inspections: job.inspections.map(inspection => new JobInspectionModel(inspection))
      });
    } catch (error) {
      console.error(`Error fetching job with ID ${id}:`, error);
      throw new Error('Failed to fetch job');
    }
  }
  
  async createJob(jobData) {
    try {
      // Validate client if provided
      if (jobData.clientId) {
        const client = await prisma.client.findUnique({
          where: { id: jobData.clientId }
        });
        
        if (!client) {
          throw new Error('Client not found');
        }
        
        jobData.clientName = client.name;
      }
      
      // Validate client contact if provided
      if (jobData.clientContactId) {
        const clientContact = await prisma.contact.findUnique({
          where: { id: jobData.clientContactId }
        });
        
        if (!clientContact) {
          throw new Error('Client contact not found');
        }
        
        jobData.clientContactName = clientContact.displayName;
      }
      
      // Validate project if provided
      if (jobData.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: jobData.projectId }
        });
        
        if (!project) {
          throw new Error('Project not found');
        }
        
        jobData.projectName = project.name;
      }
      
      // Generate job number if not provided
      if (!jobData.jobNumber) {
        const currentYear = new Date().getFullYear().toString().substr(-2);
        const jobCount = await prisma.job.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          }
        });
        
        jobData.jobNumber = `J${currentYear}-${(jobCount + 1).toString().padStart(4, '0')}`;
      }
      
      // Create job
      const job = await prisma.job.create({
        data: {
          jobNumber: jobData.jobNumber,
          name: jobData.name,
          description: jobData.description,
          status: jobData.status || 'PENDING',
          priority: jobData.priority || 'MEDIUM',
          type: jobData.type,
          category: jobData.category,
          clientId: jobData.clientId,
          clientName: jobData.clientName,
          clientContactId: jobData.clientContactId,
          clientContactName: jobData.clientContactName,
          projectId: jobData.projectId,
          projectName: jobData.projectName,
          contractNumber: jobData.contractNumber,
          contractValue: jobData.contractValue || 0,
          contractType: jobData.contractType,
          startDate: jobData.startDate ? new Date(jobData.startDate) : null,
          targetCompletionDate: jobData.targetCompletionDate ? new Date(jobData.targetCompletionDate) : null,
          estimatedHours: jobData.estimatedHours || 0,
          location: jobData.location,
          tags: jobData.tags || [],
          notes: jobData.notes,
          customFields: jobData.customFields || {},
          assignedTo: jobData.assignedTo || [],
          generalContractor: jobData.generalContractor,
          architect: jobData.architect,
          engineer: jobData.engineer,
          finishDetails: jobData.finishDetails,
          deliveryInformation: jobData.deliveryInformation,
          keyDates: jobData.keyDates,
          budget: jobData.budget,
          billingInfo: jobData.billingInfo,
          createdBy: jobData.createdBy
        }
      });
      
      return new JobModel(job);
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  }
  
  async updateJob(id, jobData) {
    try {
      const job = await prisma.job.findUnique({
        where: { id }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Validate client if provided and changed
      if (jobData.clientId && jobData.clientId !== job.clientId) {
        const client = await prisma.client.findUnique({
          where: { id: jobData.clientId }
        });
        
        if (!client) {
          throw new Error('Client not found');
        }
        
        jobData.clientName = client.name;
      }
      
      // Validate client contact if provided and changed
      if (jobData.clientContactId && jobData.clientContactId !== job.clientContactId) {
        const clientContact = await prisma.contact.findUnique({
          where: { id: jobData.clientContactId }
        });
        
        if (!clientContact) {
          throw new Error('Client contact not found');
        }
        
        jobData.clientContactName = clientContact.displayName;
      }
      
      // Validate project if provided and changed
      if (jobData.projectId && jobData.projectId !== job.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: jobData.projectId }
        });
        
        if (!project) {
          throw new Error('Project not found');
        }
        
        jobData.projectName = project.name;
      }
      
      // Update job
      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          name: jobData.name,
          description: jobData.description,
          status: jobData.status,
          priority: jobData.priority,
          type: jobData.type,
          category: jobData.category,
          clientId: jobData.clientId,
          clientName: jobData.clientName,
          clientContactId: jobData.clientContactId,
          clientContactName: jobData.clientContactName,
          projectId: jobData.projectId,
          projectName: jobData.projectName,
          contractNumber: jobData.contractNumber,
          contractValue: jobData.contractValue,
          contractType: jobData.contractType,
          startDate: jobData.startDate ? new Date(jobData.startDate) : job.startDate,
          targetCompletionDate: jobData.targetCompletionDate ? new Date(jobData.targetCompletionDate) : job.targetCompletionDate,
          actualCompletionDate: jobData.actualCompletionDate ? new Date(jobData.actualCompletionDate) : job.actualCompletionDate,
          estimatedHours: jobData.estimatedHours,
          actualHours: jobData.actualHours,
          location: jobData.location,
          tags: jobData.tags,
          notes: jobData.notes,
          customFields: jobData.customFields,
          assignedTo: jobData.assignedTo,
          generalContractor: jobData.generalContractor,
          architect: jobData.architect,
          engineer: jobData.engineer,
          finishDetails: jobData.finishDetails,
          deliveryInformation: jobData.deliveryInformation,
          keyDates: jobData.keyDates,
          budget: jobData.budget,
          billingInfo: jobData.billingInfo,
          updatedAt: new Date()
        }
      });
      
      return new JobModel(updatedJob);
    } catch (error) {
      console.error(`Error updating job with ID ${id}:`, error);
      throw new Error('Failed to update job');
    }
  }
  
  async completeJob(id, completionData) {
    try {
      const job = await prisma.job.findUnique({
        where: { id }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Check if job can be completed
      if (job.status === 'COMPLETED') {
        throw new Error('Job is already completed');
      }
      
      if (job.status === 'CANCELLED') {
        throw new Error('Cannot complete a cancelled job');
      }
      
      // Update job
      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          actualCompletionDate: new Date(),
          actualHours: completionData.actualHours || job.actualHours,
          completedBy: completionData.completedBy,
          completedAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      return new JobModel(updatedJob);
    } catch (error) {
      console.error(`Error completing job with ID ${id}:`, error);
      throw new Error('Failed to complete job');
    }
  }
  
  async cancelJob(id, cancellationData) {
    try {
      const job = await prisma.job.findUnique({
        where: { id }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Check if job can be cancelled
      if (job.status === 'CANCELLED') {
        throw new Error('Job is already cancelled');
      }
      
      if (job.status === 'COMPLETED') {
        throw new Error('Cannot cancel a completed job');
      }
      
      if (!cancellationData.cancellationReason) {
        throw new Error('Cancellation reason is required');
      }
      
      // Update job
      const updatedJob = await prisma.job.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledBy: cancellationData.cancelledBy,
          cancelledAt: new Date(),
          cancellationReason: cancellationData.cancellationReason,
          updatedAt: new Date()
        }
      });
      
      return new JobModel(updatedJob);
    } catch (error) {
      console.error(`Error cancelling job with ID ${id}:`, error);
      throw new Error('Failed to cancel job');
    }
  }
  
  /**
   * Job Piece Management
   */
  async getJobPieces(jobId, filters = {}) {
    try {
      const { status, type, category, search } = filters;
      
      const whereClause = { jobId };
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      
      if (search) {
        whereClause.OR = [
          { pieceNumber: { contains: search, mode: 'insensitive' } },
          { markNumber: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const pieces = await prisma.jobPiece.findMany({
        where: whereClause,
        orderBy: [
          { pieceNumber: 'asc' }
        ]
      });
      
      return pieces.map(piece => new JobPieceModel(piece));
    } catch (error) {
      console.error(`Error fetching pieces for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job pieces');
    }
  }
  
  async getJobPieceById(id) {
    try {
      const piece = await prisma.jobPiece.findUnique({
        where: { id },
        include: {
          job: {
            select: {
              id: true,
              jobNumber: true,
              name: true
            }
          },
          drawings: {
            orderBy: { createdAt: 'desc' }
          },
          documents: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      
      if (!piece) {
        throw new Error('Job piece not found');
      }
      
      return new JobPieceModel({
        ...piece,
        drawings: piece.drawings.map(drawing => new JobDrawingModel(drawing)),
        documents: piece.documents.map(doc => new JobDocumentModel(doc))
      });
    } catch (error) {
      console.error(`Error fetching job piece with ID ${id}:`, error);
      throw new Error('Failed to fetch job piece');
    }
  }
  
  async createJobPiece(pieceData) {
    try {
      // Validate job
      const job = await prisma.job.findUnique({
        where: { id: pieceData.jobId }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Generate piece number if not provided
      if (!pieceData.pieceNumber) {
        const pieceCount = await prisma.jobPiece.count({
          where: {
            jobId: pieceData.jobId
          }
        });
        
        pieceData.pieceNumber = `${job.jobNumber}-P${(pieceCount + 1).toString().padStart(3, '0')}`;
      }
      
      // Create job piece
      const piece = await prisma.jobPiece.create({
        data: {
          jobId: pieceData.jobId,
          pieceNumber: pieceData.pieceNumber,
          markNumber: pieceData.markNumber,
          description: pieceData.description,
          type: pieceData.type,
          category: pieceData.category,
          status: pieceData.status || 'PLANNED',
          priority: pieceData.priority || 'MEDIUM',
          dimensions: pieceData.dimensions,
          quantity: pieceData.quantity || 1,
          unitOfMeasure: pieceData.unitOfMeasure,
          location: pieceData.location,
          finishDetails: pieceData.finishDetails,
          materialRequirements: pieceData.materialRequirements,
          productionDetails: pieceData.productionDetails,
          qualityControl: pieceData.qualityControl,
          shippingDetails: pieceData.shippingDetails,
          installationDetails: pieceData.installationDetails,
          notes: pieceData.notes,
          customFields: pieceData.customFields || {},
          tags: pieceData.tags || [],
          createdBy: pieceData.createdBy
        }
      });
      
      return new JobPieceModel(piece);
    } catch (error) {
      console.error('Error creating job piece:', error);
      throw new Error('Failed to create job piece');
    }
  }
  
  async updateJobPiece(id, pieceData) {
    try {
      const piece = await prisma.jobPiece.findUnique({
        where: { id }
      });
      
      if (!piece) {
        throw new Error('Job piece not found');
      }
      
      // Update job piece
      const updatedPiece = await prisma.jobPiece.update({
        where: { id },
        data: {
          markNumber: pieceData.markNumber,
          description: pieceData.description,
          type: pieceData.type,
          category: pieceData.category,
          status: pieceData.status,
          priority: pieceData.priority,
          dimensions: pieceData.dimensions,
          quantity: pieceData.quantity,
          unitOfMeasure: pieceData.unitOfMeasure,
          location: pieceData.location,
          finishDetails: pieceData.finishDetails,
          materialRequirements: pieceData.materialRequirements,
          productionDetails: pieceData.productionDetails,
          qualityControl: pieceData.qualityControl,
          shippingDetails: pieceData.shippingDetails,
          installationDetails: pieceData.installationDetails,
          notes: pieceData.notes,
          customFields: pieceData.customFields,
          tags: pieceData.tags,
          updatedAt: new Date()
        }
      });
      
      return new JobPieceModel(updatedPiece);
    } catch (error) {
      console.error(`Error updating job piece with ID ${id}:`, error);
      throw new Error('Failed to update job piece');
    }
  }
  
  async updateJobPieceStatus(id, statusData) {
    try {
      const piece = await prisma.jobPiece.findUnique({
        where: { id }
      });
      
      if (!piece) {
        throw new Error('Job piece not found');
      }
      
      // Update job piece status
      const updatedPiece = await prisma.jobPiece.update({
        where: { id },
        data: {
          status: statusData.status,
          updatedAt: new Date()
        }
      });
      
      // Update related modules based on status change
      await this.handlePieceStatusChange(piece, statusData.status, statusData.updatedBy);
      
      return new JobPieceModel(updatedPiece);
    } catch (error) {
      console.error(`Error updating job piece status with ID ${id}:`, error);
      throw new Error('Failed to update job piece status');
    }
  }
  
  /**
   * Job Document Management
   */
  async getJobDocuments(jobId, filters = {}) {
    try {
      const { type, category, status, search } = filters;
      
      const whereClause = { jobId };
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const documents = await prisma.jobDocument.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ]
      });
      
      return documents.map(doc => new JobDocumentModel(doc));
    } catch (error) {
      console.error(`Error fetching documents for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job documents');
    }
  }
  
  async createJobDocument(documentData) {
    try {
      // Validate job
      const job = await prisma.job.findUnique({
        where: { id: documentData.jobId }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Create job document
      const document = await prisma.jobDocument.create({
        data: {
          jobId: documentData.jobId,
          name: documentData.name,
          description: documentData.description,
          type: documentData.type,
          category: documentData.category,
          version: documentData.version || '1.0',
          status: documentData.status || 'DRAFT',
          url: documentData.url,
          filePath: documentData.filePath,
          fileSize: documentData.fileSize || 0,
          fileType: documentData.fileType,
          uploadedBy: documentData.uploadedBy,
          uploadedAt: new Date(),
          expiryDate: documentData.expiryDate ? new Date(documentData.expiryDate) : null,
          tags: documentData.tags || [],
          notes: documentData.notes,
          customFields: documentData.customFields || {},
          createdBy: documentData.createdBy
        }
      });
      
      return new JobDocumentModel(document);
    } catch (error) {
      console.error('Error creating job document:', error);
      throw new Error('Failed to create job document');
    }
  }
  
  /**
   * Job Drawing Management
   */
  async getJobDrawings(jobId, filters = {}) {
    try {
      const { type, category, status, pieceId, search } = filters;
      
      const whereClause = { jobId };
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (pieceId) whereClause.pieceId = pieceId;
      
      if (search) {
        whereClause.OR = [
          { drawingNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const drawings = await prisma.jobDrawing.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          piece: {
            select: {
              pieceNumber: true,
              markNumber: true
            }
          }
        }
      });
      
      return drawings.map(drawing => new JobDrawingModel(drawing));
    } catch (error) {
      console.error(`Error fetching drawings for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job drawings');
    }
  }
  
  async createJobDrawing(drawingData) {
    try {
      // Validate job
      const job = await prisma.job.findUnique({
        where: { id: drawingData.jobId }
      });
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Validate piece if provided
      if (drawingData.pieceId) {
        const piece = await prisma.jobPiece.findUnique({
          where: { id: drawingData.pieceId }
        });
        
        if (!piece) {
          throw new Error('Job piece not found');
        }
        
        if (piece.jobId !== drawingData.jobId) {
          throw new Error('Job piece does not belong to the specified job');
        }
      }
      
      // Generate drawing number if not provided
      if (!drawingData.drawingNumber) {
        const drawingCount = await prisma.jobDrawing.count({
          where: {
            jobId: drawingData.jobId
          }
        });
        
        drawingData.drawingNumber = `${job.jobNumber}-D${(drawingCount + 1).toString().padStart(3, '0')}`;
      }
      
      // Create job drawing
      const drawing = await prisma.jobDrawing.create({
        data: {
          jobId: drawingData.jobId,
          pieceId: drawingData.pieceId,
          drawingNumber: drawingData.drawingNumber,
          name: drawingData.name,
          description: drawingData.description,
          type: drawingData.type,
          category: drawingData.category,
          version: drawingData.version || '1.0',
          revisionNumber: drawingData.revisionNumber || 'A',
          status: drawingData.status || 'DRAFT',
          url: drawingData.url,
          filePath: drawingData.filePath,
          fileSize: drawingData.fileSize || 0,
          fileType: drawingData.fileType,
          scale: drawingData.scale,
          dimensions: drawingData.dimensions,
          drawnBy: drawingData.drawnBy,
          checkedBy: drawingData.checkedBy,
          approvedBy: drawingData.approvedBy,
          drawingDate: drawingData.drawingDate ? new Date(drawingData.drawingDate) : new Date(),
          revisionDate: drawingData.revisionDate ? new Date(drawingData.revisionDate) : new Date(),
          approvalDate: drawingData.approvalDate ? new Date(drawingData.approvalDate) : null,
          revisionHistory: drawingData.revisionHistory || [],
          relatedDrawings: drawingData.relatedDrawings || [],
          tags: drawingData.tags || [],
          notes: drawingData.notes,
          customFields: drawingData.customFields || {},
          createdBy: drawingData.createdBy
        }
      });
      
      return new JobDrawingModel(drawing);
    } catch (error) {
      console.error('Error creating job drawing:', error);
      throw new Error('Failed to create job drawing');
    }
  }
  
  /**
   * Job Change Order Management
   */
  async getJobChangeOrders(jobId, filters = {}) {
    try {
      const { type, status, priority, search } = filters;
      
      const whereClause = { jobId };
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      
      if (search) {
        whereClause.OR = [
          { changeOrderNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const changeOrders = await prisma.jobChangeOrder.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ]
      });
      
      return changeOrders.map(co => new JobChangeOrderModel(co));
    } catch (error) {
      console.error(`Error fetching change orders for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job change orders');
    }
  }
  
  /**
   * Job Risk Management
   */
  async getJobRisks(jobId, filters = {}) {
    try {
      const { category, status, severity, search } = filters;
      
      const whereClause = { jobId };
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (severity) whereClause.severity = severity;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const risks = await prisma.jobRisk.findMany({
        where: whereClause,
        orderBy: [
          { severity: 'desc' },
          { createdAt: 'desc' }
        ]
      });
      
      return risks.map(risk => new JobRiskModel(risk));
    } catch (error) {
      console.error(`Error fetching risks for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job risks');
    }
  }
  
  /**
   * Job Issue Management
   */
  async getJobIssues(jobId, filters = {}) {
    try {
      const { type, category, status, priority, severity, pieceId, search } = filters;
      
      const whereClause = { jobId };
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (severity) whereClause.severity = severity;
      if (pieceId) whereClause.pieceId = pieceId;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const issues = await prisma.jobIssue.findMany({
        where: whereClause,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          piece: {
            select: {
              pieceNumber: true,
              markNumber: true
            }
          }
        }
      });
      
      return issues.map(issue => new JobIssueModel(issue));
    } catch (error) {
      console.error(`Error fetching issues for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job issues');
    }
  }
  
  /**
   * Job Meeting Management
   */
  async getJobMeetings(jobId, filters = {}) {
    try {
      const { type, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = { jobId };
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.startDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const meetings = await prisma.jobMeeting.findMany({
        where: whereClause,
        orderBy: [
          { startDate: 'desc' }
        ]
      });
      
      return meetings.map(meeting => new JobMeetingModel(meeting));
    } catch (error) {
      console.error(`Error fetching meetings for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job meetings');
    }
  }
  
  /**
   * Job Inspection Management
   */
  async getJobInspections(jobId, filters = {}) {
    try {
      const { type, category, status, priority, pieceId, search } = filters;
      
      const whereClause = { jobId };
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (pieceId) whereClause.pieceId = pieceId;
      
      if (search) {
        whereClause.OR = [
          { inspectionNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const inspections = await prisma.jobInspection.findMany({
        where: whereClause,
        orderBy: [
          { scheduledDate: 'desc' }
        ],
        include: {
          piece: {
            select: {
              pieceNumber: true,
              markNumber: true
            }
          }
        }
      });
      
      return inspections.map(inspection => new JobInspectionModel(inspection));
    } catch (error) {
      console.error(`Error fetching inspections for job with ID ${jobId}:`, error);
      throw new Error('Failed to fetch job inspections');
    }
  }
  
  /**
   * Job Dashboard
   */
  async getJobDashboardData() {
    try {
      // Job stats
      const jobStats = await prisma.job.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const jobStatsData = {
        total: 0,
        active: 0,
        completed: 0,
        onHold: 0,
        cancelled: 0
      };
      
      jobStats.forEach(stat => {
        jobStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'ACTIVE':
            jobStatsData.active = stat._count.id;
            break;
          case 'COMPLETED':
            jobStatsData.completed = stat._count.id;
            break;
          case 'ON_HOLD':
            jobStatsData.onHold = stat._count.id;
            break;
          case 'CANCELLED':
            jobStatsData.cancelled = stat._count.id;
            break;
        }
      });
      
      // Piece stats
      const pieceStats = await prisma.jobPiece.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const pieceStatsData = {
        total: 0,
        planned: 0,
        designed: 0,
        approved: 0,
        inProduction: 0,
        produced: 0,
        qcPassed: 0,
        qcFailed: 0,
        stored: 0,
        shipped: 0,
        delivered: 0,
        installed: 0,
        rework: 0
      };
      
      pieceStats.forEach(stat => {
        pieceStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'PLANNED':
            pieceStatsData.planned = stat._count.id;
            break;
          case 'DESIGNED':
            pieceStatsData.designed = stat._count.id;
            break;
          case 'APPROVED':
            pieceStatsData.approved = stat._count.id;
            break;
          case 'IN_PRODUCTION':
            pieceStatsData.inProduction = stat._count.id;
            break;
          case 'PRODUCED':
            pieceStatsData.produced = stat._count.id;
            break;
          case 'QC_PASSED':
            pieceStatsData.qcPassed = stat._count.id;
            break;
          case 'QC_FAILED':
            pieceStatsData.qcFailed = stat._count.id;
            break;
          case 'STORED':
            pieceStatsData.stored = stat._count.id;
            break;
          case 'SHIPPED':
            pieceStatsData.shipped = stat._count.id;
            break;
          case 'DELIVERED':
            pieceStatsData.delivered = stat._count.id;
            break;
          case 'INSTALLED':
            pieceStatsData.installed = stat._count.id;
            break;
          case 'REWORK':
            pieceStatsData.rework = stat._count.id;
            break;
        }
      });
      
      // Schedule status
      const today = new Date();
      const activeJobs = await prisma.job.findMany({
        where: {
          status: 'ACTIVE'
        },
        select: {
          id: true,
          name: true,
          targetCompletionDate: true,
          keyDates: true
        }
      });
      
      const scheduleStatus = {
        onSchedule: 0,
        behindSchedule: 0,
        aheadOfSchedule: 0,
        criticalDelay: 0
      };
      
      activeJobs.forEach(job => {
        // Simplified schedule status calculation
        if (job.targetCompletionDate) {
          const daysToCompletion = Math.ceil((job.targetCompletionDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysToCompletion < -14) {
            scheduleStatus.criticalDelay++;
          } else if (daysToCompletion < 0) {
            scheduleStatus.behindSchedule++;
          } else if (daysToCompletion > 14) {
            scheduleStatus.aheadOfSchedule++;
          } else {
            scheduleStatus.onSchedule++;
          }
        }
      });
      
      // Budget status
      const budgetStatus = {
        underBudget: 0,
        onBudget: 0,
        overBudget: 0,
        criticalOverage: 0
      };
      
      activeJobs.forEach(job => {
        // Simplified budget status calculation based on job.budget
        if (job.budget) {
          const totalBudget = job.budget.totalBudget || 0;
          const actualCosts = job.budget.actualCosts ? 
            Object.values(job.budget.actualCosts).reduce((sum, cost) => sum + (cost || 0), 0) : 0;
          
          if (totalBudget > 0) {
            const budgetVariance = (actualCosts / totalBudget) * 100;
            
            if (budgetVariance > 120) {
              budgetStatus.criticalOverage++;
            } else if (budgetVariance > 100) {
              budgetStatus.overBudget++;
            } else if (budgetVariance < 90) {
              budgetStatus.underBudget++;
            } else {
              budgetStatus.onBudget++;
            }
          }
        }
      });
      
      // Issue stats
      const issueStats = await prisma.jobIssue.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const issueStatsData = {
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        highPriority: 0
      };
      
      issueStats.forEach(stat => {
        switch (stat.status) {
          case 'OPEN':
            issueStatsData.open = stat._count.id;
            break;
          case 'IN_PROGRESS':
            issueStatsData.inProgress = stat._count.id;
            break;
          case 'RESOLVED':
            issueStatsData.resolved = stat._count.id;
            break;
          case 'CLOSED':
            issueStatsData.closed = stat._count.id;
            break;
        }
      });
      
      // Count high priority issues
      const highPriorityIssues = await prisma.jobIssue.count({
        where: {
          priority: 'HIGH'
        }
      });
      
      issueStatsData.highPriority = highPriorityIssues;
      
      // Risk stats
      const riskStats = await prisma.jobRisk.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const riskStatsData = {
        identified: 0,
        mitigated: 0,
        accepted: 0,
        closed: 0,
        highSeverity: 0
      };
      
      riskStats.forEach(stat => {
        switch (stat.status) {
          case 'IDENTIFIED':
            riskStatsData.identified = stat._count.id;
            break;
          case 'MITIGATED':
            riskStatsData.mitigated = stat._count.id;
            break;
          case 'ACCEPTED':
            riskStatsData.accepted = stat._count.id;
            break;
          case 'CLOSED':
            riskStatsData.closed = stat._count.id;
            break;
        }
      });
      
      // Count high severity risks
      const highSeverityRisks = await prisma.jobRisk.count({
        where: {
          severity: 'HIGH'
        }
      });
      
      riskStatsData.highSeverity = highSeverityRisks;
      
      // Upcoming deliveries
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const upcomingDeliveries = await prisma.jobPiece.findMany({
        where: {
          shippingDetails: {
            path: ['plannedShipDate'],
            gte: today.toISOString(),
            lte: nextMonth.toISOString()
          }
        },
        orderBy: {
          shippingDetails: {
            path: ['plannedShipDate']
          }
        },
        select: {
          id: true,
          pieceNumber: true,
          markNumber: true,
          description: true,
          shippingDetails: true,
          job: {
            select: {
              id: true,
              jobNumber: true,
              name: true
            }
          }
        },
        take: 10
      });
      
      // Recent issues
      const recentIssues = await prisma.jobIssue.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          type: true,
          priority: true,
          status: true,
          createdAt: true,
          job: {
            select: {
              id: true,
              jobNumber: true,
              name: true
            }
          }
        }
      });
      
      // Upcoming milestones
      const upcomingMilestones = [];
      activeJobs.forEach(job => {
        if (job.keyDates) {
          Object.entries(job.keyDates).forEach(([key, value]) => {
            if (value && new Date(value) > today && new Date(value) < nextMonth) {
              upcomingMilestones.push({
                jobId: job.id,
                jobName: job.name,
                milestoneName: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                date: value
              });
            }
          });
        }
      });
      
      upcomingMilestones.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Recent activities
      const recentActivities = []; // Would be populated from an activity log
      
      // Jobs by type
      const jobsByType = await prisma.job.groupBy({
        by: ['type'],
        _count: {
          id: true
        },
        where: {
          type: {
            not: null
          }
        }
      });
      
      const jobsByTypeArray = jobsByType.map(item => ({
        type: item.type,
        count: item._count.id
      }));
      
      // Jobs by status
      const jobsByStatus = await prisma.job.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const jobsByStatusArray = jobsByStatus.map(item => ({
        status: item.status,
        count: item._count.id
      }));
      
      // Jobs by client
      const jobsByClient = await prisma.job.groupBy({
        by: ['clientName'],
        _count: {
          id: true
        },
        where: {
          clientName: {
            not: null
          }
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      });
      
      const jobsByClientArray = jobsByClient.map(item => ({
        clientName: item.clientName,
        count: item._count.id
      }));
      
      // Job performance
      const completedJobs = await prisma.job.findMany({
        where: {
          status: 'COMPLETED'
        },
        select: {
          id: true,
          targetCompletionDate: true,
          actualCompletionDate: true,
          budget: true
        }
      });
      
      let onTimeCount = 0;
      let onBudgetCount = 0;
      
      completedJobs.forEach(job => {
        if (job.targetCompletionDate && job.actualCompletionDate) {
          if (new Date(job.actualCompletionDate) <= new Date(job.targetCompletionDate)) {
            onTimeCount++;
          }
        }
        
        if (job.budget) {
          const totalBudget = job.budget.totalBudget || 0;
          const actualCosts = job.budget.actualCosts ? 
            Object.values(job.budget.actualCosts).reduce((sum, cost) => sum + (cost || 0), 0) : 0;
          
          if (totalBudget > 0 && actualCosts <= totalBudget) {
            onBudgetCount++;
          }
        }
      });
      
      const jobPerformance = {
        onTimeCompletion: completedJobs.length > 0 ? (onTimeCount / completedJobs.length) * 100 : 0,
        onBudgetCompletion: completedJobs.length > 0 ? (onBudgetCount / completedJobs.length) * 100 : 0,
        qualityRating: 85, // Placeholder
        clientSatisfaction: 90 // Placeholder
      };
      
      return new JobDashboardModel({
        jobStats: jobStatsData,
        pieceStats: pieceStatsData,
        scheduleStatus,
        budgetStatus,
        issueStats: issueStatsData,
        riskStats: riskStatsData,
        upcomingDeliveries,
        recentIssues,
        upcomingMilestones,
        recentActivities,
        jobsByType: jobsByTypeArray,
        jobsByStatus: jobsByStatusArray,
        jobsByClient: jobsByClientArray,
        jobPerformance
      });
    } catch (error) {
      console.error('Error fetching job dashboard data:', error);
      throw new Error('Failed to fetch job dashboard data');
    }
  }
  
  /**
   * Cross-Module Integration
   */
  async handlePieceStatusChange(piece, newStatus, updatedBy) {
    try {
      // Update related modules based on piece status change
      switch (newStatus) {
        case 'DESIGNED':
          // Notify Engineering/Drafting module
          // await this.notifyDraftingModule(piece, 'DESIGN_COMPLETED', updatedBy);
          break;
        
        case 'APPROVED':
          // Notify Production module
          // await this.notifyProductionModule(piece, 'READY_FOR_PRODUCTION', updatedBy);
          break;
        
        case 'IN_PRODUCTION':
          // Update Production schedule
          // await this.updateProductionSchedule(piece, updatedBy);
          break;
        
        case 'PRODUCED':
          // Notify QC module
          // await this.notifyQCModule(piece, 'READY_FOR_INSPECTION', updatedBy);
          break;
        
        case 'QC_PASSED':
          // Notify Yard Management module
          // await this.notifyYardModule(piece, 'READY_FOR_STORAGE', updatedBy);
          break;
        
        case 'QC_FAILED':
          // Notify Production for rework
          // await this.notifyProductionModule(piece, 'REQUIRES_REWORK', updatedBy);
          break;
        
        case 'STORED':
          // Update Yard Management inventory
          // await this.updateYardInventory(piece, updatedBy);
          break;
        
        case 'SHIPPED':
          // Notify Shipping/Dispatch module
          // await this.notifyShippingModule(piece, 'SHIPPED', updatedBy);
          break;
        
        case 'DELIVERED':
          // Notify Field Services module
          // await this.notifyFieldServicesModule(piece, 'DELIVERED', updatedBy);
          break;
        
        case 'INSTALLED':
          // Update Project Management module
          // await this.updateProjectProgress(piece, updatedBy);
          break;
        
        case 'REWORK':
          // Notify Production and QC modules
          // await this.notifyProductionModule(piece, 'REWORK_REQUIRED', updatedBy);
          // await this.notifyQCModule(piece, 'REWORK_REQUIRED', updatedBy);
          break;
      }
      
      return true;
    } catch (error) {
      console.error(`Error handling piece status change for piece ${piece.id}:`, error);
      // Log error but don't throw to prevent disrupting the main operation
      return false;
    }
  }
}

export default new JobService();
