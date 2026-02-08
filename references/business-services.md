# Business Services Reference

## Common Business Services

| Service | Purpose |
|---------|---------|
| `EAI HTTP Transport` | REST/HTTP calls |
| `EAI Siebel Adapter` | Query/Insert/Update/Delete Siebel data |
| `Workflow Process Manager` | Run workflows programmatically |
| `Server Requests` | Async workflow execution |
| `Outbound Communications Manager` | Send emails |
| `SessionAccessService` | Access user profile attributes (Open UI) |
| `Framework` | General framework operations |

---

## Open UI Helper Methods

| Method | Usage | Returns |
|--------|-------|---------|
| `SiebelApp.S_App.GetService(name)` | Get Business Service handle | Service object |
| `SiebelApp.S_App.NewPropertySet()` | Create new PropertySet | PropertySet object |
| `service.InvokeMethod(method, inPS)` | Call BS method | Output PropertySet |
| `outPS.GetChildByType("ResultSet")` | Get child PropertySet | PropertySet |
| `resultSet.GetProperty("Value")` | Get property value | String |
| `this.GetPM().Get("GetRecordSet")` | Get current records | Array |
| `this.GetPM().Get("GetPlaceholder")` | Get applet DOM ID | String |
| `this.Get("GetControls")` | Get all controls | Object |
| `this.ExecuteMethod("GetFieldValue", ctrl)` | Get field value | String |

---

## SessionAccessService Pattern

**Use Case:** Check user profile attributes in Open UI.

```javascript
// Create PropertySets
var inPS = SiebelApp.S_App.NewPropertySet();
var outPS = SiebelApp.S_App.NewPropertySet();

// Set attribute name to check
inPS.SetProperty("Name", "Is Manager");

// Get service and invoke
var service = SiebelApp.S_App.GetService("SessionAccessService");
outPS = service.InvokeMethod("GetProfileAttr", inPS);

// Get result value
var resultSet = outPS.GetChildByType("ResultSet");
var returnVal = resultSet.GetProperty("Value");

if (returnVal == "Y") {
    // User is a manager
}
```

---

## EAI HTTP Transport Pattern

**Use Case:** Call external REST API from Business Service.

```javascript
function CallExternalAPI(Inputs, Outputs) {
    var httpBS = TheApplication().GetService("EAI HTTP Transport");
    var inputPS = TheApplication().NewPropertySet();
    var outputPS = TheApplication().NewPropertySet();
    
    inputPS.SetProperty("HTTPRequestURLTemplate", "https://api.example.com/data");
    inputPS.SetProperty("HTTPRequestMethod", "GET");
    inputPS.SetProperty("HTTPContentType", "application/json");
    
    httpBS.InvokeMethod("SendReceive", inputPS, outputPS);
    
    var response = outputPS.GetProperty("HTTPResponseBody");
    return response;
}
```

---

## EAI Siebel Adapter Pattern

**Use Case:** Query Siebel BC from Business Service.

```javascript
function QueryBC(Inputs, Outputs) {
    var siebelAdapter = TheApplication().GetService("EAI Siebel Adapter");
    var inputPS = TheApplication().NewPropertySet();
    var outputPS = TheApplication().NewPropertySet();
    
    // Set Integration Object
    inputPS.SetProperty("ObjectType", "Account");
    inputPS.SetProperty("SearchSpec", "[Name] LIKE 'Test*'");
    
    siebelAdapter.InvokeMethod("Query", inputPS, outputPS);
    
    // Process output
    var childPS = outputPS.GetChild(0);
    return childPS;
}
```

---

## Workflow Process Manager Pattern

**Use Case:** Run workflow from script.

```javascript
function RunWorkflow(processName, inputArgs) {
    var wfPM = TheApplication().GetService("Workflow Process Manager");
    var inputPS = TheApplication().NewPropertySet();
    var outputPS = TheApplication().NewPropertySet();
    
    inputPS.SetProperty("ProcessName", processName);
    // Add input arguments
    for (var key in inputArgs) {
        inputPS.SetProperty(key, inputArgs[key]);
    }
    
    wfPM.InvokeMethod("RunProcess", inputPS, outputPS);
    
    return outputPS;
}
```
