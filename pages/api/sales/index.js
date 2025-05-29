import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET /api/sales - Get all sales/estimates
  if (req.method === 'GET') {
    try {
      // In a real implementation, we would have a Sales/Estimates model
      // For now, we'll return a mock response
      const mockSalesRecords = [
        {
          id: '1',
          name: 'Commercial Office Building',
          clientName: 'ABC Construction',
          status: 'Pending',
          totalAmount: 450000,
          createdDate: '2025-05-10',
          dueDate: '2025-05-25',
          assignedTo: 'John Sales',
          probability: 75,
          notes: 'Client requested detailed breakdown of material costs'
        },
        {
          id: '2',
          name: 'Highway Bridge Expansion',
          clientName: 'State DOT',
          status: 'Approved',
          totalAmount: 1250000,
          createdDate: '2025-05-05',
          dueDate: '2025-05-15',
          assignedTo: 'Sarah Sales',
          probability: 100,
          notes: 'Approved by client, ready for project setup'
        },
        {
          id: '3',
          name: 'Municipal Water Treatment',
          clientName: 'City of Springfield',
          status: 'Rejected',
          totalAmount: 850000,
          createdDate: '2025-04-28',
          dueDate: '2025-05-12',
          assignedTo: 'John Sales',
          probability: 0,
          notes: 'Client went with competitor due to timeline constraints'
        },
        {
          id: '4',
          name: 'Residential Complex',
          clientName: 'Horizon Developers',
          status: 'Draft',
          totalAmount: 320000,
          createdDate: '2025-05-12',
          dueDate: '2025-05-30',
          assignedTo: 'Sarah Sales',
          probability: 50,
          notes: 'Initial draft, waiting for material pricing confirmation'
        },
        {
          id: '5',
          name: 'Shopping Mall Renovation',
          clientName: 'Retail Properties Inc',
          status: 'Sent',
          totalAmount: 780000,
          createdDate: '2025-05-08',
          dueDate: '2025-05-22',
          assignedTo: 'Mike Sales',
          probability: 65,
          notes: 'Client reviewing proposal, follow-up scheduled for next week'
        }
      ];
      
      return res.status(200).json(mockSalesRecords);
    } catch (error) {
      console.error('Error fetching sales records:', error);
      return res.status(500).json({ error: 'Failed to fetch sales records' });
    }
  }
  
  // POST /api/sales - Create a new sales/estimate record
  else if (req.method === 'POST') {
    const { name, clientName, status, totalAmount, dueDate, assignedTo, probability, notes } = req.body;
    
    if (!name || !clientName || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      // In a real implementation, we would create a record in the database
      // For now, we'll return a mock response
      const newSalesRecord = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        clientName,
        status,
        totalAmount: parseFloat(totalAmount) || 0,
        createdDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate || null,
        assignedTo: assignedTo || session.user.name,
        probability: parseInt(probability) || 50,
        notes
      };
      
      return res.status(201).json(newSalesRecord);
    } catch (error) {
      console.error('Error creating sales record:', error);
      return res.status(500).json({ error: 'Failed to create sales record' });
    }
  }
  
  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
