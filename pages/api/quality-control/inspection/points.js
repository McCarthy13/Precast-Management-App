/**
 * API endpoint for marking inspection points on piece drawings
 * 
 * This API handles:
 * - Creating inspection points
 * - Updating inspection point status
 * - Deleting inspection points
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { pieceId, pageId, inspectionPoint } = req.body;

        if (!pieceId || !pageId || !inspectionPoint) {
          return res.status(400).json({ error: "Missing required parameters" });
        }

        // Create a new inspection point
        const newInspectionPoint = await prisma.inspectionPoint.create({
          data: {
            pieceId: pieceId,
            pageId: pageId,
            x: inspectionPoint.x,
            y: inspectionPoint.y,
            inspectionType: inspectionPoint.inspectionType,
            status: inspectionPoint.status || "PENDING",
            notes: inspectionPoint.notes || "",
            createdBy: session.user.id,
          },
        });

        return res.status(201).json(newInspectionPoint);
      } catch (error) {
        console.error("Error creating inspection point:", error);
        return res.status(500).json({ error: "Failed to create inspection point" });
      }

    case "PUT":
      try {
        const { id } = req.query;
        const { status, notes } = req.body;

        if (!id) {
          return res.status(400).json({ error: "Missing inspection point ID" });
        }

        // Update the inspection point
        const updatedInspectionPoint = await prisma.inspectionPoint.update({
          where: {
            id: id,
          },
          data: {
            status: status,
            notes: notes,
            updatedAt: new Date(),
          },
        });

        return res.status(200).json(updatedInspectionPoint);
      } catch (error) {
        console.error("Error updating inspection point:", error);
        return res.status(500).json({ error: "Failed to update inspection point" });
      }

    case "DELETE":
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: "Missing inspection point ID" });
        }

        // Delete the inspection point
        await prisma.inspectionPoint.delete({
          where: {
            id: id,
          },
        });

        return res.status(200).json({ message: "Inspection point deleted successfully" });
      } catch (error) {
        console.error("Error deleting inspection point:", error);
        return res.status(500).json({ error: "Failed to delete inspection point" });
      }

    default:
      res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
