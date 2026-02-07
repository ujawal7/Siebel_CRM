# Siebel Scripting Reference

## Table of Contents
1. [Script Locations](#script-locations)
2. [BC Events](#bc-events)
3. [Common Methods](#common-methods)
4. [Business Services](#business-services)
5. [Code Patterns](#code-patterns)

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

### Post-Events (After action)
| Event | Trigger | Use |
|-------|---------|-----|
| Query | After query | Post-query processing |
| WriteRecord | After save | Trigger workflows, audit |
| DeleteRecord | After delete | Cleanup |
| SetFieldValue | After field change | Calculate dependents |
| NewRecord | On new record | Set defaults |

### Event Order on Save
```
1. PreSetFieldValue (each field)
2. SetFieldValue (each field)
3. PreWriteRecord
4. [Database INSERT/UPDATE]
5. WriteRecord
```

### Return Values
```javascript
return ContinueOperation;  // Allow action
return CancelOperation;    // Prevent action (Pre-events only)
```

---


---

## Profile Attributes & Global Constraints

### Profile Attributes
Session-specific variables available in Script and Personalization.
```javascript
// Set
TheApplication().SetProfileAttr("MyAttr", "Value");
// Get
var val = TheApplication().GetProfileAttr("MyAttr");
```

### Global Variables
Variables shared across scripts in the same session (careful with memory).
```javascript
TheApplication().SetSharedGlobal("MyVar", "Value");
var val = TheApplication().GetSharedGlobal("MyVar");
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
```

### Business Object
```javascript
var oBO = TheApplication().GetBusObject("Account");
var oBC = oBO.GetBusComp("Account");
```

### Business Component
```javascript
// Query
oBC.SetViewMode(AllView);  // or SalesRepView, PersonalView
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

// Update
oBC.SetFieldValue("Field", "NewValue");
oBC.WriteRecord();

// Delete
oBC.DeleteRecord();
```

### Property Sets
```javascript
var ps = TheApplication().NewPropertySet();
ps.SetProperty("Key", "Value");
ps.SetValue("Body text");
var val = ps.GetProperty("Key");
var body = ps.GetValue();
ps.AddChild(childPS);
var child = ps.GetChild(0);
```

---

## Business Services

### Creating a Business Service
1. Create BS in Tools
2. Add Methods with Input/Output args
3. Write Service_PreInvokeMethod:
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

### Pattern: Validate Before Save
```javascript
function BusComp_PreWriteRecord() {
    var status = this.GetFieldValue("Status");
    var amount = ToNumber(this.GetFieldValue("Amount"));
    
    if (status == "Approved" && amount > 100000) {
        TheApplication().RaiseErrorText("Amount over $100K requires VP approval");
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

### Pattern: Query and Update Related
```javascript
function UpdateRelatedRecords(parentId) {
    var oBO = TheApplication().GetBusObject("Parent BO");
    var oBC = oBO.GetBusComp("Child BC");
with (oBC) {
        SetViewMode(AllView);
        ActivateField("Status");
    ClearToQuery();
        SetSearchSpec("Parent Id", parentId);
    ExecuteQuery(ForwardOnly);
        while (FirstRecord()) {
            SetFieldValue("Status", "Closed");
        WriteRecord();
            if (!NextRecord()) break;
        }
    }
    oBC = null;
    oBO = null;
}
```

### Pattern: JSON Parsing (Siebel XSL Convertor)
```javascript
function ParseJSON(jsonString) {
    var svc = TheApplication().GetService("Siebel XSL To XML Convertor");
    var inputs = TheApplication().NewPropertySet();
    var outputs = TheApplication().NewPropertySet();
    
    // Prefix with root element wrapper as per service requirement
    inputs.SetValue("<?xml version='1.0' encoding='UTF-8'?>" + 
                   "<root>" + jsonString + "</root>");
                   
    svc.InvokeMethod("jsontops", inputs, outputs);
    
    return outputs; // Returns PropertySet hierarchy
}
```

### Pattern: Error Handling (Best Practice)
Always use `try-catch-finally` to ensure objects are destroyed.
```javascript
try {
    var oBO = TheApplication().GetBusObject("Account");
    var oBC = oBO.GetBusComp("Account");
    // Logic...
} catch(e) {
    TheApplication().Trace("Error: " + e.toString());
    TheApplication().RaiseErrorText("Custom Error: " + e.toString());
} finally {
    // Explicitly release objects to prevent memory leaks
    if (oBC) { oBC = null; }
    if (oBO) { oBO = null; }
}
```
