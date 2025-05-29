import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/quality - Get all quality control records
  if (req.method === 'GET') {
    try {
      // In a real implementation, we would have a QualityControl model
      // For now, we'll return a mock response
      const mockQualityRecords = [
        {
          id: '1',
          name: 'Concrete Strength Test',
          description: 'Testing compressive strength of concrete samples',
          status: 'Passed',
          date: '2025-05-15',
          projectId: 'p1',
          projectName: 'Commercial Building Alpha',
          inspector: 'John Inspector',
          results: '4500 PSI - Within acceptable range',
          notes: 'All samples met or exceeded requirements'
        },
        {
          id: '2',
          name: 'Dimensional Inspection',
          description: 'Verifying dimensions of precast panels',
          status: 'Failed',
          date: '2025-05-16',
          projectId: 'p2',
          projectName: 'Highway Bridge Expansion',
          inspector: 'Sarah Inspector',
          results: 'Panel width out of tolerance by 5mm',
          notes: 'Rework required before shipping'
        },
        {
          id: '3',
          name: 'Surface Finish Inspection',
          description: 'Checking surface quality of architectural panels',
          status: 'Passed',
          date: '2025-05-17',
          projectId: 'p1',
          projectName: 'Commercial Building Alpha',
          inspector: 'John Inspector',
          results: 'Surface finish meets specifications',
          notes: 'Minor cosmetic issues addressed during inspection'
        }
      ];
      
      return res.status(200).json(mockQualityRecords);
    } catch (error) {
      console.error('Error fetching quality records:', error);
      return res.status(500).json({ error: 'Failed to fetch quality records' });
    }
  }
  
  // POST /api/quality - Create a new quality control record
  else if (req.method === 'POST') {
    const { name, description, status, projectId, results, notes } = req.body;
    
    if (!name || !status || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      // In a real implementation, we would create a record in the database
      // For now, we'll return a mock response
      const newQualityRecord = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        description,
        status,
        date: new Date().toISOString().split('T')[0],
        projectId,
        projectName: 'Project Name Would Be Looked Up',
        inspector: session.user.name || 'Unknown Inspector',
        results,
        notes
      };
      
      return res.status(201).json(newQualityRecord);
    } catch (error) {
      console.error('Error creating quality record:', error);
      return res.status(500).json({ error: 'Failed to create quality record' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
