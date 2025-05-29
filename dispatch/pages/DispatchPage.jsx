import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  LocalShipping as TruckIcon,
  Map as MapIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useApi } from '@/lib/hooks/useApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { MapView } from '../components/MapView';
import { DispatchTrackingTimeline } from '../components/DispatchTrackingTimeline';
import { DeliverySignatureCapture } from '../components/DeliverySignatureCapture';

export default function DispatchPage() {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all',
    client: 'all',
    dateRange: 'all',
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);

  const { execute: fetchDispatches } = useApi();
  const { execute: fetchProjects } = useApi();
  const { execute: fetchClients } = useApi();
  const { execute: fetchVehicles } = useApi();
  const { execute: fetchDrivers } = useApi();

  useEffect(() => {
    loadDispatches();
    loadProjects();
    loadClients();
    loadVehicles();
    loadDrivers();
  }, [filters, tabValue]);

  const loadDispatches = async () => {
    setLoading(true);
    try {
      const statusFilter = tabValue === 0 ? '' : 
                          tabValue === 1 ? 'pending' : 
                          tabValue === 2 ? 'scheduled' : 
                          tabValue === 3 ? 'in_transit' : 
                          tabValue === 4 ? 'delivered' : 'cancelled';
      
      const response = await fetchDispatches(() =>
        fetch(`/api/dispatch?status=${statusFilter || filters.status !== 'all' ? filters.status : ''}&priority=${filters.priority !== 'all' ? filters.priority : ''}&projectId=${filters.project !== 'all' ? filters.project : ''}&clientId=${filters.client !== 'all' ? filters.client : ''}&dateRange=${filters.dateRange !== 'all' ? filters.dateRange : ''}`)
          .then(res => res.json())
      );

      if (response.success) {
        setDispatches(response.data);
      } else {
        console.error('Failed to load dispatches:', response.error);
      }
    } catch (error) {
      console.error('Error loading dispatches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetchProjects(() =>
        fetch('/api/projects')
          .then(res => res.json())
      );

      if (response.success) {
        setProjects(response.data);
      } else {
        console.error('Failed to load projects:', response.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await fetchClients(() =>
        fetch('/api/clients')
          .then(res => res.json())
      );

      if (response.success) {
        setClients(response.data);
      } else {
        console.error('Failed to load clients:', response.error);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await fetchVehicles(() =>
        fetch('/api/vehicles')
          .then(res => res.json())
      );

      if (response.success) {
        setVehicles(response.data);
      } else {
        console.error('Failed to load vehicles:', response.error);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await fetchDrivers(() =>
        fetch('/api/drivers')
          .then(res => res.json())
      );

      if (response.success) {
        setDrivers(response.data);
      } else {
        console.error('Failed to load drivers:', response.error);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (field) => (e) => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddClick = () => {
    setSelectedDispatch(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (dispatch) => {
    setSelectedDispatch(dispatch);
    setShowAddDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this dispatch?')) {
      try {
        const response = await fetch(`/api/dispatch/${id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.success) {
          loadDispatches();
        } else {
          console.error('Failed to delete dispatch:', response.error);
        }
      } catch (error) {
        console.error('Error deleting dispatch:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setShowTrackingDialog(false);
    setShowDeliveryDialog(false);
    setShowMapDialog(false);
  };

  const handleGenerateDocument = async (id, documentType = 'delivery_note') => {
    try {
      const response = await fetch(`/api/dispatch/${id}/documents/${documentType}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dispatch-${id}-${documentType}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  const handleOptimizeRoutes = async () => {
    try {
      const selectedIds = dispatches
        .filter(d => d.status === 'scheduled')
        .map(d => d.id);
        
      if (selectedIds.length === 0) {
        alert('No scheduled dispatches to optimize');
        return;
      }
      
      const response = await fetch('/api/dispatch/optimize-routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dispatchIds: selectedIds }),
      }).then(res => res.json());

      if (response.success) {
        loadDispatches();
        alert('Routes optimized successfully');
      } else {
        console.error('Failed to optimize routes:', response.error);
      }
    } catch (error) {
      console.error('Error optimizing routes:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleTrackingClick = (dispatch) => {
    setSelectedDispatch(dispatch);
    setShowTrackingDialog(true);
  };

  const handleDeliveryClick = (dispatch) => {
    setSelectedDispatch(dispatch);
    setShowDeliveryDialog(true);
  };

  const handleMapClick = (dispatch) => {
    setSelectedDispatch(dispatch);
    setShowMapDialog(true);
  };

  const handleCancelDispatch = async (id) => {
    if (window.confirm('Are you sure you want to cancel this dispatch?')) {
      try {
        const response = await fetch(`/api/dispatch/${id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: 'User cancelled' }),
        }).then(res => res.json());

        if (response.success) {
          loadDispatches();
        } else {
          console.error('Failed to cancel dispatch:', response.error);
        }
      } catch (error) {
        console.error('Error cancelling dispatch:', error);
      }
    }
  };

  const filteredDispatches = dispatches.filter(dispatch => {
    const searchLower = search.toLowerCase();
    return (
      dispatch.dispatchNumber?.toLowerCase().includes(searchLower) ||
      dispatch.contactName?.toLowerCase().includes(searchLower) ||
      dispatch.deliveryAddress?.toLowerCase().includes(searchLower) ||
      dispatch.projectName?.toLowerCase().includes(searchLower) ||
      dispatch.clientName?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'scheduled': return 'info';
      case 'in_transit': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      case 'delayed': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const renderListView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dispatch #</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Scheduled Date</TableCell>
            <TableCell>Delivery Address</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center">Loading dispatches...</TableCell>
            </TableRow>
          ) : filteredDispatches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">No dispatches found.</TableCell>
            </TableRow>
          ) : (
            filteredDispatches.map(dispatch => (
              <TableRow key={dispatch.id}>
                <TableCell>{dispatch.dispatchNumber}</TableCell>
                <TableCell>{dispatch.projectName || 'N/A'}</TableCell>
                <TableCell>{dispatch.clientName || 'N/A'}</TableCell>
                <TableCell>{dispatch.scheduledDate ? format(new Date(dispatch.scheduledDate), 'MMM d, yyyy') : 'Not set'}</TableCell>
                <TableCell>{dispatch.deliveryAddress}</TableCell>
                <TableCell>
                  <Chip 
                    label={dispatch.status.replace('_', ' ').charAt(0).toUpperCase() + dispatch.status.replace('_', ' ').slice(1)} 
                    size="small" 
                    color={getStatusColor(dispatch.status)} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={dispatch.priority.charAt(0).toUpperCase() + dispatch.priority.slice(1)} 
                    size="small" 
                    color={getPriorityColor(dispatch.priority)} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditClick(dispatch)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Tracking">
                    <IconButton size="small" onClick={() => handleTrackingClick(dispatch)}>
                      <TimelineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Map">
                    <IconButton size="small" onClick={() => handleMapClick(dispatch)}>
                      <MapIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {dispatch.status !== 'delivered' && dispatch.status !== 'cancelled' && (
                    <Tooltip title="Mark as Delivered">
                      <IconButton size="small" color="success" onClick={() => handleDeliveryClick(dispatch)}>
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {dispatch.status !== 'delivered' && dispatch.status !== 'cancelled' && (
                    <Tooltip title="Cancel">
                      <IconButton size="small" color="error" onClick={() => handleCancelDispatch(dispatch.id)}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Generate Delivery Note">
                    <IconButton size="small" onClick={() => handleGenerateDocument(dispatch.id, 'delivery_note')}>
                      <PdfIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(dispatch.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMapView = () => (
    <Box sx={{ height: 500, width: '100%', mt: 2 }}>
      {loading ? (
        <LinearProgress />
      ) : filteredDispatches.length === 0 ? (
        <Typography align="center">No dispatches found.</Typography>
      ) : (
        <MapView dispatches={filteredDispatches} />
      )}
    </Box>
  );

  const renderView = () => {
    switch (viewMode) {
      case 'map':
        return renderMapView();
      case 'list':
      default:
        return renderListView();
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Dispatch Management
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<TruckIcon />}
              onClick={handleOptimizeRoutes}
              sx={{ mr: 2 }}
            >
              Optimize Routes
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              New Dispatch
            </Button>
          </Box>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Dispatches" />
          <Tab label="Pending" />
          <Tab label="Scheduled" />
          <Tab label="In Transit" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
        </Tabs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
            <TextField
              fullWidth
              placeholder="Search dispatches..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ mr: 2 }}
            />
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon />
            </IconButton>
          </Box>
          <Box>
            <Tooltip title="List View">
              <IconButton 
                color={viewMode === 'list' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('list')}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Map View">
              <IconButton 
                color={viewMode === 'map' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('map')}
              >
                <MapIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={loadDispatches}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={handleFilterChange('status')}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="in_transit">In Transit</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="delayed">Delayed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filters.priority}
                    onChange={handleFilterChange('priority')}
                    label="Priority"
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={filters.project}
                    onChange={handleFilterChange('project')}
                    label="Project"
                  >
                    <MenuItem value="all">All Projects</MenuItem>
                    {projects.map(project => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={filters.client}
                    onChange={handleFilterChange('client')}
                    label="Client"
                  >
                    <MenuItem value="all">All Clients</MenuItem>
                    {clients.map(client => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={filters.dateRange}
                    onChange={handleFilterChange('dateRange')}
                    label="Date Range"
                  >
                    <MenuItem value="all">All Dates</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="tomorrow">Tomorrow</MenuItem>
                    <MenuItem value="this_week">This Week</MenuItem>
                    <MenuItem value="next_week">Next Week</MenuItem>
                    <MenuItem value="this_month">This Month</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {renderView()}
      </Box>

      <DispatchDialog 
        open={showAddDialog} 
        onClose={handleDialogClose} 
        dispatch={selectedDispatch} 
        onSuccess={loadDispatches}
        projects={projects}
        clients={clients}
        vehicles={vehicles}
        drivers={drivers}
      />

      <TrackingDialog
        open={showTrackingDialog}
        onClose={handleDialogClose}
        dispatch={selectedDispatch}
        onSuccess={loadDispatches}
      />

      <DeliveryDialog
        open={showDeliveryDialog}
        onClose={handleDialogClose}
        dispatch={selectedDispatch}
        onSuccess={loadDispatches}
      />

      <MapDialog
        open={showMapDialog}
        onClose={handleDialogClose}
        dispatch={selectedDispatch}
      />
    </DashboardLayout>
  );
}

function DispatchDialog({ open, onClose, dispatch, onSuccess, projects, clients, vehicles, drivers }) {
  const [formData, setFormData] = useState({
    dispatchNumber: '',
    projectId: '',
    clientId: '',
    status: 'pending',
    priority: 'medium',
    scheduledDate: new Date().toISOString().split('T')[0],
    deliveryAddress: '',
    contactName: '',
    contactPhone: '',
    notes: '',
    specialInstructions: '',
    signatureRequired: true,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const { execute: saveDispatch, isLoading } = useApi();

  useEffect(() => {
    if (dispatch) {
      setFormData({
        dispatchNumber: dispatch.dispatchNumber || '',
        projectId: dispatch.projectId || '',
        clientId: dispatch.clientId || '',
        status: dispatch.status || 'pending',
        priority: dispatch.priority || 'medium',
        scheduledDate: dispatch.scheduledDate ? new Date(dispatch.scheduledDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        deliveryAddress: dispatch.deliveryAddress || '',
        contactName: dispatch.contactName || '',
        contactPhone: dispatch.contactPhone || '',
        notes: dispatch.notes || '',
        specialInstructions: dispatch.specialInstructions || '',
        signatureRequired: dispatch.signatureRequired !== undefined ? dispatch.signatureRequired : true,
      });
      setItems(dispatch.items || []);
      setSelectedVehicles(dispatch.vehicles || []);
      setSelectedDrivers(dispatch.drivers || []);
    } else {
      setFormData({
        dispatchNumber: `DSP-${Date.now().toString().slice(-6)}`,
        projectId: '',
        clientId: '',
        status: 'pending',
        priority: 'medium',
        scheduledDate: new Date().toISOString().split('T')[0],
        deliveryAddress: '',
        contactName: '',
        contactPhone: '',
        notes: '',
        specialInstructions: '',
        signatureRequired: true,
      });
      setItems([]);
      setSelectedVehicles([]);
      setSelectedDrivers([]);
    }
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'signatureRequired' ? e.target.checked : e.target.value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = dispatch ? `/api/dispatch/${dispatch.id}` : '/api/dispatch';
      const method = dispatch ? 'PUT' : 'POST';
      
      const data = {
        ...formData,
        items,
        vehicles: selectedVehicles,
        drivers: selectedDrivers,
      };
      
      const response = await saveDispatch(() =>
        fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to save dispatch:', response.error);
      }
    } catch (error) {
      console.error('Error saving dispatch:', error);
    }
  };

  // Item management functions
  const handleAddItem = (item) => {
    setItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const handleUpdateItem = (id, updates) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Vehicle management functions
  const handleVehicleChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    const selectedVehicleObjects = vehicles.filter(vehicle => selectedIds.includes(vehicle.id));
    setSelectedVehicles(selectedVehicleObjects);
  };

  // Driver management functions
  const handleDriverChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    const selectedDriverObjects = drivers.filter(driver => selectedIds.includes(driver.id));
    setSelectedDrivers(selectedDriverObjects);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{dispatch ? 'Edit Dispatch' : 'Create New Dispatch'}</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Basic Info" />
            <Tab label="Items" />
            <Tab label="Transport" />
            <Tab label="Instructions" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Dispatch Number"
                  value={formData.dispatchNumber}
                  onChange={handleChange('dispatchNumber')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={formData.projectId}
                    onChange={handleChange('projectId')}
                    label="Project"
                  >
                    <MenuItem value="">None</MenuItem>
                    {projects.map(project => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={formData.clientId}
                    onChange={handleChange('clientId')}
                    label="Client"
                  >
                    <MenuItem value="">None</MenuItem>
                    {clients.map(client => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scheduled Date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleChange('scheduledDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  value={formData.deliveryAddress}
                  onChange={handleChange('deliveryAddress')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  value={formData.contactName}
                  onChange={handleChange('contactName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={formData.contactPhone}
                  onChange={handleChange('contactPhone')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleChange('status')}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="in_transit">In Transit</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="delayed">Delayed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleChange('priority')}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <DispatchItemsTab 
              items={items} 
              onAddItem={handleAddItem} 
              onUpdateItem={handleUpdateItem} 
              onRemoveItem={handleRemoveItem} 
            />
          )}

          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Vehicles</InputLabel>
                  <Select
                    multiple
                    native
                    value={selectedVehicles.map(v => v.id)}
                    onChange={handleVehicleChange}
                    label="Vehicles"
                    inputProps={{
                      id: 'select-multiple-vehicles',
                    }}
                  >
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} - {vehicle.licensePlate}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Drivers</InputLabel>
                  <Select
                    multiple
                    native
                    value={selectedDrivers.map(d => d.id)}
                    onChange={handleDriverChange}
                    label="Drivers"
                    inputProps={{
                      id: 'select-multiple-drivers',
                    }}
                  >
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Selected Vehicles:</Typography>
                  {selectedVehicles.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No vehicles selected</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedVehicles.map(vehicle => (
                        <Chip 
                          key={vehicle.id} 
                          label={`${vehicle.name} - ${vehicle.licensePlate}`} 
                          onDelete={() => setSelectedVehicles(prev => prev.filter(v => v.id !== vehicle.id))}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Selected Drivers:</Typography>
                  {selectedDrivers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No drivers selected</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedDrivers.map(driver => (
                        <Chip 
                          key={driver.id} 
                          label={driver.name} 
                          onDelete={() => setSelectedDrivers(prev => prev.filter(d => d.id !== driver.id))}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Instructions"
                  multiline
                  rows={3}
                  value={formData.specialInstructions}
                  onChange={handleChange('specialInstructions')}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.signatureRequired}
                      onChange={(e) => setFormData(prev => ({ ...prev, signatureRequired: e.target.checked }))}
                    />
                    Signature Required on Delivery
                  </label>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {dispatch ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function DispatchItemsTab({ items, onAddItem, onUpdateItem, onRemoveItem }) {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    weight: 0,
    volume: 0,
  });

  const handleNewItemChange = (field) => (e) => {
    setNewItem(prev => ({
      ...prev,
      [field]: field === 'quantity' || field === 'weight' || field === 'volume' ? 
        parseFloat(e.target.value) || 0 : e.target.value,
    }));
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    
    onAddItem(newItem);
    
    setNewItem({
      name: '',
      description: '',
      quantity: 1,
      weight: 0,
      volume: 0,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Dispatch Items
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Weight (kg)</TableCell>
              <TableCell align="right">Volume (m³)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.weight}</TableCell>
                <TableCell align="right">{item.volume}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onRemoveItem(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField
                  fullWidth
                  placeholder="Name"
                  value={newItem.name}
                  onChange={handleNewItemChange('name')}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  placeholder="Description"
                  value={newItem.description}
                  onChange={handleNewItemChange('description')}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newItem.quantity}
                  onChange={handleNewItemChange('quantity')}
                  size="small"
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newItem.weight}
                  onChange={handleNewItemChange('weight')}
                  size="small"
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newItem.volume}
                  onChange={handleNewItemChange('volume')}
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell align="right">
                <Button size="small" onClick={handleAddItem}>Add</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function TrackingDialog({ open, onClose, dispatch, onSuccess }) {
  const [newUpdate, setNewUpdate] = useState({
    status: '',
    location: '',
    notes: '',
  });
  const { execute: addTrackingUpdate, isLoading } = useApi();

  useEffect(() => {
    if (dispatch) {
      setNewUpdate({
        status: dispatch.status,
        location: '',
        notes: '',
      });
    }
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setNewUpdate(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!dispatch) return;
    
    try {
      const response = await addTrackingUpdate(() =>
        fetch(`/api/dispatch/${dispatch.id}/tracking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUpdate),
        }).then(res => res.json())
      );

      if (response.success) {
        setNewUpdate({
          status: dispatch.status,
          location: '',
          notes: '',
        });
        onSuccess();
      } else {
        console.error('Failed to add tracking update:', response.error);
      }
    } catch (error) {
      console.error('Error adding tracking update:', error);
    }
  };

  if (!dispatch) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tracking Updates - {dispatch.dispatchNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <DispatchTrackingTimeline trackingUpdates={dispatch.trackingUpdates || []} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Add New Update
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newUpdate.status}
                  onChange={handleChange('status')}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in_transit">In Transit</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={newUpdate.location}
                onChange={handleChange('location')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newUpdate.notes}
                onChange={handleChange('notes')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={isLoading}>
                Add Update
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function DeliveryDialog({ open, onClose, dispatch, onSuccess }) {
  const [deliveryData, setDeliveryData] = useState({
    signedBy: '',
    notes: '',
    signature: null,
  });
  const { execute: markAsDelivered, isLoading } = useApi();

  useEffect(() => {
    if (dispatch) {
      setDeliveryData({
        signedBy: '',
        notes: '',
        signature: null,
      });
    }
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setDeliveryData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSignatureCapture = (signatureData) => {
    setDeliveryData(prev => ({
      ...prev,
      signature: signatureData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!dispatch) return;
    
    if (dispatch.signatureRequired && !deliveryData.signature) {
      alert('Signature is required for this delivery');
      return;
    }
    
    try {
      const response = await markAsDelivered(() =>
        fetch(`/api/dispatch/${dispatch.id}/deliver`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deliveryData),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to mark as delivered:', response.error);
      }
    } catch (error) {
      console.error('Error marking as delivered:', error);
    }
  };

  if (!dispatch) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Mark as Delivered - {dispatch.dispatchNumber}</DialogTitle>
      <DialogContent>
        {dispatch.status === 'delivered' ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            This dispatch has already been marked as delivered on {dispatch.actualDate ? format(new Date(dispatch.actualDate), 'MMM d, yyyy') : 'N/A'}.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Signed By"
                  value={deliveryData.signedBy}
                  onChange={handleChange('signedBy')}
                  required={dispatch.signatureRequired}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Notes"
                  multiline
                  rows={2}
                  value={deliveryData.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
              {dispatch.signatureRequired && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Signature
                  </Typography>
                  <DeliverySignatureCapture onCapture={handleSignatureCapture} />
                  {!deliveryData.signature && (
                    <Typography color="error" variant="caption">
                      Signature is required for this delivery
                    </Typography>
                  )}
                </Grid>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="success" disabled={isLoading || (dispatch.signatureRequired && !deliveryData.signature)}>
                  Mark as Delivered
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function MapDialog({ open, onClose, dispatch }) {
  if (!dispatch) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Map View - {dispatch.dispatchNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ height: 500, width: '100%' }}>
          <MapView dispatches={[dispatch]} singleDispatch />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
