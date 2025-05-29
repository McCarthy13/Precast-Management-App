import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Configuration() {
  const { data: session } = useSession();
  
  // Sample configuration categories
  const configCategories = [
    { id: 1, name: 'General Settings', description: 'Basic application settings and preferences', icon: 'cog' },
    { id: 2, name: 'User Management', description: 'Manage users, roles, and permissions', icon: 'users' },
    { id: 3, name: 'Module Configuration', description: 'Configure individual module settings', icon: 'template' },
    { id: 4, name: 'Notifications', description: 'Configure email and system notifications', icon: 'bell' },
    { id: 5, name: 'Integrations', description: 'Manage third-party integrations and APIs', icon: 'link' },
    { id: 6, name: 'Data Management', description: 'Database settings and data maintenance', icon: 'database' },
    { id: 7, name: 'System Logs', description: 'View system logs and activity history', icon: 'document-text' },
  ];
  
  // Sample recent configuration changes
  const recentChanges = [
    { id: 1, setting: 'Email Notification Templates', user: 'Emily Chen', date: 'May 25, 2025', time: '14:32' },
    { id: 2, setting: 'User Role Permissions', user: 'James Wilson', date: 'May 24, 2025', time: '10:15' },
    { id: 3, setting: 'Production Module Settings', user: 'Maria Rodriguez', date: 'May 22, 2025', time: '16:45' },
    { id: 4, setting: 'Document Storage Configuration', user: 'Robert Johnson', date: 'May 20, 2025', time: '09:20' },
  ];
  
  // Sample system status
  const systemStatus = [
    { id: 1, name: 'Application Server', status: 'Operational', uptime: '99.98%', lastRestart: 'May 15, 2025' },
    { id: 2, name: 'Database Server', status: 'Operational', uptime: '99.95%', lastRestart: 'May 10, 2025' },
    { id: 3, name: 'File Storage', status: 'Operational', uptime: '100%', lastRestart: 'May 5, 2025' },
    { id: 4, name: 'Email Service', status: 'Operational', uptime: '99.92%', lastRestart: 'May 12, 2025' },
  ];

  return (
    <>
      <Head>
        <title>Configuration | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">System Configuration</h1>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              System Actions
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Backup System
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* System Status Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">System Status</h2>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Component</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uptime</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Restart</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {systemStatus.map((component) => (
                    <tr key={component.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{component.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          component.status === 'Operational' ? 'bg-green-100 text-green-800' : 
                          component.status === 'Degraded' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {component.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{component.uptime}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{component.lastRestart}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">Details</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Configuration Categories Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Configuration Categories</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {configCategories.map((category) => (
                <div key={category.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-900 truncate">
                            {category.name}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-500">
                            {category.description}
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Configure settings <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Changes Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Configuration Changes</h2>
              <Link href="/configuration/history" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Setting</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Modified By</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentChanges.map((change) => (
                    <tr key={change.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{change.setting}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{change.user}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{change.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{change.time}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">View Details</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Maintenance Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">System Maintenance</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Database Maintenance</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Optimize database performance and run maintenance tasks.</p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Run Maintenance
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">System Backup</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Create a full system backup of all data and configurations.</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Last backup: May 27, 2025 (01:00 AM)</p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Backup
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Clear Cache</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Clear system cache to resolve performance issues.</p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear Cache
                    </button>
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
