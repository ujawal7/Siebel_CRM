# Siebel Open UI Reference

## Table of Contents
1. [Architecture](#architecture)
2. [Physical Renderers (PR)](#physical-renderers-pr)
3. [Presentation Models (PM)](#presentation-models-pm)
4. [Plugin Wrappers (PW)](#plugin-wrappers-pw)
5. [Manifest Administration](#manifest-administration)
6. [Best Practices](#best-practices)

---

## Architecture

Siebel Open UI separates the UI rendering (Physical Renderer) from the logical behavior (Presentation Model).

| Layer | Component | Purpose |
|-------|-----------|---------|
| **View** | Physical Renderer (PR) | DOM manipulation, HTML/CSS, 3rd party libs |
| **Model** | Presentation Model (PM) | Business logic, state, field values |
| **Proxy** | Proxy Object | Bridge between client and Server BC |

---

## Physical Renderers (PR)

**Use when:** You need to change *how* something looks or is rendered.
- Integrating maps, charts, or carousels
- Changing the layout of an Applet
- Adding custom event listeners to DOM elements

**Key Methods:**
```javascript
ShowUI: function() {
    // Render custom HTML
    // Bind 3rd party libraries
}

BindEvents: function() {
    // Attach click/change handlers
    // Call PM methods
}

BindData: function(bRefresh) {
    // Update UI when data changes
}
```

---

## Presentation Models (PM)

**Use when:** You need to change *behavior* or interact with business logic.
- Validating data client-side
- Getting/Setting field values
- Calling Server Business Services
- Determining visibility (Show/Hide)

**Key Methods:**
```javascript
Init: function() {
    // Initialize properties
    this.AddProperty("MyProp", val);
}

Setup: function(propSet) {
    // Subscribe to events
    this.AddMethod("FieldChange", OnFieldChange);
}
```

---

## Plugin Wrappers (PW)

**Use when:** You need to customize a *specific control type* across the application or on specific applets.
- Color-coding fields (Badges)
- Changing a text input to a slider or dropdown
- Adding icons inside fields

**Why use PW over PR?**
- Lighter weight
- Reusable across multiple applets
- Better performance
- Doesn't require replacing the whole Applet Renderer

**Example Pattern:**
```javascript
SiebelJS.Extend(MyPluginURL, SiebelAppFacade.PhysicalRenderer);

MyPluginURL.prototype.ShowUI = function(control, val) {
    // Render custom input
};
```

---

## Manifest Administration

For Open UI files to load, they must be registered.

**Steps:**
1. **Files:** Add JS file record in *Administration - Application > Manifest Files*
2. **Administration:** Go to *Manifest Administration*
3. **UI Objects:** Create record (Type=Applet, Usage Type=Physical Renderer, Name=[Applet Name])
4. **Object Expression:** Add record (Level=1)
5. **Files:** Associate the JS file from Step 1

> **CRITICAL:** If you forget Step 1 or 5, the customization will fail silently!

---

## Best Practices

1. **Prefer PW over PR:** If modifying a field, use Plugin Wrapper. Use PR only for full Applet layout changes.
2. **No Business Logic in PR:** PR should only render. Logic belongs in PM.
3. **Use CSS:** Don't inline styles in JS. Use `common-files` in manifest to load CSS.
4. **Lazy Loading:** For performance, use `Define()` dependencies correctly.
5. **Namespace:** Always namespace your code (`SiebelAppFacade.MyCustomPR`).
