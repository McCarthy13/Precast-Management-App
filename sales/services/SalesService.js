/**
 * Sales Services
 * Provides business logic and data access for the Sales module
 */

import prisma from '../../../lib/prisma';
import { 
  LeadModel,
  OpportunityModel,
  QuoteModel,
  QuoteItemModel,
  ContractModel,
  ProductModel,
  SalesActivityModel,
  SalesDashboardModel
} from '../models/SalesModel';

export class SalesService {
  /**
   * Lead Management
   */
  async getLeads(filters = {}) {
    try {
      const { status, priority, source, type, search, assignedTo } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (source) whereClause.source = source;
      if (type) whereClause.type = type;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      
      if (search) {
        whereClause.OR = [
          { leadNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const leads = await prisma.lead.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          company: {
            select: {
              name: true
            }
          },
          contact: {
            select: {
              displayName: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: {
              activities: true,
              documents: true
            }
          }
        }
      });
      
      return leads.map(lead => new LeadModel({
        ...lead,
        companyName: lead.company?.name || lead.companyName,
        contactName: lead.contact?.displayName || lead.contactName,
        contactEmail: lead.contact?.email || lead.contactEmail,
        contactPhone: lead.contact?.phone || lead.contactPhone,
        activityCount: lead._count.activities,
        documentCount: lead._count.documents
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw new Error('Failed to fetch leads');
    }
  }
  
  async getLeadById(id) {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              website: true,
              industry: true
            }
          },
          contact: {
            select: {
              id: true,
              displayName: true,
              email: true,
              phone: true,
              jobTitle: true
            }
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          documents: {
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          proposals: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          opportunities: {
            select: {
              id: true,
              opportunityNumber: true,
              name: true,
              status: true,
              value: true,
              probability: true,
              expectedCloseDate: true
            }
          }
        }
      });
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      return new LeadModel({
        ...lead,
        companyName: lead.company?.name || lead.companyName,
        contactName: lead.contact?.displayName || lead.contactName,
        contactEmail: lead.contact?.email || lead.contactEmail,
        contactPhone: lead.contact?.phone || lead.contactPhone,
        activities: lead.activities.map(activity => new SalesActivityModel(activity)),
        opportunities: lead.opportunities
      });
    } catch (error) {
      console.error(`Error fetching lead with ID ${id}:`, error);
      throw new Error('Failed to fetch lead');
    }
  }
  
  async createLead(leadData) {
    try {
      // Validate company if provided
      if (leadData.companyId) {
        const company = await prisma.company.findUnique({
          where: { id: leadData.companyId }
        });
        
        if (!company) {
          throw new Error('Company not found');
        }
        
        leadData.companyName = company.name;
      }
      
      // Validate contact if provided
      if (leadData.contactId) {
        const contact = await prisma.contact.findUnique({
          where: { id: leadData.contactId }
        });
        
        if (!contact) {
          throw new Error('Contact not found');
        }
        
        leadData.contactName = contact.displayName;
        leadData.contactEmail = contact.email;
        leadData.contactPhone = contact.phone;
      }
      
      // Generate lead number if not provided
      if (!leadData.leadNumber) {
        const currentYear = new Date().getFullYear().toString().substr(-2);
        const leadCount = await prisma.lead.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          }
        });
        
