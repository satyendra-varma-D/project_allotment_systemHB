# ROCKEYE – Design Prototype Document
## Module 01: Leads Module (CRM Layer)

---

## 1. Module Information

| Field | Value |
|-------|--------|
| Module Name | Leads Management |
| System Layer | CRM / Pre-Sales |
| Primary Users | Sales User, Sales Manager |
| Trigger Event | Lead Creation |
| Exit Trigger | Closed-Won → Project Intake Creation |
| Status | In Scope |

---

## 2. Module Purpose

The Leads Module acts as the Sales Control Layer of the ROCKEYE platform.

It manages the complete lifecycle of an opportunity from initial inquiry to deal closure. Upon marking a lead as **Closed-Won**, the system triggers the Project Intake process for delivery governance.

---

## 3. Business Objectives

- Centralized lead repository
- Structured sales lifecycle tracking
- Requirement capture and documentation management
- Activity logging and communication history
- Controlled stage transition workflow
- Trigger Project Intake upon Closed-Won

---

## 4. High-Level Workflow

New Lead  
→ Qualified  
→ Proposal Shared  
→ Negotiation  
→ Closed-Won (Triggers Project Intake)  
→ Project Allotment Review  
→ Project Activation  

OR  

→ Closed-Lost (Archived)

---

## 5. Functional Components

---

### 5.1 Lead Listing Dashboard

**Purpose:** Provide an overview of all leads with filtering and action controls.

#### Display Fields

- Lead ID (Auto-generated)
- Client Name
- Contact Person
- Sales Owner
- Lead Source
- Industry
- Opportunity Value
- Expected Closure Date
- Current Stage
- Status (Open / Closed-Won / Closed-Lost)

#### Filters

- Stage
- Owner
- Date Range
- Industry
- Status
- Opportunity Value Range

#### Actions

- View Lead
- Edit Lead
- Change Stage
- Mark Closed-Won
- Mark Closed-Lost
- Convert to Project (Enabled only when Closed-Won)

---

### 5.2 Lead Detailed View (Tabbed Layout)

---

#### Tab 1: Basic Information

- Client Organization Name
- Contact Person
- Email
- Phone
- Industry
- Location
- Lead Source
- Lead Owner
- Estimated Opportunity Value
- Expected Closure Date

---

#### Tab 2: Requirement Details

- Project Type (Web / Mobile / Total)
- Functional Requirements (Rich Text)
- Technical Requirements
- Estimated Timeline
- Estimated Budget
- Competitor Information

---

#### Tab 3: Activity & Communication Log

- Meeting Records
- Call Notes
- Email Notes
- Follow-up Date
- Assigned Owner
- Task Status (Pending / Completed)

Each activity must store:
- Activity Type
- Description
- Date & Time
- Created By

---

#### Tab 4: Documents

- Proposal Upload
- NDA Upload
- Requirement Documents
- Supporting Attachments
- Version Control
- Upload Date
- Uploaded By

---

#### Tab 5: Qualification & Scoring

- Budget Confirmed (Yes/No)
- Decision Maker Identified (Yes/No)
- Timeline Confirmed (Yes/No)
- Competition Identified
- Lead Score (System Calculated)
- Risk Indicator (Low / Medium / High)

---

## 6. System Rules & Validations

1. Lead ID must be auto-generated.
2. Mandatory fields before stage change to Proposal:
   - Client Name
   - Opportunity Value
   - Project Type
3. Closed-Won requires:
   - Final Opportunity Value
   - Expected Timeline
   - Proposal Document Uploaded
4. Convert to Project button activates only when Stage = Closed-Won.
5. After conversion to Project Intake:
   - Lead becomes read-only (except notes & activities).

---

## 7. Data Model (High-Level)

### Entity: Lead

- Lead_ID (PK)
- Client_Name
- Contact_Name
- Contact_Email
- Contact_Phone
- Industry
- Location
- Lead_Source
- Owner_ID (FK)
- Opportunity_Value
- Expected_Closure_Date
- Stage
- Status
- Created_Date
- Modified_Date

---

### Entity: Lead_Activity

- Activity_ID (PK)
- Lead_ID (FK)
- Activity_Type
- Notes
- Activity_Date
- Owner_ID
- Status

---

### Entity: Lead_Document

- Document_ID (PK)
- Lead_ID (FK)
- File_Name
- File_Path
- Version_Number
- Upload_Date
- Uploaded_By

---

## 8. Role-Based Access Control

| Role | Permissions |
|------|------------|
| Sales User | Create, Edit, View own leads |
| Sales Manager | View all leads, Change Stage |
| Delivery Manager | View Closed-Won leads |
| Finance User | View Closed-Won financial data |
| Admin | Full access |

---

## 9. Integration Points

- Triggers Project Intake Module
- Feeds Project Allotment System
- Connects to Client Master (Future Phase)
- Feeds Commercial Module

---

## 10. Audit & Compliance

- Stage change log tracking
- Activity history audit
- Document version tracking
- User action logging

---

## 11. Non-Functional Requirements

- Role-based access control
- Scalable filtering for large datasets
- Secure document storage
- Attachment size restrictions
- Modular UI with tab navigation
- High availability & performance optimized listing

---

## 12. Future Enhancements

- AI-based lead scoring
- Predictive deal closure probability
- Automated follow-up reminders
- CRM analytics dashboard
- Email integration (auto-log emails)

---

## 13. Module Summary

The Leads Module forms the foundation of the ROCKEYE delivery lifecycle.

It ensures structured sales governance and acts as the mandatory control gateway before project execution and resource allotment begin.

Closed-Won status directly activates the Project Intake and Allotment workflow, ensuring controlled delivery transition.