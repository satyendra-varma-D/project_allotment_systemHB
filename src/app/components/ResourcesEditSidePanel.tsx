import { useState, useEffect } from 'react';
import { X, Calendar, Plus, Trash2, AlertCircle, DollarSign, Users, Clock, TrendingUp } from 'lucide-react';

interface Resource {
  id: string;
  resourceType: string;
  resourceSkill: string;
  hireType: string;
  hireCycle: string;
  hoursPerCycle: number;
  hourlyRate: number;
  resourceAmount: number;
  hireStartDate: string;
  hireEndDate: string;
}

interface ResourcesEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentResources: Resource[];
  onSave: (resources: Resource[]) => void;
  projectType: string;
  localCurrency: string;
}

export function ResourcesEditSidePanel({
  isOpen,
  onClose,
  currentResources,
  onSave,
  projectType,
  localCurrency,
}: ResourcesEditSidePanelProps) {
  const [resources, setResources] = useState<Resource[]>(currentResources);

  // Sync state when panel opens or data changes
  useEffect(() => {
    if (isOpen) {
      setResources(currentResources);
    }
  }, [isOpen, currentResources]);

  const calculateResourceAmount = (hoursPerCycle: number, hourlyRate: number, hireCycle: string, startDate: string, endDate: string): number => {
    if (!startDate || !endDate || !hoursPerCycle || !hourlyRate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let cycles = 0;
    switch (hireCycle) {
      case 'Monthly':
        cycles = Math.ceil(diffDays / 30);
        break;
      case 'Bi-Weekly':
        cycles = Math.ceil(diffDays / 14);
        break;
      case 'Weekly':
        cycles = Math.ceil(diffDays / 7);
        break;
      case 'Hourly':
        cycles = 1; // Direct hourly calculation
        break;
      default:
        cycles = 1;
    }
    
    if (hireCycle === 'Hourly') {
      return hoursPerCycle * hourlyRate;
    }
    
    return cycles * hoursPerCycle * hourlyRate;
  };

  const handleFieldChange = (id: string, field: keyof Resource, value: string | number) => {
    setResources((prev) =>
      prev.map((resource) => {
        if (resource.id === id) {
          const updated = { ...resource, [field]: value };
          
          // Auto-calculate amount when relevant fields change
          if (['hoursPerCycle', 'hourlyRate', 'hireCycle', 'hireStartDate', 'hireEndDate'].includes(field)) {
            updated.resourceAmount = calculateResourceAmount(
              Number(updated.hoursPerCycle),
              Number(updated.hourlyRate),
              updated.hireCycle,
              updated.hireStartDate,
              updated.hireEndDate
            );
          }
          
          return updated;
        }
        return resource;
      })
    );
  };

  const handleAddResource = () => {
    const newResource: Resource = {
      id: `resource-${Date.now()}`,
      resourceType: '',
      resourceSkill: '',
      hireType: 'Full Time',
      hireCycle: 'Monthly',
      hoursPerCycle: 160,
      hourlyRate: 0,
      resourceAmount: 0,
      hireStartDate: '',
      hireEndDate: '',
    };
    setResources([...resources, newResource]);
  };

  const handleRemoveResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    onSave(resources);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const isHireProject = projectType === 'Hire';
  const totalAmount = resources.reduce((sum, r) => sum + Number(r.resourceAmount || 0), 0);

  const resourceTypes = [
    'Junior Developer',
    'Mid-Level Developer',
    'Senior Developer',
    'Lead Developer',
    'Tech Lead',
    'Architect',
    'UI/UX Designer',
    'QA Engineer',
    'DevOps Engineer',
    'Business Analyst',
    'Project Manager',
    'Scrum Master',
  ];

  const technologySkills = [
    'React.js',
    'Angular',
    'Vue.js',
    'Node.js',
    'Python',
    'Java',
    'C#',
    '.NET',
    'PHP',
    'Ruby on Rails',
    'iOS (Swift)',
    'Android (Kotlin)',
    'React Native',
    'Flutter',
    'DevOps',
    'AWS',
    'Azure',
    'QA/Testing',
    'UI/UX Design',
    'Business Analysis',
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleCancel}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Resource Allocation
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Manage hired resources and team allocation
              <span className="ml-2 font-medium text-neutral-700 dark:text-neutral-300">
                ({resources.length} resources)
              </span>
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
          <div className="space-y-4">
            {/* Warning Box for Fixed Cost Projects */}
            {!isHireProject && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                    Not Applicable for Fixed Cost Projects
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    Resource allocation is only available for Hire projects. Fixed Cost projects use milestone-based payment structure.
                  </p>
                </div>
              </div>
            )}

            {/* Project Summary */}
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-primary-900 dark:text-primary-200">Total Resource Cost</p>
                  <p className="text-lg font-bold text-primary-700 dark:text-primary-400">
                    {localCurrency} {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-primary-900 dark:text-primary-200">Active Resources</p>
                <p className="text-lg font-bold text-primary-700 dark:text-primary-400">
                  {resources.length}
                </p>
              </div>
            </div>

            {/* Resources List */}
            {resources.map((resource, index) => (
              <div
                key={resource.id}
                className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-5"
              >
                {/* Resource Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Resource {index + 1}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {localCurrency} {resource.resourceAmount.toLocaleString()} • {resource.hireType}
                      </p>
                    </div>
                  </div>
                  {resources.length > 1 && (
                    <button
                      onClick={() => handleRemoveResource(resource.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    </button>
                  )}
                </div>

                {/* Resource Fields Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Resource Type */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Resource Type (Designation)
                    </label>
                    <select
                      value={resource.resourceType}
                      onChange={(e) => handleFieldChange(resource.id, 'resourceType', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="">Select Designation</option>
                      {resourceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Resource Skill */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Resource Skill (Technology)
                    </label>
                    <select
                      value={resource.resourceSkill}
                      onChange={(e) => handleFieldChange(resource.id, 'resourceSkill', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="">Select Technology</option>
                      {technologySkills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hire Type */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Hire Type
                    </label>
                    <select
                      value={resource.hireType}
                      onChange={(e) => handleFieldChange(resource.id, 'hireType', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Average">Average</option>
                    </select>
                  </div>

                  {/* Hire Cycle */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Hire Cycle
                    </label>
                    <select
                      value={resource.hireCycle}
                      onChange={(e) => handleFieldChange(resource.id, 'hireCycle', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>

                  {/* No of Hours */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      No of Hours (Per Cycle)
                    </label>
                    <input
                      type="number"
                      value={resource.hoursPerCycle}
                      onChange={(e) => handleFieldChange(resource.id, 'hoursPerCycle', Number(e.target.value))}
                      placeholder="e.g., 160"
                      min="0"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Hourly Rate ({localCurrency})
                    </label>
                    <input
                      type="number"
                      value={resource.hourlyRate}
                      onChange={(e) => handleFieldChange(resource.id, 'hourlyRate', Number(e.target.value))}
                      placeholder="e.g., 50"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>

                  {/* Hire Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Hire Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={resource.hireStartDate}
                        onChange={(e) => handleFieldChange(resource.id, 'hireStartDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Hire End Date */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Hire End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={resource.hireEndDate}
                        onChange={(e) => handleFieldChange(resource.id, 'hireEndDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Auto-calculated Resource Amount (Read-only Display) */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Resource Amount ({localCurrency})
                      <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                        (Auto-calculated from hours × rate × duration)
                      </span>
                    </label>
                    <div className="px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg">
                      <span className="text-base font-bold text-green-700 dark:text-green-400">
                        {localCurrency} {resource.resourceAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Resource Button */}
            <button
              onClick={handleAddResource}
              className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Add New Resource
                </span>
              </div>
            </button>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Note:</strong> Resource amounts are automatically calculated based on hourly rate, hours per cycle, hire cycle, and duration between start and end dates. Total cost is displayed in {localCurrency}.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Total: </span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {localCurrency} {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Resources: </span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {resources.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
      </div>
    </>
  );
}
