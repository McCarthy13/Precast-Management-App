import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import YardMap from '../components/YardMap';
import MaterialList from '../components/MaterialList';
import MovementForm from '../components/MovementForm';

/**
 * YardManagementPage
 * Main page component for the Yard Management Module
 */
const YardManagementPage = ({
  materialService,
  locationService,
  movementService,
  equipmentService
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, materials, movements, equipment
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [movementFormData, setMovementFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocationId(location.id);
  };

  // Handle material selection
  const handleMaterialSelect = (material) => {
    setSelectedMaterialId(material.id);
  };

  // Handle create movement button click
  const handleCreateMovement = () => {
    setMovementFormData(null);
    setShowMovementForm(true);
  };

  // Handle move material button click
  const handleMoveMaterial = async (materialId) => {
    setIsLoading(true);
    
    try {
      const material = await materialService.getMaterialById(materialId);
      
      setMovementFormData({
        materialId: material.id,
        quantity: material.quantity,
        fromLocationId: material.location,
        type: 'transfer'
      });
      
      setShowMovementForm(true);
    } catch (err) {
      setError('Failed to load material data. Please try again.');
      console.error('Error loading material data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle movement form submission
  const handleMovementSubmit = (movement) => {
    setShowMovementForm(false);
    
    // Refresh data after movement is created/updated
    // In a real implementation, this would refresh the affected components
  };

  // Handle movement form cancellation
  const handleMovementCancel = () => {
    setShowMovementForm(false);
  };

  return (
    <div className="yard-management-page">
      <div className="module-header">
        <h1>Yard Management</h1>
        
        <div className="module-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Yard Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => handleTabChange('materials')}
          >
            Materials
          </button>
          <button 
            className={`tab-button ${activeTab === 'movements' ? 'active' : ''}`}
            onClick={() => handleTabChange('movements')}
          >
            Movements
          </button>
          <button 
            className={`tab-button ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => handleTabChange('equipment')}
          >
            Equipment
          </button>
        </div>
      </div>
      
      {error && (
        <div className="module-error">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
      
      {showMovementForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <MovementForm
              materialService={materialService}
              locationService={locationService}
              movementService={movementService}
              equipmentService={equipmentService}
              initialData={movementFormData}
              onSubmit={handleMovementSubmit}
              onCancel={handleMovementCancel}
            />
          </div>
        </div>
      )}
      
      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="yard-overview-layout">
            <div className="yard-map-container">
              <YardMap
                locationService={locationService}
                materialService={materialService}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            
            <div className="yard-details-container">
              <div className="yard-details-header">
                <h2>{selectedLocationId ? 'Location Details' : 'Yard Summary'}</h2>
                
                <div className="yard-actions">
                  <button 
                    className="create-movement-button"
                    onClick={handleCreateMovement}
                  >
                    Create Movement
                  </button>
                </div>
              </div>
              
              {selectedLocationId ? (
                <div className="location-materials">
                  <MaterialList
                    materialService={materialService}
                    locationService={locationService}
                    onMaterialSelect={handleMaterialSelect}
                    selectedLocationId={selectedLocationId}
                  />
                </div>
              ) : (
                <div className="yard-summary">
                  <div className="summary-cards">
                    <div className="summary-card">
                      <h3>Materials</h3>
                      <div className="summary-value">247</div>
                      <div className="summary-details">
                        <div>Raw: 125</div>
                        <div>Finished: 122</div>
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <h3>Locations</h3>
                      <div className="summary-value">36</div>
                      <div className="summary-details">
                        <div>Zones: 4</div>
                        <div>Bays: 32</div>
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <h3>Movements</h3>
                      <div className="summary-value">18</div>
                      <div className="summary-details">
                        <div>Pending: 12</div>
                        <div>In Progress: 6</div>
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <h3>Equipment</h3>
                      <div className="summary-value">15</div>
                      <div className="summary-details">
                        <div>Available: 8</div>
                        <div>In Use: 7</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alerts-section">
                    <h3>Alerts & Notifications</h3>
                    <div className="alert-list">
                      <div className="alert-item high">
                        <div className="alert-icon">⚠️</div>
                        <div className="alert-content">
                          <div className="alert-title">Low Inventory: Concrete Mix</div>
                          <div className="alert-description">Current level: 10 cubic yards (below threshold)</div>
                        </div>
                      </div>
                      
                      <div className="alert-item medium">
                        <div className="alert-icon">⚠️</div>
                        <div className="alert-content">
                          <div className="alert-title">Equipment Maintenance Due</div>
                          <div className="alert-description">Forklift 2 scheduled maintenance in 2 days</div>
                        </div>
                      </div>
                      
                      <div className="alert-item low">
                        <div className="alert-icon">ℹ️</div>
                        <div className="alert-content">
                          <div className="alert-title">Zone A Occupancy High</div>
                          <div className="alert-description">Current occupancy: 85% (approaching capacity)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'materials' && (
        <div className="materials-tab">
          <MaterialList
            materialService={materialService}
            locationService={locationService}
            onMaterialSelect={handleMaterialSelect}
          />
        </div>
      )}
      
      {activeTab === 'movements' && (
        <div className="movements-tab">
          <div className="mock-component">
            <h3>Movements Management</h3>
            <p>This tab would contain components for managing material movements:</p>
            <ul>
              <li>Movement list with filtering and sorting</li>
              <li>Movement details and status tracking</li>
              <li>Movement scheduling and execution</li>
              <li>Movement history and reporting</li>
            </ul>
            <button 
              className="create-movement-button"
              onClick={handleCreateMovement}
            >
              Create Movement
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'equipment' && (
        <div className="equipment-tab">
          <div className="mock-component">
            <h3>Equipment Management</h3>
            <p>This tab would contain components for managing yard equipment:</p>
            <ul>
              <li>Equipment inventory and status</li>
              <li>Equipment assignment and tracking</li>
              <li>Maintenance scheduling and history</li>
              <li>Equipment utilization reporting</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

YardManagementPage.propTypes = {
  materialService: PropTypes.object.isRequired,
  locationService: PropTypes.object.isRequired,
  movementService: PropTypes.object.isRequired,
  equipmentService: PropTypes.object.isRequired
};

export default YardManagementPage;
