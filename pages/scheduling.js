import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Link from 'next/link';

export default function Scheduling() {
  const { data: session, status } = useSession();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('calendar'); // calendar, list, timeline
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock data for initial development
  const mockSchedules = [
    { id: '1', name: 'Project A Production', startDate: '2025-05-30', endDate: '2025-06-15', status: 'Scheduled', project: 'Commercial Building Alpha' },
    { id: '2', name: 'Project B Casting', startDate: '2025-06-01', endDate: '2025-06-10', status: 'In Progress', project: 'Highway Bridge Expansion' },
    { id: '3', name: 'Project C Finishing', startDate: '2025-06-05', endDate: '2025-06-20', status: 'Pending', project: 'Municipal Water Treatment' },
    { id: '4', name: 'Maintenance', startDate: '2025-06-12', endDate: '2025-06-14', status: 'Scheduled', project: 'Internal' },
    { id: '5', name: 'Project D Production', startDate: '2025-06-18', endDate: '2025-07-02', status: 'Scheduled', project: 'Residential Complex' },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/schedules');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setSchedules(mockSchedules);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch schedules');
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleCreateSchedule = () => {
    // In a real implementation, this would open a form or modal
    alert('Create new schedule functionality will be implemented here');
  };

  const handleEditSchedule = (id) => {
    // In a real implementation, this would open a form or modal with the schedule data
    alert(`Edit schedule ${id} functionality will be implemented here`);
  };

  const handleDeleteSchedule = (id) => {
    // In a real implementation, this would show a confirmation dialog
    if (confirm('Are you sure you want to delete this schedule?')) {
      // Then make an API call to delete
      alert(`Delete schedule ${id} functionality will be implemented here`);
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Check if a schedule falls on a specific day
  const getSchedulesForDay = (day) => {
    if (!day) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);
    
    return schedules.filter(schedule => {
      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);
      return date >= start && date <= end;
    });
  };

  // Render calendar view
  const renderCalendarView = () => {
    const days = generateCalendarDays();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => handleDateChange('prev')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button 
            onClick={() => handleDateChange('next')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {dayNames.map(day => (
            <div key={day} className="bg-gray-50 text-center py-2">
              <span className="text-sm font-medium text-gray-500">{day}</span>
            </div>
          ))}
          
          {days.map((day, index) => {
            const daySchedules = getSchedulesForDay(day);
            
            return (
              <div 
                key={index} 
                className={`bg-white min-h-[100px] p-2 ${!day ? 'bg-gray-50' : ''}`}
              >
                {day && (
                  <>
                    <span className="text-sm font-medium">{day}</span>
                    <div className="mt-1 space-y-1">
                      {daySchedules.map(schedule => (
                        <div 
                          key={schedule.id}
                          className={`text-xs p-1 rounded truncate ${
                            schedule.status === 'In Progress' 
                              ? 'bg-blue-100 text-blue-800' 
                              : schedule.status === 'Scheduled' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                          onClick={() => handleEditSchedule(schedule.id)}
                        >
                          {schedule.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{schedule.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{schedule.project}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{schedule.startDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{schedule.endDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    schedule.status === 'In Progress' 
                      ? 'bg-blue-100 text-blue-800' 
                      : schedule.status === 'Scheduled' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {schedule.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditSchedule(schedule.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render timeline view
  const renderTimelineView = () => {
    // Sort schedules by start date
    const sortedSchedules = [...schedules].sort((a, b) => 
      new Date(a.startDate) - new Date(b.startDate)
    );
    
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          {/* Timeline axis */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline events */}
          <div className="space-y-8 ml-6">
            {sortedSchedules.map(schedule => (
              <div key={schedule.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-blue-500"></div>
                
                {/* Event content */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{schedule.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      schedule.status === 'In Progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : schedule.status === 'Scheduled' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Project: {schedule.project}</p>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Start:</span> {schedule.startDate}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {schedule.endDate}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button 
                      onClick={() => handleEditSchedule(schedule.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Production Scheduling</h1>
        <p className="mt-2 text-gray-600">Manage and view all production schedules across projects</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewChange('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Calendar
          </button>
          <button 
            onClick={() => handleViewChange('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            List
          </button>
          <button 
            onClick={() => handleViewChange('timeline')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Timeline
          </button>
        </div>
        
        <button 
          onClick={handleCreateSchedule}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Schedule
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {view === 'calendar' && renderCalendarView()}
          {view === 'list' && renderListView()}
          {view === 'timeline' && renderTimelineView()}
        </div>
      )}
    </div>
  );
}

Scheduling.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};
