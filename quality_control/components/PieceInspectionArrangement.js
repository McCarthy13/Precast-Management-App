/**
 * PieceInspectionArrangement Component
 * 
 * This component allows QC technicians to arrange pieces in a workspace/form
 * for inspection and navigate through piece drawings with intuitive gestures.
 * 
 * Features:
 * - Drag and drop interface for arranging pieces
 * - Horizontal swipe to navigate between pieces
 * - Vertical swipe to navigate between pages of the same piece drawing
 * - Mobile and tablet optimized
 */

import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSwipeable } from 'react-swipeable';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Box, Button, Card, Flex, Heading, IconButton, Text, Spinner } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

// Import services
import { qualityControlService } from '../../services/QualityControlService';
import qualityControlAIService from '../../services/ai/QualityControlAIService';

/**
 * PieceInspectionArrangement Component
 */
const PieceInspectionArrangement = ({ workspaceId, formId, inspectionType }) => {
  // State for pieces in the workspace/form
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for current piece and page
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Ref for the drawing container
  const drawingContainerRef = useRef(null);
  
  // Router for navigation
  const router = useRouter();
  
  /**
   * Load pieces for the workspace/form
   */
  useEffect(() => {
    const loadPieces = async () => {
      try {
        setLoading(true);
        
        // Get pieces scheduled for the workspace/form
        const scheduledPieces = await qualityControlService.getPiecesForInspection(
          workspaceId, 
          formId, 
          inspectionType
        );
        
        // Get the user's saved arrangement if it exists
        const savedArrangement = await qualityControlService.getSavedPieceArrangement(
          workspaceId,
          formId,
          inspectionType
        );
        
        // If there's a saved arrangement, use it; otherwise use the scheduled order
        const piecesToUse = savedArrangement?.pieces?.length > 0 
          ? savedArrangement.pieces 
          : scheduledPieces;
        
        setPieces(piecesToUse);
        setLoading(false);
      } catch (err) {
        console.error('Error loading pieces for inspection:', err);
        setError('Failed to load pieces for inspection. Please try again.');
        setLoading(false);
        toast.error('Failed to load pieces for inspection');
      }
    };
    
    loadPieces();
  }, [workspaceId, formId, inspectionType]);
  
  /**
   * Handle piece reordering via drag and drop
   */
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const reorderedPieces = Array.from(pieces);
    const [removed] = reorderedPieces.splice(result.source.index, 1);
    reorderedPieces.splice(result.destination.index, 0, removed);
    
    setPieces(reorderedPieces);
    
    // Save the new arrangement
    try {
      await qualityControlService.savePieceArrangement(
        workspaceId,
        formId,
        inspectionType,
        reorderedPieces
      );
      toast.success('Piece arrangement saved');
    } catch (err) {
      console.error('Error saving piece arrangement:', err);
      toast.error('Failed to save piece arrangement');
    }
  };
  
  /**
   * Navigate to the next piece
   */
  const goToNextPiece = () => {
    if (currentPieceIndex < pieces.length - 1) {
      setCurrentPieceIndex(currentPieceIndex + 1);
      setCurrentPageIndex(0); // Reset to first page of the next piece
    }
  };
  
  /**
   * Navigate to the previous piece
   */
  const goToPreviousPiece = () => {
    if (currentPieceIndex > 0) {
      setCurrentPieceIndex(currentPieceIndex - 1);
      setCurrentPageIndex(0); // Reset to first page of the previous piece
    }
  };
  
  /**
   * Navigate to the next page of the current piece
   */
  const goToNextPage = () => {
    const currentPiece = pieces[currentPieceIndex];
    if (currentPageIndex < currentPiece.drawingPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };
  
  /**
   * Navigate to the previous page of the current piece
   */
  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };
  
  /**
   * Set up swipe handlers for touch navigation
   */
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNextPiece(),
    onSwipedRight: () => goToPreviousPiece(),
    onSwipedUp: () => goToPreviousPage(),
    onSwipedDown: () => goToNextPage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });
  
  /**
   * Handle inspection point marking
   */
  const handleMarkInspectionPoint = async (x, y) => {
    if (!pieces[currentPieceIndex]) return;
    
    try {
      const currentPiece = pieces[currentPieceIndex];
      const currentPage = currentPiece.drawingPages[currentPageIndex];
      
      await qualityControlService.markInspectionPoint(
        currentPiece.id,
        currentPage.id,
        {
          x,
          y,
          inspectionType,
          status: 'PENDING', // Default status
          notes: '',
          createdAt: new Date().toISOString()
        }
      );
      
      toast.success('Inspection point marked');
      
      // Refresh the piece data
      const updatedPiece = await qualityControlService.getPieceById(currentPiece.id);
      const updatedPieces = [...pieces];
      updatedPieces[currentPieceIndex] = updatedPiece;
      setPieces(updatedPieces);
    } catch (err) {
      console.error('Error marking inspection point:', err);
      toast.error('Failed to mark inspection point');
    }
  };
  
  /**
   * Handle click on the drawing to mark inspection point
   */
  const handleDrawingClick = (e) => {
    if (!drawingContainerRef.current) return;
    
    const rect = drawingContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // Convert to percentage
    const y = ((e.clientY - rect.top) / rect.height) * 100; // Convert to percentage
    
    handleMarkInspectionPoint(x, y);
  };
  
  /**
   * Complete the inspection for the current piece
   */
  const handleCompleteInspection = async (status) => {
    if (!pieces[currentPieceIndex]) return;
    
    try {
      const currentPiece = pieces[currentPieceIndex];
      
      await qualityControlService.completePieceInspection(
        currentPiece.id,
        inspectionType,
        {
          status,
          completedAt: new Date().toISOString(),
          notes: ''
        }
      );
      
      toast.success(`Inspection ${status === 'APPROVED' ? 'approved' : 'rejected'}`);
      
      // Refresh the piece data
      const updatedPiece = await qualityControlService.getPieceById(currentPiece.id);
      const updatedPieces = [...pieces];
      updatedPieces[currentPieceIndex] = updatedPiece;
      setPieces(updatedPieces);
      
      // Move to the next piece if available
      if (currentPieceIndex < pieces.length - 1) {
        goToNextPiece();
      }
    } catch (err) {
      console.error('Error completing inspection:', err);
      toast.error('Failed to complete inspection');
    }
  };
  
  /**
   * Get AI-powered inspection recommendations
   */
  const handleGetAIRecommendations = async () => {
    if (!pieces[currentPieceIndex]) return;
    
    try {
      const currentPiece = pieces[currentPieceIndex];
      
      toast.loading('Analyzing piece for inspection recommendations...');
      
      const recommendations = await qualityControlAIService.getInspectionRecommendations(
        currentPiece.id,
        inspectionType
      );
      
      toast.dismiss();
      toast.success('AI recommendations generated');
      
      // Display recommendations in a modal or sidebar
      // This would be implemented with a modal component
    } catch (err) {
      toast.dismiss();
      console.error('Error getting AI recommendations:', err);
      toast.error('Failed to get AI recommendations');
    }
  };
  
  // If loading, show spinner
  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <Flex direction="column" justify="center" align="center" h="100vh">
        <Text color="red.500" mb={4}>{error}</Text>
        <Button onClick={() => router.reload()}>Retry</Button>
      </Flex>
    );
  }
  
  // If no pieces, show empty state
  if (pieces.length === 0) {
    return (
      <Flex direction="column" justify="center" align="center" h="100vh">
        <Text mb={4}>No pieces scheduled for inspection in this workspace/form.</Text>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Flex>
    );
  }
  
  // Get current piece and page
  const currentPiece = pieces[currentPieceIndex];
  const currentPage = currentPiece?.drawingPages[currentPageIndex];
  
  return (
    <Flex direction="column" h="100vh">
      {/* Header with navigation info */}
      <Flex bg="gray.100" p={4} justify="space-between" align="center">
        <Box>
          <Heading size="md">{inspectionType === 'PRE_POUR' ? 'Pre-Pour' : 'Post-Pour'} Inspection</Heading>
          <Text>Workspace: {workspaceId} | Form: {formId}</Text>
        </Box>
        <Box>
          <Text>
            Piece {currentPieceIndex + 1} of {pieces.length} | 
            Page {currentPageIndex + 1} of {currentPiece?.drawingPages.length || 1}
          </Text>
        </Box>
      </Flex>
      
      {/* Piece arrangement section */}
      <Box p={4} bg="gray.50">
        <Heading size="sm" mb={2}>Arrange Pieces for Inspection</Heading>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pieces" direction="horizontal">
            {(provided) => (
              <Flex
                ref={provided.innerRef}
                {...provided.droppableProps}
                overflowX="auto"
                py={2}
              >
                {pieces.map((piece, index) => (
                  <Draggable key={piece.id} draggableId={piece.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        minW="150px"
                        h="80px"
                        m={1}
                        p={2}
                        bg={index === currentPieceIndex ? "blue.100" : "white"}
                        cursor="grab"
                        onClick={() => {
                          setCurrentPieceIndex(index);
                          setCurrentPageIndex(0);
                        }}
                      >
                        <Text fontWeight="bold" fontSize="sm">{piece.pieceNumber}</Text>
                        <Text fontSize="xs">{piece.description}</Text>
                        <Text fontSize="xs" color={
                          piece.inspectionStatus === 'APPROVED' ? 'green.500' :
                          piece.inspectionStatus === 'REJECTED' ? 'red.500' :
                          'gray.500'
                        }>
                          {piece.inspectionStatus || 'Pending'}
                        </Text>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Flex>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      
      {/* Drawing display area */}
      <Flex 
        flex="1" 
        direction="column" 
        p={4} 
        position="relative"
        {...swipeHandlers}
      >
        <Flex justify="space-between" mb={2}>
          <Button
            leftIcon={<ChevronLeftIcon />}
            onClick={goToPreviousPiece}
            isDisabled={currentPieceIndex === 0}
          >
            Previous Piece
          </Button>
          <Button
            rightIcon={<ChevronRightIcon />}
            onClick={goToNextPiece}
            isDisabled={currentPieceIndex === pieces.length - 1}
          >
            Next Piece
          </Button>
        </Flex>
        
        <Flex justify="space-between" mb={2}>
          <Button
            leftIcon={<ChevronUpIcon />}
            onClick={goToPreviousPage}
            isDisabled={currentPageIndex === 0}
          >
            Previous Page
          </Button>
          <Button
            rightIcon={<ChevronDownIcon />}
            onClick={goToNextPage}
            isDisabled={!currentPiece || currentPageIndex === currentPiece.drawingPages.length - 1}
          >
            Next Page
          </Button>
        </Flex>
        
        {/* Drawing container */}
        <Box 
          ref={drawingContainerRef}
          flex="1" 
          border="1px solid" 
          borderColor="gray.200" 
          borderRadius="md"
          position="relative"
          onClick={handleDrawingClick}
          backgroundImage={currentPage?.url ? `url(${currentPage.url})` : 'none'}
          backgroundSize="contain"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          bg="white"
        >
          {/* Render inspection points */}
          {currentPiece?.inspectionPoints
            ?.filter(point => point.pageId === currentPage?.id)
            ?.map((point, index) => (
              <Box
                key={index}
                position="absolute"
                left={`${point.x}%`}
                top={`${point.y}%`}
                w="20px"
                h="20px"
                borderRadius="full"
                bg={
                  point.status === 'APPROVED' ? 'green.500' :
                  point.status === 'REJECTED' ? 'red.500' :
                  'yellow.500'
                }
                transform="translate(-50%, -50%)"
                zIndex="1"
              />
            ))}
        </Box>
        
        {/* Action buttons */}
        <Flex mt={4} justify="space-between">
          <Button
            colorScheme="red"
            onClick={() => handleCompleteInspection('REJECTED')}
          >
            Reject
          </Button>
          <Button
            onClick={handleGetAIRecommendations}
          >
            Get AI Recommendations
          </Button>
          <Button
            colorScheme="green"
            onClick={() => handleCompleteInspection('APPROVED')}
          >
            Approve
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PieceInspectionArrangement;
