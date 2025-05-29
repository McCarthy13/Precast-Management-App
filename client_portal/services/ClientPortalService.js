/**
 * Client Portal Services
 * Provides business logic and data access for the Client Portal module
 */

import prisma from '../../../lib/prisma';
import { 
  ClientUserModel, 
  ClientCompanyModel, 
  ClientProjectModel,
  ClientDocumentModel,
  ClientMessageModel,
  ClientDeliveryModel,
  ClientApprovalRequestModel,
  ClientInvoiceModel,
  ClientNotificationModel,
  ClientDashboardWidgetModel
} from '../models/ClientPortalModel';

export class ClientPortalService {
  /**
   * Client User Management
   */
  async getClientUsers(filters = {}) {
    try {
      const { clientId, status, search } = filters;
      
      const whereClause = {};
      if (clientId) whereClause.clientId = clientId;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const users = await prisma.clientUser.findMany({
        where: whereClause,
        orderBy: { lastName: 'asc' },
        include: {
          client: {
            select: {
              name: true
            }
          }
        }
      });
      
      return users.map(user => new ClientUserModel({
        ...user,
        clientName: user.client?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching client users:', error);
      throw new Error('Failed to fetch client users');
    }
  }
  
  async getClientUserById(id) {
    try {
      const user = await prisma.clientUser.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              name: true
            }
          }
        }
      });
      
      if (!user) {
        throw new Error('Client user not found');
      }
      
