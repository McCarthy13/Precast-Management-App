/**
 * QC Module Service Tests
 * 
 * This file contains tests for the Quality Control module services,
 * focusing on the new piece inspection arrangement and navigation feature.
 */

// Import required modules
const { qualityControlService } = require('../../src/modules/quality_control/services/QualityControlService');
const qualityControlAIService = require('../../src/modules/quality_control/services/ai/QualityControlAIService');
const { prisma } = require('../../lib/prisma');

// Mock data
const mockWorkspaceId = 'workspace-1';
const mockFormId = 'form-1';
const mockInspectionType = 'PRE_POUR';
const mockUserId = 'user-1';

const mockPieces = [
  {
    id: 'piece-1',
    pieceNumber: 'P001',
    description: 'Column',
    workspaceId: mockWorkspaceId,
    formId: mockFormId,
    status: 'SCHEDULED',
    productionOrder: 1,
    drawingPages: [
      { id: 'page-1-1', url: '/drawings/p001-1.jpg' },
      { id: 'page-1-2', url: '/drawings/p001-2.jpg' }
    ],
    inspectionPoints: []
  },
  {
    id: 'piece-2',
    pieceNumber: 'P002',
    description: 'Beam',
    workspaceId: mockWorkspaceId,
    formId: mockFormId,
    status: 'SCHEDULED',
    productionOrder: 2,
    drawingPages: [
      { id: 'page-2-1', url: '/drawings/p002-1.jpg' }
    ],
    inspectionPoints: []
  }
];

// Mock fetch implementation
global.fetch = jest.fn();

