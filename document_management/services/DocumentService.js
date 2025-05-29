/**
 * Document Management Services
 * Provides business logic and data access for the Document Management module
 */

import prisma from '../../../lib/prisma';
import { 
  DocumentModel, 
  DocumentVersionModel, 
  DocumentFolderModel,
  DocumentCommentModel,
  DocumentApprovalModel,
  ApprovalWorkflowModel,
  DocumentTagModel,
  DocumentAccessLogModel,
  DocumentShareModel,
  DocumentTemplateModel
} from '../models/DocumentModel';

export class DocumentService {
  /**
   * Document Management
   */
  async getDocuments(filters = {}) {
    try {
      const { 
        type, 
        category, 
        status, 
        projectId, 
        tags, 
        accessLevel, 
        search,
        folderId,
        createdBy,
        dateFrom,
        dateTo
      } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (projectId) whereClause.projectId = projectId;
      if (folderId) whereClause.folderId = folderId;
      if (createdBy) whereClause.createdBy = createdBy;
      if (accessLevel) whereClause.accessLevel = accessLevel;
      
      if (tags && tags.length > 0) {
        whereClause.tags = {
          hasSome: tags
        };
      }
      
      if (dateFrom && dateTo) {
        whereClause.createdAt = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { fileName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const documents = await prisma.document.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          folder: {
            select: {
              name: true,
              path: true
            }
          },
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return documents.map(doc => new DocumentModel({
        ...doc,
        projectName: doc.project?.name || '',
        folderPath: doc.folder?.path || '/'
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }
  
  async getDocumentById(id, includeVersions = false, includeComments = false) {
    try {
      const include = {
        versions: includeVersions ? {
          orderBy: { createdAt: 'desc' }
        } : {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        folder: {
          select: {
            name: true,
            path: true
          }
        },
        project: {
          select: {
            name: true
          }
        }
      };
      
      if (includeComments) {
        include.comments = {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' }
        };
      }
      
      const document = await prisma.document.findUnique({
        where: { id },
        include
      });
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      // Log access
      await this.logDocumentAccess(id, document.versions[0]?.version || '1.0', 'VIEW');
      
      return new DocumentModel({
        ...document,
        projectName: document.project?.name || '',
        folderPath: document.folder?.path || '/',
        versions: document.versions.map(version => new DocumentVersionModel(version)),
        comments: includeComments ? document.comments.map(comment => new DocumentCommentModel(comment)) : undefined
      });
    } catch (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw new Error('Failed to fetch document');
    }
  }
  
  async createDocument(documentData, file) {
    try {
      // Validate folder exists if folderId is provided
      if (documentData.folderId) {
        const folder = await prisma.documentFolder.findUnique({
          where: { id: documentData.folderId }
        });
        
        if (!folder) {
          throw new Error('Folder not found');
        }
      }
      
      // Validate project exists if projectId is provided
      if (documentData.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: documentData.projectId }
        });
        
        if (!project) {
          throw new Error('Project not found');
        }
      }
      
      // Process file upload
      const fileUrl = file ? await this.uploadFile(file) : documentData.fileUrl;
      
      // Create document
      const document = await prisma.document.create({
        data: {
          title: documentData.title,
          description: documentData.description,
          type: documentData.type,
          category: documentData.category,
          tags: documentData.tags || [],
          fileUrl: fileUrl,
          fileName: file ? file.originalname : documentData.fileName,
          fileSize: file ? file.size : documentData.fileSize,
          fileType: file ? file.mimetype : documentData.fileType,
          version: '1.0',
          status: documentData.status || 'ACTIVE',
          projectId: documentData.projectId,
          folderId: documentData.folderId,
          relatedEntities: documentData.relatedEntities || [],
          createdBy: documentData.createdBy,
          updatedBy: documentData.createdBy,
          expirationDate: documentData.expirationDate ? new Date(documentData.expirationDate) : null,
          accessLevel: documentData.accessLevel || 'INTERNAL',
          accessGroups: documentData.accessGroups || [],
          customFields: documentData.customFields || {}
        }
      });
      
      // Create initial version
      await prisma.documentVersion.create({
        data: {
          documentId: document.id,
          version: '1.0',
          fileUrl: fileUrl,
          fileName: file ? file.originalname : documentData.fileName,
          fileSize: file ? file.size : documentData.fileSize,
          fileType: file ? file.mimetype : documentData.fileType,
          changeDescription: 'Initial version',
          createdBy: documentData.createdBy,
          status: 'ACTIVE'
        }
      });
      
      // Start approval workflow if specified
      if (documentData.approvalWorkflowId) {
        await this.startApprovalWorkflow(document.id, documentData.approvalWorkflowId, documentData.createdBy);
      }
      
      return new DocumentModel(document);
    } catch (error) {
      console.error('Error creating document:', error);
      throw new Error('Failed to create document');
    }
  }
  
  async updateDocument(id, documentData, file) {
    try {
      // Get current document
      const currentDocument = await prisma.document.findUnique({
        where: { id },
        include: {
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });
      
      if (!currentDocument) {
        throw new Error('Document not found');
      }
      
      // Determine if this is a new version or just metadata update
      const isNewVersion = file || documentData.isNewVersion;
      
      // Process file upload if provided
      let fileUrl = currentDocument.fileUrl;
      let fileName = currentDocument.fileName;
      let fileSize = currentDocument.fileSize;
      let fileType = currentDocument.fileType;
      
      if (file) {
        fileUrl = await this.uploadFile(file);
        fileName = file.originalname;
        fileSize = file.size;
        fileType = file.mimetype;
      }
      
      // Calculate new version number if needed
      let newVersion = currentDocument.version;
      if (isNewVersion) {
        const versionParts = currentDocument.version.split('.');
        const minorVersion = parseInt(versionParts[1] || '0') + 1;
        newVersion = `${versionParts[0]}.${minorVersion}`;
      }
      
      // Update document
      const document = await prisma.document.update({
        where: { id },
        data: {
          title: documentData.title,
          description: documentData.description,
          type: documentData.type,
          category: documentData.category,
          tags: documentData.tags,
          fileUrl: isNewVersion ? fileUrl : currentDocument.fileUrl,
          fileName: isNewVersion ? fileName : currentDocument.fileName,
          fileSize: isNewVersion ? fileSize : currentDocument.fileSize,
          fileType: isNewVersion ? fileType : currentDocument.fileType,
          version: isNewVersion ? newVersion : currentDocument.version,
          status: documentData.status,
          projectId: documentData.projectId,
          folderId: documentData.folderId,
          relatedEntities: documentData.relatedEntities,
          updatedBy: documentData.updatedBy,
          updatedAt: new Date(),
          expirationDate: documentData.expirationDate ? new Date(documentData.expirationDate) : null,
          accessLevel: documentData.accessLevel,
          accessGroups: documentData.accessGroups,
          customFields: documentData.customFields
        }
      });
      
      // Create new version if needed
      if (isNewVersion) {
        // Set previous version to superseded
        await prisma.documentVersion.updateMany({
          where: { documentId: id, status: 'ACTIVE' },
          data: { status: 'SUPERSEDED' }
        });
        
        // Create new version
        await prisma.documentVersion.create({
          data: {
            documentId: id,
            version: newVersion,
            fileUrl: fileUrl,
            fileName: fileName,
            fileSize: fileSize,
            fileType: fileType,
            changeDescription: documentData.changeDescription || 'Updated version',
            createdBy: documentData.updatedBy,
            status: 'ACTIVE'
          }
        });
        
        // Start approval workflow if specified
        if (documentData.approvalWorkflowId) {
          await this.startApprovalWorkflow(id, documentData.approvalWorkflowId, documentData.updatedBy);
        }
      }
      
      return new DocumentModel(document);
    } catch (error) {
      console.error(`Error updating document with ID ${id}:`, error);
      throw new Error('Failed to update document');
    }
  }
  
  /**
   * Document Folders
   */
  async getFolders(parentId = null) {
    try {
      const whereClause = {};
      if (parentId === null) {
        whereClause.parentId = null;
      } else {
        whereClause.parentId = parentId;
      }
      
      const folders = await prisma.documentFolder.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return folders.map(folder => new DocumentFolderModel(folder));
    } catch (error) {
      console.error('Error fetching document folders:', error);
      throw new Error('Failed to fetch document folders');
    }
  }
  
  async createFolder(folderData) {
    try {
      // Validate parent folder exists if parentId is provided
      let path = '/';
      if (folderData.parentId) {
        const parentFolder = await prisma.documentFolder.findUnique({
          where: { id: folderData.parentId }
        });
        
        if (!parentFolder) {
          throw new Error('Parent folder not found');
        }
        
        path = parentFolder.path === '/' ? `/${parentFolder.name}` : `${parentFolder.path}/${parentFolder.name}`;
      }
      
      const folder = await prisma.documentFolder.create({
        data: {
          name: folderData.name,
          description: folderData.description,
          parentId: folderData.parentId,
          path: path,
          accessLevel: folderData.accessLevel || 'INTERNAL',
          accessGroups: folderData.accessGroups || [],
          createdBy: folderData.createdBy,
          updatedBy: folderData.createdBy
        }
      });
      
      return new DocumentFolderModel(folder);
    } catch (error) {
      console.error('Error creating document folder:', error);
      throw new Error('Failed to create document folder');
    }
  }
  
  /**
   * Document Comments
   */
  async addComment(commentData) {
    try {
      // Validate document exists
      const document = await prisma.document.findUnique({
        where: { id: commentData.documentId }
      });
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      const comment = await prisma.documentComment.create({
        data: {
          documentId: commentData.documentId,
          documentVersion: commentData.documentVersion || document.version,
          content: commentData.content,
          pageNumber: commentData.pageNumber,
          coordinates: commentData.coordinates,
          createdBy: commentData.createdBy,
          status: 'ACTIVE',
          parentId: commentData.parentId,
          attachments: commentData.attachments || []
        }
      });
      
      return new DocumentCommentModel(comment);
    } catch (error) {
      console.error('Error adding document comment:', error);
      throw new Error('Failed to add document comment');
    }
  }
  
  /**
   * Document Approvals
   */
  async startApprovalWorkflow(documentId, workflowId, initiatedBy) {
    try {
      // Validate document exists
      const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
          versions: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      // Validate workflow exists
      const workflow = await prisma.approvalWorkflow.findUnique({
        where: { id: workflowId }
      });
      
      if (!workflow) {
        throw new Error('Approval workflow not found');
      }
      
      // Check if there's already an active approval process
      const existingApproval = await prisma.documentApproval.findFirst({
        where: {
          documentId,
          documentVersion: document.version,
          status: { in: ['PENDING', 'IN_PROGRESS'] }
        }
      });
      
      if (existingApproval) {
        throw new Error('Document already has an active approval process');
      }
      
      // Create approval process
      const approval = await prisma.documentApproval.create({
        data: {
          documentId,
          documentVersion: document.versions[0]?.version || document.version,
          approvalWorkflowId: workflowId,
          status: 'PENDING',
          approvers: workflow.steps.map(step => ({
            userId: step.approverIds[0], // Default to first approver in step
            stepId: step.id,
            stepName: step.name,
            status: 'PENDING',
            date: null,
            comments: ''
          })),
          currentStep: 0,
          startDate: new Date(),
          dueDate: workflow.defaultDueDays ? new Date(new Date().setDate(new Date().getDate() + workflow.defaultDueDays)) : null,
          createdBy: initiatedBy
        }
      });
      
      // Update document status
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: 'PENDING_APPROVAL',
          updatedAt: new Date(),
          updatedBy: initiatedBy
        }
      });
      
      return new DocumentApprovalModel(approval);
    } catch (error) {
      console.error('Error starting approval workflow:', error);
      throw new Error('Failed to start approval workflow');
    }
  }
  
  async updateApprovalStatus(approvalId, stepIndex, userId, status, comments) {
    try {
      // Get current approval
      const approval = await prisma.documentApproval.findUnique({
        where: { id: approvalId }
      });
      
      if (!approval) {
        throw new Error('Approval not found');
      }
      
      if (approval.status !== 'PENDING' && approval.status !== 'IN_PROGRESS') {
        throw new Error('Approval process is no longer active');
      }
      
      // Validate step index
      if (stepIndex < 0 || stepIndex >= approval.approvers.length) {
        throw new Error('Invalid step index');
      }
      
      // Validate user is an approver for this step
      const approver = approval.approvers[stepIndex];
      if (approver.userId !== userId) {
        throw new Error('User is not authorized to approve this step');
      }
      
      // Update approver status
      const updatedApprovers = [...approval.approvers];
      updatedApprovers[stepIndex] = {
        ...approver,
        status: status,
        date: new Date().toISOString(),
        comments: comments || ''
      };
      
      // Determine overall approval status
      let overallStatus = 'IN_PROGRESS';
      let currentStep = approval.currentStep;
      
      if (status === 'REJECTED') {
        overallStatus = 'REJECTED';
      } else if (status === 'APPROVED') {
        // Check if all steps are approved
        const allApproved = updatedApprovers.every(a => a.status === 'APPROVED');
        if (allApproved) {
          overallStatus = 'APPROVED';
        } else {
          // Move to next step
          currentStep = stepIndex + 1;
          if (currentStep >= updatedApprovers.length) {
            currentStep = updatedApprovers.length - 1;
          }
        }
      }
      
      // Update approval
      const updatedApproval = await prisma.documentApproval.update({
        where: { id: approvalId },
        data: {
          approvers: updatedApprovers,
          status: overallStatus,
          currentStep,
          completionDate: ['APPROVED', 'REJECTED'].includes(overallStatus) ? new Date() : null,
          updatedAt: new Date()
        }
      });
      
      // Update document status if approval is complete
      if (['APPROVED', 'REJECTED'].includes(overallStatus)) {
        await prisma.document.update({
          where: { id: approval.documentId },
          data: {
            status: overallStatus === 'APPROVED' ? 'ACTIVE' : 'REJECTED',
            updatedAt: new Date()
          }
        });
      }
      
      return new DocumentApprovalModel(updatedApproval);
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw new Error('Failed to update approval status');
    }
  }
  
  /**
   * Document Sharing
   */
  async shareDocument(shareData) {
    try {
      // Validate document exists
      const document = await prisma.document.findUnique({
        where: { id: shareData.documentId }
      });
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      // Generate share link if needed
      let shareLink = '';
      if (shareData.shareType === 'PUBLIC' || shareData.recipientType === 'LINK') {
        shareLink = await this.generateShareLink(shareData.documentId);
      }
      
      // Create share
      const share = await prisma.documentShare.create({
        data: {
          documentId: shareData.documentId,
          documentVersion: shareData.documentVersion || document.version,
          shareType: shareData.shareType,
          recipientType: shareData.recipientType,
          recipientId: shareData.recipientId,
          recipientEmail: shareData.recipientEmail,
          accessLevel: shareData.accessLevel || 'VIEW',
          expirationDate: shareData.expirationDate ? new Date(shareData.expirationDate) : null,
          shareLink,
          password: shareData.password,
          createdBy: shareData.createdBy,
          status: 'ACTIVE'
        }
      });
      
      return new DocumentShareModel(share);
    } catch (error) {
      console.error('Error sharing document:', error);
      throw new Error('Failed to share document');
    }
  }
  
  /**
   * Document Access Logging
   */
  async logDocumentAccess(documentId, version, action, userId = null, details = '') {
    try {
      await prisma.documentAccessLog.create({
        data: {
          documentId,
          documentVersion: version,
          userId: userId || 'ANONYMOUS',
          action,
          timestamp: new Date(),
          details
        }
      });
      
      // Update access count if this is a share access
      if (action === 'SHARE_ACCESS') {
        await prisma.documentShare.updateMany({
          where: {
            documentId,
            documentVersion: version,
            status: 'ACTIVE'
          },
          data: {
            accessCount: {
              increment: 1
            },
            lastAccessed: new Date()
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error logging document access:', error);
      // Don't throw here, just log the error
      return false;
    }
  }
  
  /**
   * Document Templates
   */
  async getTemplates(filters = {}) {
    try {
      const { type, category, status } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      
      const templates = await prisma.documentTemplate.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return templates.map(template => new DocumentTemplateModel(template));
    } catch (error) {
      console.error('Error fetching document templates:', error);
      throw new Error('Failed to fetch document templates');
    }
  }
  
  /**
   * Helper Methods
   */
  async uploadFile(file) {
    // This would typically use a file storage service like S3
    // For now, we'll just return a placeholder URL
    return `/uploads/documents/${file.originalname}`;
  }
  
  async generateShareLink(documentId) {
    // Generate a unique token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `/share/${documentId}/${token}`;
  }
}

export default new DocumentService();