      return new ClientUserModel({
        ...user,
        clientName: user.client?.name || ''
      });
    } catch (error) {
      console.error(`Error fetching client user with ID ${id}:`, error);
      throw new Error('Failed to fetch client user');
    }
  }
  
  async createClientUser(userData) {
    try {
      // Validate client exists
      const client = await prisma.client.findUnique({
        where: { id: userData.clientId }
      });
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Check if email is already in use
      const existingUser = await prisma.clientUser.findFirst({
        where: { email: userData.email }
      });
      
      if (existingUser) {
        throw new Error('Email is already in use');
      }
      
      // Create user in auth system (this would typically use an auth service)
      const authUser = await this.createAuthUser(userData);
      
      // Create client user
      const user = await prisma.clientUser.create({
        data: {
          userId: authUser.id,
          clientId: userData.clientId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          position: userData.position,
          department: userData.department,
          isAdmin: userData.isAdmin || false,
          status: userData.status || 'PENDING',
          notificationPreferences: userData.notificationPreferences || {
            email: true,
            sms: false,
            projectUpdates: true,
            deliveryUpdates: true,
            documentUpdates: true
          }
        }
      });
      
      // Send welcome email (this would typically use an email service)
      await this.sendWelcomeEmail(user);
      
      return new ClientUserModel(user);
    } catch (error) {
      console.error('Error creating client user:', error);
      throw new Error('Failed to create client user');
    }
  }
  
  /**
   * Client Company Management
   */
  async getClientCompanies(filters = {}) {
    try {
      const { status, industry, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (industry) whereClause.industry = industry;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const clients = await prisma.client.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        include: {
          primaryContact: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        }
      });
      
      return clients.map(client => new ClientCompanyModel({
        ...client,
        primaryContactName: client.primaryContact ? `${client.primaryContact.firstName} ${client.primaryContact.lastName}` : '',
        primaryContactEmail: client.primaryContact?.email || '',
        primaryContactPhone: client.primaryContact?.phone || ''
      }));
    } catch (error) {
      console.error('Error fetching client companies:', error);
      throw new Error('Failed to fetch client companies');
    }
  }
  
  async getClientCompanyById(id) {
    try {
      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          primaryContact: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          users: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              position: true,
              isAdmin: true,
              status: true
            }
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true,
              progress: true
            },
            where: {
              status: { not: 'ARCHIVED' }
            },
            orderBy: { updatedAt: 'desc' },
            take: 5
          }
        }
      });
      
      if (!client) {
        throw new Error('Client company not found');
      }
      
      return new ClientCompanyModel({
        ...client,
        primaryContactName: client.primaryContact ? `${client.primaryContact.firstName} ${client.primaryContact.lastName}` : '',
        primaryContactEmail: client.primaryContact?.email || '',
        primaryContactPhone: client.primaryContact?.phone || '',
        users: client.users,
        recentProjects: client.projects
      });
    } catch (error) {
      console.error(`Error fetching client company with ID ${id}:`, error);
      throw new Error('Failed to fetch client company');
    }
  }
  
  /**
   * Client Project Management
   */
  async getClientProjects(filters = {}) {
    try {
      const { clientId, status, search } = filters;
      
      const whereClause = {};
      if (clientId) whereClause.clientId = clientId;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const projects = await prisma.clientProject.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
          client: {
            select: {
              name: true
            }
          },
          primaryContact: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      
      return projects.map(project => new ClientProjectModel({
        ...project,
        clientName: project.client?.name || '',
        primaryContactName: project.primaryContact ? `${project.primaryContact.firstName} ${project.primaryContact.lastName}` : ''
      }));
    } catch (error) {
      console.error('Error fetching client projects:', error);
      throw new Error('Failed to fetch client projects');
    }
  }
  
  async getClientProjectById(id, clientId = null) {
    try {
      const whereClause = { id };
      if (clientId) whereClause.clientId = clientId; // For security when accessed by client users
      
      const project = await prisma.clientProject.findFirst({
        where: whereClause,
        include: {
          client: {
            select: {
              name: true
            }
          },
          primaryContact: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          documents: {
            where: {
              status: 'ACTIVE'
            },
            orderBy: { updatedAt: 'desc' },
            take: 10
          },
          deliveries: {
            orderBy: { scheduledDate: 'asc' },
            take: 5
          },
          approvalRequests: {
            where: {
              status: 'PENDING'
            },
            orderBy: { dueDate: 'asc' },
            take: 5
          }
        }
      });
      
      if (!project) {
        throw new Error('Client project not found');
      }
      
      return new ClientProjectModel({
        ...project,
        clientName: project.client?.name || '',
        primaryContactName: project.primaryContact ? `${project.primaryContact.firstName} ${project.primaryContact.lastName}` : '',
        primaryContactEmail: project.primaryContact?.email || '',
        primaryContactPhone: project.primaryContact?.phone || '',
        recentDocuments: project.documents.map(doc => new ClientDocumentModel(doc)),
        upcomingDeliveries: project.deliveries.map(delivery => new ClientDeliveryModel(delivery)),
        pendingApprovals: project.approvalRequests.map(approval => new ClientApprovalRequestModel(approval))
      });
    } catch (error) {
      console.error(`Error fetching client project with ID ${id}:`, error);
      throw new Error('Failed to fetch client project');
    }
  }
  
  /**
   * Client Document Management
   */
  async getClientDocuments(filters = {}) {
    try {
      const { clientId, projectId, type, status, search } = filters;
      
      const whereClause = {};
      if (clientId) whereClause.clientId = clientId;
      if (projectId) whereClause.projectId = projectId;
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { fileName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const documents = await prisma.clientDocument.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return documents.map(doc => new ClientDocumentModel({
        ...doc,
        projectName: doc.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching client documents:', error);
      throw new Error('Failed to fetch client documents');
    }
  }
  
  async uploadClientDocument(documentData, file) {
    try {
      // Validate client and project exist
      const client = await prisma.client.findUnique({
        where: { id: documentData.clientId }
      });
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      if (documentData.projectId) {
        const project = await prisma.clientProject.findFirst({
          where: {
            id: documentData.projectId,
            clientId: documentData.clientId
          }
        });
        
        if (!project) {
          throw new Error('Project not found or does not belong to this client');
        }
      }
      
      // Process file upload
      const fileUrl = file ? await this.uploadFile(file) : documentData.fileUrl;
      
      // Create document
      const document = await prisma.clientDocument.create({
        data: {
          clientId: documentData.clientId,
          projectId: documentData.projectId,
          title: documentData.title,
          description: documentData.description,
          type: documentData.type,
          fileUrl: fileUrl,
          fileName: file ? file.originalname : documentData.fileName,
          fileSize: file ? file.size : documentData.fileSize,
          fileType: file ? file.mimetype : documentData.fileType,
          version: '1.0',
          status: documentData.status || 'ACTIVE',
          uploadedBy: documentData.uploadedBy,
          uploadedAt: new Date(),
          expirationDate: documentData.expirationDate ? new Date(documentData.expirationDate) : null,
          isSharedByClient: documentData.isSharedByClient || true,
          accessLevel: documentData.accessLevel || 'VIEW',
          tags: documentData.tags || []
        }
      });
      
      // Create notification for company users
      await this.createDocumentNotification(document, 'UPLOAD');
      
      return new ClientDocumentModel(document);
    } catch (error) {
      console.error('Error uploading client document:', error);
      throw new Error('Failed to upload client document');
    }
  }
  
  /**
   * Client Message Center
   */
  async getClientMessages(filters = {}) {
    try {
      const { clientId, projectId, userId, status, search } = filters;
      
      const whereClause = {};
      if (clientId) whereClause.clientId = clientId;
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      
      if (userId) {
        whereClause.OR = [
          { senderId: userId },
          { recipientIds: { has: userId } }
        ];
      }
      
      if (search) {
        whereClause.OR = [
          { subject: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const messages = await prisma.clientMessage.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return messages.map(message => new ClientMessageModel({
        ...message,
        projectName: message.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching client messages:', error);
      throw new Error('Failed to fetch client messages');
    }
  }
  
  async sendClientMessage(messageData) {
    try {
      // Validate client and project exist
      const client = await prisma.client.findUnique({
        where: { id: messageData.clientId }
      });
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      if (messageData.projectId) {
        const project = await prisma.clientProject.findFirst({
          where: {
            id: messageData.projectId,
            clientId: messageData.clientId
          }
        });
        
        if (!project) {
          throw new Error('Project not found or does not belong to this client');
        }
      }
      
      // Create message
      const message = await prisma.clientMessage.create({
        data: {
          clientId: messageData.clientId,
          projectId: messageData.projectId,
          subject: messageData.subject,
          content: messageData.content,
          senderId: messageData.senderId,
          senderName: messageData.senderName,
          senderType: messageData.senderType,
          recipientIds: messageData.recipientIds,
          recipientNames: messageData.recipientNames,
          status: 'UNREAD',
          priority: messageData.priority || 'NORMAL',
          attachments: messageData.attachments || [],
          parentMessageId: messageData.parentMessageId
        }
      });
      
      // Notify recipients
      await this.notifyMessageRecipients(message);
      
      return new ClientMessageModel(message);
    } catch (error) {
      console.error('Error sending client message:', error);
      throw new Error('Failed to send client message');
    }
  }
  
  /**
   * Client Delivery Tracking
   */
  async getClientDeliveries(filters = {}) {
    try {
      const { clientId, projectId, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (clientId) whereClause.clientId = clientId;
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.scheduledDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const deliveries = await prisma.clientDelivery.findMany({
        where: whereClause,
        orderBy: { scheduledDate: 'asc' },
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return deliveries.map(delivery => new ClientDeliveryModel({
        ...delivery,
        projectName: delivery.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching client deliveries:', error);
      throw new Error('Failed to fetch client deliveries');
    }
  }
  
  /**
   * Client Approval Requests
   */
  async getClientApprovalRequests(filters = {}) {
    try {
      const { clientId, projectId, type, status, search } = filters;
      
      const whereClause = {};
      if (clientId) whereClause.clientId = clientId;
      if (projectId) whereClause.projectId = projectId;
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      
      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const approvalRequests = await prisma.clientApprovalRequest.findMany({
        where: whereClause,
        orderBy: [
          { status: 'asc' },
          { dueDate: 'asc' }
        ],
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return approvalRequests.map(request => new ClientApprovalRequestModel({
        ...request,
        projectName: request.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching client approval requests:', error);
      throw new Error('Failed to fetch client approval requests');
    }
  }
  
  async updateApprovalRequestStatus(requestId, clientId, status, userId, comments) {
    try {
      // Validate approval request exists and belongs to client
      const approvalRequest = await prisma.clientApprovalRequest.findFirst({
        where: {
          id: requestId,
          clientId
        }
      });
      
      if (!approvalRequest) {
        throw new Error('Approval request not found or does not belong to this client');
      }
      
      if (approvalRequest.status !== 'PENDING') {
        throw new Error('Approval request is no longer pending');
      }
      
      // Update approval request
      const updatedRequest = await prisma.clientApprovalRequest.update({
        where: { id: requestId },
        data: {
          status,
          approvedBy: status === 'APPROVED' ? userId : null,
          approvedAt: status === 'APPROVED' ? new Date() : null,
          rejectedBy: status === 'REJECTED' ? userId : null,
          rejectedAt: status === 'REJECTED' ? new Date() : null,
          rejectionReason: status === 'REJECTED' ? comments : '',
          comments: [...(approvalRequest.comments || []), {
            userId,
            timestamp: new Date(),
            content: comments || '',
            action: status
          }],
          updatedAt: new Date()
        }
      });
      
      // Create notification for company users
      await this.createApprovalNotification(updatedRequest, status);
      
      return new ClientApprovalRequestModel(updatedRequest);
    } catch (error) {
      console.error('Error updating approval request status:', error);
      throw new Error('Failed to update approval request status');
    }
  }
  
  /**
   * Client Invoices
   */
  async getClientInvoices(filters = {}) {
    try {
      const { clientId, projectId, status, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (clientId) whereClause.clientId = clientId;
      if (projectId) whereClause.projectId = projectId;
      if (status) whereClause.status = status;
      
      if (dateFrom && dateTo) {
        whereClause.issueDate = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const invoices = await prisma.clientInvoice.findMany({
        where: whereClause,
        orderBy: { issueDate: 'desc' },
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      return invoices.map(invoice => new ClientInvoiceModel({
        ...invoice,
        projectName: invoice.project?.name || ''
      }));
    } catch (error) {
      console.error('Error fetching client invoices:', error);
      throw new Error('Failed to fetch client invoices');
    }
  }
  
  /**
   * Client Notifications
   */
  async getClientNotifications(userId, clientId, limit = 20) {
    try {
      const notifications = await prisma.clientNotification.findMany({
        where: {
          clientId,
          userId,
          status: { not: 'ARCHIVED' }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      
      return notifications.map(notification => new ClientNotificationModel(notification));
    } catch (error) {
      console.error('Error fetching client notifications:', error);
      throw new Error('Failed to fetch client notifications');
    }
  }
  
  async markNotificationAsRead(notificationId, userId) {
    try {
      const notification = await prisma.clientNotification.findUnique({
        where: { id: notificationId }
      });
      
      if (!notification) {
        throw new Error('Notification not found');
      }
      
      if (notification.userId !== userId) {
        throw new Error('Notification does not belong to this user');
      }
      
      const updatedNotification = await prisma.clientNotification.update({
        where: { id: notificationId },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      });
      
      return new ClientNotificationModel(updatedNotification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }
  
  /**
   * Client Dashboard
   */
  async getClientDashboardData(clientId, userId) {
    try {
      // Get client information
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          name: true,
          status: true
        }
      });
      
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Get active projects
      const projects = await prisma.clientProject.findMany({
        where: {
          clientId,
          status: { not: 'COMPLETED' }
        },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          progress: true,
          startDate: true,
          endDate: true
        }
      });
      
      // Get upcoming deliveries
      const deliveries = await prisma.clientDelivery.findMany({
        where: {
          clientId,
          status: 'SCHEDULED',
          scheduledDate: {
            gte: new Date()
          }
        },
        orderBy: { scheduledDate: 'asc' },
        take: 5,
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Get pending approval requests
      const approvalRequests = await prisma.clientApprovalRequest.findMany({
        where: {
          clientId,
          status: 'PENDING'
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Get recent documents
      const documents = await prisma.clientDocument.findMany({
        where: {
          clientId,
          status: 'ACTIVE'
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          project: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Get unread messages
      const unreadMessages = await prisma.clientMessage.count({
        where: {
          clientId,
          recipientIds: { has: userId },
          status: 'UNREAD'
        }
      });
      
      // Get invoice summary
      const invoiceSummary = await prisma.$queryRaw`
        SELECT 
          SUM(CASE WHEN status = 'PENDING' THEN total ELSE 0 END) as pendingAmount,
          SUM(CASE WHEN status = 'OVERDUE' THEN total ELSE 0 END) as overdueAmount,
          SUM(CASE WHEN status = 'PAID' THEN total ELSE 0 END) as paidAmount
        FROM "ClientInvoice"
        WHERE "clientId" = ${clientId}
      `;
      
      // Get user's dashboard widgets
      const widgets = await prisma.clientDashboardWidget.findMany({
        where: {
          clientId,
          userId,
          isEnabled: true
        },
        orderBy: { position: 'asc' }
      });
      
      return {
        client,
        projects,
        deliveries: deliveries.map(delivery => new ClientDeliveryModel({
          ...delivery,
          projectName: delivery.project?.name || ''
        })),
        approvalRequests: approvalRequests.map(request => new ClientApprovalRequestModel({
          ...request,
          projectName: request.project?.name || ''
        })),
        documents: documents.map(doc => new ClientDocumentModel({
          ...doc,
          projectName: doc.project?.name || ''
        })),
        unreadMessages,
        invoiceSummary: invoiceSummary[0],
        widgets: widgets.map(widget => new ClientDashboardWidgetModel(widget))
      };
    } catch (error) {
      console.error('Error fetching client dashboard data:', error);
      throw new Error('Failed to fetch client dashboard data');
    }
  }
  
  /**
   * Helper Methods
   */
  async createAuthUser(userData) {
    // This would typically use an auth service like Auth0, Firebase Auth, etc.
    // For now, we'll just return a mock user
    return {
      id: 'auth_' + Math.random().toString(36).substring(2, 15),
      email: userData.email
    };
  }
  
  async sendWelcomeEmail(user) {
    // This would typically use an email service
    console.log(`Sending welcome email to ${user.email}`);
    return true;
  }
  
  async uploadFile(file) {
    // This would typically use a file storage service like S3
    // For now, we'll just return a placeholder URL
    return `/uploads/client-documents/${file.originalname}`;
  }
  
  async createDocumentNotification(document, action) {
    // Create notification for company users
    // This would typically notify relevant company staff
    console.log(`Document ${action} notification for document ${document.id}`);
    return true;
  }
  
  async notifyMessageRecipients(message) {
    // Notify message recipients
    // This would typically send email/push notifications
    console.log(`Notifying recipients for message ${message.id}`);
    return true;
  }
  
  async createApprovalNotification(approvalRequest, status) {
    // Create notification for company users about approval status
    console.log(`Approval ${status} notification for request ${approvalRequest.id}`);
    return true;
  }
}

export default new ClientPortalService();
