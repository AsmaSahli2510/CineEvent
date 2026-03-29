import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminPageFrame({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = window.localStorage.getItem("adminSidebarOpen");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("adminSidebarOpen", String(isSidebarOpen));
    } catch {
      // Ignore storage errors to keep sidebar functional.
    }
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className={`min-h-screen px-6 py-8 transition-all duration-200 md:px-10 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
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
