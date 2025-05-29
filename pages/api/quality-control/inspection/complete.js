/**
 * API endpoint for completing piece inspections
 * 
 * This API handles:
 * - Completing pre-pour and post-pour inspections
 * - Updating piece status based on inspection results
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
        const { pieceId, inspectionType, inspection } = req.body;

        if (!pieceId || !inspectionType || !inspection) {
          return res.status(400).json({ error: "Missing required parameters" });
        }

        // Create a new inspection record
        const newInspection = await prisma.inspection.create({
          data: {
            pieceId: pieceId,
            inspectionType: inspectionType,
            status: inspection.status,
            notes: inspection.notes || "",
            completedBy: session.user.id,
            completedAt: inspection.completedAt || new Date(),
          },
        });

        // Update the piece status based on inspection result
        let newPieceStatus;
        if (inspectionType === "PRE_POUR") {
          newPieceStatus = inspection.status === "APPROVED" ? "READY_FOR_POUR" : "INSPECTION_FAILED";
        } else if (inspectionType === "POST_POUR") {
          newPieceStatus = inspection.status === "APPROVED" ? "READY_FOR_YARD" : "REWORK_REQUIRED";
        }

        if (newPieceStatus) {
          await prisma.piece.update({
            where: {
              id: pieceId,
            },
            data: {
              status: newPieceStatus,
              updatedAt: new Date(),
            },
          });
        }

        // Get the updated piece with inspection data
        const updatedPiece = await prisma.piece.findUnique({
          where: {
            id: pieceId,
          },
          include: {
            drawingPages: true,
            inspectionPoints: {
              where: {
                inspectionType: inspectionType,
              },
            },
            inspections: {
              where: {
                inspectionType: inspectionType,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        });

        // Add inspection status to the piece
        const pieceWithStatus = {
          ...updatedPiece,
          inspectionStatus: updatedPiece.inspections[0]?.status || null,
        };

        return res.status(201).json(pieceWithStatus);
      } catch (error) {
        console.error("Error completing inspection:", error);
        return res.status(500).json({ error: "Failed to complete inspection" });
      }

    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
