import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Link from 'next/link';

export default function Production() {
  const { data: session, status } = useSession();
  const [productionRecords, setProductionRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock projects for dropdown
  const mockProjects = [
    { id: 'p1', name: 'Commercial Building Alpha' },
    { id: 'p2', name: 'Highway Bridge Expansion' },
    { id: 'p3', name: 'Municipal Water Treatment' },
    { id: 'p4', name: 'Residential Complex' },
    { id: 'p5', name: 'Shopping Mall Renovation' },
  ];

  // Mock production teams
  const mockTeams = [
    { id: 't1', name: 'Production Team A' },
    { id: 't2', name: 'Production Team B' },
    { id: 't3', name: 'Production Team C' },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchProductionRecords = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/production');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          const mockProductionRecords = [
            {
              id: '1',
              name: 'Wall Panel WP-101',
              projectName: 'Commercial Building Alpha',
              status: 'In Production',
              startDate: '2025-05-15',
              completionDate: '2025-05-18',
              assignedTo: 'Production Team A',
              priority: 'High',
              notes: 'Special finish required, see drawing notes'
            },
            {
              id: '2',
              name: 'Column C-203',
              projectName: 'Highway Bridge Expansion',
              status: 'Scheduled',
              startDate: '2025-05-19',
              completionDate: '2025-05-21',
              assignedTo: 'Production Team B',
              priority: 'Medium',
              notes: 'Standard reinforcement pattern'
            },
            {
              id: '3',
              name: 'Beam B-305',
              projectName: 'Commercial Building Alpha',
              status: 'Completed',
              startDate: '2025-05-10',
              completionDate: '2025-05-12',
              assignedTo: 'Production Team A',
              priority: 'High',
              notes: 'Completed ahead of schedule'
            },
            {
              id: '4',
              name: 'Tank Wall TW-405',
              projectName: 'Municipal Water Treatment',
              status: 'Quality Check',
              startDate: '2025-05-14',
              completionDate: '2025-05-16',
              assignedTo: 'Production Team C',
              priority: 'High',
              notes: 'Waiting for QC approval'
            },
            {
              id: '5',
              name: 'Stair S-506',
              projectName: 'Residential Complex',
              status: 'On Hold',
              startDate: '2025-05-20',
              completionDate: '2025-05-22',
              assignedTo: 'Production Team B',
              priority: 'Low',
              notes: 'Waiting for drawing revision approval'
            }
          ];
          setProductionRecords(mockProductionRecords);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch production records');
        setLoading(false);
      }
    };

    fetchProductionRecords();
  }, []);

  const filteredRecords = productionRecords.filter(record => {
    // Filter by tab
    if (activeTab !== 'all' && record.status.toLowerCase().replace(' ', '-') !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !record.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !record.projectName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseRecordDetails = () => {
    setSelectedRecord(null);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateRecord = (e) => {
    e.preventDefault();
    // In a real implementation, this would submit the form data to the API
    alert('In a real implementation, this would create a new production record');
    setShowCreateModal(false);
  };

  const handleDeleteRecord = (recordId) => {
    // In a real implementation, this would show a confirmation dialog
    if (confirm('Are you sure you want to delete this production record?')) {
      // Then make an API call to delete
      alert(`Delete record ${recordId} functionality would be implemented here.`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Production':
        return 'bg-yellow-100 text-yellow-800';
      case 'Quality Check':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render production records list
  const renderProductionRecordsList = () => {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRecords.map((record) => (
            <li key={record.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" onClick={() => handleRecordClick(record)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600">{record.name}</div>
                      <div className="text-sm text-gray-500">{record.projectName}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(record.priority)}`}>
                      {record.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {record.startDate} - {record.completionDate}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p>
                      {record.assignedTo}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render record details modal
  const renderRecordDetails = () => {
    if (!selectedRecord) return null;
    
    return (
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedRecord.name}</h3>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedRecord.status)}`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Project:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.projectName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Start Date:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.startDate}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Completion Date:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.completionDate}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Assigned To:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.assignedTo}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Priority:</span>
                        <p className="text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedRecord.priority)}`}>
                            {selectedRecord.priority}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Notes:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.notes}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(selectedRecord.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleCloseRecordDetails}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render create modal
  const renderCreateModal = () => {
    if (!showCreateModal) return null;
    
    return (
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form onSubmit={handleCreateRecord}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create Production Record</h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="record-name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          id="record-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter piece name (e.g., Wall Panel WP-101)"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-project" className="block text-sm font-medium text-gray-700">Project</label>
                        <select
                          id="record-project"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select a project</option>
                          {mockProjects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="record-status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select a status</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Production">In Production</option>
                          <option value="Quality Check">Quality Check</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-team" className="block text-sm font-medium text-gray-700">Assigned Team</label>
                        <select
                          id="record-team"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select a team</option>
                          {mockTeams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="record-start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="date"
                            id="record-start-date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="record-completion-date" className="block text-sm font-medium text-gray-700">Completion Date</label>
                          <input
                            type="date"
                            id="record-completion-date"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          id="record-priority"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select a priority</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-notes" className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                          id="record-notes"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter additional notes"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Production</h1>
        <p className="mt-2 text-gray-600">Manage production schedules and track piece manufacturing</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => handleTabChange('scheduled')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'scheduled' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Scheduled
          </button>
          <button 
            onClick={() => handleTabChange('in-production')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'in-production' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            In Production
          </button>
          <button 
            onClick={() => handleTabChange('quality-check')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'quality-check' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Quality Check
          </button>
          <button 
            onClick={() => handleTabChange('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'completed' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>
        
        <button 
          onClick={handleCreateClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Production Item
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by name or project"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No production records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new production record.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleCreateClick}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Production Item
            </button>
          </div>
        </div>
      ) : (
        renderProductionRecordsList()
      )}
      
      {/* Modals */}
      {renderRecordDetails()}
      {renderCreateModal()}
    </div>
  );
}

Production.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};
