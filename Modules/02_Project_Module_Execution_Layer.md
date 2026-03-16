# ROCKEYE – Design Prototype Document
## Module 02: Project Module (Execution Layer)

---

## 1. Module Information

| Field | Value |
|-------|--------|
| Module Name | Project Management |
| System Layer | Execution / Delivery |
| Primary Users | Delivery Manager, Project Manager, Finance User |
| Entry Trigger | Project Intake Approved |
| Exit Trigger | Project Closure |
| Status | In Scope |

---

## 2. Module Purpose

The Project Module serves as the central execution workspace of the ROCKEYE platform.

It manages delivery operations, team allocation visibility, commercial tracking, milestone progress, documentation, and overall project governance after approval from the Project Allotment System.

---

## 3. Business Objectives

- Structured project execution management
- Delivery tracking and milestone monitoring
- Commercial visibility and billing linkage
- Resource engagement overview
- Documentation and agreement control
- Integration with Masters configuration

---

## 4. High-Level Workflow

Project Intake Approved  
→ Project Activated  
→ Milestones Generated (From Master)  
→ Team Assigned  
→ Execution Tracking  
→ Payment & Invoice Monitoring  
→ Phase / CR Additions (If Any)  
→ Project Closure

---

## 5. Project Listing Dashboard

### Purpose
Provide visibility into all active, completed, and on-hold projects.

### Display Fields

- Project ID (Auto-generated)
- Project Name
- Client Name
- Project Type (Web / Mobile / Total)
- Project Manager
- Delivery Manager
- Start Date
- Expected End Date
- Project Status (Active / On Hold / Completed / Cancelled)
- Overall Progress %
- Commercial Value
- Payment Status Indicator

### Filters

- Project Status
- Project Manager
- Client
- Start Date Range
- Domain
- Payment Status

### Actions

- View Project
- Edit Project
- Change Status
- Add Phase / CR
- Close Project

---

## 6. Project Detailed View (Tabbed Layout)

---

### Tab 1: Project Overview

- Project Name
- Client Name
- Linked Lead ID
- Project Type
- Domain
- Start Date
- Planned End Date
- Current Status
- Overall Progress
- Risk Indicator
- Priority Level

---

### Tab 2: Pre-Sales Team

- Sales Owner
- Pre-Sales Consultant
- Solution Architect
- Proposal Reference
- Original Estimated Cost
- Sales Notes

---

### Tab 3: Post-Sales Team

- Delivery Manager
- Project Manager
- Technical Lead
- QA Lead
- Assigned Resources
- Engagement Model (Full-time / Part-time / Contract)

---

### Tab 4: Client Team

- Client SPOC
- Escalation Contact
- Finance Contact
- Technical Contact
- Communication Frequency
- Meeting Cadence

---

### Tab 5: Technology Details

- Technology Stack
- Backend Framework
- Frontend Framework
- Database
- Cloud Platform
- Infrastructure Details
- Third-Party Integrations

---

### Tab 6: Project Schedule & Efforts

- Estimated Effort (Hours / Man-days)
- Planned Sprint Cycles
- Delivery Phases
- Resource Allocation Overview
- Burn Rate Tracking
- Planned vs Actual Effort

---

### Tab 7: Commercial Details

- Total Project Value
- Payment Structure (Linked to Payment Terms Master)
- Milestone-Based Payment Mapping
- Invoiced Amount
- Paid Amount
- Outstanding Amount
- Currency
- Tax Structure

---

### Tab 8: Agreements & Documentation

- Master Service Agreement (MSA)
- NDA
- SOW Document
- Change Requests
- Contract Addendums
- Document Version Tracking

---

### Tab 9: Milestone Tracking

- Milestone Name
- Planned Completion Date
- Actual Completion Date
- Status
- Linked Payment %
- Invoice Status
- Approval Status

Milestones auto-generate from Milestones Master.

---

### Tab 10: Attachments & Sales Notes

- Internal Notes
- Client Communication Logs
- File Uploads
- Historical Changes

---

## 7. System Rules & Validations

1. Project ID auto-generated.
2. Project cannot be activated without approved Intake.
3. Milestones must be generated from Milestone Master template.
4. Payment structure must map to Payment Terms Master.
5. Project closure requires:
   - All milestones marked complete
   - No pending invoices
   - Final approval from Delivery Manager

---

## 8. Data Model (High-Level)

### Entity: Project

- Project_ID (PK)
- Intake_ID (FK)
- Lead_ID (FK)
- Client_ID (FK)
- Project_Manager_ID
- Delivery_Manager_ID
- Start_Date
- End_Date
- Status
- Total_Value
- Currency
- Created_Date
- Modified_Date

---

### Entity: Project_Milestone

- Milestone_ID (PK)
- Project_ID (FK)
- Milestone_Name
- Planned_Date
- Actual_Date
- Payment_Percentage
- Status
- Invoice_Status

---

### Entity: Project_Commercial

- Commercial_ID (PK)
- Project_ID (FK)
- Total_Value
- Paid_Amount
- Outstanding_Amount
- Payment_Terms_ID (FK)

---

## 9. Role-Based Access Control

| Role | Permissions |
|------|------------|
| Delivery Manager | Full project control |
| Project Manager | Edit execution details |
| Finance User | Edit commercial & payment data |
| Sales User | View project |
| Admin | Full access |

---

## 10. Integration Points

- Linked from Closed-Won Lead
- Dependent on Milestones Master
- Dependent on Payment Terms Master
- Integrated with Project Submodules
- Integrated with Project Allotment System

---

## 11. Audit & Governance

- Status change tracking
- Milestone completion logs
- Payment modification logs
- Document version control
- Role-based change logs

---

## 12. Non-Functional Requirements

- Scalable architecture
- Modular tab-based UI
- Secure financial data handling
- Role-based access enforcement
- High performance dashboard queries
- Data export capability (Excel / CSV)

---

## 13. Future Enhancements

- Real-time delivery dashboard
- Utilization analytics
- Predictive delay alerts
- Automated invoice generation
- Integrated resource capacity tracking

---

## 14. Module Summary

The Project Module is the operational backbone of ROCKEYE.

It connects sales closure to structured delivery execution while maintaining commercial governance, milestone tracking, and lifecycle visibility.

It transforms approved intake records into controlled, trackable, and financially governed projects.