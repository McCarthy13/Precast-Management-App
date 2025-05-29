import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

// Detect touch device for backend selection
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Backend based on device type
const DndBackend = isTouchDevice() ? TouchBackend : HTML5Backend;

/**
 * PieceInspectionArrangement Component
 * 
 * This component allows QC technicians to arrange pieces in any order for inspection
 * and navigate between pieces horizontally and between pages vertically.
 */
const PieceInspectionArrangement = ({ workspaceId, formId, inspectionType }) => {
  const router = useRouter();
  const [pieces, setPieces] = useState([]);
  const [loading, setPieces] = useState(true);
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [inspectionPoints, setInspectionPoints] = useState([]);
  const [arrangementSaved, setArrangementSaved] = useState(false);
  const drawingContainerRef = useRef(null);

  // Fetch pieces for the workspace/form
  useEffect(() => {
    const fetchPieces = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quality-control/inspection/pieces?workspaceId=${workspaceId}&formId=${formId}&type=${inspectionType}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pieces');
        }
        
        const data = await response.json();
        setPieces(data.pieces);
        
        // Also fetch any saved arrangement
        const arrangementResponse = await fetch(`/api/quality-control/inspection/arrangement?workspaceId=${workspaceId}&formId=${formId}&type=${inspectionType}`);
        
        if (arrangementResponse.ok) {
          const arrangementData = await arrangementResponse.json();
          if (arrangementData.arrangement && arrangementData.arrangement.length > 0) {
            // Reorder pieces based on saved arrangement
            const orderedPieces = [];
            arrangementData.arrangement.forEach(pieceId => {
              const piece = data.pieces.find(p => p.id === pieceId);
              if (piece) {
                orderedPieces.push(piece);
              }
            });
            
            // Add any pieces that weren't in the arrangement
            data.pieces.forEach(piece => {
              if (!arrangementData.arrangement.includes(piece.id)) {
                orderedPieces.push(piece);
              }
            });
            
            setPieces(orderedPieces);
            setArrangementSaved(true);
          }
        }
      } catch (error) {
        console.error('Error fetching pieces:', error);
        toast.error('Failed to load pieces for inspection');
      } finally {
        setLoading(false);
      }
    };
    
    if (workspaceId && formId && inspectionType) {
      fetchPieces();
    }
  }, [workspaceId, formId, inspectionType]);

  // Fetch inspection points for current piece
  useEffect(() => {
    const fetchInspectionPoints = async () => {
      if (!pieces.length || currentPieceIndex >= pieces.length) return;
      
      try {
        const currentPiece = pieces[currentPieceIndex];
        const response = await fetch(`/api/quality-control/inspection/points?pieceId=${currentPiece.id}&page=${currentPageIndex}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch inspection points');
        }
        
        const data = await response.json();
        setInspectionPoints(data.points);
      } catch (error) {
        console.error('Error fetching inspection points:', error);
        toast.error('Failed to load inspection points');
      }
    };
    
    fetchInspectionPoints();
  }, [pieces, currentPieceIndex, currentPageIndex]);

  // Save the arrangement when pieces order changes
  const saveArrangement = async () => {
    try {
      const pieceIds = pieces.map(piece => piece.id);
      const response = await fetch('/api/quality-control/inspection/arrangement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          formId,
          type: inspectionType,
          arrangement: pieceIds
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save arrangement');
      }
      
      setArrangementSaved(true);
      toast.success('Piece arrangement saved');
    } catch (error) {
      console.error('Error saving arrangement:', error);
      toast.error('Failed to save piece arrangement');
    }
  };

  // Handle piece reordering
  const movePiece = (dragIndex, hoverIndex) => {
    const draggedPiece = pieces[dragIndex];
    const newPieces = [...pieces];
    newPieces.splice(dragIndex, 1);
    newPieces.splice(hoverIndex, 0, draggedPiece);
    
    setPieces(newPieces);
    setArrangementSaved(false);
  };

  // Handle adding inspection point
  const handleDrawingClick = async (e) => {
    if (!drawingContainerRef.current) return;
    
    const rect = drawingContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage coordinates for responsiveness
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    try {
      const currentPiece = pieces[currentPieceIndex];
      const response = await fetch('/api/quality-control/inspection/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pieceId: currentPiece.id,
          page: currentPageIndex,
          x: xPercent,
          y: yPercent,
          type: inspectionType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add inspection point');
      }
      
      const data = await response.json();
      setInspectionPoints([...inspectionPoints, data.point]);
      toast.success('Inspection point added');
    } catch (error) {
      console.error('Error adding inspection point:', error);
      toast.error('Failed to add inspection point');
    }
  };

  // Handle piece approval/rejection
  const handlePieceStatus = async (approved) => {
    try {
      const currentPiece = pieces[currentPieceIndex];
      const response = await fetch('/api/quality-control/inspection/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pieceId: currentPiece.id,
          type: inspectionType,
          approved
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${approved ? 'approve' : 'reject'} inspection`);
      }
      
      toast.success(`Inspection ${approved ? 'approved' : 'rejected'}`);
      
      // Move to next piece if available
      if (currentPieceIndex < pieces.length - 1) {
        setCurrentPieceIndex(currentPieceIndex + 1);
        setCurrentPageIndex(0);
      }
    } catch (error) {
      console.error('Error updating piece status:', error);
      toast.error(`Failed to ${approved ? 'approve' : 'reject'} inspection`);
    }
  };

  // Navigation handlers
  const goToNextPiece = () => {
    if (currentPieceIndex < pieces.length - 1) {
      setCurrentPieceIndex(currentPieceIndex + 1);
      setCurrentPageIndex(0);
    }
  };

  const goToPreviousPiece = () => {
    if (currentPieceIndex > 0) {
      setCurrentPieceIndex(currentPieceIndex - 1);
      setCurrentPageIndex(0);
    }
  };

  const goToNextPage = () => {
    const currentPiece = pieces[currentPieceIndex];
    if (currentPageIndex < currentPiece.pageCount - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // Swipe handlers for touch navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNextPiece(),
    onSwipedRight: () => goToPreviousPiece(),
    onSwipedUp: () => goToNextPage(),
    onSwipedDown: () => goToPreviousPage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render empty state
  if (!pieces.length) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <FaExclamationTriangle className="text-yellow-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Pieces Found</h2>
        <p className="text-gray-600 mb-4">There are no pieces scheduled for inspection in this workspace/form.</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => router.push('/quality-control')}
        >
          Return to QC Dashboard
        </button>
      </div>
    );
  }

  const currentPiece = pieces[currentPieceIndex];

  return (
    <DndProvider backend={DndBackend}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {inspectionType === 'pre-pour' ? 'Pre-Pour Inspection' : 'Post-Pour Inspection'}
        </h1>
        
        {/* Arrangement Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Arrange Pieces for Inspection</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {pieces.map((piece, index) => (
              <DraggablePieceCard 
                key={piece.id} 
                piece={piece} 
                index={index}
                movePiece={movePiece}
                isActive={index === currentPieceIndex}
                onClick={() => {
                  setCurrentPieceIndex(index);
                  setCurrentPageIndex(0);
                }}
              />
            ))}
          </div>
          
          {!arrangementSaved && (
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={saveArrangement}
            >
              Save Arrangement
            </button>
          )}
        </div>
        
        {/* Inspection Section */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-semibold piece-indicator">
                Piece {currentPieceIndex + 1} of {pieces.length}: {currentPiece.pieceNumber}
              </span>
            </div>
            <div>
              <span className="font-semibold page-indicator">
                Page {currentPageIndex + 1} of {currentPiece.pageCount}
              </span>
            </div>
          </div>
          
          {/* Drawing Container with Swipe Handlers */}
          <div 
            {...swipeHandlers}
            ref={drawingContainerRef}
            id="drawing-container"
            className="relative bg-white border border-gray-300 rounded-lg h-[600px] mb-4 overflow-hidden"
            onClick={handleDrawingClick}
          >
            {/* Drawing Image */}
            <img 
              src={`/api/drafting/drawings/${currentPiece.drawingId}?page=${currentPageIndex}`} 
              alt={`Drawing for piece ${currentPiece.pieceNumber}`}
              className="w-full h-full object-contain"
            />
            
            {/* Inspection Points */}
            {inspectionPoints.map((point) => (
              <div 
                key={point.id}
                className="absolute w-6 h-6 rounded-full bg-red-500 border-2 border-white inspection-point"
                style={{ 
                  left: `${point.x}%`, 
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={point.notes || 'Inspection point'}
              />
            ))}
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <button 
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={goToPreviousPiece}
                disabled={currentPieceIndex === 0}
              >
                <FaArrowLeft />
              </button>
              <button 
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={goToNextPiece}
                disabled={currentPieceIndex === pieces.length - 1}
              >
                <FaArrowRight />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={goToPreviousPage}
                disabled={currentPageIndex === 0}
              >
                <FaArrowUp />
              </button>
              <button 
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={goToNextPage}
                disabled={currentPageIndex === currentPiece.pageCount - 1}
              >
                <FaArrowDown />
              </button>
            </div>
          </div>
          
          {/* Approval Controls */}
          <div className="flex justify-end gap-4">
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              onClick={() => handlePieceStatus(false)}
            >
              <FaTimes /> Reject
            </button>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
              onClick={() => handlePieceStatus(true)}
            >
              <FaCheck /> Approve
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Draggable Piece Card Component
const DraggablePieceCard = ({ piece, index, movePiece, isActive, onClick }) => {
  const ref = useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'PIECE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: 'PIECE',
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Move the piece in the array
      movePiece(dragIndex, hoverIndex);
      
      // Update the item's index for future drags
      item.index = hoverIndex;
    },
  });
  
  // Apply both drag and drop refs
  drag(drop(ref));
  
  return (
    <div 
      ref={ref}
      className={`p-3 rounded-lg shadow cursor-move draggable-piece piece-card ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        isActive ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-300'
      }`}
      onClick={onClick}
      data-piece-number={piece.pieceNumber}
    >
      <div className="font-semibold">{piece.pieceNumber}</div>
      <div className="text-sm text-gray-600">{piece.description}</div>
      <div className={`text-xs mt-1 piece-status ${
        piece.status === 'READY_FOR_POUR' ? 'text-green-600' :
        piece.status === 'READY_FOR_YARD' ? 'text-blue-600' :
        'text-gray-600'
      }`}>
        {piece.status}
      </div>
    </div>
  );
};

export default PieceInspectionArrangement;
