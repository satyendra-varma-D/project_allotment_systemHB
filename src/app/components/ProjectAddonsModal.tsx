import { X, Plus, Package, Calendar, DollarSign, CheckCircle2, Clock, XCircle, AlertCircle, Edit, FileText } from 'lucide-react';
import { useState } from 'react';

interface Addon {
  id: string;
  addonId: string;
  addonTitle: string;
  addonType: 'Addon' | 'Support' | 'AMC';
  addonStatus: 'Identified' | 'Requested' | 'Confirmed' | 'Cancelled' | 'On Hold';
  proposedTotalHours: number;
  scheduleInWeeks: number;
  amount: number;
  addonRequestedDate: string;
  addonRequestedBy: string;
  approvedHours?: number;
  approvedAmount?: number;
  addonActionDate?: string;
  addonConfirmedBy?: string;
  projectName?: string;
  projectId?: string;
  clientName?: string;
  remarks?: string;
  createdDate: string;
}

interface ProjectAddonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  addons: Addon[];
  onAddAddon: () => void;
  onEditAddon?: (addon: Addon) => void;
}

export function ProjectAddonsModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  addons,
  onAddAddon,
  onEditAddon,
}: ProjectAddonsModalProps) {
  if (!isOpen) return null;

  // Filter addons for this project
  const projectAddons = addons.filter(a => a.projectId === projectId);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'Confirmed': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'Requested': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'Identified': 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400',
      'Cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'On Hold': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    };
    return statusMap[status] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400';
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      'Addon': 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
      'Support': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'AMC': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    };
    return typeMap[type] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400';
  };

  const handleEdit = (addon: Addon) => {
    if (onEditAddon) {
      onEditAddon(addon);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
        <div className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Project Addons
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {projectName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onAddAddon}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Addon
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
            {projectAddons.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                  No Addons Found
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  This project doesn't have any addons yet.
                </p>
                <button
                  onClick={onAddAddon}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add First Addon
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-y border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Addon Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Requested By
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {projectAddons.map((addon) => (
                      <tr
                        key={addon.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        {/* Addon Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {addon.addonTitle}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {addon.addonId}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(addon.addonType)}`}>
                            {addon.addonType}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {formatCurrency(addon.amount)}
                          </p>
                          {addon.approvedAmount && addon.approvedAmount !== addon.amount && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Approved: {formatCurrency(addon.approvedAmount)}
                            </p>
                          )}
                        </td>

                        {/* Hours */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-900 dark:text-white">
                            {addon.proposedTotalHours}h
                          </p>
                        </td>

                        {/* Schedule */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-900 dark:text-white">
                            {addon.scheduleInWeeks} weeks
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getStatusBadge(addon.addonStatus)}`}>
                            {addon.addonStatus}
                          </span>
                        </td>

                        {/* Requested By */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-900 dark:text-white">
                            {addon.addonRequestedBy}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatDate(addon.addonRequestedDate)}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEdit(addon)}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors inline-flex items-center justify-center"
                            title="Edit Addon"
                          >
                            <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          {projectAddons.length > 0 && (
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Total: {projectAddons.length} addon{projectAddons.length !== 1 ? 's' : ''}
                </span>
                <span className="text-neutral-900 dark:text-white font-semibold">
                  Total Value: {formatCurrency(projectAddons.reduce((sum, addon) => sum + addon.amount, 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}