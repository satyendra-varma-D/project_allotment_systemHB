import { useState, useEffect } from 'react';
import { X, Search, ChevronDown, Check, Building2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  tags?: string[];
  channels?: string[];
}

interface ClientTeamData {
  companyName: string;
  companyType: string;
  contacts: Contact[];
}

interface ClientTeamEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ClientTeamData;
  onSave: (data: ClientTeamData) => void;
}

export function ClientTeamEditSidePanel({
  isOpen,
  onClose,
  currentData,
  onSave,
}: ClientTeamEditSidePanelProps) {
  const [companyName, setCompanyName] = useState(currentData.companyName);
  const [companyType, setCompanyType] = useState(currentData.companyType);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>(currentData.contacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

  // Sync state when panel opens
  useEffect(() => {
    if (isOpen) {
      setCompanyName(currentData.companyName);
      setCompanyType(currentData.companyType);
      setSelectedContacts(currentData.contacts);
      setSearchTerm('');
      setIsCompanyDropdownOpen(false);
      setIsContactDropdownOpen(false);
    }
  }, [isOpen, currentData]);

  // Available companies with their types
  const availableCompanies = [
    { name: 'ClientCo Technologies', type: 'Enterprise' },
    { name: 'TechStart Solutions', type: 'Startup' },
    { name: 'Global Innovations Inc.', type: 'Enterprise' },
    { name: 'Digital Ventures Ltd.', type: 'SMB' },
    { name: 'NextGen Systems', type: 'Mid-Market' },
    { name: 'Innovate Partners', type: 'Startup' },
  ];

  // All available contacts from all companies
  const allAvailableContacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Williams',
      initials: 'SW',
      role: 'Chief Technology Officer',
      email: 'sarah.williams@clientco.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, United States',
      timezone: 'EST (UTC-5)',
      tags: ['Existing', 'Key Stakeholder', 'High Priority'],
      channels: ['WhatsApp', 'Teams'],
    },
    {
      id: '2',
      name: 'James Patterson',
      initials: 'JP',
      role: 'VP of Digital Transformation',
      email: 'james.patterson@clientco.com',
      phone: '+1 (555) 123-4568',
      location: 'San Francisco, United States',
      timezone: 'PST (UTC-8)',
      tags: ['New', 'Decision Maker', 'High Priority'],
      channels: ['Teams', 'Slack'],
    },
    {
      id: '3',
      name: 'Michael Chen',
      initials: 'MC',
      role: 'Product Manager',
      email: 'michael.chen@techstart.com',
      phone: '+1 (555) 234-5678',
      location: 'Austin, United States',
      timezone: 'CST (UTC-6)',
      tags: ['New', 'Product Owner'],
      channels: ['Slack', 'Email'],
    },
    {
      id: '4',
      name: 'Emma Thompson',
      initials: 'ET',
      role: 'Engineering Director',
      email: 'emma.thompson@globalinnovations.com',
      phone: '+1 (555) 345-6789',
      location: 'Boston, United States',
      timezone: 'EST (UTC-5)',
      tags: ['Existing', 'Technical Lead'],
      channels: ['Teams', 'WhatsApp'],
    },
    {
      id: '5',
      name: 'David Rodriguez',
      initials: 'DR',
      role: 'CEO & Founder',
      email: 'david.rodriguez@digitalventures.com',
      phone: '+1 (555) 456-7890',
      location: 'Miami, United States',
      timezone: 'EST (UTC-5)',
      tags: ['Decision Maker', 'C-Level'],
      channels: ['Email', 'Phone'],
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      initials: 'LA',
      role: 'Operations Manager',
      email: 'lisa.anderson@nextgen.com',
      phone: '+1 (555) 567-8901',
      location: 'Seattle, United States',
      timezone: 'PST (UTC-8)',
      tags: ['Existing', 'Operations'],
      channels: ['Teams', 'Slack'],
    },
  ];

  const filteredContacts = allAvailableContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanySelect = (company: typeof availableCompanies[0]) => {
    setCompanyName(company.name);
    setCompanyType(company.type);
    setIsCompanyDropdownOpen(false);
  };

  const handleContactToggle = (contact: Contact) => {
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    if (isSelected) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleSave = () => {
    onSave({
      companyName,
      companyType,
      contacts: selectedContacts,
    });
    onClose();
  };

  const handleCancel = () => {
    setCompanyName(currentData.companyName);
    setCompanyType(currentData.companyType);
    setSelectedContacts(currentData.contacts);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Edit Client Team
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Configure project technology stack
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Company Name
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-900 dark:text-white">
                      {companyName}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCompanyDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {availableCompanies.map((company, index) => (
                        <button
                          key={index}
                          onClick={() => handleCompanySelect(company)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                        >
                          <div className="font-medium text-sm text-neutral-900 dark:text-white mb-1">
                            {company.name}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {company.type}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Type (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Company Type
              </label>
              <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {companyType}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                Auto-filled based on company selection
              </p>
            </div>

            {/* Contact Name (Multi-select) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Contact Name
              </label>
              
              {/* Selected Contacts */}
              {selectedContacts.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm"
                    >
                      <span>{contact.name}</span>
                      <button
                        onClick={() => handleContactToggle(contact)}
                        className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsContactDropdownOpen(!isContactDropdownOpen)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-left flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedContacts.length === 0 ? 'Select contacts...' : `${selectedContacts.length} contact(s) selected`}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isContactDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isContactDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-96 overflow-hidden">
                    {/* Search */}
                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search contacts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Contact List */}
                    <div className="max-h-80 overflow-y-auto">
                      {filteredContacts.map((contact) => {
                        const isSelected = selectedContacts.some(c => c.id === contact.id);
                        return (
                          <button
                            key={contact.id}
                            onClick={() => handleContactToggle(contact)}
                            className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0 flex items-center gap-3"
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                                : 'border-neutral-300 dark:border-neutral-600'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-neutral-900 dark:text-white mb-1">
                                {contact.name}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">
                                {contact.role}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {contact.email}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      {filteredContacts.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                          No contacts found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                Select multiple contacts to add to the client team
              </p>
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