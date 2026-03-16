import { useState, useEffect } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface TeamEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  teamType: 'preSales' | 'postSales' | 'client' | null;
  currentMembers: TeamMember[];
  onSave: (members: TeamMember[]) => void;
}

export function TeamEditSidePanel({
  isOpen,
  onClose,
  teamType,
  currentMembers,
  onSave,
}: TeamEditSidePanelProps) {
  const [members, setMembers] = useState<TeamMember[]>(currentMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Sync members state when panel opens or currentMembers changes
  useEffect(() => {
    if (isOpen && currentMembers.length > 0) {
      setMembers(currentMembers);
      setSearchTerm('');
      setOpenDropdown(null);
    }
  }, [isOpen, currentMembers]);

  // Available team members to choose from
  const availableMembers = [
    { id: '1', name: 'Sarah Connor', email: 'sarah.connor@company.com', phone: '+1 (968) 306-6008' },
    { id: '2', name: 'John Reese', email: 'john.reese@company.com', phone: '+1 (733) 409-1711' },
    { id: '3', name: 'T-800', email: 't-800@company.com', phone: '+1 (575) 705-8983' },
    { id: '4', name: 'Miles Dyson', email: 'miles.dyson@company.com', phone: '+1 (271) 696-3837' },
    { id: '5', name: 'Kevin Park', email: 'kevin.park@company.com', phone: '+1 (315) 466-5850' },
    { id: '6', name: 'Chris Wilson', email: 'chris.wilson@company.com', phone: '+1 (786) 706-2222' },
    { id: '7', name: 'Michael Chen', email: 'michael.chen@company.com', phone: '+1 (555) 123-4567' },
    { id: '8', name: 'Jennifer Williams', email: 'jennifer.williams@company.com', phone: '+1 (555) 234-5678' },
    { id: '9', name: 'David Martinez', email: 'david.martinez@company.com', phone: '+1 (555) 345-6789' },
    { id: '10', name: 'Emily Davis', email: 'emily.davis@company.com', phone: '+1 (555) 456-7890' },
    { id: '11', name: 'Sarah Mitchell', email: 'sarah.mitchell@company.com', phone: '+1 (555) 987-6543' },
    { id: '12', name: 'To be assigned', email: 'to.be@company.com', phone: '+1 (000) 000-0000' },
  ];

  // Available options for Post-Sales Team organizational fields
  const departmentOptions = [
    'Engineering',
    'Technology',
    'IT Services',
    'Development',
    'Operations',
  ];

  const subDepartmentOptions = [
    'Web Development',
    'Mobile Development',
    'Cloud Services',
    'DevOps',
    'Quality Assurance',
  ];

  const divisionOptions = [
    'Digital Solutions',
    'Enterprise Solutions',
    'Product Development',
    'Custom Development',
    'Innovation Lab',
  ];

  const filteredMembers = availableMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTeamTitle = () => {
    switch (teamType) {
      case 'preSales':
        return 'Edit Pre-Sales Team';
      case 'postSales':
        return 'Edit Post-Sales Team';
      case 'client':
        return 'Edit Client Team';
      default:
        return 'Edit Team';
    }
  };

  // Get specific role names for Pre-Sales Team
  const getPreSalesRoles = () => [
    'Sales HOD',
    'Sales Team Lead',
    'Sales Executive',
    'Contact Owner',
    'Tech1 Member',
    'Tech1 Analyst',
    'Estimation Approver',
  ];

  const handleMemberSelect = (index: number, selectedMember: typeof availableMembers[0]) => {
    const updatedMembers = [...members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      name: selectedMember.name,
      email: selectedMember.email,
      phone: selectedMember.phone,
    };
    setMembers(updatedMembers);
    setOpenDropdown(null);
  };

  const handleOrganizationalSelect = (index: number, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      name: value,
    };
    setMembers(updatedMembers);
    setOpenDropdown(null);
  };

  // Determine dropdown options based on role
  const getDropdownOptions = (role: string) => {
    if (role === 'Department') return departmentOptions;
    if (role === 'Sub Department') return subDepartmentOptions;
    if (role === 'Division') return divisionOptions;
    return null; // Will use member dropdown
  };

  const handleSave = () => {
    onSave(members);
    onClose();
  };

  const handleCancel = () => {
    setMembers(currentMembers); // Reset to original
    onClose();
  };

  if (!isOpen || !teamType) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {getTeamTitle()}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-4">
              Team Assignments
            </h3>

            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {member.role}
                  </label>
                  
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                    >
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {member.name}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                    </button>

                    {openDropdown === index && (() => {
                      const orgOptions = getDropdownOptions(member.role);
                      
                      if (orgOptions) {
                        // Show organizational options (Department, Sub Department, Division)
                        return (
                          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-80 overflow-hidden">
                            <div className="max-h-64 overflow-y-auto">
                              {orgOptions.map((option, optIndex) => (
                                <button
                                  key={optIndex}
                                  onClick={() => handleOrganizationalSelect(index, option)}
                                  className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                                >
                                  <div className="font-medium text-sm text-neutral-900 dark:text-white">
                                    {option}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      
                      // Show member options
                      return (
                        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-80 overflow-hidden">
                          {/* Search */}
                          <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                              <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          {/* Member List */}
                          <div className="max-h-64 overflow-y-auto">
                            {filteredMembers.map((availableMember) => (
                              <button
                                key={availableMember.id}
                                onClick={() => handleMemberSelect(index, availableMember)}
                                className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                              >
                                <div className="font-medium text-sm text-neutral-900 dark:text-white mb-1">
                                  {availableMember.name}
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {availableMember.email}
                                </div>
                              </button>
                            ))}
                            {filteredMembers.length === 0 && (
                              <div className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                No members found
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}