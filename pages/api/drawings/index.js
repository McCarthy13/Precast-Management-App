import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/drawings - Get all drawings
  if (req.method === 'GET') {
    try {
      const drawings = await prisma.drawing.findMany({
        include: {
          project: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      
      return res.status(200).json(drawings);
    } catch (error) {
      console.error('Error fetching drawings:', error);
      return res.status(500).json({ error: 'Failed to fetch drawings' });
    }
  }
  
  // POST /api/drawings - Create a new drawing
  else if (req.method === 'POST') {
    const { name, description, fileUrl, version, status, projectId } = req.body;
    
    if (!name || !fileUrl || !version || !status || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const drawing = await prisma.drawing.create({
        data: {
          name,
          description,
          fileUrl,
          version,
          status,
          project: {
            connect: { id: projectId },
          },
          user: {
            connect: { id: session.user.id },
          },
        },
      });
      
      return res.status(201).json(drawing);
    } catch (error) {
      console.error('Error creating drawing:', error);
      return res.status(500).json({ error: 'Failed to create drawing' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
