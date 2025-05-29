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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  Timeline as GanttIcon,
  CalendarToday as CalendarIcon,
  ViewList as ListIcon,
  Settings as SettingsIcon,
  Optimize as OptimizeIcon,
} from '@mui/icons-material';
import { useApi } from '@/lib/hooks/useApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { ScheduleGanttChart } from '../components/ScheduleGanttChart';
import { ScheduleCalendarView } from '../components/ScheduleCalendarView';
import { ResourceAllocationChart } from '../components/ResourceAllocationChart';

export default function ProductionSchedulingPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    facility: 'all',
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [facilities, setFacilities] = useState([]);
  const [projects, setProjects] = useState([]);

  const { execute: fetchSchedules } = useApi();
  const { execute: fetchFacilities } = useApi();
  const { execute: fetchProjects } = useApi();

  useEffect(() => {
    loadSchedules();
    loadFacilities();
    loadProjects();
  }, [filters, tabValue]);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetchSchedules(() =>
        fetch(`/api/production/schedules?status=${filters.status !== 'all' ? filters.status : ''}&priority=${filters.priority !== 'all' ? filters.priority : ''}&facilityId=${filters.facility !== 'all' ? filters.facility : ''}`)
          .then(res => res.json())
      );

      if (response.success) {
        setSchedules(response.data);
      } else {
        console.error('Failed to load production schedules:', response.error);
      }
    } catch (error) {
      console.error('Error loading production schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await fetchFacilities(() =>
        fetch('/api/facilities')
          .then(res => res.json())
      );

      if (response.success) {
        setFacilities(response.data);
      } else {
        console.error('Failed to load facilities:', response.error);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
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
    setSelectedSchedule(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowAddDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this production schedule?')) {
      try {
        const response = await fetch(`/api/production/schedules/${id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.success) {
          loadSchedules();
        } else {
          console.error('Failed to delete production schedule:', response.error);
        }
      } catch (error) {
        console.error('Error deleting production schedule:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
  };

  const handleGenerateReport = async (id, reportType = 'summary') => {
    try {
      const response = await fetch(`/api/production/schedules/${id}/reports/${reportType}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `production-schedule-${id}-${reportType}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleOptimizeSchedule = async (id) => {
    try {
      const response = await fetch(`/api/production/schedules/${id}/optimize`, {
        method: 'POST',
      }).then(res => res.json());

      if (response.success) {
        loadSchedules();
      } else {
        console.error('Failed to optimize production schedule:', response.error);
      }
    } catch (error) {
      console.error('Error optimizing production schedule:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const filteredSchedules = schedules.filter(schedule => {
    const searchLower = search.toLowerCase();
    return (
      schedule.name.toLowerCase().includes(searchLower) ||
      schedule.description?.toLowerCase().includes(searchLower) ||
      schedule.projectName?.toLowerCase().includes(searchLower) ||
      schedule.facilityName?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'default';
      case 'published': return 'info';
      case 'in_progress': return 'primary';
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

  const renderListView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Facility</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center">Loading production schedules...</TableCell>
            </TableRow>
          ) : filteredSchedules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">No production schedules found.</TableCell>
            </TableRow>
          ) : (
            filteredSchedules.map(schedule => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{schedule.projectName || 'N/A'}</TableCell>
                <TableCell>{schedule.facilityName || 'N/A'}</TableCell>
                <TableCell>{schedule.startDate ? format(new Date(schedule.startDate), 'MMM d, yyyy') : 'Not set'}</TableCell>
                <TableCell>{schedule.endDate ? format(new Date(schedule.endDate), 'MMM d, yyyy') : 'Not set'}</TableCell>
                <TableCell>
                  <Chip 
                    label={schedule.status.replace('_', ' ').charAt(0).toUpperCase() + schedule.status.replace('_', ' ').slice(1)} 
                    size="small" 
                    color={getStatusColor(schedule.status)} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)} 
                    size="small" 
                    color={getPriorityColor(schedule.priority)} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditClick(schedule)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate Report">
                    <IconButton size="small" onClick={() => handleGenerateReport(schedule.id)}>
                      <PdfIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Optimize">
                    <IconButton size="small" onClick={() => handleOptimizeSchedule(schedule.id)}>
                      <OptimizeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(schedule.id)}>
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

  const renderGanttView = () => (
    <Box sx={{ height: 500, width: '100%', mt: 2 }}>
      {loading ? (
        <LinearProgress />
      ) : filteredSchedules.length === 0 ? (
        <Typography align="center">No production schedules found.</Typography>
      ) : (
        <ScheduleGanttChart schedules={filteredSchedules} />
      )}
    </Box>
  );

  const renderCalendarView = () => (
    <Box sx={{ height: 500, width: '100%', mt: 2 }}>
      {loading ? (
        <LinearProgress />
      ) : filteredSchedules.length === 0 ? (
        <Typography align="center">No production schedules found.</Typography>
      ) : (
        <ScheduleCalendarView schedules={filteredSchedules} />
      )}
    </Box>
  );

  const renderResourceView = () => (
    <Box sx={{ height: 500, width: '100%', mt: 2 }}>
      {loading ? (
        <LinearProgress />
      ) : filteredSchedules.length === 0 ? (
        <Typography align="center">No production schedules found.</Typography>
      ) : (
        <ResourceAllocationChart schedules={filteredSchedules} />
      )}
    </Box>
  );

  const renderView = () => {
    switch (viewMode) {
      case 'gantt':
        return renderGanttView();
      case 'calendar':
        return renderCalendarView();
      case 'resources':
        return renderResourceView();
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
            Production Scheduling
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            New Schedule
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Schedules" />
          <Tab label="Draft" />
          <Tab label="Published" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
            <TextField
              fullWidth
              placeholder="Search schedules..."
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
                <ListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gantt Chart">
              <IconButton 
                color={viewMode === 'gantt' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('gantt')}
              >
                <GanttIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Calendar View">
              <IconButton 
                color={viewMode === 'calendar' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('calendar')}
              >
                <CalendarIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Resource Allocation">
              <IconButton 
                color={viewMode === 'resources' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('resources')}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={loadSchedules}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={handleFilterChange('status')}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Facility</InputLabel>
                  <Select
                    value={filters.facility}
                    onChange={handleFilterChange('facility')}
                    label="Facility"
                  >
                    <MenuItem value="all">All Facilities</MenuItem>
                    {facilities.map(facility => (
                      <MenuItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {renderView()}
      </Box>

      <ProductionScheduleDialog 
        open={showAddDialog} 
        onClose={handleDialogClose} 
        schedule={selectedSchedule} 
        onSuccess={loadSchedules}
        facilities={facilities}
        projects={projects}
      />
    </DashboardLayout>
  );
}

function ProductionScheduleDialog({ open, onClose, schedule, onSuccess, facilities, projects }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'draft',
    priority: 'medium',
    projectId: '',
    facilityId: '',
    notes: '',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState([]);
  const [resources, setResources] = useState([]);
  const [shifts, setShifts] = useState([]);

  const { execute: saveSchedule, isLoading } = useApi();

  useEffect(() => {
    if (schedule) {
      setFormData({
        name: schedule.name || '',
        description: schedule.description || '',
        startDate: schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: schedule.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : '',
        status: schedule.status || 'draft',
        priority: schedule.priority || 'medium',
        projectId: schedule.projectId || '',
        facilityId: schedule.facilityId || '',
        notes: schedule.notes || '',
      });
      setItems(schedule.items || []);
      setResources(schedule.resources || []);
      setShifts(schedule.shifts || []);
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'draft',
        priority: 'medium',
        projectId: '',
        facilityId: '',
        notes: '',
      });
      setItems([]);
      setResources([]);
      setShifts([]);
    }
  }, [schedule]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = schedule ? `/api/production/schedules/${schedule.id}` : '/api/production/schedules';
      const method = schedule ? 'PUT' : 'POST';
      
      const data = {
        ...formData,
        items,
        resources,
        shifts,
      };
      
      const response = await saveSchedule(() =>
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
        console.error('Failed to save production schedule:', response.error);
      }
    } catch (error) {
      console.error('Error saving production schedule:', error);
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

  // Resource management functions
  const handleAddResource = (resource) => {
    setResources(prev => [...prev, { ...resource, id: Date.now().toString() }]);
  };

  const handleUpdateResource = (id, updates) => {
    setResources(prev => prev.map(resource => resource.id === id ? { ...resource, ...updates } : resource));
  };

  const handleRemoveResource = (id) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  // Shift management functions
  const handleAddShift = (shift) => {
    setShifts(prev => [...prev, { ...shift, id: Date.now().toString() }]);
  };

  const handleUpdateShift = (id, updates) => {
    setShifts(prev => prev.map(shift => shift.id === id ? { ...shift, ...updates } : shift));
  };

  const handleRemoveShift = (id) => {
    setShifts(prev => prev.filter(shift => shift.id !== id));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{schedule ? 'Edit Production Schedule' : 'Create New Production Schedule'}</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Basic Info" />
            <Tab label="Items" />
            <Tab label="Resources" />
            <Tab label="Shifts" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Schedule Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                />
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange('startDate')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange('endDate')}
                  InputLabelProps={{ shrink: true }}
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
                  <InputLabel>Facility</InputLabel>
                  <Select
                    value={formData.facilityId}
                    onChange={handleChange('facilityId')}
                    label="Facility"
                  >
                    <MenuItem value="">None</MenuItem>
                    {facilities.map(facility => (
                      <MenuItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleChange('status')}
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
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
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange('notes')}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <ScheduleItemsTab 
              items={items} 
              onAddItem={handleAddItem} 
              onUpdateItem={handleUpdateItem} 
              onRemoveItem={handleRemoveItem} 
            />
          )}

          {activeTab === 2 && (
            <ScheduleResourcesTab 
              resources={resources} 
              onAddResource={handleAddResource} 
              onUpdateResource={handleUpdateResource} 
              onRemoveResource={handleRemoveResource} 
            />
          )}

          {activeTab === 3 && (
            <ScheduleShiftsTab 
              shifts={shifts} 
              onAddShift={handleAddShift} 
              onUpdateShift={handleUpdateShift} 
              onRemoveShift={handleRemoveShift} 
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {schedule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// Placeholder components for the dialog tabs
function ScheduleItemsTab({ items, onAddItem, onUpdateItem, onRemoveItem }) {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    duration: 1,
    resourceId: '',
    capacityRequired: 1,
  });

  const handleNewItemChange = (field) => (e) => {
    setNewItem(prev => ({
      ...prev,
      [field]: field === 'duration' || field === 'capacityRequired' ? 
        parseFloat(e.target.value) || 0 : e.target.value,
    }));
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    
    onAddItem(newItem);
    
    setNewItem({
      name: '',
      description: '',
      duration: 1,
      resourceId: '',
      capacityRequired: 1,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Schedule Items
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Duration (days)</TableCell>
              <TableCell align="right">Capacity Required</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.duration}</TableCell>
                <TableCell align="right">{item.capacityRequired}</TableCell>
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
                  value={newItem.duration}
                  onChange={handleNewItemChange('duration')}
                  size="small"
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newItem.capacityRequired}
                  onChange={handleNewItemChange('capacityRequired')}
                  size="small"
                  inputProps={{ min: 1, step: 1 }}
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

function ScheduleResourcesTab({ resources, onAddResource, onUpdateResource, onRemoveResource }) {
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'equipment',
    capacity: 1,
    availability: 100,
  });

  const handleNewResourceChange = (field) => (e) => {
    setNewResource(prev => ({
      ...prev,
      [field]: field === 'capacity' || field === 'availability' ? 
        parseFloat(e.target.value) || 0 : e.target.value,
    }));
  };

  const handleAddResource = () => {
    if (!newResource.name) return;
    
    onAddResource(newResource);
    
    setNewResource({
      name: '',
      type: 'equipment',
      capacity: 1,
      availability: 100,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Resources
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Capacity</TableCell>
              <TableCell align="right">Availability (%)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.name}</TableCell>
                <TableCell>{resource.type}</TableCell>
                <TableCell align="right">{resource.capacity}</TableCell>
                <TableCell align="right">{resource.availability}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onRemoveResource(resource.id)}>
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
                  value={newResource.name}
                  onChange={handleNewResourceChange('name')}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={newResource.type}
                  onChange={handleNewResourceChange('type')}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="equipment">Equipment</MenuItem>
                  <MenuItem value="personnel">Personnel</MenuItem>
                  <MenuItem value="space">Space</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newResource.capacity}
                  onChange={handleNewResourceChange('capacity')}
                  size="small"
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newResource.availability}
                  onChange={handleNewResourceChange('availability')}
                  size="small"
                  inputProps={{ min: 0, max: 100, step: 1 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell align="right">
                <Button size="small" onClick={handleAddResource}>Add</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ScheduleShiftsTab({ shifts, onAddShift, onUpdateShift, onRemoveShift }) {
  const [newShift, setNewShift] = useState({
    name: '',
    startTime: '08:00',
    endTime: '16:00',
    days: 'weekdays',
    capacity: 100,
  });

  const handleNewShiftChange = (field) => (e) => {
    setNewShift(prev => ({
      ...prev,
      [field]: field === 'capacity' ? 
        parseFloat(e.target.value) || 0 : e.target.value,
    }));
  };

  const handleAddShift = () => {
    if (!newShift.name) return;
    
    onAddShift(newShift);
    
    setNewShift({
      name: '',
      startTime: '08:00',
      endTime: '16:00',
      days: 'weekdays',
      capacity: 100,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Shifts
      </Typography>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Days</TableCell>
              <TableCell align="right">Capacity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.name}</TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
                <TableCell>{shift.days}</TableCell>
                <TableCell align="right">{shift.capacity}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onRemoveShift(shift.id)}>
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
                  value={newShift.name}
                  onChange={handleNewShiftChange('name')}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  value={newShift.startTime}
                  onChange={handleNewShiftChange('startTime')}
                  size="small"
                  inputProps={{ step: 300 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="time"
                  value={newShift.endTime}
                  onChange={handleNewShiftChange('endTime')}
                  size="small"
                  inputProps={{ step: 300 }}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={newShift.days}
                  onChange={handleNewShiftChange('days')}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="weekdays">Weekdays</MenuItem>
                  <MenuItem value="weekends">Weekends</MenuItem>
                  <MenuItem value="all">All Days</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={newShift.capacity}
                  onChange={handleNewShiftChange('capacity')}
                  size="small"
                  inputProps={{ min: 1, step: 1 }}
                  sx={{ width: '80px' }}
                />
              </TableCell>
              <TableCell align="right">
                <Button size="small" onClick={handleAddShift}>Add</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
