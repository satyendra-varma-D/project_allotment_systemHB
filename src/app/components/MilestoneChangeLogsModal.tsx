import { X, Clock, User, ArrowRight } from 'lucide-react';

interface ChangeLog {
  id: string;
  timestamp: string;
  changedBy: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changeType: 'status' | 'field' | 'assignment';
}

interface Milestone {
  id: string;
  milestoneId: string;
  milestoneName: string;
  milestoneCode: string;
}

interface MilestoneChangeLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

// Mock change logs data - in a real app, this would come from an API
const getMockChangeLogs = (milestoneId: string): ChangeLog[] => {
  return [
    {
      id: '1',
      timestamp: '2024-03-10T14:30:00Z',
      changedBy: 'John Smith',
      fieldName: 'Payment Status',
      oldValue: 'Pending',
      newValue: 'Partially Paid',
      changeType: 'status',
    },
    {
      id: '2',
      timestamp: '2024-03-08T10:15:00Z',
      changedBy: 'Sarah Johnson',
      fieldName: 'Completion Status',
      oldValue: 'Not Started',
      newValue: 'In Progress',
      changeType: 'status',
    },
    {
      id: '3',
      timestamp: '2024-03-05T16:45:00Z',
      changedBy: 'Michael Chen',
      fieldName: 'Assigned To',
      oldValue: 'Robert Martinez',
      newValue: 'Emily Davis',
      changeType: 'assignment',
    },
    {
      id: '4',
      timestamp: '2024-03-03T09:20:00Z',
      changedBy: 'John Smith',
      fieldName: 'Milestone Amount',
      oldValue: '$45,000',
      newValue: '$50,000',
      changeType: 'field',
    },
    {
      id: '5',
      timestamp: '2024-03-01T11:00:00Z',
      changedBy: 'Sarah Johnson',
      fieldName: 'Priority',
      oldValue: 'Medium',
      newValue: 'High',
      changeType: 'field',
    },
  ];
};

export function MilestoneChangeLogsModal({
  isOpen,
  onClose,
  milestone,
}: MilestoneChangeLogsModalProps) {
  if (!isOpen || !milestone) return null;

  const changeLogs = getMockChangeLogs(milestone.milestoneId);

  const getChangeTypeIcon = (type: ChangeLog['changeType']) => {
    return <Clock className="w-4 h-4" />;
  };

  const getChangeTypeBadge = (type: ChangeLog['changeType']) => {
    const typeMap: Record<string, string> = {
      'status': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'field': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'assignment': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    };
    return typeMap[type] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Change Logs
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {milestone.milestoneName} ({milestone.milestoneCode})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {changeLogs.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  No change logs found for this milestone
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {changeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {log.changedBy}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(log.timestamp)}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getChangeTypeBadge(log.changeType)}`}>
                        {log.changeType.charAt(0).toUpperCase() + log.changeType.slice(1)}
                      </span>
                    </div>
                    
                    <div className="ml-13 space-y-2">
                      <div className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        {log.fieldName}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            Previous Value
                          </div>
                          <div className="text-sm text-neutral-900 dark:text-white font-medium">
                            {log.oldValue}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
                        <div className="flex-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            New Value
                          </div>
                          <div className="text-sm text-neutral-900 dark:text-white font-medium">
                            {log.newValue}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Total Changes: {changeLogs.length}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
