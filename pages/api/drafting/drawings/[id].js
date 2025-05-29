// API route for managing specific drawing
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get drawing ID from URL
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Drawing ID is required' });
  }
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getDrawing(req, res, session, id);
    case 'PUT':
      return updateDrawing(req, res, session, id);
    case 'DELETE':
      return deleteDrawing(req, res, session, id);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * Get a specific drawing by ID
 */
async function getDrawing(req, res, session, id) {
  try {
    // Get drawing from database with latest revision
    const drawing = await prisma.drawing.findUnique({
      where: { id },
      include: {
        revisions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
    
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    
    // Increment view count
    await prisma.drawing.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
    
    return res.status(200).json(drawing);
  } catch (error) {
    console.error(`Error fetching drawing ${id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch drawing' });
  }
}

/**
 * Update a drawing
 */
async function updateDrawing(req, res, session, id) {
  try {
    // Check if drawing exists
    const existingDrawing = await prisma.drawing.findUnique({
      where: { id }
    });
    
    if (!existingDrawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    
    const {
      title,
      number,
      revision,
      type,
      format,
      status,
      projectId,
      projectName,
      description,
      tags,
      fileUrl,
      thumbnailUrl,
      approvedBy,
      approvalDate,
      releasedBy,
      releaseDate
    } = req.body;
    
    // Create a new revision if revision number changed
    if (revision && revision !== existingDrawing.revision) {
      await prisma.drawingRevision.create({
        data: {
          drawingId: id,
          revisionNumber: revision,
          description: req.body.revisionDescription || `Updated to revision ${revision}`,
          fileUrl: fileUrl || existingDrawing.fileUrl,
          thumbnailUrl: thumbnailUrl || existingDrawing.thumbnailUrl,
          createdBy: session.user.id,
          status: status || existingDrawing.status
        }
      });
      
      // Update revision history
      const revisionHistory = [
        ...(existingDrawing.revisionHistory || []),
        {
          revision: existingDrawing.revision,
          date: new Date().toISOString(),
          by: session.user.id
        }
      ];
      
      // Update drawing in database
      const updatedDrawing = await prisma.drawing.update({
        where: { id },
        data: {
          title: title || existingDrawing.title,
          number: number || existingDrawing.number,
          revision,
          type: type || existingDrawing.type,
          format: format || existingDrawing.format,
          status: status || existingDrawing.status,
          projectId: projectId || existingDrawing.projectId,
          projectName: projectName || existingDrawing.projectName,
          description: description !== undefined ? description : existingDrawing.description,
          tags: tags || existingDrawing.tags,
          fileUrl: fileUrl || existingDrawing.fileUrl,
          thumbnailUrl: thumbnailUrl || existingDrawing.thumbnailUrl,
          approvedBy: approvedBy || existingDrawing.approvedBy,
          approvalDate: approvalDate || existingDrawing.approvalDate,
          releasedBy: releasedBy || existingDrawing.releasedBy,
          releaseDate: releaseDate || existingDrawing.releaseDate,
          revisionHistory,
          updatedAt: new Date()
        }
      });
      
      return res.status(200).json(updatedDrawing);
    } else {
      // Simple update without new revision
      const updatedDrawing = await prisma.drawing.update({
        where: { id },
        data: {
          title: title || existingDrawing.title,
          number: number || existingDrawing.number,
          type: type || existingDrawing.type,
          format: format || existingDrawing.format,
          status: status || existingDrawing.status,
          projectId: projectId || existingDrawing.projectId,
          projectName: projectName || existingDrawing.projectName,
          description: description !== undefined ? description : existingDrawing.description,
          tags: tags || existingDrawing.tags,
          fileUrl: fileUrl || existingDrawing.fileUrl,
          thumbnailUrl: thumbnailUrl || existingDrawing.thumbnailUrl,
          approvedBy: approvedBy || existingDrawing.approvedBy,
          approvalDate: approvalDate || existingDrawing.approvalDate,
          releasedBy: releasedBy || existingDrawing.releasedBy,
          releaseDate: releaseDate || existingDrawing.releaseDate,
          updatedAt: new Date()
        }
      });
      
      return res.status(200).json(updatedDrawing);
    }
  } catch (error) {
    console.error(`Error updating drawing ${id}:`, error);
    return res.status(500).json({ error: 'Failed to update drawing' });
  }
}

/**
 * Delete a drawing
 */
async function deleteDrawing(req, res, session, id) {
  try {
    // Check if drawing exists
    const existingDrawing = await prisma.drawing.findUnique({
      where: { id }
    });
    
    if (!existingDrawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    
    // Delete related entities first
    await prisma.drawingRevision.deleteMany({
      where: { drawingId: id }
    });
    
    await prisma.drawingMarkup.deleteMany({
      where: { drawingId: id }
    });
    
    await prisma.drawingComment.deleteMany({
      where: { drawingId: id }
    });
    
    await prisma.drawingRelease.deleteMany({
      where: { drawingId: id }
    });
    
    await prisma.drawingElement.deleteMany({
      where: { drawingId: id }
    });
    
    await prisma.drawingWorkflow.deleteMany({
      where: { drawingId: id }
    });
    
    // Delete the drawing
    await prisma.drawing.delete({
      where: { id }
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error deleting drawing ${id}:`, error);
    return res.status(500).json({ error: 'Failed to delete drawing' });
  }
}
