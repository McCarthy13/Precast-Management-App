import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Link from 'next/link';

export default function Sales() {
  const { data: session, status } = useSession();
  const [salesRecords, setSalesRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock clients for dropdown
  const mockClients = [
    { id: 'c1', name: 'ABC Construction' },
    { id: 'c2', name: 'State DOT' },
    { id: 'c3', name: 'City of Springfield' },
    { id: 'c4', name: 'Horizon Developers' },
    { id: 'c5', name: 'Retail Properties Inc' },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchSalesRecords = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/sales');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          const mockSalesRecords = [
            {
              id: '1',
              name: 'Commercial Office Building',
              clientName: 'ABC Construction',
              status: 'Pending',
              totalAmount: 450000,
              createdDate: '2025-05-10',
              dueDate: '2025-05-25',
              assignedTo: 'John Sales',
              probability: 75,
              notes: 'Client requested detailed breakdown of material costs'
            },
            {
              id: '2',
              name: 'Highway Bridge Expansion',
              clientName: 'State DOT',
              status: 'Approved',
              totalAmount: 1250000,
              createdDate: '2025-05-05',
              dueDate: '2025-05-15',
              assignedTo: 'Sarah Sales',
              probability: 100,
              notes: 'Approved by client, ready for project setup'
            },
            {
              id: '3',
              name: 'Municipal Water Treatment',
              clientName: 'City of Springfield',
              status: 'Rejected',
              totalAmount: 850000,
              createdDate: '2025-04-28',
              dueDate: '2025-05-12',
              assignedTo: 'John Sales',
              probability: 0,
              notes: 'Client went with competitor due to timeline constraints'
            },
            {
              id: '4',
              name: 'Residential Complex',
              clientName: 'Horizon Developers',
              status: 'Draft',
              totalAmount: 320000,
              createdDate: '2025-05-12',
              dueDate: '2025-05-30',
              assignedTo: 'Sarah Sales',
              probability: 50,
              notes: 'Initial draft, waiting for material pricing confirmation'
            },
            {
              id: '5',
              name: 'Shopping Mall Renovation',
              clientName: 'Retail Properties Inc',
              status: 'Sent',
              totalAmount: 780000,
              createdDate: '2025-05-08',
              dueDate: '2025-05-22',
              assignedTo: 'Mike Sales',
              probability: 65,
              notes: 'Client reviewing proposal, follow-up scheduled for next week'
            }
          ];
          setSalesRecords(mockSalesRecords);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch sales records');
        setLoading(false);
      }
    };

    fetchSalesRecords();
  }, []);

  const filteredRecords = salesRecords.filter(record => {
    // Filter by tab
    if (activeTab !== 'all' && record.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !record.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !record.clientName.toLowerCase().includes(searchQuery.toLowerCase())) {
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
    alert('In a real implementation, this would create a new sales/estimate record');
    setShowCreateModal(false);
  };

  const handleDeleteRecord = (recordId) => {
    // In a real implementation, this would show a confirmation dialog
    if (confirm('Are you sure you want to delete this sales/estimate record?')) {
      // Then make an API call to delete
      alert(`Delete record ${recordId} functionality would be implemented here.`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render sales records list
  const renderSalesRecordsList = () => {
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600">{record.name}</div>
                      <div className="text-sm text-gray-500">{record.clientName}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(record.totalAmount)}</div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : record.status === 'Rejected' 
                          ? 'bg-red-100 text-red-800'
                          : record.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : record.status === 'Draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due: {record.dueDate}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedRecord.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedRecord.status === 'Rejected' 
                          ? 'bg-red-100 text-red-800'
                          : selectedRecord.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : selectedRecord.status === 'Draft'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Client:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.clientName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedRecord.totalAmount)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Created Date:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.createdDate}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Due Date:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.dueDate}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Assigned To:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.assignedTo}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Probability:</span>
                        <p className="text-sm text-gray-900">{selectedRecord.probability}%</p>
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
                        Convert to Project
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create Sales/Estimate Record</h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="record-name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          id="record-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter record name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-client" className="block text-sm font-medium text-gray-700">Client</label>
                        <select
                          id="record-client"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select a client</option>
                          {mockClients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
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
                          <option value="Draft">Draft</option>
                          <option value="Pending">Pending</option>
                          <option value="Sent">Sent</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-amount" className="block text-sm font-medium text-gray-700">Total Amount</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="record-amount"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="0.00"
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-due-date" className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                          type="date"
                          id="record-due-date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="record-probability" className="block text-sm font-medium text-gray-700">Probability (%)</label>
                        <input
                          type="number"
                          id="record-probability"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="50"
                          min="0"
                          max="100"
                        />
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
        <h1 className="text-3xl font-bold text-gray-900">Sales & Estimating</h1>
        <p className="mt-2 text-gray-600">Manage sales opportunities and project estimates</p>
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
            onClick={() => handleTabChange('draft')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'draft' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Draft
          </button>
          <button 
            onClick={() => handleTabChange('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'pending' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => handleTabChange('sent')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'sent' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Sent
          </button>
          <button 
            onClick={() => handleTabChange('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'approved' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Approved
          </button>
        </div>
        
        <button 
          onClick={handleCreateClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Estimate
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
            placeholder="Search by name or client"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No estimates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new estimate.'}
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
              Create Estimate
            </button>
          </div>
        </div>
      ) : (
        renderSalesRecordsList()
      )}
      
      {/* Modals */}
      {renderRecordDetails()}
      {renderCreateModal()}
    </div>
  );
}

Sales.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};
