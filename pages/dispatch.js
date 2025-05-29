import Head from 'next/head';
import { useState } from 'react';

// Sample data for demonstration
const sampleDispatchItems = [
  { id: 1, project: 'Highway Bridge Expansion', customer: 'State DOT', location: '123 Highway Ave', scheduledDate: '2025-05-30', status: 'Scheduled', items: 8, driver: 'John Smith', truck: 'T-101' },
  { id: 2, project: 'Commercial Building Foundation', customer: 'ABC Construction', location: '456 Main St', scheduledDate: '2025-05-29', status: 'In Transit', items: 16, driver: 'Sarah Johnson', truck: 'T-102' },
  { id: 3, project: 'Parking Garage Elements', customer: 'City Development', location: '789 Center Blvd', scheduledDate: '2025-06-02', status: 'Pending', items: 12, driver: 'Unassigned', truck: 'Unassigned' },
  { id: 4, project: 'Residential Complex', customer: 'Horizon Homes', location: '321 Sunset Dr', scheduledDate: '2025-05-31', status: 'Loading', items: 24, driver: 'Michael Brown', truck: 'T-103' },
  { id: 5, project: 'Sports Arena', customer: 'Metro Sports Authority', location: '555 Stadium Way', scheduledDate: '2025-06-05', status: 'Scheduled', items: 32, driver: 'David Wilson', truck: 'T-104' },
];

// Sample trucks
const sampleTrucks = [
  { id: 'T-101', name: 'Truck 101', type: 'Flatbed', capacity: '40 tons', status: 'In Use', driver: 'John Smith', maintenance: 'Due in 30 days' },
  { id: 'T-102', name: 'Truck 102', type: 'Lowboy', capacity: '35 tons', status: 'In Use', driver: 'Sarah Johnson', maintenance: 'Due in 15 days' },
  { id: 'T-103', name: 'Truck 103', type: 'Flatbed', capacity: '40 tons', status: 'Loading', driver: 'Michael Brown', maintenance: 'Due in 45 days' },
  { id: 'T-104', name: 'Truck 104', type: 'Specialized', capacity: '50 tons', status: 'Available', driver: 'David Wilson', maintenance: 'Up to date' },
  { id: 'T-105', name: 'Truck 105', type: 'Lowboy', capacity: '35 tons', status: 'Maintenance', driver: 'Unassigned', maintenance: 'In progress' },
];

// Sample drivers
const sampleDrivers = [
  { id: 1, name: 'John Smith', status: 'On Duty', hoursAvailable: 6, currentLocation: 'Highway Bridge Expansion', nextDelivery: 'Completed for today' },
  { id: 2, name: 'Sarah Johnson', status: 'On Duty', hoursAvailable: 4, currentLocation: 'In Transit', nextDelivery: 'Commercial Building Foundation' },
  { id: 3, name: 'Michael Brown', status: 'On Duty', hoursAvailable: 8, currentLocation: 'Yard', nextDelivery: 'Residential Complex' },
  { id: 4, name: 'David Wilson', status: 'Off Duty', hoursAvailable: 0, currentLocation: 'Off Site', nextDelivery: 'Sports Arena (Tomorrow)' },
  { id: 5, name: 'Lisa Garcia', status: 'On Duty', hoursAvailable: 7, currentLocation: 'Yard', nextDelivery: 'Unassigned' },
];

export default function Dispatch() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredDispatchItems = sampleDispatchItems.filter(item => 
    (item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.driver.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (dateFilter ? item.scheduledDate === dateFilter : true) &&
    (statusFilter ? item.status === statusFilter : true)
  );

  return (
    <>
      <Head>
        <title>Dispatch | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dispatch</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Module Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`${
                    activeTab === 'schedule'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Dispatch Schedule
                </button>
                <button
                  onClick={() => setActiveTab('trucks')}
                  className={`${
                    activeTab === 'trucks'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Trucks & Equipment
                </button>
                <button
                  onClick={() => setActiveTab('drivers')}
                  className={`${
                    activeTab === 'drivers'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Drivers
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`${
                    activeTab === 'map'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Route Map
                </button>
              </nav>
            </div>

            {/* Dispatch Schedule Tab Content */}
            {activeTab === 'schedule' && (
              <>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-64">
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="text"
                          className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Search dispatches..."
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
                        id="date-filter"
                        name="date-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      >
                        <option value="">All Dates</option>
                        <option value="2025-05-29">May 29, 2025</option>
                        <option value="2025-05-30">May 30, 2025</option>
                        <option value="2025-05-31">May 31, 2025</option>
                        <option value="2025-06-02">June 2, 2025</option>
                        <option value="2025-06-05">June 5, 2025</option>
                      </select>
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
                        <option value="Scheduled">Scheduled</option>
                        <option value="Loading">Loading</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pending">Pending</option>
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
                      New Dispatch
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Project / Customer
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Driver / Truck
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDispatchItems.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{item.project}</div>
                                  <div className="text-sm text-gray-500">{item.customer}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{item.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{new Date(item.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                    item.status === 'Loading' ? 'bg-yellow-100 text-yellow-800' :
                                    item.status === 'In Transit' ? 'bg-purple-100 text-purple-800' :
                                    item.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    item.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{item.driver}</div>
                                  <div className="text-sm text-gray-500">{item.truck}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.items} items
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <a href="#" className="text-purple-600 hover:text-purple-900 mr-4">Edit</a>
                                  <a href="#" className="text-purple-600 hover:text-purple-900">Details</a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Trucks & Equipment Tab Content */}
            {activeTab === 'trucks' && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sampleTrucks.map((truck) => (
                  <div key={truck.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                          <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {truck.name}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {truck.type}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-5">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Capacity:</div>
                          <div>{truck.capacity}</div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Status:</div>
                          <div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              truck.status === 'Available' ? 'bg-green-100 text-green-800' :
                              truck.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                              truck.status === 'Loading' ? 'bg-yellow-100 text-yellow-800' :
                              truck.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {truck.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Driver:</div>
                          <div>{truck.driver}</div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Maintenance:</div>
                          <div>{truck.maintenance}</div>
                        </div>
                      </div>
                      <div className="mt-5 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Maintenance Log
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Drivers Tab Content */}
            {activeTab === 'drivers' && (
              <div className="mt-8 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Driver
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hours Available
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Current Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Next Delivery
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sampleDrivers.map((driver) => (
                            <tr key={driver.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                      <span className="text-purple-800 font-medium">{driver.name.split(' ').map(n => n[0]).join('')}</span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  driver.status === 'On Duty' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {driver.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {driver.hoursAvailable} hours
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {driver.currentLocation}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {driver.nextDelivery}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-purple-600 hover:text-purple-900 mr-4">Schedule</a>
                                <a href="#" className="text-purple-600 hover:text-purple-900">Details</a>
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

            {/* Route Map Tab Content */}
            {activeTab === 'map' && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Route Map & Tracking</h3>
                  <div className="mt-4 text-gray-500">
                    <p>The route map provides real-time tracking of all dispatched trucks and optimized routing information.</p>
                    <div className="mt-6 border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Interactive route map would be displayed here</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          The map would show real-time truck locations, delivery sites, and optimized routes.
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Refresh Tracking Data
                          </button>
                        </div>
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
