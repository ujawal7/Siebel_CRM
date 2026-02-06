# New Requirement Workflow

## When to Use
Starting a new Siebel business requirement.

---

## Steps

### 1. Create Folder
```bash
mkdir -p development/requirements/<domain-short-desc>
```
Example: `development/requirements/mvg-multiselect-ui`

### 2. Create README.md
Use this template:

```markdown
# [Requirement Title]

**Date:** YYYY-MM-DD | **Status:** In Progress

---

## Business Requirement
[What the business needs]

---

## Analysis: Solution Options

### Option A: [Name]
[Description]

| Pros | Cons |
|------|------|
| ... | ... |

### Option B: [Name] ✅ Recommended
[Description]

| Pros | Cons |
|------|------|
| ... | ... |

---

## Decision
**→ Option [X]** because [rationale]

---

## Questions for Business Analyst
1. [Question]
2. [Question]

---

## Impacted Objects

| Object | Purpose | Risk |
|--------|---------|------|
| ... | ... | 🟢/🟡/🔴 |

---

## See Also
→ [implementation.md](./implementation.md)
```

### 3. Create implementation.md
Create empty file, fill during implementation.

### 4. Update DECISIONS.md
Add a row for the key decision made.

---

*Follow [rules/requirement-structure.md](../rules/requirement-structure.md) for required sections.*
