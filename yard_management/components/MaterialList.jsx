import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * MaterialListComponent
 * Component for displaying and managing materials in the yard
 */
const MaterialList = ({
  materialService,
  locationService,
  onMaterialSelect,
  selectedLocationId = null,
  readOnly = false
}) => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: ''
  });
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Load materials when component mounts or selectedLocationId changes
  useEffect(() => {
    loadMaterials();
  }, [selectedLocationId]);

  // Load materials from service
  const loadMaterials = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let fetchedMaterials;
      
      if (selectedLocationId) {
        // If location is selected, get materials for that location
        fetchedMaterials = await materialService.getMaterialsByLocation(selectedLocationId);
      } else {
        // Otherwise, get all materials
        fetchedMaterials = await materialService.getAllMaterials();
      }
      
      setMaterials(fetchedMaterials);
    } catch (err) {
      setError('Failed to load materials. Please try again.');
      console.error('Error loading materials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, sort by the new field in ascending order
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle material selection
  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    if (onMaterialSelect) {
      onMaterialSelect(material);
    }
  };

  // Filter and sort materials
  const getFilteredAndSortedMaterials = () => {
    // First, filter materials
    let filteredMaterials = materials.filter(material => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Type filter
      const matchesType = filters.type === '' || material.type === filters.type;
      
      // Category filter
      const matchesCategory = filters.category === '' || material.category === filters.category;
      
      // Status filter
      const matchesStatus = filters.status === '' || material.status === filters.status;
      
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
    
    // Then, sort materials
    filteredMaterials.sort((a, b) => {
      let comparison = 0;
      
      if (a[sortField] < b[sortField]) {
        comparison = -1;
      } else if (a[sortField] > b[sortField]) {
        comparison = 1;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filteredMaterials;
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const values = [...new Set(materials.map(material => material[field]))];
    return values.filter(value => value); // Remove null/undefined values
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="material-list-loading">
        <div className="spinner"></div>
        <p>Loading materials...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="material-list-error">
        <p>{error}</p>
        <button onClick={loadMaterials}>Retry</button>
      </div>
    );
  }

  const filteredAndSortedMaterials = getFilteredAndSortedMaterials();

  return (
    <div className="material-list-container">
      <div className="material-list-header">
        <h2>Materials {selectedLocationId ? 'in Selected Location' : ''}</h2>
        
        {!readOnly && (
          <button className="create-material-button">
            Add Material
          </button>
        )}
      </div>
      
      <div className="material-list-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="material-search-input"
          />
        </div>
        
        <div className="dropdown-filters">
          <div className="filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {getUniqueValues('type').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {getUniqueValues('category').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {getUniqueValues('status').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="material-list-table-container">
        {filteredAndSortedMaterials.length > 0 ? (
          <table className="material-list-table">
            <thead>
              <tr>
                <th onClick={() => handleSortChange('name')}>
                  Name
                  {sortField === 'name' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSortChange('type')}>
                  Type
                  {sortField === 'type' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSortChange('category')}>
                  Category
                  {sortField === 'category' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSortChange('quantity')}>
                  Quantity
                  {sortField === 'quantity' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSortChange('status')}>
                  Status
                  {sortField === 'status' && (
                    <span className="sort-indicator">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedMaterials.map(material => (
                <tr 
                  key={material.id}
                  className={selectedMaterial?.id === material.id ? 'selected' : ''}
                  onClick={() => handleMaterialClick(material)}
                >
                  <td>{material.name}</td>
                  <td>{material.type}</td>
                  <td>{material.category}</td>
                  <td>{material.quantity} {material.unit}</td>
                  <td>
                    <span className={`status-badge status-${material.status}`}>
                      {material.status}
                    </span>
                  </td>
                  <td>
                    <button className="material-action-button view-button">
                      View
                    </button>
                    {!readOnly && (
                      <>
                        <button className="material-action-button move-button">
                          Move
                        </button>
                        <button className="material-action-button edit-button">
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-materials-message">
            <p>No materials found matching the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

MaterialList.propTypes = {
  materialService: PropTypes.object.isRequired,
  locationService: PropTypes.object.isRequired,
  onMaterialSelect: PropTypes.func,
  selectedLocationId: PropTypes.string,
  readOnly: PropTypes.bool
};

export default MaterialList;
