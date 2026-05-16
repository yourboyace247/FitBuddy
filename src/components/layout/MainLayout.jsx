import { useState } from 'react';

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });
    
    const toggleSidebar = () => {
        const newState = !sidebarOpen;
        setSidebarOpen(newState);
        localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    };

    return (
        <div className="min-h-screen flex flex-col">
           <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
           <div className="flex flex-1">
            <Sidebar isOpen={sidebarOpen} />
            <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-0' : '' }`}>
                {children}
            </main>
           </div>
           <Footer />
        </div>
    );
}