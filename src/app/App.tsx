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
import SupportAMCModule from "./components/SupportAMCModule";
import ChangeRequestsModule from "./components/ChangeRequestsModule";
import InfrastructureModule from "./components/InfrastructureModule";
import AddonsModule from "./components/AddonsModule";
import AWSModule from "./components/AWSModule";
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
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("colorTheme") || "natural";
    }
    return "natural";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [initialFilters, setInitialFilters] = useState<any[]>([]);

  /* -------------------- Theme Effects -------------------- */
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
    document.documentElement.setAttribute(
      "data-theme",
      currentTheme,
    );
  }, [currentTheme]);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleNavigate = (pageId: string, filters?: any[]) => {
    if (filters) {
      setInitialFilters(filters);
    } else {
      setInitialFilters([]);
    }
    setCurrentPage(pageId);
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
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Global Header */}
        <GlobalHeader
          isDarkMode={isDark}
          onToggleDarkMode={() => setIsDark(!isDark)}
          isSidebarCollapsed={isSidebarCollapsed}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />

        {/* Page Content */}
        {currentPage === "ui-kit" ? (
          <UIKit />
        ) : currentPage === "sample-design" ? (
          <SampleDesign />
        ) : currentPage === "dashboard" ? (
          <DashboardModule />
        ) : currentPage === "leads" ? (
          <LeadsModule />
        ) : currentPage === "projects" ? (
          <ProjectsModule onNavigate={handleNavigate} />
        ) : currentPage === "milestones" ? (
          <MilestonesModule 
            initialFilters={initialFilters} 
            onFiltersConsumed={() => setInitialFilters([])} 
          />
        ) : currentPage === "hire-renewal" ? (
          <HireRenewalModule 
            initialFilters={initialFilters} 
            onFiltersConsumed={() => setInitialFilters([])} 
          />
        ) : currentPage === "support-amc" ? (
          <SupportAMCModule />
        ) : currentPage === "change-requests" ? (
          <ChangeRequestsModule />
        ) : currentPage === "infrastructure" ? (
          <InfrastructureModule />
        ) : currentPage === "addons" ? (
          <AddonsModule 
            initialFilters={initialFilters} 
            onFiltersConsumed={() => setInitialFilters([])} 
          />
        ) : currentPage === "aws" ? (
          <AWSModule />
        ) : currentPage === "milestones-master" ? (
          <MilestonesMasterModule />
        ) : currentPage === "payment-terms-master" ? (
          <PaymentTermsMasterModule />
        ) : currentPage === "milestone-status-logs" ? (
          <MilestoneStatusChangeLogsModule />
        ) : currentPage === "resource-renewals" ? (
          <ResourceRenewalsModule 
            initialFilters={initialFilters} 
            onFiltersConsumed={() => setInitialFilters([])} 
          />
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
          <div className="p-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8">
              {currentPage === "support-amc" && (
                <>
                  <h2 className="text-2xl font-medium text-neutral-900 dark:text-white mb-2">Support / AMC Management</h2>
                  <p className="text-neutral-600 dark:text-neutral-400">Manage post-delivery support contracts and Annual Maintenance Contracts.</p>
                </>
              )}
              {currentPage === "change-requests" && (
                <>
                  <h2 className="text-2xl font-medium text-neutral-900 dark:text-white mb-2">Addons</h2>
                  <p className="text-neutral-600 dark:text-neutral-400">Track additional scope, addons, and delivery extensions.</p>
                </>
              )}
              {currentPage === "infrastructure" && (
                <>
                  <h2 className="text-2xl font-medium text-neutral-900 dark:text-white mb-2">Infrastructure</h2>
                  <p className="text-neutral-600 dark:text-neutral-400">Track infrastructure provisioning, cloud services, and recurring infra costs.</p>
                </>
              )}
            </div>
          </div>
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