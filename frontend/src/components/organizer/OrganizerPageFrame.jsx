import React, { useState } from "react";
import OrganizerHeader from "./OrganizerHeader";
import OrganizerSidebar from "./OrganizerSidebar";

export default function OrganizerPageFrame({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <OrganizerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className={`min-h-screen px-6 py-8 transition-all duration-200 md:px-10 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}>
        <OrganizerHeader
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
