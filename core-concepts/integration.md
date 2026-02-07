# Siebel Integration Reference

## Table of Contents
1. [EAI Overview](#eai-overview)
2. [Outbound Integration](#outbound-integration)
3. [Inbound Integration](#inbound-integration)
4. [Integration Objects](#integration-objects)
5. [Common Patterns](#common-patterns)

6. [Lab Exercises](#lab-exercises)

---

## Lab Exercises
Practice fundamental integration skills with these hands-on labs:
- [Lab 01: Outbound REST](../../../../integration/labs/Lab-01-Outbound-REST.md)
- [Lab 02: Outbound POST](../../../../integration/labs/Lab-02-Outbound-POST.md)
- [Lab 03: Inbound Query](../../../../integration/labs/Lab-03-Inbound-Query.md)
- [Lab 04: Integration Workflow](../../../../integration/labs/Lab-04-Integration-Workflow.md)
- [Lab 05: Complete Integration](../../../../integration/labs/Lab-05-Complete-Integration.md)

## EAI Overview

**EAI (Enterprise Application Integration)** connects Siebel with external systems.

### Key Components
| Component | Purpose |
|-----------|---------|
| Integration Object (IO) | Data structure (like XML schema) |
| EAI Business Services | Process and transform data |
| Transport Adapters | Send/receive over HTTP, JMS, etc. |
| Property Sets | Internal data structure |

### Data Flow
```
Outbound: Siebel Data → IO → XML → HTTP Transport → External API
Inbound:  External Request → Web Service → IO → Siebel Data
```

---

## Outbound Integration

### EAI HTTP Transport
For REST API calls.

**Methods:**
| Method | Use |
|--------|-----|
| SendReceive | Send request, get response |
| Send | Fire-and-forget |

**Key Arguments:**
| Argument | Description | Example |
|----------|-------------|---------|
| HTTPRequestURLTemplate | Target URL | `https://api.example.com/data` |
| HTTPRequestMethod | HTTP method | GET, POST, PUT, DELETE |
| HTTPContentType | Content type | `application/json` |
| HTTPAccept | Accept header | `application/json` |
| HTTPRequestBodyText | Request body | `{"name":"test"}` |
| CharSetConversion | Encoding | `UTF-8` |
| HDR.Authorization | Auth header | `Bearer [token]` |

**eScript Example:**
```javascript
var svc = TheApplication().GetService("EAI HTTP Transport");
var inputs = TheApplication().NewPropertySet();
var outputs = TheApplication().NewPropertySet();

inputs.SetProperty("HTTPRequestURLTemplate", sURL);
inputs.SetProperty("HTTPRequestMethod", "POST");
inputs.SetProperty("HTTPContentType", "application/json");
inputs.SetProperty("HTTPAccept", "application/json");
inputs.SetProperty("HDR.Authorization", "Bearer " + token);
inputs.SetValue(requestBody);

svc.InvokeMethod("SendReceive", inputs, outputs);
var response = outputs.GetValue();
```

### JSON Parsing
Use `Siebel XSL To XML Convertor` service.

```javascript
var converter = TheApplication().GetService("Siebel XSL To XML Convertor");
var outputPS = TheApplication().NewPropertySet();
converter.InvokeMethod("jsontops", responsePS, outputPS);

// Navigate hierarchy
var child = outputPS.GetChild(0);
var value = child.GetProperty("fieldName");
```

### OAuth Token Flow
1. POST to token URL with credentials
2. Parse access_token from response
3. Add `Bearer [token]` to subsequent requests

---

## Inbound Integration

### Inbound Web Services
Expose Siebel functionality to external systems.

**Setup:**
1. Create Integration Object
2. Create Business Service (if custom logic needed)
3. Administration - Web Services → Create Web Service
4. Generate WSDL
5. Test with SoapUI/Postman

### EAI Siebel Adapter Methods
| Method | Purpose |
|--------|---------|
| Query | Export data (hierarchical) |
| Insert | Create records |
| Update | Modify records |
| Delete | Remove records |
| Upsert | Insert or Update |
| Execute | CRUD based on operation code |

---

## Integration Objects

### Structure
```xml
<ListOfAccount>
    <Account>
        <Id>1-ABC123</Id>
        <Name>Test Account</Name>
        <ListOfContact>
            <Contact>
                <FirstName>John</FirstName>
            </Contact>
        </ListOfContact>
    </Account>
</ListOfAccount>
```

### Types
| Type | Purpose |
|------|---------|
| Siebel Message IO | Mirror Siebel BO/BC structure |
| External IO | Represent external data |
| EAI IO | Internal EAI processing |

---

## Common Patterns

### Pattern: REST GET with OAuth
```javascript
// 1. Get token
var tokenInputs = TheApplication().NewPropertySet();
tokenInputs.SetProperty("HTTPRequestURLTemplate", tokenURL);
tokenInputs.SetProperty("HTTPRequestMethod", "POST");
tokenInputs.SetProperty("HTTPContentType", "application/x-www-form-urlencoded");
tokenInputs.SetProperty("HDR.Authorization", "Basic " + base64Creds);
tokenInputs.SetValue("grant_type=client_credentials");
svc.InvokeMethod("SendReceive", tokenInputs, tokenOutputs);

// 2. Parse token
converter.InvokeMethod("jsontops", tokenOutputs, tokenPS);
var token = tokenPS.GetProperty("access_token");

// 3. Call API
var apiInputs = TheApplication().NewPropertySet();
apiInputs.SetProperty("HTTPRequestURLTemplate", apiURL);
apiInputs.SetProperty("HTTPRequestMethod", "GET");
apiInputs.SetProperty("HDR.Authorization", "Bearer " + token);
svc.InvokeMethod("SendReceive", apiInputs, apiOutputs);
```

### Pattern: Async Workflow via Server Requests
```javascript
var sIp = TheApplication().NewPropertySet();
var sOp = TheApplication().NewPropertySet();
var nChild = TheApplication().NewPropertySet();
var sSvc = TheApplication().GetService("Server Requests");

sIp.SetProperty("Component", "WfProcMgr");
sIp.SetProperty("Mode", "DirectDb");
nChild.SetProperty("ProcessName", "My Workflow");
nChild.SetProperty("Object Id", recordId);
sIp.AddChild(nChild);

sSvc.InvokeMethod("SubmitRequest", sIp, sOp);
```

### Pattern: LOV-based Configuration
Store API URLs/credentials in LOV for environment flexibility:
```javascript
var sBusObj = TheApplication().GetBusObject("List Of Values");
var sBC = sBusObj.GetBusComp("List Of Values");
with(sBC) {
    ClearToQuery();
    SetSearchSpec("Type", "MY_CONFIG");
    SetSearchSpec("Name", "API_URL");
    ExecuteQuery(ForwardOnly);
    if(FirstRecord()) {
        var url = GetFieldValue("Description");
    }
}
```
