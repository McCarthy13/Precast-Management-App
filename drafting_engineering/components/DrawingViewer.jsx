/**
 * DrawingViewerComponent
 * React component for viewing and interacting with engineering drawings
 */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Mock component for demonstration purposes
const DrawingViewer = ({
  drawingId,
  drawingUrl,
  initialScale = 1.0,
  showToolbar = true,
  onMarkupAdded,
  onDrawingLoaded,
  readOnly = false
}) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [markups, setMarkups] = useState([]);
  const [activeMarkupTool, setActiveMarkupTool] = useState(null);
  const [selectedMarkup, setSelectedMarkup] = useState(null);
  
  const viewerRef = useRef(null);
  
  // Simulate loading the drawing
  useEffect(() => {
    if (drawingUrl) {
      setIsLoading(true);
      
      // Simulate API call to load drawing
      const loadDrawing = async () => {
        // In a real implementation, this would load the actual drawing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
        
        if (onDrawingLoaded) {
          onDrawingLoaded({
            id: drawingId,
            url: drawingUrl,
            dimensions: { width: 2000, height: 1500 }
          });
        }
      };
      
      loadDrawing();
    }
  }, [drawingId, drawingUrl, onDrawingLoaded]);
  
  // Simulate loading markups
  useEffect(() => {
    if (drawingId && !isLoading) {
      // Simulate API call to load markups
      const loadMarkups = async () => {
        // In a real implementation, this would fetch markups from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockMarkups = [
          {
            id: 'markup1',
            type: 'comment',
            position: { x: 500, y: 300 },
            content: 'Check dimensions here',
            createdBy: 'user1',
            createdAt: new Date()
          },
          {
            id: 'markup2',
            type: 'redline',
            position: { x: 800, y: 600 },
            content: 'Update this section',
            properties: { color: 'red', lineWidth: 2, points: [[800, 600], [900, 700]] },
            createdBy: 'user2',
            createdAt: new Date()
          }
        ];
        
        setMarkups(mockMarkups);
      };
      
      loadMarkups();
    }
  }, [drawingId, isLoading]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3.0));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };
  
  // Handle reset view
  const handleResetView = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle pan
  const handlePan = (dx, dy) => {
    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
  };
  
  // Handle markup tool selection
  const handleMarkupToolSelect = (tool) => {
    setActiveMarkupTool(activeMarkupTool === tool ? null : tool);
    setSelectedMarkup(null);
  };
  
  // Handle adding a new markup
  const handleAddMarkup = (event) => {
    if (!activeMarkupTool || readOnly) return;
    
    // Calculate position relative to the drawing
    const rect = viewerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale - position.x;
    const y = (event.clientY - rect.top) / scale - position.y;
    
    const newMarkup = {
      id: `markup_${Date.now()}`,
      type: activeMarkupTool,
      position: { x, y },
      content: '',
      createdBy: 'currentUser',
      createdAt: new Date()
    };
    
    if (activeMarkupTool === 'redline') {
      newMarkup.properties = {
        color: 'red',
        lineWidth: 2,
        points: [[x, y]]
      };
    }
    
    setMarkups(prev => [...prev, newMarkup]);
    setSelectedMarkup(newMarkup.id);
    
    if (onMarkupAdded) {
      onMarkupAdded(newMarkup);
    }
  };
  
  // Handle selecting a markup
  const handleSelectMarkup = (markupId) => {
    setSelectedMarkup(markupId === selectedMarkup ? null : markupId);
    setActiveMarkupTool(null);
  };
  
  // Handle updating markup content
  const handleUpdateMarkupContent = (markupId, content) => {
    setMarkups(prev => 
      prev.map(markup => 
        markup.id === markupId 
          ? { ...markup, content } 
          : markup
      )
    );
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="drawing-viewer-loading">
        <div className="spinner"></div>
        <p>Loading drawing...</p>
      </div>
    );
  }
  
  return (
    <div className="drawing-viewer-container">
      {showToolbar && (
        <div className="drawing-viewer-toolbar">
          <div className="zoom-controls">
            <button onClick={handleZoomIn} title="Zoom In">+</button>
            <span>{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomOut} title="Zoom Out">-</button>
            <button onClick={handleResetView} title="Reset View">Reset</button>
          </div>
          
          {!readOnly && (
            <div className="markup-tools">
              <button 
                className={activeMarkupTool === 'comment' ? 'active' : ''} 
                onClick={() => handleMarkupToolSelect('comment')}
                title="Add Comment"
              >
                Comment
              </button>
              <button 
                className={activeMarkupTool === 'redline' ? 'active' : ''} 
                onClick={() => handleMarkupToolSelect('redline')}
                title="Add Redline"
              >
                Redline
              </button>
              <button 
                className={activeMarkupTool === 'measurement' ? 'active' : ''} 
                onClick={() => handleMarkupToolSelect('measurement')}
                title="Add Measurement"
              >
                Measure
              </button>
            </div>
          )}
        </div>
      )}
      
      <div 
        ref={viewerRef}
        className="drawing-viewer"
        onClick={handleAddMarkup}
        style={{
          cursor: activeMarkupTool ? 'crosshair' : 'grab'
        }}
      >
        <div 
          className="drawing-content"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`
          }}
        >
          {/* In a real implementation, this would render the actual drawing */}
          <div className="drawing-placeholder">
            <p>Drawing Content Would Render Here</p>
            <p>ID: {drawingId}</p>
          </div>
          
          {/* Render markups */}
          <div className="markups-container">
            {markups.map(markup => (
              <div
                key={markup.id}
                className={`markup markup-${markup.type} ${selectedMarkup === markup.id ? 'selected' : ''}`}
                style={{
                  left: `${markup.position.x}px`,
                  top: `${markup.position.y}px`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMarkup(markup.id);
                }}
              >
                {markup.type === 'comment' && (
                  <div className="comment-marker">
                    <span className="comment-icon">💬</span>
                    {selectedMarkup === markup.id && (
                      <div className="comment-popup">
                        <textarea
                          value={markup.content}
                          onChange={(e) => handleUpdateMarkupContent(markup.id, e.target.value)}
                          placeholder="Enter comment..."
                          readOnly={readOnly}
                        />
                        <div className="comment-meta">
                          By: {markup.createdBy} | {new Date(markup.createdAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {markup.type === 'redline' && (
                  <div className="redline-marker">
                    <svg width="100%" height="100%">
                      <line
                        x1={markup.properties?.points[0][0]}
                        y1={markup.properties?.points[0][1]}
                        x2={markup.properties?.points[1][0]}
                        y2={markup.properties?.points[1][1]}
                        stroke={markup.properties?.color || 'red'}
                        strokeWidth={markup.properties?.lineWidth || 2}
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

DrawingViewer.propTypes = {
  drawingId: PropTypes.string.isRequired,
  drawingUrl: PropTypes.string.isRequired,
  initialScale: PropTypes.number,
  showToolbar: PropTypes.bool,
  onMarkupAdded: PropTypes.func,
  onDrawingLoaded: PropTypes.func,
  readOnly: PropTypes.bool
};

export default DrawingViewer;
