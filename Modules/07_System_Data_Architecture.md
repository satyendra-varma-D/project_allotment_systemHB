# ROCKEYE – Design Prototype Document
## Module 07: System Data Architecture

---

## 1. Module Information

| Field | Value |
|-------|--------|
| Module Name | System Data Architecture |
| System Layer | Core Architecture |
| Applies To | Entire Platform |
| Primary Stakeholders | Technical Architect, Admin |
| Status | In Scope |

---

## 2. Module Purpose

The System Data Architecture defines the structural relationships between all modules in the ROCKEYE platform.

It ensures:

- Logical data flow
- Referential integrity
- Modular separation
- Scalability
- Extensibility for future enhancements

This architecture connects Sales, Delivery, Resource Planning, Commercials, and Governance into a unified lifecycle.

---

## 3. High-Level Entity Relationship Flow

Lead  
→ Project Intake  
→ Resource Requirement  
→ Resource Allocation  
→ Project  
→ Milestones  
→ Commercials  
→ Submodules (CR / Support / Infra / Hire Cycles)

Masters influence:

Milestone Master → Project Milestones  
Payment Terms Master → Project Commercial Structure  

---

## 4. Core Entities Overview

---

### 4.1 Lead

Represents a sales opportunity.

Primary Key:
- Lead_ID

Relationships:
- One Lead → One Project Intake
- One Lead → One Project (after approval)

---

### 4.2 Project Intake

Governance layer between Sales and Execution.

Primary Key:
- Intake_ID

Relationships:
- Intake linked to Lead
- Intake has many Resource Requirements
- Intake has many Resource Allocations
- Approved Intake creates Project

---

### 4.3 Project

Represents an active execution entity.

Primary Key:
- Project_ID

Relationships:
- Linked to Lead
- Linked to Intake
- Has many Milestones
- Has one Commercial Structure
- Has many Submodule Records

---

### 4.4 Resource

Represents human resource entity (future master).

Primary Key:
- Resource_ID

Relationships:
- Linked to Resource Allocation
- Linked to Hire Renewal Cycle
- Linked to Utilization Dashboard

---

### 4.5 Milestone

Execution checkpoint entity.

Primary Key:
- Milestone_ID

Relationships:
- Linked to Project
- Mapped from Milestone Master
- Linked to Payment Terms Detail

---

### 4.6 Commercial Structure

Tracks financial details.

Primary Key:
- Commercial_ID

Relationships:
- Linked to Project
- References Payment Terms Master
- Linked to Invoice Records

---

### 4.7 Change Request (CR)

Represents scope modifications.

Primary Key:
- CR_ID

Relationships:
- Linked to Project
- May generate additional Milestones
- Impacts Commercial Structure

---

### 4.8 Support Contract

Represents post-delivery lifecycle extension.

Primary Key:
- Support_ID

Relationships:
- Linked to Project
- Linked to Invoice Tracking

---

### 4.9 Infrastructure Service

Represents cloud or infra allocation.

Primary Key:
- Infra_ID

Relationships:
- Linked to Project
- Linked to Billing Records

---

## 5. Data Relationship Diagram (Logical Representation)

Lead (1)  
│  
├── (1) Project Intake  
│      ├── (Many) Resource Requirements  
│      ├── (Many) Resource Allocations  
│      └── (1) Approved → Project  
│  
Project (1)  
├── (Many) Milestones  
├── (1) Commercial Structure  
├── (Many) Change Requests  
├── (Many) Support Contracts  
├── (Many) Infrastructure Services  
└── (Many) Resource Engagements  

Masters  
├── Milestone Master → Milestones  
└── Payment Terms Master → Commercial Structure  

---

## 6. Referential Integrity Rules

1. Project cannot exist without approved Intake.
2. Intake cannot exist without Closed-Won Lead.
3. Milestones must reference valid Milestone Master.
4. Payment structure must reference valid Payment Terms Master.
5. CR cannot exist without Project.
6. Resource Allocation cannot exceed capacity threshold.

---

## 7. Data Flow Lifecycle

Sales Phase:
Lead → Closed-Won  

Governance Phase:
Closed-Won → Intake → Allocation → Approval  

Execution Phase:
Project → Milestones → Payments → CR → Completion  

Post-Delivery:
Support → Infra → Renewals  

---

## 8. Scalability Considerations

- Modular entity separation
- Normalized database schema
- Master-driven configuration
- Extendable Resource Master integration
- Horizontal scaling readiness
- Microservice compatibility (Future Phase)

---

## 9. Multi-Tenancy Readiness (Optional Future Design)

- Tenant_ID column in all core tables
- Data partitioning per organization
- Role scope limitation per tenant
- Shared master configuration (optional)

---

## 10. Audit Architecture

Each entity must support:

- Created_By
- Created_Date
- Modified_By
- Modified_Date
- Status
- Audit_Log_ID (optional)

Approval-based entities must also track:

- Approved_By
- Approved_Date
- Approval_Status
- Approval_Remarks

---

## 11. Performance Considerations

- Indexed foreign keys
- Optimized dashboard aggregation queries
- Cached master lookups
- Efficient join strategy
- Archival strategy for closed projects

---

## 12. Future Data Enhancements

- Resource Skill Matrix Table
- Utilization Heatmap Table
- Forecasting Model Storage
- AI Recommendation Logging
- Historical Performance Benchmarking

---

## 13. Architecture Summary

The ROCKEYE Data Architecture ensures:

- Clear lifecycle flow
- Controlled governance checkpoints
- Modular scalability
- Referential integrity
- Enterprise-grade extensibility

It connects Sales → Governance → Execution → Commercials → Post-Delivery into one structured, data-driven platform.