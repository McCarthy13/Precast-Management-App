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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  Schedule as ScheduleIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  PlayArrow as PlayArrowIcon,
  ContentCopy as ContentCopyIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useApi } from '@/lib/hooks/useApi';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { ReportBuilder } from '../components/ReportBuilder';
import { ReportViewer } from '../components/ReportViewer';
import { ReportScheduler } from '../components/ReportScheduler';
import { DataSourceSelector } from '../components/DataSourceSelector';
import { VisualizationEditor } from '../components/VisualizationEditor';
import { ParameterEditor } from '../components/ParameterEditor';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    createdBy: 'all',
    isPublic: 'all',
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const [dataSources, setDataSources] = useState([]);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [executionParameters, setExecutionParameters] = useState({});
  const [executionFormat, setExecutionFormat] = useState('pdf');

  const { execute: fetchReports } = useApi();
  const { execute: fetchDataSources } = useApi();
  const { execute: executeReport } = useApi();
  const { execute: importReport } = useApi();

  useEffect(() => {
    loadReports();
    loadDataSources();
  }, [filters, tabValue]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const categoryFilter = tabValue === 0 ? '' : 
                          tabValue === 1 ? 'general' : 
                          tabValue === 2 ? 'financial' : 
                          tabValue === 3 ? 'production' : 
                          tabValue === 4 ? 'quality' : 
                          tabValue === 5 ? 'field' : 
                          tabValue === 6 ? 'inventory' : 
                          tabValue === 7 ? 'hr' : 'custom';
      
      const response = await fetchReports(() =>
        fetch(`/api/reports?category=${categoryFilter || filters.category !== 'all' ? filters.category : ''}&createdBy=${filters.createdBy !== 'all' ? filters.createdBy : ''}&isPublic=${filters.isPublic !== 'all' ? filters.isPublic : ''}`)
          .then(res => res.json())
      );

      if (response.success) {
        setReports(response.data);
      } else {
        console.error('Failed to load reports:', response.error);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDataSources = async () => {
    try {
      const response = await fetchDataSources(() =>
        fetch('/api/reports/data-sources')
          .then(res => res.json())
      );

      if (response.success) {
        setDataSources(response.data);
      } else {
        console.error('Failed to load data sources:', response.error);
      }
    } catch (error) {
      console.error('Error loading data sources:', error);
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
    setSelectedReport(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (report) => {
    setSelectedReport(report);
    setShowAddDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const response = await fetch(`/api/reports/${id}`, {
          method: 'DELETE',
        }).then(res => res.json());

        if (response.success) {
          loadReports();
        } else {
          console.error('Failed to delete report:', response.error);
        }
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setShowExecuteDialog(false);
    setShowScheduleDialog(false);
    setShowHistoryDialog(false);
    setShowExportDialog(false);
    setShowImportDialog(false);
  };

  const handleExecuteClick = (report) => {
    setSelectedReport(report);
    setExecutionParameters({});
    setExecutionFormat('pdf');
    setShowExecuteDialog(true);
  };

  const handleExecuteReport = async () => {
    if (!selectedReport) return;
    
    try {
      const response = await executeReport(() =>
        fetch(`/api/reports/${selectedReport.id}/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parameters: executionParameters,
            format: executionFormat,
          }),
        })
      );

      // Handle different response types based on format
      if (executionFormat === 'json') {
        const jsonResponse = await response.json();
        if (!jsonResponse.success) {
          throw new Error(jsonResponse.error || 'Failed to execute report');
        }
        // Handle JSON data
        console.log('Report data:', jsonResponse.data);
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${selectedReport.id}.${executionFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
      
      handleDialogClose();
    } catch (error) {
      console.error('Error executing report:', error);
    }
  };

  const handleScheduleClick = (report) => {
    setSelectedReport(report);
    setShowScheduleDialog(true);
  };

  const handleHistoryClick = (report) => {
    setSelectedReport(report);
    setShowHistoryDialog(true);
  };

  const handleExportClick = (report) => {
    setSelectedReport(report);
    setShowExportDialog(true);
  };

  const handleImportClick = () => {
    setImportData('');
    setShowImportDialog(true);
  };

  const handleImportDataChange = (e) => {
    setImportData(e.target.value);
  };

  const handleImportReport = async () => {
    if (!importData) return;
    
    try {
      let reportDefinition;
      try {
        reportDefinition = JSON.parse(importData);
      } catch (e) {
        alert('Invalid JSON format');
        return;
      }
      
      const response = await importReport(() =>
        fetch('/api/reports/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportDefinition),
        }).then(res => res.json())
      );

      if (response.success) {
        loadReports();
        handleDialogClose();
      } else {
        console.error('Failed to import report:', response.error);
      }
    } catch (error) {
      console.error('Error importing report:', error);
    }
  };

  const handleCloneReport = async (id) => {
    try {
      const response = await fetch(`/api/reports/${id}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Copy of ${reports.find(r => r.id === id)?.name || 'Report'}`,
        }),
      }).then(res => res.json());

      if (response.success) {
        loadReports();
      } else {
        console.error('Failed to clone report:', response.error);
      }
    } catch (error) {
      console.error('Error cloning report:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleParameterChange = (paramId, value) => {
    setExecutionParameters(prev => ({
      ...prev,
      [paramId]: value,
    }));
  };

  const filteredReports = reports.filter(report => {
    const searchLower = search.toLowerCase();
    return (
      report.name?.toLowerCase().includes(searchLower) ||
      report.description?.toLowerCase().includes(searchLower) ||
      report.category?.toLowerCase().includes(searchLower)
    );
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'general': return 'default';
      case 'financial': return 'success';
      case 'production': return 'primary';
      case 'quality': return 'secondary';
      case 'field': return 'warning';
      case 'inventory': return 'info';
      case 'hr': return 'error';
      case 'custom': return 'default';
      default: return 'default';
    }
  };

  const renderListView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Last Run</TableCell>
            <TableCell>Scheduled</TableCell>
            <TableCell>Public</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">Loading reports...</TableCell>
            </TableRow>
          ) : filteredReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">No reports found.</TableCell>
            </TableRow>
          ) : (
            filteredReports.map(report => (
              <TableRow key={report.id}>
                <TableCell>
                  <Typography variant="subtitle2">{report.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={report.category.charAt(0).toUpperCase() + report.category.slice(1)} 
                    size="small" 
                    color={getCategoryColor(report.category)} 
                  />
                </TableCell>
                <TableCell>{report.createdByName || 'System'}</TableCell>
                <TableCell>
                  {report.lastRunAt ? format(new Date(report.lastRunAt), 'MMM d, yyyy HH:mm') : 'Never'}
                </TableCell>
                <TableCell>
                  {report.schedule ? (
                    <Chip 
                      label={report.schedule.frequency} 
                      size="small" 
                      color="primary" 
                      icon={<ScheduleIcon />}
                    />
                  ) : 'No'}
                </TableCell>
                <TableCell>
                  {report.isPublic ? 'Yes' : 'No'}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Run Report">
                    <IconButton size="small" color="primary" onClick={() => handleExecuteClick(report)}>
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditClick(report)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Schedule">
                    <IconButton size="small" onClick={() => handleScheduleClick(report)}>
                      <ScheduleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="History">
                    <IconButton size="small" onClick={() => handleHistoryClick(report)}>
                      <HistoryIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export">
                    <IconButton size="small" onClick={() => handleExportClick(report)}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clone">
                    <IconButton size="small" onClick={() => handleCloneReport(report.id)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(report.id)}>
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

  const renderCardView = () => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {loading ? (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      ) : filteredReports.length === 0 ? (
        <Grid item xs={12}>
          <Typography align="center">No reports found.</Typography>
        </Grid>
      ) : (
        filteredReports.map(report => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {report.name}
                  </Typography>
                  <Chip 
                    label={report.category.charAt(0).toUpperCase() + report.category.slice(1)} 
                    size="small" 
                    color={getCategoryColor(report.category)} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {report.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last run: {report.lastRunAt ? format(new Date(report.lastRunAt), 'MMM d, yyyy') : 'Never'}
                  </Typography>
                  {report.schedule && (
                    <Chip 
                      label="Scheduled" 
                      size="small" 
                      color="primary" 
                      icon={<ScheduleIcon />}
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleExecuteClick(report)}
                >
                  Run
                </Button>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={() => handleEditClick(report)}
                >
                  Edit
                </Button>
                <IconButton size="small" onClick={() => handleDeleteClick(report.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderView = () => {
    switch (viewMode) {
      case 'card':
        return renderCardView();
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
            Custom Reports
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ mr: 1 }}
            >
              New Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleImportClick}
            >
              Import
            </Button>
          </Box>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Reports" />
          <Tab label="General" />
          <Tab label="Financial" />
          <Tab label="Production" />
          <Tab label="Quality" />
          <Tab label="Field" />
          <Tab label="Inventory" />
          <Tab label="HR" />
          <Tab label="Custom" />
        </Tabs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
            <TextField
              fullWidth
              placeholder="Search reports..."
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
                <TableChartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Card View">
              <IconButton 
                color={viewMode === 'card' ? 'primary' : 'default'} 
                onClick={() => handleViewModeChange('card')}
              >
                <BarChartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={loadReports}>
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
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={handleFilterChange('category')}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                    <MenuItem value="production">Production</MenuItem>
                    <MenuItem value="quality">Quality</MenuItem>
                    <MenuItem value="field">Field</MenuItem>
                    <MenuItem value="inventory">Inventory</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Created By</InputLabel>
                  <Select
                    value={filters.createdBy}
                    onChange={handleFilterChange('createdBy')}
                    label="Created By"
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="current">Me</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    value={filters.isPublic}
                    onChange={handleFilterChange('isPublic')}
                    label="Visibility"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="true">Public</MenuItem>
                    <MenuItem value="false">Private</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {renderView()}
      </Box>

      <ReportDialog 
        open={showAddDialog} 
        onClose={handleDialogClose} 
        report={selectedReport} 
        onSuccess={loadReports}
        dataSources={dataSources}
      />

      <ExecuteReportDialog
        open={showExecuteDialog}
        onClose={handleDialogClose}
        report={selectedReport}
        onExecute={handleExecuteReport}
        parameters={executionParameters}
        onParameterChange={handleParameterChange}
        format={executionFormat}
        onFormatChange={(e) => setExecutionFormat(e.target.value)}
      />

      <ScheduleReportDialog
        open={showScheduleDialog}
        onClose={handleDialogClose}
        report={selectedReport}
        onSuccess={loadReports}
      />

      <HistoryDialog
        open={showHistoryDialog}
        onClose={handleDialogClose}
        report={selectedReport}
      />

      <ExportReportDialog
        open={showExportDialog}
        onClose={handleDialogClose}
        report={selectedReport}
      />

      <ImportReportDialog
        open={showImportDialog}
        onClose={handleDialogClose}
        importData={importData}
        onImportDataChange={handleImportDataChange}
        onImport={handleImportReport}
      />
    </DashboardLayout>
  );
}

function ReportDialog({ open, onClose, report, onSuccess, dataSources }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    isPublic: false,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [reportConfig, setReportConfig] = useState({
    dataSources: [],
    fields: [],
    filters: [],
    sortBy: [],
    groupBy: [],
    aggregations: [],
    visualizations: [],
    outputFormats: ['pdf', 'csv'],
    parameters: [],
  });
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const { execute: saveReport, isLoading } = useApi();
  const { execute: previewReport } = useApi();

  useEffect(() => {
    if (report) {
      setFormData({
        name: report.name || '',
        description: report.description || '',
        category: report.category || 'general',
        isPublic: report.isPublic !== undefined ? report.isPublic : false,
      });
      setReportConfig({
        dataSources: report.dataSources || [],
        fields: report.fields || [],
        filters: report.filters || [],
        sortBy: report.sortBy || [],
        groupBy: report.groupBy || [],
        aggregations: report.aggregations || [],
        visualizations: report.visualizations || [],
        outputFormats: report.outputFormats || ['pdf', 'csv'],
        parameters: report.parameters || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'general',
        isPublic: false,
      });
      setReportConfig({
        dataSources: [],
        fields: [],
        filters: [],
        sortBy: [],
        groupBy: [],
        aggregations: [],
        visualizations: [],
        outputFormats: ['pdf', 'csv'],
        parameters: [],
      });
    }
    setActiveTab(0);
    setPreviewData(null);
  }, [report]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'isPublic' ? e.target.checked : e.target.value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReportConfigChange = (configUpdate) => {
    setReportConfig(prev => ({
      ...prev,
      ...configUpdate,
    }));
  };

  const handlePreviewReport = async () => {
    setPreviewLoading(true);
    try {
      const response = await previewReport(() =>
        fetch('/api/reports/preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reportConfig,
            parameters: {},
            limit: 10,
          }),
        }).then(res => res.json())
      );

      if (response.success) {
        setPreviewData(response.data);
      } else {
        console.error('Failed to preview report:', response.error);
      }
    } catch (error) {
      console.error('Error previewing report:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = report ? `/api/reports/${report.id}` : '/api/reports';
      const method = report ? 'PUT' : 'POST';
      
      const data = {
        ...formData,
        ...reportConfig,
      };
      
      const response = await saveReport(() =>
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
        console.error('Failed to save report:', response.error);
      }
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{report ? 'Edit Report' : 'Create New Report'}</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Basic Info" />
            <Tab label="Data Sources" />
            <Tab label="Fields & Filters" />
            <Tab label="Visualizations" />
            <Tab label="Parameters" />
            <Tab label="Preview" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Name"
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
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleChange('category')}
                    label="Category"
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                    <MenuItem value="production">Production</MenuItem>
                    <MenuItem value="quality">Quality</MenuItem>
                    <MenuItem value="field">Field</MenuItem>
                    <MenuItem value="inventory">Inventory</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Output Formats</InputLabel>
                  <Select
                    multiple
                    value={reportConfig.outputFormats}
                    onChange={(e) => handleReportConfigChange({ outputFormats: e.target.value })}
                    label="Output Formats"
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPublic}
                      onChange={handleChange('isPublic')}
                    />
                  }
                  label="Make this report public (visible to all users)"
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <DataSourceSelector
              dataSources={dataSources}
              selectedDataSources={reportConfig.dataSources}
              onChange={(dataSources) => handleReportConfigChange({ dataSources })}
            />
          )}

          {activeTab === 2 && (
            <ReportBuilder
              reportConfig={reportConfig}
              onChange={handleReportConfigChange}
              dataSources={dataSources}
            />
          )}

          {activeTab === 3 && (
            <VisualizationEditor
              visualizations={reportConfig.visualizations}
              fields={reportConfig.fields}
              onChange={(visualizations) => handleReportConfigChange({ visualizations })}
            />
          )}

          {activeTab === 4 && (
            <ParameterEditor
              parameters={reportConfig.parameters}
              onChange={(parameters) => handleReportConfigChange({ parameters })}
            />
          )}

          {activeTab === 5 && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">
                  Report Preview
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handlePreviewReport}
                  disabled={previewLoading}
                >
                  Refresh Preview
                </Button>
              </Box>
              
              {previewLoading ? (
                <LinearProgress sx={{ mb: 2 }} />
              ) : previewData ? (
                <ReportViewer data={previewData} visualizations={reportConfig.visualizations} />
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Click "Refresh Preview" to see a preview of your report
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {report ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function ExecuteReportDialog({ open, onClose, report, onExecute, parameters, onParameterChange, format, onFormatChange }) {
  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Execute Report - {report.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Report Parameters
          </Typography>
          
          {report.parameters && report.parameters.length > 0 ? (
            <Grid container spacing={2}>
              {report.parameters.map(param => (
                <Grid item xs={12} key={param.id}>
                  <TextField
                    fullWidth
                    label={param.name}
                    value={parameters[param.id] || ''}
                    onChange={(e) => onParameterChange(param.id, e.target.value)}
                    helperText={param.description}
                    required={param.required}
                    type={param.type === 'number' ? 'number' : 'text'}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              This report has no parameters.
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Output Format
          </Typography>
          <FormControl fullWidth>
            <Select
              value={format}
              onChange={onFormatChange}
            >
              {report.outputFormats.map(fmt => (
                <MenuItem key={fmt} value={fmt}>
                  {fmt.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onExecute} startIcon={<PlayArrowIcon />}>
          Execute
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ScheduleReportDialog({ open, onClose, report, onSuccess }) {
  const [schedule, setSchedule] = useState({
    enabled: false,
    frequency: 'daily',
    time: '08:00',
    dayOfWeek: 1, // Monday
    dayOfMonth: 1,
    recipients: [],
    outputFormat: 'pdf',
  });
  const [newRecipient, setNewRecipient] = useState('');
  const { execute: saveSchedule, isLoading } = useApi();

  useEffect(() => {
    if (report && report.schedule) {
      setSchedule({
        enabled: true,
        ...report.schedule,
      });
    } else {
      setSchedule({
        enabled: false,
        frequency: 'daily',
        time: '08:00',
        dayOfWeek: 1,
        dayOfMonth: 1,
        recipients: [],
        outputFormat: 'pdf',
      });
    }
  }, [report]);

  const handleChange = (field) => (e) => {
    setSchedule(prev => ({
      ...prev,
      [field]: field === 'enabled' ? e.target.checked : e.target.value,
    }));
  };

  const handleAddRecipient = () => {
    if (!newRecipient || !newRecipient.includes('@')) return;
    
    setSchedule(prev => ({
      ...prev,
      recipients: [...prev.recipients, newRecipient],
    }));
    
    setNewRecipient('');
  };

  const handleRemoveRecipient = (email) => {
    setSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== email),
    }));
  };

  const handleSubmit = async () => {
    if (!report) return;
    
    try {
      const url = `/api/reports/${report.id}/schedule`;
      const method = 'POST';
      
      const response = await saveSchedule(() =>
        fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schedule),
        }).then(res => res.json())
      );

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to save schedule:', response.error);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleCancelSchedule = async () => {
    if (!report) return;
    
    try {
      const url = `/api/reports/${report.id}/schedule`;
      const method = 'DELETE';
      
      const response = await fetch(url, {
        method,
      }).then(res => res.json());

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to cancel schedule:', response.error);
      }
    } catch (error) {
      console.error('Error cancelling schedule:', error);
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Schedule Report - {report.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={schedule.enabled}
                onChange={handleChange('enabled')}
              />
            }
            label="Enable scheduled execution"
          />
        </Box>

        {schedule.enabled && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={schedule.frequency}
                    onChange={handleChange('frequency')}
                    label="Frequency"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={schedule.time}
                  onChange={handleChange('time')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              {schedule.frequency === 'weekly' && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Day of Week</InputLabel>
                    <Select
                      value={schedule.dayOfWeek}
                      onChange={handleChange('dayOfWeek')}
                      label="Day of Week"
                    >
                      <MenuItem value={1}>Monday</MenuItem>
                      <MenuItem value={2}>Tuesday</MenuItem>
                      <MenuItem value={3}>Wednesday</MenuItem>
                      <MenuItem value={4}>Thursday</MenuItem>
                      <MenuItem value={5}>Friday</MenuItem>
                      <MenuItem value={6}>Saturday</MenuItem>
                      <MenuItem value={0}>Sunday</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              {schedule.frequency === 'monthly' && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Day of Month</InputLabel>
                    <Select
                      value={schedule.dayOfMonth}
                      onChange={handleChange('dayOfMonth')}
                      label="Day of Month"
                    >
                      {Array.from({ length: 31 }, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Output Format</InputLabel>
                  <Select
                    value={schedule.outputFormat}
                    onChange={handleChange('outputFormat')}
                    label="Output Format"
                  >
                    {report.outputFormats.map(fmt => (
                      <MenuItem key={fmt} value={fmt}>
                        {fmt.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Recipients
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder="Enter email address"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={handleAddRecipient}
                    disabled={!newRecipient || !newRecipient.includes('@')}
                    sx={{ height: '56px' }}
                  >
                    Add Recipient
                  </Button>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                {schedule.recipients.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No recipients added. Report will be saved to the system.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {schedule.recipients.map(email => (
                      <Chip 
                        key={email} 
                        label={email} 
                        onDelete={() => handleRemoveRecipient(email)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {report.schedule && (
          <Button color="error" onClick={handleCancelSchedule}>
            Cancel Schedule
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          Save Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function HistoryDialog({ open, onClose, report }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { execute: fetchHistory } = useApi();

  useEffect(() => {
    if (open && report) {
      loadHistory();
    }
  }, [open, report]);

  const loadHistory = async () => {
    if (!report) return;
    
    setLoading(true);
    try {
      const response = await fetchHistory(() =>
        fetch(`/api/reports/${report.id}/history`)
          .then(res => res.json())
      );

      if (response.success) {
        setHistory(response.data);
      } else {
        console.error('Failed to load history:', response.error);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (executionId) => {
    try {
      const response = await fetch(`/api/reports/${report.id}/history/${executionId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${report.id}-${executionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Execution History - {report.name}</DialogTitle>
      <DialogContent>
        {loading ? (
          <LinearProgress sx={{ mb: 2 }} />
        ) : history.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No execution history found for this report.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Executed By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell>
                      {format(new Date(execution.executedAt), 'MMM d, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>{execution.executedByName || 'System'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={execution.status} 
                        color={execution.status === 'success' ? 'success' : 'error'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{execution.durationMs ? `${(execution.durationMs / 1000).toFixed(2)}s` : 'N/A'}</TableCell>
                    <TableCell>{execution.format.toUpperCase()}</TableCell>
                    <TableCell align="right">
                      {execution.status === 'success' && (
                        <IconButton size="small" onClick={() => handleDownload(execution.id)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button startIcon={<RefreshIcon />} onClick={loadHistory}>
          Refresh
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ExportReportDialog({ open, onClose, report }) {
  const [exportData, setExportData] = useState('');
  const [loading, setLoading] = useState(false);
  const { execute: fetchExport } = useApi();

  useEffect(() => {
    if (open && report) {
      loadExportData();
    }
  }, [open, report]);

  const loadExportData = async () => {
    if (!report) return;
    
    setLoading(true);
    try {
      const response = await fetchExport(() =>
        fetch(`/api/reports/${report.id}/export`)
          .then(res => res.json())
      );

      if (response.success) {
        setExportData(JSON.stringify(response.data, null, 2));
      } else {
        console.error('Failed to export report:', response.error);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
  };

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report?.name.replace(/\s+/g, '-').toLowerCase() || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Export Report - {report.name}</DialogTitle>
      <DialogContent>
        {loading ? (
          <LinearProgress sx={{ mb: 2 }} />
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Copy this JSON definition or download it to share or back up your report.
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={exportData}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button startIcon={<ContentCopyIcon />} onClick={handleCopyToClipboard} disabled={loading}>
          Copy to Clipboard
        </Button>
        <Button startIcon={<DownloadIcon />} onClick={handleDownload} disabled={loading}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ImportReportDialog({ open, onClose, importData, onImportDataChange, onImport }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Report</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Paste a JSON report definition to import it.
          </Typography>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={20}
          value={importData}
          onChange={onImportDataChange}
          placeholder='{"name": "My Report", "description": "Report description", ...}'
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onImport} disabled={!importData}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
