import Head from 'next/head';
import { useState } from 'react';

// Sample data for jobs
const sampleJobs = [
  { 
    id: 1, 
    name: 'Highway Bridge Expansion', 
    client: 'State DOT', 
    location: '123 Highway Ave', 
    status: 'In Progress', 
    startDate: '2025-03-15', 
    endDate: '2025-08-30',
    generalContractor: 'ABC Construction',
    value: '$2,450,000',
    completion: 35
  },
  { 
    id: 2, 
    name: 'Commercial Building Foundation', 
    client: 'Retail Developers Inc.', 
    location: '456 Main St', 
    status: 'Scheduled', 
    startDate: '2025-06-10', 
    endDate: '2025-09-15',
    generalContractor: 'BuildRight Construction',
    value: '$1,850,000',
    completion: 0
  },
  { 
    id: 3, 
    name: 'Parking Garage Elements', 
    client: 'City Metro Authority', 
    location: '789 Center Blvd', 
    status: 'Completed', 
    startDate: '2025-01-20', 
    endDate: '2025-04-30',
    generalContractor: 'Urban Builders LLC',
    value: '$3,200,000',
    completion: 100
  },
  { 
    id: 4, 
    name: 'Residential Complex', 
    client: 'Luxury Living Developers', 
    location: '321 Sunset Dr', 
    status: 'In Progress', 
    startDate: '2025-02-10', 
    endDate: '2025-07-15',
    generalContractor: 'Premier Homes Inc.',
    value: '$4,750,000',
    completion: 65
  },
  { 
    id: 5, 
    name: 'Sports Arena', 
    client: 'City Sports Authority', 
    location: '555 Stadium Way', 
    status: 'In Progress', 
    startDate: '2025-04-05', 
    endDate: '2025-11-30',
    generalContractor: 'Major Construction Group',
    value: '$8,500,000',
    completion: 25
  },
];

// Sample job contacts
const sampleContacts = [
  { id: 1, jobId: 1, name: 'Michael Johnson', role: 'Project Manager', company: 'State DOT', email: 'mjohnson@statedot.gov', phone: '(555) 123-4567' },
  { id: 2, jobId: 1, name: 'Sarah Williams', role: 'Engineer', company: 'State DOT', email: 'swilliams@statedot.gov', phone: '(555) 123-4568' },
  { id: 3, jobId: 1, name: 'Robert Davis', role: 'Site Supervisor', company: 'ABC Construction', email: 'rdavis@abcconstruction.com', phone: '(555) 987-6543' },
  { id: 4, jobId: 2, name: 'Jennifer Lee', role: 'Project Manager', company: 'Retail Developers Inc.', email: 'jlee@retaildev.com', phone: '(555) 234-5678' },
  { id: 5, jobId: 2, name: 'David Wilson', role: 'Architect', company: 'Design Associates', email: 'dwilson@designassoc.com', phone: '(555) 345-6789' },
];

// Sample job documents
const sampleDocuments = [
  { id: 1, jobId: 1, name: 'Contract Agreement', type: 'Legal', uploadDate: '2025-03-10', uploadedBy: 'Admin', size: '2.4 MB' },
  { id: 2, jobId: 1, name: 'Engineering Specifications', type: 'Technical', uploadDate: '2025-03-12', uploadedBy: 'Engineering', size: '5.7 MB' },
  { id: 3, jobId: 1, name: 'Site Survey', type: 'Technical', uploadDate: '2025-03-05', uploadedBy: 'Engineering', size: '8.2 MB' },
  { id: 4, jobId: 1, name: 'Budget Proposal', type: 'Financial', uploadDate: '2025-03-08', uploadedBy: 'Finance', size: '1.5 MB' },
  { id: 5, jobId: 2, name: 'Contract Agreement', type: 'Legal', uploadDate: '2025-05-20', uploadedBy: 'Admin', size: '2.1 MB' },
];

// Sample job drawings
const sampleDrawings = [
  { id: 1, jobId: 1, name: 'Foundation Plan', number: 'FP-001', revision: 'A', status: 'Approved', date: '2025-03-15', format: 'PDF' },
  { id: 2, jobId: 1, name: 'Structural Details', number: 'SD-002', revision: 'B', status: 'In Review', date: '2025-03-18', format: 'DWG' },
  { id: 3, jobId: 1, name: 'Reinforcement Layout', number: 'RL-003', revision: 'A', status: 'Approved', date: '2025-03-20', format: 'PDF' },
  { id: 4, jobId: 1, name: 'Connection Details', number: 'CD-004', revision: 'C', status: 'Revision Required', date: '2025-03-25', format: 'DWG' },
  { id: 5, jobId: 2, name: 'Foundation Plan', number: 'FP-001', revision: 'A', status: 'Approved', date: '2025-05-25', format: 'PDF' },
];

