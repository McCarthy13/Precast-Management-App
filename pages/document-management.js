import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function DocumentManagement() {
  const { data: session } = useSession();
  
  // Sample document metrics
  const documentMetrics = [
    { name: 'Total Documents', value: '1,245', change: '+87', trend: 'up' },
    { name: 'Recent Uploads', value: '32', change: '+12', trend: 'up' },
    { name: 'Pending Approvals', value: '18', change: '-3', trend: 'down' },
    { name: 'Storage Used', value: '64%', change: '+5%', trend: 'up' },
  ];
  
  // Sample recent documents
  const recentDocuments = [
    { id: 1, name: 'Highway Bridge Expansion - Structural Analysis.pdf', type: 'PDF', size: '4.2 MB', uploadedBy: 'Maria Rodriguez', uploadDate: 'May 25, 2025', status: 'Active' },
    { id: 2, name: 'Commercial Building Foundation - Revised Drawings.dwg', type: 'CAD', size: '8.7 MB', uploadedBy: 'Robert Johnson', uploadDate: 'May 24, 2025', status: 'Pending Review' },
    { id: 3, name: 'Quality Control Procedures - 2025 Update.docx', type: 'Document', size: '1.3 MB', uploadedBy: 'Emily Chen', uploadDate: 'May 22, 2025', status: 'Active' },
    { id: 4, name: 'Residential Complex - Material Specifications.xlsx', type: 'Spreadsheet', size: '2.8 MB', uploadedBy: 'James Wilson', uploadDate: 'May 20, 2025', status: 'Active' },
    { id: 5, name: 'Safety Training Materials - Q2 2025.pptx', type: 'Presentation', size: '5.1 MB', uploadedBy: 'David Kim', uploadDate: 'May 18, 2025', status: 'Active' },
  ];
  
  // Sample document categories
  const documentCategories = [
    { id: 1, name: 'Project Documents', count: 456, icon: 'folder' },
    { id: 2, name: 'Engineering Drawings', count: 287, icon: 'drawing' },
    { id: 3, name: 'Quality Control', count: 124, icon: 'clipboard-check' },
    { id: 4, name: 'Safety Documentation', count: 98, icon: 'shield-check' },
    { id: 5, name: 'HR Documents', count: 76, icon: 'users' },
    { id: 6, name: 'Contracts & Legal', count: 112, icon: 'document-text' },
    { id: 7, name: 'Training Materials', count: 92, icon: 'academic-cap' },
  ];

  return (
    <>
      <Head>
        <title>Document Management | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Document Management</h1>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Document
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Documents
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Document Metrics Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Document Metrics</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {documentMetrics.map((metric) => (
                <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {metric.name}
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {metric.value}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center">
                      {metric.trend === 'up' ? (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="sr-only">Increased by</span>
                          {metric.change}
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium flex items-center">
                          <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="sr-only">Decreased by</span>
                          {metric.change}
                        </span>
                      )}
                      <span className="text-gray-500 text-sm ml-2">from last period</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="search" className="sr-only">Search documents</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="search"
                        id="search"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Search documents"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="document-type" className="sr-only">Document Type</label>
                    <select
                      id="document-type"
                      name="document-type"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option>All Types</option>
                      <option>PDF</option>
                      <option>CAD</option>
                      <option>Document</option>
                      <option>Spreadsheet</option>
                      <option>Presentation</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Categories Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Document Categories</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {documentCategories.map((category) => (
                <div key={category.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-900 truncate">
                            {category.name}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-500">
                            {category.count} documents
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Browse category <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Documents</h2>
              <Link href="/document-management/documents" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Document Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Size</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uploaded By</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Upload Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentDocuments.map((document) => (
                    <tr key={document.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{document.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          document.type === 'PDF' ? 'bg-red-100 text-red-800' : 
                          document.type === 'CAD' ? 'bg-blue-100 text-blue-800' : 
                          document.type === 'Document' ? 'bg-purple-100 text-purple-800' : 
                          document.type === 'Spreadsheet' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {document.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.size}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.uploadedBy}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{document.uploadDate}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          document.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                        <a href="#" className="text-blue-600 hover:text-blue-900">Download</a>
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
  );
}
