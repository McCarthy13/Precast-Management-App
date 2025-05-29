import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Sample data for different role dashboards
const adminMetrics = [
  { name: 'Active Projects', value: '24', change: '+3', trend: 'up' },
  { name: 'Total Users', value: '156', change: '+12', trend: 'up' },
  { name: 'System Uptime', value: '99.8%', change: '+0.2%', trend: 'up' },
  { name: 'Open Issues', value: '18', change: '-5', trend: 'down' },
];

const projectManagerMetrics = [
  { name: 'Active Projects', value: '24', change: '+3', trend: 'up' },
  { name: 'On Schedule', value: '87%', change: '+2%', trend: 'up' },
  { name: 'Resource Utilization', value: '78%', change: '+5%', trend: 'up' },
  { name: 'Budget Variance', value: '-2.3%', change: '+0.7%', trend: 'up' },
];

const salesMetrics = [
  { name: 'Open Leads', value: '42', change: '+8', trend: 'up' },
  { name: 'Proposals Sent', value: '17', change: '+3', trend: 'up' },
  { name: 'Win Rate', value: '68%', change: '+5%', trend: 'up' },
  { name: 'Monthly Revenue', value: '$1.2M', change: '+$150K', trend: 'up' },
];

const engineeringMetrics = [
  { name: 'Active Drawings', value: '87', change: '+12', trend: 'up' },
  { name: 'Pending Approvals', value: '14', change: '-3', trend: 'down' },
  { name: 'Revisions This Week', value: '23', change: '+5', trend: 'up' },
  { name: 'Engineering Hours', value: '320', change: '+40', trend: 'up' },
];

const productionMetrics = [
  { name: 'Production Efficiency', value: '92%', change: '+3%', trend: 'up' },
  { name: 'Units Produced', value: '156', change: '+22', trend: 'up' },
  { name: 'Quality Pass Rate', value: '98.5%', change: '+0.5%', trend: 'up' },
  { name: 'Material Utilization', value: '94%', change: '+2%', trend: 'up' },
];

const dispatchMetrics = [
  { name: 'Scheduled Deliveries', value: '18', change: '+3', trend: 'up' },
  { name: 'On-Time Delivery', value: '95%', change: '+2%', trend: 'up' },
  { name: 'Fleet Utilization', value: '82%', change: '+5%', trend: 'up' },
  { name: 'Avg Delivery Time', value: '3.2 hrs', change: '-0.3 hrs', trend: 'down' },
];

// Sample recent activities
const recentActivities = [
  { id: 1, user: 'John Smith', action: 'updated project', target: 'Highway Bridge Expansion', time: '10 minutes ago' },
  { id: 2, user: 'Lisa Garcia', action: 'approved drawing', target: 'Commercial Building Foundation', time: '25 minutes ago' },
  { id: 3, user: 'Robert Chen', action: 'created new estimate', target: 'Parking Garage Elements', time: '1 hour ago' },
  { id: 4, user: 'Sarah Wilson', action: 'scheduled delivery', target: 'Residential Complex', time: '2 hours ago' },
  { id: 5, user: 'James Martinez', action: 'reported quality issue', target: 'Sports Arena', time: '3 hours ago' },
];

// Sample upcoming deadlines
const upcomingDeadlines = [
  { id: 1, project: 'Highway Bridge Expansion', task: 'Final Drawing Approval', deadline: 'Tomorrow, 5:00 PM', status: 'On Track' },
  { id: 2, project: 'Commercial Building Foundation', task: 'Production Start', deadline: 'May 30, 2025', status: 'At Risk' },
  { id: 3, project: 'Parking Garage Elements', task: 'Quality Inspection', deadline: 'June 2, 2025', status: 'On Track' },
  { id: 4, project: 'Residential Complex', task: 'Delivery Schedule', deadline: 'June 5, 2025', status: 'On Track' },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState('admin'); // This would normally come from the session

  // Function to get metrics based on user role
  const getMetricsForRole = (role) => {
    switch(role) {
      case 'admin':
        return adminMetrics;
      case 'project_manager':
        return projectManagerMetrics;
      case 'sales':
        return salesMetrics;
      case 'engineering':
        return engineeringMetrics;
      case 'production':
        return productionMetrics;
      case 'dispatch':
        return dispatchMetrics;
      default:
        return adminMetrics;
    }
  };

  // Get role-specific metrics
  const metrics = getMetricsForRole(userRole);

  // Function to get dashboard title based on user role
  const getDashboardTitle = (role) => {
    switch(role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'project_manager':
        return 'Project Manager Dashboard';
      case 'sales':
        return 'Sales Dashboard';
      case 'engineering':
        return 'Engineering Dashboard';
      case 'production':
        return 'Production Dashboard';
      case 'dispatch':
        return 'Dispatch Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // For demo purposes, allow switching between roles
  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };

  return (
    <>
      <Head>
        <title>{getDashboardTitle(userRole)} | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{getDashboardTitle(userRole)}</h1>
          
          {/* Role Selector (for demo purposes) */}
          <div className="flex items-center">
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mr-2">
              View As:
            </label>
            <select
              id="role-select"
              name="role-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              value={userRole}
              onChange={handleRoleChange}
            >
              <option value="admin">Administrator</option>
              <option value="project_manager">Project Manager</option>
              <option value="sales">Sales Representative</option>
              <option value="engineering">Engineering</option>
              <option value="production">Production</option>
              <option value="dispatch">Dispatch</option>
            </select>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Key Metrics Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Key Metrics</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

          {/* Quick Access Modules Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Access</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/jobs" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50 transition duration-150">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage all job information, contacts, documents, and details
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/espm" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50 transition duration-150">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Project Management</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Track project timelines, resources, and milestones
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/sales" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50 transition duration-150">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Sales</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage leads, opportunities, and customer relationships
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/drafting" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50 transition duration-150">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Engineering/Drafting</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage drawings, revisions, and technical specifications
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/production" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50 transition duration-150">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Production</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Monitor production schedules, resources, and efficiency
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/quality" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50 transition duration-150">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Quality Control</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage quality inspections, issues, and compliance
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Two Column Layout for Recent Activities and Upcoming Deadlines */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Activities */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {activity.user.split(' ').map(name => name[0]).join('')}
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.target}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                      View all activity <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Deadlines</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {upcomingDeadlines.map((deadline) => (
                    <li key={deadline.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{deadline.task}</p>
                          <p className="text-sm text-gray-500">{deadline.project}</p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 mr-4">{deadline.deadline}</p>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            deadline.status === 'On Track' ? 'bg-green-100 text-green-800' :
                            deadline.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' :
                            deadline.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {deadline.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                      View all deadlines <span aria-hidden="true">&rarr;</span>
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