describe('Quality Control Module - Piece Inspection Feature', () => {
  beforeEach(() => {
    // Reset mocks
    fetch.mockReset();
  });

  describe('getPiecesForInspection', () => {
    it('should fetch pieces scheduled for inspection in a workspace/form', async () => {
      // Mock API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPieces
      });

      // Call the service method
      const result = await qualityControlService.getPiecesForInspection(
        mockWorkspaceId,
        mockFormId,
        mockInspectionType
      );

      // Verify the fetch call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/quality-control/inspection/pieces?workspaceId=${mockWorkspaceId}&formId=${mockFormId}&inspectionType=${mockInspectionType}`)
      );

      // Verify the result
      expect(result).toEqual(mockPieces);
      expect(result.length).toBe(2);
      expect(result[0].pieceNumber).toBe('P001');
      expect(result[1].pieceNumber).toBe('P002');
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      // Call the service method and expect it to throw
      await expect(
        qualityControlService.getPiecesForInspection(
          mockWorkspaceId,
          mockFormId,
          mockInspectionType
        )
      ).rejects.toThrow();

      // Verify the fetch call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/quality-control/inspection/pieces`)
      );
    });
  });

  describe('getSavedPieceArrangement', () => {
    it('should fetch saved piece arrangement for a user', async () => {
      // Mock saved arrangement
      const mockArrangement = {
        id: 'arrangement-1',
        workspaceId: mockWorkspaceId,
        formId: mockFormId,
        inspectionType: mockInspectionType,
        userId: mockUserId,
        pieces: mockPieces.map((piece, index) => ({
          ...piece,
          order: index
        }))
      };

      // Mock API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArrangement
      });

      // Call the service method
      const result = await qualityControlService.getSavedPieceArrangement(
        mockWorkspaceId,
        mockFormId,
        mockInspectionType
      );

      // Verify the fetch call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/quality-control/inspection/arrangement?workspaceId=${mockWorkspaceId}&formId=${mockFormId}&inspectionType=${mockInspectionType}`)
      );

      // Verify the result
      expect(result).toEqual(mockArrangement);
      expect(result.pieces.length).toBe(2);
      expect(result.pieces[0].order).toBe(0);
      expect(result.pieces[1].order).toBe(1);
    });
  });

  describe('savePieceArrangement', () => {
    it('should save a custom piece arrangement', async () => {
      // Mock API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'arrangement-1' })
      });

      // Call the service method
      const result = await qualityControlService.savePieceArrangement(
        mockWorkspaceId,
        mockFormId,
        mockInspectionType,
        mockPieces
      );

      // Verify the fetch call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/quality-control/inspection/arrangement`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            workspaceId: mockWorkspaceId,
            formId: mockFormId,
            inspectionType: mockInspectionType,
            pieces: mockPieces
          })
        })
      );

      // Verify the result
      expect(result).toEqual({ id: 'arrangement-1' });
    });
  });

  describe('markInspectionPoint', () => {
    it('should create a new inspection point', async () => {
      // Mock inspection point data
      const mockPoint = {
        x: 50,
        y: 50,
        inspectionType: mockInspectionType,
        status: 'PENDING',
        notes: ''
      };

      // Mock API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'point-1', ...mockPoint })
      });

      // Call the service method
      const result = await qualityControlService.markInspectionPoint(
        'piece-1',
        'page-1-1',
        mockPoint
      );

      // Verify the fetch call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/quality-control/inspection/points`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            pieceId: 'piece-1',
            pageId: 'page-1-1',
            inspectionPoint: mockPoint
          })
        })
      );

      // Verify the result
      expect(result).toEqual({ id: 'point-1', ...mockPoint });
    });
  });

  describe('completePieceInspection', () => {
    it('should complete a piece inspection and update status', async () => {
      // Mock inspection data
      const mockInspection = {
        status: 'APPROVED',
        notes: 'Looks good',
        completedAt: new Date().toISOString()
      };

      // Mock updated piece with inspection status
      const mockUpdatedPiece = {
        ...mockPieces[0],
        status: 'READY_FOR_POUR',
        inspectionStatus: 'APPROVED'
      };

      // Mock API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedPiece
      });

      // Call the service method
      const result = await qualityControlService.completePieceInspection(
        'piece-1',
        mockInspectionType,
        mockInspection
      );

      // Verify the fetch call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/quality-control/inspection/complete`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            pieceId: 'piece-1',
            inspectionType: mockInspectionType,
            inspection: mockInspection
          })
        })
      );

      // Verify the result
      expect(result).toEqual(mockUpdatedPiece);
      expect(result.status).toBe('READY_FOR_POUR');
      expect(result.inspectionStatus).toBe('APPROVED');
    });
  });

  describe('AI Integration', () => {
    it('should get AI-powered inspection recommendations', async () => {
      // Mock AI recommendations
      const mockRecommendations = {
        criticalAreas: [
          { x: 30, y: 40, description: 'Check rebar placement' },
          { x: 70, y: 60, description: 'Verify embed position' }
        ],
        suggestedChecks: [
          'Verify dimensions match drawing',
          'Check concrete cover requirements'
        ],
        similarIssuesHistory: [
          { pieceNumber: 'P003', issue: 'Incorrect embed placement', date: '2025-05-20' }
        ]
      };

      // Mock API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecommendations
      });

      // Call the service method
      const result = await qualityControlAIService.getInspectionRecommendations(
        'piece-1',
        mockInspectionType
      );

      // Verify the fetch call
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/quality-control/ai/inspection-recommendations`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            pieceId: 'piece-1',
            inspectionType: mockInspectionType
          })
        })
      );

      // Verify the result
      expect(result).toEqual(mockRecommendations);
      expect(result.criticalAreas.length).toBe(2);
      expect(result.suggestedChecks.length).toBe(2);
    });
  });

  describe('Cross-Module Integration', () => {
    it('should update piece status across modules when inspection is completed', async () => {
      // This test verifies that when a piece inspection is completed,
      // the status is updated and reflected in other modules
      
      // Mock inspection data
      const mockInspection = {
        status: 'APPROVED',
        notes: 'Looks good',
        completedAt: new Date().toISOString()
      };

      // Mock updated piece with inspection status
      const mockUpdatedPiece = {
        ...mockPieces[0],
        status: 'READY_FOR_POUR',
        inspectionStatus: 'APPROVED'
      };

      // Mock API responses
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedPiece
      });

      // Complete the inspection
      await qualityControlService.completePieceInspection(
        'piece-1',
        mockInspectionType,
        mockInspection
      );

      // Now verify the piece status is reflected in other modules
      
      // Mock Yard Management service response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockUpdatedPiece, yardLocation: null })
      });

      // Check piece status in Yard Management
      const yardPiece = await yardService.getPieceById('piece-1');
      
      // Verify the status is updated in Yard Management
      expect(yardPiece.status).toBe('READY_FOR_POUR');
      
      // Mock Shipping service response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockUpdatedPiece, shippingEligible: false })
      });

      // Check piece status in Shipping
      const shippingPiece = await shippingService.getPieceById('piece-1');
      
      // Verify the status is updated in Shipping
      expect(shippingPiece.status).toBe('READY_FOR_POUR');
      expect(shippingPiece.shippingEligible).toBe(false); // Not eligible until post-pour inspection
    });
  });
});
