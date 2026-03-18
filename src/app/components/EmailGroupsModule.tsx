import { useState } from 'react';
import { Mail, Plus, Search, Filter, RefreshCw, LayoutGrid, Eye, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { FormModal, FormSection, FormField, FormLabel, FormInput } from './hb/common/Form';
import { SidePanel, SidePanelFooter } from './hb/common/SidePanel';

interface EmailGroup {
  id: string;
  name: string;
  description: string;
  emails: string[];
  status: 'active' | 'inactive';
}

const mockGroups: EmailGroup[] = [
  {
    id: '1',
    name: 'Chirag Patel Group',
    description: 'Chirag Patel and associated members',
    emails: ['chirag.patel@company.com', 'assistant.chirag@company.com'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Jigar Joshi Group',
    description: 'Jigar Joshi and associated members',
    emails: ['jigar.joshi@company.com', 'support.jigar@company.com'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Nilay Mehta Group',
    description: 'Nilay Mehta and associated members',
    emails: ['nilay.mehta@company.com', 'admin.nilay@company.com'],
    status: 'active',
  },
];

export default function EmailGroupsModule() {
  const [groups, setGroups] = useState<EmailGroup[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<EmailGroup | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.emails.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (group: EmailGroup) => {
    setSelectedGroup(group);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this email group?')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const handleSave = () => {
    setIsAddModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Email Groups</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
              Manage email distribution lists for project communication
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search groups or emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedGroup(null);
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm ml-auto"
            >
              <Plus className="w-4 h-4" />
              Add Group
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{group.name}</h3>
                    <div className="text-xs text-neutral-500">{group.emails.length} recipients</div>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === group.id ? null : group.id)}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-neutral-500" />
                  </button>
                  {openMenuId === group.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                      <div className="absolute right-0 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 w-48 z-20">
                        <button
                          onClick={() => { handleEdit(group); setOpenMenuId(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => { handleDelete(group.id); setOpenMenuId(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="text-xs font-medium text-neutral-500 uppercase">Emails</div>
                {group.emails.map((email, idx) => (
                  <div key={idx} className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded truncate">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SidePanel
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedGroup(null);
        }}
        title={selectedGroup ? 'Edit Email Group' : 'Add Email Group'}
        footer={
          <SidePanelFooter
            onCancel={() => {
              setIsAddModalOpen(false);
              setSelectedGroup(null);
            }}
            onSave={handleSave}
          />
        }
      >
        <FormSection title="Group Details">
          <div className="grid gap-4">
            <FormField>
              <FormLabel required>Group Name</FormLabel>
              <FormInput placeholder="e.g. Chirag Patel Group" defaultValue={selectedGroup?.name} />
            </FormField>
            <FormField>
              <FormLabel>Description</FormLabel>
              <FormInput placeholder="Enter description" defaultValue={selectedGroup?.description} />
            </FormField>
            <FormField>
              <FormLabel required>Email Addresses (comma separated)</FormLabel>
              <textarea 
                className="w-full h-24 p-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm"
                placeholder="email1@company.com, email2@company.com"
                defaultValue={selectedGroup?.emails.join(', ')}
              />
            </FormField>
          </div>
        </FormSection>
      </SidePanel>
    </div>
  );
}
