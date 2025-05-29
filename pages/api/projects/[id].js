import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/projects/[id] - Get a specific project
  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          estimates: true,
          drawings: true,
          productionSchedules: true,
          dispatchOrders: true,
          fieldOperations: true,
          materials: true,
        },
      });
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      return res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
  }
  
  // PUT /api/projects/[id] - Update a project
  else if (req.method === 'PUT') {
    const { name, description, status, startDate, endDate, clientId } = req.body;
    
    if (!name || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const project = await prisma.project.update({
        where: { id },
        data: {
          name,
          description,
          status,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          clientId,
        },
      });
      
      return res.status(200).json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Failed to update project' });
    }
  }
  
  // DELETE /api/projects/[id] - Delete a project
  else if (req.method === 'DELETE') {
    try {
      await prisma.project.delete({
        where: { id },
      });
      
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
