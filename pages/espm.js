import Head from 'next/head';
import { useState } from 'react';

// Sample data for demonstration
const sampleProjects = [
  { id: 1, name: 'Highway Bridge Expansion', client: 'State DOT', status: 'In Progress', value: '$1,250,000', dueDate: '2025-08-15' },
  { id: 2, name: 'Commercial Building Foundation', client: 'ABC Developers', status: 'Estimating', value: '$780,000', dueDate: '2025-09-30' },
  { id: 3, name: 'Parking Garage Elements', client: 'City Metro', status: 'Contracted', value: '$2,100,000', dueDate: '2025-07-22' },
  { id: 4, name: 'Residential Complex Panels', client: 'Highland Homes', status: 'Production', value: '$950,000', dueDate: '2025-06-10' },
  { id: 5, name: 'Stadium Seating Components', client: 'Sports Authority', status: 'Design', value: '$3,500,000', dueDate: '2026-01-15' },
];

export default function ESPM() {
  const [activeTab, setActiveTab] = useState('projects');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = sampleProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Estimating/Sales/Project Management | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Estimating/Sales/Project Management</h1>
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
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('estimates')}
                  className={`${
                    activeTab === 'estimates'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Estimates
                </button>
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`${
                    activeTab === 'sales'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`${
                    activeTab === 'clients'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Clients
                </button>
              </nav>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-64 mb-4 sm:mb-0">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
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
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Project
                </button>
              </div>
            </div>

            {/* Projects Table */}
            {activeTab === 'projects' && (
              <div className="mt-8 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Client
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Value
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredProjects.map((project) => (
                            <tr key={project.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{project.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{project.client}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  project.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                                  project.status === 'Estimating' ? 'bg-yellow-100 text-yellow-800' :
                                  project.status === 'Contracted' ? 'bg-blue-100 text-blue-800' :
                                  project.status === 'Production' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {project.value}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {project.dueDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                                <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estimates Tab Content */}
            {activeTab === 'estimates' && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Estimates</h3>
                  <div className="mt-4 text-gray-500">
                    <p>The Estimates module allows you to create detailed cost estimates for precast concrete projects.</p>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h4 className="text-md font-medium text-gray-900">Create New Estimate</h4>
                        <p className="mt-2 text-sm text-gray-500">Start a new estimate from scratch or based on a template.</p>
                        <button className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          New Estimate
                        </button>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h4 className="text-md font-medium text-gray-900">Estimate Templates</h4>
                        <p className="mt-2 text-sm text-gray-500">Manage your estimate templates for different project types.</p>
                        <button className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          View Templates
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Tab Content */}
            {activeTab === 'sales' && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sales</h3>
                  <div className="mt-4 text-gray-500">
                    <p>The Sales module helps you track leads, opportunities, and sales activities.</p>
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900">Sales Pipeline</h4>
                      <div className="mt-4 relative">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                          <div style={{ width: "25%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                          <div style={{ width: "15%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                          <div style={{ width: "10%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Lead ($2.5M)</span>
                          <span>Qualified ($1.8M)</span>
                          <span>Proposal ($1.2M)</span>
                          <span>Negotiation ($0.8M)</span>
                          <span>Closed ($0.5M)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clients Tab Content */}
            {activeTab === 'clients' && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Clients</h3>
                  <div className="mt-4 text-gray-500">
                    <p>The Clients module allows you to manage your customer database and relationships.</p>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h4 className="text-md font-medium text-gray-900">Active Clients</h4>
                        <p className="mt-2 text-sm text-gray-500">Clients with ongoing projects</p>
                        <div className="mt-2 text-2xl font-bold text-blue-600">24</div>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h4 className="text-md font-medium text-gray-900">Prospects</h4>
                        <p className="mt-2 text-sm text-gray-500">Potential clients in pipeline</p>
                        <div className="mt-2 text-2xl font-bold text-green-600">37</div>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h4 className="text-md font-medium text-gray-900">Total Revenue</h4>
                        <p className="mt-2 text-sm text-gray-500">Year to date</p>
                        <div className="mt-2 text-2xl font-bold text-indigo-600">$4.2M</div>
                      </div>
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
