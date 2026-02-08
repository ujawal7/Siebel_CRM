# Siebel Scripting Reference

## Table of Contents
1. [Scripting Rules](#scripting-rules)
2. [Variable Scoping](#variable-scoping)
3. [Script Locations](#script-locations)
4. [BC Events](#bc-events)
5. [Application Events](#application-events)
6. [Common Methods](#common-methods)
7. [Business Services](#business-services)
8. [Code Patterns](#code-patterns)
9. [Real-World Scenarios](#real-world-scenarios)
10. [Interview Questions](#interview-questions)

---

## Scripting Rules (Best Practices)

Follow these steps when implementing Siebel scripts:

| Step | Action |
|------|--------|
| 1 | **Exhaust configuration options** - Use Tools configuration first |
| 2 | **Determine object** - Which object needs the script? |
| 3 | **Determine event** - Which event is appropriate? |
| 4 | **Add error handling** - Template with try-catch-finally |
| 5 | **Implement logic** - Write the actual code |
| 6 | **Test & debug** - Use Siebel Debugger |

---

## Variable Scoping

| Variable Type | Scope | Declaration | Lifespan |
|---------------|-------|-------------|----------|
| **Local** | Within script only | `var` statement | Until script ends |
| **Module** | All scripts in same object | `var` in (general)(declarations) | While object is instantiated |
| **Global** | Across all modules | `Global` statement | Session lifetime |

```javascript
// Local variable - only in this function
function BusComp_PreWriteRecord() {
    var localVar = "only here";
}

// Module variable - in (general)(declarations)
var moduleVar = "available in all events of this BC";

// Global variable - avoid for Siebel objects!
Global var globalCounter;
```

> ⚠️ **Warning**: Avoid global variables for Siebel objects (BusComp, BusObject) - memory leaks!

### "this" and "with" Keywords

```javascript
// "this" - shorthand for current object
var value = this.GetFieldValue("Name");

// "with" - multiple methods on same object
with (oBC) {
    ActivateField("Name");
    ClearToQuery();
    SetSearchSpec("Status", "Active");
    ExecuteQuery();
}
```

---

## Script Locations

| Object | Script Types | Use Case |
|--------|--------------|----------|
| Business Component | Server Script | Data manipulation, validation |
| Applet | Browser + Server Script | UI behavior |
| Business Service | Server Script | Reusable logic |
| Application | Browser + Server Script | Global behavior |

---

## BC Events

### Pre-Events (Before action, can cancel)

| Event | Trigger | Use |
|-------|---------|-----|
| PreQuery | Before query | Modify search spec |
| PreWriteRecord | Before save | Validation |
| PreDeleteRecord | Before delete | Prevent deletion |
| PreSetFieldValue | Before field change | Validate value |
| PreNewRecord | Before new record | Check permissions |
| PreAssociate | Before MVG association | Validate |
| PreCopyRecord | Before copy | Modify copied values |

### Post-Events (After action)

| Event | Trigger | Use |
|-------|---------|-----|
| Query | After query | Post-query processing |
| WriteRecord | After save | Trigger workflows, audit |
| DeleteRecord | After delete | Cleanup |
| SetFieldValue | After field change | Calculate dependents |
| NewRecord | On new record | Set defaults |
| ChangeRecord | After navigation | UI updates |
| Associate | After MVG association | Update counts |

### Event Order on Save
```
PreSetFieldValue (each field)
SetFieldValue (each field)
PreWriteRecord
[Database INSERT/UPDATE]
WriteRecord
```

### Return Values
```javascript
return ContinueOperation;  // Allow action
return CancelOperation;    // Prevent action (Pre-events only)
```

---

## Application Events

```javascript
Application_Start          // When application starts
Application_Close          // When application closes
Application_Navigate       // After navigation
Application_PreNavigate    // Before navigation
Application_InvokeMethod   // After method invoked
Application_PreInvokeMethod // Before method invoked
```

---

## Common Methods

### TheApplication()
```javascript
TheApplication().GetBusObject("Account")
TheApplication().ActiveBusObject()
TheApplication().LoginName()
TheApplication().GetService("Service Name")
TheApplication().RaiseErrorText("Error message")
TheApplication().Trace("Debug message")
TheApplication().GotoView("View Name", oBO)
```

### Profile Attributes & Globals
```javascript
// Profile Attributes (session-specific)
TheApplication().SetProfileAttr("MyAttr", "Value");
var val = TheApplication().GetProfileAttr("MyAttr");

// Shared Globals
TheApplication().SetSharedGlobal("MyVar", "Value");
var val = TheApplication().GetSharedGlobal("MyVar");
```

### Business Object & Component
```javascript
var oBO = TheApplication().GetBusObject("Account");
var oBC = oBO.GetBusComp("Account");

// Query
oBC.SetViewMode(AllView);
oBC.ClearToQuery();
oBC.SetSearchSpec("Field", "Value");
oBC.ExecuteQuery(ForwardOnly);

// Navigate
if (oBC.FirstRecord()) {
    do {
        var val = oBC.GetFieldValue("Field");
    } while (oBC.NextRecord());
}

// Create
oBC.NewRecord(NewBefore);
oBC.SetFieldValue("Field", "Value");
oBC.WriteRecord();
```

### ExecuteQuery Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| ForwardBackward | Navigate first-to-last OR last-to-first (default) | Standard navigation |
| ForwardOnly | First-to-last only | Better performance for one-pass processing |

---

## Business Services

### Creating a Business Service
```javascript
function Service_PreInvokeMethod(MethodName, Inputs, Outputs) {
    if (MethodName == "MyMethod") {
        MyMethod(Inputs, Outputs);
        return CancelOperation;
    }
    return ContinueOperation;
}

function MyMethod(Inputs, Outputs) {
    var input1 = Inputs.GetProperty("Input1");
    // Process
    Outputs.SetProperty("Result", result);
}
```

### Calling a Business Service
```javascript
var svc = TheApplication().GetService("My Service");
var inputs = TheApplication().NewPropertySet();
var outputs = TheApplication().NewPropertySet();
inputs.SetProperty("Input1", "Value");
svc.InvokeMethod("MyMethod", inputs, outputs);
var result = outputs.GetProperty("Result");
```

---

## Code Patterns

### Pattern: Error Handling (Required!)
```javascript
try {
    var oBO = TheApplication().GetBusObject("Account");
    var oBC = oBO.GetBusComp("Account");
    // Logic...
} catch(e) {
    TheApplication().RaiseErrorText("Error: " + e.toString());
} finally {
    oBC = null;
    oBO = null;
}
```

### Pattern: Validate Before Save
```javascript
function BusComp_PreWriteRecord() {
    var status = this.GetFieldValue("Status");
    if (status == "") {
        TheApplication().RaiseErrorText("Status is required!");
        return CancelOperation;
    }
    return ContinueOperation;
}
```

### Pattern: Set Defaults on New Record
```javascript
function BusComp_NewRecord() {
    this.SetFieldValue("Status", "Open");
    this.SetFieldValue("Created By", TheApplication().LoginName());
}
```

### Pattern: Calculate Dependent Fields
```javascript
function BusComp_SetFieldValue(fieldName) {
    if (fieldName == "Quantity" || fieldName == "Unit Price") {
        var qty = ToNumber(this.GetFieldValue("Quantity"));
        var price = ToNumber(this.GetFieldValue("Unit Price"));
        this.SetFieldValue("Total", qty * price);
    }
}
```

---

## Real-World Scenarios

### Scenario 1: Custom Button to Filter Records

**Step 1: Create Control** - Set `Method Invoked = "MyAccount"`

**Step 2: Enable Button**
```javascript
function WebApplet_PreCanInvokeMethod(MethodName, CanInvoke) {
    if (MethodName == "MyAccount") {
        CanInvoke = "TRUE";
        return CancelOperation;
    }
    return ContinueOperation;
}
```

**Step 3: Implement Logic**
```javascript
function WebApplet_PreInvokeMethod(MethodName) {
    if (MethodName == "MyAccount") {
        var bc = this.BusComp();
        var location = bc.GetFieldValue("Location");
        bc.ClearToQuery();
        bc.SetSearchSpec("Location", location);
        bc.ExecuteQuery();
        return CancelOperation;
    }
    return ContinueOperation;
}
```

### Scenario 2: Auto-Create Child Record

```javascript
function BusComp_NewRecord() {
    try {
        var accountRowId = this.GetFieldValue("Id");
        var accountBO = TheApplication().GetBusObject("Account");
        var actionBC = accountBO.GetBusComp("Action");
        
        with (actionBC) {
            ActivateField("Type");
            NewRecord(NewBefore);
            SetFieldValue("Type", "To Do");
            SetFieldValue("Account Id", accountRowId);
            WriteRecord();
        }
    } finally {
        actionBC = null;
        accountBO = null;
    }
}
```

### Scenario 3: Date Validation

```javascript
function BusComp_PreSetFieldValue(FieldName, FieldValue) {
    if (FieldName == "Birth Date") {
        var dateValue = new Date(FieldValue);
        var today = new Date();
        if (dateValue >= today) {
            TheApplication().RaiseErrorText("Date cannot be in the future!");
            return CancelOperation;
        }
    }
    return ContinueOperation;
}
```

### Scenario 4: GotoView with Record Context

```javascript
var accountBO = TheApplication().GetBusObject("Account");
var accountBC = accountBO.GetBusComp("Account");

with (accountBC) {
    ClearToQuery();
    SetSearchSpec("Id", targetAccountId);
    ExecuteQuery();
}

// Navigate with BO context - record stays in focus
TheApplication().GotoView("Account Detail View", accountBO);
```

---

## Interview Questions

**Q: What is difference between Object, Event, and Method?**
| Concept | Description | Examples |
|---------|-------------|----------|
| Object | Siebel entity | Application, Applet, BC |
| Event | Trigger point | PreWriteRecord, NewRecord |
| Method | Action/function | GetFieldValue, ExecuteQuery |

**Q: What are benefits of declarative alternatives to scripting?**
- Performance tested by Oracle
- Easy to maintain, no debugging
- Upgrade-friendly
- Cost-effective

**Q: How to display error messages to users?**
```javascript
TheApplication().RaiseErrorText("Error message!");
```

---

## Testing Scripts

**Using Siebel Debugger:**

| Feature | Description |
|---------|-------------|
| Breakpoints | Mark lines to pause execution |
| Variable Window | View variable values, BC fields |
| Calls Window | List of function calls |
| Step Through | Execute line by line |
