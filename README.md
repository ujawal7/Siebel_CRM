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

### 💡 Skill Example: Implementing Cascading Picklists (Step-by-Step)
**User:** "How do I create a Country -> State cascading picklist?"

**Agent Guide:**
**Scenario**: User selects "USA" in *Country*, and *State* dropdown automatically filters to show only US states.

**Step 1: Data Administration (LOV Setup)**
1. Navigate to **Administration - Data > List of Values**.
2. Create Parent Values (Type: `COUNTRY_LOV`):
   - Display: `USA`, LIC: `USA`
3. Create Child Values (Type: `STATE_LOV`):
   - Display: `California`, LIC: `CA`, **Parent LIC**: `USA`
   - Display: `Texas`, LIC: `TX`, **Parent LIC**: `USA`
   > *Key Point: The link is defined in the 'Parent LIC' column of the child record.*

**Step 2: Tools Configuration (Picklists)**
1. **Parent Field** (`Country`): Use a standard Static Picklist pointing to `COUNTRY_LOV`.
2. **Child Field** (`State`): Create a new Picklist (e.g., `PickList State Constrained`).
   - Business Component: `PickList Generic`
   - **Search Specification** (The Critical Logic):
     ```
     [Parent Type] = LookupValue('COUNTRY_LOV', GetFieldValue('Country'))
     ```
     *Translation: "Show me records from PickList Generic where the 'Parent Type' column matches the Language Independent Code (LIC) of the value currently selected in the 'Country' field."*

**Step 3: BC Field Configuration**
1. Select the `State` field.
2. Set **Picklist** to `PickList State Constrained`.
3. Set **Pick Map**:
   - Field: `State`, Pick Field: `Value`

**Step 4: User Experience Tweak**
1. Select the `Country` field.
2. Set User Property **Immediate Post Changes** = `TRUE`.
   > *Reason: This ensures the Country value is saved to the buscomp immediately. Without this, the State picklist won't "see" the new Country value until the user steps off the record.*

## 📚 Reference Documentation

The skill includes detailed references found in the `references/` directory:

- [Configuration Guide](references/configuration.md)
- [Scripting Guide](references/scripting.md)
- [Workflow Guide](references/workflows.md)
- [Integration Guide](references/integration.md)
- [Open UI Guide](references/open-ui.md)
- [Troubleshooting Guide](references/troubleshooting.md)
