# ROCKEYE – Design Prototype Document
## Module 06: User Roles & Access Control

---

## 1. Module Information

| Field | Value |
|-------|--------|
| Module Name | User Roles & Access Control |
| System Layer | Security & Governance |
| Applies To | All Modules |
| Primary Users | Admin |
| Status | In Scope |

---

## 2. Module Purpose

The User Roles & Access Control module ensures secure and structured access across the ROCKEYE platform.

It enforces:

- Role-based access control (RBAC)
- Module-level permissions
- Action-level restrictions
- Approval hierarchy control
- Audit traceability

This module is mandatory for governance and enterprise scalability.

---

## 3. Role Architecture Overview

ROCKEYE follows a Role-Based Access Control (RBAC) model.

### Core Roles

1. Sales User  
2. Sales Manager  
3. Delivery Manager  
4. Project Manager  
5. Resource Manager  
6. Finance User  
7. System Administrator  

---

## 4. Role Definitions

---

### 4.1 Sales User

**Responsibilities:**
- Manage leads
- Update activities
- Close deals

**Permissions:**
- Create/Edit own leads
- Upload documents
- View own leads
- Mark Closed-Won
- View linked project (Read-only)

---

### 4.2 Sales Manager

**Responsibilities:**
- Sales oversight
- Deal governance

**Permissions:**
- View all leads
- Change stage
- Override lead status
- Access sales reports

---

### 4.3 Delivery Manager

**Responsibilities:**
- Intake review
- Resource feasibility validation
- Project governance

**Permissions:**
- Approve intake
- Edit project details
- Approve milestones
- Approve change requests
- Close project

---

### 4.4 Project Manager

**Responsibilities:**
- Project execution
- Milestone tracking
- CR creation

**Permissions:**
- Update project schedule
- Manage milestones
- Create CR
- Update support contracts
- View commercial summary

---

### 4.5 Resource Manager

**Responsibilities:**
- Resource allocation
- Capacity monitoring

**Permissions:**
- Define resource requirements
- Recommend allocation
- View utilization dashboard
- Modify allocation before approval

---

### 4.6 Finance User

**Responsibilities:**
- Commercial validation
- Invoice management
- Payment tracking

**Permissions:**
- Edit payment terms
- Generate invoices
- Mark payments received
- Approve high-budget intake
- View financial dashboards

---

### 4.7 System Administrator

**Responsibilities:**
- Full system governance
- Master configuration
- Role management

**Permissions:**
- Full CRUD across modules
- Configure Masters
- Override approvals
- Manage user accounts
- Assign roles

---

## 5. Permission Matrix (Module-Level)

| Module | Sales | Delivery | PM | Resource | Finance | Admin |
|--------|-------|----------|----|----------|---------|-------|
| Leads | Full (Own) | View Closed-Won | View | No | View | Full |
| Project | View | Full | Edit | View | Commercial Edit | Full |
| Submodules | No | Approve | Edit | View | Billing | Full |
| Masters | No | View | View | No | Edit (Payment) | Full |
| Allotment | View | Approve | No | Recommend | Approve (Budget) | Full |

---

## 6. Action-Level Control

### Examples

- Only Delivery Manager can activate project.
- Only Finance can modify payment structure.
- Only Admin can deactivate master templates.
- Sales cannot edit project after activation.
- Resource allocation cannot exceed capacity threshold.

---

## 7. Approval Hierarchy Logic

If Intake Budget > Threshold → Finance Approval Required  
If Resource Capacity > 90% → Delivery Approval Required  
If Exception Override → Admin Approval Required  

---

## 8. User Management

### User Attributes

- User ID
- Name
- Email
- Role
- Department
- Status (Active / Inactive)
- Reporting Manager
- Access Scope (Global / Restricted)

---

## 9. Audit & Logging

The system must log:

- Login activity
- Data modification
- Status changes
- Approval actions
- Financial edits
- Role changes

Audit log must include:

- User ID
- Timestamp
- Old Value
- New Value
- Module Name
- Action Type

---

## 10. Security Controls

- Role-based access enforcement
- Data encryption (Financial & Sensitive Data)
- Session timeout
- Multi-factor authentication (Future Enhancement)
- IP-based restriction (Optional)

---

## 11. Non-Functional Requirements

- Scalable role hierarchy
- Performance optimized permission validation
- Zero cross-role data leakage
- Secure API-level enforcement
- High availability authentication layer

---

## 12. Future Enhancements

- Custom role creation
- Field-level permission control
- Temporary role assignment
- Delegation access
- Dynamic approval routing

---

## 13. Module Summary

The User Roles & Access Control module ensures structured governance across the ROCKEYE platform.

It enforces:

- Controlled access
- Approval hierarchy
- Financial security
- Delivery accountability

This module safeguards operational integrity and ensures enterprise-grade compliance.