import { Link } from 'react-router-dom';

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Sidebar toggle button */}
        <button
        onClick={toggleSidebar}
        className="p-2 mr-4 rounded-md hover:bg-gray-100 transition-colors"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block h-0.5 w-6 bg-gray-600 transition-all ${sidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-gray-600 transition-all my-1 ${sidebarOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-gray-600 transition-all ${sidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </div>
        </button>
        
        {/* App name */}
        <div className="text-xl font-bold text-cyan-600">
          Fit Buddy
        </div>
        
        {/* Profile icon & drop-down menu */}
        <div className="ml-auto">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </nav>
  );
}