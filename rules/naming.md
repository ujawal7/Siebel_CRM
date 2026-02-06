# Naming Conventions

## Repository Structure

| Type | Pattern | Example |
|------|---------|---------|
| Requirement Folder | `domain-short-desc` | `mvg-multiselect-ui` |
| Completed Requirement | `completed-domain-short-desc` | `completed-pdf-account-summary` |

## Folder Naming

- **All lowercase**
- **Hyphens** for word separation (not underscores)
- **No dates** in folder names (use git history)
- **Short but descriptive** (3-5 words max)

## File Naming

| Location | Pattern |
|----------|---------|
| `requirements/*/` | `README.md`, `implementation.md`, `testing.md` |


## Siebel Object Naming (in implementations)

| Object | Prefix | Example |
|--------|--------|---------|
| Business Service | `CRM ` | `CRM MVG Multiselect Service` |
| Workflow | `CRM ` or domain-specific | `CRM DMA Status Update WF` |
| LOV Type | `UPPERCASE_UNDERSCORES` | `DMA_REST_API_OUTBOUND` |
| JS Files | `camelCase` | `MultiselectPluginWrapper.js` |

---

*Consistency over creativity. Follow the pattern.*
