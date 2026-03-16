import { useState, useMemo } from 'react';
import {
  Shield,
  Users,
  MoreVertical,
  Plus,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Key,
  Lock,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, ViewModeSwitcher, AdvancedSearchPanel, FilterChips, SearchBar, Pagination, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
} from './hb/common/Form';

// User interface
interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  reportingManager: string;
  accessScope: 'Global' | 'Restricted';
  lastLogin?: string;
  createdDate: string;
}

// Role interface
interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  description: string;
  permissions: {
    leads: string;
    projects: string;
    submodules: string;
    masters: string;
    allotment: string;
  };
  userCount: number;
  status: 'active' | 'inactive';
}

// Mock roles data
const mockRoles: Role[] = [
  {
    id: '1',
    roleCode: 'SALES-USER',
    roleName: 'Sales User',
    description: 'Manages leads, updates activities, and closes deals',
    permissions: {
      leads: 'Full (Own)',
      projects: 'View',
      submodules: 'No Access',
      masters: 'No Access',
      allotment: 'View',
    },
    userCount: 12,
    status: 'active',
  },
  {
    id: '2',
    roleCode: 'SALES-MGR',
    roleName: 'Sales Manager',
    description: 'Sales oversight and deal governance',
    permissions: {
      leads: 'Full (All)',
      projects: 'View',
      submodules: 'No Access',
      masters: 'No Access',
      allotment: 'View',
    },
    userCount: 3,
    status: 'active',
  },
  {
    id: '3',
    roleCode: 'DELIVERY-MGR',
    roleName: 'Delivery Manager',
    description: 'Intake review, resource feasibility, project governance',
    permissions: {
      leads: 'View Closed-Won',
      projects: 'Full',
      submodules: 'Approve',
      masters: 'View',
      allotment: 'Approve',
    },
    userCount: 5,
    status: 'active',
  },
  {
    id: '4',
    roleCode: 'PROJECT-MGR',
    roleName: 'Project Manager',
    description: 'Project execution, milestone tracking, CR creation',
    permissions: {
      leads: 'View',
      projects: 'Edit',
      submodules: 'Edit',
      masters: 'View',
      allotment: 'No Access',
    },
    userCount: 8,
    status: 'active',
  },
  {
    id: '5',
    roleCode: 'RESOURCE-MGR',
    roleName: 'Resource Manager',
    description: 'Resource allocation and capacity monitoring',
    permissions: {
      leads: 'No Access',
      projects: 'View',
      submodules: 'View',
      masters: 'No Access',
      allotment: 'Recommend',
    },
    userCount: 2,
    status: 'active',
  },
  {
    id: '6',
    roleCode: 'FINANCE-USER',
    roleName: 'Finance User',
    description: 'Commercial validation, invoice, payment tracking',
    permissions: {
      leads: 'View',
      projects: 'Commercial Edit',
      submodules: 'Billing',
      masters: 'Edit (Payment)',
      allotment: 'Approve (Budget)',
    },
    userCount: 4,
    status: 'active',
  },
  {
    id: '7',
    roleCode: 'SYS-ADMIN',
    roleName: 'System Administrator',
    description: 'Full system governance, master configuration, role management',
    permissions: {
      leads: 'Full',
      projects: 'Full',
      submodules: 'Full',
      masters: 'Full',
      allotment: 'Full',
    },
    userCount: 2,
    status: 'active',
  },
];

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    userId: 'USR-001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Sales User',
    department: 'Sales',
    status: 'active',
    reportingManager: 'Sarah Johnson',
    accessScope: 'Global',
    lastLogin: '2024-02-25 09:30 AM',
    createdDate: '2024-01-01',
  },
  {
    id: '2',
    userId: 'USR-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Sales Manager',
    department: 'Sales',
    status: 'active',
    reportingManager: 'Michael Chen',
    accessScope: 'Global',
    lastLogin: '2024-02-25 08:15 AM',
    createdDate: '2024-01-01',
  },
  {
    id: '3',
    userId: 'USR-003',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Delivery Manager',
    department: 'Delivery',
    status: 'active',
    reportingManager: 'Admin',
    accessScope: 'Global',
    lastLogin: '2024-02-25 10:00 AM',
    createdDate: '2024-01-01',
  },
  {
    id: '4',
    userId: 'USR-004',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'Project Manager',
    department: 'Delivery',
    status: 'active',
    reportingManager: 'Michael Chen',
    accessScope: 'Restricted',
    lastLogin: '2024-02-24 05:30 PM',
    createdDate: '2024-01-15',
  },
  {
    id: '5',
    userId: 'USR-005',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'Resource Manager',
    department: 'HR',
    status: 'active',
    reportingManager: 'Admin',
    accessScope: 'Global',
    lastLogin: '2024-02-25 09:00 AM',
    createdDate: '2024-01-10',
  },
  {
    id: '6',
    userId: 'USR-006',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    role: 'Finance User',
    department: 'Finance',
    status: 'active',
    reportingManager: 'Admin',
    accessScope: 'Global',
    lastLogin: '2024-02-25 08:45 AM',
    createdDate: '2024-01-05',
  },
  {
    id: '7',
    userId: 'USR-007',
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    role: 'System Administrator',
    department: 'IT',
    status: 'active',
    reportingManager: 'Admin',
    accessScope: 'Global',
    lastLogin: '2024-02-25 07:30 AM',
    createdDate: '2024-01-01',
  },
  {
    id: '8',
    userId: 'USR-008',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@company.com',
    role: 'Sales User',
    department: 'Sales',
    status: 'inactive',
    reportingManager: 'Sarah Johnson',
    accessScope: 'Restricted',
    lastLogin: '2024-02-10 03:00 PM',
    createdDate: '2024-01-20',
  },
];

