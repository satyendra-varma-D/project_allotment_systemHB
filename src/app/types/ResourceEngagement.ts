export interface ResourceEngagementData {
  id?: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  crt: string; // Resource Name
  resourceType: string; // Dropdown - Designation or Seniority
  resourceSkill: string; // Dropdown - Technology Specific
  hireType: 'Full-Time' | 'Part-Time' | 'Average';
  hireCycle: 'Monthly' | 'Bi-Weekly' | 'Weekly' | 'Hourly';
  currentCycle?: number;
  noOfHours: number; // Per Cycle
  currency: string;
  hourlyRate: number;
  amountLocal: number; // Resource Amount (Selected Currency)
  amountUSD: number; // Resource Amount (USD)
  renewalStartDate: string;
  renewalEndDate: string;
  publishStatus: 'Draft' | 'Published' | 'Cancelled';
  paymentStatus: 'Pending' | 'Requested' | 'Invoice Raised' | 'Received';
  paymentStatusDate: string;
  invoiceNumber?: string;
  paymentMode?: string;
  subPaymentMode?: string;
  transactionCost?: number;
  transactionNumber?: string;
  // Additional fields for Resources directory
  resourceId?: string;
  department?: string;
  yearsOfExperience?: number;
  status: 'Active' | 'Inactive';
  email?: string;
  phone?: string;
  remarks?: string;
}
