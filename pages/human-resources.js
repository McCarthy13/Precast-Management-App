import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function HumanResources() {
  const { data: session } = useSession();
  
  // Sample HR metrics
  const hrMetrics = [
    { name: 'Total Employees', value: '156', change: '+8', trend: 'up' },
    { name: 'Retention Rate', value: '94%', change: '+2%', trend: 'up' },
    { name: 'Open Positions', value: '7', change: '-2', trend: 'down' },
    { name: 'Training Completion', value: '87%', change: '+5%', trend: 'up' },
  ];
  
  // Sample employee data
  const employees = [
    { id: 1, name: 'James Wilson', position: 'Production Manager', department: 'Production', status: 'Active', hireDate: 'Jan 15, 2020' },
    { id: 2, name: 'Maria Rodriguez', position: 'Senior Engineer', department: 'Engineering', status: 'Active', hireDate: 'Mar 10, 2019' },
    { id: 3, name: 'Robert Johnson', position: 'Quality Inspector', department: 'Quality', status: 'Active', hireDate: 'Sep 22, 2021' },
    { id: 4, name: 'Emily Chen', position: 'HR Specialist', department: 'Human Resources', status: 'Active', hireDate: 'Jul 05, 2022' },
    { id: 5, name: 'David Kim', position: 'Yard Supervisor', department: 'Operations', status: 'On Leave', hireDate: 'Feb 18, 2018' },
  ];
  
  // Sample upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Quarterly Safety Training', date: 'Jun 15, 2025', type: 'Training', participants: 45 },
    { id: 2, title: 'New Hire Orientation', date: 'Jun 01, 2025', type: 'Onboarding', participants: 3 },
    { id: 3, title: 'Performance Reviews', date: 'Jul 10-20, 2025', type: 'Evaluation', participants: 'All Staff' },
    { id: 4, title: 'Team Building Event', date: 'Jun 25, 2025', type: 'Company Event', participants: 'All Staff' },
  ];

  return (
    <>
      <Head>
        <title>Human Resources | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Human Resources</h1>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Employee
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export HR Data
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* HR Metrics Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">HR Metrics</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hrMetrics.map((metric) => (
                <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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

          {/* Quick Actions Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Time Off Requests</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Review and approve pending time off requests.</p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      5 Pending
                    </span>
                  </div>
                  <div className="mt-3">
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View requests <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Onboarding</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Manage onboarding processes for new employees.</p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      3 In Progress
                    </span>
                  </div>
                  <div className="mt-3">
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View onboarding <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Performance Reviews</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Schedule and manage employee performance reviews.</p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Upcoming in July
                    </span>
                  </div>
                  <div className="mt-3">
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Manage reviews <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Directory Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Employee Directory</h2>
              <Link href="/human-resources/employees" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Hire Date</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{employee.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.position}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.department}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.hireDate}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h2>
              <Link href="/human-resources/events" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Event</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Participants</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {upcomingEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{event.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{event.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          event.type === 'Training' ? 'bg-blue-100 text-blue-800' : 
                          event.type === 'Onboarding' ? 'bg-green-100 text-green-800' : 
                          event.type === 'Evaluation' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{event.participants}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
    </>
  );
}