export default function UserRolesModule() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Role | User | null>(null);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  // Calculate summary statistics
  const summaryData = useMemo(() => {
    if (activeTab === 'roles') {
      const total = roles.length;
      const active = roles.filter(r => r.status === 'active').length;
      const totalUsers = roles.reduce((sum, r) => sum + r.userCount, 0);
      const adminRoles = roles.filter(r => r.roleName.includes('Admin') || r.roleName.includes('Manager')).length;

      return [
        {
          label: 'Total Roles',
          value: total.toString(),
          icon: 'Shield',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          trend: '+1',
          trendDirection: 'up' as const,
        },
        {
          label: 'Active Roles',
          value: active.toString(),
          icon: 'CheckCircle',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          iconColor: 'text-green-600 dark:text-green-400',
          trend: '+1',
          trendDirection: 'up' as const,
        },
        {
          label: 'Total Users',
          value: totalUsers.toString(),
          icon: 'Users',
          bgColor: 'bg-purple-50 dark:bg-purple-950/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          trend: '+5',
          trendDirection: 'up' as const,
        },
        {
          label: 'Admin Roles',
          value: adminRoles.toString(),
          icon: 'Key',
          bgColor: 'bg-orange-50 dark:bg-orange-950/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
          trend: '0',
          trendDirection: 'neutral' as const,
        },
        {
          label: 'Delivery Access',
          value: roles.filter(r => r.permissions.projects !== 'No Access').length.toString(),
          icon: 'Activity',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          trend: '0',
          trendDirection: 'neutral' as const,
        },
        {
          label: 'Finance Access',
          value: roles.filter(r => r.permissions.masters.includes('Payment') || r.permissions.projects.includes('Commercial')).length.toString(),
          icon: 'DollarSign',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          iconColor: 'text-green-600 dark:text-green-400',
          trend: '0',
          trendDirection: 'neutral' as const,
        },
      ];
    } else {
      const total = users.length;
      const active = users.filter(u => u.status === 'active').length;
      const inactive = users.filter(u => u.status === 'inactive').length;
      const globalAccess = users.filter(u => u.accessScope === 'Global').length;

      return [
        {
          label: 'Total Users',
          value: total.toString(),
          icon: 'Users',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          trend: '+2',
          trendDirection: 'up' as const,
        },
        {
          label: 'Active Users',
          value: active.toString(),
          icon: 'CheckCircle',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          iconColor: 'text-green-600 dark:text-green-400',
          trend: '+2',
          trendDirection: 'up' as const,
        },
        {
          label: 'Inactive Users',
          value: inactive.toString(),
          icon: 'XCircle',
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          iconColor: 'text-red-600 dark:text-red-400',
          trend: '0',
          trendDirection: 'neutral' as const,
        },
        {
          label: 'Global Access',
          value: globalAccess.toString(),
          icon: 'Globe',
          bgColor: 'bg-purple-50 dark:bg-purple-950/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          trend: '+1',
          trendDirection: 'up' as const,
        },
        {
          label: 'Sales Team',
          value: users.filter(u => u.department === 'Sales').length.toString(),
          icon: 'TrendingUp',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          trend: '+1',
          trendDirection: 'up' as const,
        },
        {
          label: 'Delivery Team',
          value: users.filter(u => u.department === 'Delivery').length.toString(),
          icon: 'Activity',
          bgColor: 'bg-orange-50 dark:bg-orange-950/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
          trend: '+1',
          trendDirection: 'up' as const,
        },
      ];
    }
  }, [activeTab, roles, users]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (activeTab === 'roles') {
      let filtered = [...roles];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (role) =>
            role.roleName.toLowerCase().includes(query) ||
            role.roleCode.toLowerCase().includes(query) ||
            role.description.toLowerCase().includes(query)
        );
      }
      activeFilters.forEach((filter) => {
        if (filter.value && filter.value !== 'all') {
          filtered = filtered.filter((role) => {
            const roleValue = role[filter.field as keyof Role];
            if (typeof roleValue === 'string') {
              return roleValue.toLowerCase().includes(filter.value.toLowerCase());
            }
            return roleValue === filter.value;
          });
        }
      });
      return filtered;
    } else {
      let filtered = [...users];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.userId.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query)
        );
      }
      activeFilters.forEach((filter) => {
        if (filter.value && filter.value !== 'all') {
          filtered = filtered.filter((user) => {
            const userValue = user[filter.field as keyof User];
            if (typeof userValue === 'string') {
              return userValue.toLowerCase().includes(filter.value.toLowerCase());
            }
            return userValue === filter.value;
          });
        }
      });
      return filtered;
    }
  }, [activeTab, roles, users, searchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handleAddFilter = (filter: FilterCondition) => {
    setActiveFilters([...activeFilters, filter]);
  };

  const handleRemoveFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleEdit = (item: Role | User) => {
    setSelectedItem(item);
    setIsAddModalOpen(true);
  };

  const handleViewPermissions = (role: Role) => {
    setSelectedItem(role);
    setIsPermissionModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete this ${activeTab === 'roles' ? 'role' : 'user'}?`)) {
      if (activeTab === 'roles') {
        setRoles(roles.filter(r => r.id !== id));
      } else {
        setUsers(users.filter(u => u.id !== id));
      }
    }
  };

  const handleSave = () => {
    setIsAddModalOpen(false);
    setSelectedItem(null);
  };

  // Get status badge style
  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Page Header */}
      <PageHeader
        title="User Roles & Access Control"
        subtitle="Manage roles, permissions, and user access across the platform"
        primaryAction={
          <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" />
            {activeTab === 'roles' ? 'Add Role' : 'Add User'}
          </PrimaryButton>
        }
        secondaryActions={
          <>
            <IconButton icon={RefreshCw} title="Refresh" onClick={() => {}} />
            <IconButton icon={Upload} title="Import" onClick={() => {}} />
            <IconButton icon={Download} title="Export" onClick={() => {}} />
            <IconButton icon={Printer} title="Print" onClick={() => {}} />
            <IconButton icon={BarChart3} title="Analytics" onClick={() => {}} />
          </>
        }
      />

      {/* Tab Switcher */}
      <div className="px-6 pb-6">
        <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'roles'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Roles
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </div>
          </button>
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="px-6 pb-6">
        <SummaryWidgets widgets={summaryData} />
      </div>

      {/* Search and View Controls */}
      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
            placeholder={`Search ${activeTab}...`}
          />
          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Advanced Search Panel */}
      {isAdvancedSearchOpen && (
        <div className="px-6 pb-4">
          <AdvancedSearchPanel
            onAddFilter={handleAddFilter}
            onClose={() => setIsAdvancedSearchOpen(false)}
            filterOptions={
              activeTab === 'roles'
                ? [
                    { field: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
                    { field: 'roleName', label: 'Role Name', type: 'text' },
                  ]
                : [
                    { field: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
                    { field: 'role', label: 'Role', type: 'text' },
                    { field: 'department', label: 'Department', type: 'text' },
                    { field: 'accessScope', label: 'Access Scope', type: 'select', options: ['Global', 'Restricted'] },
                  ]
            }
          />
        </div>
      )}

      {/* Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="px-6 pb-4">
          <FilterChips
            filters={activeFilters}
            onRemove={handleRemoveFilter}
            onClear={handleClearFilters}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="px-6 pb-6">
        {activeTab === 'roles' ? (
          <>
            {/* Roles Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(paginatedData as Role[]).map((role) => (
                  <div
                    key={role.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">{role.roleCode}</span>
                        </div>
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{role.roleName}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{role.description}</p>
                      </div>
                      <div className="relative group">
                        <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                          <MoreVertical className="w-4 h-4 text-neutral-500" />
                        </button>
                        <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-48 z-10">
                          <button
                            onClick={() => handleViewPermissions(role)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Permissions
                          </button>
                          <button
                            onClick={() => handleEdit(role)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Assigned Users:</span>
                        <span className="font-medium text-neutral-900 dark:text-white">{role.userCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md capitalize ${getStatusBadge(role.status)}`}>
                          {role.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Key Permissions:</div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.leads !== 'No Access' && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                            Leads: {role.permissions.leads}
                          </span>
                        )}
                        {role.permissions.projects !== 'No Access' && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded">
                            Projects: {role.permissions.projects}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Roles List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {(paginatedData as Role[]).map((role) => (
                  <div
                    key={role.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">{role.roleCode}</span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(role.status)}`}>
                            {role.status}
                          </span>
                        </div>
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{role.roleName}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{role.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Leads</span>
                            <span className="text-neutral-900 dark:text-white text-xs">{role.permissions.leads}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Projects</span>
                            <span className="text-neutral-900 dark:text-white text-xs">{role.permissions.projects}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Submodules</span>
                            <span className="text-neutral-900 dark:text-white text-xs">{role.permissions.submodules}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Masters</span>
                            <span className="text-neutral-900 dark:text-white text-xs">{role.permissions.masters}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Users</span>
                            <span className="text-neutral-900 dark:text-white font-medium">{role.userCount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 relative group">
                        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                          <MoreVertical className="w-4 h-4 text-neutral-500" />
                        </button>
                        <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-48 z-10">
                          <button
                            onClick={() => handleViewPermissions(role)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Permissions
                          </button>
                          <button
                            onClick={() => handleEdit(role)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Roles Table View */}
            {viewMode === 'table' && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Users
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Permissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {(paginatedData as Role[]).map((role) => (
                        <tr key={role.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-white">{role.roleName}</div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">{role.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                            {role.roleCode}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                            {role.userCount}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.leads !== 'No Access' && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                                  Leads
                                </span>
                              )}
                              {role.permissions.projects !== 'No Access' && (
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded">
                                  Projects
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md capitalize ${getStatusBadge(role.status)}`}>
                              {role.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block group">
                              <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                                <MoreVertical className="w-4 h-4 text-neutral-500" />
                              </button>
                              <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-48 z-10">
                                <button
                                  onClick={() => handleViewPermissions(role)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Permissions
                                </button>
                                <button
                                  onClick={() => handleEdit(role)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(role.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Users Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(paginatedData as User[]).map((user) => (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">{user.userId}</span>
                        </div>
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{user.name}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
                      </div>
                      <div className="relative group">
                        <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                          <MoreVertical className="w-4 h-4 text-neutral-500" />
                        </button>
                        <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                          <button
                            onClick={() => handleEdit(user)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Role:</span>
                        <span className="text-neutral-900 dark:text-white">{user.role}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Department:</span>
                        <span className="text-neutral-900 dark:text-white">{user.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Manager:</span>
                        <span className="text-neutral-900 dark:text-white">{user.reportingManager}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">Access:</span>
                        <span className="text-neutral-900 dark:text-white">{user.accessScope}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-md capitalize ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                      {user.lastLogin && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {user.lastLogin}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {(paginatedData as User[]).map((user) => (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">{user.userId}</span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-2">{user.name}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{user.email}</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Role</span>
                            <span className="text-neutral-900 dark:text-white">{user.role}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Department</span>
                            <span className="text-neutral-900 dark:text-white">{user.department}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Manager</span>
                            <span className="text-neutral-900 dark:text-white">{user.reportingManager}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Access Scope</span>
                            <span className="text-neutral-900 dark:text-white">{user.accessScope}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Last Login</span>
                            <span className="text-neutral-900 dark:text-white text-xs">{user.lastLogin || 'Never'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 relative group">
                        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                          <MoreVertical className="w-4 h-4 text-neutral-500" />
                        </button>
                        <div className="hidden group-hover:block absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                          <button
                            onClick={() => handleEdit(user)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users Table View */}
            {viewMode === 'table' && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Access
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {(paginatedData as User[]).map((user) => (
                        <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                            {user.department}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                            {user.accessScope}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md capitalize ${getStatusBadge(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block group">
                              <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                                <MoreVertical className="w-4 h-4 text-neutral-500" />
                              </button>
                              <div className="hidden group-hover:block absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40 z-10">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredData.length}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? `Edit ${activeTab === 'roles' ? 'Role' : 'User'}` : `Add ${activeTab === 'roles' ? 'Role' : 'User'}`}
      >
        {activeTab === 'roles' ? (
          <FormSection title="Role Configuration">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Role Code</FormLabel>
                <FormInput placeholder="e.g., SALES-USER" defaultValue={(selectedItem as Role)?.roleCode} />
              </FormField>
              <FormField>
                <FormLabel required>Role Name</FormLabel>
                <FormInput placeholder="Enter role name" defaultValue={(selectedItem as Role)?.roleName} />
              </FormField>
              <FormField className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormInput placeholder="Enter description" defaultValue={(selectedItem as Role)?.description} />
              </FormField>
              <FormField>
                <FormLabel required>Status</FormLabel>
                <FormSelect defaultValue={(selectedItem as Role)?.status}>
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
              </FormField>
            </div>
          </FormSection>
        ) : (
          <FormSection title="User Details">
            <div className="grid grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Name</FormLabel>
                <FormInput placeholder="Enter full name" defaultValue={(selectedItem as User)?.name} />
              </FormField>
              <FormField>
                <FormLabel required>Email</FormLabel>
                <FormInput type="email" placeholder="Enter email" defaultValue={(selectedItem as User)?.email} />
              </FormField>
              <FormField>
                <FormLabel required>Role</FormLabel>
                <FormSelect defaultValue={(selectedItem as User)?.role}>
                  <option value="">Select role</option>
                  {mockRoles.map(role => (
                    <option key={role.id} value={role.roleName}>{role.roleName}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel required>Department</FormLabel>
                <FormInput placeholder="Enter department" defaultValue={(selectedItem as User)?.department} />
              </FormField>
              <FormField>
                <FormLabel>Reporting Manager</FormLabel>
                <FormInput placeholder="Enter manager name" defaultValue={(selectedItem as User)?.reportingManager} />
              </FormField>
              <FormField>
                <FormLabel required>Access Scope</FormLabel>
                <FormSelect defaultValue={(selectedItem as User)?.accessScope}>
                  <option value="">Select scope</option>
                  <option value="Global">Global</option>
                  <option value="Restricted">Restricted</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel required>Status</FormLabel>
                <FormSelect defaultValue={(selectedItem as User)?.status}>
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
              </FormField>
            </div>
          </FormSection>
        )}
        <FormFooter
          onCancel={() => {
            setIsAddModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
        />
      </FormModal>

      {/* Permission Details Modal */}
      <FormModal
        isOpen={isPermissionModalOpen}
        onClose={() => {
          setIsPermissionModalOpen(false);
          setSelectedItem(null);
        }}
        title="Role Permissions"
      >
        {selectedItem && (
          <FormSection title={(selectedItem as Role).roleName}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Leads Module</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{(selectedItem as Role).permissions.leads}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Projects Module</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{(selectedItem as Role).permissions.projects}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Submodules</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{(selectedItem as Role).permissions.submodules}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Masters</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{(selectedItem as Role).permissions.masters}</span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block mb-1">Allotment System</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{(selectedItem as Role).permissions.allotment}</span>
                </div>
              </div>
            </div>
          </FormSection>
        )}
        <FormFooter
          onCancel={() => {
            setIsPermissionModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={() => {
            setIsPermissionModalOpen(false);
            setSelectedItem(null);
          }}
          saveLabel="Close"
        />
      </FormModal>
    </div>
  );
}
