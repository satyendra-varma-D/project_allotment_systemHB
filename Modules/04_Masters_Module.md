# ROCKEYE – Design Prototype Document
## Module 04: Masters Module (Configuration Layer)

---

## 1. Module Information

| Field | Value |
|-------|--------|
| Module Name | Masters Configuration |
| System Layer | Configuration / Governance |
| Primary Users | System Administrator, Delivery Manager, Finance User |
| Dependent Modules | Project Module, Submodules |
| Status | In Scope |

---

## 2. Module Purpose

The Masters Module acts as the configuration backbone of the ROCKEYE platform.

It standardizes reusable structures across projects to ensure:

- Consistent milestone creation
- Controlled commercial structures
- Template-driven project execution
- Reduced manual configuration errors
- Scalable governance

This module directly influences project execution and billing logic.

---

# 3. Master 1: Milestones Master

---

## 3.1 Purpose

Define reusable milestone templates applicable across project types.

Ensures delivery consistency and automated milestone generation during project activation.

---

## 3.2 Functional Scope

### Key Attributes

- Milestone Code (Unique)
- Milestone Name
- Alias
- Description
- Domain Applicability (Web / Mobile / Total)
- Default Sequence Order
- Default Payment Percentage (Optional)
- Status (Active / Inactive)

---

## 3.3 Functional Capabilities

- Create milestone template
- Edit milestone template
- Activate / Deactivate milestone
- Assign domain applicability
- Define execution order
- Map milestone to Payment Terms structure

---

## 3.4 System Rules

1. Milestone Code must be unique.
2. Inactive milestones cannot be used in new projects.
3. Default sequence determines milestone generation order.
4. Payment percentage must align with Payment Terms Master.
5. Changes do not affect already active projects (version control recommended).

---

## 3.5 Data Model

Milestone_Master
- Milestone_Master_ID (PK)
- Milestone_Code
- Milestone_Name
- Alias
- Description
- Domain
- Sequence_Order
- Default_Payment_Percentage
- Status
- Created_By
- Created_Date

---

# 4. Master 2: Payment Terms Master

---

## 4.1 Purpose

Standardize financial milestone distribution structures across projects.

Ensures consistent billing patterns and financial governance.

---

## 4.2 Functional Scope

### Key Attributes

- Payment Terms ID
- Payment Structure Name (e.g., 50:50, 30:40:30)
- Description
- Total Percentage Validation (Must equal 100%)
- Linked Milestones
- Status (Active / Inactive)

---

## 4.3 Functional Capabilities

- Create payment structure
- Define installment distribution
- Map installments to milestone codes
- Validate total percentage = 100%
- Activate / Deactivate structure

---

## 4.4 Example Structures

### Example 1 – 50:50 Model
- 50% – Project Kickoff
- 50% – Final Delivery

### Example 2 – 30:40:30 Model
- 30% – Requirement Signoff
- 40% – UAT Completion
- 30% – Go Live

---

## 4.5 System Rules

1. Total distribution must equal 100%.
2. Must map to valid milestone codes.
3. Cannot deactivate if linked to active projects.
4. Finance role required for modification.
5. Versioning recommended for structural changes.

---

## 4.6 Data Model

Payment_Terms_Master
- Payment_Terms_ID (PK)
- Structure_Name
- Description
- Status
- Created_By
- Created_Date

Payment_Terms_Detail
- Detail_ID (PK)
- Payment_Terms_ID (FK)
- Milestone_Code
- Percentage

---

# 5. Governance Controls

- Role-based access restriction
- Version control recommended
- Audit logging for all changes
- Deactivation validation checks
- Change approval workflow (Optional Enhancement)

---

# 6. Integration Points

- Auto-generates milestones in Project Module
- Drives commercial structure in Project Module
- Validates milestone-payment mapping
- Influences Project Submodules
- Required before Project Activation

---

# 7. Role-Based Access

| Role | Milestone Master | Payment Terms Master |
|------|------------------|----------------------|
| Admin | Full Access | Full Access |
| Delivery Manager | Create/Edit | View |
| Finance User | View | Create/Edit |
| Project Manager | View | View |

---

# 8. Non-Functional Requirements

- High integrity validation
- No impact on live project records
- Configuration change logs
- Scalable template structure
- Fast lookup during project creation

---

# 9. Future Enhancements

- Template bundles by project type
- Domain-based default mapping
- Auto-recommended payment structure
- Dependency validation engine
- Template cloning functionality

---

# 10. Module Summary

The Masters Module ensures ROCKEYE operates on standardized execution and financial governance principles.

It reduces dependency on manual configuration and ensures every project follows:

- Defined milestone sequences
- Structured payment mapping
- Controlled activation workflow

It forms the backbone of delivery consistency across the platform.