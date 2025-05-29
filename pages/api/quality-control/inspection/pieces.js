/**
 * API endpoint for piece inspection operations
 * 
 * This API handles:
 * - Getting pieces for inspection
 * - Marking inspection points
 * - Completing piece inspections
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
    case "GET":
      try {
        const { workspaceId, formId, inspectionType } = req.query;

        if (!workspaceId || !formId || !inspectionType) {
          return res.status(400).json({ error: "Missing required parameters" });
        }

        // Get pieces scheduled for the workspace/form
        const pieces = await prisma.piece.findMany({
          where: {
            workspaceId: workspaceId,
            formId: formId,
            status: {
              in: ["SCHEDULED", "IN_PRODUCTION"],
            },
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
          orderBy: {
            productionOrder: "asc",
          },
        });

        // Add inspection status to each piece
        const piecesWithStatus = pieces.map(piece => {
          const latestInspection = piece.inspections[0];
          return {
            ...piece,
            inspectionStatus: latestInspection ? latestInspection.status : null,
          };
        });

        return res.status(200).json(piecesWithStatus);
      } catch (error) {
        console.error("Error fetching pieces for inspection:", error);
        return res.status(500).json({ error: "Failed to fetch pieces for inspection" });
      }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
