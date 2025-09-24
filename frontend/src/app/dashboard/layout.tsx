// app/dashboard/layout.tsx
"use client";

import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar - Always rendered, hidden on mobile unless open */}

      <Navbar onMenuClick={toggleSidebar} />
      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen lg:ml-64">
        {/* Fixed Navbar */}
        <div className="relative z-20">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Page Content with top padding to account for fixed navbar */}
        <main className="flex-1 mt-24 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;