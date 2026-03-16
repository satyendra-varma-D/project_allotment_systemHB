# ROCKEYE – Design Prototype Document
## Module 03: Project Submodules

---

## 1. Module Overview

| Field | Value |
|-------|--------|
| Module Name | Project Submodules |
| System Layer | Delivery Extensions |
| Parent Module | Project Module |
| Primary Users | Project Manager, Delivery Manager, Finance User |
| Status | In Scope |

---

## 2. Module Purpose

Project Submodules extend the lifecycle of a project beyond standard milestone execution.

They support:

- Financial tracking at granular levels
- Contract-based billing cycles
- Maintenance & support management
- Change Requests (CR)
- Infrastructure & Cloud services tracking

These submodules ensure long-term governance and lifecycle management.

---

# 3. Submodule 1: Project Milestones

---

## 3.1 Purpose

Track milestone-level delivery and payment execution.

---

## 3.2 Functional Scope

- Milestone Name
- Milestone Code (from Master)
- Planned Completion Date
- Actual Completion Date
- Linked Payment %
- Invoice Status
- Approval Status
- Completion Status
- Remarks

---

## 3.3 System Rules

- Auto-generated from Milestones Master
- Payment % must match Payment Terms Master mapping
- Invoice cannot be generated before milestone approval
- Milestone must be completed before marking as Paid

---

## 3.4 Data Model

Project_Milestone
- Milestone_ID (PK)
- Project_ID (FK)
- Milestone_Code
- Planned_Date
- Actual_Date
- Payment_Percentage
- Status
- Invoice_Status
- Approved_By

---

# 4. Submodule 2: Hire Renewal Cycles

---

## 4.1 Purpose

Track contractor or resource-based billing cycles for long-term engagements.

---

## 4.2 Functional Scope

- Resource Name
- Role
- Engagement Model
- Start Date
- End Date
- Monthly Rate
- Billing Cycle
- Invoice Status
- Payment Status
- Renewal Alert

---

## 4.3 System Rules

- Renewal alert triggered 15 days before contract end
- Cannot close project if active resource contract exists
- Monthly billing auto-calculated

---

## 4.4 Data Model

Resource_Engagement
- Engagement_ID (PK)
- Project_ID (FK)
- Resource_ID (FK)
- Start_Date
- End_Date
- Monthly_Rate
- Billing_Status
- Renewal_Status

---

# 5. Submodule 3: Support Package / AMC Management

---

## 5.1 Purpose

Manage post-delivery support contracts and Annual Maintenance Contracts (AMC).

---

## 5.2 Functional Scope

- Support Contract ID
- Support Type (AMC / On-demand)
- Start Date
- End Date
- Support Fee
- SLA Level
- Renewal Cycle
- Ticket Volume
- Payment Status

---

## 5.3 System Rules

- Support cannot start before project completion
- Renewal reminder before expiry
- SLA breach tracking

---

## 5.4 Data Model

Support_Contract
- Support_ID (PK)
- Project_ID (FK)
- Support_Type
- Start_Date
- End_Date
- Fee
- SLA_Level
- Renewal_Status

---

# 6. Submodule 4: Phases / Add-ons / Change Requests (CR)

---

## 6.1 Purpose

Track additional scope, change requests, and delivery extensions.

---

## 6.2 Functional Scope

- CR ID (Auto-generated)
- Description
- Type (Phase / Add-on / CR)
- Requested By
- Approval Status
- Estimated Effort
- Commercial Impact
- Revised Timeline
- Linked Milestones

---

## 6.3 System Rules

- CR must be approved before execution
- Commercial update required before activation
- CR generates additional milestones if needed

---

## 6.4 Data Model

Change_Request
- CR_ID (PK)
- Project_ID (FK)
- CR_Type
- Description
- Approval_Status
- Additional_Cost
- Revised_End_Date

---

# 7. Submodule 5: AWS Services / Infrastructure Tracking

---

## 7.1 Purpose

Track infrastructure provisioning, cloud services, and recurring infra costs.

---

## 7.2 Functional Scope

- Cloud Provider
- Account ID
- Service Type
- Monthly Cost
- Billing Cycle
- Usage Monitoring
- Cost Center Mapping
- Renewal Date

---

## 7.3 System Rules

- Monthly infra billing must map to finance module
- Cannot close infra contract with unpaid dues
- Cost alert threshold configurable

---

## 7.4 Data Model

Infrastructure_Service
- Infra_ID (PK)
- Project_ID (FK)
- Provider
- Service_Type
- Monthly_Cost
- Billing_Status
- Renewal_Date

---

# 8. Integration Overview

All submodules are linked to:

- Project Module
- Payment Terms Master
- Milestones Master
- Finance & Invoice Tracking
- Project Allotment System (for resource linkage)

---

# 9. Role-Based Access

| Role | Milestones | Hire Cycles | Support | CR | Infra |
|------|------------|------------|---------|----|-------|
| Project Manager | Edit | View | Edit | Create | View |
| Delivery Manager | Approve | Approve | Approve | Approve | Approve |
| Finance User | Invoice | Invoice | Invoice | Commercial Edit | Billing |
| Admin | Full | Full | Full | Full | Full |

---

# 10. Non-Functional Requirements

- Modular independent architecture
- Cross-project reporting capability
- Financial accuracy enforcement
- Renewal alerts & notifications
- Audit logs for all modifications

---

# 11. Future Enhancements

- Automated renewal billing
- Infra cost optimization analytics
- SLA performance dashboards
- Cross-project CR analytics
- Resource profitability tracking

---

# 12. Module Summary

The Project Submodules transform ROCKEYE from a simple execution tracker into a full lifecycle governance platform.

They ensure long-term control over:

- Delivery
- Commercials
- Resource contracts
- Maintenance
- Infrastructure

This structure supports scalable enterprise-grade project governance.