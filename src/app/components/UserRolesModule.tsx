import { useState, useMemo } from 'react';
import {
  Shield,
  Users,
  MoreVertical,
  Plus,
  RefreshCw,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Key,
  Lock,
  Search,
  Filter,
  LayoutGrid,
  User,
} from 'lucide-react';
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
interface AppUser {
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
const mockUsers: AppUser[] = [
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Role | AppUser | null>(null);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
      return filtered;
    }
  }, [activeTab, roles, users, searchQuery]);

  // Handlers
  const handleEdit = (item: Role | AppUser) => {
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

  const getAccessScopeStyle = (scope: string) => {
    return scope === 'Global'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Roles & Permissions</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
              Manage roles, permissions, and user access across the platform
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-5">
          <button
            onClick={() => { setActiveTab('roles'); setSearchQuery(''); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            Roles
          </button>
          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* View Toggle Buttons */}
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg border transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800'
                : 'bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Search Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Filter Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Refresh Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Download Button */}
          <button
            className="p-2.5 rounded-lg border bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Table View Button */}
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-lg border transition-colors ${
              viewMode === 'table'
                ? 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800'
                : 'bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
            title="Table View"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedItem(null);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm ml-auto"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'roles' ? 'Add Role' : 'Add User'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'roles' ? (
          <>
            {/* Roles Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filteredData as Role[]).map((role) => (
                  <div
                    key={role.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Colored Top Border */}
                    <div className={`h-1 ${
                      role.status === 'active' ? 'bg-green-500' : 'bg-neutral-300'
                    }`} />

                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                          <Shield className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{role.roleCode}</span>
                        </div>

                        {/* Action Menu */}
                        <div className="relative ml-auto">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === role.id ? null : role.id)}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                          </button>
                          {openMenuId === role.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                                <button
                                  onClick={() => {
                                    handleViewPermissions(role);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View Permissions
                                </button>
                                <button
                                  onClick={() => {
                                    handleEdit(role);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(role.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Role Name */}
                      <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
                        {role.roleName}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                        {role.description}
                      </p>

                      {/* Status Badge */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${getStatusBadge(role.status)}`}>
                          {role.status}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Assigned Users</div>
                          <div className="font-medium text-neutral-900 dark:text-white">{role.userCount}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Leads Access</div>
                          <div className="font-medium text-neutral-900 dark:text-white truncate">{role.permissions.leads}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Projects Access</div>
                          <div className="font-medium text-neutral-900 dark:text-white truncate">{role.permissions.projects}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Masters Access</div>
                          <div className="font-medium text-neutral-900 dark:text-white truncate">{role.permissions.masters}</div>
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
                    <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Users
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Leads
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Projects
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {(filteredData as Role[]).map((role) => (
                        <tr key={role.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-white">{role.roleName}</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{role.description}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-900 dark:text-white">
                            {role.roleCode}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                            {role.userCount}
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-900 dark:text-white">
                            {role.permissions.leads}
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-900 dark:text-white">
                            {role.permissions.projects}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded capitalize ${getStatusBadge(role.status)}`}>
                              {role.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewPermissions(role)}
                                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                                title="View Permissions"
                              >
                                <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              <button
                                onClick={() => handleEdit(role)}
                                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              <button
                                onClick={() => handleDelete(role.id)}
                                className="p-1.5 hover:bg-error-50 dark:hover:bg-error-950/30 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-error-600 dark:text-error-400" />
                              </button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filteredData as AppUser[]).map((user) => (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Colored Top Border */}
                    <div className={`h-1 ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-neutral-300'
                    }`} />

                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 rounded-md">
                          <User className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{user.userId}</span>
                        </div>

                        {/* Action Menu */}
                        <div className="relative ml-auto">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === `user-${user.id}` ? null : `user-${user.id}`)}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                          </button>
                          {openMenuId === `user-${user.id}` && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                                <button
                                  onClick={() => {
                                    handleEdit(user);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(user.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* User Name */}
                      <h3 className="font-semibold text-base text-neutral-900 dark:text-white mb-2 leading-snug">
                        {user.name}
                      </h3>

                      {/* Email */}
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-3">
                        <span className="text-xs font-medium truncate">{user.email}</span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${getAccessScopeStyle(user.accessScope)}`}>
                          {user.accessScope}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-neutral-100 dark:border-neutral-800 my-3" />

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Role</div>
                          <div className="font-medium text-neutral-900 dark:text-white truncate">{user.role}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Department</div>
                          <div className="font-medium text-neutral-900 dark:text-white truncate">{user.department}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Manager</div>
                          <div className="font-medium text-neutral-900 dark:text-white truncate">{user.reportingManager}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium mb-1">Last Login</div>
                          <div className="font-medium text-neutral-900 dark:text-white truncate">{user.lastLogin || 'Never'}</div>
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
                    <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Access
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {(filteredData as AppUser[]).map((user) => (
                        <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div>
                                <div className="font-medium text-neutral-900 dark:text-white">{user.name}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-900 dark:text-white">
                            {user.role}
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-900 dark:text-white">
                            {user.department}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getAccessScopeStyle(user.accessScope)}`}>
                              {user.accessScope}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded capitalize ${getStatusBadge(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-900 dark:text-white">
                            {user.lastLogin || 'Never'}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-1.5 hover:bg-error-50 dark:hover:bg-error-950/30 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-error-600 dark:text-error-400" />
                              </button>
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

        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              {activeTab === 'roles' ? (
                <Shield className="w-8 h-8 text-neutral-400" />
              ) : (
                <Users className="w-8 h-8 text-neutral-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No {activeTab} found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              {searchQuery ? 'Try adjusting your search criteria.' : `Get started by adding your first ${activeTab === 'roles' ? 'role' : 'user'}.`}
            </p>
          </div>
        )}
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
                <FormInput placeholder="Enter full name" defaultValue={(selectedItem as AppUser)?.name} />
              </FormField>
              <FormField>
                <FormLabel required>Email</FormLabel>
                <FormInput type="email" placeholder="Enter email" defaultValue={(selectedItem as AppUser)?.email} />
              </FormField>
              <FormField>
                <FormLabel required>Role</FormLabel>
                <FormSelect defaultValue={(selectedItem as AppUser)?.role}>
                  <option value="">Select role</option>
                  {mockRoles.map(role => (
                    <option key={role.id} value={role.roleName}>{role.roleName}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel required>Department</FormLabel>
                <FormInput placeholder="Enter department" defaultValue={(selectedItem as AppUser)?.department} />
              </FormField>
              <FormField>
                <FormLabel>Reporting Manager</FormLabel>
                <FormInput placeholder="Enter manager name" defaultValue={(selectedItem as AppUser)?.reportingManager} />
              </FormField>
              <FormField>
                <FormLabel required>Access Scope</FormLabel>
                <FormSelect defaultValue={(selectedItem as AppUser)?.accessScope}>
                  <option value="">Select scope</option>
                  <option value="Global">Global</option>
                  <option value="Restricted">Restricted</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel required>Status</FormLabel>
                <FormSelect defaultValue={(selectedItem as AppUser)?.status}>
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
