import Head from 'next/head';
import { useState } from 'react';

// Sample data for demonstration
const sampleInventory = [
  { id: 1, product: 'Highway Bridge Girders', project: 'Highway Bridge Expansion', quantity: 8, location: 'Zone A', status: 'Ready for Dispatch', daysInYard: 5 },
  { id: 2, product: 'Wall Panels', project: 'Commercial Building Foundation', quantity: 16, location: 'Zone B', status: 'Curing', daysInYard: 2 },
  { id: 3, product: 'Columns', project: 'Parking Garage Elements', quantity: 12, location: 'Zone C', status: 'Quality Check Pending', daysInYard: 3 },
  { id: 4, product: 'Facade Panels', project: 'Residential Complex', quantity: 24, location: 'Zone D', status: 'Ready for Dispatch', daysInYard: 7 },
  { id: 5, product: 'Stadium Seating', project: 'Sports Arena', quantity: 80, location: 'Zone E', status: 'Production Complete', daysInYard: 1 },
];

// Sample yard zones
const yardZones = [
  { id: 'A', name: 'Zone A', capacity: 100, used: 65, products: ['Highway Bridge Girders', 'Beams'] },
  { id: 'B', name: 'Zone B', capacity: 80, used: 45, products: ['Wall Panels', 'Slabs'] },
  { id: 'C', name: 'Zone C', capacity: 120, used: 70, products: ['Columns', 'Piles'] },
  { id: 'D', name: 'Zone D', capacity: 90, used: 85, products: ['Facade Panels', 'Architectural Elements'] },
  { id: 'E', name: 'Zone E', capacity: 150, used: 60, products: ['Stadium Seating', 'Special Elements'] },
];

export default function YardManagement() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const filteredInventory = sampleInventory.filter(item => 
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Yard Management | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Yard Management</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Module Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`${
                    activeTab === 'inventory'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Yard Inventory
                </button>
                <button
                  onClick={() => setActiveTab('zones')}
                  className={`${
                    activeTab === 'zones'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Yard Zones
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`${
                    activeTab === 'map'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Yard Map
                </button>
                <button
                  onClick={() => setActiveTab('optimization')}
                  className={`${
                    activeTab === 'optimization'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Space Optimization
                </button>
              </nav>
            </div>

            {/* Action Bar */}
            {activeTab === 'inventory' && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-64 mb-4 sm:mb-0">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search inventory..."
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
                <div className="flex space-x-3">
                  <div className="inline-flex shadow-sm rounded-md">
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        viewMode === 'list' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
                      } focus:z-10 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500`}
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      List
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        viewMode === 'grid' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
                      } focus:z-10 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500`}
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Grid
                    </button>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Inventory
                  </button>
                </div>
              </div>
            )}

            {/* Yard Inventory Tab Content - List View */}
            {activeTab === 'inventory' && viewMode === 'list' && (
              <div className="mt-8 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Days in Yard
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredInventory.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.product}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{item.project}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === 'Ready for Dispatch' ? 'bg-green-100 text-green-800' :
                                  item.status === 'Curing' ? 'bg-blue-100 text-blue-800' :
                                  item.status === 'Quality Check Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  item.status === 'Production Complete' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.daysInYard}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-purple-600 hover:text-purple-900 mr-4">Move</a>
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

            {/* Yard Inventory Tab Content - Grid View */}
            {activeTab === 'inventory' && viewMode === 'grid' && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInventory.map((item) => (
                  <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                          <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {item.product}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {item.quantity} units
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-5">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Project:</div>
                          <div>{item.project}</div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Location:</div>
                          <div>{item.location}</div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Days in Yard:</div>
                          <div>{item.daysInYard}</div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <div>Status:</div>
                          <div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === 'Ready for Dispatch' ? 'bg-green-100 text-green-800' :
                              item.status === 'Curing' ? 'bg-blue-100 text-blue-800' :
                              item.status === 'Quality Check Pending' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'Production Complete' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Move
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Yard Zones Tab Content */}
            {activeTab === 'zones' && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {yardZones.map((zone) => (
                  <div key={zone.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                          <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {zone.name}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {zone.used} / {zone.capacity} units
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                      <div className="mt-5">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Capacity Usage</span>
                            <span className="text-sm font-medium text-gray-700">{Math.round((zone.used / zone.capacity) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                (zone.used / zone.capacity) > 0.8 ? 'bg-red-600' :
                                (zone.used / zone.capacity) > 0.6 ? 'bg-yellow-600' :
                                'bg-green-600'
                              }`} 
                              style={{ width: `${(zone.used / zone.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <h4 className="text-sm font-medium text-gray-500">Products in Zone</h4>
                        <ul className="mt-2 divide-y divide-gray-200">
                          {zone.products.map((product, index) => (
                            <li key={index} className="py-2 flex justify-between">
                              <span className="text-sm text-gray-600">{product}</span>
                              {index === 0 && (
                                <span className="text-xs text-gray-500">Primary</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-5 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Edit
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
            )}

            {/* Yard Map Tab Content */}
            {activeTab === 'map' && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Interactive Yard Map</h3>
                  <div className="mt-4 text-gray-500">
                    <p>The interactive yard map provides a visual representation of your yard layout and inventory placement.</p>
                    <div className="mt-6 border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Interactive yard map would be displayed here</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          The map would show zones, inventory placement, and allow drag-and-drop functionality.
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                            </svg>
                            Edit Yard Layout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Space Optimization Tab Content */}
            {activeTab === 'optimization' && (
              <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Yard Space Optimization</h3>
                  <div className="mt-4 text-gray-500">
                    <p>The space optimization tool helps you maximize yard efficiency and minimize product movement.</p>
                    <div className="mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-gray-900 mb-2">Current Yard Utilization</h4>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                                Overall
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-purple-600">
                                65%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                            <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                          </div>
                          
                          {yardZones.map((zone) => (
                            <div key={zone.id}>
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                    {zone.name}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-blue-600">
                                    {Math.round((zone.used / zone.capacity) * 100)}%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                <div 
                                  style={{ width: `${(zone.used / zone.capacity) * 100}%` }} 
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                    (zone.used / zone.capacity) > 0.8 ? 'bg-red-500' :
                                    (zone.used / zone.capacity) > 0.6 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-md font-medium text-gray-900 mb-2">Optimization Recommendations</h4>
                          <ul className="divide-y divide-gray-200">
                            <li className="py-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">Consolidate Wall Panels in Zone B</p>
                                  <p className="mt-1 text-sm text-gray-500">Moving all Wall Panels to Zone B would free up 15% space in Zone A.</p>
                                </div>
                              </div>
                            </li>
                            <li className="py-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">Prioritize Zone D for Dispatch</p>
                                  <p className="mt-1 text-sm text-gray-500">Zone D is at 85% capacity with items ready for dispatch.</p>
                                </div>
                              </div>
                            </li>
                            <li className="py-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">Reorganize Zone C</p>
                                  <p className="mt-1 text-sm text-gray-500">Rearranging items in Zone C could improve access efficiency by 25%.</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-md font-medium text-gray-900 mb-2">Efficiency Metrics</h4>
                          <div className="h-64 bg-white p-4 rounded border border-gray-200 flex items-center justify-center">
                            <p className="text-gray-500 text-sm">Efficiency metrics chart would be displayed here</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Run Optimization Analysis
                        </button>
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