// Sample delivery information
const sampleDeliveries = [
  { id: 1, jobId: 1, elements: 'Girders B1-B5', quantity: 5, scheduledDate: '2025-06-15', status: 'Scheduled', specialRequirements: 'Crane access required' },
  { id: 2, jobId: 1, elements: 'Columns C1-C8', quantity: 8, scheduledDate: '2025-06-20', status: 'Scheduled', specialRequirements: 'Police escort required' },
  { id: 3, jobId: 4, elements: 'Wall Panels W1-W12', quantity: 12, scheduledDate: '2025-05-10', status: 'Delivered', specialRequirements: 'None' },
  { id: 4, jobId: 4, elements: 'Floor Slabs F1-F20', quantity: 20, scheduledDate: '2025-05-25', status: 'In Transit', specialRequirements: 'Special handling required' },
  { id: 5, jobId: 5, elements: 'Seating Sections S1-S10', quantity: 10, scheduledDate: '2025-07-05', status: 'Scheduled', specialRequirements: 'Oversized load' },
];

export default function Jobs() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedJob, setSelectedJob] = useState(sampleJobs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter jobs based on search term and status filter
  const filteredJobs = sampleJobs.filter(job => 
    (job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
     job.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? job.status === statusFilter : true)
  );

  // Get contacts for selected job
  const jobContacts = sampleContacts.filter(contact => contact.jobId === selectedJob.id);
  
  // Get documents for selected job
  const jobDocuments = sampleDocuments.filter(doc => doc.jobId === selectedJob.id);
  
  // Get drawings for selected job
  const jobDrawings = sampleDrawings.filter(drawing => drawing.jobId === selectedJob.id);
  
  // Get deliveries for selected job
  const jobDeliveries = sampleDeliveries.filter(delivery => delivery.jobId === selectedJob.id);

  return (
    <>
      <Head>
        <title>Jobs | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Job List and Filters */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-64">
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="text"
                          className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Search jobs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <select
                        id="status-filter"
                        name="status-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      New Job
                    </button>
                  </div>
                </div>

                <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Job Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Timeline</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredJobs.map((job) => (
                        <tr 
                          key={job.id} 
                          className={`${selectedJob.id === job.id ? 'bg-purple-50' : ''} hover:bg-gray-50 cursor-pointer`}
                          onClick={() => setSelectedJob(job)}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{job.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.client}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.location}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - 
                            {new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              className="text-purple-600 hover:text-purple-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit action
                              }}
                            >
                              Edit<span className="sr-only">, {job.name}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Job Details: {selectedJob.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {selectedJob.client} | {selectedJob.location}
                  </p>
                </div>
                <div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedJob.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    selectedJob.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    selectedJob.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedJob.status}
                  </span>
                </div>
              </div>

              {/* Job Details Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className={`${
                      activeTab === 'contacts'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Contacts
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`${
                      activeTab === 'documents'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('drawings')}
                    className={`${
                      activeTab === 'drawings'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Drawings
                  </button>
                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`${
                      activeTab === 'delivery'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Delivery
                  </button>
                </nav>
              </div>

              {/* Overview Tab Content */}
              {activeTab === 'overview' && (
                <div className="px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Job Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedJob.name}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Client</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedJob.client}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedJob.location}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedJob.status}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(selectedJob.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">End Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(selectedJob.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">General Contractor</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedJob.generalContractor}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Contract Value</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedJob.value}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Completion</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                selectedJob.completion >= 80 ? 'bg-green-600' :
                                selectedJob.completion >= 40 ? 'bg-blue-600' :
                                'bg-yellow-600'
                              }`} 
                              style={{ width: `${selectedJob.completion}%` }}
                            ></div>
                          </div>
                          <span>{selectedJob.completion}%</span>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Contacts Tab Content */}
              {activeTab === 'contacts' && (
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Contact
                    </button>
                  </div>
                  
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {jobContacts.map((contact) => (
                          <tr key={contact.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{contact.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contact.role}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contact.company}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contact.email}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contact.phone}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button type="button" className="text-purple-600 hover:text-purple-900 mr-4">Edit</button>
                              <button type="button" className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Documents Tab Content */}
              {activeTab === 'documents' && (
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Upload Document
                    </button>
                  </div>
                  
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Document Name</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Upload Date</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uploaded By</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Size</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {jobDocuments.map((document) => (
                          <tr key={document.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{document.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.type}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(document.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.uploadedBy}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.size}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button type="button" className="text-purple-600 hover:text-purple-900 mr-4">Download</button>
                              <button type="button" className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Drawings Tab Content */}
              {activeTab === 'drawings' && (
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Upload Drawing
                    </button>
                  </div>
                  
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Drawing Name</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Number</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Revision</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Format</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {jobDrawings.map((drawing) => (
                          <tr key={drawing.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{drawing.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{drawing.number}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{drawing.revision}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                drawing.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                drawing.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                                drawing.status === 'Revision Required' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {drawing.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(drawing.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{drawing.format}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button type="button" className="text-purple-600 hover:text-purple-900 mr-4">View</button>
                              <button type="button" className="text-purple-600 hover:text-purple-900">Download</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Delivery Tab Content */}
              {activeTab === 'delivery' && (
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Schedule Delivery
                    </button>
                  </div>
                  
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Elements</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scheduled Date</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Special Requirements</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {jobDeliveries.map((delivery) => (
                          <tr key={delivery.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{delivery.elements}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{delivery.quantity}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(delivery.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                delivery.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {delivery.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{delivery.specialRequirements}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button type="button" className="text-purple-600 hover:text-purple-900 mr-4">Edit</button>
                              <button type="button" className="text-purple-600 hover:text-purple-900">Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
