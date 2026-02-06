# Siebel Development Skill

A comprehensive AI agent skill for Siebel CRM development, covering configuration, scripting, workflows, integration, and troubleshooting.

## 📦 Installation

Install this skill into your AI agent (Cursor, Windsurf, Antigravity etc.) using the `skills` CLI:

```bash
npx skills add ujawal7/Siebel_CRM
```

## 🚀 Features

This skill equips your agent with deep knowledge of:

- **Configuration**: Best practices for BCs, Applets, Links, Joins, and MVGs.
- **Scripting**: eScript patterns, Business Services, and performance guardrails.
- **Workflows**: Process design, Runtime Events, and policy automation.
- **Integration**: REST/SOAP API guides, EAI Siebel Adapter, and Integration Objects.
- **Open UI**: PM/PR architecture and Manifest administration.
- **Troubleshooting**: Common error codes and debugging strategies.

## 📖 Usage

Once installed, you can ask your agent questions like:

- "How do I create a new Outbound REST integration in Siebel?"
- "Write a script to query the Service Request BC."
- "What is the best way to implement a cascading picklist?"
- "Debug this error: SBL-DAT-00215"

### 💡 Skill Example: Configuration + Scripting Scenario
**User:** "How do I add a button to assign a Service Request to myself?"

**Agent Guide:**
**Scenario**: User clicks "Assign To Me" button → Record Owner updates to current user.

**Step 1: Configuration (Tools)**
1. **Applet**: Go to `Service Request List Applet`.
2. **Control**: Add a Button.
   - Caption: `Assign To Me`
   - MethodInvoked: `AssignOwner` (Custom method name)
3. **Applet User Prop**: Enable the button.
   - Name: `CanInvokeMethod: AssignOwner`
   - Value: `TRUE`

**Step 2: Scripting (Server Script)**
Handle the custom method in the BC.

1. **Object**: `Service Request` Business Component
2. **Event**: `BusComp_PreInvokeMethod`
3. **Code**:
   ```javascript
   function BusComp_PreInvokeMethod (MethodName)
   {
       if (MethodName == "AssignOwner")
       {
           try
           {
               // 1. Set the Owner field to the current user's Login ID
               this.SetFieldValue("Owner Id", TheApplication().LoginId());
               
               // 2. Commit the record
               this.WriteRecord();
               
               // 3. CancelOperation = Tell Siebel "I handled it, don't look further"
               return (CancelOperation);
           }
           catch(e)
           {
               TheApplication().RaiseErrorText(e.toString());
           }
       }
       return (ContinueOperation);
   }
   ```

## 📚 Reference Documentation

The skill includes detailed references found in the `references/` directory:

- [Configuration Guide](references/configuration.md)
- [Scripting Guide](references/scripting.md)
- [Workflow Guide](references/workflows.md)
- [Integration Guide](references/integration.md)
- [Open UI Guide](references/open-ui.md)
- [Troubleshooting Guide](references/troubleshooting.md)

## 📌 Disclaimer

This repository contains my personal notes, expert summaries, and generalized Siebel CRM development patterns based on experience with Siebel. It is not official Oracle documentation and contains no client-specific or proprietary information. All content is written in my own words.
