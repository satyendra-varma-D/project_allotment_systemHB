import { X, Mail, Copy, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectEmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  preSalesTeam?: any[];
  postSalesTeam?: any[];
  clientTeamInfo?: any;
  technologyStack?: any;
  scheduleEfforts?: any;
  commercialDetails?: any;
  agreements?: any;
  milestones?: any[];
  resources?: any[];
  attachments?: any[];
  salesNotes?: any;
}

export function ProjectEmailPreviewModal({ 
  isOpen, 
  onClose, 
  project,
  preSalesTeam,
  postSalesTeam,
  clientTeamInfo,
  technologyStack,
  scheduleEfforts,
  commercialDetails,
  agreements,
  milestones,
  resources,
  attachments,
  salesNotes
}: ProjectEmailPreviewModalProps) {
  if (!isOpen) return null;

  const generateEmailHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Details - ${project.projectName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      border: 1px solid #ddd;
      overflow: hidden;
    }
    
    /* Tab Navigation */
    .tab-navigation {
      display: flex;
      background-color: #e8e8e8;
      border-bottom: 1px solid #ccc;
    }
    .tab {
      padding: 12px 24px;
      background-color: #5da8d4;
      color: white;
      border: none;
      border-right: 1px solid #4a90b8;
      font-size: 14px;
      font-weight: 500;
      cursor: default;
    }
    .tab:first-child {
      background-color: #c8c8c8;
      color: #555;
    }
    .tab.active {
      background-color: #5da8d4;
      color: white;
    }
    .tab-send-email {
      background-color: #6db3d9;
      margin-left: auto;
    }
    
    /* Header Section */
    .email-header {
      background-color: #1e3a5f;
      color: white;
      padding: 20px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .email-header .logo {
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
    .email-header .title {
      text-align: right;
      flex: 1;
    }
    .email-header .title h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
    .email-header .title .project-code {
      margin: 4px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    
    /* Section Headers */
    .section-header {
      background-color: #5da8d4;
      color: white;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
    
    /* Data Table */
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table tr {
      border-bottom: 1px solid #e0e0e0;
    }
    .data-table tr:last-child {
      border-bottom: none;
    }
    .data-table td {
      padding: 12px 20px;
      font-size: 14px;
    }
    .data-table td:first-child {
      background-color: #e8e8e8;
      color: #555;
      font-weight: 500;
      width: 35%;
      border-right: 1px solid #d0d0d0;
    }
    .data-table td:last-child {
      background-color: #f5f5f5;
      color: #333;
    }
    .data-table tr:nth-child(even) td:first-child {
      background-color: #f0f0f0;
    }
    .data-table tr:nth-child(even) td:last-child {
      background-color: white;
    }
    
    /* List Table */
    .list-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .list-table thead {
      background-color: #e8e8e8;
    }
    .list-table th {
      padding: 10px 15px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #555;
      border-bottom: 2px solid #d0d0d0;
    }
    .list-table td {
      padding: 10px 15px;
      font-size: 13px;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
      background-color: white;
    }
    .list-table tr:nth-child(even) td {
      background-color: #f9f9f9;
    }
    
    /* Section Spacing */
    .section {
      margin-bottom: 30px;
    }
    
    @media (max-width: 600px) {
      .tab-navigation {
        flex-wrap: wrap;
      }
      .tab {
        flex: 1;
        min-width: 80px;
      }
      .email-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      .email-header .title {
        text-align: left;
      }
      .data-table td {
        display: block;
        width: 100% !important;
      }
      .data-table td:first-child {
        border-right: none;
        border-bottom: 1px solid #d0d0d0;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <div class="tab">Account</div>
      <div class="tab">Support</div>
      <div class="tab active">Project</div>
      <div class="tab tab-send-email">Send Email</div>
    </div>

    <!-- Header -->
    <div class="email-header">
      <div class="logo">YOUR LOGO</div>
      <div class="title">
        <h1>${project.projectName}</h1>
        <p class="project-code">(${project.projectId || project.projectCode})</p>
      </div>
    </div>

    <!-- Project Overview Section -->
    <div class="section">
      <h2 class="section-header">Project Details</h2>
      <table class="data-table">
        <tr>
          <td>Project Code</td>
          <td>${project.projectId || project.projectCode}</td>
        </tr>
        <tr>
          <td>CRM Code</td>
          <td>${project.crmCode || project.crmId || 'N/A'}</td>
        </tr>
        <tr>
          <td>Project Name</td>
          <td>${project.projectName}</td>
        </tr>
        <tr>
          <td>Subject</td>
          <td>${project.subject}</td>
        </tr>
        <tr>
          <td>Client Name</td>
          <td>${project.clientName}</td>
        </tr>
        <tr>
          <td>Project Type</td>
          <td>${project.projectType || 'N/A'}</td>
        </tr>
        ${project.businessType ? `
        <tr>
          <td>Business Type</td>
          <td>${project.businessType}</td>
        </tr>
        ` : ''}
        ${project.domain ? `
        <tr>
          <td>Domain</td>
          <td>${project.domain}</td>
        </tr>
        ` : ''}
        ${project.industry ? `
        <tr>
          <td>Industry</td>
          <td>${project.industry}</td>
        </tr>
        ` : ''}
        <tr>
          <td>Start Date</td>
          <td>${project.startDate}</td>
        </tr>
        <tr>
          <td>End Date</td>
          <td>${project.expectedEndDate || project.endDate}</td>
        </tr>
        ${project.confirmedDate ? `
        <tr>
          <td>Confirmed Date</td>
          <td>${project.confirmedDate}</td>
        </tr>
        ` : ''}
        <tr>
          <td>Project Status</td>
          <td>${project.projectStatus || project.status}</td>
        </tr>
        ${project.clientType ? `
        <tr>
          <td>Client Type</td>
          <td>${project.clientType}</td>
        </tr>
        ` : ''}
        ${project.salesExecutive ? `
        <tr>
          <td>Sales Executive</td>
          <td>${project.salesExecutive}</td>
        </tr>
        ` : ''}
        ${project.techBA ? `
        <tr>
          <td>Tech SA</td>
          <td>${project.techBA}</td>
        </tr>
        ` : ''}
        ${project.projectManager ? `
        <tr>
          <td>Project Manager</td>
          <td>${project.projectManager}</td>
        </tr>
        ` : ''}
        ${project.deliveryManager ? `
        <tr>
          <td>Delivery Manager</td>
          <td>${project.deliveryManager}</td>
        </tr>
        ` : ''}
        ${project.technologyPlatform ? `
        <tr>
          <td>Technology Platform</td>
          <td>${project.technologyPlatform}</td>
        </tr>
        ` : ''}
        ${project.commercialValue || project.budget ? `
        <tr>
          <td>Commercial Value</td>
          <td>$${(project.commercialValue || project.budget).toLocaleString()}</td>
        </tr>
        ` : ''}
        ${project.overallProgress !== undefined ? `
        <tr>
          <td>Overall Progress</td>
          <td>${project.overallProgress}%</td>
        </tr>
        ` : ''}
        ${project.riskIndicator ? `
        <tr>
          <td>Risk Indicator</td>
          <td>${project.riskIndicator}</td>
        </tr>
        ` : ''}
        ${project.priorityLevel ? `
        <tr>
          <td>Priority Level</td>
          <td>${project.priorityLevel}</td>
        </tr>
        ` : ''}
        ${project.createdDate ? `
        <tr>
          <td>Created Date</td>
          <td>${project.createdDate}</td>
        </tr>
        ` : ''}
        ${project.modifiedDate ? `
        <tr>
          <td>Modified Date</td>
          <td>${project.modifiedDate}</td>
        </tr>
        ` : ''}
        ${project.linkedLeadId ? `
        <tr>
          <td>Linked Lead ID</td>
          <td>${project.linkedLeadId}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${preSalesTeam && preSalesTeam.length > 0 ? `
    <!-- Pre-Sales Team Section -->
    <div class="section">
      <h2 class="section-header">Pre-Sales Team</h2>
      <table class="list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${preSalesTeam.map(member => `
          <tr>
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${postSalesTeam && postSalesTeam.length > 0 ? `
    <!-- Post-Sales Team Section -->
    <div class="section">
      <h2 class="section-header">Post-Sales Team</h2>
      <table class="list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${postSalesTeam.map(member => `
          <tr>
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.department || 'N/A'}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${clientTeamInfo ? `
    <!-- Client Team Section -->
    <div class="section">
      <h2 class="section-header">Client Team</h2>
      <table class="data-table">
        <tr>
          <td>Company Name</td>
          <td>${clientTeamInfo.companyName}</td>
        </tr>
        <tr>
          <td>Company Type</td>
          <td>${clientTeamInfo.companyType}</td>
        </tr>
      </table>
      ${clientTeamInfo.contacts && clientTeamInfo.contacts.length > 0 ? `
      <table class="list-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th>Contact Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          ${clientTeamInfo.contacts.map(contact => `
          <tr>
            <td>${contact.name}</td>
            <td>${contact.role}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.location}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
      ` : ''}
    </div>
    ` : ''}

    ${technologyStack ? `
    <!-- Technology Details Section -->
    <div class="section">
      <h2 class="section-header">Technology Details</h2>
      <table class="data-table">
        <tr>
          <td>Platform</td>
          <td>${technologyStack.platform}</td>
        </tr>
        <tr>
          <td>Backend Framework</td>
          <td>${technologyStack.backendFramework}</td>
        </tr>
        <tr>
          <td>Frontend Framework</td>
          <td>${technologyStack.frontendFramework}</td>
        </tr>
        ${technologyStack.mobileApps ? `
        <tr>
          <td>Mobile Apps</td>
          <td>${technologyStack.mobileApps}</td>
        </tr>
        ` : ''}
        ${technologyStack.mobilePlatform ? `
        <tr>
          <td>Mobile Platform</td>
          <td>${technologyStack.mobilePlatform}</td>
        </tr>
        ` : ''}
        ${technologyStack.trendingTech ? `
        <tr>
          <td>Trending Technology</td>
          <td>${technologyStack.trendingTech}</td>
        </tr>
        ` : ''}
        ${technologyStack.aiUsage ? `
        <tr>
          <td>AI Usage</td>
          <td>${technologyStack.aiUsage ? 'Yes' : 'No'}</td>
        </tr>
        ` : ''}
        ${technologyStack.aiUsageDetails ? `
        <tr>
          <td>AI Usage Details</td>
          <td>${technologyStack.aiUsageDetails}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    ` : ''}

    ${scheduleEfforts ? `
    <!-- Project Schedule & Efforts Section -->
    <div class="section">
      <h2 class="section-header">Project Schedule & Efforts</h2>
      <table class="data-table">
        <tr>
          <td>Start Date</td>
          <td>${scheduleEfforts.startDate}</td>
        </tr>
        <tr>
          <td>End Date</td>
          <td>${scheduleEfforts.endDate}</td>
        </tr>
        ${scheduleEfforts.projectPDs ? `
        <tr>
          <td>Project PDs</td>
          <td>${scheduleEfforts.projectPDs}</td>
        </tr>
        ` : ''}
        ${scheduleEfforts.scheduleWeeks ? `
        <tr>
          <td>Schedule Weeks</td>
          <td>${scheduleEfforts.scheduleWeeks}</td>
        </tr>
        ` : ''}
        ${scheduleEfforts.uatWeeks ? `
        <tr>
          <td>UAT Weeks</td>
          <td>${scheduleEfforts.uatWeeks}</td>
        </tr>
        ` : ''}
        ${scheduleEfforts.postDeliverySupport ? `
        <tr>
          <td>Post Delivery Support</td>
          <td>${scheduleEfforts.postDeliverySupport}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    ` : ''}

    ${commercialDetails ? `
    <!-- Commercial Details Section -->
    <div class="section">
      <h2 class="section-header">Commercial Details</h2>
      <table class="data-table">
        ${commercialDetails.costingUSD ? `
        <tr>
          <td>Costing (USD)</td>
          <td>$${commercialDetails.costingUSD.toLocaleString()}</td>
        </tr>
        ` : ''}
        ${commercialDetails.currency ? `
        <tr>
          <td>Currency</td>
          <td>${commercialDetails.currency}</td>
        </tr>
        ` : ''}
        ${commercialDetails.costLocal ? `
        <tr>
          <td>Cost (Local)</td>
          <td>${commercialDetails.costLocal.toLocaleString()}</td>
        </tr>
        ` : ''}
        ${commercialDetails.exchangeRate ? `
        <tr>
          <td>Exchange Rate</td>
          <td>${commercialDetails.exchangeRate}</td>
        </tr>
        ` : ''}
        ${commercialDetails.paymentTerms ? `
        <tr>
          <td>Payment Terms</td>
          <td>${commercialDetails.paymentTerms}</td>
        </tr>
        ` : ''}
        ${commercialDetails.upfrontAmount ? `
        <tr>
          <td>Upfront Amount</td>
          <td>$${commercialDetails.upfrontAmount.toLocaleString()}</td>
        </tr>
        ` : ''}
        ${commercialDetails.upfrontStatus ? `
        <tr>
          <td>Upfront Status</td>
          <td>${commercialDetails.upfrontStatus}</td>
        </tr>
        ` : ''}
        ${commercialDetails.paymentMode ? `
        <tr>
          <td>Payment Mode</td>
          <td>${commercialDetails.paymentMode}</td>
        </tr>
        ` : ''}
        ${commercialDetails.subPaymentMode ? `
        <tr>
          <td>Sub Payment Mode</td>
          <td>${commercialDetails.subPaymentMode}</td>
        </tr>
        ` : ''}
        ${commercialDetails.transactionAmountCharged !== undefined ? `
        <tr>
          <td>Transaction Amount Charged</td>
          <td>${commercialDetails.transactionAmountCharged ? 'Yes' : 'No'}</td>
        </tr>
        ` : ''}
        ${commercialDetails.transactionCost ? `
        <tr>
          <td>Transaction Cost</td>
          <td>$${commercialDetails.transactionCost.toLocaleString()}</td>
        </tr>
        ` : ''}
        ${commercialDetails.supportIncluded !== undefined ? `
        <tr>
          <td>Support Included</td>
          <td>${commercialDetails.supportIncluded ? 'Yes' : 'No'}</td>
        </tr>
        ` : ''}
        ${commercialDetails.supportType ? `
        <tr>
          <td>Support Type</td>
          <td>${commercialDetails.supportType}</td>
        </tr>
        ` : ''}
        ${commercialDetails.supportValidity ? `
        <tr>
          <td>Support Validity</td>
          <td>${commercialDetails.supportValidity}</td>
        </tr>
        ` : ''}
        ${commercialDetails.supportAmount ? `
        <tr>
          <td>Support Amount</td>
          <td>$${commercialDetails.supportAmount.toLocaleString()}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    ` : ''}

    ${agreements ? `
    <!-- Agreements & Invoice Section -->
    <div class="section">
      <h2 class="section-header">Agreements & Invoice</h2>
      <table class="list-table">
        <thead>
          <tr>
            <th>Agreement</th>
            <th>Status</th>
            <th>File Name</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(agreements).map(([key, value]: [string, any]) => `
          <tr>
            <td>${value.name}</td>
            <td>${value.status ? 'Completed' : 'Pending'}</td>
            <td>${value.fileName || 'N/A'}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${milestones && milestones.length > 0 ? `
    <!-- Milestone Listing Section -->
    <div class="section">
      <h2 class="section-header">Milestone Listing</h2>
      <table class="list-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Percentage</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Deliverables</th>
          </tr>
        </thead>
        <tbody>
          ${milestones.map(milestone => `
          <tr>
            <td>${milestone.code}</td>
            <td>${milestone.name}</td>
            <td>${milestone.percentage}%</td>
            <td>${milestone.dueDate}</td>
            <td>$${milestone.amount.toLocaleString()}</td>
            <td>${milestone.deliverables}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${resources && resources.length > 0 ? `
    <!-- Resource Allocation Section -->
    <div class="section">
      <h2 class="section-header">Resource Allocation</h2>
      <table class="list-table">
        <thead>
          <tr>
            <th>Resource Type</th>
            <th>Skill</th>
            <th>Hire Type</th>
            <th>Hire Cycle</th>
            <th>Hours/Cycle</th>
            <th>Hourly Rate</th>
            <th>Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          ${resources.map(resource => `
          <tr>
            <td>${resource.resourceType}</td>
            <td>${resource.resourceSkill}</td>
            <td>${resource.hireType}</td>
            <td>${resource.hireCycle}</td>
            <td>${resource.hoursPerCycle}</td>
            <td>$${resource.hourlyRate}</td>
            <td>$${resource.resourceAmount.toLocaleString()}</td>
            <td>${resource.hireStartDate}</td>
            <td>${resource.hireEndDate}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${attachments && attachments.length > 0 ? `
    <!-- Attachments Section -->
    <div class="section">
      <h2 class="section-header">Attachments</h2>
      <table class="list-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Category</th>
            <th>Upload Date</th>
            <th>Description</th>
            <th>Confidential</th>
          </tr>
        </thead>
        <tbody>
          ${attachments.map(attachment => `
          <tr>
            <td>${attachment.fileName}</td>
            <td>${attachment.category}</td>
            <td>${attachment.uploadDate}</td>
            <td>${attachment.description}</td>
            <td>${attachment.isConfidential ? 'Yes' : 'No'}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${salesNotes ? `
    <!-- Sales Notes Section -->
    <div class="section">
      <h2 class="section-header">Sales Notes</h2>
      <table class="data-table">
        ${salesNotes.clientsBrief ? `
        <tr>
          <td>Client's Brief</td>
          <td>${salesNotes.clientsBrief}</td>
        </tr>
        ` : ''}
        ${salesNotes.projectBackAndForth ? `
        <tr>
          <td>Project Back & Forth</td>
          <td>${salesNotes.projectBackAndForth}</td>
        </tr>
        ` : ''}
        ${salesNotes.clientComments ? `
        <tr>
          <td>Client Comments</td>
          <td>${salesNotes.clientComments}</td>
        </tr>
        ` : ''}
        ${salesNotes.salesComments ? `
        <tr>
          <td>Sales Comments</td>
          <td>${salesNotes.salesComments}</td>
        </tr>
        ` : ''}
        ${salesNotes.preSalesTech1Comments ? `
        <tr>
          <td>Pre-Sales Tech1 Comments</td>
          <td>${salesNotes.preSalesTech1Comments}</td>
        </tr>
        ` : ''}
        ${salesNotes.assumptions ? `
        <tr>
          <td>Assumptions</td>
          <td>${salesNotes.assumptions}</td>
        </tr>
        ` : ''}
        ${salesNotes.futureBusiness ? `
        <tr>
          <td>Future Business</td>
          <td>${salesNotes.futureBusiness}</td>
        </tr>
        ` : ''}
        ${salesNotes.crtAccountsComments ? `
        <tr>
          <td>CRT Accounts Comments</td>
          <td>${salesNotes.crtAccountsComments}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    ` : ''}
  </div>
</body>
</html>
    `.trim();
  };

  const handleCopyHTML = () => {
    const html = generateEmailHTML();
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(html)
        .then(() => {
          toast.success('Email HTML copied to clipboard!');
        })
        .catch(() => {
          // Fallback to legacy method
          fallbackCopyToClipboard(html);
        });
    } else {
      // Use fallback method
      fallbackCopyToClipboard(html);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('Email HTML copied to clipboard!');
      } else {
        toast.error('Failed to copy. Please try downloading instead.');
      }
    } catch (err) {
      toast.error('Failed to copy. Please try downloading instead.');
    }
    
    document.body.removeChild(textArea);
  };

  const handleDownloadHTML = () => {
    const html = generateEmailHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.projectId}_email.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Email HTML downloaded!');
  };

  const handleSendEmail = () => {
    const subject = `Project Details: ${project.projectName}`;
    const body = generateEmailHTML();
    
    // Create mailto link with HTML body (note: most email clients will open their own editor)
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Please see the attached HTML file for formatted project details.')}`;
    
    window.location.href = mailtoLink;
    toast.success('Opening email client...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Email Preview
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {project.projectName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHTML}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2"
              title="Copy HTML"
            >
              <Copy className="w-4 h-4" />
              Copy HTML
            </button>
            <button
              onClick={handleDownloadHTML}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2"
              title="Download HTML"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleSendEmail}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
              title="Send Email"
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Preview Content - Scrollable */}
        <div className="flex-1 overflow-auto p-6 bg-neutral-50 dark:bg-neutral-950">
          <div 
            className="bg-white rounded-lg shadow-sm"
            dangerouslySetInnerHTML={{ __html: generateEmailHTML() }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Preview of formatted email content
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}