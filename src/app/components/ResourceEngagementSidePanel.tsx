import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ResourceEngagementSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  resource?: any; // Pass resource data for editing
  onSave?: (data: any) => void;
}

export function ResourceEngagementSidePanel({ isOpen, onClose, resource, onSave }: ResourceEngagementSidePanelProps) {
  const [formData, setFormData] = useState({
    resourceName: resource?.resourceName || '',
    role: resource?.role || '',
    project: resource?.project || '',
    engagementModel: resource?.engagementModel || 'Full-Time',
    startDate: resource?.startDate || '',
  });
  
  // Sync state when resource prop changes or panel opens
  useEffect(() => {
    if (isOpen && resource) {
      setFormData({
        resourceName: resource.resourceName || '',
        role: resource.role || '',
        project: resource.project || '',
        engagementModel: resource.engagementModel || 'Full-Time',
        startDate: resource.startDate || '',
      });
    } else if (!resource) {
      // Reset form if resource is null
      setFormData({
        resourceName: '',
        role: '',
        project: '',
        engagementModel: 'Full-Time',
        startDate: '',
      });
    }
  }, [isOpen, resource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Side Panel */}
      <div className="relative ml-auto bg-white dark:bg-neutral-900 w-full max-w-lg h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {resource ? 'Edit Resource Engagement' : 'Add New Resource Engagement'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {resource ? 'Update resource engagement details' : 'Create a new resource engagement'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Resource Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Resource Name
              </label>
              <input
                type="text"
                value={formData.resourceName}
                onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter resource name"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="e.g., Senior Developer"
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project
              </label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="">Select project</option>
                <option value="Enterprise CRM Platform">Enterprise CRM Platform</option>
                <option value="E-Commerce Redesign">E-Commerce Redesign</option>
                <option value="Mobile Banking App">Mobile Banking App</option>
                <option value="Healthcare Portal">Healthcare Portal</option>
                <option value="Analytics Dashboard">Analytics Dashboard</option>
              </select>
            </div>

            {/* Engagement Model */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Engagement Model
              </label>
              <select
                value={formData.engagementModel}
                onChange={(e) => setFormData({ ...formData, engagementModel: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Consultant">Consultant</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                placeholder="dd-mm-yyyy"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
