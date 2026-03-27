import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminPageFrame({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className={`min-h-screen px-6 py-8 transition-all duration-200 md:px-10 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}>
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          subtitle={subtitle}
          title={title}
        />
        {children}
      </main>
    </div>
  );
}
