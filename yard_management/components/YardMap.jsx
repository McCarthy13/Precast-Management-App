import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * YardMapComponent
 * Interactive yard map for visualizing and managing yard locations and materials
 */
const YardMap = ({
  locationService,
  materialService,
  onLocationSelect,
  onMaterialSelect,
  readOnly = false
}) => {
  const [mapData, setMapData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('default'); // default, occupancy, material-type, status
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load yard map data when component mounts
  useEffect(() => {
    loadYardMap();
  }, []);

  // Load yard map data from service
  const loadYardMap = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await locationService.generateYardMap();
      setMapData(data);
    } catch (err) {
      setError('Failed to load yard map. Please try again.');
      console.error('Error loading yard map:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  // Handle mouse down for panning
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse move for panning
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Get location color based on view mode
  const getLocationColor = (location) => {
    switch (viewMode) {
      case 'occupancy':
        // Color based on occupancy percentage
        if (location.occupancy >= 90) return '#e74c3c'; // Red for high occupancy
        if (location.occupancy >= 70) return '#f39c12'; // Orange for medium occupancy
        if (location.occupancy >= 40) return '#f1c40f'; // Yellow for low occupancy
        return '#2ecc71'; // Green for very low occupancy
      
      case 'material-type':
        // In a real implementation, this would color based on predominant material type
        return '#3498db';
      
      case 'status':
        // Color based on location status
        if (location.status === 'maintenance') return '#e74c3c'; // Red for maintenance
        if (location.status === 'reserved') return '#f39c12'; // Orange for reserved
        if (location.status === 'full') return '#f1c40f'; // Yellow for full
        return '#2ecc71'; // Green for active
      
      default:
        // Default coloring based on location type
        if (location.type === 'zone') return '#3498db';
        if (location.type === 'bay') return '#2ecc71';
        if (location.type === 'rack') return '#f1c40f';
        if (location.type === 'shelf') return '#e67e22';
        return '#95a5a6';
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="yard-map-loading">
        <div className="spinner"></div>
        <p>Loading yard map...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="yard-map-error">
        <p>{error}</p>
        <button onClick={loadYardMap}>Retry</button>
      </div>
    );
  }

  // Render no map data state
  if (!mapData) {
    return (
      <div className="yard-map-empty">
        <p>No yard map data available.</p>
      </div>
    );
  }

  return (
    <div className="yard-map-container">
      <div className="yard-map-controls">
        <div className="view-mode-controls">
          <span>View Mode:</span>
          <button 
            className={`view-mode-button ${viewMode === 'default' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('default')}
          >
            Default
          </button>
          <button 
            className={`view-mode-button ${viewMode === 'occupancy' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('occupancy')}
          >
            Occupancy
          </button>
          <button 
            className={`view-mode-button ${viewMode === 'material-type' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('material-type')}
          >
            Material Type
          </button>
          <button 
            className={`view-mode-button ${viewMode === 'status' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('status')}
          >
            Status
          </button>
        </div>
        
        <div className="zoom-controls">
          <button onClick={handleZoomOut} className="zoom-button">
            -
          </button>
          <span>{Math.round(zoomLevel * 100)}%</span>
          <button onClick={handleZoomIn} className="zoom-button">
            +
          </button>
        </div>
      </div>
      
      <div 
        className="yard-map-view"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="yard-map-content"
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
            width: mapData.dimensions.width,
            height: mapData.dimensions.height
          }}
        >
          {mapData.locations.map(location => (
            <div
              key={location.id}
              className={`yard-location ${selectedLocation?.id === location.id ? 'selected' : ''}`}
              style={{
                left: location.coordinates.x,
                top: location.coordinates.y,
                width: location.dimensions?.width || 100,
                height: location.dimensions?.height || 100,
                backgroundColor: getLocationColor(location)
              }}
              onClick={() => handleLocationClick(location)}
            >
              <div className="location-label">{location.name}</div>
              {viewMode === 'occupancy' && (
                <div className="location-occupancy">
                  {location.occupancy}%
                </div>
              )}
              {location.materialCount > 0 && (
                <div className="material-count">
                  {location.materialCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {selectedLocation && (
        <div className="location-details-panel">
          <h3>{selectedLocation.name}</h3>
          <div className="location-details">
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{selectedLocation.type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{selectedLocation.status}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Occupancy:</span>
              <span className="detail-value">{selectedLocation.occupancy}%</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Materials:</span>
              <span className="detail-value">{selectedLocation.materialCount}</span>
            </div>
          </div>
          
          {!readOnly && (
            <div className="location-actions">
              <button className="view-materials-button">
                View Materials
              </button>
              <button className="add-material-button">
                Add Material
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

YardMap.propTypes = {
  locationService: PropTypes.object.isRequired,
  materialService: PropTypes.object.isRequired,
  onLocationSelect: PropTypes.func,
  onMaterialSelect: PropTypes.func,
  readOnly: PropTypes.bool
};

export default YardMap;
