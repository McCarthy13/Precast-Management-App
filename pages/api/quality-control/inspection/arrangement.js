/**
 * API endpoint for managing piece inspection arrangements
 * 
 * This endpoint allows saving and retrieving custom piece arrangements
 * for QC inspections in a specific workspace/form.
 */
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  // GET: Retrieve saved arrangement
  if (req.method === "GET") {
    try {
      const { workspaceId, formId, type } = req.query;
      
      if (!workspaceId || !formId || !type) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      const arrangement = await prisma.inspectionArrangement.findFirst({
        where: {
          workspaceId: parseInt(workspaceId),
          formId: parseInt(formId),
          type: type,
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return res.status(200).json({ 
        arrangement: arrangement ? arrangement.pieceOrder : [] 
      });
    } catch (error) {
      console.error("Error retrieving arrangement:", error);
      return res.status(500).json({ error: "Failed to retrieve arrangement" });
    }
  }
  
  // POST: Save new arrangement
  if (req.method === "POST") {
    try {
      const { workspaceId, formId, type, arrangement } = req.body;
      
      if (!workspaceId || !formId || !type || !arrangement) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Check if arrangement already exists
      const existingArrangement = await prisma.inspectionArrangement.findFirst({
        where: {
          workspaceId: parseInt(workspaceId),
          formId: parseInt(formId),
          type: type,
          userId: session.user.id
        }
      });
      
      let result;
      
      if (existingArrangement) {
        // Update existing arrangement
        result = await prisma.inspectionArrangement.update({
          where: {
            id: existingArrangement.id
          },
          data: {
            pieceOrder: arrangement,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new arrangement
        result = await prisma.inspectionArrangement.create({
          data: {
            workspaceId: parseInt(workspaceId),
            formId: parseInt(formId),
            type: type,
            pieceOrder: arrangement,
            userId: session.user.id
          }
        });
      }
      
      return res.status(200).json({ success: true, arrangement: result });
    } catch (error) {
      console.error("Error saving arrangement:", error);
      return res.status(500).json({ error: "Failed to save arrangement" });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
