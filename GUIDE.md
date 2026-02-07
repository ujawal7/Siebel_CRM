# Siebel Skill Maintenance Guide

This guide explains how to use the new structure and tools in your Siebel Skill repository.

## 1. Repository Structure

We have aligned the structure with your project workflow:

- **`core-concepts/`**: Deep dive documentation (formerly `references/`).
- **`quick-reference/`**: Cheat sheets and syntax guides.
- **`templates/`**: Standard templates for new files.
- **`commands/`**: Tools for the AI agent (and you).
- **`scripts/`**: Helper scripts for validation.

## 2. Using the Scaffolding Tool

When you start a new requirement, don't copy-paste folders manually. Use the scaffolder:

```bash
# From the repository root
node commands/scaffold.js my-new-requirement
```

This will create:
- `development/requirements/my-new-requirement/README.md` (from template)
- `development/requirements/my-new-requirement/DECISIONS.md` (from template)
- `development/requirements/my-new-requirement/implementation.md` (empty)
- `development/requirements/my-new-requirement/assets/` (empty folder)

## 3. Validating Manifests

To quickly check if your Open UI manifest is valid XML:

```bash
./scripts/validate-manifest.sh /path/to/manifest.xml
```

## 4. The Harvesting Workflow

To keep this skill "smart", follow this weekly routine:

1. **Review** your active project (e.g., `Siebel_x1`).
2. **Identify** new patterns or solved problems.
3. **Generalize** the solution into a generic markdown file.
4. **Add** it to `core-concepts/` or `quick-reference/`.
5. **Commit & Push** this repository.

## 5. Adding New Templates

If you find yourself creating the same file over and over, add it to `templates/` and update `commands/scaffold.js` to include it.
