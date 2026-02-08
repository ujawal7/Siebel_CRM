# Coding Standards

> **🚨 MANDATORY:** Always use **Oracle Courseware Style** first. Concise, interview-ready code that matches Siebel training materials. No over-engineering!

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Concise** | Minimal code, no over-engineering. 20 lines > 80 lines |
| **Oracle Pattern** | Use `SiebelAppFacade.ClassName.superclass.Init.apply(this)` inheritance |
| **IIFE Wrapper** | Wrap in `(function() { ... }());` for encapsulation |
| **Namespace Check** | Always check `typeof(SiebelAppFacade.MyClass) == "undefined"` |
| **Event Binding** | Use `AddMethod()` for PM events |

---

## PM-PR Separation Rule

```
PM = Logic (get data, set properties, business rules)
PR = UI (DOM manipulation, click handlers, styling)
```

---

## Oracle Courseware Patterns

| Pattern | Code |
|---------|------|
| **PM Init** | `this.AddMethod("ShowSelection", this.Handler, {sequence:false, scope:this})` |
| **PM Property** | `this.AddProperty("MyProperty", "")` then `this.SetProperty("MyProperty", value)` |
| **PR Binding** | `this.AttachPMBinding("MyProperty", this.Handler)` |
| **Field Value** | `this.ExecuteMethod("GetFieldValue", controls["FieldName"])` |
| **Inheritance** | `SiebelAppFacade.MyClass.superclass.Init.apply(this, arguments)` |
| **Namespace** | `if (typeof(SiebelAppFacade.MyClass) === "undefined") { ... }` |

---

## Code Template

### PM Template
```javascript
if (typeof(SiebelAppFacade.CustAppletPM) === "undefined") {
    Namespace('SiebelAppFacade.CustAppletPM');
    
    define("siebel/custom/CustAppletPM", ["siebel/pmodel"],
    function (SiebelPM) {
        SiebelJSBuilder.Extend(SiebelAppFacade.CustAppletPM, SiebelPM);
        
        function CustAppletPM(proxy) {
            SiebelAppFacade.CustAppletPM.superclass.constructor.apply(this, arguments);
        }
        
        CustAppletPM.prototype.Init = function () {
            SiebelAppFacade.CustAppletPM.superclass.Init.apply(this, arguments);
            this.AddMethod("ShowSelection", this.SetMyProperty, {sequence:false, scope:this});
            this.AddProperty("MyProperty", "");
        };
        
        CustAppletPM.prototype.SetMyProperty = function () {
            // Your logic here
            this.SetProperty("MyProperty", value);
        };
        
        return CustAppletPM;
    });
}
```

### PR Template
```javascript
if (typeof(SiebelAppFacade.CustAppletPR) === "undefined") {
    Namespace('SiebelAppFacade.CustAppletPR');
    
    define("siebel/custom/CustAppletPR", ["siebel/phyrenderer"],
    function (SiebelPhyRender) {
        SiebelJSBuilder.Extend(SiebelAppFacade.CustAppletPR, SiebelPhyRender);
        
        function CustAppletPR(pm) {
            SiebelAppFacade.CustAppletPR.superclass.constructor.apply(this, arguments);
        }
        
        CustAppletPR.prototype.Init = function () {
            SiebelAppFacade.CustAppletPR.superclass.Init.apply(this, arguments);
            this.AttachPMBinding("MyProperty", this.UpdateUI);
        };
        
        CustAppletPR.prototype.UpdateUI = function () {
            // Your UI logic here
        };
        
        return CustAppletPR;
    });
}
```

---

## ❌ AVOID These Patterns

- Excessive CONFIG objects
- Multiple layers of abstraction
- Long verbose code when 20 lines will do
- AMD `define()` without Oracle inheritance pattern
- Mixing business logic in PR
- Inline styles in JavaScript (use CSS files)

---

## When to Use Each Style

| Use Case | Style |
|----------|-------|
| Learning, Interviews, Quick Fixes | Oracle Courseware (Classic) |
| Large Production Projects | AMD define() with Oracle inheritance |
| Single-purpose scripts | IIFE with Namespace |
