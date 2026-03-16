import { useState, useEffect } from 'react';
import { X, Calendar, Plus, Trash2, AlertCircle, DollarSign, Package } from 'lucide-react';

interface Milestone {
  id: string;
  code: string;
  name: string;
  percentage: number;
  dueDate: string;
  deliverables: string;
  amount: number;
}

interface MilestoneEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMilestones: Milestone[];
  onSave: (milestones: Milestone[]) => void;
  projectType: string;
  totalAmount: number;
  selectedMilestoneCodes: string[];
}

export function MilestoneEditSidePanel({
  isOpen,
  onClose,
  currentMilestones,
  onSave,
  projectType,
  totalAmount,
  selectedMilestoneCodes,
}: MilestoneEditSidePanelProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(currentMilestones);

  // Sync state when panel opens or data changes
  useEffect(() => {
    if (isOpen) {
      // Filter milestones to only show selected ones
      const filteredMilestones = currentMilestones.filter(m => 
        selectedMilestoneCodes.includes(m.code)
      );
      setMilestones(filteredMilestones.length > 0 ? filteredMilestones : currentMilestones);
    }
  }, [isOpen, currentMilestones, selectedMilestoneCodes]);

  const handleFieldChange = (id: string, field: keyof Milestone, value: string | number) => {
    setMilestones((prev) =>
      prev.map((milestone) => {
        if (milestone.id === id) {
          const updated = { ...milestone, [field]: value };
          
          // Auto-calculate amount based on percentage
          if (field === 'percentage') {
            updated.amount = (totalAmount * (Number(value) / 100));
          }
          
          return updated;
        }
        return milestone;
      })
    );
  };

  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      code: `M${milestones.length + 1}`,
      name: '',
      percentage: 0,
      dueDate: '',
      deliverables: '',
      amount: 0,
    };
    setMilestones([...milestones, newMilestone]);
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = () => {
    onSave(milestones);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const isFixedCost = projectType === 'Fixed Cost';
  const totalPercentage = milestones.reduce((sum, m) => sum + Number(m.percentage || 0), 0);
  const isPercentageValid = totalPercentage === 100;

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
              Edit Milestone Listing
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Configure project milestones and payment schedule ({milestones.length} milestones)
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
            {/* Warning Box for Hire Projects */}
            {!isFixedCost && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                    Not Applicable for Hire Projects
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    Milestone configuration is only available for Fixed Cost projects. Hire projects use a different payment structure based on resource allocation.
                  </p>
                </div>
              </div>
            )}

            {/* Percentage Validation Warning */}
            {isFixedCost && !isPercentageValid && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                    Invalid Percentage Total
                  </p>
                  <p className="text-sm text-red-900 dark:text-red-200">
                    Total milestone percentage must equal 100%. Current total: <strong>{totalPercentage}%</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Project Amount Summary */}
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-primary-900 dark:text-primary-200">Total Project Amount</p>
                  <p className="text-lg font-bold text-primary-700 dark:text-primary-400">
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-primary-900 dark:text-primary-200">Total %</p>
                <p className={`text-lg font-bold ${isPercentageValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {totalPercentage}%
                </p>
              </div>
            </div>

            {/* Milestones List */}
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-lg p-5"
              >
                {/* Milestone Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Milestone {index + 1}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        ${milestone.amount.toLocaleString()} ({milestone.percentage}%)
                      </p>
                    </div>
                  </div>
                  {milestones.length > 1 && (
                    <button
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    </button>
                  )}
                </div>

                {/* Milestone Fields Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Milestone Code */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone Code
                    </label>
                    <input
                      type="text"
                      value={milestone.code}
                      onChange={(e) => handleFieldChange(milestone.id, 'code', e.target.value)}
                      placeholder="e.g., M1"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>

                  {/* Milestone Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone %
                    </label>
                    <input
                      type="number"
                      value={milestone.percentage}
                      onChange={(e) => handleFieldChange(milestone.id, 'percentage', Number(e.target.value))}
                      placeholder="e.g., 30"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>

                  {/* Milestone Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone Name
                    </label>
                    <input
                      type="text"
                      value={milestone.name}
                      onChange={(e) => handleFieldChange(milestone.id, 'name', e.target.value)}
                      placeholder="e.g., Project Kickoff"
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>

                  {/* Milestone Date */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => handleFieldChange(milestone.id, 'dueDate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Milestone Deliverable */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone Deliverable
                    </label>
                    <textarea
                      value={milestone.deliverables}
                      onChange={(e) => handleFieldChange(milestone.id, 'deliverables', e.target.value)}
                      placeholder="e.g., Signed Requirements Document, Project Plan"
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Auto-calculated Amount (Read-only Display) */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Milestone Amount
                      <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                        (Auto-calculated from percentage)
                      </span>
                    </label>
                    <div className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        ${milestone.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Milestone Button */}
            <button
              onClick={handleAddMilestone}
              className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Add New Milestone
                </span>
              </div>
            </button>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Note:</strong> Milestone amounts are automatically calculated based on the percentage and total project amount. The sum of all milestone percentages must equal 100%.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Total: </span>
              <span className={`font-bold ${isPercentageValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {totalPercentage}%
              </span>
            </div>
            <div className="text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Milestones: </span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {milestones.length}
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
              disabled={!isPercentageValid}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isPercentageValid
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}