import { X, Plus, Flag, Calendar, DollarSign, CheckCircle2, Clock, XCircle, AlertCircle, MoreVertical, Edit, FileText } from 'lucide-react';
import { useState } from 'react';
import { MilestoneChangeLogsModal } from './MilestoneChangeLogsModal';

interface Milestone {
  id: string;
  milestoneId: string;
  projectId: string;
  milestoneName: string;
  milestoneCode: string;
  milestoneAmount: number;
  currency: string;
  milestoneType: string;
  plannedDate: string;
  actualDate?: string;
  paymentStatus: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';
  completionStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  invoiceStatus: 'Not Generated' | 'Generated' | 'Sent' | 'Paid';
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
  remarks?: string;
}

interface ProjectMilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  milestones: Milestone[];
  onAddMilestone: () => void;
  onEditMilestone?: (milestone: Milestone) => void;
}

export function ProjectMilestonesModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  milestones,
  onAddMilestone,
  onEditMilestone,
}: ProjectMilestonesModalProps) {
  if (!isOpen) return null;

  const [selectedMilestoneForLogs, setSelectedMilestoneForLogs] = useState<Milestone | null>(null);

  // Filter milestones for this project
  const projectMilestones = milestones.filter(m => m.projectId === projectId);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'Completed': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'In Progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'Not Started': 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400',
      'Delayed': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      'Approved': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Rejected': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Paid': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Partially Paid': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      'Overdue': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return statusMap[status] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, string> = {
      'High': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'Medium': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      'Low': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    return priorityMap[priority] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400';
  };

  const handleViewChangeLogs = (milestone: Milestone) => {
    setSelectedMilestoneForLogs(milestone);
  };

  const handleEdit = (milestone: Milestone) => {
    if (onEditMilestone) {
      onEditMilestone(milestone);
    }
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
        <div className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Project Milestones
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {projectName} • {projectMilestones.length} milestone{projectMilestones.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onAddMilestone}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Milestone
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {projectMilestones.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Flag className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  No milestones found for this project
                </p>
                <button
                  onClick={onAddMilestone}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add First Milestone
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-y border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Milestone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Planned Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Actual Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Completion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {projectMilestones.map((milestone) => (
                      <tr
                        key={milestone.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                              <Flag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {milestone.milestoneName}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {milestone.milestoneCode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {milestone.milestoneType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {milestone.milestoneAmount.toLocaleString()}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {milestone.currency}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-900 dark:text-white">
                              {new Date(milestone.plannedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {milestone.actualDate ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <span className="text-sm text-neutral-900 dark:text-white">
                                {new Date(milestone.actualDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 dark:text-neutral-600">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getStatusBadge(milestone.completionStatus)}`}>
                            {milestone.completionStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getStatusBadge(milestone.paymentStatus)}`}>
                            {milestone.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getPriorityBadge(milestone.priority)}`}>
                            {milestone.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                {milestone.assignedTo.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm text-neutral-900 dark:text-white">
                              {milestone.assignedTo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleViewChangeLogs(milestone)}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                              title="View change logs"
                            >
                              <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() => handleEdit(milestone)}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  Completed: {projectMilestones.filter(m => m.completionStatus === 'Completed').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  In Progress: {projectMilestones.filter(m => m.completionStatus === 'In Progress').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  Not Started: {projectMilestones.filter(m => m.completionStatus === 'Not Started').length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  Delayed: {projectMilestones.filter(m => m.completionStatus === 'Delayed').length}
                </span>
              </div>
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

      {/* Milestone Change Logs Modal */}
      <MilestoneChangeLogsModal
        isOpen={selectedMilestoneForLogs !== null}
        onClose={() => setSelectedMilestoneForLogs(null)}
        milestone={selectedMilestoneForLogs}
      />
    </div>
  );
}