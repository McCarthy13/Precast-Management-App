/**
 * Configuration Services
 * Provides business logic and data access for the Configuration module
 */

import prisma from '../../../lib/prisma';
import { 
  SystemConfigModel,
  ModuleConfigModel,
  UserRoleModel,
  CustomFieldModel,
  WorkflowModel,
  WorkflowStepModel,
  NotificationTemplateModel,
  IntegrationModel,
  AuditLogModel,
  SystemHealthModel
} from '../models/ConfigurationModel';

export class ConfigurationService {
  /**
   * System Configuration
   */
  async getSystemConfig() {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { id: 'system' }
      });
      
      if (!config) {
        // Create default system config if not exists
        const defaultConfig = new SystemConfigModel({});
        await prisma.systemConfig.create({
          data: defaultConfig
        });
        return defaultConfig;
      }
      
      return new SystemConfigModel(config);
    } catch (error) {
      console.error('Error fetching system configuration:', error);
      throw new Error('Failed to fetch system configuration');
    }
  }
  
  async updateSystemConfig(configData) {
    try {
      const existingConfig = await prisma.systemConfig.findUnique({
        where: { id: 'system' }
      });
      
      if (!existingConfig) {
        // Create new system config
        const newConfig = await prisma.systemConfig.create({
          data: {
            id: 'system',
            companyName: configData.companyName,
            companyLogo: configData.companyLogo,
            primaryColor: configData.primaryColor,
            secondaryColor: configData.secondaryColor,
            accentColor: configData.accentColor,
            dateFormat: configData.dateFormat,
            timeFormat: configData.timeFormat,
            timezone: configData.timezone,
            defaultLanguage: configData.defaultLanguage,
            supportedLanguages: configData.supportedLanguages,
            currency: configData.currency,
            measurementSystem: configData.measurementSystem,
            emailNotifications: configData.emailNotifications,
            smsNotifications: configData.smsNotifications,
            pushNotifications: configData.pushNotifications,
            maintenanceMode: configData.maintenanceMode,
            maintenanceMessage: configData.maintenanceMessage,
            systemVersion: configData.systemVersion,
            lastUpdated: new Date().toISOString(),
            updatedBy: configData.updatedBy
          }
        });
        
        return new SystemConfigModel(newConfig);
      }
      
      // Update existing system config
      const updatedConfig = await prisma.systemConfig.update({
        where: { id: 'system' },
        data: {
          companyName: configData.companyName,
          companyLogo: configData.companyLogo,
          primaryColor: configData.primaryColor,
          secondaryColor: configData.secondaryColor,
          accentColor: configData.accentColor,
          dateFormat: configData.dateFormat,
          timeFormat: configData.timeFormat,
          timezone: configData.timezone,
          defaultLanguage: configData.defaultLanguage,
          supportedLanguages: configData.supportedLanguages,
          currency: configData.currency,
          measurementSystem: configData.measurementSystem,
          emailNotifications: configData.emailNotifications,
          smsNotifications: configData.smsNotifications,
          pushNotifications: configData.pushNotifications,
          maintenanceMode: configData.maintenanceMode,
          maintenanceMessage: configData.maintenanceMessage,
          systemVersion: configData.systemVersion,
          lastUpdated: new Date().toISOString(),
          updatedBy: configData.updatedBy
        }
      });
      
      return new SystemConfigModel(updatedConfig);
    } catch (error) {
      console.error('Error updating system configuration:', error);
      throw new Error('Failed to update system configuration');
    }
  }
  
  /**
   * Module Configuration
   */
  async getModuleConfigs() {
    try {
      const moduleConfigs = await prisma.moduleConfig.findMany({
        orderBy: { displayOrder: 'asc' }
      });
      
      return moduleConfigs.map(config => new ModuleConfigModel(config));
    } catch (error) {
      console.error('Error fetching module configurations:', error);
      throw new Error('Failed to fetch module configurations');
    }
  }
  
  async getModuleConfigByKey(moduleKey) {
    try {
      const moduleConfig = await prisma.moduleConfig.findUnique({
        where: { moduleKey }
      });
      
      if (!moduleConfig) {
        throw new Error(`Module configuration not found for key: ${moduleKey}`);
      }
      
      return new ModuleConfigModel(moduleConfig);
    } catch (error) {
      console.error(`Error fetching module configuration for key ${moduleKey}:`, error);
      throw new Error('Failed to fetch module configuration');
    }
  }
  
  async updateModuleConfig(moduleKey, configData) {
    try {
      const existingConfig = await prisma.moduleConfig.findUnique({
        where: { moduleKey }
      });
      
      if (!existingConfig) {
        throw new Error(`Module configuration not found for key: ${moduleKey}`);
      }
      
      const updatedConfig = await prisma.moduleConfig.update({
        where: { moduleKey },
        data: {
          moduleName: configData.moduleName,
          isEnabled: configData.isEnabled,
          displayOrder: configData.displayOrder,
          icon: configData.icon,
          description: configData.description,
          requiredRoles: configData.requiredRoles,
          settings: configData.settings,
          customFields: configData.customFields,
          workflows: configData.workflows,
          integrations: configData.integrations,
          lastUpdated: new Date().toISOString(),
          updatedBy: configData.updatedBy
        }
      });
      
      return new ModuleConfigModel(updatedConfig);
    } catch (error) {
      console.error(`Error updating module configuration for key ${moduleKey}:`, error);
      throw new Error('Failed to update module configuration');
    }
  }
  
  /**
   * User Role Management
   */
  async getUserRoles() {
    try {
      const roles = await prisma.userRole.findMany({
        orderBy: { name: 'asc' }
      });
      
      return roles.map(role => new UserRoleModel(role));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw new Error('Failed to fetch user roles');
    }
  }
  
  async getUserRoleById(id) {
    try {
      const role = await prisma.userRole.findUnique({
        where: { id }
      });
      
      if (!role) {
        throw new Error(`User role not found with ID: ${id}`);
      }
      
      return new UserRoleModel(role);
    } catch (error) {
      console.error(`Error fetching user role with ID ${id}:`, error);
      throw new Error('Failed to fetch user role');
    }
  }
  
  async createUserRole(roleData) {
    try {
      // Check if role with same name already exists
      const existingRole = await prisma.userRole.findFirst({
        where: { name: roleData.name }
      });
      
      if (existingRole) {
        throw new Error(`User role with name '${roleData.name}' already exists`);
      }
      
      const newRole = await prisma.userRole.create({
        data: {
          name: roleData.name,
          description: roleData.description,
          isSystem: roleData.isSystem || false,
          isDefault: roleData.isDefault || false,
          permissions: roleData.permissions || {},
          moduleAccess: roleData.moduleAccess || {},
          dataAccess: roleData.dataAccess || {},
          createdBy: roleData.createdBy,
          updatedBy: roleData.createdBy
        }
      });
      
      return new UserRoleModel(newRole);
    } catch (error) {
      console.error('Error creating user role:', error);
      throw new Error('Failed to create user role');
    }
  }
  
  async updateUserRole(id, roleData) {
    try {
      const existingRole = await prisma.userRole.findUnique({
        where: { id }
      });
      
      if (!existingRole) {
        throw new Error(`User role not found with ID: ${id}`);
      }
      
      // Check if role is system role and prevent certain changes
      if (existingRole.isSystem) {
        if (roleData.name !== existingRole.name) {
          throw new Error('Cannot change the name of a system role');
        }
        
        if (roleData.isSystem === false) {
          throw new Error('Cannot change system status of a system role');
        }
      }
      
      // Check if another role with the same name exists
      if (roleData.name !== existingRole.name) {
        const duplicateRole = await prisma.userRole.findFirst({
          where: {
            name: roleData.name,
            id: { not: id }
          }
        });
        
        if (duplicateRole) {
          throw new Error(`User role with name '${roleData.name}' already exists`);
        }
      }
      
      const updatedRole = await prisma.userRole.update({
        where: { id },
        data: {
          name: roleData.name,
          description: roleData.description,
          isDefault: roleData.isDefault,
          permissions: roleData.permissions,
          moduleAccess: roleData.moduleAccess,
          dataAccess: roleData.dataAccess,
          updatedAt: new Date(),
          updatedBy: roleData.updatedBy
        }
      });
      
      return new UserRoleModel(updatedRole);
    } catch (error) {
      console.error(`Error updating user role with ID ${id}:`, error);
      throw new Error('Failed to update user role');
    }
  }
  
  async deleteUserRole(id) {
    try {
      const existingRole = await prisma.userRole.findUnique({
        where: { id },
        include: {
          users: {
            select: { id: true }
          }
        }
      });
      
      if (!existingRole) {
        throw new Error(`User role not found with ID: ${id}`);
      }
      
      // Check if role is system role
      if (existingRole.isSystem) {
        throw new Error('Cannot delete a system role');
      }
      
      // Check if role is assigned to any users
      if (existingRole.users && existingRole.users.length > 0) {
        throw new Error('Cannot delete a role that is assigned to users');
      }
      
      await prisma.userRole.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting user role with ID ${id}:`, error);
      throw new Error('Failed to delete user role');
    }
  }
  
  /**
   * Custom Field Management
   */
  async getCustomFields(entityType) {
    try {
      const whereClause = {};
      if (entityType) {
        whereClause.entityType = entityType;
      }
      
      const customFields = await prisma.customField.findMany({
        where: whereClause,
        orderBy: [
          { entityType: 'asc' },
          { displayOrder: 'asc' }
        ]
      });
      
      return customFields.map(field => new CustomFieldModel(field));
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      throw new Error('Failed to fetch custom fields');
    }
  }
  
  async getCustomFieldById(id) {
    try {
      const customField = await prisma.customField.findUnique({
        where: { id }
      });
      
      if (!customField) {
        throw new Error(`Custom field not found with ID: ${id}`);
      }
      
      return new CustomFieldModel(customField);
    } catch (error) {
      console.error(`Error fetching custom field with ID ${id}:`, error);
      throw new Error('Failed to fetch custom field');
    }
  }
  
  async createCustomField(fieldData) {
    try {
      // Check if field with same name already exists for the entity type
      const existingField = await prisma.customField.findFirst({
        where: {
          entityType: fieldData.entityType,
          name: fieldData.name
        }
      });
      
      if (existingField) {
        throw new Error(`Custom field with name '${fieldData.name}' already exists for entity type '${fieldData.entityType}'`);
      }
      
      const newField = await prisma.customField.create({
        data: {
          entityType: fieldData.entityType,
          name: fieldData.name,
          label: fieldData.label || fieldData.name,
          type: fieldData.type,
          description: fieldData.description,
          placeholder: fieldData.placeholder,
          defaultValue: fieldData.defaultValue,
          options: fieldData.options || [],
          validation: fieldData.validation || {
            required: false,
            min: null,
            max: null,
            pattern: null,
            customValidator: null
          },
          displayOrder: fieldData.displayOrder || 0,
          isActive: fieldData.isActive !== false,
          isSystem: fieldData.isSystem || false,
          isSearchable: fieldData.isSearchable || false,
          isFilterable: fieldData.isFilterable || false,
          showInList: fieldData.showInList || false,
          showInDetail: fieldData.showInDetail !== false,
          accessControl: fieldData.accessControl || {
            viewRoles: [],
            editRoles: []
          },
          createdBy: fieldData.createdBy,
          updatedBy: fieldData.createdBy
        }
      });
      
      return new CustomFieldModel(newField);
    } catch (error) {
      console.error('Error creating custom field:', error);
      throw new Error('Failed to create custom field');
    }
  }
  
  async updateCustomField(id, fieldData) {
    try {
      const existingField = await prisma.customField.findUnique({
        where: { id }
      });
      
      if (!existingField) {
        throw new Error(`Custom field not found with ID: ${id}`);
      }
      
      // Check if field is system field and prevent certain changes
      if (existingField.isSystem) {
        if (fieldData.name !== existingField.name) {
          throw new Error('Cannot change the name of a system field');
        }
        
        if (fieldData.entityType !== existingField.entityType) {
          throw new Error('Cannot change the entity type of a system field');
        }
        
        if (fieldData.type !== existingField.type) {
          throw new Error('Cannot change the type of a system field');
        }
        
        if (fieldData.isSystem === false) {
          throw new Error('Cannot change system status of a system field');
        }
      }
      
      // Check if another field with the same name exists for the entity type
      if (fieldData.name !== existingField.name || fieldData.entityType !== existingField.entityType) {
        const duplicateField = await prisma.customField.findFirst({
          where: {
            entityType: fieldData.entityType,
            name: fieldData.name,
            id: { not: id }
          }
        });
        
        if (duplicateField) {
          throw new Error(`Custom field with name '${fieldData.name}' already exists for entity type '${fieldData.entityType}'`);
        }
      }
      
      const updatedField = await prisma.customField.update({
        where: { id },
        data: {
          entityType: fieldData.entityType,
          name: fieldData.name,
          label: fieldData.label,
          type: fieldData.type,
          description: fieldData.description,
          placeholder: fieldData.placeholder,
          defaultValue: fieldData.defaultValue,
          options: fieldData.options,
          validation: fieldData.validation,
          displayOrder: fieldData.displayOrder,
          isActive: fieldData.isActive,
          isSearchable: fieldData.isSearchable,
          isFilterable: fieldData.isFilterable,
          showInList: fieldData.showInList,
          showInDetail: fieldData.showInDetail,
          accessControl: fieldData.accessControl,
          updatedAt: new Date(),
          updatedBy: fieldData.updatedBy
        }
      });
      
      return new CustomFieldModel(updatedField);
    } catch (error) {
      console.error(`Error updating custom field with ID ${id}:`, error);
      throw new Error('Failed to update custom field');
    }
  }
  
  async deleteCustomField(id) {
    try {
      const existingField = await prisma.customField.findUnique({
        where: { id }
      });
      
      if (!existingField) {
        throw new Error(`Custom field not found with ID: ${id}`);
      }
      
      // Check if field is system field
      if (existingField.isSystem) {
        throw new Error('Cannot delete a system field');
      }
      
      await prisma.customField.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting custom field with ID ${id}:`, error);
      throw new Error('Failed to delete custom field');
    }
  }
  
  /**
   * Workflow Management
   */
  async getWorkflows(entityType) {
    try {
      const whereClause = {};
      if (entityType) {
        whereClause.entityType = entityType;
      }
      
      const workflows = await prisma.workflow.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        include: {
          steps: {
            orderBy: { order: 'asc' }
          }
        }
      });
      
      return workflows.map(workflow => new WorkflowModel({
        ...workflow,
        steps: workflow.steps.map(step => new WorkflowStepModel(step))
      }));
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw new Error('Failed to fetch workflows');
    }
  }
  
  async getWorkflowById(id) {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id },
        include: {
          steps: {
            orderBy: { order: 'asc' }
          }
        }
      });
      
      if (!workflow) {
        throw new Error(`Workflow not found with ID: ${id}`);
      }
      
      return new WorkflowModel({
        ...workflow,
        steps: workflow.steps.map(step => new WorkflowStepModel(step))
      });
    } catch (error) {
      console.error(`Error fetching workflow with ID ${id}:`, error);
      throw new Error('Failed to fetch workflow');
    }
  }
  
  async createWorkflow(workflowData) {
    try {
      // Create workflow
      const newWorkflow = await prisma.workflow.create({
        data: {
          name: workflowData.name,
          description: workflowData.description,
          entityType: workflowData.entityType,
          triggerType: workflowData.triggerType,
          triggerConditions: workflowData.triggerConditions || {},
          isActive: workflowData.isActive !== false,
          createdBy: workflowData.createdBy,
          updatedBy: workflowData.createdBy
        }
      });
      
      // Create workflow steps if provided
      if (workflowData.steps && workflowData.steps.length > 0) {
        for (const stepData of workflowData.steps) {
          await prisma.workflowStep.create({
            data: {
              workflowId: newWorkflow.id,
              name: stepData.name,
              description: stepData.description,
              type: stepData.type,
              order: stepData.order,
              config: stepData.config || {},
              conditions: stepData.conditions || [],
              isActive: stepData.isActive !== false
            }
          });
        }
      }
      
      // Fetch the created workflow with steps
      return await this.getWorkflowById(newWorkflow.id);
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw new Error('Failed to create workflow');
    }
  }
  
  async updateWorkflow(id, workflowData) {
    try {
      const existingWorkflow = await prisma.workflow.findUnique({
        where: { id },
        include: {
          steps: true
        }
      });
      
      if (!existingWorkflow) {
        throw new Error(`Workflow not found with ID: ${id}`);
      }
      
      // Update workflow
      await prisma.workflow.update({
        where: { id },
        data: {
          name: workflowData.name,
          description: workflowData.description,
          entityType: workflowData.entityType,
          triggerType: workflowData.triggerType,
          triggerConditions: workflowData.triggerConditions,
          isActive: workflowData.isActive,
          updatedAt: new Date(),
          updatedBy: workflowData.updatedBy
        }
      });
      
      // Update workflow steps
      if (workflowData.steps && workflowData.steps.length > 0) {
        // Get existing step IDs
        const existingStepIds = existingWorkflow.steps.map(step => step.id);
        const updatedStepIds = workflowData.steps
          .filter(step => step.id)
          .map(step => step.id);
        
        // Delete steps that are no longer in the updated workflow
        const stepsToDelete = existingStepIds.filter(id => !updatedStepIds.includes(id));
        if (stepsToDelete.length > 0) {
          await prisma.workflowStep.deleteMany({
            where: {
              id: { in: stepsToDelete }
            }
          });
        }
        
        // Update or create steps
        for (const stepData of workflowData.steps) {
          if (stepData.id) {
            // Update existing step
            await prisma.workflowStep.update({
              where: { id: stepData.id },
              data: {
                name: stepData.name,
                description: stepData.description,
                type: stepData.type,
                order: stepData.order,
                config: stepData.config,
                conditions: stepData.conditions,
                isActive: stepData.isActive,
                updatedAt: new Date()
              }
            });
          } else {
            // Create new step
            await prisma.workflowStep.create({
              data: {
                workflowId: id,
                name: stepData.name,
                description: stepData.description,
                type: stepData.type,
                order: stepData.order,
                config: stepData.config || {},
                conditions: stepData.conditions || [],
                isActive: stepData.isActive !== false
              }
            });
          }
        }
      } else {
        // Delete all steps if none provided
        await prisma.workflowStep.deleteMany({
          where: {
            workflowId: id
          }
        });
      }
      
      // Fetch the updated workflow with steps
      return await this.getWorkflowById(id);
    } catch (error) {
      console.error(`Error updating workflow with ID ${id}:`, error);
      throw new Error('Failed to update workflow');
    }
  }
  
  async deleteWorkflow(id) {
    try {
      const existingWorkflow = await prisma.workflow.findUnique({
        where: { id }
      });
      
      if (!existingWorkflow) {
        throw new Error(`Workflow not found with ID: ${id}`);
      }
      
      // Delete workflow steps first
      await prisma.workflowStep.deleteMany({
        where: {
          workflowId: id
        }
      });
      
      // Delete workflow
      await prisma.workflow.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting workflow with ID ${id}:`, error);
      throw new Error('Failed to delete workflow');
    }
  }
  
  /**
   * Notification Template Management
   */
  async getNotificationTemplates(type) {
    try {
      const whereClause = {};
      if (type) {
        whereClause.type = type;
      }
      
      const templates = await prisma.notificationTemplate.findMany({
        where: whereClause,
        orderBy: { name: 'asc' }
      });
      
      return templates.map(template => new NotificationTemplateModel(template));
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      throw new Error('Failed to fetch notification templates');
    }
  }
  
  async getNotificationTemplateById(id) {
    try {
      const template = await prisma.notificationTemplate.findUnique({
        where: { id }
      });
      
      if (!template) {
        throw new Error(`Notification template not found with ID: ${id}`);
      }
      
      return new NotificationTemplateModel(template);
    } catch (error) {
      console.error(`Error fetching notification template with ID ${id}:`, error);
      throw new Error('Failed to fetch notification template');
    }
  }
  
  async createNotificationTemplate(templateData) {
    try {
      // Check if template with same name already exists
      const existingTemplate = await prisma.notificationTemplate.findFirst({
        where: { name: templateData.name }
      });
      
      if (existingTemplate) {
        throw new Error(`Notification template with name '${templateData.name}' already exists`);
      }
      
      const newTemplate = await prisma.notificationTemplate.create({
        data: {
          name: templateData.name,
          description: templateData.description,
          type: templateData.type,
          subject: templateData.subject,
          content: templateData.content,
          variables: templateData.variables || [],
          isSystem: templateData.isSystem || false,
          isActive: templateData.isActive !== false,
          createdBy: templateData.createdBy,
          updatedBy: templateData.createdBy
        }
      });
      
      return new NotificationTemplateModel(newTemplate);
    } catch (error) {
      console.error('Error creating notification template:', error);
      throw new Error('Failed to create notification template');
    }
  }
  
  async updateNotificationTemplate(id, templateData) {
    try {
      const existingTemplate = await prisma.notificationTemplate.findUnique({
        where: { id }
      });
      
      if (!existingTemplate) {
        throw new Error(`Notification template not found with ID: ${id}`);
      }
      
      // Check if template is system template and prevent certain changes
      if (existingTemplate.isSystem) {
        if (templateData.isSystem === false) {
          throw new Error('Cannot change system status of a system template');
        }
      }
      
      // Check if another template with the same name exists
      if (templateData.name !== existingTemplate.name) {
        const duplicateTemplate = await prisma.notificationTemplate.findFirst({
          where: {
            name: templateData.name,
            id: { not: id }
          }
        });
        
        if (duplicateTemplate) {
          throw new Error(`Notification template with name '${templateData.name}' already exists`);
        }
      }
      
      const updatedTemplate = await prisma.notificationTemplate.update({
        where: { id },
        data: {
          name: templateData.name,
          description: templateData.description,
          type: templateData.type,
          subject: templateData.subject,
          content: templateData.content,
          variables: templateData.variables,
          isActive: templateData.isActive,
          updatedAt: new Date(),
          updatedBy: templateData.updatedBy
        }
      });
      
      return new NotificationTemplateModel(updatedTemplate);
    } catch (error) {
      console.error(`Error updating notification template with ID ${id}:`, error);
      throw new Error('Failed to update notification template');
    }
  }
  
  async deleteNotificationTemplate(id) {
    try {
      const existingTemplate = await prisma.notificationTemplate.findUnique({
        where: { id }
      });
      
      if (!existingTemplate) {
        throw new Error(`Notification template not found with ID: ${id}`);
      }
      
      // Check if template is system template
      if (existingTemplate.isSystem) {
        throw new Error('Cannot delete a system template');
      }
      
      await prisma.notificationTemplate.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting notification template with ID ${id}:`, error);
      throw new Error('Failed to delete notification template');
    }
  }
  
  /**
   * Integration Management
   */
  async getIntegrations() {
    try {
      const integrations = await prisma.integration.findMany({
        orderBy: { name: 'asc' }
      });
      
      return integrations.map(integration => new IntegrationModel(integration));
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw new Error('Failed to fetch integrations');
    }
  }
  
  async getIntegrationById(id) {
    try {
      const integration = await prisma.integration.findUnique({
        where: { id }
      });
      
      if (!integration) {
        throw new Error(`Integration not found with ID: ${id}`);
      }
      
      return new IntegrationModel(integration);
    } catch (error) {
      console.error(`Error fetching integration with ID ${id}:`, error);
      throw new Error('Failed to fetch integration');
    }
  }
  
  async createIntegration(integrationData) {
    try {
      // Check if integration with same name already exists
      const existingIntegration = await prisma.integration.findFirst({
        where: { name: integrationData.name }
      });
      
      if (existingIntegration) {
        throw new Error(`Integration with name '${integrationData.name}' already exists`);
      }
      
      const newIntegration = await prisma.integration.create({
        data: {
          name: integrationData.name,
          description: integrationData.description,
          type: integrationData.type,
          provider: integrationData.provider,
          isEnabled: integrationData.isEnabled || false,
          config: integrationData.config || {},
          credentials: integrationData.credentials || {},
          syncSettings: integrationData.syncSettings || {
            direction: 'BIDIRECTIONAL',
            frequency: 'DAILY',
            entities: []
          },
          lastSyncAt: integrationData.lastSyncAt,
          lastSyncStatus: integrationData.lastSyncStatus,
          createdBy: integrationData.createdBy,
          updatedBy: integrationData.createdBy
        }
      });
      
      return new IntegrationModel(newIntegration);
    } catch (error) {
      console.error('Error creating integration:', error);
      throw new Error('Failed to create integration');
    }
  }
  
  async updateIntegration(id, integrationData) {
    try {
      const existingIntegration = await prisma.integration.findUnique({
        where: { id }
      });
      
      if (!existingIntegration) {
        throw new Error(`Integration not found with ID: ${id}`);
      }
      
      // Check if another integration with the same name exists
      if (integrationData.name !== existingIntegration.name) {
        const duplicateIntegration = await prisma.integration.findFirst({
          where: {
            name: integrationData.name,
            id: { not: id }
          }
        });
        
        if (duplicateIntegration) {
          throw new Error(`Integration with name '${integrationData.name}' already exists`);
        }
      }
      
      const updatedIntegration = await prisma.integration.update({
        where: { id },
        data: {
          name: integrationData.name,
          description: integrationData.description,
          type: integrationData.type,
          provider: integrationData.provider,
          isEnabled: integrationData.isEnabled,
          config: integrationData.config,
          credentials: integrationData.credentials,
          syncSettings: integrationData.syncSettings,
          lastSyncAt: integrationData.lastSyncAt,
          lastSyncStatus: integrationData.lastSyncStatus,
          updatedAt: new Date(),
          updatedBy: integrationData.updatedBy
        }
      });
      
      return new IntegrationModel(updatedIntegration);
    } catch (error) {
      console.error(`Error updating integration with ID ${id}:`, error);
      throw new Error('Failed to update integration');
    }
  }
  
  async deleteIntegration(id) {
    try {
      const existingIntegration = await prisma.integration.findUnique({
        where: { id }
      });
      
      if (!existingIntegration) {
        throw new Error(`Integration not found with ID: ${id}`);
      }
      
      await prisma.integration.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting integration with ID ${id}:`, error);
      throw new Error('Failed to delete integration');
    }
  }
  
  /**
   * Audit Log Management
   */
  async getAuditLogs(filters = {}) {
    try {
      const { userId, action, entityType, entityId, fromDate, toDate, limit } = filters;
      
      const whereClause = {};
      if (userId) whereClause.userId = userId;
      if (action) whereClause.action = action;
      if (entityType) whereClause.entityType = entityType;
      if (entityId) whereClause.entityId = entityId;
      
      if (fromDate && toDate) {
        whereClause.timestamp = {
          gte: new Date(fromDate),
          lte: new Date(toDate)
        };
      } else if (fromDate) {
        whereClause.timestamp = {
          gte: new Date(fromDate)
        };
      } else if (toDate) {
        whereClause.timestamp = {
          lte: new Date(toDate)
        };
      }
      
      const auditLogs = await prisma.auditLog.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        take: limit || 100
      });
      
      return auditLogs.map(log => new AuditLogModel(log));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }
  
  async createAuditLog(logData) {
    try {
      const newLog = await prisma.auditLog.create({
        data: {
          userId: logData.userId,
          userName: logData.userName,
          action: logData.action,
          entityType: logData.entityType,
          entityId: logData.entityId,
          entityName: logData.entityName,
          details: logData.details || {},
          ipAddress: logData.ipAddress,
          userAgent: logData.userAgent,
          timestamp: new Date()
        }
      });
      
      return new AuditLogModel(newLog);
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw error for audit logs to prevent disrupting main operations
      console.warn('Failed to create audit log, continuing operation');
      return null;
    }
  }
  
  /**
   * System Health
   */
  async getSystemHealth() {
    try {
      // Get system uptime
      const startTime = process.uptime();
      const uptime = Math.floor(startTime);
      
      // Get active user count
      const activeUserCount = await prisma.session.count({
        where: {
          expires: {
            gt: new Date()
          }
        }
      });
      
      // Get database stats
      const dbStats = {
        users: await prisma.user.count(),
        jobs: await prisma.job.count(),
        pieces: await prisma.piece.count(),
        contacts: await prisma.contact.count(),
        companies: await prisma.company.count()
      };
      
      // Check component status
      const components = [
        {
          name: 'Database',
          status: 'HEALTHY',
          details: 'Connected and operational'
        },
        {
          name: 'File Storage',
          status: 'HEALTHY',
          details: 'Operational'
        },
        {
          name: 'Authentication',
          status: 'HEALTHY',
          details: 'Operational'
        },
        {
          name: 'Email Service',
          status: 'HEALTHY',
          details: 'Operational'
        }
      ];
      
      // Get system metrics
      const metrics = {
        cpu: 0.25, // Placeholder, would be replaced with actual monitoring
        memory: 0.40, // Placeholder, would be replaced with actual monitoring
        storage: 0.30, // Placeholder, would be replaced with actual monitoring
        activeUsers: activeUserCount,
        requestsPerMinute: 120 // Placeholder, would be replaced with actual monitoring
      };
      
      // Check for any alerts
      const alerts = [];
      
      // Get maintenance schedule
      const maintenanceSchedule = [];
      
      return new SystemHealthModel({
        status: 'HEALTHY',
        uptime,
        lastChecked: new Date().toISOString(),
        components,
        metrics,
        alerts,
        maintenanceSchedule
      });
    } catch (error) {
      console.error('Error fetching system health:', error);
      
      return new SystemHealthModel({
        status: 'DEGRADED',
        uptime: 0,
        lastChecked: new Date().toISOString(),
        components: [
          {
            name: 'System',
            status: 'DEGRADED',
            details: 'Error fetching system health information'
          }
        ],
        metrics: {
          cpu: 0,
          memory: 0,
          storage: 0,
          activeUsers: 0,
          requestsPerMinute: 0
        },
        alerts: [
          {
            level: 'ERROR',
            message: 'Failed to fetch system health information',
            timestamp: new Date().toISOString()
          }
        ],
        maintenanceSchedule: []
      });
    }
  }
}

export default new ConfigurationService();
