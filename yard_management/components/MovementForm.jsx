import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * MovementForm Component
 * Form for creating and managing material movements in the yard
 */
const MovementForm = ({
  materialService,
  locationService,
  movementService,
  equipmentService,
  initialData = null,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: '',
    fromLocationId: '',
    toLocationId: '',
    type: 'transfer',
    scheduledFor: '',
    equipmentId: '',
    operatorId: '',
    notes: ''
  });
  
  const [materials, setMaterials] = useState([]);
  const [locations, setLocations] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [operators, setOperators] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        materialId: initialData.materialId || '',
        quantity: initialData.quantity || '',
        fromLocationId: initialData.fromLocationId || '',
        toLocationId: initialData.toLocationId || '',
        type: initialData.type || 'transfer',
        scheduledFor: initialData.scheduledFor ? new Date(initialData.scheduledFor).toISOString().slice(0, 16) : '',
        equipmentId: initialData.equipmentId || '',
        operatorId: initialData.operatorId || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);
  
  // Load reference data when component mounts
  useEffect(() => {
    loadReferenceData();
  }, []);
  
  // Update available quantity when material or from location changes
  useEffect(() => {
    if (formData.materialId && formData.fromLocationId) {
      updateAvailableQuantity();
    }
  }, [formData.materialId, formData.fromLocationId]);
  
  // Load reference data (materials, locations, equipment, operators)
  const loadReferenceData = async () => {
    setIsLoading(true);
    
    try {
      // Load materials
      const materialsData = await materialService.getAllMaterials();
      setMaterials(materialsData);
      
      // Load locations
      const locationsData = await locationService.getAllLocations();
      setLocations(locationsData);
      
      // Load equipment
      const equipmentData = await equipmentService.getAllEquipment();
      setEquipment(equipmentData);
      
      // Load operators (in a real implementation, this would come from a user/employee service)
      setOperators([
        { id: 'operator1', name: 'John Doe' },
        { id: 'operator2', name: 'Jane Smith' },
        { id: 'operator3', name: 'Bob Johnson' }
      ]);
    } catch (error) {
      console.error('Error loading reference data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update available quantity based on selected material and location
  const updateAvailableQuantity = async () => {
    try {
      // In a real implementation, this would query the actual quantity at the specific location
      const material = materials.find(m => m.id === formData.materialId);
      if (material) {
        setAvailableQuantity(material.quantity);
      }
    } catch (error) {
      console.error('Error updating available quantity:', error);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear related errors when field is changed
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.materialId) newErrors.materialId = 'Material is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (formData.type !== 'receive' && !formData.fromLocationId) newErrors.fromLocationId = 'Source location is required';
    if (formData.type !== 'ship' && !formData.toLocationId) newErrors.toLocationId = 'Destination location is required';
    
    // Numeric validation
    if (formData.quantity && isNaN(formData.quantity)) newErrors.quantity = 'Quantity must be a number';
    
    // Quantity validation
    if (formData.quantity && !isNaN(formData.quantity)) {
      if (parseFloat(formData.quantity) <= 0) {
        newErrors.quantity = 'Quantity must be greater than zero';
      } else if (formData.type !== 'receive' && parseFloat(formData.quantity) > availableQuantity) {
        newErrors.quantity = `Cannot move more than available quantity (${availableQuantity})`;
      }
    }
    
    // Date validation for scheduled movements
    if (formData.scheduledFor) {
      const scheduledDate = new Date(formData.scheduledFor);
      if (scheduledDate <= new Date()) {
        newErrors.scheduledFor = 'Scheduled time must be in the future';
      }
    }
    
    // Same location validation
    if (formData.fromLocationId && formData.toLocationId && formData.fromLocationId === formData.toLocationId) {
      newErrors.toLocationId = 'Source and destination locations cannot be the same';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare movement data
      const movementData = {
        ...formData,
        quantity: parseFloat(formData.quantity)
      };
      
      // Remove empty fields
      Object.keys(movementData).forEach(key => {
        if (movementData[key] === '') {
          delete movementData[key];
        }
      });
      
      // Create or update movement
      let result;
      if (initialData?.id) {
        // Update existing movement
        result = await movementService.updateMovement(initialData.id, movementData);
      } else {
        // Create new movement
        result = await movementService.createMovement(movementData);
      }
      
      // Call onSubmit callback with result
      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      console.error('Error submitting movement:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to submit movement. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <div className="movement-form-container">
      <h2>{initialData?.id ? 'Edit Movement' : 'Create Movement'}</h2>
      
      {isLoading && (
        <div className="form-loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="movement-form">
        {errors.submit && (
          <div className="form-error-message">
            {errors.submit}
          </div>
        )}
        
        <div className="form-section">
          <h3>Movement Details</h3>
          
          <div className="form-group">
            <label htmlFor="type">Movement Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              <option value="transfer">Transfer</option>
              <option value="receive">Receive</option>
              <option value="ship">Ship</option>
              <option value="return">Return</option>
            </select>
            {errors.type && <div className="field-error">{errors.type}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="materialId">Material</label>
            <select
              id="materialId"
              name="materialId"
              value={formData.materialId}
              onChange={handleInputChange}
              disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
              required
            >
              <option value="">Select Material</option>
              {materials.map(material => (
                <option key={material.id} value={material.id}>
                  {material.name} ({material.type}, {material.category})
                </option>
              ))}
            </select>
            {errors.materialId && <div className="field-error">{errors.materialId}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <div className="quantity-input-group">
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
                min="0.01"
                step="0.01"
                required
              />
              {formData.materialId && (
                <span className="available-quantity">
                  Available: {availableQuantity} {materials.find(m => m.id === formData.materialId)?.unit}
                </span>
              )}
            </div>
            {errors.quantity && <div className="field-error">{errors.quantity}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Locations</h3>
          
          {(formData.type === 'transfer' || formData.type === 'ship' || formData.type === 'return') && (
            <div className="form-group">
              <label htmlFor="fromLocationId">From Location</label>
              <select
                id="fromLocationId"
                name="fromLocationId"
                value={formData.fromLocationId}
                onChange={handleInputChange}
                disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
                required={formData.type !== 'receive'}
              >
                <option value="">Select Source Location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.type})
                  </option>
                ))}
              </select>
              {errors.fromLocationId && <div className="field-error">{errors.fromLocationId}</div>}
            </div>
          )}
          
          {(formData.type === 'transfer' || formData.type === 'receive' || formData.type === 'return') && (
            <div className="form-group">
              <label htmlFor="toLocationId">To Location</label>
              <select
                id="toLocationId"
                name="toLocationId"
                value={formData.toLocationId}
                onChange={handleInputChange}
                disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
                required={formData.type !== 'ship'}
              >
                <option value="">Select Destination Location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.type})
                  </option>
                ))}
              </select>
              {errors.toLocationId && <div className="field-error">{errors.toLocationId}</div>}
            </div>
          )}
        </div>
        
        <div className="form-section">
          <h3>Scheduling & Resources</h3>
          
          <div className="form-group">
            <label htmlFor="scheduledFor">Scheduled Time (Optional)</label>
            <input
              type="datetime-local"
              id="scheduledFor"
              name="scheduledFor"
              value={formData.scheduledFor}
              onChange={handleInputChange}
              disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
            />
            {errors.scheduledFor && <div className="field-error">{errors.scheduledFor}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="equipmentId">Equipment (Optional)</label>
            <select
              id="equipmentId"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleInputChange}
              disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
            >
              <option value="">Select Equipment</option>
              {equipment.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.type})
                </option>
              ))}
            </select>
            {errors.equipmentId && <div className="field-error">{errors.equipmentId}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="operatorId">Operator (Optional)</label>
            <select
              id="operatorId"
              name="operatorId"
              value={formData.operatorId}
              onChange={handleInputChange}
              disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
            >
              <option value="">Select Operator</option>
              {operators.map(operator => (
                <option key={operator.id} value={operator.id}>
                  {operator.name}
                </option>
              ))}
            </select>
            {errors.operatorId && <div className="field-error">{errors.operatorId}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={4}
          />
          {errors.notes && <div className="field-error">{errors.notes}</div>}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || (initialData?.id && initialData.status !== 'pending')}
          >
            {initialData?.id ? 'Update Movement' : 'Create Movement'}
          </button>
        </div>
      </form>
    </div>
  );
};

MovementForm.propTypes = {
  materialService: PropTypes.object.isRequired,
  locationService: PropTypes.object.isRequired,
  movementService: PropTypes.object.isRequired,
  equipmentService: PropTypes.object.isRequired,
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default MovementForm;
