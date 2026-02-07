# Siebel Troubleshooting Reference

## Table of Contents
1. [Common Errors](#common-errors)
2. [Debugging Techniques](#debugging-techniques)
3. [Performance Issues](#performance-issues)
4. [Integration Issues](#integration-issues)

---

## Common Errors

### "Field does not exist"
**Cause:** Field not activated in query.

**Fix:**
```javascript
oBC.ActivateField("FieldName");  // Before ExecuteQuery
```

### "Cannot insert NULL"
**Cause:** Required field not set.

**Fix:** Set all required fields before WriteRecord.

### "Record has been modified by another user"
**Cause:** Concurrent access.

**Fix:** Re-query and retry, or use ForwardOnly cursor.

### "Maximum viewable records exceeded"
**Cause:** Query returns too many records.

**Fix:** Add SearchSpec to limit results.

### "Object not found"
**Cause:** BO or BC name typo.

**Fix:** Verify exact name in Tools.

### Workflow Not Triggering
**Causes:**
1. Runtime Event not reloaded
2. Condition not met
3. Workflow not activated

**Fix:**
1. Menu → Reload Runtime Events
2. Check condition syntax
3. Activate in Workflow Deployment

---

## Debugging Techniques

### Enable Tracing
```javascript
TheApplication().TraceOn("trace.log", "Allocation", "All");
TheApplication().Trace("Debug: " + variable);
TheApplication().TraceOff();
```

### Server Tracing
1. Server Manager: `list param for comp SRBroker`
2. Enable: `change param LogLevel=5 for comp [component]`

### Check Server Logs
Location: `[Siebel]/log/`
- `*.log` - Component logs
- `*.sarmlog` - SARM performance logs

### Debug Workflows
1. Add Echo step with Workflow Utilities
2. Check Workflow Instance Monitor
3. Review workflow error steps

---

## Performance Issues

### Slow Queries
**Causes:**
1. No index on search field
2. Full table scan
3. Too many activated fields

**Fix:**
1. Add index to table
2. Add SearchSpec
3. Activate only needed fields

### Slow Workflows
**Causes:**
1. Too many Siebel Operation steps
2. Synchronous API calls
3. Large loop iterations

**Fix:**
1. Combine operations
2. Use async (Server Requests)
3. Batch processing

### Memory Issues
**Cause:** Objects not released.

**Fix:**
```javascript
finally {
    oBC = null;
    oBO = null;
}
```

---

## Integration Issues

### HTTP 500 Error
**Causes:**
1. Invalid request format
2. Server error

**Debug:**
- Check response body for details
- Verify URL, headers, body

### HTTP 401/403
**Cause:** Authentication failed.

**Fix:**
- Verify credentials
- Check token expiry
- Validate Authorization header format

### JSON Parse Error
**Cause:** Invalid JSON response.

**Debug:**
```javascript
TheApplication().Trace("Response: " + outputs.GetValue());
```

### Timeout
**Causes:**
1. External service slow
2. Network issues

**Fix:**
- Increase timeout
- Use async pattern
- Add retry logic

### Data Type Mismatch
**Cause:** Sending wrong type to external API.

**Fix:**
- Check API documentation
- Convert types before sending:
```javascript
var numStr = ToNumber(value).toString();
```

---

## Quick Fixes Checklist

| Issue | Quick Fix |
|-------|-----------|
| RTE not firing | Reload Runtime Events |
| Workflow not running | Check activation status |
| Field not showing | Activate field in BC |
| Script not running | Check compilation |
| Changes not visible | Clear cache / re-login |
| Query returns nothing | Check ViewMode setting |
