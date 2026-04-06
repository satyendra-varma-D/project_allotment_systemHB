import { useState, useMemo } from 'react';
import {
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react';
import { ListingHeader, AdvancedSearchPanel } from './hb/listing';
import type { FilterCondition, ViewMode } from './hb/listing';
import { ResourceRenewalsEditSidePanel } from './ResourceRenewalsEditSidePanel';
import { ResourceEngagementData } from '../types/ResourceEngagement';

const mockRenewals: ResourceEngagementData[] = [
  {
    id: '1',
    projectCode: 'CRM-001',
    projectName: 'Enterprise CRM Platform',
    clientName: 'Tech Solutions Inc.',
    crt: 'Sarah Wilson',
    resourceType: 'Senior Backend Developer',
    resourceSkill: 'Node.js',
    hireType: 'Full-Time',
    hireCycle: 'Monthly',
    currentCycle: 4,
    noOfHours: 160,
    currency: 'USD',
    hourlyRate: 50,
    amountLocal: 8000,
    amountUSD: 8000,
    renewalStartDate: '2024-04-01',
    renewalEndDate: '2024-04-30',
    publishStatus: 'Published',
    paymentStatus: 'Received',
    paymentStatusDate: '2024-04-05',
    status: 'Active',
    invoiceNumber: 'INV-2024-0401',
    paymentMode: 'Bank Transfer',
    subPaymentMode: 'NEFT',
    transactionCost: 25,
    transactionNumber: 'TXN-20240405-001',
  },
  {
    id: '2',
    projectCode: 'MB-001',
    projectName: 'Mobile Banking App',
    clientName: 'Bank of America',
    crt: 'Michael Ross',
    resourceType: 'Senior Designer',
    resourceSkill: 'Figma',
    hireType: 'Full-Time',
    hireCycle: 'Monthly',
    currentCycle: 2,
    noOfHours: 160,
    currency: 'EUR',
    hourlyRate: 45,
    amountLocal: 7200,
    amountUSD: 7776,
    renewalStartDate: '2024-04-15',
    renewalEndDate: '2024-05-14',
    publishStatus: 'Published',
    paymentStatus: 'Invoice Raised',
    paymentStatusDate: '2024-04-10',
    status: 'Active',
    invoiceNumber: 'INV-2024-0415',
  },
];

export default function ResourceRenewalsModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<ResourceEngagementData | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return mockRenewals.filter(item => 
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.crt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleEdit = (renewal: ResourceEngagementData) => {
    setSelectedRenewal(renewal);
    setIsEditPanelOpen(true);
    setOpenMenuId(null);
  };

  const getPaymentStyle = (status: string) => {
    const styles = {
      'Received': 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800',
      'Invoice Raised': 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-800',
      'Requested': 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800',
      'Pending': 'bg-neutral-50 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  const getPublishStyle = (status: string) => {
    const styles = {
      'Published': 'bg-green-50 text-green-700 border border-green-200',
      'Draft': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'Cancelled': 'bg-red-50 text-red-700 border border-red-200',
    };
    return styles[status as keyof typeof styles] || styles.Draft;
  };

  // Action menu component
  const ActionMenu = ({ item }: { item: ResourceEngagementData }) => (
    <div className="relative">
      <button 
        onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-neutral-400" />
      </button>
      {openMenuId === item.id && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
          <div className="absolute right-0 top-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl py-2 w-48 z-20 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => handleEdit(item)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center gap-3 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-primary-600" />
              <span className="font-medium">Edit Renewal</span>
            </button>
            <button
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Remove</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ─── TABLE VIEW ─────────────────────────────────
  const renderTableView = () => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider sticky left-0 bg-neutral-50 dark:bg-neutral-800/50 z-10">Project Code</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Project Name</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">CRT</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Resource Type</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Skill</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Hire Type</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Hire Cycle</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Hours</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Currency</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Hourly Rate</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Amount (USD)</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Amount (Local)</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Start Date</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">End Date</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Publish</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Invoice #</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pay Mode</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Sub Mode</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Txn Cost</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Txn #</th>
              <th className="px-4 py-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group text-sm">
                <td className="px-4 py-3 sticky left-0 bg-white dark:bg-neutral-900 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/30 z-10">
                  <span className="font-bold text-primary-600 text-xs">{item.projectCode}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">{item.projectName}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{item.clientName}</td>
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">{item.crt}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{item.resourceType}</td>
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{item.resourceSkill}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.hireType === 'Full-Time' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                    {item.hireType}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{item.hireCycle}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-center">{item.noOfHours}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 font-medium">{item.currency}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">${item.hourlyRate}</td>
                <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">${item.amountUSD.toLocaleString()}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                  {item.currency !== 'USD' ? `${item.currency} ${item.amountLocal.toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{item.renewalStartDate}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{item.renewalEndDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPublishStyle(item.publishStatus)}`}>
                    {item.publishStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPaymentStyle(item.paymentStatus)}`}>
                    {item.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">{item.invoiceNumber || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">{item.paymentMode || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">{item.subPaymentMode || '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">{item.transactionCost ? `$${item.transactionCost}` : '—'}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs whitespace-nowrap">{item.transactionNumber || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── LIST VIEW ─────────────────────────────────
  const renderListView = () => (
    <div className="space-y-3">
      {filteredData.map((item) => (
        <div key={item.id} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden">
          {/* Top accent based on payment status */}
          <div className={`h-1 ${
            item.paymentStatus === 'Received' ? 'bg-green-500' :
            item.paymentStatus === 'Invoice Raised' ? 'bg-purple-500' :
            item.paymentStatus === 'Requested' ? 'bg-orange-500' :
            'bg-neutral-300 dark:bg-neutral-700'
          }`} />
          
          <div className="p-5">
            {/* Row 1: Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-900/30 shrink-0">
                  {item.projectCode}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-500 shrink-0">
                  CYCLE {item.currentCycle || 1}
                </span>
                <h3 className="font-bold text-neutral-900 dark:text-white truncate text-base">{item.projectName}</h3>
                <span className="text-xs text-neutral-500 font-medium shrink-0">• {item.crt}</span>
              </div>
              <ActionMenu item={item} />
            </div>

            {/* Row 2: All key fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-3">
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Client</div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{item.clientName}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Resource Type</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{item.resourceType}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Skill</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{item.resourceSkill}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Hire Type</div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.hireType === 'Full-Time' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                  {item.hireType}
                </span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Hire Cycle</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.hireCycle}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">No of Hours</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.noOfHours} hrs</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Hourly Rate</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.currency} {item.hourlyRate}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Currency</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">{item.currency}</div>
              </div>
            </div>

            {/* Row 3: Commercial & Payment */}
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-3">
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Amount (USD)</div>
                <div className="text-sm font-black text-neutral-900 dark:text-white">${item.amountUSD.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Amount ({item.currency})</div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {item.currency !== 'USD' ? `${item.currency} ${item.amountLocal.toLocaleString()}` : '—'}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Start Date</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{item.renewalStartDate}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">End Date</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{item.renewalEndDate}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Publish Status</div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPublishStyle(item.publishStatus)}`}>{item.publishStatus}</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Payment Status</div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPaymentStyle(item.paymentStatus)}`}>{item.paymentStatus}</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Invoice #</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.invoiceNumber || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Payment Mode</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.paymentMode || '—'}</div>
              </div>
            </div>

            {/* Row 4: Extra payment details */}
            {(item.subPaymentMode || item.transactionCost || item.transactionNumber) && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-3">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Sub Pay Mode</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.subPaymentMode || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Txn Cost</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.transactionCost ? `$${item.transactionCost}` : '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Txn Number</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.transactionNumber || '—'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // ─── GRID VIEW ─────────────────────────────────
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredData.map((item) => (
        <div 
          key={item.id} 
          className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
        >
          {/* Status Indicator Top - Based on Payment Status */}
          <div className={`absolute top-0 left-0 w-full h-1.5 ${
            item.paymentStatus === 'Received' ? 'bg-green-500' :
            item.paymentStatus === 'Invoice Raised' ? 'bg-purple-500' :
            item.paymentStatus === 'Requested' ? 'bg-orange-500' :
            'bg-neutral-300 dark:bg-neutral-700'
          }`} />

          <div className="p-6">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-900/30">
                    {item.projectCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    CYCLE {item.currentCycle || 1}
                  </span>
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                  {item.projectName}
                </h3>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">{item.crt} • {item.resourceType}</p>
              </div>
              <ActionMenu item={item} />
            </div>

            <div className="space-y-3">
              {/* Client & Skill */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">Client</div>
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                     {item.clientName}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">Skill</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.resourceSkill}</div>
                </div>
              </div>

              {/* Commercials Highlight */}
              <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
                 <div className="flex justify-between items-end">
                    <div>
                       <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Renewal Amount</div>
                       <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-neutral-900 dark:text-white">
                            ${item.amountUSD.toLocaleString()}
                          </span>
                          {item.currency !== 'USD' && (
                            <span className="text-[10px] font-bold text-neutral-500">
                              ({item.currency} {item.amountLocal.toLocaleString()})
                            </span>
                          )}
                       </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getPaymentStyle(item.paymentStatus)}`}>
                       {item.paymentStatus}
                    </div>
                 </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Hire Type</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.hireType === 'Full-Time' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                    {item.hireType}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Hire Cycle</div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{item.hireCycle} • {item.noOfHours}h</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Start Date</div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                     <Calendar className="w-3 h-3 text-neutral-400" />
                     {item.renewalStartDate}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">End Date</div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                     <Calendar className="w-3 h-3 text-neutral-400" />
                     {item.renewalEndDate}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Hourly Rate</div>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{item.currency} {item.hourlyRate}/hr</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Publish</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPublishStyle(item.publishStatus)}`}>{item.publishStatus}</span>
                </div>
              </div>

              {/* Footer Tags */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                   {item.invoiceNumber || 'NO INVOICE'}
                 </span>
                 <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">RENEWAL</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <ListingHeader
        title="Resource Renewals"
        subtitle="Manage resource billing cycles and renewal tracking"
        moduleName="Renewal"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsAdvancedSearchOpen(true)}
        onRefresh={() => console.log('Refresh')}
        onAdd={() => {
          setSelectedRenewal(null);
          setIsEditPanelOpen(true);
        }}
      />

      <div className="flex-1 overflow-y-auto px-6 pb-6 mt-4 scrollbar-hide">
        {viewMode === 'table' ? renderTableView() : viewMode === 'list' ? renderListView() : renderGridView()}
      </div>

      <ResourceRenewalsEditSidePanel
        isOpen={isEditPanelOpen}
        onClose={() => {
          setIsEditPanelOpen(false);
          setOpenMenuId(null);
        }}
        renewal={selectedRenewal}
        onSave={(data) => {
          console.log('Saved:', data);
          setIsEditPanelOpen(false);
        }}
      />

      <AdvancedSearchPanel
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        filters={activeFilters}
        onFiltersChange={setActiveFilters}
        filterOptions={{
          'Payment Status': ['Pending', 'Requested', 'Invoice Raised', 'Received'],
          'Hire Type': ['Full-Time', 'Part-Time', 'Average'],
          'Publish Status': ['Draft', 'Published', 'Cancelled'],
        }}
      />
    </div>
  );
}