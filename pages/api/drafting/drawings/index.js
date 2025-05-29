// API route for managing drawings
import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getDrawings(req, res, session);
    case 'POST':
      return createDrawing(req, res, session);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * Get drawings with optional filters
 */
async function getDrawings(req, res, session) {
  try {
    const { projectId, status, type } = req.query;
    
    // Build filter conditions
    const where = {};
    
    if (projectId) {
      where.projectId = projectId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    // Get drawings from database
    const drawings = await prisma.drawing.findMany({
      where,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        revisions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
    
    return res.status(200).json(drawings);
  } catch (error) {
    console.error('Error fetching drawings:', error);
    return res.status(500).json({ error: 'Failed to fetch drawings' });
  }
}

/**
 * Create a new drawing
 */
async function createDrawing(req, res, session) {
  try {
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
      thumbnailUrl
    } = req.body;
    
    // Validate required fields
    if (!title || !number || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create drawing in database
    const drawing = await prisma.drawing.create({
      data: {
        title,
        number,
        revision: revision || '0',
        type,
        format,
        status: status || 'Draft',
        projectId,
        projectName,
        description,
        tags: tags || [],
        fileUrl,
        thumbnailUrl,
        createdBy: session.user.id,
        revisionHistory: [],
        linkedElements: []
      }
    });
    
    // Create initial revision
    await prisma.drawingRevision.create({
      data: {
        drawingId: drawing.id,
        revisionNumber: revision || '0',
        description: 'Initial revision',
        fileUrl,
        thumbnailUrl,
        createdBy: session.user.id,
        status: status || 'Draft'
      }
    });
    
    return res.status(201).json(drawing);
  } catch (error) {
    console.error('Error creating drawing:', error);
    return res.status(500).json({ error: 'Failed to create drawing' });
  }
}
