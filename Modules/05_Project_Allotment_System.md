# ROCKEYE – Design Prototype Document
## Module 05: Project Allotment System (Governance Layer)

---

## 1. Module Information

| Field | Value |
|-------|--------|
| Module Name | Project Allotment System |
| System Layer | Governance / Resource Planning |
| Trigger Source | Lead Module (Closed-Won) |
| Output | Approved Project Activation |
| Primary Users | Delivery Manager, Resource Manager, Admin |
| Status | New Scope |

---

## 2. Module Purpose

The Project Allotment System introduces a governance checkpoint between Sales closure and Project activation.

Its purpose is to ensure:

- Resource availability validation
- Skill alignment verification
- Capacity assessment
- Delivery feasibility confirmation
- Approval workflow enforcement

This module transforms ROCKEYE from a project registry into a delivery governance platform.

---

## 3. High-Level Workflow

Closed-Won Lead  
→ Project Intake Created  
→ Resource Requirement Defined  
→ Skill & Capacity Validation  
→ Allocation Recommendation  
→ Approval Workflow  
→ Project Activated  

OR  

→ Rejected / Rework Required

---

## 4. Functional Components

---

# 4.1 Project Intake Creation

---

## Purpose

Create a structured intake record once a Lead is marked Closed-Won.

---

## Intake Fields

- Intake ID (Auto-generated)
- Linked Lead ID
- Client Name
- Project Type (Web / Mobile / Total)
- Estimated Start Date
- Estimated End Date
- Estimated Effort
- Proposed Budget
- Sales Notes
- Priority Level
- Risk Indicator

---

## System Rules

1. Intake auto-creates when Lead = Closed-Won.
2. Intake status defaults to "Pending Review".
3. Cannot activate project without approved intake.
4. Intake becomes read-only after approval.

---

# 4.2 Resource Requirement Definition

---

## Purpose

Define required roles and skill sets before project activation.

---

## Fields

- Role Required (e.g., Backend Developer)
- Skill Set
- Experience Level (Junior / Mid / Senior)
- Required Count
- Allocation Type (Full-Time / Part-Time)
- Duration (Months)
- Billable / Non-Billable
- Estimated Cost Impact

---

## System Rules

- At least one role must be defined.
- Estimated effort must align with resource count.
- Skill mismatch warning generated if no matching resource exists (future enhancement).

---

# 4.3 Allocation Recommendation Engine

---

## Purpose

Suggest available resources based on:

- Skill match
- Current utilization %
- Project priority
- Domain expertise

---

## Allocation Dashboard

Displays:

- Resource Name
- Skill Match %
- Current Allocation %
- Available Capacity
- Ongoing Projects
- Recommendation Score

---

## System Rules

1. Resource over 90% utilization flagged.
2. Hard block if resource exceeds 100%.
3. Recommendation logic configurable.
4. Final allocation requires approval.

---

# 4.4 Skill & Capacity Validation

---

## Checks Performed

- Skill alignment verification
- Capacity validation
- Timeline feasibility
- Budget threshold validation
- Domain compatibility

---

## Validation Outcomes

- Approved
- Approved with Warning
- Rework Required
- Rejected

---

# 4.5 Approval Workflow

---

## Approval Levels

Level 1 – Delivery Manager  
Level 2 – Finance (if budget threshold exceeded)  
Level 3 – Admin (if special override required)

---

## Approval Status

- Pending
- Approved
- Rejected
- Sent Back for Revision

---

## System Rules

- Multi-level approval required if:
  - Budget exceeds defined limit
  - Resource capacity threshold breached
- Approval log must be stored.
- No project activation without final approval.

---

# 5. Allocation Dashboard

---

## Purpose

Provide real-time visibility of:

- Pending intakes
- Approved intakes
- Resource capacity heatmap
- Utilization percentage
- Allocation conflicts

---

## Dashboard Components

- Intake Status Summary
- Resource Utilization Chart
- Allocation Conflict Alerts
- Upcoming Project Start Alerts
- Capacity Forecast Snapshot

---

# 6. Data Model (High-Level)

---

### Entity: Project_Intake

- Intake_ID (PK)
- Lead_ID (FK)
- Estimated_Start_Date
- Estimated_End_Date
- Estimated_Effort
- Proposed_Budget
- Status
- Created_Date
- Approved_Date

---

### Entity: Resource_Requirement

- Requirement_ID (PK)
- Intake_ID (FK)
- Role
- Skill_Set
- Experience_Level
- Required_Count
- Allocation_Type
- Duration
- Estimated_Cost

---

### Entity: Resource_Allocation

- Allocation_ID (PK)
- Intake_ID (FK)
- Resource_ID (FK)
- Allocation_Percentage
- Start_Date
- End_Date
- Approval_Status

---

# 7. Role-Based Access Control

| Role | Intake | Resource Definition | Allocation | Approval |
|------|--------|--------------------|------------|----------|
| Sales User | View | No Access | No Access | No Access |
| Delivery Manager | Create/Edit | Edit | Recommend | Approve |
| Resource Manager | Edit | Edit | Assign | Recommend |
| Finance User | View | View | View | Approve (Budget Based) |
| Admin | Full Access | Full Access | Full Access | Override |

---

# 8. Governance Controls

- Approval audit trail
- Resource capacity enforcement
- Conflict detection
- Escalation notifications
- Mandatory validation before activation

---

# 9. Non-Functional Requirements

- Real-time utilization calculation
- Scalable allocation engine
- High-performance dashboard queries
- Modular approval configuration
- Role-based security enforcement

---

# 10. Future Enhancements

- AI-based allocation optimization
- Automated capacity forecasting
- Cross-project utilization analytics
- Skill gap analysis
- Integration with HRMS
- Predictive delivery risk scoring

---

# 11. Module Summary

The Project Allotment System introduces delivery governance between Sales and Execution.

It ensures:

- Right resource allocation
- Controlled project activation
- Capacity-aware decision making
- Multi-level approval enforcement

This module is the foundation for transforming ROCKEYE into a scalable, intelligence-driven delivery management platform.