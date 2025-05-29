import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/schedules/[id] - Get a specific schedule
  if (req.method === 'GET') {
    try {
      const schedule = await prisma.productionSchedule.findUnique({
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
      
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      
      return res.status(200).json(schedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  }
  
  // PUT /api/schedules/[id] - Update a schedule
  else if (req.method === 'PUT') {
    const { name, description, startDate, endDate, status, projectId } = req.body;
    
    if (!name || !status || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const schedule = await prisma.productionSchedule.update({
        where: { id },
        data: {
          name,
          description,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status,
          project: {
            connect: { id: projectId },
          },
        },
      });
      
      return res.status(200).json(schedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      return res.status(500).json({ error: 'Failed to update schedule' });
    }
  }
  
  // DELETE /api/schedules/[id] - Delete a schedule
  else if (req.method === 'DELETE') {
    try {
      await prisma.productionSchedule.delete({
        where: { id },
      });
      
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return res.status(500).json({ error: 'Failed to delete schedule' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
