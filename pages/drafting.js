import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Link from 'next/link';

export default function Drafting() {
  const { data: session, status } = useSession();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  
  // Mock data for initial development
  const mockDrawings = [
    { 
      id: '1', 
      name: 'Foundation Plan', 
      description: 'Detailed foundation layout for Building A', 
      fileUrl: '/drawings/foundation-plan.pdf', 
      version: '1.2',
      status: 'Released',
      project: 'Commercial Building Alpha',
      lastModified: '2025-05-15',
      createdBy: 'John Engineer',
      revisions: [
        { version: '1.2', date: '2025-05-15', author: 'John Engineer', notes: 'Updated dimensions per client request' },
        { version: '1.1', date: '2025-05-10', author: 'John Engineer', notes: 'Added reinforcement details' },
        { version: '1.0', date: '2025-05-01', author: 'John Engineer', notes: 'Initial release' }
      ]
    },
    { 
      id: '2', 
      name: 'Column Details', 
      description: 'Precast column specifications and connections', 
      fileUrl: '/drawings/column-details.pdf', 
      version: '2.0',
      status: 'In Review',
      project: 'Highway Bridge Expansion',
      lastModified: '2025-05-20',
      createdBy: 'Sarah Designer',
      revisions: [
        { version: '2.0', date: '2025-05-20', author: 'Sarah Designer', notes: 'Major revision to meet new load requirements' },
        { version: '1.0', date: '2025-04-25', author: 'Sarah Designer', notes: 'Initial release' }
      ]
    },
    { 
      id: '3', 
      name: 'Wall Panel Type A', 
      description: 'Exterior wall panel details', 
      fileUrl: '/drawings/wall-panel-a.pdf', 
      version: '1.0',
      status: 'Draft',
      project: 'Municipal Water Treatment',
      lastModified: '2025-05-18',
      createdBy: 'Mike Drafter',
      revisions: [
        { version: '1.0', date: '2025-05-18', author: 'Mike Drafter', notes: 'Initial draft' }
      ]
    },
    { 
      id: '4', 
      name: 'Beam Connection Details', 
      description: 'Standard connection details for precast beams', 
      fileUrl: '/drawings/beam-connections.pdf', 
      version: '3.1',
      status: 'Released',
      project: 'Residential Complex',
      lastModified: '2025-05-12',
      createdBy: 'John Engineer',
      revisions: [
        { version: '3.1', date: '2025-05-12', author: 'John Engineer', notes: 'Updated weld specifications' },
        { version: '3.0', date: '2025-05-05', author: 'John Engineer', notes: 'Complete redesign of connection system' },
        { version: '2.1', date: '2025-04-20', author: 'John Engineer', notes: 'Minor updates to bolt specifications' },
        { version: '2.0', date: '2025-04-10', author: 'Sarah Designer', notes: 'Added alternative connection options' },
        { version: '1.0', date: '2025-03-15', author: 'Sarah Designer', notes: 'Initial release' }
      ]
    },
    { 
      id: '5', 
      name: 'Stair Details', 
      description: 'Precast stair components and assembly', 
      fileUrl: '/drawings/stair-details.pdf', 
      version: '1.1',
      status: 'Released',
      project: 'Commercial Building Alpha',
      lastModified: '2025-05-08',
      createdBy: 'Mike Drafter',
      revisions: [
        { version: '1.1', date: '2025-05-08', author: 'Mike Drafter', notes: 'Updated railing details' },
        { version: '1.0', date: '2025-04-30', author: 'Mike Drafter', notes: 'Initial release' }
      ]
    },
  ];

  // Mock projects for dropdown
  const mockProjects = [
    { id: 'p1', name: 'Commercial Building Alpha' },
    { id: 'p2', name: 'Highway Bridge Expansion' },
    { id: 'p3', name: 'Municipal Water Treatment' },
    { id: 'p4', name: 'Residential Complex' },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchDrawings = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/drawings');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setDrawings(mockDrawings);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch drawings');
        setLoading(false);
      }
    };

    fetchDrawings();
  }, []);

  const filteredDrawings = drawings.filter(drawing => {
    // Filter by tab
    if (activeTab !== 'all' && drawing.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !drawing.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !drawing.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !drawing.project.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDrawingClick = (drawing) => {
    setSelectedDrawing(drawing);
  };

  const handleCloseDrawingDetails = () => {
    setSelectedDrawing(null);
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // In a real implementation, this would handle the file upload
    const file = e.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}. In a real implementation, this would upload the file.`);
    }
  };

  const handleCreateRevision = (drawingId) => {
    setShowRevisionModal(true);
  };

  const handleCloseRevisionModal = () => {
    setShowRevisionModal(false);
  };

  const handleReleaseDrawing = (drawingId) => {
    // In a real implementation, this would update the drawing status via API
    alert(`Drawing ${drawingId} would be released. This would update the status via API.`);
  };

  const handleDeleteDrawing = (drawingId) => {
    // In a real implementation, this would show a confirmation dialog
    if (confirm('Are you sure you want to delete this drawing?')) {
      // Then make an API call to delete
      alert(`Delete drawing ${drawingId} functionality would be implemented here.`);
    }
  };

  // Render drawing list
  const renderDrawingList = () => {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDrawings.map((drawing) => (
            <li key={drawing.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" onClick={() => handleDrawingClick(drawing)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600">{drawing.name}</div>
                      <div className="text-sm text-gray-500">{drawing.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-500">Version {drawing.version}</div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      drawing.status === 'Released' 
                        ? 'bg-green-100 text-green-800' 
                        : drawing.status === 'In Review' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {drawing.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {drawing.project}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>
                      Last modified on <time dateTime={drawing.lastModified}>{drawing.lastModified}</time>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render drawing details modal
  const renderDrawingDetails = () => {
    if (!selectedDrawing) return null;
    
    return (
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedDrawing.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleCreateRevision(selectedDrawing.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Create Revision
                      </button>
                      {selectedDrawing.status !== 'Released' && (
                        <button
                          type="button"
                          onClick={() => handleReleaseDrawing(selectedDrawing.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Release
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteDrawing(selectedDrawing.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Drawing Information</h4>
                        <div className="mt-2 space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Description:</span>
                            <p className="text-sm text-gray-900">{selectedDrawing.description}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Project:</span>
                            <p className="text-sm text-gray-900">{selectedDrawing.project}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Current Version:</span>
                            <p className="text-sm text-gray-900">{selectedDrawing.version}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Status:</span>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              selectedDrawing.status === 'Released' 
                                ? 'bg-green-100 text-green-800' 
                                : selectedDrawing.status === 'In Review' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedDrawing.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Last Modified:</span>
                            <p className="text-sm text-gray-900">{selectedDrawing.lastModified}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Created By:</span>
                            <p className="text-sm text-gray-900">{selectedDrawing.createdBy}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Drawing Preview</h4>
                        <div className="mt-2 border border-gray-200 rounded-md p-4 h-48 flex items-center justify-center bg-gray-50">
                          <p className="text-gray-500">Preview would be displayed here</p>
                        </div>
                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Drawing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500">Revision History</h4>
                    <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Version</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {selectedDrawing.revisions.map((revision, index) => (
                            <tr key={index}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{revision.version}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{revision.date}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{revision.author}</td>
                              <td className="px-3 py-4 text-sm text-gray-500">{revision.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleCloseDrawingDetails}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render upload modal
  const renderUploadModal = () => {
    if (!showUploadModal) return null;
    
    return (
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Upload New Drawing</h3>
                  <div className="mt-4">
                    <form>
                      <div className="mb-4">
                        <label htmlFor="drawing-name" className="block text-sm font-medium text-gray-700">Drawing Name</label>
                        <input
                          type="text"
                          id="drawing-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter drawing name"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="drawing-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="drawing-description"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter drawing description"
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="drawing-project" className="block text-sm font-medium text-gray-700">Project</label>
                        <select
                          id="drawing-project"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select a project</option>
                          {mockProjects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Drawing File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span onClick={handleFileSelect}>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DWG, DXF, RVT up to 50MB</p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={handleCloseUploadModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render revision modal
  const renderRevisionModal = () => {
    if (!showRevisionModal || !selectedDrawing) return null;
    
    return (
      <div className="fixed inset-0 overflow-y-auto z-50">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Revision</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Creating a new revision for: <span className="font-medium">{selectedDrawing.name}</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <form>
                      <div className="mb-4">
                        <label htmlFor="revision-version" className="block text-sm font-medium text-gray-700">New Version</label>
                        <input
                          type="text"
                          id="revision-version"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="e.g., 1.3"
                          defaultValue={parseFloat(selectedDrawing.version) + 0.1}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="revision-notes" className="block text-sm font-medium text-gray-700">Revision Notes</label>
                        <textarea
                          id="revision-notes"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Describe the changes in this revision"
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Updated Drawing File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="revision-file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span onClick={handleFileSelect}>Upload a file</span>
                                <input
                                  id="revision-file-upload"
                                  name="revision-file-upload"
                                  type="file"
                                  className="sr-only"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DWG, DXF, RVT up to 50MB</p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Create Revision
              </button>
              <button
                type="button"
                onClick={handleCloseRevisionModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Engineering & Drafting</h1>
        <p className="mt-2 text-gray-600">Manage and organize all engineering drawings and documents</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Drawings
          </button>
          <button 
            onClick={() => handleTabChange('released')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'released' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Released
          </button>
          <button 
            onClick={() => handleTabChange('in review')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'in review' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            In Review
          </button>
          <button 
            onClick={() => handleTabChange('draft')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'draft' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Draft
          </button>
        </div>
        
        <button 
          onClick={handleUploadClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Upload Drawing
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search drawings by name, description, or project"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
      ) : filteredDrawings.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No drawings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by uploading a new drawing.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleUploadClick}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Upload Drawing
            </button>
          </div>
        </div>
      ) : (
        renderDrawingList()
      )}
      
      {/* Modals */}
      {renderDrawingDetails()}
      {renderUploadModal()}
      {renderRevisionModal()}
    </div>
  );
}

Drafting.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};
