/**
 * RevisionHistoryComponent
 * React component for displaying and managing drawing revision history
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock component for demonstration purposes
const RevisionHistory = ({
  drawingId,
  onRevisionSelect,
  onRevisionCreate,
  drawingService
}) => {
  const [revisions, setRevisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRevisionId, setSelectedRevisionId] = useState(null);
  const [drawing, setDrawing] = useState(null);

  // Load drawing and revisions when component mounts or drawingId changes
  useEffect(() => {
    if (drawingId) {
      loadDrawingAndRevisions();
    }
  }, [drawingId]);

  // Load drawing and revisions from service
  const loadDrawingAndRevisions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would use the actual service
      // For now, we'll simulate with mock data
      const fetchedDrawing = await drawingService.getDrawingById(drawingId);
      setDrawing(fetchedDrawing);
      
      const fetchedRevisions = await drawingService.getRevisionsByDrawing(drawingId);
      setRevisions(fetchedRevisions);
    } catch (err) {
      setError('Failed to load revision history. Please try again.');
      console.error('Error loading revisions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle revision selection
  const handleRevisionSelect = (revisionId) => {
    setSelectedRevisionId(revisionId);
    if (onRevisionSelect) {
      onRevisionSelect(revisionId);
    }
  };

  // Handle revision creation
  const handleRevisionCreate = async () => {
    if (!drawing) return;
    
    const description = prompt('Enter revision description:');
    if (description) {
      try {
        const currentRevNum = parseInt(drawing.revisionNumber || '0', 10);
        const newRevisionNumber = (currentRevNum + 1).toString();
        
        const newRevision = await drawingService.createRevision(drawingId, {
          revisionNumber: newRevisionNumber,
          description,
          createdBy: 'currentUser'
        });
        
        setRevisions(prev => [...prev, newRevision]);
        
        if (onRevisionCreate) {
          onRevisionCreate(newRevision);
        }
      } catch (err) {
        setError('Failed to create revision. Please try again.');
        console.error('Error creating revision:', err);
      }
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="revision-history-loading">
        <div className="spinner"></div>
        <p>Loading revision history...</p>
      </div>
    );
  }

  return (
    <div className="revision-history-container">
      <div className="revision-history-header">
        <h3>Revision History</h3>
        <button 
          className="create-revision-button"
          onClick={handleRevisionCreate}
        >
          + New Revision
        </button>
      </div>
      
      {error && (
        <div className="revision-history-error">
          {error}
        </div>
      )}
      
      <div className="revision-history-list">
        {revisions.length === 0 ? (
          <div className="no-revisions-message">
            No revisions available.
          </div>
        ) : (
          <table className="revision-history-table">
            <thead>
              <tr>
                <th>Rev #</th>
                <th>Date</th>
                <th>Author</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {revisions.map(revision => (
                <tr 
                  key={revision.id}
                  className={selectedRevisionId === revision.id ? 'selected' : ''}
                  onClick={() => handleRevisionSelect(revision.id)}
                >
                  <td>{revision.revisionNumber}</td>
                  <td>{new Date(revision.createdAt).toLocaleDateString()}</td>
                  <td>{revision.createdBy}</td>
                  <td>
                    <span className={`status-badge status-${revision.status}`}>
                      {revision.status}
                    </span>
                  </td>
                  <td>{revision.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {selectedRevisionId && (
        <div className="revision-details">
          <h4>Revision Details</h4>
          {revisions
            .filter(rev => rev.id === selectedRevisionId)
            .map(revision => (
              <div key={revision.id} className="revision-detail-card">
                <div className="revision-detail-header">
                  <span className="revision-number">Rev {revision.revisionNumber}</span>
                  <span className="revision-date">{new Date(revision.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="revision-detail-body">
                  <p className="revision-description">{revision.description}</p>
                  
                  {revision.comments && revision.comments.length > 0 && (
                    <div className="revision-comments">
                      <h5>Comments</h5>
                      <ul>
                        {revision.comments.map(comment => (
                          <li key={comment.id} className="revision-comment">
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-meta">
                              By: {comment.userId} | {new Date(comment.timestamp).toLocaleString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {revision.changes && revision.changes.length > 0 && (
                    <div className="revision-changes">
                      <h5>Changes</h5>
                      <ul>
                        {revision.changes.map(change => (
                          <li key={change.id} className="revision-change">
                            <div className="change-field">{change.field}</div>
                            <div className="change-values">
                              <span className="old-value">{change.oldValue}</span>
                              <span className="arrow">→</span>
                              <span className="new-value">{change.newValue}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="revision-detail-footer">
                  {revision.status === 'approved' && (
                    <div className="approval-info">
                      Approved by: {revision.approvedBy} on {new Date(revision.approvedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

RevisionHistory.propTypes = {
  drawingId: PropTypes.string.isRequired,
  onRevisionSelect: PropTypes.func,
  onRevisionCreate: PropTypes.func,
  drawingService: PropTypes.object.isRequired
};

export default RevisionHistory;
