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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  ContentCopy as DuplicateIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Transform as ConvertIcon,
} from '@mui/icons-material';
import { useApi } from '@/lib/hooks/useApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const { execute: fetchEstimates } = useApi();

  useEffect(() => {
    loadEstimates();
  }, [filters, tabValue]);

  const loadEstimates = async () => {
    setLoading(true);
    try {
      const response = await fetchEstimates(() =>
        fetch(`/api/estimating/estimates?status=${filters.status !== 'all' ? filters.status : ''}&dateRange=${filters.dateRange}`)
          .then(res => res.json())
      );

      if (response.success) {
        setEstimates(response.data);
      } else {
        console.error('Failed to load estimates:', response.error);
      }
    } catch (error) {
      console.error('Error loading estimates:', error);
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
    setSelectedEstimate(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (estimate) => {
    setSelectedEstimate(estimate);
    setShowAddDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      try {
        const response = await fetch(`/api/estimating/estimates/${id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.success) {
          loadEstimates();
        } else {
          console.error('Failed to delete estimate:', response.error);
        }
      } catch (error) {
        console.error('Error deleting estimate:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
  };

  const handleGeneratePdf = async (id) => {
    try {
      const response = await fetch(`/api/estimating/estimates/${id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estimate-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSendEstimate = async (id) => {
    // Implement send functionality
  };

  const handleDuplicateEstimate = async (id) => {
    try {
      const response = await fetch(`/api/estimating/estimates/${id}/duplicate`, {
        method: 'POST',
      }).then(res => res.json());

      if (response.success) {
        loadEstimates();
      } else {
        console.error('Failed to duplicate estimate:', response.error);
      }
    } catch (error) {
      console.error('Error duplicating estimate:', error);
    }
  };

  const handleApproveEstimate = async (id) => {
    try {
      const response = await fetch(`/api/estimating/estimates/${id}/approve`, {
        method: 'POST',
      }).then(res => res.json());

      if (response.success) {
        loadEstimates();
      } else {
        console.error('Failed to approve estimate:', response.error);
      }
    } catch (error) {
      console.error('Error approving estimate:', error);
    }
  };

  const handleRejectEstimate = async (id) => {
    try {
      const response = await fetch(`/api/estimating/estimates/${id}/reject`, {
        method: 'POST',
      }).then(res => res.json());

      if (response.success) {
        loadEstimates();
      } else {
        console.error('Failed to reject estimate:', response.error);
      }
    } catch (error) {
      console.error('Error rejecting estimate:', error);
    }
  };

  const handleConvertToProject = async (id) => {
    try {
      const response = await fetch(`/api/estimating/estimates/${id}/convert-to-project`, {
        method: 'POST',
      }).then(res => res.json());

      if (response.success) {
        loadEstimates();
        // Navigate to the new project
      } else {
        console.error('Failed to convert estimate to project:', response.error);
      }
    } catch (error) {
      console.error('Error converting estimate to project:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredEstimates = estimates.filter(estimate => {
    const searchLower = search.toLowerCase();
    return (
      estimate.estimateNumber.toLowerCase().includes(searchLower) ||
      estimate.projectName.toLowerCase().includes(searchLower) ||
      estimate.clientName?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sent': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'expired': return 'warning';
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
            Estimates & Quotes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            New Estimate
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Estimates" />
          <Tab label="Drafts" />
          <Tab label="Sent" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search estimates..."
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
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="sent">Sent</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={filters.dateRange}
                    onChange={handleFilterChange('dateRange')}
                    label="Date Range"
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="this_week">This Week</MenuItem>
                    <MenuItem value="this_month">This Month</MenuItem>
                    <MenuItem value="this_year">This Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estimate #</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading estimates...</TableCell>
                </TableRow>
              ) : filteredEstimates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No estimates found.</TableCell>
                </TableRow>
              ) : (
                filteredEstimates.map(estimate => (
                  <TableRow key={estimate.id}>
                    <TableCell>{estimate.estimateNumber}</TableCell>
                    <TableCell>{estimate.projectName}</TableCell>
                    <TableCell>{estimate.clientName}</TableCell>
                    <TableCell>{format(new Date(estimate.issueDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{formatCurrency(estimate.total)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)} 
                        size="small" 
                        color={getStatusColor(estimate.status)} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(estimate)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Generate PDF">
                        <IconButton size="small" onClick={() => handleGeneratePdf(estimate.id)}>
                          <PdfIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send">
                        <IconButton size="small" onClick={() => handleSendEstimate(estimate.id)}>
                          <EmailIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" onClick={() => handleDuplicateEstimate(estimate.id)}>
                          <DuplicateIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {estimate.status === 'sent' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton size="small" onClick={() => handleApproveEstimate(estimate.id)}>
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton size="small" onClick={() => handleRejectEstimate(estimate.id)}>
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {estimate.status === 'approved' && (
                        <Tooltip title="Convert to Project">
                          <IconButton size="small" onClick={() => handleConvertToProject(estimate.id)}>
                            <ConvertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(estimate.id)}>
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
      </Box>

      <EstimateDialog 
        open={showAddDialog} 
        onClose={handleDialogClose} 
        estimate={selectedEstimate} 
        onSuccess={loadEstimates} 
      />
    </DashboardLayout>
  );
}

function EstimateDialog({ open, onClose, estimate, onSuccess }) {
  const [formData, setFormData] = useState({
    estimateNumber: '',
    clientId: '',
    projectName: '',
    description: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lineItems: [],
    taxRate: 0,
    discount: 0,
    notes: '',
    terms: '',
  });
  const [clients, setClients] = useState([]);
  const [newLineItem, setNewLineItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
  });

  const { execute: saveEstimate, isLoading } = useApi();
  const { execute: fetchClients } = useApi();

  useEffect(() => {
    loadClients();
    
    if (estimate) {
      setFormData({
        estimateNumber: estimate.estimateNumber || '',
        clientId: estimate.clientId || '',
        projectName: estimate.projectName || '',
        description: estimate.description || '',
        issueDate: estimate.issueDate ? new Date(estimate.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expiryDate: estimate.expiryDate ? new Date(estimate.expiryDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems: estimate.lineItems || [],
        taxRate: estimate.taxRate || 0,
        discount: estimate.discount || 0,
        notes: estimate.notes || '',
        terms: estimate.terms || '',
      });
    } else {
      setFormData({
        estimateNumber: '',
        clientId: '',
        projectName: '',
        description: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems: [],
        taxRate: 0,
        discount: 0,
        notes: '',
        terms: '',
      });
    }
  }, [estimate]);

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

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleLineItemChange = (field) => (e) => {
    setNewLineItem(prev => ({
      ...prev,
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(e.target.value) || 0 : e.target.value,
    }));
  };

  const handleAddLineItem = () => {
    if (!newLineItem.description) return;
    
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...newLineItem, total: newLineItem.quantity * newLineItem.unitPrice }],
    }));
    
    setNewLineItem({
      description: '',
      quantity: 1,
      unitPrice: 0,
    });
  };

  const handleRemoveLineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  };

  const calculateSubtotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotal() - formData.discount) * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    return (calculateSubtotal() - formData.discount) + calculateTaxAmount();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = estimate ? `/api/estimating/estimates/${estimate.id}` : '/api/estimating/estimates';
      const method = estimate ? 'PUT' : 'POST';
      
      // Calculate totals
      const data = {
        ...formData,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTaxAmount(),
        total: calculateTotal(),
      };
      
      const response = await saveEstimate(() =>
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
        console.error('Failed to save estimate:', response.error);
      }
    } catch (error) {
      console.error('Error saving estimate:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{estimate ? 'Edit Estimate' : 'Create New Estimate'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimate Number"
                value={formData.estimateNumber}
                onChange={handleChange('estimateNumber')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Client</InputLabel>
                <Select
                  value={formData.clientId}
                  onChange={handleChange('clientId')}
                  label="Client"
                >
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} {client.company && `(${client.company})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={formData.projectName}
                onChange={handleChange('projectName')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issue Date"
                type="date"
                value={formData.issueDate}
                onChange={handleChange('issueDate')}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange('expiryDate')}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Line Items</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleRemoveLineItem(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <TextField
                          fullWidth
                          placeholder="Description"
                          value={newLineItem.description}
                          onChange={handleLineItemChange('description')}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={newLineItem.quantity}
                          onChange={handleLineItemChange('quantity')}
                          size="small"
                          inputProps={{ min: 1, step: 1 }}
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={newLineItem.unitPrice}
                          onChange={handleLineItemChange('unitPrice')}
                          size="small"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          sx={{ width: '120px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(newLineItem.quantity * newLineItem.unitPrice)}
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={handleAddLineItem}>Add</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                type="number"
                value={formData.taxRate}
                onChange={handleChange('taxRate')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Discount"
                type="number"
                value={formData.discount}
                onChange={handleChange('discount')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
                <Typography variant="body2">Subtotal: {formatCurrency(calculateSubtotal())}</Typography>
                <Typography variant="body2">Tax: {formatCurrency(calculateTaxAmount())}</Typography>
                <Typography variant="body2">Discount: {formatCurrency(formData.discount)}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Total: {formatCurrency(calculateTotal())}
                </Typography>
              </Box>
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
              <TextField
                fullWidth
                label="Terms and Conditions"
                multiline
                rows={3}
                value={formData.terms}
                onChange={handleChange('terms')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {estimate ? 'Update' : 'Create'}
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
