# Siebel Workflows Reference

## Table of Contents
1. [Workflow Types](#workflow-types)
2. [Creating Workflows](#creating-workflows)
3. [Workflow Steps](#workflow-steps)
4. [Runtime Events](#runtime-events)
5. [Workflow Policies](#workflow-policies)
6. [Common Patterns](#common-patterns)

---

## Workflow Types

| Type | Mode | Use Case |
|------|------|----------|
| **Service Flow** | Synchronous | User-triggered, immediate response needed |
| **Task Flow** | Interactive | Multi-step user interaction, inbox tasks |

## Creating Workflows

### Workflow Properties
| Property | Description |
|----------|-------------|
| Name | Unique workflow identifier |
| Business Object | Context BO for the workflow |
| Group | Logical grouping |
| Workflow Mode | Service Flow or Task Flow |
| State | In Progress → Completed |

### Process Properties
| Property | Type | Purpose |
|----------|------|---------|
| Object Id | String | Current record Row ID (from trigger) |
| Error Code | String | Store error codes |
| Error Message | String | Store error messages |
| Siebel Operation Object Id | String | Row ID from Siebel Operation steps |

---

## Workflow Steps

### Siebel Operation Step
CRUD operations on Business Components.

| Operation | Use |
|-----------|-----|
| Query | Retrieve records |
| Insert | Create new record |
| Update | Modify record |
| Delete | Remove record |

**Configuration:**
```
Business Component: [Target BC]
Operation: Update
Search Specification: [Id] = &ObjectId
```

**Field Input Arguments:**
| Field Name | Type | Value |
|------------|------|-------|
| Status | Literal | 'Closed' |
| Account Id | Process Property | Object Id |

### Business Service Step
Call a Business Service method.

**Common Services:**
| Service | Method | Purpose |
|---------|--------|---------|
| Workflow Utilities | Echo | Calculate expressions |
| EAI HTTP Transport | SendReceive | REST API calls |
| Outbound Communications Manager | SendMessage | Send emails |
| Server Requests | SubmitRequest | Async workflow |

### Decision Step
Branch based on conditions.

**Condition Syntax:**
```
[ProcessProperty] = 'Value'
[ProcessProperty] <> ''
[Error Code] = '0'
```

---

## Runtime Events

### Creating a Trigger

1. **Create Action Set** (Administration - Runtime Events)
   - Name: `[Descriptive Name] Action Set`
   - Action Type: `BusService`
   - Business Service Name: `Workflow Process Manager`
   - Method Name: `RunProcess`
   - Business Service Context: `"ProcessName", "[Workflow Name]"`

2. **Create Event**
   - Object Type: `BusComp`
   - Object Name: `[BC Name]`
   - Event: `WriteRecord` | `NewRecord` | `DeleteRecord`
   - Condition: `[Field] = 'Value'`
   - Action Set Name: `[Action Set Name]`

3. **Reload Runtime Events** (Menu → Reload Runtime Events)

### Avoid Infinite Loops
Add condition to prevent re-triggering:
```
[Status] = 'Credit Hold' AND [Type] <> 'Banking'
```

---

## Workflow Policies

For scheduled/batch processing using Workflow Policy component.

### Components
| Component | Purpose |
|-----------|---------|
| Workflow Policy Manager | Monitors and triggers policies |
| Workflow Policy | Defines trigger conditions |
| Workflow Policy Action | Defines what happens |

### Policy Configuration
1. Create Policy Program
2. Define Policy Columns (fields to monitor)
3. Create Policy Condition
4. Create Policy Action (invoke workflow)

---

## Common Patterns

### Pattern: Update Field + Create Related Record
```
Start
  ↓
Update Account Type (Siebel Op - Update)
  ↓
Insert Activity (Siebel Op - Insert)
  ↓
End
```

### Pattern: Query + Conditional Branch
```
Start
  ↓
Query Records (Siebel Op - Query)
  ↓
Decision: Records Found?
  ├─ Yes → Process Records
  └─ No → Log Error → End
```

### Pattern: Call External API + Update
```
Start
  ↓
Get Config from LOV (BS - Query LOV)
  ↓
Call API (BS - EAI HTTP Transport)
  ↓
Parse Response (BS - JSON to PS)
  ↓
Submit Async Update (BS - Server Requests)
  ↓
End
```

### Pattern: Email Notification
```
Start
  ↓
Query Template
  ↓
Send Email (BS - Outbound Communications Manager)
  ↓
End
```
