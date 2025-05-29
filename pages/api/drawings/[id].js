import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/drawings/[id] - Get a specific drawing
  if (req.method === 'GET') {
    try {
      const drawing = await prisma.drawing.findUnique({
        where: { id },
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
      });
      
      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found' });
      }
      
      return res.status(200).json(drawing);
    } catch (error) {
      console.error('Error fetching drawing:', error);
      return res.status(500).json({ error: 'Failed to fetch drawing' });
    }
  }
  
  // PUT /api/drawings/[id] - Update a drawing
  else if (req.method === 'PUT') {
    const { name, description, fileUrl, version, status, projectId } = req.body;
    
    if (!name || !version || !status || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const drawing = await prisma.drawing.update({
        where: { id },
        data: {
          name,
          description,
          fileUrl: fileUrl || undefined,
          version,
          status,
          project: {
            connect: { id: projectId },
          },
        },
      });
      
      return res.status(200).json(drawing);
    } catch (error) {
      console.error('Error updating drawing:', error);
      return res.status(500).json({ error: 'Failed to update drawing' });
    }
  }
  
  // DELETE /api/drawings/[id] - Delete a drawing
  else if (req.method === 'DELETE') {
    try {
      await prisma.drawing.delete({
        where: { id },
      });
      
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting drawing:', error);
      return res.status(500).json({ error: 'Failed to delete drawing' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
