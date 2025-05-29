/**
 * Contact Management Services
 * Provides business logic and data access for the Contact Management module
 */

import prisma from '../../../lib/prisma';
import { 
  ContactModel,
  CompanyModel,
  RelationshipModel,
  ActivityModel,
  GroupModel,
  ImportExportJobModel,
  MergeRecordModel,
  ContactDashboardModel,
  CommunicationTemplateModel,
  CommunicationLogModel,
  ContactPreferenceModel
} from '../models/ContactManagementModel';

export class ContactManagementService {
  /**
   * Contact Management
   */
  async getContacts(filters = {}) {
    try {
      const { type, status, category, assignedTo, search, tags, lastContactDateFrom, lastContactDateTo } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      
      if (tags && tags.length > 0) {
        whereClause.tags = {
          hasSome: tags
        };
      }
      
      if (lastContactDateFrom && lastContactDateTo) {
        whereClause.lastContactDate = {
          gte: new Date(lastContactDateFrom),
          lte: new Date(lastContactDateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const contacts = await prisma.contact.findMany({
        where: whereClause,
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ],
        include: {
          company: {
            select: {
              name: true
            }
          },
          assignedToUser: {
            select: {
              name: true
            }
          }
        }
      });
      
      return contacts.map(contact => new ContactModel({
        ...contact,
        companyName: contact.company?.name || contact.companyName,
        assignedToName: contact.assignedToUser?.name || contact.assignedToName
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contacts');
    }
  }
  
  async getContactById(id) {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true
            }
          },
          assignedToUser: {
            select: {
              id: true,
              name: true
            }
          },
          relationships: {
            include: {
              target: {
                select: {
                  id: true,
                  type: true,
                  firstName: true,
                  lastName: true,
                  displayName: true,
                  name: true
                }
              }
            }
          },
          activities: {
            orderBy: { startDate: 'desc' },
            take: 10
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          jobs: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          documents: {
            select: {
              id: true,
              name: true,
              type: true,
              url: true
            }
          },
          preferences: true
        }
      });
      
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      return new ContactModel({
        ...contact,
        companyName: contact.company?.name || contact.companyName,
        assignedToName: contact.assignedToUser?.name || contact.assignedToName,
        relationships: contact.relationships.map(rel => new RelationshipModel({
          ...rel,
          targetName: this.getEntityName(rel.target)
        })),
        activities: contact.activities.map(activity => new ActivityModel(activity)),
        preferences: contact.preferences ? new ContactPreferenceModel(contact.preferences) : null
      });
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw new Error('Failed to fetch contact');
    }
  }
  
