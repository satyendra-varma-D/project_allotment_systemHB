export interface AWSItem {
  id: string;
  title: string;
  type: 'HostingServer' | 'EC2' | 'S3' | 'RDS' | 'Lambda' | 'CloudFront' | 'Other';
  requestedDate: string;
  status: 'Requested' | 'Approved' | 'Active' | 'Inactive' | 'Cancelled';
  serverType: string;
  subscriptionStatus: 'Proposed' | 'Trial' | 'Active' | 'Suspended' | 'Expired' | 'Cancelled';
  description?: string;
  configuration?: string;
  subscriptionType: 'Monthly' | 'Yearly' | 'Pay-as-you-go';
  durationMonths: number;
  amount: number;
  startDate: string;
  endDate: string;
  currency: string;
  confirmedDate?: string;
  amountUSD?: number;
  confirmedBy?: string;
  supportPerson?: string;
  projectName?: string;
  clientName?: string;
}

export const awsData: AWSItem[] = [
  {
    id: 'aws-001',
    title: 'Production Web Server',
    type: 'EC2',
    requestedDate: '2024-01-15',
    status: 'Active',
    serverType: 't3.large',
    subscriptionStatus: 'Active',
    description: 'Main production web server for client portal',
    configuration: '8 vCPUs, 16GB RAM, 100GB SSD',
    subscriptionType: 'Yearly',
    durationMonths: 12,
    amount: 12000,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    currency: 'USD',
    confirmedDate: '2024-01-20',
    amountUSD: 12000,
    confirmedBy: 'John Smith',
    supportPerson: 'Sarah Johnson',
    projectName: 'Enterprise Portal',
    clientName: 'Acme Corporation',
  },
  {
    id: 'aws-002',
    title: 'Database Server - MySQL',
    type: 'RDS',
    requestedDate: '2024-02-10',
    status: 'Active',
    serverType: 'db.r5.xlarge',
    subscriptionStatus: 'Active',
    description: 'MySQL database for production environment',
    configuration: 'Multi-AZ deployment, 4 vCPUs, 32GB RAM, 500GB storage',
    subscriptionType: 'Monthly',
    durationMonths: 6,
    amount: 3600,
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    currency: 'USD',
    confirmedDate: '2024-02-15',
    amountUSD: 3600,
    confirmedBy: 'Michael Davis',
    supportPerson: 'Robert Wilson',
    projectName: 'E-commerce Platform',
    clientName: 'TechStart Inc.',
  },
  {
    id: 'aws-003',
    title: 'Static Content Storage',
    type: 'S3',
    requestedDate: '2024-01-20',
    status: 'Active',
    serverType: 'Standard',
    subscriptionStatus: 'Active',
    description: 'S3 bucket for static assets and media files',
    configuration: 'Standard storage class, 500GB capacity, versioning enabled',
    subscriptionType: 'Pay-as-you-go',
    durationMonths: 12,
    amount: 1200,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    currency: 'USD',
    confirmedDate: '2024-01-25',
    amountUSD: 1200,
    confirmedBy: 'John Smith',
    supportPerson: 'Emily Brown',
    projectName: 'Content Management System',
    clientName: 'Media Plus',
  },
  {
    id: 'aws-004',
    title: 'Serverless API Functions',
    type: 'Lambda',
    requestedDate: '2024-03-05',
    status: 'Approved',
    serverType: 'Standard',
    subscriptionStatus: 'Active',
    description: 'Lambda functions for API microservices',
    configuration: '1GB memory allocation, Node.js 18 runtime',
    subscriptionType: 'Pay-as-you-go',
    durationMonths: 12,
    amount: 800,
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    currency: 'USD',
    confirmedDate: '2024-03-10',
    amountUSD: 800,
    confirmedBy: 'Michael Davis',
    supportPerson: 'Sarah Johnson',
    projectName: 'Mobile Banking App',
    clientName: 'FinTech Solutions',
  },
  {
    id: 'aws-005',
    title: 'CDN Distribution',
    type: 'CloudFront',
    requestedDate: '2024-02-25',
    status: 'Active',
    serverType: 'Standard',
    subscriptionStatus: 'Active',
    description: 'CloudFront CDN for global content delivery',
    configuration: 'All edge locations, HTTPS enabled, custom SSL',
    subscriptionType: 'Monthly',
    durationMonths: 12,
    amount: 2400,
    startDate: '2024-03-15',
    endDate: '2025-03-14',
    currency: 'USD',
    confirmedDate: '2024-03-01',
    amountUSD: 2400,
    confirmedBy: 'John Smith',
    supportPerson: 'Robert Wilson',
    projectName: 'Global E-Learning Platform',
    clientName: 'EduTech Global',
  },
  {
    id: 'aws-006',
    title: 'Development Environment',
    type: 'EC2',
    requestedDate: '2024-03-10',
    status: 'Requested',
    serverType: 't3.medium',
    subscriptionStatus: 'Trial',
    description: 'Development and testing environment',
    configuration: '2 vCPUs, 4GB RAM, 50GB SSD',
    subscriptionType: 'Monthly',
    durationMonths: 3,
    amount: 450,
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    currency: 'USD',
    projectName: 'Internal Tools',
    clientName: 'Internal Project',
  },
  {
    id: 'aws-007',
    title: 'Data Warehouse',
    type: 'RDS',
    requestedDate: '2024-01-30',
    status: 'Inactive',
    serverType: 'db.r5.2xlarge',
    subscriptionStatus: 'Suspended',
    description: 'PostgreSQL data warehouse for analytics',
    configuration: '8 vCPUs, 64GB RAM, 1TB storage',
    subscriptionType: 'Yearly',
    durationMonths: 12,
    amount: 18000,
    startDate: '2024-02-15',
    endDate: '2025-02-14',
    currency: 'USD',
    confirmedDate: '2024-02-05',
    amountUSD: 18000,
    confirmedBy: 'Michael Davis',
    supportPerson: 'Emily Brown',
    projectName: 'Business Intelligence',
    clientName: 'Analytics Corp',
  },
  {
    id: 'aws-008',
    title: 'Backup Storage',
    type: 'S3',
    requestedDate: '2024-02-20',
    status: 'Active',
    serverType: 'Glacier',
    subscriptionStatus: 'Active',
    description: 'Long-term backup storage using S3 Glacier',
    configuration: 'Glacier storage class, 2TB capacity',
    subscriptionType: 'Yearly',
    durationMonths: 12,
    amount: 600,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    currency: 'USD',
    confirmedDate: '2024-02-25',
    amountUSD: 600,
    confirmedBy: 'John Smith',
    supportPerson: 'Sarah Johnson',
    projectName: 'Disaster Recovery',
    clientName: 'Enterprise Portal',
  },
];

export const getAWSData = (): AWSItem[] => {
  return awsData;
};

export const getAWSById = (id: string): AWSItem | undefined => {
  return awsData.find((item) => item.id === id);
};