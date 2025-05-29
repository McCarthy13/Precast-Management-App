// API route for AI-powered drawing analysis
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import { draftingAIService } from '../../../../src/modules/drafting/services/DraftingAIService';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check authentication
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { drawingId, analysisType } = req.body;
    
    if (!drawingId || !analysisType) {
      return res.status(400).json({ error: 'Drawing ID and analysis type are required' });
    }
    
    // Get drawing from database
    const drawing = await prisma.drawing.findUnique({
      where: { id: drawingId },
      include: {
        revisions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
    
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }
    
    // Get file URL from drawing or latest revision
    const fileUrl = drawing.revisions[0]?.fileUrl || drawing.fileUrl;
    
    if (!fileUrl) {
      return res.status(400).json({ error: 'Drawing file not found' });
    }
    
    // Perform different types of AI analysis based on analysisType
    let result;
    
    switch (analysisType) {
      case 'extractElements':
        result = await draftingAIService.extractElementsFromDrawing(fileUrl);
        
        // Save extracted elements to database
        if (result && Array.isArray(result)) {
          // Delete existing elements first
          await prisma.drawingElement.deleteMany({
            where: { drawingId }
          });
          
          // Create new elements
          for (const element of result) {
            await prisma.drawingElement.create({
              data: {
                drawingId,
                elementType: element.type,
                elementId: element.id,
                name: element.name,
                position: element.position,
                dimensions: element.dimensions,
                properties: element.properties
              }
            });
          }
        }
        break;
        
      case 'analyzeQuality':
        result = await draftingAIService.analyzeDrawingQuality(fileUrl);
        break;
        
      case 'suggestImprovements':
        result = await draftingAIService.suggestDrawingImprovements(fileUrl);
        break;
        
      case 'extractText':
        result = await draftingAIService.extractTextFromDrawing(fileUrl);
        break;
        
      case 'generateAnnotations':
        const { context } = req.body;
        result = await draftingAIService.generateDrawingAnnotations(fileUrl, context);
        break;
        
      case 'detectConflicts':
        // For conflict detection, we need to get related drawings
        const { projectId } = drawing;
        const relatedDrawings = await prisma.drawing.findMany({
          where: {
            projectId,
            id: { not: drawingId }
          },
          include: {
            revisions: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        });
        
        const drawingsToCheck = [
          {
            id: drawing.id,
            fileUrl,
            title: drawing.title,
            number: drawing.number,
            revision: drawing.revision
          },
          ...relatedDrawings.map(d => ({
            id: d.id,
            fileUrl: d.revisions[0]?.fileUrl || d.fileUrl,
            title: d.title,
            number: d.number,
            revision: d.revision
          }))
        ];
        
        result = await draftingAIService.detectDrawingConflicts(drawingsToCheck);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid analysis type' });
    }
    
    // Log the analysis activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        activityType: 'DRAWING_ANALYSIS',
        module: 'DRAFTING',
        description: `Performed ${analysisType} analysis on drawing ${drawing.number}`,
        metadata: {
          drawingId,
          analysisType
        }
      }
    });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error performing drawing analysis:', error);
    return res.status(500).json({ error: 'Failed to perform drawing analysis' });
  }
}
