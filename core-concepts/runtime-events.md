# Runtime Events Reference

## Table of Contents
1. [Overview](#overview)
2. [Creating Runtime Events](#creating-runtime-events)
3. [Event Types](#event-types)
4. [Action Types](#action-types)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Runtime Events (RTE) trigger actions when specific events occur in Siebel.

**Components:**
| Component | Purpose |
|-----------|---------|
| Event | What triggers the action |
| Condition | When to fire |
| Action Set | What to do |
| Action | Specific action |

**Location:** Administration - Runtime Events

---

## Creating Runtime Events

### Step 1: Create Action Set
| Property | Value |
|----------|-------|
| Name | Descriptive name |

### Step 2: Create Action
| Property | Value |
|----------|-------|
| Sequence | Execution order |
| Action Type | BusService, BusComp, Set Field, etc. |
| Business Service Name | Target service |
| Business Service Method | Method to call |
| Business Service Context | Parameters |

**For Workflow:**
```
Business Service Name: Workflow Process Manager
Business Service Method: RunProcess
Business Service Context: "ProcessName", "My Workflow Name"
```

### Step 3: Create Event
| Property | Value |
|----------|-------|
| Sequence | Priority order |
| Object Type | BusComp, Applet, Application |
| Object Name | Specific object |
| Event | WriteRecord, NewRecord, etc. |
| Condition | When to trigger |
| Action Set Name | Action set to execute |

### Step 4: Reload
**Menu (☰) → Reload Runtime Events**

---

## Event Types

### BusComp Events
| Event | Fires When |
|-------|------------|
| WriteRecord | After record saved |
| NewRecord | After new record created |
| DeleteRecord | After record deleted |
| SetFieldValue | After field value changed |
| PreWriteRecord | Before record saved |
| PreDeleteRecord | Before record deleted |

### Applet Events
| Event | Fires When |
|-------|------------|
| InvokeMethod | Method called on applet |
| ChangeRecord | User navigates to record |

### Application Events
| Event | Fires When |
|-------|------------|
| Login | User logs in |
| Logout | User logs out |

---

## Action Types

| Type | Use |
|------|-----|
| BusService | Call Business Service |
| BusComp | Call BC method |
| Set Field | Set field value |
| Run Workflow | Start workflow |

### BusService Context Format
```
"Arg1Name", "Arg1Value", "Arg2Name", "Arg2Value"
```

**Example:**
```
"ProcessName", "Account Update WF", "Object Id", "[Id]"
```

Use `[FieldName]` to pass field values.

---

## Common Patterns

### Trigger Workflow on Status Change
**Action Set:**
```
Action Type: BusService
Service: Workflow Process Manager
Method: RunProcess
Context: "ProcessName", "Status Change WF"
```

**Event:**
```
Object Type: BusComp
Object Name: Account
Event: WriteRecord
Condition: [Status] = 'Active'
```

### Trigger on Specific Field Update
**Event:**
```
Object Type: BusComp
Object Name: Opportunity
Event: SetFieldValue
Subevent: Sales Stage
Condition: [Sales Stage] = 'Closed Won'
```

### Prevent Infinite Loop
Add condition to exclude already-processed records:
```
[Status] = 'Credit Hold' AND [Processed Flag] <> 'Y'
```

Or check field that workflow updates:
```
[Status] = 'Credit Hold' AND [Type] <> 'Banking'
```

### Pass Record ID to Workflow
**Context:**
```
"ProcessName", "My Workflow", "Object Id", "[Id]"
```

In workflow, use Process Property `Object Id`.

---

## Troubleshooting

### Event Not Firing
1. **Reload Runtime Events** - Most common fix
2. Check Condition syntax
3. Verify Object Name matches exactly
4. Check Sequence (lower = higher priority)

### Infinite Loop
Workflow keeps triggering itself.

**Fix:** Add condition to prevent re-trigger:
```
[Field Changed By WF] <> 'Expected Value'
```

### Event Firing Multiple Times
Check for duplicate events or workflows with overlapping triggers.

### Testing
1. Enable tracing
2. Check server logs
3. Add logging steps in workflow
