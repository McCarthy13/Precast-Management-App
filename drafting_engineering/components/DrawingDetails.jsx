/**
 * DrawingDetailsComponent
 * React component for displaying and editing drawing details
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock component for demonstration purposes
const DrawingDetails = ({
  drawingId,
  onDrawingUpdate,
  drawingService,
  readOnly = false
}) => {
  const [drawing, setDrawing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Load drawing when component mounts or drawingId changes
  useEffect(() => {
    if (drawingId) {
      loadDrawing();
    }
  }, [drawingId]);

  // Load drawing from service
  const loadDrawing = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use the actual service
      const fetchedDrawing = await drawingService.getDrawingById(drawingId);
      setDrawing(fetchedDrawing);
      setFormData({
        title: fetchedDrawing.title,
        description: fetchedDrawing.description || '',
        drawingNumber: fetchedDrawing.drawingNumber,
        revisionNumber: fetchedDrawing.revisionNumber,
        status: fetchedDrawing.status,
        tags: fetchedDrawing.tags ? fetchedDrawing.tags.join(', ') : ''
      });
    } catch (err) {
      setError('Failed to load drawing details. Please try again.');
      console.error('Error loading drawing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      const updatedDrawing = await drawingService.updateDrawing(drawingId, processedData);
      setDrawing(updatedDrawing);
      setIsEditing(false);
      
      if (onDrawingUpdate) {
        onDrawingUpdate(updatedDrawing);
      }
    } catch (err) {
      setError('Failed to update drawing. Please try again.');
      console.error('Error updating drawing:', err);
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      const updatedDrawing = await drawingService.updateDrawing(drawingId, {
        status: newStatus,
        lastModifiedBy: 'currentUser',
        lastModifiedAt: new Date()
      });
      
      setDrawing(updatedDrawing);
      setFormData(prev => ({
        ...prev,
        status: newStatus
      }));
      
      if (onDrawingUpdate) {
        onDrawingUpdate(updatedDrawing);
      }
    } catch (err) {
      setError('Failed to update drawing status. Please try again.');
      console.error('Error updating drawing status:', err);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="drawing-details-loading">
        <div className="spinner"></div>
        <p>Loading drawing details...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="drawing-details-error">
        <p>{error}</p>
        <button onClick={loadDrawing}>Retry</button>
      </div>
    );
  }

  // Render no drawing state
  if (!drawing) {
    return (
      <div className="drawing-details-empty">
        <p>No drawing selected.</p>
      </div>
    );
  }

  return (
    <div className="drawing-details-container">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="drawing-edit-form">
          <h3>Edit Drawing Details</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="drawingNumber">Drawing Number</label>
            <input
              type="text"
              id="drawingNumber"
              name="drawingNumber"
              value={formData.drawingNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="revisionNumber">Revision Number</label>
            <input
              type="text"
              id="revisionNumber"
              name="revisionNumber"
              value={formData.revisionNumber}
              onChange={handleInputChange}
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="draft">Draft</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="released">Released</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., foundation, structural, concrete"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-button">Save Changes</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="drawing-details-view">
          <div className="drawing-details-header">
            <h3>{drawing.title}</h3>
            {!readOnly && (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
          
          <div className="drawing-details-info">
            <div className="info-row">
              <span className="info-label">Drawing Number:</span>
              <span className="info-value">{drawing.drawingNumber}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Revision:</span>
              <span className="info-value">{drawing.revisionNumber}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className={`status-badge status-${drawing.status}`}>
                {drawing.status}
              </span>
              
              {!readOnly && (
                <div className="status-actions">
                  {drawing.status === 'draft' && (
                    <button 
                      onClick={() => handleStatusChange('in-review')}
                      className="status-action-button"
                    >
                      Submit for Review
                    </button>
                  )}
                  
                  {drawing.status === 'in-review' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange('approved')}
                        className="status-action-button approve-button"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange('draft')}
                        className="status-action-button reject-button"
                      >
                        Return to Draft
                      </button>
                    </>
                  )}
                  
                  {drawing.status === 'approved' && (
                    <button 
                      onClick={() => handleStatusChange('released')}
                      className="status-action-button release-button"
                    >
                      Release
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="info-row">
              <span className="info-label">Created By:</span>
              <span className="info-value">{drawing.uploadedBy}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Created On:</span>
              <span className="info-value">{new Date(drawing.uploadedAt).toLocaleString()}</span>
            </div>
            
            {drawing.lastModifiedBy && (
              <div className="info-row">
                <span className="info-label">Last Modified By:</span>
                <span className="info-value">{drawing.lastModifiedBy}</span>
              </div>
            )}
            
            {drawing.lastModifiedAt && (
              <div className="info-row">
                <span className="info-label">Last Modified On:</span>
                <span className="info-value">{new Date(drawing.lastModifiedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="drawing-description">
            <h4>Description</h4>
            <p>{drawing.description || 'No description provided.'}</p>
          </div>
          
          {drawing.tags && drawing.tags.length > 0 && (
            <div className="drawing-tags">
              <h4>Tags</h4>
              <div className="tags-list">
                {drawing.tags.map(tag => (
                  <span key={tag} className="tag-badge">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

DrawingDetails.propTypes = {
  drawingId: PropTypes.string.isRequired,
  onDrawingUpdate: PropTypes.func,
  drawingService: PropTypes.object.isRequired,
  readOnly: PropTypes.bool
};

export default DrawingDetails;
