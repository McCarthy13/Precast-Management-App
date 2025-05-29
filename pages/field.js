import Head from 'next/head';
import { useState } from 'react';

// Sample data for demonstration
const sampleFieldProjects = [
  { id: 1, project: 'Highway Bridge Expansion', location: '123 Highway Ave', supervisor: 'Mark Johnson', status: 'In Progress', completion: 65, lastUpdate: '2025-05-28' },
  { id: 2, project: 'Commercial Building Foundation', location: '456 Main St', supervisor: 'Lisa Garcia', status: 'Scheduled', completion: 0, lastUpdate: '2025-05-27' },
  { id: 3, project: 'Parking Garage Elements', location: '789 Center Blvd', supervisor: 'Robert Chen', status: 'Completed', completion: 100, lastUpdate: '2025-05-25' },
  { id: 4, project: 'Residential Complex', location: '321 Sunset Dr', supervisor: 'Sarah Wilson', status: 'In Progress', completion: 45, lastUpdate: '2025-05-28' },
  { id: 5, project: 'Sports Arena', location: '555 Stadium Way', supervisor: 'James Martinez', status: 'Issue Reported', completion: 78, lastUpdate: '2025-05-29' },
];

// Sample issues
const sampleIssues = [
  { id: 1, project: 'Highway Bridge Expansion', reportedBy: 'Field Team', date: '2025-05-26', status: 'Under Review', priority: 'Medium', description: 'Alignment issue with connecting segment' },
  { id: 2, project: 'Sports Arena', reportedBy: 'Mark Johnson', date: '2025-05-29', status: 'Open', priority: 'High', description: 'Cracking observed in section C panels' },
  { id: 3, project: 'Residential Complex', reportedBy: 'Quality Control', date: '2025-05-24', status: 'Resolved', priority: 'Low', description: 'Minor surface finish inconsistency' },
  { id: 4, project: 'Commercial Building Foundation', reportedBy: 'Client', date: '2025-05-22', status: 'Closed', priority: 'Medium', description: 'Dimensional variance concern - within tolerance' },
];

// Sample installation logs
const sampleLogs = [
  { id: 1, project: 'Highway Bridge Expansion', element: 'Girder B-12', installedBy: 'Team A', date: '2025-05-25', notes: 'Installed as per specifications' },
  { id: 2, project: 'Highway Bridge Expansion', element: 'Girder B-13', installedBy: 'Team A', date: '2025-05-26', notes: 'Minor adjustment required for alignment' },
  { id: 3, project: 'Residential Complex', element: 'Wall Panel W-45', installedBy: 'Team C', date: '2025-05-27', notes: 'Installation complete, sealant applied' },
  { id: 4, project: 'Residential Complex', element: 'Wall Panel W-46', installedBy: 'Team C', date: '2025-05-27', notes: 'Installation complete, sealant applied' },
  { id: 5, project: 'Sports Arena', element: 'Seating Section S-08', installedBy: 'Team B', date: '2025-05-28', notes: 'Installation complete, issue with alignment noted' },
];

