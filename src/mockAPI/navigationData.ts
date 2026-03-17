import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Clock,
  Plane,
  Palette,
  Layers,
  Target,
  Briefcase,
  FolderKanban,
  Settings,
  Database,
  Zap,
} from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
}

export const getNavigationData = (
  currentPage: string = "directory",
  onNavigate: (pageId: string) => void = () => {},
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    {
      id: "project-module",
      label: "Project Module",
      icon: Briefcase,
      subItems: [
        {
          id: "projects",
          label: "Projects",
          onClick: () => onNavigate("projects"),
          active: currentPage === "projects",
        },
      ],
    },
    {
      id: "project-submodules",
      label: "Project Submodules",
      icon: FolderKanban,
      subItems: [
        {
          id: "milestones",
          label: "Project Milestones",
          onClick: () => onNavigate("milestones"),
          active: currentPage === "milestones",
        },
        {
          id: "hire-renewal",
          label: "Resources",
          onClick: () => onNavigate("hire-renewal"),
          active: currentPage === "hire-renewal",
        },
        {
          id: "resource-renewals",
          label: "Resource Renewals",
          onClick: () => onNavigate("resource-renewals"),
          active: currentPage === "resource-renewals",
        },
        {
          id: "support-amc",
          label: "Support / AMC",
          onClick: () => onNavigate("support-amc"),
          active: currentPage === "support-amc",
        },
        {
          id: "change-requests",
          label: "Addons",
          onClick: () => onNavigate("change-requests"),
          active: currentPage === "change-requests",
        },
        {
          id: "aws",
          label: "AWS",
          onClick: () => onNavigate("aws"),
          active: currentPage === "aws",
        },
      ],
    },
    {
      id: "masters",
      label: "Masters",
      icon: Settings,
      subItems: [
        {
          id: "milestones-master",
          label: "Milestones Master",
          onClick: () => onNavigate("milestones-master"),
          active: currentPage === "milestones-master",
        },
        {
          id: "payment-terms-master",
          label: "Payment Terms Master",
          onClick: () => onNavigate("payment-terms-master"),
          active: currentPage === "payment-terms-master",
        },
        {
          id: "milestone-status-logs",
          label: "Milestone Status Change Logs",
          onClick: () => onNavigate("milestone-status-logs"),
          active: currentPage === "milestone-status-logs",
        },
      ],
    },
    {
      id: "user-roles",
      label: "User Roles & Access",
      icon: Users,
      onClick: () => onNavigate("user-roles"),
      active: currentPage === "user-roles",
    },
    // HIDDEN: System Architecture
    // {
    //   id: "system-architecture",
    //   label: "System Architecture",
    //   icon: Database,
    //   onClick: () => onNavigate("system-architecture"),
    //   active: currentPage === "system-architecture",
    // },
    // HIDDEN: Non-Functional Architecture
    // {
    //   id: "non-functional-architecture",
    //   label: "Non-Functional Architecture",
    //   icon: Zap,
    //   onClick: () => onNavigate("non-functional-architecture"),
    //   active: currentPage === "non-functional-architecture",
    // },
    // HIDDEN: HB Templates
    // {
    //   id: "hb-templates",
    //   label: "HB Templates",
    //   icon: Building2,
    //   subItems: [
    //     {
    //       id: "ui-kit",
    //       label: "UI Kit",
    //       onClick: () => onNavigate("ui-kit"),
    //       active: currentPage === "ui-kit",
    //     },
    //     {
    //       id: "sample-design",
    //       label: "Sample Page",
    //       onClick: () => onNavigate("sample-design"),
    //       active: currentPage === "sample-design",
    //     },
    //   ],
    // },
  ];
};