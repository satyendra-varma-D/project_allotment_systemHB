import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

interface ScheduleData {
  projectPDs: string;
  scheduleWeeks: string;
  uatWeeks: string;
  postDeliverySupport: string;
  startDate: string;
  endDate: string;
  projectType: string;
}

interface ScheduleEditSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ScheduleData;
  onSave: (data: ScheduleData) => void;
}

export function ScheduleEditSidePanel({
  isOpen,
  onClose,
  currentData,
  onSave,
}: ScheduleEditSidePanelProps) {
  const [projectPDs, setProjectPDs] = useState('');
  const [scheduleWeeks, setScheduleWeeks] = useState('');
  const [uatWeeks, setUatWeeks] = useState('');
  const [postDeliverySupport, setPostDeliverySupport] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sync state when panel opens or data changes
  useEffect(() => {
    if (isOpen) {
      setProjectPDs(currentData.projectPDs);
      setScheduleWeeks(currentData.scheduleWeeks);
      setUatWeeks(currentData.uatWeeks);
      setPostDeliverySupport(currentData.postDeliverySupport);
      setStartDate(currentData.startDate);
      setEndDate(currentData.endDate);
    }
  }, [isOpen, currentData]);

  const handleSave = () => {
    onSave({
      ...currentData,
      projectPDs,
      scheduleWeeks,
      uatWeeks,
      postDeliverySupport,
      startDate,
      endDate,
    });
    onClose();
  };

  const handleCancel = () => {
    setProjectPDs(currentData.projectPDs);
    setScheduleWeeks(currentData.scheduleWeeks);
    setUatWeeks(currentData.uatWeeks);
    setPostDeliverySupport(currentData.postDeliverySupport);
    setStartDate(currentData.startDate);
    setEndDate(currentData.endDate);
    onClose();
  };

  if (!isOpen) return null;

  const isFixedCost = currentData.projectType === 'Fixed Cost';

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
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Edit Project Schedule & Efforts
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Configure project timeline and effort details
              Project Type: <span className="font-medium text-neutral-700 dark:text-neutral-300">{currentData.projectType}</span>
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
          <div className="space-y-6">
            {/* Project Start Date (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Project End Date (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Project PDs (System Generated - Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project PDs (Hours)
              </label>
              <input
                type="text"
                value={projectPDs}
                onChange={(e) => setProjectPDs(e.target.value)}
                placeholder="e.g., 120"
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            {/* Schedule In Weeks (System Generated - Non-Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Schedule In Weeks
              </label>
              <input
                type="text"
                value={scheduleWeeks}
                onChange={(e) => setScheduleWeeks(e.target.value)}
                placeholder="e.g., 24"
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            {/* UAT In Weeks (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                UAT In Weeks
              </label>
              <input
                type="text"
                value={uatWeeks}
                onChange={(e) => setUatWeeks(e.target.value)}
                placeholder="e.g., 4 Weeks"
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              />
            </div>

            {/* Post Delivery Support (Editable) */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Post Delivery Support (Weeks)
              </label>
              <input
                type="text"
                value={postDeliverySupport}
                onChange={(e) => setPostDeliverySupport(e.target.value)}
                placeholder="e.g., 12 Weeks"
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              />
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