  async createContact(contactData) {
    try {
      // Check if contact with same email already exists
      if (contactData.email) {
        const existingContact = await prisma.contact.findFirst({
          where: {
            email: contactData.email
          }
        });
        
        if (existingContact) {
          throw new Error('Contact with same email already exists');
        }
      }
      
      // Validate company if provided
      if (contactData.companyId) {
        const company = await prisma.company.findUnique({
          where: { id: contactData.companyId }
        });
        
        if (!company) {
          throw new Error('Company not found');
        }
        
        contactData.companyName = company.name;
      }
      
      // Set display name if not provided
      if (!contactData.displayName && (contactData.firstName || contactData.lastName)) {
        contactData.displayName = `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim();
      }
      
      // Create contact
      const contact = await prisma.contact.create({
        data: {
          type: contactData.type || 'INDIVIDUAL',
          category: contactData.category,
          status: contactData.status || 'ACTIVE',
          salutation: contactData.salutation,
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          displayName: contactData.displayName,
          jobTitle: contactData.jobTitle,
          department: contactData.department,
          companyId: contactData.companyId,
          companyName: contactData.companyName,
          email: contactData.email,
          phone: contactData.phone,
          mobile: contactData.mobile,
          fax: contactData.fax,
          website: contactData.website,
          address: contactData.address,
          mailingAddress: contactData.mailingAddress,
          useMailingAddressForBilling: contactData.useMailingAddressForBilling !== false,
          billingAddress: contactData.billingAddress,
          socialMedia: contactData.socialMedia,
          preferredContactMethod: contactData.preferredContactMethod || 'EMAIL',
          timezone: contactData.timezone || 'America/New_York',
          language: contactData.language || 'en',
          birthday: contactData.birthday ? new Date(contactData.birthday) : null,
          anniversary: contactData.anniversary ? new Date(contactData.anniversary) : null,
          notes: contactData.notes,
          tags: contactData.tags || [],
          customFields: contactData.customFields || {},
          profileImage: contactData.profileImage,
          assignedTo: contactData.assignedTo,
          assignedToName: contactData.assignedToName,
          source: contactData.source,
          leadSource: contactData.leadSource,
          leadStatus: contactData.leadStatus,
          leadScore: contactData.leadScore || 0,
          lastContactDate: contactData.lastContactDate ? new Date(contactData.lastContactDate) : null,
          nextFollowUpDate: contactData.nextFollowUpDate ? new Date(contactData.nextFollowUpDate) : null,
          permissions: contactData.permissions || {
            viewable: [],
            editable: []
          },
          createdBy: contactData.createdBy
        }
      });
      
      // Create contact preferences
      if (contactData.preferences) {
        await prisma.contactPreference.create({
          data: {
            contactId: contact.id,
            contactName: contact.displayName,
            emailSubscription: contactData.preferences.emailSubscription,
            smsSubscription: contactData.preferences.smsSubscription,
            callPreferences: contactData.preferences.callPreferences,
            mailingPreferences: contactData.preferences.mailingPreferences,
            communicationFrequency: contactData.preferences.communicationFrequency || 'NORMAL',
            preferredLanguage: contactData.preferences.preferredLanguage || contact.language || 'en',
            doNotContact: contactData.preferences.doNotContact || false,
            unsubscribeReason: contactData.preferences.unsubscribeReason,
            lastUpdated: new Date().toISOString(),
            updatedBy: contactData.createdBy
          }
        });
      }
      
      return new ContactModel(contact);
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new Error('Failed to create contact');
    }
  }
  
  async updateContact(id, contactData) {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id }
      });
      
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Validate company if provided
      if (contactData.companyId && contactData.companyId !== contact.companyId) {
        const company = await prisma.company.findUnique({
          where: { id: contactData.companyId }
        });
        
        if (!company) {
          throw new Error('Company not found');
        }
        
        contactData.companyName = company.name;
      }
      
      // Set display name if first or last name is updated
      if ((contactData.firstName !== undefined && contactData.firstName !== contact.firstName) || 
          (contactData.lastName !== undefined && contactData.lastName !== contact.lastName)) {
        const firstName = contactData.firstName !== undefined ? contactData.firstName : contact.firstName;
        const lastName = contactData.lastName !== undefined ? contactData.lastName : contact.lastName;
        contactData.displayName = `${firstName || ''} ${lastName || ''}`.trim();
      }
      
      // Update contact
      const updatedContact = await prisma.contact.update({
        where: { id },
        data: {
          type: contactData.type,
          category: contactData.category,
          status: contactData.status,
          salutation: contactData.salutation,
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          displayName: contactData.displayName,
          jobTitle: contactData.jobTitle,
          department: contactData.department,
          companyId: contactData.companyId,
          companyName: contactData.companyName,
          email: contactData.email,
          phone: contactData.phone,
          mobile: contactData.mobile,
          fax: contactData.fax,
          website: contactData.website,
          address: contactData.address,
          mailingAddress: contactData.mailingAddress,
          useMailingAddressForBilling: contactData.useMailingAddressForBilling,
          billingAddress: contactData.billingAddress,
          socialMedia: contactData.socialMedia,
          preferredContactMethod: contactData.preferredContactMethod,
          timezone: contactData.timezone,
          language: contactData.language,
          birthday: contactData.birthday ? new Date(contactData.birthday) : contact.birthday,
          anniversary: contactData.anniversary ? new Date(contactData.anniversary) : contact.anniversary,
          notes: contactData.notes,
          tags: contactData.tags,
          customFields: contactData.customFields,
          profileImage: contactData.profileImage,
          assignedTo: contactData.assignedTo,
          assignedToName: contactData.assignedToName,
          source: contactData.source,
          leadSource: contactData.leadSource,
          leadStatus: contactData.leadStatus,
          leadScore: contactData.leadScore,
          lastContactDate: contactData.lastContactDate ? new Date(contactData.lastContactDate) : contact.lastContactDate,
          nextFollowUpDate: contactData.nextFollowUpDate ? new Date(contactData.nextFollowUpDate) : contact.nextFollowUpDate,
          permissions: contactData.permissions,
          updatedAt: new Date()
        }
      });
      
      // Update contact preferences if provided
      if (contactData.preferences) {
        const existingPreferences = await prisma.contactPreference.findUnique({
          where: { contactId: id }
        });
        
        if (existingPreferences) {
          await prisma.contactPreference.update({
            where: { contactId: id },
            data: {
              contactName: updatedContact.displayName,
              emailSubscription: contactData.preferences.emailSubscription,
              smsSubscription: contactData.preferences.smsSubscription,
              callPreferences: contactData.preferences.callPreferences,
              mailingPreferences: contactData.preferences.mailingPreferences,
              communicationFrequency: contactData.preferences.communicationFrequency,
              preferredLanguage: contactData.preferences.preferredLanguage,
              doNotContact: contactData.preferences.doNotContact,
              unsubscribeReason: contactData.preferences.unsubscribeReason,
              lastUpdated: new Date().toISOString(),
              updatedBy: contactData.updatedBy || 'system',
              updatedAt: new Date()
            }
          });
        } else {
          await prisma.contactPreference.create({
            data: {
              contactId: id,
              contactName: updatedContact.displayName,
              emailSubscription: contactData.preferences.emailSubscription,
              smsSubscription: contactData.preferences.smsSubscription,
              callPreferences: contactData.preferences.callPreferences,
              mailingPreferences: contactData.preferences.mailingPreferences,
              communicationFrequency: contactData.preferences.communicationFrequency || 'NORMAL',
              preferredLanguage: contactData.preferences.preferredLanguage || updatedContact.language || 'en',
              doNotContact: contactData.preferences.doNotContact || false,
              unsubscribeReason: contactData.preferences.unsubscribeReason,
              lastUpdated: new Date().toISOString(),
              updatedBy: contactData.updatedBy || 'system'
            }
          });
        }
      }
      
      return new ContactModel(updatedContact);
    } catch (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw new Error('Failed to update contact');
    }
  }
  
  /**
   * Company Management
   */
  async getCompanies(filters = {}) {
    try {
      const { type, status, category, industry, assignedTo, search, tags } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;
      if (industry) whereClause.industry = industry;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      
      if (tags && tags.length > 0) {
        whereClause.tags = {
          hasSome: tags
        };
      }
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { legalName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { website: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const companies = await prisma.company.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        include: {
          primaryContact: {
            select: {
              id: true,
              displayName: true
            }
          },
          assignedToUser: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              contacts: true
            }
          }
        }
      });
      
      return companies.map(company => new CompanyModel({
        ...company,
        primaryContactName: company.primaryContact?.displayName || '',
        assignedToName: company.assignedToUser?.name || company.assignedToName,
        contactCount: company._count.contacts
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }
  }
  
  async getCompanyById(id) {
    try {
      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          primaryContact: {
            select: {
              id: true,
              displayName: true,
              email: true,
              phone: true
            }
          },
          contacts: {
            orderBy: { lastName: 'asc' },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              displayName: true,
              jobTitle: true,
              email: true,
              phone: true
            }
          },
          parentCompany: {
            select: {
              id: true,
              name: true
            }
          },
          subsidiaries: {
            select: {
              id: true,
              name: true
            }
          },
          assignedToUser: {
            select: {
              id: true,
              name: true
            }
          },
          relationships: {
            include: {
              target: {
                select: {
                  id: true,
                  type: true,
                  firstName: true,
                  lastName: true,
                  displayName: true,
                  name: true
                }
              }
            }
          },
          activities: {
            orderBy: { startDate: 'desc' },
            take: 10
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          jobs: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          documents: {
            select: {
              id: true,
              name: true,
              type: true,
              url: true
            }
          }
        }
      });
      
      if (!company) {
        throw new Error('Company not found');
      }
      
      return new CompanyModel({
        ...company,
        primaryContactName: company.primaryContact?.displayName || '',
        parentCompanyName: company.parentCompany?.name || '',
        assignedToName: company.assignedToUser?.name || company.assignedToName,
        relationships: company.relationships.map(rel => new RelationshipModel({
          ...rel,
          targetName: this.getEntityName(rel.target)
        })),
        activities: company.activities.map(activity => new ActivityModel(activity))
      });
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw new Error('Failed to fetch company');
    }
  }
  
  async createCompany(companyData) {
    try {
      // Check if company with same name already exists
      if (companyData.name) {
        const existingCompany = await prisma.company.findFirst({
          where: {
            name: companyData.name
          }
        });
        
        if (existingCompany) {
          throw new Error('Company with same name already exists');
        }
      }
      
      // Validate parent company if provided
      if (companyData.parentCompanyId) {
        const parentCompany = await prisma.company.findUnique({
          where: { id: companyData.parentCompanyId }
        });
        
        if (!parentCompany) {
          throw new Error('Parent company not found');
        }
        
        companyData.parentCompanyName = parentCompany.name;
      }
      
      // Validate primary contact if provided
      if (companyData.primaryContactId) {
        const primaryContact = await prisma.contact.findUnique({
          where: { id: companyData.primaryContactId }
        });
        
        if (!primaryContact) {
          throw new Error('Primary contact not found');
        }
        
        companyData.primaryContactName = primaryContact.displayName;
      }
      
      // Create company
      const company = await prisma.company.create({
        data: {
          type: companyData.type || 'COMPANY',
          category: companyData.category,
          status: companyData.status || 'ACTIVE',
          name: companyData.name,
          legalName: companyData.legalName,
          industry: companyData.industry,
          description: companyData.description,
          size: companyData.size,
          yearFounded: companyData.yearFounded,
          revenue: companyData.revenue,
          website: companyData.website,
          email: companyData.email,
          phone: companyData.phone,
          fax: companyData.fax,
          address: companyData.address,
          mailingAddress: companyData.mailingAddress,
          useMailingAddressForBilling: companyData.useMailingAddressForBilling !== false,
          billingAddress: companyData.billingAddress,
          socialMedia: companyData.socialMedia,
          taxId: companyData.taxId,
          registrationNumber: companyData.registrationNumber,
          logo: companyData.logo,
          primaryContactId: companyData.primaryContactId,
          primaryContactName: companyData.primaryContactName,
          parentCompanyId: companyData.parentCompanyId,
          parentCompanyName: companyData.parentCompanyName,
          notes: companyData.notes,
          tags: companyData.tags || [],
          customFields: companyData.customFields || {},
          assignedTo: companyData.assignedTo,
          assignedToName: companyData.assignedToName,
          source: companyData.source,
          leadSource: companyData.leadSource,
          leadStatus: companyData.leadStatus,
          leadScore: companyData.leadScore || 0,
          lastContactDate: companyData.lastContactDate ? new Date(companyData.lastContactDate) : null,
          nextFollowUpDate: companyData.nextFollowUpDate ? new Date(companyData.nextFollowUpDate) : null,
          permissions: companyData.permissions || {
            viewable: [],
            editable: []
          },
          createdBy: companyData.createdBy
        }
      });
      
      return new CompanyModel(company);
    } catch (error) {
      console.error('Error creating company:', error);
      throw new Error('Failed to create company');
    }
  }
  
  /**
   * Relationship Management
   */
  async getRelationships(filters = {}) {
    try {
      const { sourceId, sourceType, targetId, targetType, type, isActive } = filters;
      
      const whereClause = {};
      if (sourceId) whereClause.sourceId = sourceId;
      if (sourceType) whereClause.sourceType = sourceType;
      if (targetId) whereClause.targetId = targetId;
      if (targetType) whereClause.targetType = targetType;
      if (type) whereClause.type = type;
      if (isActive !== undefined) whereClause.isActive = isActive;
      
      const relationships = await prisma.relationship.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          source: {
            select: {
              id: true,
              type: true,
              firstName: true,
              lastName: true,
              displayName: true,
              name: true
            }
          },
          target: {
            select: {
              id: true,
              type: true,
              firstName: true,
              lastName: true,
              displayName: true,
              name: true
            }
          }
        }
      });
      
      return relationships.map(rel => new RelationshipModel({
        ...rel,
        sourceName: this.getEntityName(rel.source),
        targetName: this.getEntityName(rel.target)
      }));
    } catch (error) {
      console.error('Error fetching relationships:', error);
      throw new Error('Failed to fetch relationships');
    }
  }
  
  async createRelationship(relationshipData) {
    try {
      // Validate source entity
      const source = await this.getEntityById(relationshipData.sourceId, relationshipData.sourceType);
      if (!source) {
        throw new Error('Source entity not found');
      }
      
      // Validate target entity
      const target = await this.getEntityById(relationshipData.targetId, relationshipData.targetType);
      if (!target) {
        throw new Error('Target entity not found');
      }
      
      // Check if relationship already exists
      const existingRelationship = await prisma.relationship.findFirst({
        where: {
          sourceId: relationshipData.sourceId,
          sourceType: relationshipData.sourceType,
          targetId: relationshipData.targetId,
          targetType: relationshipData.targetType,
          type: relationshipData.type
        }
      });
      
      if (existingRelationship) {
        throw new Error('Relationship already exists');
      }
      
      // Create relationship
      const relationship = await prisma.relationship.create({
        data: {
          sourceId: relationshipData.sourceId,
          sourceType: relationshipData.sourceType,
          sourceName: this.getEntityName(source),
          targetId: relationshipData.targetId,
          targetType: relationshipData.targetType,
          targetName: this.getEntityName(target),
          type: relationshipData.type,
          role: relationshipData.role,
          description: relationshipData.description,
          startDate: relationshipData.startDate ? new Date(relationshipData.startDate) : null,
          endDate: relationshipData.endDate ? new Date(relationshipData.endDate) : null,
          isActive: relationshipData.isActive !== false,
          notes: relationshipData.notes,
          createdBy: relationshipData.createdBy
        }
      });
      
      // Create reciprocal relationship if needed
      if (relationshipData.createReciprocal) {
        const reciprocalType = this.getReciprocalRelationshipType(relationshipData.type);
        
        if (reciprocalType) {
          await prisma.relationship.create({
            data: {
              sourceId: relationshipData.targetId,
              sourceType: relationshipData.targetType,
              sourceName: this.getEntityName(target),
              targetId: relationshipData.sourceId,
              targetType: relationshipData.sourceType,
              targetName: this.getEntityName(source),
              type: reciprocalType,
              role: relationshipData.reciprocalRole || '',
              description: relationshipData.description,
              startDate: relationshipData.startDate ? new Date(relationshipData.startDate) : null,
              endDate: relationshipData.endDate ? new Date(relationshipData.endDate) : null,
              isActive: relationshipData.isActive !== false,
              notes: relationshipData.notes,
              createdBy: relationshipData.createdBy
            }
          });
        }
      }
      
      return new RelationshipModel(relationship);
    } catch (error) {
      console.error('Error creating relationship:', error);
      throw new Error('Failed to create relationship');
    }
  }
  
  /**
   * Activity Management
   */
  async getActivities(filters = {}) {
    try {
      const { type, status, priority, assignedTo, relatedToId, relatedToType, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (status) whereClause.status = status;
      if (priority) whereClause.priority = priority;
      if (assignedTo) whereClause.assignedTo = assignedTo;
      
      if (relatedToId && relatedToType) {
        whereClause.relatedTo = {
          some: {
            id: relatedToId,
            type: relatedToType
          }
        };
      }
      
      if (dateFrom && dateTo) {
        whereClause.OR = [
          {
            startDate: {
              gte: new Date(dateFrom),
              lte: new Date(dateTo)
            }
          },
          {
            endDate: {
              gte: new Date(dateFrom),
              lte: new Date(dateTo)
            }
          }
        ];
      }
      
      if (search) {
        whereClause.OR = [
          { subject: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const activities = await prisma.activity.findMany({
        where: whereClause,
        orderBy: [
          { startDate: 'asc' }
        ],
        include: {
          assignedToUser: {
            select: {
              name: true
            }
          },
          participants: {
            select: {
              id: true,
              displayName: true,
              name: true
            }
          }
        }
      });
      
      return activities.map(activity => new ActivityModel({
        ...activity,
        assignedToName: activity.assignedToUser?.name || activity.assignedToName
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  }
  
  async createActivity(activityData) {
    try {
      // Validate assigned user if provided
      if (activityData.assignedTo) {
        const assignedUser = await prisma.user.findUnique({
          where: { id: activityData.assignedTo }
        });
        
        if (!assignedUser) {
          throw new Error('Assigned user not found');
        }
        
        activityData.assignedToName = assignedUser.name;
      }
      
      // Validate related entities
      if (activityData.relatedTo && activityData.relatedTo.length > 0) {
        const validatedRelatedTo = [];
        
        for (const entity of activityData.relatedTo) {
          const validEntity = await this.getEntityById(entity.id, entity.type);
          if (validEntity) {
            validatedRelatedTo.push({
              id: entity.id,
              type: entity.type,
              name: this.getEntityName(validEntity)
            });
          }
        }
        
        activityData.relatedTo = validatedRelatedTo;
      }
      
      // Validate participants
      if (activityData.participants && activityData.participants.length > 0) {
        const validatedParticipants = [];
        
        for (const participant of activityData.participants) {
          const validParticipant = await this.getEntityById(participant.id, participant.type || 'CONTACT');
          if (validParticipant) {
            validatedParticipants.push({
              id: participant.id,
              type: participant.type || 'CONTACT',
              name: this.getEntityName(validParticipant)
            });
          }
        }
        
        activityData.participants = validatedParticipants;
      }
      
      // Create activity
      const activity = await prisma.activity.create({
        data: {
          type: activityData.type,
          subject: activityData.subject,
          description: activityData.description,
          status: activityData.status || 'PENDING',
          priority: activityData.priority || 'NORMAL',
          startDate: activityData.startDate ? new Date(activityData.startDate) : null,
          endDate: activityData.endDate ? new Date(activityData.endDate) : null,
          duration: activityData.duration || 0,
          location: activityData.location,
          isAllDay: activityData.isAllDay || false,
          reminder: activityData.reminder,
          recurrence: activityData.recurrence,
          outcome: activityData.outcome,
          relatedTo: activityData.relatedTo || [],
          assignedTo: activityData.assignedTo,
          assignedToName: activityData.assignedToName,
          participants: activityData.participants || [],
          attachments: activityData.attachments || [],
          tags: activityData.tags || [],
          customFields: activityData.customFields || {},
          createdBy: activityData.createdBy
        }
      });
      
      // Update last contact date for related entities
      if (activityData.relatedTo && activityData.relatedTo.length > 0) {
        for (const entity of activityData.relatedTo) {
          await this.updateEntityLastContactDate(entity.id, entity.type, activity.startDate || new Date());
        }
      }
      
      return new ActivityModel(activity);
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity');
    }
  }
  
  async completeActivity(id, completionData) {
    try {
      const activity = await prisma.activity.findUnique({
        where: { id }
      });
      
      if (!activity) {
        throw new Error('Activity not found');
      }
      
      // Update activity
      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          outcome: completionData.outcome,
          completedBy: completionData.completedBy,
          completedAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      // Update last contact date for related entities
      if (activity.relatedTo && activity.relatedTo.length > 0) {
        for (const entity of activity.relatedTo) {
          await this.updateEntityLastContactDate(entity.id, entity.type, new Date());
        }
      }
      
      return new ActivityModel(updatedActivity);
    } catch (error) {
      console.error(`Error completing activity with ID ${id}:`, error);
      throw new Error('Failed to complete activity');
    }
  }
  
  /**
   * Group Management
   */
  async getGroups(filters = {}) {
    try {
      const { type, isPublic, search } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (isPublic !== undefined) whereClause.isPublic = isPublic;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const groups = await prisma.group.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return groups.map(group => new GroupModel(group));
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Failed to fetch groups');
    }
  }
  
  /**
   * Communication Template Management
   */
  async getCommunicationTemplates(filters = {}) {
    try {
      const { type, category, isActive, isDefault, search } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (category) whereClause.category = category;
      if (isActive !== undefined) whereClause.isActive = isActive;
      if (isDefault !== undefined) whereClause.isDefault = isDefault;
      
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { subject: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const templates = await prisma.communicationTemplate.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return templates.map(template => new CommunicationTemplateModel(template));
    } catch (error) {
      console.error('Error fetching communication templates:', error);
      throw new Error('Failed to fetch communication templates');
    }
  }
  
  /**
   * Communication Log Management
   */
  async getCommunicationLogs(filters = {}) {
    try {
      const { type, direction, status, sender, recipient, dateFrom, dateTo, search } = filters;
      
      const whereClause = {};
      if (type) whereClause.type = type;
      if (direction) whereClause.direction = direction;
      if (status) whereClause.status = status;
      if (sender) whereClause.sender = sender;
      
      if (recipient) {
        whereClause.recipients = {
          some: {
            id: recipient
          }
        };
      }
      
      if (dateFrom && dateTo) {
        whereClause.sentAt = {
          gte: new Date(dateFrom),
          lte: new Date(dateTo)
        };
      }
      
      if (search) {
        whereClause.OR = [
          { subject: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { senderName: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const logs = await prisma.communicationLog.findMany({
        where: whereClause,
        orderBy: { sentAt: 'desc' }
      });
      
      return logs.map(log => new CommunicationLogModel(log));
    } catch (error) {
      console.error('Error fetching communication logs:', error);
      throw new Error('Failed to fetch communication logs');
    }
  }
  
  /**
   * Dashboard Data
   */
  async getContactDashboardData() {
    try {
      // Contact stats
      const contactStats = await prisma.contact.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const contactStatsData = {
        total: 0,
        active: 0,
        inactive: 0,
        leads: 0,
        prospects: 0,
        customers: 0
      };
      
      contactStats.forEach(stat => {
        contactStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'ACTIVE':
            contactStatsData.active = stat._count.id;
            break;
          case 'INACTIVE':
            contactStatsData.inactive = stat._count.id;
            break;
          case 'LEAD':
            contactStatsData.leads = stat._count.id;
            break;
          case 'PROSPECT':
            contactStatsData.prospects = stat._count.id;
            break;
          case 'CUSTOMER':
            contactStatsData.customers = stat._count.id;
            break;
        }
      });
      
      // Company stats
      const companyStats = await prisma.company.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const companyStatsData = {
        total: 0,
        active: 0,
        inactive: 0,
        leads: 0,
        prospects: 0,
        customers: 0
      };
      
      companyStats.forEach(stat => {
        companyStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'ACTIVE':
            companyStatsData.active = stat._count.id;
            break;
          case 'INACTIVE':
            companyStatsData.inactive = stat._count.id;
            break;
          case 'LEAD':
            companyStatsData.leads = stat._count.id;
            break;
          case 'PROSPECT':
            companyStatsData.prospects = stat._count.id;
            break;
          case 'CUSTOMER':
            companyStatsData.customers = stat._count.id;
            break;
        }
      });
      
      // Activity stats
      const activityStats = await prisma.activity.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });
      
      const activityStatsData = {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        overdue: 0,
        upcoming: 0
      };
      
      activityStats.forEach(stat => {
        activityStatsData.total += stat._count.id;
        
        switch (stat.status) {
          case 'PENDING':
            activityStatsData.pending = stat._count.id;
            break;
          case 'COMPLETED':
            activityStatsData.completed = stat._count.id;
            break;
          case 'CANCELLED':
            activityStatsData.cancelled = stat._count.id;
            break;
        }
      });
      
      // Count overdue activities
      const today = new Date();
      const overdueActivities = await prisma.activity.count({
        where: {
          endDate: {
            lt: today
          },
          status: 'PENDING'
        }
      });
      
      activityStatsData.overdue = overdueActivities;
      
      // Count upcoming activities
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const upcomingActivities = await prisma.activity.count({
        where: {
          startDate: {
            gte: today,
            lte: nextWeek
          },
          status: 'PENDING'
        }
      });
      
      activityStatsData.upcoming = upcomingActivities;
      
      // Contacts by type
      const contactsByType = await prisma.contact.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      });
      
      const contactsByTypeArray = contactsByType.map(item => ({
        type: item.type,
        count: item._count.id
      }));
      
      // Contacts by source
      const contactsBySource = await prisma.contact.groupBy({
        by: ['source'],
        _count: {
          id: true
        },
        where: {
          source: {
            not: null
          }
        }
      });
      
      const contactsBySourceArray = contactsBySource.map(item => ({
        source: item.source,
        count: item._count.id
      }));
      
      // Companies by industry
      const companiesByIndustry = await prisma.company.groupBy({
        by: ['industry'],
        _count: {
          id: true
        },
        where: {
          industry: {
            not: null
          }
        }
      });
      
      const companiesByIndustryArray = companiesByIndustry.map(item => ({
        industry: item.industry,
        count: item._count.id
      }));
      
      // Recent contacts
      const recentContacts = await prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          email: true,
          phone: true,
          companyName: true,
          status: true,
          createdAt: true
        }
      });
      
      // Recent companies
      const recentCompanies = await prisma.company.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          industry: true,
          phone: true,
          email: true,
          status: true,
          createdAt: true
        }
      });
      
      // Upcoming activities
      const upcomingActivitiesList = await prisma.activity.findMany({
        where: {
          startDate: {
            gte: today,
            lte: nextWeek
          },
          status: 'PENDING'
        },
        orderBy: { startDate: 'asc' },
        take: 10,
        include: {
          assignedToUser: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Overdue activities
      const overdueActivitiesList = await prisma.activity.findMany({
        where: {
          endDate: {
            lt: today
          },
          status: 'PENDING'
        },
        orderBy: { endDate: 'asc' },
        take: 10,
        include: {
          assignedToUser: {
            select: {
              name: true
            }
          }
        }
      });
      
      // Lead conversion rate
      const convertedLeads = await prisma.contact.count({
        where: {
          status: 'CUSTOMER',
          leadSource: {
            not: null
          }
        }
      });
      
      const totalLeads = await prisma.contact.count({
        where: {
          OR: [
            { status: 'LEAD' },
            { status: 'PROSPECT' },
            { status: 'CUSTOMER', leadSource: { not: null } }
          ]
        }
      });
      
      const leadConversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      
      // Contact growth rate
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      const currentMonthContacts = await prisma.contact.count({
        where: {
          createdAt: {
            gte: oneMonthAgo
          }
        }
      });
      
      const previousMonthContacts = await prisma.contact.count({
        where: {
          createdAt: {
            gte: twoMonthsAgo,
            lt: oneMonthAgo
          }
        }
      });
      
      const contactGrowthRate = previousMonthContacts > 0 
        ? ((currentMonthContacts - previousMonthContacts) / previousMonthContacts) * 100 
        : (currentMonthContacts > 0 ? 100 : 0);
      
      // Top performers
      const topPerformers = await prisma.user.findMany({
        where: {
          activities: {
            some: {
              status: 'COMPLETED',
              completedAt: {
                gte: oneMonthAgo
              }
            }
          }
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              activities: {
                where: {
                  status: 'COMPLETED',
                  completedAt: {
                    gte: oneMonthAgo
                  }
                }
              }
            }
          }
        },
        orderBy: {
          activities: {
            _count: 'desc'
          }
        },
        take: 5
      });
      
      const topPerformersArray = topPerformers.map(user => ({
        id: user.id,
        name: user.name,
        completedActivities: user._count.activities
      }));
      
      return new ContactDashboardModel({
        contactStats: contactStatsData,
        companyStats: companyStatsData,
        activityStats: activityStatsData,
        contactsByType: contactsByTypeArray,
        contactsBySource: contactsBySourceArray,
        contactsByIndustry: companiesByIndustryArray,
        recentContacts,
        recentCompanies,
        upcomingActivities: upcomingActivitiesList.map(activity => new ActivityModel({
          ...activity,
          assignedToName: activity.assignedToUser?.name || activity.assignedToName
        })),
        overdueActivities: overdueActivitiesList.map(activity => new ActivityModel({
          ...activity,
          assignedToName: activity.assignedToUser?.name || activity.assignedToName
        })),
        leadConversionRate,
        contactGrowthRate,
        topPerformers: topPerformersArray
      });
    } catch (error) {
      console.error('Error fetching contact dashboard data:', error);
      throw new Error('Failed to fetch contact dashboard data');
    }
  }
  
  /**
   * Helper Methods
   */
  async getEntityById(id, type) {
    try {
      switch (type) {
        case 'CONTACT':
          return await prisma.contact.findUnique({
            where: { id }
          });
        case 'COMPANY':
          return await prisma.company.findUnique({
            where: { id }
          });
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error fetching entity with ID ${id} and type ${type}:`, error);
      return null;
    }
  }
  
