# Siebel Development Skill

A comprehensive AI agent skill for Siebel CRM development, covering configuration, scripting, workflows, integration, and troubleshooting.

## 📦 Installation

Install this skill into your AI agent (Cursor, Windsurf, etc.) using the `skills` CLI:

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

### 💡 Example: Cascading Picklists
**User:** "What is the best way to implement a cascading picklist?"

**Agent Answer:**
> The best standard way is to use a **Constrained Picklist** (no scripting required).
> 
> 1. **Data Setup**: Ensure your Child LOVs have a "Parent" value pointing to the Parent LOV.
> 2. **Configuration**:
>    - On the Child Picklist object, add a **Search Specification**:
>      ```
>      [Parent Type] = LookupValue('PARENT_LOV_TYPE', GetFieldValue('Parent Field Name'))
>      ```
>    - This forces the child picklist to strict-filter based on the parent field's value.

## 📚 Reference Documentation

The skill includes detailed references found in the `references/` directory:

- [Configuration Guide](references/configuration.md)
- [Scripting Guide](references/scripting.md)
- [Workflow Guide](references/workflows.md)
- [Integration Guide](references/integration.md)
- [Open UI Guide](references/open-ui.md)
- [Troubleshooting Guide](references/troubleshooting.md)