        leadData.leadNumber = `L${currentYear}-${(leadCount + 1).toString().padStart(4, '0')}`;
      }
      
      // Create lead
      const lead = await prisma.lead.create({
        data: {
          leadNumber: leadData.leadNumber,
          name: leadData.name,
          description: leadData.description,
          source: leadData.source,
          status: leadData.status || 'NEW',
          priority: leadData.priority || 'MEDIUM',
          type: leadData.type,
          category: leadData.category,
          value: leadData.value || 0,
          probability: leadData.probability || 0,
          expectedCloseDate: leadData.expectedCloseDate ? new Date(leadData.expectedCloseDate) : null,
          companyId: leadData.companyId,
          companyName: leadData.companyName,
          contactId: leadData.contactId,
          contactName: leadData.contactName,
          contactEmail: leadData.contactEmail,
          contactPhone: leadData.contactPhone,
          location: leadData.location,
          projectDetails: leadData.projectDetails,
          requirements: leadData.requirements || [],
          notes: leadData.notes,
          tags: leadData.tags || [],
          customFields: leadData.customFields || {},
          assignedTo: leadData.assignedTo,
          nextSteps: leadData.nextSteps,
          nextContactDate: leadData.nextContactDate ? new Date(leadData.nextContactDate) : null,
          createdBy: leadData.createdBy
        }
      });
      
      return new LeadModel(lead);
    } catch (error) {
      console.error('Error creating lead:', error);
      throw new Error('Failed to create lead');
    }
  }
  
  async updateLead(id, leadData) {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id }
      });
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      // Validate company if provided and changed
      if (leadData.companyId && leadData.companyId !== lead.companyId) {
        const company = await prisma.company.findUnique({
          where: { id: leadData.companyId }
        });
        
        if (!company) {
          throw new Error('Company not found');
        }
        
        leadData.companyName = company.name;
      }
      
      // Validate contact if provided and changed
      if (leadData.contactId && leadData.contactId !== lead.contactId) {
        const contact = await prisma.contact.findUnique({
          where: { id: leadData.contactId }
        });
        
        if (!contact) {
          throw new Error('Contact not found');
        }
        
        leadData.contactName = contact.displayName;
        leadData.contactEmail = contact.email;
        leadData.contactPhone = contact.phone;
      }
      
      // Update lead
      const updatedLead = await prisma.lead.update({
        where: { id },
        data: {
          name: leadData.name,
          description: leadData.description,
          source: leadData.source,
          status: leadData.status,
          priority: leadData.priority,
          type: leadData.type,
          category: leadData.category,
          value: leadData.value,
          probability: leadData.probability,
          expectedCloseDate: leadData.expectedCloseDate ? new Date(leadData.expectedCloseDate) : lead.expectedCloseDate,
          actualCloseDate: leadData.actualCloseDate ? new Date(leadData.actualCloseDate) : lead.actualCloseDate,
          companyId: leadData.companyId,
          companyName: leadData.companyName,
          contactId: leadData.contactId,
          contactName: leadData.contactName,
          contactEmail: leadData.contactEmail,
          contactPhone: leadData.contactPhone,
          location: leadData.location,
          projectDetails: leadData.projectDetails,
          requirements: leadData.requirements,
          notes: leadData.notes,
          tags: leadData.tags,
          customFields: leadData.customFields,
          assignedTo: leadData.assignedTo,
          nextSteps: leadData.nextSteps,
          nextContactDate: leadData.nextContactDate ? new Date(leadData.nextContactDate) : lead.nextContactDate,
          lostReason: leadData.lostReason,
          winReason: leadData.winReason,
          updatedAt: new Date()
        }
      });
      
      return new LeadModel(updatedLead);
    } catch (error) {
      console.error(`Error updating lead with ID ${id}:`, error);
      throw new Error('Failed to update lead');
    }
  }
  
  async convertLeadToOpportunity(id, opportunityData) {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
          company: true,
          contact: true
        }
      });
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      // Generate opportunity number if not provided
      if (!opportunityData.opportunityNumber) {
        const currentYear = new Date().getFullYear().toString().substr(-2);
        const opportunityCount = await prisma.opportunity.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          }
        });
        
        opportunityData.opportunityNumber = `O${currentYear}-${(opportunityCount + 1).toString().padStart(4, '0')}`;
      }
      
      // Create opportunity from lead data
      const opportunity = await prisma.opportunity.create({
        data: {
          opportunityNumber: opportunityData.opportunityNumber,
          name: opportunityData.name || lead.name,
          description: opportunityData.description || lead.description,
          source: lead.source,
          status: opportunityData.status || 'OPEN',
          stage: opportunityData.stage || 'QUALIFICATION',
          priority: opportunityData.priority || lead.priority,
          type: opportunityData.type || lead.type,
          category: opportunityData.category || lead.category,
          value: opportunityData.value || lead.value,
          probability: opportunityData.probability || lead.probability,
          expectedCloseDate: opportunityData.expectedCloseDate ? new Date(opportunityData.expectedCloseDate) : lead.expectedCloseDate,
          leadId: lead.id,
          companyId: lead.companyId,
          companyName: lead.companyName,
          contactId: lead.contactId,
          contactName: lead.contactName,
          contactEmail: lead.contactEmail,
          contactPhone: lead.contactPhone,
          location: opportunityData.location || lead.location,
          projectDetails: opportunityData.projectDetails || lead.projectDetails,
          requirements: opportunityData.requirements || lead.requirements,
          notes: opportunityData.notes || lead.notes,
          tags: opportunityData.tags || lead.tags,
          customFields: opportunityData.customFields || lead.customFields,
          assignedTo: opportunityData.assignedTo || lead.assignedTo,
          nextSteps: opportunityData.nextSteps || lead.nextSteps,
          nextContactDate: opportunityData.nextContactDate ? new Date(opportunityData.nextContactDate) : lead.nextContactDate,
          products: opportunityData.products || [],
          decisionMakers: opportunityData.decisionMakers || [],
          stakeholders: opportunityData.stakeholders || [],
          salesTeam: opportunityData.salesTeam || [],
          timeline: opportunityData.timeline || [],
          risks: opportunityData.risks || [],
          successFactors: opportunityData.successFactors || [],
          createdBy: opportunityData.createdBy
        }
      });
      
      // Update lead status
      await prisma.lead.update({
        where: { id },
        data: {
          status: 'QUALIFIED',
          updatedAt: new Date()
        }
      });
      
      // Copy lead activities to opportunity
      const leadActivities = await prisma.salesActivity.findMany({
        where: { leadId: id }
      });
      
      for (const activity of leadActivities) {
        await prisma.salesActivity.create({
          data: {
            type: activity.type,
            subject: activity.subject,
            description: activity.description,
            status: activity.status,
            priority: activity.priority,
            opportunityId: opportunity.id,
            leadId: activity.leadId,
            companyId: activity.companyId,
            contactId: activity.contactId,
            startDate: activity.startDate,
            endDate: activity.endDate,
            duration: activity.duration,
            location: activity.location,
            outcome: activity.outcome,
            followUpType: activity.followUpType,
            followUpDate: activity.followUpDate,
            assignedTo: activity.assignedTo,
            participants: activity.participants,
            notes: activity.notes,
            customFields: activity.customFields,
            tags: activity.tags,
            createdBy: activity.createdBy,
            createdAt: new Date(),
            completedBy: activity.completedBy,
            completedAt: activity.completedAt,
            cancelledBy: activity.cancelledBy,
            cancelledAt: activity.cancelledAt,
            cancellationReason: activity.cancellationReason
          }
        });
      }
      
      // Copy lead documents to opportunity
      const leadDocuments = await prisma.document.findMany({
        where: { leadId: id }
      });
      
      for (const document of leadDocuments) {
        await prisma.document.create({
          data: {
            name: document.name,
            description: document.description,
            type: document.type,
            category: document.category,
            opportunityId: opportunity.id,
            leadId: document.leadId,
            url: document.url,
            filePath: document.filePath,
            fileSize: document.fileSize,
            fileType: document.fileType,
            tags: document.tags,
            notes: document.notes,
            customFields: document.customFields,
            createdBy: document.createdBy,
            createdAt: new Date()
          }
        });
      }
      
      return new OpportunityModel(opportunity);
    } catch (error) {
      console.error(`Error converting lead with ID ${id} to opportunity:`, error);
      throw new Error('Failed to convert lead to opportunity');
    }
  }
  
  /**
   * Opportunity Management
   */
  async getOpportunities(filters = {}) {
    try {
      const { status, stage, priority, type, search, assignedTo } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (stage) whereClause.stage = stage;
      if (priority) whereClause.priority = priority;
      if (type) whereClause.type = type;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      
      if (search) {
        whereClause.OR = [
          { opportunityNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const opportunities = await prisma.opportunity.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          company: {
            select: {
              name: true
            }
          },
          contact: {
            select: {
              displayName: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: {
              activities: true,
              documents: true,
              quotes: true
            }
          }
        }
      });
      
      return opportunities.map(opportunity => new OpportunityModel({
        ...opportunity,
        companyName: opportunity.company?.name || opportunity.companyName,
        contactName: opportunity.contact?.displayName || opportunity.contactName,
        contactEmail: opportunity.contact?.email || opportunity.contactEmail,
        contactPhone: opportunity.contact?.phone || opportunity.contactPhone,
        activityCount: opportunity._count.activities,
        documentCount: opportunity._count.documents,
        quoteCount: opportunity._count.quotes
      }));
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw new Error('Failed to fetch opportunities');
    }
  }
  
  async getOpportunityById(id) {
    try {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id },
        include: {
          lead: {
            select: {
              id: true,
              leadNumber: true,
              name: true
            }
          },
          company: {
            select: {
              id: true,
              name: true,
              website: true,
              industry: true
            }
          },
          contact: {
            select: {
              id: true,
              displayName: true,
              email: true,
              phone: true,
              jobTitle: true
            }
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          documents: {
            orderBy: { createdAt: 'desc' },
            take: 20
          },
          quotes: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          contracts: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });
      
      if (!opportunity) {
        throw new Error('Opportunity not found');
      }
      
      return new OpportunityModel({
        ...opportunity,
        companyName: opportunity.company?.name || opportunity.companyName,
        contactName: opportunity.contact?.displayName || opportunity.contactName,
        contactEmail: opportunity.contact?.email || opportunity.contactEmail,
        contactPhone: opportunity.contact?.phone || opportunity.contactPhone,
        activities: opportunity.activities.map(activity => new SalesActivityModel(activity)),
        quotes: opportunity.quotes.map(quote => new QuoteModel(quote)),
        contracts: opportunity.contracts.map(contract => new ContractModel(contract))
      });
    } catch (error) {
      console.error(`Error fetching opportunity with ID ${id}:`, error);
      throw new Error('Failed to fetch opportunity');
    }
  }
  
  /**
   * Quote Management
   */
  async getQuotes(filters = {}) {
    try {
      const { status, opportunityId, companyId, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (opportunityId) whereClause.opportunityId = opportunityId;
      if (companyId) whereClause.companyId = companyId;
      
      if (search) {
        whereClause.OR = [
          { quoteNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const quotes = await prisma.quote.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          opportunity: {
            select: {
              id: true,
              opportunityNumber: true,
              name: true
            }
          },
          company: {
            select: {
              name: true
            }
          },
          contact: {
            select: {
              displayName: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: {
              items: true,
              documents: true
            }
          }
        }
      });
      
      return quotes.map(quote => new QuoteModel({
        ...quote,
        companyName: quote.company?.name || quote.companyName,
        contactName: quote.contact?.displayName || quote.contactName,
        contactEmail: quote.contact?.email || quote.contactEmail,
        contactPhone: quote.contact?.phone || quote.contactPhone,
        itemCount: quote._count.items,
        documentCount: quote._count.documents
      }));
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw new Error('Failed to fetch quotes');
    }
  }
  
  async getQuoteById(id) {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id },
        include: {
          opportunity: {
            select: {
              id: true,
              opportunityNumber: true,
              name: true,
              status: true
            }
          },
          company: {
            select: {
              id: true,
              name: true,
              website: true,
              industry: true
            }
          },
          contact: {
            select: {
              id: true,
              displayName: true,
              email: true,
              phone: true,
              jobTitle: true
            }
          },
          items: {
            orderBy: { sortOrder: 'asc' }
          },
          documents: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      
      if (!quote) {
        throw new Error('Quote not found');
      }
      
      return new QuoteModel({
        ...quote,
        companyName: quote.company?.name || quote.companyName,
        contactName: quote.contact?.displayName || quote.contactName,
        contactEmail: quote.contact?.email || quote.contactEmail,
        contactPhone: quote.contact?.phone || quote.contactPhone,
        items: quote.items.map(item => new QuoteItemModel(item))
      });
    } catch (error) {
      console.error(`Error fetching quote with ID ${id}:`, error);
      throw new Error('Failed to fetch quote');
    }
  }
  
  /**
   * Contract Management
   */
  async getContracts(filters = {}) {
    try {
      const { status, type, opportunityId, companyId, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (opportunityId) whereClause.opportunityId = opportunityId;
      if (companyId) whereClause.companyId = companyId;
      
      if (search) {
        whereClause.OR = [
          { contractNumber: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const contracts = await prisma.contract.findMany({
        where: whereClause,
        orderBy: [
          { createdAt: 'desc' }
        ],
        include: {
          opportunity: {
            select: {
              id: true,
              opportunityNumber: true,
              name: true
            }
          },
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              name: true
            }
          },
          company: {
            select: {
              name: true
            }
          },
          contact: {
            select: {
              displayName: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: {
              documents: true,
              amendments: true
            }
          }
        }
      });
      
      return contracts.map(contract => new ContractModel({
        ...contract,
        companyName: contract.company?.name || contract.companyName,
        contactName: contract.contact?.displayName || contract.contactName,
        contactEmail: contract.contact?.email || contract.contactEmail,
        contactPhone: contract.contact?.phone || contract.contactPhone,
        documentCount: contract._count.documents,
        amendmentCount: contract._count.amendments
      }));
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw new Error('Failed to fetch contracts');
    }
  }
  
  /**
   * Product Management
   */
  async getProducts(filters = {}) {
    try {
      const { status, type, category, search } = filters;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      
      if (search) {
        whereClause.OR = [
          { productCode: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const products = await prisma.product.findMany({
        where: whereClause,
        orderBy: [
          { name: 'asc' }
        ]
      });
      
      return products.map(product => new ProductModel(product));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }
  
  /**
   * Sales Activity Management
   */
  async getSalesActivities(filters = {}) {
    try {
      const { type, status, priority, leadId, opportunityId, companyId, contactId, assignedTo, search } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (leadId) whereClause.leadId = leadId;
      if (opportunityId) whereClause.opportunityId = opportunityId;
      if (companyId) whereClause.companyId = companyId;
      if (contactId) whereClause.contactId = contactId;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      
      if (search) {
        whereClause.OR = [
          { subject: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const activities = await prisma.salesActivity.findMany({
        where: whereClause,
        orderBy: [
          { startDate: 'desc' }
        ],
        include: {
          lead: {
            select: {
              leadNumber: true,
              name: true
            }
          },
          opportunity: {
            select: {
              opportunityNumber: true,
              name: true
            }
          },
          company: {
            select: {
              name: true
            }
          },
          contact: {
            select: {
              displayName: true,
              email: true,
              phone: true
            }
          }
        }
      });
      
      return activities.map(activity => new SalesActivityModel(activity));
    } catch (error) {
      console.error('Error fetching sales activities:', error);
      throw new Error('Failed to fetch sales activities');
    }
  }
  
  /**
   * Sales Dashboard
   */
  async getSalesDashboardData() {
    try {
      // Lead stats
      const leadStats = await prisma.lead.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const leadStatsData = {
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        proposal: 0,
        negotiation: 0,
        won: 0,
        lost: 0,
        inactive: 0
      };
      
      leadStats.forEach(stat => {
        leadStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'NEW':
            leadStatsData.new = stat._count.id;
            break;
          case 'CONTACTED':
            leadStatsData.contacted = stat._count.id;
            break;
          case 'QUALIFIED':
            leadStatsData.qualified = stat._count.id;
            break;
          case 'PROPOSAL':
            leadStatsData.proposal = stat._count.id;
            break;
          case 'NEGOTIATION':
            leadStatsData.negotiation = stat._count.id;
            break;
          case 'WON':
            leadStatsData.won = stat._count.id;
            break;
          case 'LOST':
            leadStatsData.lost = stat._count.id;
            break;
          case 'INACTIVE':
            leadStatsData.inactive = stat._count.id;
            break;
        }
      });
      
      // Opportunity stats
      const opportunityStats = await prisma.opportunity.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const opportunityStatsData = {
        total: 0,
        open: 0,
        qualified: 0,
        proposal: 0,
        negotiation: 0,
        won: 0,
        lost: 0,
        inactive: 0
      };
      
      opportunityStats.forEach(stat => {
        opportunityStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'OPEN':
            opportunityStatsData.open = stat._count.id;
            break;
          case 'QUALIFIED':
            opportunityStatsData.qualified = stat._count.id;
            break;
          case 'PROPOSAL':
            opportunityStatsData.proposal = stat._count.id;
            break;
          case 'NEGOTIATION':
            opportunityStatsData.negotiation = stat._count.id;
            break;
          case 'WON':
            opportunityStatsData.won = stat._count.id;
            break;
          case 'LOST':
            opportunityStatsData.lost = stat._count.id;
            break;
          case 'INACTIVE':
            opportunityStatsData.inactive = stat._count.id;
            break;
        }
      });
      
      // Quote stats
      const quoteStats = await prisma.quote.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const quoteStatsData = {
        total: 0,
        draft: 0,
        sent: 0,
        viewed: 0,
        accepted: 0,
        rejected: 0,
        expired: 0,
        revised: 0
      };
      
      quoteStats.forEach(stat => {
        quoteStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'DRAFT':
            quoteStatsData.draft = stat._count.id;
            break;
          case 'SENT':
            quoteStatsData.sent = stat._count.id;
            break;
          case 'VIEWED':
            quoteStatsData.viewed = stat._count.id;
            break;
          case 'ACCEPTED':
            quoteStatsData.accepted = stat._count.id;
            break;
          case 'REJECTED':
            quoteStatsData.rejected = stat._count.id;
            break;
          case 'EXPIRED':
            quoteStatsData.expired = stat._count.id;
            break;
          case 'REVISED':
            quoteStatsData.revised = stat._count.id;
            break;
        }
      });
      
      // Contract stats
      const contractStats = await prisma.contract.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const contractStatsData = {
        total: 0,
        draft: 0,
        sent: 0,
        negotiation: 0,
        signed: 0,
        active: 0,
        completed: 0,
        terminated: 0,
        expired: 0
      };
      
      contractStats.forEach(stat => {
        contractStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'DRAFT':
            contractStatsData.draft = stat._count.id;
            break;
          case 'SENT':
            contractStatsData.sent = stat._count.id;
            break;
          case 'NEGOTIATION':
            contractStatsData.negotiation = stat._count.id;
            break;
          case 'SIGNED':
            contractStatsData.signed = stat._count.id;
            break;
          case 'ACTIVE':
            contractStatsData.active = stat._count.id;
            break;
          case 'COMPLETED':
            contractStatsData.completed = stat._count.id;
            break;
          case 'TERMINATED':
            contractStatsData.terminated = stat._count.id;
            break;
          case 'EXPIRED':
            contractStatsData.expired = stat._count.id;
            break;
        }
      });
      
      // Sales performance
      const today = new Date();
      const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      
      // Current period revenue (current month)
      const currentPeriodContracts = await prisma.contract.findMany({
        where: {
          status: {
            in: ['SIGNED', 'ACTIVE', 'COMPLETED']
          },
          signedDate: {
            gte: startOfCurrentMonth,
            lte: today
          }
        },
        select: {
          value: true
        }
      });
      
      const currentPeriodRevenue = currentPeriodContracts.reduce((sum, contract) => sum + (contract.value || 0), 0);
      
      // Previous period revenue (previous month)
      const previousPeriodContracts = await prisma.contract.findMany({
        where: {
          status: {
            in: ['SIGNED', 'ACTIVE', 'COMPLETED']
          },
          signedDate: {
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth
          }
        },
        select: {
          value: true
        }
      });
      
      const previousPeriodRevenue = previousPeriodContracts.reduce((sum, contract) => sum + (contract.value || 0), 0);
      
      // Revenue growth
      const revenueGrowth = previousPeriodRevenue > 0 ? 
        ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0;
      
      // Current period deals (current month)
      const currentPeriodDeals = currentPeriodContracts.length;
      
      // Previous period deals (previous month)
      const previousPeriodDeals = previousPeriodContracts.length;
      
      // Deal growth
      const dealGrowth = previousPeriodDeals > 0 ? 
        ((currentPeriodDeals - previousPeriodDeals) / previousPeriodDeals) * 100 : 0;
      
      // Average deal size
      const averageDealSize = currentPeriodDeals > 0 ? currentPeriodRevenue / currentPeriodDeals : 0;
      
      // Conversion rate (opportunities to contracts)
      const closedOpportunities = await prisma.opportunity.count({
        where: {
          status: {
            in: ['WON', 'LOST']
          },
          updatedAt: {
            gte: startOfCurrentMonth,
            lte: today
          }
        }
      });
      
      const wonOpportunities = await prisma.opportunity.count({
        where: {
          status: 'WON',
          updatedAt: {
            gte: startOfCurrentMonth,
            lte: today
          }
        }
      });
      
      const conversionRate = closedOpportunities > 0 ? (wonOpportunities / closedOpportunities) * 100 : 0;
      
      // Win rate
      const winRate = conversionRate;
      
      // Sales cycle (average days from opportunity creation to won)
      const wonOpportunitiesWithDates = await prisma.opportunity.findMany({
        where: {
          status: 'WON',
          actualCloseDate: {
            not: null
          }
        },
        select: {
          createdAt: true,
          actualCloseDate: true
        }
      });
      
      let totalDays = 0;
      wonOpportunitiesWithDates.forEach(opp => {
        const createdDate = new Date(opp.createdAt);
        const closedDate = new Date(opp.actualCloseDate);
        const days = Math.ceil((closedDate - createdDate) / (1000 * 60 * 60 * 24));
        totalDays += days;
      });
      
      const salesCycle = wonOpportunitiesWithDates.length > 0 ? totalDays / wonOpportunitiesWithDates.length : 0;
      
      // Sales performance data
      const salesPerformance = {
        currentPeriodRevenue,
        previousPeriodRevenue,
        revenueGrowth,
        currentPeriodDeals,
        previousPeriodDeals,
        dealGrowth,
        averageDealSize,
        conversionRate,
        winRate,
        salesCycle
      };
      
      // Sales forecast
      const openOpportunities = await prisma.opportunity.findMany({
        where: {
          status: {
            in: ['OPEN', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION']
          }
        },
        select: {
          value: true,
          probability: true,
          expectedCloseDate: true
        }
      });
      
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const endOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      
      let currentPeriodForecast = 0;
      let nextPeriodForecast = 0;
      let quarterForecast = 0;
      let yearForecast = 0;
      let pipelineValue = 0;
      let weightedPipelineValue = 0;
      
      openOpportunities.forEach(opp => {
        const value = opp.value || 0;
        const probability = opp.probability || 0;
        const weightedValue = value * (probability / 100);
        const closeDate = opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null;
        
        pipelineValue += value;
        weightedPipelineValue += weightedValue;
        
        if (closeDate) {
          if (closeDate <= today) {
            currentPeriodForecast += weightedValue;
          } else if (closeDate <= nextMonth) {
            nextPeriodForecast += weightedValue;
          }
          
          if (closeDate <= endOfQuarter) {
            quarterForecast += weightedValue;
          }
          
          if (closeDate <= endOfYear) {
            yearForecast += weightedValue;
          }
        }
      });
      
      // Sales forecast data
      const salesForecast = {
        currentPeriod: currentPeriodForecast,
        nextPeriod: nextPeriodForecast,
        quarterForecast,
        yearForecast,
        pipelineValue,
        weightedPipelineValue
      };
      
      // Sales by product
      const salesByProduct = await prisma.$queryRaw`
        SELECT p.name, COUNT(qi.id) as count, SUM(qi.total) as total
        FROM QuoteItem qi
        JOIN Product p ON qi.productId = p.id
        JOIN Quote q ON qi.quoteId = q.id
        WHERE q.status = 'ACCEPTED'
        GROUP BY p.name
        ORDER BY total DESC
        LIMIT 10
      `;
      
      // Sales by category
      const salesByCategory = await prisma.$queryRaw`
        SELECT p.category, COUNT(qi.id) as count, SUM(qi.total) as total
        FROM QuoteItem qi
        JOIN Product p ON qi.productId = p.id
        JOIN Quote q ON qi.quoteId = q.id
        WHERE q.status = 'ACCEPTED' AND p.category IS NOT NULL
        GROUP BY p.category
        ORDER BY total DESC
        LIMIT 10
      `;
      
      // Sales by region
      const salesByRegion = await prisma.$queryRaw`
        SELECT c.location->>'state' as region, COUNT(q.id) as count, SUM(q.total) as total
        FROM Quote q
        JOIN Company c ON q.companyId = c.id
        WHERE q.status = 'ACCEPTED' AND c.location->>'state' IS NOT NULL
        GROUP BY c.location->>'state'
        ORDER BY total DESC
        LIMIT 10
      `;
      
      // Sales by representative
      const salesByRepresentative = await prisma.$queryRaw`
        SELECT o.assignedTo, COUNT(q.id) as count, SUM(q.total) as total
        FROM Quote q
        JOIN Opportunity o ON q.opportunityId = o.id
        WHERE q.status = 'ACCEPTED' AND o.assignedTo IS NOT NULL
        GROUP BY o.assignedTo
        ORDER BY total DESC
        LIMIT 10
      `;
      
      // Top deals
      const topDeals = await prisma.opportunity.findMany({
        where: {
          status: {
            in: ['OPEN', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION']
          }
        },
        orderBy: {
          value: 'desc'
        },
        take: 10,
        select: {
          id: true,
          opportunityNumber: true,
          name: true,
          status: true,
          value: true,
          probability: true,
          expectedCloseDate: true,
          companyName: true,
          assignedTo: true
        }
      });
      
      // Recent activities
      const recentActivities = await prisma.salesActivity.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 10,
        select: {
          id: true,
          type: true,
          subject: true,
          status: true,
          startDate: true,
          assignedTo: true,
          lead: {
            select: {
              leadNumber: true,
              name: true
            }
          },
          opportunity: {
            select: {
              opportunityNumber: true,
              name: true
            }
          },
          company: {
            select: {
              name: true
            }
          },
          contact: {
            select: {
              displayName: true
            }
          }
        }
      });
      
      // Upcoming activities
      const upcomingActivities = await prisma.salesActivity.findMany({
        where: {
          status: 'PENDING',
          startDate: {
            gte: today
          }
        },
        orderBy: {
          startDate: 'asc'
        },
        take: 10,
        select: {
          id: true,
          type: true,
          subject: true,
          status: true,
          startDate: true,
          assignedTo: true,
          lead: {
            select: {
              leadNumber: true,
              name: true
            }
          },
          opportunity: {
            select: {
              opportunityNumber: true,
              name: true
            }
          },
          company: {
            select: {
              name: true
            }
          },
          contact: {
            select: {
              displayName: true
            }
          }
        }
      });
      
      // Lead sources
      const leadSources = await prisma.lead.groupBy({
        by: ['source'],
        _count: {
          id: true
        },
        where: {
          source: {
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
      
      const leadSourcesArray = leadSources.map(item => ({
        source: item.source,
        count: item._count.id
      }));
      
      // Sales trends (simplified)
      const salesTrends = {
        revenue: [],
        deals: [],
        pipeline: []
      };
      
      // Return dashboard data
      return new SalesDashboardModel({
        leadStats: leadStatsData,
        opportunityStats: opportunityStatsData,
        quoteStats: quoteStatsData,
        contractStats: contractStatsData,
        salesPerformance,
        salesForecast,
        salesByProduct,
        salesByCategory,
        salesByRegion,
        salesByRepresentative,
        topDeals,
        recentActivities,
        upcomingActivities,
        leadSources: leadSourcesArray,
        salesTrends
      });
    } catch (error) {
      console.error('Error fetching sales dashboard data:', error);
      throw new Error('Failed to fetch sales dashboard data');
    }
  }
  
  /**
   * Cross-Module Integration
   */
  async createJobFromOpportunity(opportunityId, jobData) {
    try {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId },
        include: {
          company: true,
          contact: true,
          quotes: {
            where: {
              status: 'ACCEPTED'
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
          contracts: {
            where: {
              status: {
                in: ['SIGNED', 'ACTIVE']
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      });
      
      if (!opportunity) {
        throw new Error('Opportunity not found');
      }
      
      // Get accepted quote and signed contract if available
      const acceptedQuote = opportunity.quotes.length > 0 ? opportunity.quotes[0] : null;
      const signedContract = opportunity.contracts.length > 0 ? opportunity.contracts[0] : null;
      
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
      
      // Create job from opportunity data
      const job = await prisma.job.create({
        data: {
          jobNumber: jobData.jobNumber,
          name: jobData.name || opportunity.name,
          description: jobData.description || opportunity.description,
          status: jobData.status || 'PENDING',
          priority: jobData.priority || opportunity.priority,
          type: jobData.type || opportunity.type,
          category: jobData.category || opportunity.category,
          clientId: opportunity.companyId,
          clientName: opportunity.companyName,
          clientContactId: opportunity.contactId,
          clientContactName: opportunity.contactName,
          contractNumber: signedContract ? signedContract.contractNumber : '',
          contractValue: acceptedQuote ? acceptedQuote.total : opportunity.value,
          contractType: jobData.contractType || '',
          startDate: jobData.startDate ? new Date(jobData.startDate) : new Date(),
          targetCompletionDate: jobData.targetCompletionDate ? new Date(jobData.targetCompletionDate) : null,
          estimatedHours: jobData.estimatedHours || 0,
          location: jobData.location || opportunity.location,
          tags: jobData.tags || opportunity.tags,
          notes: jobData.notes || opportunity.notes,
          customFields: jobData.customFields || opportunity.customFields,
          assignedTo: jobData.assignedTo || [],
          generalContractor: jobData.generalContractor || {
            name: '',
            contactName: '',
            contactPhone: '',
            contactEmail: ''
          },
          architect: jobData.architect || {
            name: '',
            contactName: '',
            contactPhone: '',
            contactEmail: ''
          },
          engineer: jobData.engineer || {
            name: '',
            contactName: '',
            contactPhone: '',
            contactEmail: ''
          },
          finishDetails: jobData.finishDetails || {
            exteriorFinish: '',
            interiorFinish: '',
            specialFinishes: [],
            colorRequirements: '',
            textureRequirements: '',
            samples: []
          },
          deliveryInformation: jobData.deliveryInformation || {
            deliveryMethod: '',
            transportationProvider: '',
            specialRequirements: '',
            accessRestrictions: '',
            unloadingResponsibility: '',
            stagingArea: ''
          },
          keyDates: jobData.keyDates || {
            contractSignedDate: signedContract ? signedContract.signedDate : null,
            engineeringStartDate: null,
            engineeringCompletionDate: null,
            productionStartDate: null,
            productionCompletionDate: null,
            firstDeliveryDate: null,
            lastDeliveryDate: null,
            installationStartDate: null,
            installationCompletionDate: null,
            finalInspectionDate: null
          },
          budget: jobData.budget || {
            totalBudget: acceptedQuote ? acceptedQuote.total : opportunity.value,
            engineeringBudget: 0,
            materialsBudget: 0,
            laborBudget: 0,
            equipmentBudget: 0,
            subcontractorBudget: 0,
            overheadBudget: 0,
            contingencyBudget: 0,
            actualCosts: {
              engineering: 0,
              materials: 0,
              labor: 0,
              equipment: 0,
              subcontractor: 0,
              overhead: 0,
              other: 0
            }
          },
          billingInfo: jobData.billingInfo || {
            billingTerms: signedContract ? signedContract.paymentTerms : '',
            billingCycle: '',
            billingContact: {
              name: opportunity.contactName,
              email: opportunity.contactEmail,
              phone: opportunity.contactPhone
            },
            billingAddress: opportunity.company ? {
              street: opportunity.company.address?.street || '',
              city: opportunity.company.address?.city || '',
              state: opportunity.company.address?.state || '',
              zipCode: opportunity.company.address?.zipCode || '',
              country: opportunity.company.address?.country || ''
            } : {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            invoices: []
          },
          createdBy: jobData.createdBy
        }
      });
      
      // Update opportunity status if not already won
      if (opportunity.status !== 'WON') {
        await prisma.opportunity.update({
          where: { id: opportunityId },
          data: {
            status: 'WON',
            actualCloseDate: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      // Copy opportunity documents to job
      const opportunityDocuments = await prisma.document.findMany({
        where: { opportunityId }
      });
      
      for (const document of opportunityDocuments) {
        await prisma.jobDocument.create({
          data: {
            jobId: job.id,
            name: document.name,
            description: document.description,
            type: document.type,
            category: document.category,
            version: '1.0',
            status: 'FINAL',
            url: document.url,
            filePath: document.filePath,
            fileSize: document.fileSize,
            fileType: document.fileType,
            uploadedBy: document.createdBy,
            uploadedAt: new Date(),
            tags: document.tags,
            notes: document.notes,
            customFields: document.customFields,
            createdBy: document.createdBy,
            createdAt: new Date()
          }
        });
      }
      
      return job;
    } catch (error) {
      console.error(`Error creating job from opportunity with ID ${opportunityId}:`, error);
      throw new Error('Failed to create job from opportunity');
    }
  }
}

export default new SalesService();
