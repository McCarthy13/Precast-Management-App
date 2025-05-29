import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Safety() {
  const { data: session } = useSession();
  
  // Sample safety metrics
  const safetyMetrics = [
    { name: 'Days Without Incident', value: '145', change: '+5', trend: 'up' },
    { name: 'Safety Compliance', value: '98%', change: '+2%', trend: 'up' },
    { name: 'Open Safety Issues', value: '3', change: '-2', trend: 'down' },
    { name: 'Training Completion', value: '94%', change: '+3%', trend: 'up' },
  ];
  
  // Sample safety notices
  const safetyNotices = [
    { id: 1, title: 'Updated Fall Protection Protocol', date: 'May 25, 2025', priority: 'High', status: 'New' },
    { id: 2, title: 'Quarterly Safety Training', date: 'June 15, 2025', priority: 'Medium', status: 'Upcoming' },
    { id: 3, title: 'Equipment Inspection Reminder', date: 'May 30, 2025', priority: 'Medium', status: 'Active' },
    { id: 4, title: 'New PPE Requirements', date: 'May 20, 2025', priority: 'High', status: 'Active' },
  ];
  
  // Sample recent incidents
  const recentIncidents = [
    { id: 1, description: 'Minor slip in production area', date: 'April 12, 2025', severity: 'Low', status: 'Resolved' },
    { id: 2, description: 'Near miss with forklift in yard', date: 'March 28, 2025', severity: 'Medium', status: 'Resolved' },
    { id: 3, description: 'Equipment malfunction', date: 'March 15, 2025', severity: 'Medium', status: 'Resolved' },
  ];

  return (
    <>
      <Head>
        <title>Safety | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Safety Management</h1>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Safety Report
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export Safety Data
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Safety Metrics Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Safety Metrics</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {safetyMetrics.map((metric) => (
                <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

          {/* Safety Notices Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Safety Notices</h2>
              <Link href="/safety/notices" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {safetyNotices.map((notice) => (
                    <tr key={notice.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{notice.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{notice.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          notice.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notice.priority}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          notice.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                          notice.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {notice.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Incidents Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Incidents</h2>
              <Link href="/safety/incidents" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Description</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Severity</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{incident.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{incident.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          incident.severity === 'High' ? 'bg-red-100 text-red-800' : 
                          incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          incident.status === 'Open' ? 'bg-red-100 text-red-800' : 
                          incident.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety Resources Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Safety Resources</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Safety Manuals</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Access all company safety manuals and procedures.</p>
                  </div>
                  <div className="mt-3">
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View manuals <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Training Materials</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Access safety training videos and materials.</p>
                  </div>
                  <div className="mt-3">
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View training <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Safety Forms</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Access incident reports and safety inspection forms.</p>
                  </div>
                  <div className="mt-3">
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View forms <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
