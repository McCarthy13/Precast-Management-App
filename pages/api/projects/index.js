import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/projects - Get all projects
  if (req.method === 'GET') {
    try {
      const projects = await prisma.project.findMany({
        include: {
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
      
      return res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }
  
  // POST /api/projects - Create a new project
  else if (req.method === 'POST') {
    const { name, description, status, startDate, endDate, clientId } = req.body;
    
    if (!name || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const project = await prisma.project.create({
        data: {
          name,
          description,
          status,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          clientId,
          user: {
            connect: { id: session.user.id },
          },
        },
      });
      
      return res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
