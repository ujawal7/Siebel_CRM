---
name: siebel-development
description: >
  Comprehensive Siebel CRM development skill for configuration, scripting, workflow, 
  and integration requirements. Use when: (1) Creating/modifying Siebel workflows,
  (2) Writing eScript or Business Services, (3) Configuring BCs, Applets, MVGs, Links,
  or Picklists, (4) Building REST/SOAP integrations, (5) Setting up Runtime Events,
  (6) Troubleshooting Siebel issues, or (7) Any Siebel CRM development task.
---

# Siebel Development

## Development Workflow

For any Siebel requirement, follow this approach. To start, use the **[New Requirement Workflow](commands/new-requirement.md)**.

1. **Understand** - Clarify the business requirement and identify affected objects
2. **Design** - Choose the right approach (Configuration vs Scripting vs Workflow)
3. **Implement** - Build using appropriate Siebel tools
4. **Test** - Validate in Siebel client
5. **Document** - Create implementation notes

## Coding Standards

> **🚨 MANDATORY:** Always use **Oracle Courseware Style**. See [Coding Standards](rules/coding-standards.md).

## Decision Guide

| Requirement Type | Primary Approach | Reference |
|------------------|------------------|-----------|
| Data automation on save/create | Runtime Event + Workflow | [workflows.md](core-concepts/workflows.md) |
| Field calculations/validations | BC Script or Calculated Field | [scripting.md](core-concepts/scripting.md) |
| External API calls | EAI HTTP Transport + BS | [integration.md](core-concepts/integration.md) |
| UI behavior changes | Open UI PM/PR | [open-ui.md](core-concepts/open-ui.md) |
| Scheduled/batch processing | Workflow Policy | [workflows.md](core-concepts/workflows.md) |
| Multi-step business process | Service Flow Workflow | [workflows.md](core-concepts/workflows.md) |

## 🧭 Decision Principles

When answering, the agent should:
- Prefer configuration over scripting
- Prefer server-side logic over browser script
- Avoid performance-heavy patterns by default
- Clearly state trade-offs when multiple solutions exist
- Highlight risks in production scenarios

## 🎓 Answer Style

- Explain WHY before HOW
- Use enterprise terminology
- Assume production scale
- Mention performance and maintenance impact
- Avoid tutorial-style explanations unless asked

## Quick Patterns

### Trigger Workflow on Record Save
```
1. Create Workflow (Business Object = target BO)
2. Create Runtime Event: Object=BusComp, Event=WriteRecord
3. Create Action Set: Service=Workflow Process Manager, Method=RunProcess
```

### Call REST API from Siebel
```
1. Create Business Service with eScript
2. Use EAI HTTP Transport: SendReceive method
3. Set: HTTPRequestURLTemplate, HTTPRequestMethod, HTTPContentType
```

### Open UI: Conditional Display by User Profile
```
1. Get SessionAccessService, call GetProfileAttr
2. Check resultSet.GetProperty("Value")
3. Show/hide UI based on result
```

→ **Full patterns:** [Open UI Patterns](references/open-ui-patterns.md)

## Reference Files

| Domain | Reference | When to Read |
|--------|-----------|--------------|
| **Open UI Patterns** | [open-ui-patterns.md](references/open-ui-patterns.md) | PM-PR code, Google Maps, Charts, Color-coding |
| **Business Services** | [business-services.md](references/business-services.md) | SessionAccessService, EAI, Helper methods |
| **Coding Standards** | [coding-standards.md](rules/coding-standards.md) | Oracle courseware style rules |
| Workflows | [workflows.md](core-concepts/workflows.md) | Creating workflow processes |
| Integration | [integration.md](core-concepts/integration.md) | REST/SOAP calls, EAI |
| Scripting | [scripting.md](core-concepts/scripting.md) | eScript, Business Services |
| Configuration | [configuration.md](core-concepts/configuration.md) | BC, Applet, Links, Picklists |
| Runtime Events | [runtime-events.md](core-concepts/runtime-events.md) | Triggers and action sets |
| Open UI Theory | [open-ui.md](core-concepts/open-ui.md) | PM, PR, Manifest concepts |
| Troubleshooting | [troubleshooting.md](core-concepts/troubleshooting.md) | Debugging issues |

## Key Siebel Objects Hierarchy

```
Application
└── Business Object (BO)
    └── Business Component (BC) ──► Table
        ├── Fields ──► Columns
        ├── Links ──► Parent-Child relationships
        └── Applet ──► UI display
```

## Skill-Building Framework (Mentorship Mode)

For complex requirements, create a `skill_building.md` using this 8-section framework:

1. **Requirement Breakdown** - Rewrite in simple technical terms
2. **Impact Analysis** - Identify ALL impacted objects
3. **Implementation Strategy** - Step-by-step in correct sequence
4. **Skill Upgrade** - Concepts this strengthens
5. **Edge Cases & Performance** - Possible issues
6. **Testing Strategy** - Unit and negative tests
7. **Deployment Checklist** - Pre/post checks
8. **Interview Angle** - How to explain in interview

## Repository Organization

| Folder | Purpose |
|--------|---------|
| `core-concepts/` | Theory & fundamentals |
| `references/` | Oracle courseware patterns |
| `rules/` | Non-negotiable standards |
| `commands/` | Agent workflow entry points |
| `templates/` | Boilerplate files |

### Requirement Folder Structure
```
domain-name/
├── README.md           # Analysis, decision, interview guide
├── implementation.md   # Implementation steps & code
├── testing.md          # Verification steps
└── assets/             # Screenshots, diagrams
```

## Best Practices Summary

1. **Configuration over Scripting:** Prefer User Properties, Calculated Fields, Workflows
2. **Naming Convention:** Use `X_` prefix for custom columns
3. **Open UI:** Use Plugin Wrappers for field changes; PR for layout
4. **Testing:** Test in all supported locales
5. **Manifest:** Double-check registration—silent failures common
6. **Code Style:** Follow Oracle Courseware patterns
