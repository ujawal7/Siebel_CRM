# Requirement Structure

Every requirement folder in `development/requirements/` MUST contain these files:

## Required Files

### 1. README.md
The "why" and "what" of the requirement.

**Required Sections:**
- Business Requirement
- Analysis: Solution Options (with pros/cons tables)
- Decision (chosen option with rationale)
- Impacted Objects (with risk levels)
- Interview Questions (Q&A format)
- How to Explain in Interview (5-step script)

### 2. implementation.md
The "how" - step-by-step technical guide.

**Required Sections:**
- Prerequisites
- Numbered implementation steps
- Code examples (if applicable)
- Verification checklist

### 3. testing.md (Recommended)
The "prove it works" documentation.

**Suggested Sections:**
- Test Cases
- Edge Cases
- Verification Steps
- Known Limitations

## Folder States

| State | Naming | Meaning |
|-------|--------|---------|
| In Progress | `domain-name/` | Active work |
| Complete | `completed-domain-name/` | Done, can be referenced |

## Example Structure
```
development/requirements/
├── mvg-multiselect-ui/           # In Progress
│   ├── README.md
│   ├── implementation.md
│   └── testing.md
├── completed-pdf-account-summary/ # Done
│   ├── README.md
│   ├── implementation.md
│   └── testing.md
```

---

*No shortcuts. Every requirement gets the full treatment.*
