import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function ProjectManagement() {
  const { data: session } = useSession();
  
  // Sample project metrics
  const projectMetrics = [
    { name: 'Active Projects', value: '24', change: '+3', trend: 'up' },
    { name: 'On Schedule', value: '87%', change: '+2%', trend: 'up' },
    { name: 'Budget Variance', value: '-2.3%', change: '+0.7%', trend: 'up' },
    { name: 'Resource Utilization', value: '78%', change: '+5%', trend: 'up' },
  ];
  
  // Sample active projects
  const activeProjects = [
    { id: 1, name: 'Highway Bridge Expansion', client: 'State DOT', status: 'On Track', progress: 65, dueDate: 'Aug 15, 2025' },
    { id: 2, name: 'Commercial Building Foundation', client: 'Metro Builders', status: 'At Risk', progress: 42, dueDate: 'Jul 30, 2025' },
    { id: 3, name: 'Residential Complex', client: 'Highland Development', status: 'On Track', progress: 78, dueDate: 'Sep 10, 2025' },
    { id: 4, name: 'Parking Garage Elements', client: 'City Development', status: 'Delayed', progress: 35, dueDate: 'Jul 05, 2025' },
    { id: 5, name: 'Sports Arena', client: 'Regional Authority', status: 'On Track', progress: 22, dueDate: 'Oct 20, 2025' },
  ];
  
  // Sample upcoming milestones
  const upcomingMilestones = [
    { id: 1, project: 'Highway Bridge Expansion', milestone: 'Final Drawing Approval', dueDate: 'May 30, 2025', status: 'On Track' },
    { id: 2, name: 'Commercial Building Foundation', milestone: 'Production Start', dueDate: 'Jun 05, 2025', status: 'At Risk' },
    { id: 3, name: 'Residential Complex', milestone: 'Quality Inspection', dueDate: 'Jun 10, 2025', status: 'On Track' },
    { id: 4, name: 'Parking Garage Elements', milestone: 'Material Delivery', dueDate: 'Jun 02, 2025', status: 'Delayed' },
  ];

  return (
    <>
      <Head>
        <title>Project Management | Precast Concrete Management System</title>
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Project Management</h1>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Projects
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Project Metrics Section */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Project Metrics</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {projectMetrics.map((metric) => (
                <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Active Projects Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Active Projects</h2>
              <Link href="/project-management/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Project Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Progress</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {activeProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{project.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{project.client}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          project.status === 'On Track' ? 'bg-green-100 text-green-800' : 
                          project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${
                              project.status === 'On Track' ? 'bg-green-600' : 
                              project.status === 'At Risk' ? 'bg-yellow-500' : 'bg-red-600'
                            }`} style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span className="ml-2">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{project.dueDate}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Project Timeline</h2>
            <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">May 2025</span>
                    <h3 className="text-lg font-medium text-gray-900">Current Timeline</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-full py-2" style={{ minWidth: '800px' }}>
                    {/* Timeline header */}
                    <div className="grid grid-cols-31 gap-0">
                      {Array.from({ length: 31 }, (_, i) => (
                        <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    
                    {/* Project timelines */}
                    {activeProjects.slice(0, 3).map((project, idx) => (
                      <div key={project.id} className={`grid grid-cols-31 gap-0 py-2 ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                        <div className="col-span-31 px-2 -mb-2">
                          <span className="text-xs font-medium text-gray-900">{project.name}</span>
                        </div>
                        <div className="col-span-31 h-6 relative">
                          <div 
                            className={`absolute h-4 rounded-full ${
                              project.status === 'On Track' ? 'bg-green-200 border-green-600' : 
                              project.status === 'At Risk' ? 'bg-yellow-200 border-yellow-600' : 'bg-red-200 border-red-600'
                            } border`}
                            style={{ 
                              left: `${(idx * 7) % 20 + 10}%`, 
                              width: `${project.progress}%`,
                              maxWidth: '90%'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Upcoming Milestones</h2>
              <Link href="/project-management/milestones" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Project</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Milestone</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {upcomingMilestones.map((milestone) => (
                    <tr key={milestone.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{milestone.project}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.milestone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{milestone.dueDate}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          milestone.status === 'On Track' ? 'bg-green-100 text-green-800' : 
                          milestone.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {milestone.status}
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
        </div>
      </div>
    </>
  );
}
