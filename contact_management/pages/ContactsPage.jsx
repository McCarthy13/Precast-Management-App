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
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  ImportExport as ImportExportIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useApi } from '@/lib/hooks/useApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'active',
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const { execute: fetchContacts } = useApi();

  useEffect(() => {
    loadContacts();
  }, [filters]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await fetchContacts(() =>
        fetch(`/api/crm/contacts?type=${filters.type !== 'all' ? filters.type : ''}&status=${filters.status}`)
          .then(res => res.json())
      );

      if (response.success) {
        setContacts(response.data);
      } else {
        console.error('Failed to load contacts:', response.error);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
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
    setSelectedContact(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setShowAddDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await fetch(`/api/crm/contacts/${id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.success) {
          loadContacts();
        } else {
          console.error('Failed to delete contact:', response.error);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
  };

  const handleImportExport = () => {
    // Implement import/export functionality
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = search.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(searchLower) ||
      contact.lastName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.company.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Contact Management
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ mr: 1 }}
            >
              Add Contact
            </Button>
            <Button
              variant="outlined"
              startIcon={<ImportExportIcon />}
              onClick={handleImportExport}
            >
              Import/Export
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search contacts..."
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
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={handleFilterChange('type')}
                    label="Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="client">Client</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                    <MenuItem value="partner">Partner</MenuItem>
                    <MenuItem value="lead">Lead</MenuItem>
                    <MenuItem value="prospect">Prospect</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={handleFilterChange('status')}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography>Loading contacts...</Typography>
            </Grid>
          ) : filteredContacts.length === 0 ? (
            <Grid item xs={12}>
              <Typography>No contacts found.</Typography>
            </Grid>
          ) : (
            filteredContacts.map(contact => (
              <Grid item xs={12} sm={6} md={4} key={contact.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {contact.firstName.charAt(0)}
                        {contact.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {contact.firstName} {contact.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {contact.position} {contact.company && `at ${contact.company}`}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      <Typography variant="body2">{contact.email}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      <Typography variant="body2">{contact.phone}</Typography>
                    </Box>
                    
                    {contact.company && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                        <Typography variant="body2">{contact.company}</Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label={contact.type.charAt(0).toUpperCase() + contact.type.slice(1)} 
                        size="small" 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        label={contact.status.charAt(0).toUpperCase() + contact.status.slice(1)} 
                        size="small" 
                        color={contact.status === 'active' ? 'success' : 'default'} 
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEditClick(contact)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDeleteClick(contact.id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <ContactDialog 
        open={showAddDialog} 
        onClose={handleDialogClose} 
        contact={selectedContact} 
        onSuccess={loadContacts} 
      />
    </DashboardLayout>
  );
}

function ContactDialog({ open, onClose, contact, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    type: 'client',
    status: 'active',
    notes: '',
  });

  const { execute: saveContact, isLoading } = useApi();

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        position: contact.position || '',
        type: contact.type || 'client',
        status: contact.status || 'active',
        notes: contact.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        type: 'client',
        status: 'active',
        notes: '',
      });
    }
  }, [contact]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = contact ? `/api/crm/contacts/${contact.id}` : '/api/crm/contacts';
      const method = contact ? 'PUT' : 'POST';
      
      const response = await saveContact(() =>
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
        console.error('Failed to save contact:', response.error);
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={handleChange('company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                value={formData.position}
                onChange={handleChange('position')}
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
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="vendor">Vendor</MenuItem>
                  <MenuItem value="partner">Partner</MenuItem>
                  <MenuItem value="lead">Lead</MenuItem>
                  <MenuItem value="prospect">Prospect</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={handleChange('notes')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {contact ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
