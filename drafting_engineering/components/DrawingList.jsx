/**
 * DrawingListComponent
 * React component for displaying and managing a list of drawings
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock component for demonstration purposes
const DrawingList = ({
  projectId,
  onDrawingSelect,
  onDrawingCreate,
  onDrawingDelete,
  drawingService
}) => {
  const [drawings, setDrawings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  // Load drawings when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      loadDrawings();
    }
  }, [projectId]);

  // Load drawings from service
  const loadDrawings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use the actual service
      // For now, we'll simulate with mock data
      const fetchedDrawings = await drawingService.getDrawingsByProject(projectId);
      setDrawings(fetchedDrawings);
    } catch (err) {
      setError('Failed to load drawings. Please try again.');
      console.error('Error loading drawings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drawing selection
  const handleDrawingSelect = (drawingId) => {
    setSelectedDrawingId(drawingId);
    if (onDrawingSelect) {
      onDrawingSelect(drawingId);
    }
  };

  // Handle drawing creation
  const handleDrawingCreate = async () => {
    if (onDrawingCreate) {
      onDrawingCreate();
    } else {
      // Default implementation if no handler provided
      const newDrawingTitle = prompt('Enter drawing title:');
      if (newDrawingTitle) {
        try {
          const newDrawing = await drawingService.createDrawing({
            title: newDrawingTitle,
            projectId,
            drawingNumber: `DWG-${Date.now().toString().substr(-6)}`,
            uploadedBy: 'currentUser'
          });
          
          setDrawings(prev => [...prev, newDrawing]);
        } catch (err) {
          setError('Failed to create drawing. Please try again.');
          console.error('Error creating drawing:', err);
        }
      }
    }
  };

  // Handle drawing deletion
  const handleDrawingDelete = async (drawingId, event) => {
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this drawing?')) {
      try {
        await drawingService.deleteDrawing(drawingId);
        setDrawings(prev => prev.filter(drawing => drawing.id !== drawingId));
        
        if (selectedDrawingId === drawingId) {
          setSelectedDrawingId(null);
        }
        
        if (onDrawingDelete) {
          onDrawingDelete(drawingId);
        }
      } catch (err) {
        setError('Failed to delete drawing. Please try again.');
        console.error('Error deleting drawing:', err);
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort drawings
  const filteredAndSortedDrawings = drawings
    .filter(drawing => 
      drawing.title.toLowerCase().includes(filterText.toLowerCase()) ||
      drawing.drawingNumber.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });

  // Render loading state
  if (isLoading) {
    return (
      <div className="drawing-list-loading">
        <div className="spinner"></div>
        <p>Loading drawings...</p>
      </div>
    );
  }

  return (
    <div className="drawing-list-container">
      <div className="drawing-list-header">
        <h2>Project Drawings</h2>
        <button 
          className="create-drawing-button"
          onClick={handleDrawingCreate}
        >
          + New Drawing
        </button>
      </div>
      
      <div className="drawing-list-filters">
        <input
          type="text"
          placeholder="Search drawings..."
          value={filterText}
          onChange={handleFilterChange}
          className="drawing-search-input"
        />
      </div>
      
      {error && (
        <div className="drawing-list-error">
          {error}
        </div>
      )}
      
      <div className="drawing-list-table-container">
        <table className="drawing-list-table">
          <thead>
            <tr>
              <th onClick={() => handleSortChange('drawingNumber')}>
                Drawing # 
                {sortBy === 'drawingNumber' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSortChange('title')}>
                Title
                {sortBy === 'title' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSortChange('revisionNumber')}>
                Revision
                {sortBy === 'revisionNumber' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSortChange('status')}>
                Status
                {sortBy === 'status' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSortChange('uploadedAt')}>
                Date
                {sortBy === 'uploadedAt' && (
                  <span className="sort-indicator">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedDrawings.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-drawings-message">
                  {filterText ? 'No drawings match your search.' : 'No drawings available.'}
                </td>
              </tr>
            ) : (
              filteredAndSortedDrawings.map(drawing => (
                <tr 
                  key={drawing.id}
                  className={selectedDrawingId === drawing.id ? 'selected' : ''}
                  onClick={() => handleDrawingSelect(drawing.id)}
                >
                  <td>{drawing.drawingNumber}</td>
                  <td>{drawing.title}</td>
                  <td>{drawing.revisionNumber}</td>
                  <td>
                    <span className={`status-badge status-${drawing.status}`}>
                      {drawing.status}
                    </span>
                  </td>
                  <td>{new Date(drawing.uploadedAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="drawing-action-button view-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDrawingSelect(drawing.id);
                      }}
                      title="View Drawing"
                    >
                      View
                    </button>
                    <button 
                      className="drawing-action-button delete-button"
                      onClick={(e) => handleDrawingDelete(drawing.id, e)}
                      title="Delete Drawing"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DrawingList.propTypes = {
  projectId: PropTypes.string.isRequired,
  onDrawingSelect: PropTypes.func,
  onDrawingCreate: PropTypes.func,
  onDrawingDelete: PropTypes.func,
  drawingService: PropTypes.object.isRequired
};

export default DrawingList;
