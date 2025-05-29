import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/schedules - Get all schedules
  if (req.method === 'GET') {
    try {
      const schedules = await prisma.productionSchedule.findMany({
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
          startDate: 'asc',
        },
      });
      
      return res.status(200).json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  }
  
  // POST /api/schedules - Create a new schedule
  else if (req.method === 'POST') {
    const { name, description, startDate, endDate, status, projectId } = req.body;
    
    if (!name || !status || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const schedule = await prisma.productionSchedule.create({
        data: {
          name,
          description,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status,
          project: {
            connect: { id: projectId },
          },
          user: {
            connect: { id: session.user.id },
          },
        },
      });
      
      return res.status(201).json(schedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      return res.status(500).json({ error: 'Failed to create schedule' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