  getEntityName(entity) {
    if (!entity) return '';
    
    if (entity.type === 'CONTACT' || entity.type === 'INDIVIDUAL') {
      return entity.displayName || `${entity.firstName || ''} ${entity.lastName || ''}`.trim();
    } else {
      return entity.name || '';
    }
  }
  
  getReciprocalRelationshipType(type) {
    const reciprocalMap = {
      'EMPLOYEE': 'EMPLOYER',
      'EMPLOYER': 'EMPLOYEE',
      'CUSTOMER': 'VENDOR',
      'VENDOR': 'CUSTOMER',
      'PARTNER': 'PARTNER',
      'FAMILY': 'FAMILY',
      'FRIEND': 'FRIEND',
      'PARENT': 'SUBSIDIARY',
      'SUBSIDIARY': 'PARENT'
    };
    
    return reciprocalMap[type] || null;
  }
  
  async updateEntityLastContactDate(id, type, date) {
    try {
      switch (type) {
        case 'CONTACT':
          await prisma.contact.update({
            where: { id },
            data: {
              lastContactDate: date,
              updatedAt: new Date()
            }
          });
          break;
        case 'COMPANY':
          await prisma.company.update({
            where: { id },
            data: {
              lastContactDate: date,
              updatedAt: new Date()
            }
          });
          break;
      }
      
      return true;
    } catch (error) {
      console.error(`Error updating last contact date for entity with ID ${id} and type ${type}:`, error);
      return false;
    }
  }
}

export default new ContactManagementService();
