// import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../layout/sidebar";
import Navbar from "../layout/Navbar";

const AdminLayout: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6F5]">
      {/* Sidebar */}
      <Sidebar
        // isOpen={isSidebarOpen}
        // onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Fixed Navbar */}
        <Navbar
        //   onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Page */}
        <main className="pt-24 px-6 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;