export default function Field() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProjects = sampleFieldProjects.filter(item => 
    (item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supervisor.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter ? item.status === statusFilter : true)
  );

  return (
    <>
      <Head>
        <title>Field Module | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Field Module</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Module Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`${
                    activeTab === 'projects'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Field Projects
                </button>
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`${
                    activeTab === 'issues'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Field Issues
                </button>
                <button
                  onClick={() => setActiveTab('installation')}
                  className={`${
                    activeTab === 'installation'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Installation Logs
                </button>
                <button
                  onClick={() => setActiveTab('documentation')}
                  className={`${
                    activeTab === 'documentation'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Field Documentation
                </button>
              </nav>
            </div>

            {/* Field Projects Tab Content */}
            {activeTab === 'projects' && (
              <>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-64">
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="text"
                          className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Search projects..."
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
                        <option value="Issue Reported">Issue Reported</option>
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
                      New Field Project
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {project.project}
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {project.location}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                        <div className="mt-5">
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <div>Supervisor:</div>
                            <div>{project.supervisor}</div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <div>Status:</div>
                            <div>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'Issue Reported' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <div>Last Update:</div>
                            <div>{new Date(project.lastUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="text-gray-500">Completion</div>
                              <div className="font-medium text-gray-900">{project.completion}%</div>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  project.completion >= 80 ? 'bg-green-600' :
                                  project.completion >= 40 ? 'bg-blue-600' :
                                  'bg-yellow-600'
                                }`} 
                                style={{ width: `${project.completion}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-end space-x-3">
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            Update Status
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Field Issues Tab Content */}
            {activeTab === 'issues' && (
              <div className="mt-8 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reported By
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Priority
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sampleIssues.map((issue) => (
                            <tr key={issue.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{issue.project}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{issue.reportedBy}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(issue.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  issue.status === 'Open' ? 'bg-red-100 text-red-800' :
                                  issue.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                  issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                  issue.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {issue.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  issue.priority === 'High' ? 'bg-red-100 text-red-800' :
                                  issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  issue.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {issue.priority}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                {issue.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-purple-600 hover:text-purple-900 mr-4">Update</a>
                                <a href="#" className="text-purple-600 hover:text-purple-900">Details</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Report New Issue
                  </button>
                </div>
              </div>
            )}

            {/* Installation Logs Tab Content */}
            {activeTab === 'installation' && (
              <div className="mt-8 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project / Element
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Installed By
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sampleLogs.map((log) => (
                            <tr key={log.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{log.project}</div>
                                <div className="text-sm text-gray-500">{log.element}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{log.installedBy}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                {log.notes}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-purple-600 hover:text-purple-900 mr-4">Photos</a>
                                <a href="#" className="text-purple-600 hover:text-purple-900">Details</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Log New Installation
                  </button>
                </div>
              </div>
            )}

            {/* Field Documentation Tab Content */}
            {activeTab === 'documentation' && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Field Documentation</h3>
                  <div className="mt-4 text-gray-500">
                    <p>Access and manage field documentation including installation guides, safety protocols, and technical specifications.</p>
                    
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="document-type" className="block text-sm font-medium text-gray-700">
                          Document Type
                        </label>
                        <select
                          id="document-type"
                          name="document-type"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                          <option>Installation Guides</option>
                          <option>Safety Protocols</option>
                          <option>Technical Specifications</option>
                          <option>Field Checklists</option>
                          <option>Training Materials</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="project-filter" className="block text-sm font-medium text-gray-700">
                          Project
                        </label>
                        <select
                          id="project-filter"
                          name="project-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                          <option>All Projects</option>
                          <option>Highway Bridge Expansion</option>
                          <option>Commercial Building Foundation</option>
                          <option>Parking Garage Elements</option>
                          <option>Residential Complex</option>
                          <option>Sports Arena</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h4 className="text-md font-medium text-gray-900">Available Documents</h4>
                      <ul className="mt-4 divide-y divide-gray-200">
                        <li className="py-4 flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Bridge Girder Installation Guide</p>
                                <p className="text-sm text-gray-500">Last updated: May 15, 2025</p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <button
                                  type="button"
                                  className="ml-1 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="py-4 flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Field Safety Protocol - Crane Operations</p>
                                <p className="text-sm text-gray-500">Last updated: April 22, 2025</p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <button
                                  type="button"
                                  className="ml-1 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="py-4 flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Wall Panel Technical Specifications</p>
                                <p className="text-sm text-gray-500">Last updated: May 10, 2025</p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <button
                                  type="button"
                                  className="ml-1 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="py-4 flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Pre-Installation Checklist</p>
                                <p className="text-sm text-gray-500">Last updated: May 20, 2025</p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                <button
                                  type="button"
                                  className="ml-1 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Upload New Document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
