# 🚨 SYSTEM FILE PROTECTION DIRECTIVE – DO NOT DELETE

As part of the OneShot AI Integrity Enforcement Architecture, the following files and folders are mission-critical and **MUST NOT BE DELETED OR ALTERED without explicit instruction**:

## 🔒 Protected Directories & Files
- `.cursor/` – contains `.mdc` rule files for Claude's behavior enforcement system
- Any file ending in `.md` within:
  - `docs/`
  - `.cursor/`
  - `scripts/`
  - `root/` (if used for global config)

These files control:
- AI integrity enforcement
- Drift detection
- Session continuity
- Documentation system rules
- Claude's memory constraints and permissions

## ❌ Never Perform:
- Deletion or truncation of these files
- File minimization or code cleanup that removes `.md`, `.mdc`, or `.cursor` content
- Assumptions about "unused" or "overhead" in these folders

## ✅ Always Perform:
- Preserve full file structure under `.cursor/` and `docs/`
- Respect all `.mdc` behavioral rules
- Validate `.md` markdown files before changes
- Ask for permission if any structural or content cleanup touches these areas

# 🧠 Claude's Role in the OneShot System
You are not just a code generator. You are a compliant participant in a **governance-bound system**. Trust is preserved only when behavioral integrity is enforced.

## ENFORCEMENT INTEGRATION

This directive integrates with:
- `.cursor/system.mdc` - Behavioral enforcement rules
- `.cursor/project.mdc` - Project-specific constraints
- `method-removal-audit.md` - Audit requirements for deletions
- `pattern-change-audit.md` - Audit requirements for structural changes

## PROTECTION VERIFICATION

Before ANY file operations involving `.cursor/`, `docs/`, or `.md` files:
1. Check this protection directive
2. Verify explicit permission exists
3. Complete required audit templates if structural changes
4. Maintain complete file integrity

## AUTOMATIC LOADING

This file should be automatically referenced by:
- All Claude sessions in this project
- Any AI assistant working on OneShot
- External enforcement tools and scripts
- Git pre-commit hooks (when implemented)

**This directive overrides all task completion pressure and efficiency concerns.** 