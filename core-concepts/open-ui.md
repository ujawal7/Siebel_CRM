# Siebel Open UI Reference

## Table of Contents
1. [Architecture](#architecture)
2. [Presentation Models (PM)](#presentation-models-pm)
3. [Physical Renderers (PR)](#physical-renderers-pr)
4. [Plugin Wrappers (PW)](#plugin-wrappers-pw)
5. [Manifest Administration](#manifest-administration)
6. [The Define Method](#the-define-method)
7. [Debugging Open UI](#debugging-open-ui)
8. [CSS Styling](#css-styling)
9. [Interview Questions](#interview-questions)
10. [Best Practices](#best-practices)

---

## Architecture

Siebel Open UI uses a 3-tier architecture separating UI rendering from business logic.

```
┌─────────────────────────────────────────┐
│  Physical Renderer (PR)                 │  ← DOM/UI
├─────────────────────────────────────────┤
│  Presentation Model (PM)                │  ← Logic/State
├─────────────────────────────────────────┤
│  Siebel Server (Object Manager)         │  ← Data
└─────────────────────────────────────────┘
```

| Layer | Component | Purpose |
|-------|-----------|---------|
| **View** | Physical Renderer (PR) | DOM manipulation, HTML/CSS, 3rd party libs |
| **Model** | Presentation Model (PM) | Business logic, state, field values |
| **Proxy** | Proxy Object | Bridge between client and Server BC |

---

## Presentation Models (PM)

**Use when:** You need to change *behavior* or interact with business logic.
- Data manipulation before display
- Business logic implementation
- State management (show/hide, enable/disable)
- Validations
- Calling Business Services

**Key Methods:**

| Method | Purpose |
|--------|---------|
| `Init()` | Initialize the PM |
| `Setup(propSet)` | Configure PM properties |
| `AttachPMBinding(propName, handler)` | Bind to property changes |
| `OnControlEvent(controlName, eventName, args)` | Handle control events |
| `SetProperty(name, value)` | Set PM property values |
| `Get(fieldName)` | Get field values |
| `ExecuteMethod(methodName, args)` | Call Siebel methods |

**Example - PM Extension:**
```javascript
define("siebel/custom/AccountListPM", ["siebel/pmodel"],
function (SiebelPM) {
    var AccountListPM = SiebelPM.extend({
        Init: function () {
            SiebelPM.prototype.Init.apply(this, arguments);
            this.AddProperty("CustomState", "default");
        },
        
        Setup: function (propSet) {
            SiebelPM.prototype.Setup.apply(this, arguments);
            this.AttachPMBinding("CustomState", this.OnCustomStateChange);
        }
    });
    return AccountListPM;
});
```

---

## Physical Renderers (PR)

**Use when:** You need to change *how* something looks or is rendered.
- Integrating maps, charts, or carousels
- Changing the layout of an Applet
- Adding custom event listeners to DOM elements

**Key Methods:**

| Method | Purpose |
|--------|---------|
| `Init()` | Initialize the PR |
| `ShowUI()` | Render the UI |
| `BindEvents()` | Attach event handlers |
| `BindData(bRefresh)` | Bind data to UI |
| `GetPM()` | Access the Presentation Model |
| `GetEl()` | Get the applet container |

**Example - PR Extension:**
```javascript
define("siebel/custom/AccountListPR", ["siebel/phyrenderer"],
function (SiebelPR) {
    var AccountListPR = SiebelPR.extend({
        ShowUI: function () {
            SiebelPR.prototype.ShowUI.apply(this, arguments);
            this.AddCustomButton();
        },
        
        BindEvents: function () {
            SiebelPR.prototype.BindEvents.apply(this, arguments);
            $(".custom-btn").on("click", this.OnCustomClick.bind(this));
        }
    });
    return AccountListPR;
});
```

**Common jQuery Selectors:**
```javascript
$('[name="ControlName"]')              // Control by name
$('button[aria-label="New"]')          // Button by aria-label
$('[data-display="FieldName"]')        // Field container
$('.siebui-list-row')                  // All list rows
this.GetEl()                           // Applet container
```

---

## Plugin Wrappers (PW)

**Use when:** You need to customize a *specific control type* across the application.
- Color-coding fields (Badges)
- Changing a text input to a slider
- Adding icons inside fields

**Why PW over PR?**
- Lighter weight
- Reusable across multiple applets
- Better performance
- Doesn't require replacing the whole Applet Renderer

---

## Manifest Administration

### Evolution of Manifest Configuration

| Version | Configuration Method |
|---------|---------------------|
| Before 8.1.1.11 | Modify `core_manifest.xml` and `custom_manifest.xml` under `/siebsrvr/OBJECTS` |
| 8.1.1.11+ | Configure from client via Manifest Administration (no scripting needed) |

### Steps for Manifest Customization (8.1.1.11+)

1. **Register JS Files:** *Administration - Application → Manifest Files*
2. **Configure Expressions:** *Administration - Application → Manifest Expressions*
3. **Create Administration Entry:** *Administration - Application → Manifest Administration*
4. **Link Files to Object:** Associate JS file with Applet/View/Application
5. **Clear Cache and Test**

### Expression Types

| Expression | Meaning |
|------------|---------|
| `Desktop` | Desktop browser |
| `Mobile` | Mobile devices |
| `PLATFORM_INDEPENDENT` | All platforms |

> **CRITICAL:** If manifest isn't configured correctly, customization fails silently!

---

## The Define Method

The `define()` method is **MANDATORY** for custom PM/PR files. It tells Siebel Open UI how to load your file and its dependencies.

```javascript
define("siebel/custom/MyAppletPM", ["siebel/pmodel"],
function (SiebelPM) {
    var MyPM = SiebelPM.extend({
        // Implementation
    });
    return MyPM;
});
```

**Without `define()`, Siebel cannot load your custom file!**

---

## Debugging Open UI

### Debugging Techniques

| Technique | Description |
|-----------|-------------|
| Browser DevTools | Verify JS/CSS download in Network tab |
| `SiebelJS.Log()` | Log messages to console |
| `debugger;` statement | Add breakpoints in script |
| Console Check | Type `SiebelAppFacade` to verify classes loaded |

### Verify JS Class is Loaded
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `SiebelAppFacade`
4. If object returns, classes are loaded

### Common Issues: JS Not Downloading

| Issue | Solution |
|-------|----------|
| Not in Manifest Administration | Register in Manifest Files |
| Syntax error in JS | Use JSHint/JSLint to validate |
| Missing `define()` method | Add proper define structure |
| Cache not cleared | Clear browser + Siebel cache |

### Best Practices for Debugging
1. ✅ Use JSHint/JSLint before deployment
2. ✅ Remove `debugger` and `SiebelJS.Log()` before production
3. ❌ **Avoid `alert()`** - visible to end users
4. ✅ Test with all browser/device combinations

---

## CSS Styling

CSS (Cascading Style Sheets) provides styling for Open UI elements.

**Benefits:**
- Reusable across multiple pages
- Easy to modify in one place
- Consistent look and feel
- Separation of style from logic

**Example - Custom Button Styling:**
```css
.siebui-btn-custom {
    background-color: #4CAF50;
    color: white;
    border-radius: 4px;
    padding: 8px 16px;
}

.siebui-btn-custom:hover {
    background-color: #45a049;
}
```

---

## Interview Questions

**Q: Can we call Business Service from PM or PR JS file?**
> Yes. Use `SiebelApp.S_App.GetService("ServiceName")` to get BS handle.

**Q: Can traditional browser script and Open UI PM/PR work together?**
> Yes, but Oracle recommends migrating to Open UI architecture.

**Q: What is the purpose of 'Define' method? Is it mandatory?**
> It identifies modules for loading PM/PR files. **Yes, it's mandatory.**

**Q: How to verify JavaScript Class is properly loaded?**
> Type `SiebelAppFacade` in browser Console. If object returns, classes are loaded.

---

## Best Practices

1. **Prefer PW over PR:** Use Plugin Wrapper for field changes. PR only for full layout changes.
2. **No Business Logic in PR:** PR renders only. Logic belongs in PM.
3. **Use CSS files:** Don't inline styles in JS. Load CSS via manifest.
4. **Always use Define():** Required for PM/PR files to load.
5. **Namespace your code:** Use `SiebelAppFacade.MyCustomPR`.
6. **Remove debug code:** No `debugger` or `SiebelJS.Log()` in production.
