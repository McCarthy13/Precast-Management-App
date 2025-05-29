/**
 * API routes for the Drafting/Engineering Module
 * This file defines the RESTful API endpoints for the Drafting/Engineering Module
 */

const express = require('express');
const router = express.Router();

// Import services
const DrawingService = require('../services/DrawingService');
const DocumentService = require('../services/DocumentService');
const CADIntegrationService = require('../services/CADIntegrationService');
const WorkflowService = require('../services/WorkflowService');

// Initialize services
const drawingService = new DrawingService();
const documentService = new DocumentService();
const cadIntegrationService = new CADIntegrationService();
const workflowService = new WorkflowService();

// Middleware to handle errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Drawing Routes
 */

// Get all drawings for a project
router.get('/projects/:projectId/drawings', asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const drawings = await drawingService.getDrawingsByProject(projectId);
  res.json(drawings);
}));

// Get a specific drawing
router.get('/drawings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const drawing = await drawingService.getDrawingById(id);
  
  if (!drawing) {
    return res.status(404).json({ error: 'Drawing not found' });
  }
  
  res.json(drawing);
}));

// Create a new drawing
router.post('/drawings', asyncHandler(async (req, res) => {
  const drawingData = req.body;
  const drawing = await drawingService.createDrawing(drawingData);
  res.status(201).json(drawing);
}));

// Update a drawing
router.put('/drawings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const drawing = await drawingService.updateDrawing(id, updateData);
  
  if (!drawing) {
    return res.status(404).json({ error: 'Drawing not found' });
  }
  
  res.json(drawing);
}));

// Delete a drawing
router.delete('/drawings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const success = await drawingService.deleteDrawing(id);
  
  if (!success) {
    return res.status(404).json({ error: 'Drawing not found' });
  }
  
  res.status(204).end();
}));

/**
 * Revision Routes
 */

// Get all revisions for a drawing
router.get('/drawings/:drawingId/revisions', asyncHandler(async (req, res) => {
  const { drawingId } = req.params;
  const revisions = await drawingService.getRevisionsByDrawing(drawingId);
  res.json(revisions);
}));

// Create a new revision
router.post('/drawings/:drawingId/revisions', asyncHandler(async (req, res) => {
  const { drawingId } = req.params;
  const revisionData = req.body;
  const revision = await drawingService.createRevision(drawingId, revisionData);
  res.status(201).json(revision);
}));

/**
 * Markup Routes
 */

// Get all markups for a drawing
router.get('/drawings/:drawingId/markups', asyncHandler(async (req, res) => {
  const { drawingId } = req.params;
  const markups = await drawingService.getMarkupsByDrawing(drawingId);
  res.json(markups);
}));

// Add a markup to a drawing
router.post('/drawings/:drawingId/markups', asyncHandler(async (req, res) => {
  const { drawingId } = req.params;
  const markupData = req.body;
  const markup = await drawingService.addMarkup(drawingId, markupData);
  res.status(201).json(markup);
}));

/**
 * Document Routes
 */

// Get all documents for a project
router.get('/projects/:projectId/documents', asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const documents = await documentService.getDocumentsByProject(projectId);
  res.json(documents);
}));

// Upload a new document
router.post('/documents', asyncHandler(async (req, res) => {
  const documentData = req.body;
  const document = await documentService.uploadDocument(documentData);
  res.status(201).json(document);
}));

// Get a specific document
router.get('/documents/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const document = await documentService.getDocumentById(id);
  
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.json(document);
}));

// Update document metadata
router.put('/documents/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const document = await documentService.updateDocument(id, updateData);
  
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.json(document);
}));

// Delete a document
router.delete('/documents/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const success = await documentService.deleteDocument(id);
  
  if (!success) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.status(204).end();
}));

/**
 * CAD Integration Routes
 */

// Import from CAD file
router.post('/cad/import', asyncHandler(async (req, res) => {
  const { filePath, options } = req.body;
  const importedData = await cadIntegrationService.importFromCAD(filePath, options);
  res.json(importedData);
}));

// Export to CAD format
router.post('/cad/export', asyncHandler(async (req, res) => {
  const { data, format, options } = req.body;
  const exportedFilePath = await cadIntegrationService.exportToCAD(data, format, options);
  res.json({ filePath: exportedFilePath });
}));

// Synchronize with external CAD system
router.post('/cad/sync', asyncHandler(async (req, res) => {
  const { systemName, connectionParams, elements } = req.body;
  const syncResult = await cadIntegrationService.synchronizeWithCAD(systemName, connectionParams, elements);
  res.json(syncResult);
}));

// Extract bill of materials
router.post('/cad/bom', asyncHandler(async (req, res) => {
  const { cadData } = req.body;
  const bomItems = await cadIntegrationService.extractBillOfMaterials(cadData);
  res.json(bomItems);
}));

/**
 * Workflow Routes
 */

// Get all workflows for a project
router.get('/projects/:projectId/workflows', asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const workflows = await workflowService.getWorkflowsByProject(projectId);
  res.json(workflows);
}));

// Create a new workflow
router.post('/workflows', asyncHandler(async (req, res) => {
  const workflowData = req.body;
  const workflow = await workflowService.createWorkflow(workflowData);
  res.status(201).json(workflow);
}));

// Get a specific workflow
router.get('/workflows/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workflow = await workflowService.getWorkflowById(id);
  
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  res.json(workflow);
}));

// Advance a workflow to the next step
router.post('/workflows/:id/advance', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stepData = req.body;
  const workflow = await workflowService.advanceWorkflow(id, stepData);
  res.json(workflow);
}));

// Assign a workflow step to a user
router.post('/workflows/:id/steps/:stepId/assign', asyncHandler(async (req, res) => {
  const { id, stepId } = req.params;
  const { userId } = req.body;
  const workflow = await workflowService.assignWorkflowStep(id, stepId, userId);
  res.json(workflow);
}));

module.exports = router;
