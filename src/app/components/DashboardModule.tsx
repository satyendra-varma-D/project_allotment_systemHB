import { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Users,
} from 'lucide-react';
import { PageHeader, SummaryWidgets } from './hb/listing';

export default function DashboardModule() {
  const [showSummary, setShowSummary] = useState(true);

  // Project-related summary widgets
  const widgets = [
    {
      id: 'total-projects',
      label: 'Total Projects',
      value: 45,
      icon: 'Briefcase',
      trend: '12',
      trendDirection: 'up' as const,
      subtitle: 'vs last month',
      color: 'primary' as const,
    },
    {
      id: 'active-projects',
      label: 'Active Projects',
      value: 28,
      icon: 'TrendingUp',
      trend: '8',
      trendDirection: 'up' as const,
      subtitle: 'vs last month',
      color: 'success' as const,
    },
    {
      id: 'pending-projects',
      label: 'Pending Projects',
      value: 12,
      icon: 'Clock',
      trend: '3',
      trendDirection: 'down' as const,
      subtitle: 'vs last month',
      color: 'warning' as const,
    },
    {
      id: 'completed-projects',
      label: 'Completed Projects',
      value: 156,
      icon: 'CheckCircle',
      trend: '15',
      trendDirection: 'up' as const,
      subtitle: 'vs last month',
      color: 'success' as const,
    },
    {
      id: 'total-revenue',
      label: 'Total Revenue',
      value: '$2.4M',
      icon: 'DollarSign',
      trend: '18',
      trendDirection: 'up' as const,
      subtitle: 'vs last month',
      color: 'primary' as const,
    },
    {
      id: 'team-members',
      label: 'Team Members',
      value: 87,
      icon: 'Users',
      trend: '5',
      trendDirection: 'up' as const,
      subtitle: 'vs last month',
      color: 'primary' as const,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your projects and key metrics"
        />

        {/* Summary Widgets */}
        {showSummary && (
          <div className="mb-6">
            <SummaryWidgets widgets={widgets} data={[]} />
          </div>
        )}

        {/* Additional Dashboard Content Can Go Here */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            Monitor your project performance, track team productivity, and manage resources effectively.
          </p>
        </div>
      </div>
    </div>
  );
}