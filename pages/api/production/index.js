import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/production - Get all production records
  if (req.method === 'GET') {
    try {
      // In a real implementation, we would have a Production model
      // For now, we'll return a mock response
      const mockProductionRecords = [
        {
          id: '1',
          name: 'Wall Panel WP-101',
          projectName: 'Commercial Building Alpha',
          status: 'In Production',
          startDate: '2025-05-15',
          completionDate: '2025-05-18',
          assignedTo: 'Production Team A',
          priority: 'High',
          notes: 'Special finish required, see drawing notes'
        },
        {
          id: '2',
          name: 'Column C-203',
          projectName: 'Highway Bridge Expansion',
          status: 'Scheduled',
          startDate: '2025-05-19',
          completionDate: '2025-05-21',
          assignedTo: 'Production Team B',
          priority: 'Medium',
          notes: 'Standard reinforcement pattern'
        },
        {
          id: '3',
          name: 'Beam B-305',
          projectName: 'Commercial Building Alpha',
          status: 'Completed',
          startDate: '2025-05-10',
          completionDate: '2025-05-12',
          assignedTo: 'Production Team A',
          priority: 'High',
          notes: 'Completed ahead of schedule'
        },
        {
          id: '4',
          name: 'Tank Wall TW-405',
          projectName: 'Municipal Water Treatment',
          status: 'Quality Check',
          startDate: '2025-05-14',
          completionDate: '2025-05-16',
          assignedTo: 'Production Team C',
          priority: 'High',
          notes: 'Waiting for QC approval'
        },
        {
          id: '5',
          name: 'Stair S-506',
          projectName: 'Residential Complex',
          status: 'On Hold',
          startDate: '2025-05-20',
          completionDate: '2025-05-22',
          assignedTo: 'Production Team B',
          priority: 'Low',
          notes: 'Waiting for drawing revision approval'
        }
      ];
      
      return res.status(200).json(mockProductionRecords);
    } catch (error) {
      console.error('Error fetching production records:', error);
      return res.status(500).json({ error: 'Failed to fetch production records' });
    }
  }
  
  // POST /api/production - Create a new production record
  else if (req.method === 'POST') {
    const { name, projectId, projectName, status, startDate, completionDate, assignedTo, priority, notes } = req.body;
    
    if (!name || !projectId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      // In a real implementation, we would create a record in the database
      // For now, we'll return a mock response
      const newProductionRecord = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        projectName,
        status,
        startDate,
        completionDate,
        assignedTo,
        priority: priority || 'Medium',
        notes
      };
      
      return res.status(201).json(newProductionRecord);
    } catch (error) {
      console.error('Error creating production record:', error);
      return res.status(500).json({ error: 'Failed to create production record' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
