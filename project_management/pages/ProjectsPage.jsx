import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  Assignment as TaskIcon,
  Group as TeamIcon,
  AttachMoney as BudgetIcon,
  Timeline as TimelineIcon,
  Flag as FlagIcon,
  CheckCircle as CompletedIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useApi } from '@/lib/hooks/useApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const { execute: fetchProjects } = useApi();

  useEffect(() => {
    loadProjects();
  }, [filters, tabValue]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetchProjects(() =>
        fetch(`/api/projects?status=${filters.status !== 'all' ? filters.status : ''}&priority=${filters.priority !== 'all' ? filters.priority : ''}`)
          .then(res => res.json())
      );

      if (response.success) {
        setProjects(response.data);
      } else {
        console.error('Failed to load projects:', response.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
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
    setSelectedProject(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowAddDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.success) {
          loadProjects();
        } else {
          console.error('Failed to delete project:', response.error);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
  };

  const handleGenerateReport = async (id, reportType = 'summary') => {
    try {
      const response = await fetch(`/api/projects/${id}/reports/${reportType}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${id}-${reportType}.pdf`;
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

  const filteredProjects = projects.filter(project => {
    const searchLower = search.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.clientName?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'default';
      case 'in_progress': return 'info';
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Project Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            New Project
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Projects" />
          <Tab label="In Progress" />
          <Tab label="Planning" />
          <Tab label="On Hold" />
          <Tab label="Completed" />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search projects..."
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

        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={handleFilterChange('status')}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="planning">Planning</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="on_hold">On Hold</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
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
            </Grid>
          </Box>
        )}

        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography>Loading projects...</Typography>
            </Grid>
          ) : filteredProjects.length === 0 ? (
            <Grid item xs={12}>
              <Typography>No projects found.</Typography>
            </Grid>
          ) : (
            filteredProjects.map(project => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                        {project.name}
                      </Typography>
                      <Box>
                        <Chip 
                          label={project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.replace('_', ' ').slice(1)} 
                          size="small" 
                          color={getStatusColor(project.status)} 
                          sx={{ mr: 1 }} 
                        />
                        <Chip 
                          label={project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} 
                          size="small" 
                          color={getPriorityColor(project.priority)} 
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {project.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Progress
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress variant="determinate" value={project.progress} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{`${Math.round(project.progress)}%`}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Start Date
                        </Typography>
                        <Typography variant="body2">
                          {project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : 'Not set'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          End Date
                        </Typography>
                        <Typography variant="body2">
                          {project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : 'Not set'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Budget
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(project.budget)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Client
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {project.clientName || 'Not assigned'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEditClick(project)}>
                      Edit
                    </Button>
                    <Button size="small" onClick={() => handleGenerateReport(project.id)}>
                      Report
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDeleteClick(project.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <ProjectDialog 
        open={showAddDialog} 
        onClose={handleDialogClose} 
        project={selectedProject} 
        onSuccess={loadProjects} 
      />
    </DashboardLayout>
  );
}

function ProjectDialog({ open, onClose, project, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    status: 'planning',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: 0,
    managerId: '',
    notes: '',
  });
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const { execute: saveProject, isLoading } = useApi();
  const { execute: fetchClients } = useApi();
  const { execute: fetchUsers } = useApi();

  useEffect(() => {
    loadClients();
    loadUsers();
    
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        clientId: project.clientId || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        budget: project.budget || 0,
        managerId: project.managerId || '',
        notes: project.notes || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        clientId: '',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        budget: 0,
        managerId: '',
        notes: '',
      });
    }
  }, [project]);

  const loadClients = async () => {
    try {
      const response = await fetchClients(() =>
        fetch('/api/crm/contacts?type=client')
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

  const loadUsers = async () => {
    try {
      const response = await fetchUsers(() =>
        fetch('/api/users')
          .then(res => res.json())
      );

      if (response.success) {
        setUsers(response.data);
      } else {
        console.error('Failed to load users:', response.error);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

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
      const url = project ? `/api/projects/${project.id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';
      
      const response = await saveProject(() =>
        fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to save project:', response.error);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Basic Info" />
            <Tab label="Timeline" />
            <Tab label="Budget" />
            <Tab label="Team" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Name"
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
                        {client.firstName} {client.lastName} {client.company && `(${client.company})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Project Manager</InputLabel>
                  <Select
                    value={formData.managerId}
                    onChange={handleChange('managerId')}
                    label="Project Manager"
                  >
                    <MenuItem value="">None</MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
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
                    <MenuItem value="planning">Planning</MenuItem>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange('startDate')}
                  InputLabelProps={{ shrink: true }}
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
              {project && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Project Progress
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={project.progress || 0} />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(project.progress || 0)}%`}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              )}
              {project && project.tasks && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tasks
                  </Typography>
                  <List>
                    {project.tasks.map((task, index) => (
                      <ListItem key={task.id || index}>
                        <ListItemIcon>
                          <TaskIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={task.title}
                          secondary={`Due: ${task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'Not set'}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip 
                            label={task.status.charAt(0).toUpperCase() + task.status.slice(1)} 
                            size="small" 
                            color={task.status === 'completed' ? 'success' : 'default'} 
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange('budget')}
                  InputProps={{
                    startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              {project && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
                      <Typography variant="subtitle2">Budget</Typography>
                      <Typography variant="h6">{formatCurrency(project.budget || 0)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
                      <Typography variant="subtitle2">Actual Cost</Typography>
                      <Typography variant="h6">{formatCurrency(project.actualCost || 0)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
                      <Typography variant="subtitle2">Variance</Typography>
                      <Typography 
                        variant="h6" 
                        color={(project.budget || 0) - (project.actualCost || 0) >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency((project.budget || 0) - (project.actualCost || 0))}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          )}

          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Project Team
                </Typography>
                {project && project.teamMembers && project.teamMembers.length > 0 ? (
                  <List>
                    {project.teamMembers.map((memberId) => {
                      const member = users.find(user => user.id === memberId);
                      return (
                        <ListItem key={memberId}>
                          <ListItemIcon>
                            <Avatar>{member?.name?.charAt(0) || 'U'}</Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={member?.name || 'Unknown User'}
                            secondary={member?.email || ''}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No team members assigned yet. Team members can be added after creating the project.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {project ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
