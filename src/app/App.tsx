import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Sidebar } from "./components/Sidebar";
import { GlobalHeader } from "./components/GlobalHeader";
import UIKit from "./components/UIKit";
import SampleDesign from "./components/SampleDesign";
import DashboardModule from "./components/DashboardModule";
import LeadsModule from "./components/LeadsModule";
import ProjectsModule from "./components/ProjectsModule";
import MilestonesModule from "./components/MilestonesModule";
import HireRenewalModule from "./components/HireRenewalModule";
import ChangeRequestsModule from "./components/ChangeRequestsModule";
import InfrastructureModule from "./components/InfrastructureModule";
import AddonsModule from "./components/AddonsModule";
import AwsModule from "./components/AWSModule";
import MilestonesMasterModule from "./components/MilestonesMasterModule";
import PaymentTermsMasterModule from "./components/PaymentTermsMasterModule";
import MilestoneStatusChangeLogsModule from "./components/MilestoneStatusChangeLogsModule";
import ResourceRenewalsModule from "./components/ResourceRenewalsModule";
import ProjectAllotmentModule from "./components/ProjectAllotmentModule";
import UserRolesModule from "./components/UserRolesModule";
import SystemArchitectureModule from "./components/SystemArchitectureModule";
import NonFunctionalArchitectureModule from "./components/NonFunctionalArchitectureModule";
import EmailGroupsModule from "./components/EmailGroupsModule";

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("colorTheme") || "natural";
    }
    return "natural";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [initialFilters, setInitialFilters] = useState<any[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("colorTheme", currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const handleNavigate = (pageId: string, filters?: any[]) => {
    setInitialFilters(filters || []);
    setCurrentPage(pageId);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      {/* Sidebar */}
      <Sidebar
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
      >
        {/* Header */}
        <GlobalHeader
          isDarkMode={isDark}
          onToggleDarkMode={() => setIsDark(!isDark)}
          isSidebarCollapsed={isSidebarCollapsed}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />

        {/* Pages */}
        {currentPage === "ui-kit" ? (
          <UIKit />
        ) : currentPage === "sample-design" ? (
          <SampleDesign />
        ) : currentPage === "dashboard" ? (
          <DashboardModule />
        ) : currentPage === "leads" ? (
          <LeadsModule />
        ) : currentPage === "projects" ? (
          <ProjectsModule
            onNavigate={handleNavigate}
            initialFilters={initialFilters}
            onFiltersConsumed={() => setInitialFilters([])}
          />
        ) : currentPage === "milestones" ? (
          <MilestonesModule
            onNavigate={handleNavigate}
            initialFilters={initialFilters}
            onFiltersConsumed={() => setInitialFilters([])}
          />
        ) : currentPage === "hire-renewal" ? (
          <HireRenewalModule />
        ) : currentPage === "change-requests" ? (
          <ChangeRequestsModule />
        ) : currentPage === "infrastructure" ? (
          <InfrastructureModule />
        ) : currentPage === "addons" ? (
          <AddonsModule
            onNavigate={handleNavigate}
            initialFilters={initialFilters}
            onFiltersConsumed={() => setInitialFilters([])}
          />
        ) : currentPage === "aws" ? (
          <AwsModule
            onNavigate={handleNavigate}
            initialFilters={initialFilters}
            onFiltersConsumed={() => setInitialFilters([])}
          />
        ) : currentPage === "milestones-master" ? (
          <MilestonesMasterModule />
        ) : currentPage === "payment-terms-master" ? (
          <PaymentTermsMasterModule />
        ) : currentPage === "milestone-status-logs" ? (
          <MilestoneStatusChangeLogsModule />
        ) : currentPage === "resource-renewals" ? (
          <ResourceRenewalsModule />
        ) : currentPage === "project-allotment" ? (
          <ProjectAllotmentModule />
        ) : currentPage === "user-roles" ? (
          <UserRolesModule />
        ) : currentPage === "system-architecture" ? (
          <SystemArchitectureModule />
        ) : currentPage === "non-functional-architecture" ? (
          <NonFunctionalArchitectureModule />
        ) : currentPage === "email-groups" ? (
          <EmailGroupsModule />
        ) : (
          <div className="p-6">Page not found</div>
        )}
      </main>

      {/* Toast */}
      <Toaster
        position="top-right"
        expand
        richColors
        closeButton
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
}