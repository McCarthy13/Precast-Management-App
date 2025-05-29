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
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  Engineering as EngineeringIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  BugReport as BugReportIcon,
  Photo as PhotoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { useApi } from '@/lib/hooks/useApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { FieldMapView } from '../components/FieldMapView';
import { PhotoGallery } from '../components/PhotoGallery';
import { SignatureCapture } from '../components/SignatureCapture';
import { WeatherWidget } from '../components/WeatherWidget';

export default function FieldOperationsPage() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    project: 'all',
    client: 'all',
    dateRange: 'all',
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [crew, setCrew] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [showTasksDialog, setShowTasksDialog] = useState(false);
  const [showInspectionsDialog, setShowInspectionsDialog] = useState(false);
  const [showIssuesDialog, setShowIssuesDialog] = useState(false);
  const [showPhotosDialog, setShowPhotosDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const { execute: fetchOperations } = useApi();
  const { execute: fetchProjects } = useApi();
  const { execute: fetchClients } = useApi();
  const { execute: fetchCrew } = useApi();
  const { execute: fetchEquipment } = useApi();

  useEffect(() => {
    loadOperations();
    loadProjects();
    loadClients();
    loadCrew();
    loadEquipment();
  }, [filters, tabValue]);

  const loadOperations = async () => {
    setLoading(true);
    try {
      const statusFilter = tabValue === 0 ? '' : 
                          tabValue === 1 ? 'scheduled' : 
                          tabValue === 2 ? 'in_progress' : 
                          tabValue === 3 ? 'on_hold' : 
                          tabValue === 4 ? 'completed' : 'cancelled';
      
      const response = await fetchOperations(() =>
        fetch(`/api/field?status=${statusFilter || filters.status !== 'all' ? filters.status : ''}&priority=${filters.priority !== 'all' ? filters.priority : ''}&type=${filters.type !== 'all' ? filters.type : ''}&projectId=${filters.project !== 'all' ? filters.project : ''}&clientId=${filters.client !== 'all' ? filters.client : ''}&dateRange=${filters.dateRange !== 'all' ? filters.dateRange : ''}`)
          .then(res => res.json())
      );

      if (response.success) {
        setOperations(response.data);
      } else {
        console.error('Failed to load field operations:', response.error);
      }
    } catch (error) {
      console.error('Error loading field operations:', error);
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

  const loadCrew = async () => {
    try {
      const response = await fetchCrew(() =>
        fetch('/api/crew')
          .then(res => res.json())
      );

      if (response.success) {
        setCrew(response.data);
      } else {
        console.error('Failed to load crew:', response.error);
      }
    } catch (error) {
      console.error('Error loading crew:', error);
    }
  };

  const loadEquipment = async () => {
    try {
      const response = await fetchEquipment(() =>
        fetch('/api/equipment')
          .then(res => res.json())
      );

      if (response.success) {
        setEquipment(response.data);
      } else {
        console.error('Failed to load equipment:', response.error);
      }
    } catch (error) {
      console.error('Error loading equipment:', error);
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
    setSelectedOperation(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (operation) => {
    setSelectedOperation(operation);
    setShowAddDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this field operation?')) {
      try {
        const response = await fetch(`/api/field/${id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.success) {
          loadOperations();
        } else {
          console.error('Failed to delete field operation:', response.error);
        }
      } catch (error) {
        console.error('Error deleting field operation:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setShowTasksDialog(false);
    setShowInspectionsDialog(false);
    setShowIssuesDialog(false);
    setShowPhotosDialog(false);
    setShowCompletionDialog(false);
  };

  const handleGenerateReport = async (id, reportType = 'summary') => {
    try {
      const response = await fetch(`/api/field/${id}/reports/${reportType}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `field-operation-${id}-${reportType}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleTasksClick = (operation) => {
    setSelectedOperation(operation);
    setShowTasksDialog(true);
  };

  const handleInspectionsClick = (operation) => {
    setSelectedOperation(operation);
    setShowInspectionsDialog(true);
  };

  const handleIssuesClick = (operation) => {
    setSelectedOperation(operation);
    setShowIssuesDialog(true);
  };

  const handlePhotosClick = (operation) => {
    setSelectedOperation(operation);
    setShowPhotosDialog(true);
  };

  const handleCompletionClick = (operation) => {
    setSelectedOperation(operation);
    setShowCompletionDialog(true);
  };

  const handleCancelOperation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this field operation?')) {
      try {
        const response = await fetch(`/api/field/${id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: 'User cancelled' }),
        }).then(res => res.json());

        if (response.success) {
          loadOperations();
        } else {
          console.error('Failed to cancel field operation:', response.error);
        }
      } catch (error) {
        console.error('Error cancelling field operation:', error);
      }
    }
  };

  const filteredOperations = operations.filter(operation => {
    const searchLower = search.toLowerCase();
    return (
      operation.operationNumber?.toLowerCase().includes(searchLower) ||
      operation.contactName?.toLowerCase().includes(searchLower) ||
      operation.siteAddress?.toLowerCase().includes(searchLower) ||
      operation.projectName?.toLowerCase().includes(searchLower) ||
      operation.clientName?.toLowerCase().includes(searchLower) ||
      operation.description?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'in_progress': return 'primary';
      case 'on_hold': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'installation': return <BuildIcon />;
      case 'repair': return <EngineeringIcon />;
      case 'maintenance': return <BuildIcon />;
      case 'inspection': return <AssignmentIcon />;
      default: return <BuildIcon />;
    }
  };

  const renderListView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Operation #</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Site Address</TableCell>
            <TableCell>Scheduled Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center">Loading field operations...</TableCell>
            </TableRow>
          ) : filteredOperations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">No field operations found.</TableCell>
            </TableRow>
          ) : (
            filteredOperations.map(operation => (
              <TableRow key={operation.id}>
                <TableCell>{operation.operationNumber}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTypeIcon(operation.type)}
                    <Typography sx={{ ml: 1 }}>
                      {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{operation.projectName || 'N/A'}</TableCell>
                <TableCell>{operation.siteAddress}</TableCell>
                <TableCell>
                  {operation.scheduledStartDate ? format(new Date(operation.scheduledStartDate), 'MMM d, yyyy') : 'Not set'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={operation.status.replace('_', ' ').charAt(0).toUpperCase() + operation.status.replace('_', ' ').slice(1)} 
                    size="small" 
                    color={getStatusColor(operation.status)} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={operation.priority.charAt(0).toUpperCase() + operation.priority.slice(1)} 
                    size="small" 
                    color={getPriorityColor(operation.priority)} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditClick(operation)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Tasks">
                    <IconButton size="small" onClick={() => handleTasksClick(operation)}>
                      <AssignmentIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Issues">
                    <IconButton size="small" onClick={() => handleIssuesClick(operation)}>
                      <BugReportIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Photos">
                    <IconButton size="small" onClick={() => handlePhotosClick(operation)}>
                      <PhotoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {operation.status !== 'completed' && operation.status !== 'cancelled' && (
                    <Tooltip title="Mark as Completed">
                      <IconButton size="small" color="success" onClick={() => handleCompletionClick(operation)}>
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {operation.status !== 'completed' && operation.status !== 'cancelled' && (
                    <Tooltip title="Cancel">
                      <IconButton size="small" color="error" onClick={() => handleCancelOperation(operation.id)}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Generate Report">
                    <IconButton size="small" onClick={() => handleGenerateReport(operation.id, 'summary')}>
                      <PdfIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(operation.id)}>
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
      ) : filteredOperations.length === 0 ? (
        <Typography align="center">No field operations found.</Typography>
      ) : (
        <FieldMapView operations={filteredOperations} />
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
            Field Operations
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            New Field Operation
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Operations" />
          <Tab label="Scheduled" />
          <Tab label="In Progress" />
          <Tab label="On Hold" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
            <TextField
              fullWidth
              placeholder="Search field operations..."
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
                <AssignmentIcon />
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
              <IconButton onClick={loadOperations}>
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
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
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
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={handleFilterChange('type')}
                    label="Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="installation">Installation</MenuItem>
                    <MenuItem value="repair">Repair</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="inspection">Inspection</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
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

      <FieldOperationDialog 
        open={showAddDialog} 
        onClose={handleDialogClose} 
        operation={selectedOperation} 
        onSuccess={loadOperations}
        projects={projects}
        clients={clients}
        crew={crew}
        equipment={equipment}
      />

      <TasksDialog
        open={showTasksDialog}
        onClose={handleDialogClose}
        operation={selectedOperation}
        onSuccess={loadOperations}
      />

      <InspectionsDialog
        open={showInspectionsDialog}
        onClose={handleDialogClose}
        operation={selectedOperation}
        onSuccess={loadOperations}
      />

      <IssuesDialog
        open={showIssuesDialog}
        onClose={handleDialogClose}
        operation={selectedOperation}
        onSuccess={loadOperations}
      />

      <PhotosDialog
        open={showPhotosDialog}
        onClose={handleDialogClose}
        operation={selectedOperation}
        onSuccess={loadOperations}
      />

      <CompletionDialog
        open={showCompletionDialog}
        onClose={handleDialogClose}
        operation={selectedOperation}
        onSuccess={loadOperations}
      />
    </DashboardLayout>
  );
}

function FieldOperationDialog({ open, onClose, operation, onSuccess, projects, clients, crew, equipment }) {
  const [formData, setFormData] = useState({
    operationNumber: '',
    projectId: '',
    clientId: '',
    siteAddress: '',
    status: 'scheduled',
    priority: 'medium',
    scheduledStartDate: new Date().toISOString().split('T')[0],
    scheduledEndDate: '',
    type: 'installation',
    description: '',
    contactName: '',
    contactPhone: '',
    notes: '',
    signatureRequired: true,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [safetyChecklist, setSafetyChecklist] = useState([
    { id: 1, item: 'Site safety briefing conducted', checked: false },
    { id: 2, item: 'PPE requirements verified', checked: false },
    { id: 3, item: 'Emergency procedures reviewed', checked: false },
    { id: 4, item: 'Hazard assessment completed', checked: false },
    { id: 5, item: 'Equipment inspected', checked: false },
  ]);

  const { execute: saveOperation, isLoading } = useApi();

  useEffect(() => {
    if (operation) {
      setFormData({
        operationNumber: operation.operationNumber || '',
        projectId: operation.projectId || '',
        clientId: operation.clientId || '',
        siteAddress: operation.siteAddress || '',
        status: operation.status || 'scheduled',
        priority: operation.priority || 'medium',
        scheduledStartDate: operation.scheduledStartDate ? new Date(operation.scheduledStartDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        scheduledEndDate: operation.scheduledEndDate ? new Date(operation.scheduledEndDate).toISOString().split('T')[0] : '',
        type: operation.type || 'installation',
        description: operation.description || '',
        contactName: operation.contactName || '',
        contactPhone: operation.contactPhone || '',
        notes: operation.notes || '',
        signatureRequired: operation.signatureRequired !== undefined ? operation.signatureRequired : true,
      });
      setSelectedCrew(operation.crew || []);
      setSelectedEquipment(operation.equipment || []);
      setMaterials(operation.materials || []);
      setSafetyChecklist(operation.safetyChecklist || safetyChecklist);
    } else {
      setFormData({
        operationNumber: `FLD-${Date.now().toString().slice(-6)}`,
        projectId: '',
        clientId: '',
        siteAddress: '',
        status: 'scheduled',
        priority: 'medium',
        scheduledStartDate: new Date().toISOString().split('T')[0],
        scheduledEndDate: '',
        type: 'installation',
        description: '',
        contactName: '',
        contactPhone: '',
        notes: '',
        signatureRequired: true,
      });
      setSelectedCrew([]);
      setSelectedEquipment([]);
      setMaterials([]);
      setSafetyChecklist(safetyChecklist);
    }
  }, [operation]);

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
      const url = operation ? `/api/field/${operation.id}` : '/api/field';
      const method = operation ? 'PUT' : 'POST';
      
      const data = {
        ...formData,
        crew: selectedCrew,
        equipment: selectedEquipment,
        materials,
        safetyChecklist,
      };
      
      const response = await saveOperation(() =>
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
        console.error('Failed to save field operation:', response.error);
      }
    } catch (error) {
      console.error('Error saving field operation:', error);
    }
  };

  // Crew management functions
  const handleCrewChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    const selectedCrewObjects = crew.filter(member => selectedIds.includes(member.id));
    setSelectedCrew(selectedCrewObjects);
  };

  // Equipment management functions
  const handleEquipmentChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    const selectedEquipmentObjects = equipment.filter(item => selectedIds.includes(item.id));
    setSelectedEquipment(selectedEquipmentObjects);
  };

  // Material management functions
  const handleAddMaterial = (material) => {
    setMaterials(prev => [...prev, { ...material, id: Date.now().toString() }]);
  };

  const handleRemoveMaterial = (id) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  // Safety checklist functions
  const handleSafetyItemChange = (id) => (e) => {
    setSafetyChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: e.target.checked } : item
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{operation ? 'Edit Field Operation' : 'Create New Field Operation'}</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Basic Info" />
            <Tab label="Resources" />
            <Tab label="Materials" />
            <Tab label="Safety" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Operation Number"
                  value={formData.operationNumber}
                  onChange={handleChange('operationNumber')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleChange('type')}
                    label="Type"
                    required
                  >
                    <MenuItem value="installation">Installation</MenuItem>
                    <MenuItem value="repair">Repair</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="inspection">Inspection</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Site Address"
                  value={formData.siteAddress}
                  onChange={handleChange('siteAddress')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scheduled Start Date"
                  type="date"
                  value={formData.scheduledStartDate}
                  onChange={handleChange('scheduledStartDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scheduled End Date"
                  type="date"
                  value={formData.scheduledEndDate}
                  onChange={handleChange('scheduledEndDate')}
                  InputLabelProps={{ shrink: true }}
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
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange('description')}
                />
              </Grid>
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.signatureRequired}
                      onChange={(e) => setFormData(prev => ({ ...prev, signatureRequired: e.target.checked }))}
                    />
                  }
                  label="Signature Required on Completion"
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Crew Members</InputLabel>
                  <Select
                    multiple
                    native
                    value={selectedCrew.map(c => c.id)}
                    onChange={handleCrewChange}
                    label="Crew Members"
                    inputProps={{
                      id: 'select-multiple-crew',
                    }}
                  >
                    {crew.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Equipment</InputLabel>
                  <Select
                    multiple
                    native
                    value={selectedEquipment.map(e => e.id)}
                    onChange={handleEquipmentChange}
                    label="Equipment"
                    inputProps={{
                      id: 'select-multiple-equipment',
                    }}
                  >
                    {equipment.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Selected Crew Members:</Typography>
                  {selectedCrew.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No crew members selected</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedCrew.map(member => (
                        <Chip 
                          key={member.id} 
                          label={`${member.name} - ${member.role}`} 
                          onDelete={() => setSelectedCrew(prev => prev.filter(c => c.id !== member.id))}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Selected Equipment:</Typography>
                  {selectedEquipment.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No equipment selected</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedEquipment.map(item => (
                        <Chip 
                          key={item.id} 
                          label={`${item.name} - ${item.type}`} 
                          onDelete={() => setSelectedEquipment(prev => prev.filter(e => e.id !== item.id))}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <MaterialsTab 
              materials={materials} 
              onAddMaterial={handleAddMaterial} 
              onRemoveMaterial={handleRemoveMaterial} 
            />
          )}

          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Safety Checklist
                </Typography>
                <List>
                  {safetyChecklist.map((item) => (
                    <ListItem key={item.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.checked}
                            onChange={handleSafetyItemChange(item.id)}
                          />
                        }
                        label={item.item}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Safety Notes"
                  multiline
                  rows={3}
                  value={formData.safetyNotes || ''}
                  onChange={handleChange('safetyNotes')}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {operation ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function MaterialsTab({ materials, onAddMaterial, onRemoveMaterial }) {
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    description: '',
    quantity: 1,
    unit: 'pcs',
  });

  const handleNewMaterialChange = (field) => (e) => {
    setNewMaterial(prev => ({
      ...prev,
      [field]: field === 'quantity' ? 
        parseFloat(e.target.value) || 0 : e.target.value,
    }));
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name) return;
    
    onAddMaterial(newMaterial);
    
    setNewMaterial({
      name: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Materials
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell align="right">{material.quantity}</TableCell>
                <TableCell>{material.unit}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onRemoveMaterial(material.id)}>
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
                  value={newMaterial.name}
                  onChange={handleNewMaterialChange('name')}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  placeholder="Description"
                  value={newMaterial.description}
                  onChange={handleNewMaterialChange('description')}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newMaterial.quantity}
                  onChange={handleNewMaterialChange('quantity')}
                  size="small"
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={newMaterial.unit}
                  onChange={handleNewMaterialChange('unit')}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="pcs">pcs</MenuItem>
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="m">m</MenuItem>
                  <MenuItem value="m2">m²</MenuItem>
                  <MenuItem value="m3">m³</MenuItem>
                  <MenuItem value="l">l</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="right">
                <Button size="small" onClick={handleAddMaterial}>Add</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function TasksDialog({ open, onClose, operation, onSuccess }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    assignedTo: '',
    status: 'pending',
  });
  const { execute: updateTasks, isLoading } = useApi();

  useEffect(() => {
    if (operation) {
      setTasks(operation.tasks || []);
    }
  }, [operation]);

  const handleChange = (field) => (e) => {
    setNewTask(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddTask = () => {
    if (!newTask.name) return;
    
    const task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setTasks(prev => [...prev, task]);
    
    setNewTask({
      name: '',
      description: '',
      assignedTo: '',
      status: 'pending',
    });
  };

  const handleUpdateTaskStatus = (taskId, status) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const handleRemoveTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleSave = async () => {
    if (!operation) return;
    
    try {
      const response = await updateTasks(() =>
        fetch(`/api/field/${operation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...operation,
            tasks,
          }),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to update tasks:', response.error);
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  if (!operation) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tasks - {operation.operationNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add New Task
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Task Name"
                value={newTask.name}
                onChange={handleChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assigned To"
                value={newTask.assignedTo}
                onChange={handleChange('assignedTo')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newTask.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleAddTask}>
                Add Task
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Task List
        </Typography>

        {tasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No tasks added yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{task.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleRemoveTask(task.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function InspectionsDialog({ open, onClose, operation, onSuccess }) {
  const [inspections, setInspections] = useState([]);
  const [newInspection, setNewInspection] = useState({
    title: '',
    description: '',
    inspector: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    findings: '',
  });
  const { execute: updateInspections, isLoading } = useApi();

  useEffect(() => {
    if (operation) {
      setInspections(operation.inspections || []);
    }
  }, [operation]);

  const handleChange = (field) => (e) => {
    setNewInspection(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddInspection = () => {
    if (!newInspection.title) return;
    
    const inspection = {
      ...newInspection,
      id: Date.now().toString(),
    };
    
    setInspections(prev => [...prev, inspection]);
    
    setNewInspection({
      title: '',
      description: '',
      inspector: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      findings: '',
    });
  };

  const handleUpdateInspectionStatus = (inspectionId, status) => {
    setInspections(prev => 
      prev.map(inspection => 
        inspection.id === inspectionId ? { ...inspection, status } : inspection
      )
    );
  };

  const handleRemoveInspection = (inspectionId) => {
    setInspections(prev => prev.filter(inspection => inspection.id !== inspectionId));
  };

  const handleSave = async () => {
    if (!operation) return;
    
    try {
      const response = await updateInspections(() =>
        fetch(`/api/field/${operation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...operation,
            inspections,
          }),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to update inspections:', response.error);
      }
    } catch (error) {
      console.error('Error updating inspections:', error);
    }
  };

  if (!operation) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Inspections - {operation.operationNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add New Inspection
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Inspection Title"
                value={newInspection.title}
                onChange={handleChange('title')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Inspector"
                value={newInspection.inspector}
                onChange={handleChange('inspector')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newInspection.date}
                onChange={handleChange('date')}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newInspection.status}
                  onChange={handleChange('status')}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="passed">Passed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newInspection.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Findings"
                multiline
                rows={2}
                value={newInspection.findings}
                onChange={handleChange('findings')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleAddInspection}>
                Add Inspection
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Inspection List
        </Typography>

        {inspections.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No inspections added yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Inspection</TableCell>
                  <TableCell>Inspector</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{inspection.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {inspection.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{inspection.inspector || 'Unassigned'}</TableCell>
                    <TableCell>{format(new Date(inspection.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Select
                        value={inspection.status}
                        onChange={(e) => handleUpdateInspectionStatus(inspection.id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="passed">Passed</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleRemoveInspection(inspection.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function IssuesDialog({ open, onClose, operation, onSuccess }) {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    reportedBy: '',
    priority: 'medium',
    status: 'open',
  });
  const { execute: updateIssues, isLoading } = useApi();

  useEffect(() => {
    if (operation) {
      setIssues(operation.issues || []);
    }
  }, [operation]);

  const handleChange = (field) => (e) => {
    setNewIssue(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddIssue = () => {
    if (!newIssue.title) return;
    
    const issue = {
      ...newIssue,
      id: Date.now().toString(),
      reportedDate: new Date(),
    };
    
    setIssues(prev => [...prev, issue]);
    
    setNewIssue({
      title: '',
      description: '',
      reportedBy: '',
      priority: 'medium',
      status: 'open',
    });
  };

  const handleUpdateIssueStatus = (issueId, status) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, status } : issue
      )
    );
  };

  const handleRemoveIssue = (issueId) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId));
  };

  const handleSave = async () => {
    if (!operation) return;
    
    try {
      const response = await updateIssues(() =>
        fetch(`/api/field/${operation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...operation,
            issues,
          }),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to update issues:', response.error);
      }
    } catch (error) {
      console.error('Error updating issues:', error);
    }
  };

  if (!operation) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Issues - {operation.operationNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Report New Issue
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issue Title"
                value={newIssue.title}
                onChange={handleChange('title')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reported By"
                value={newIssue.reportedBy}
                onChange={handleChange('reportedBy')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newIssue.priority}
                  onChange={handleChange('priority')}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newIssue.status}
                  onChange={handleChange('status')}
                  label="Status"
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newIssue.description}
                onChange={handleChange('description')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleAddIssue}>
                Report Issue
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Issue List
        </Typography>

        {issues.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No issues reported yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Issue</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Reported Date</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{issue.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {issue.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{issue.reportedBy || 'Anonymous'}</TableCell>
                    <TableCell>{format(new Date(issue.reportedDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} 
                        size="small" 
                        color={
                          issue.priority === 'critical' ? 'error' :
                          issue.priority === 'high' ? 'warning' :
                          issue.priority === 'medium' ? 'info' : 'success'
                        } 
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={issue.status}
                        onChange={(e) => handleUpdateIssueStatus(issue.id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleRemoveIssue(issue.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PhotosDialog({ open, onClose, operation, onSuccess }) {
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    file: null,
  });
  const fileInputRef = useRef(null);
  const { execute: updatePhotos, isLoading } = useApi();

  useEffect(() => {
    if (operation) {
      setPhotos(operation.photos || []);
    }
  }, [operation]);

  const handleChange = (field) => (e) => {
    setNewPhoto(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(prev => ({
        ...prev,
        file: e.target.files[0],
      }));
    }
  };

  const handleAddPhoto = () => {
    if (!newPhoto.title || !newPhoto.file) return;
    
    // In a real implementation, you would upload the file to a server
    // Here we're just simulating it with a local URL
    const photo = {
      id: Date.now().toString(),
      title: newPhoto.title,
      description: newPhoto.description,
      url: URL.createObjectURL(newPhoto.file),
      uploadDate: new Date(),
    };
    
    setPhotos(prev => [...prev, photo]);
    
    setNewPhoto({
      title: '',
      description: '',
      file: null,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleSave = async () => {
    if (!operation) return;
    
    try {
      const response = await updatePhotos(() =>
        fetch(`/api/field/${operation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...operation,
            photos,
          }),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to update photos:', response.error);
      }
    } catch (error) {
      console.error('Error updating photos:', error);
    }
  };

  if (!operation) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Photos - {operation.operationNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Upload New Photo
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                value={newPhoto.title}
                onChange={handleChange('title')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ height: '56px' }}
              >
                {newPhoto.file ? newPhoto.file.name : 'Choose File'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newPhoto.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={handleAddPhoto}
                disabled={!newPhoto.title || !newPhoto.file}
              >
                Upload Photo
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Photo Gallery
        </Typography>

        {photos.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No photos uploaded yet.
          </Typography>
        ) : (
          <PhotoGallery photos={photos} onRemove={handleRemovePhoto} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CompletionDialog({ open, onClose, operation, onSuccess }) {
  const [completionData, setCompletionData] = useState({
    signedBy: '',
    notes: '',
    signature: null,
  });
  const { execute: markAsCompleted, isLoading } = useApi();

  useEffect(() => {
    if (operation) {
      setCompletionData({
        signedBy: '',
        notes: '',
        signature: null,
      });
    }
  }, [operation]);

  const handleChange = (field) => (e) => {
    setCompletionData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSignatureCapture = (signatureData) => {
    setCompletionData(prev => ({
      ...prev,
      signature: signatureData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!operation) return;
    
    if (operation.signatureRequired && !completionData.signature) {
      alert('Signature is required for completion');
      return;
    }
    
    try {
      const response = await markAsCompleted(() =>
        fetch(`/api/field/${operation.id}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(completionData),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to mark as completed:', response.error);
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  };

  if (!operation) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Mark as Completed - {operation.operationNumber}</DialogTitle>
      <DialogContent>
        {operation.status === 'completed' ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            This operation has already been marked as completed on {operation.actualEndDate ? format(new Date(operation.actualEndDate), 'MMM d, yyyy') : 'N/A'}.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Signed By"
                  value={completionData.signedBy}
                  onChange={handleChange('signedBy')}
                  required={operation.signatureRequired}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Completion Notes"
                  multiline
                  rows={3}
                  value={completionData.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
              {operation.signatureRequired && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Signature
                  </Typography>
                  <SignatureCapture onCapture={handleSignatureCapture} />
                  {!completionData.signature && (
                    <Typography color="error" variant="caption">
                      Signature is required for completion
                    </Typography>
                  )}
                </Grid>
              )}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="success" 
                  disabled={isLoading || (operation.signatureRequired && !completionData.signature)}
                >
                  Mark as Completed
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
