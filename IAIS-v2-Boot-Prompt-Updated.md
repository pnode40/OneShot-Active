# IAIS v2.0 – Updated Session Boot Prompt

You are now resuming development under the **IAIS v2.0 Accountability System** for the OneShot project.

**🔒 Load the following memory context before doing anything else:**

## Required Files (Verified Present):
1. `.cursor/system.mdc` – Global AI behavior rules and accountability architecture
2. `.cursor/project.mdc` – Project-specific context (OneShot MVP)
3. `oneshot-mvp/docs/features/IMPLEMENTED-FEATURES.md` – Current implementation status
4. `oneshot-mvp/docs/architecture/ai-behavioral-enforcement.md` – AI behavior rules and permissions
5. `oneshot-mvp/docs/architecture/implementation-patterns.md` – Approved code patterns
6. `oneshot-mvp/justified-over-budget.json` – Complexity budget overrides
7. `oneshot-mvp/CHANGE-LOG.md` – Last documented changes (v2.0.0-IAIS)

## Optional Files (Create if missing):
8. `oneshot-mvp/docs/audit/Session-Logs.md` – Session history tracking
9. `oneshot-mvp/docs/audit/Verification-Checklist.md` – Verification protocols
10. `oneshot-mvp/docs/system/traffic-light-status.json` – System health status

**🔁 Then:**

* Run system verification: `npm run quick-check` (replaces verify-boot-protocol)
* Check complexity budget: Review `justified-over-budget.json` for >90% files
* Verify no `system-lock.json` exists (hard blocker if present)
* Log the session as `OPEN_ACTIVE` in Session-Logs.md (create if missing)
* Report current system status and any warnings
* Only proceed if system health is **≥ Yellow** and all critical files loaded

**🔐 System Health Gates:**
- **GREEN**: npm run quick-check passes + no critical issues
- **YELLOW**: Some warnings but operational (complexity overrides OK if justified)
- **RED**: Critical failures or missing required files (STOP operations)

**🔒 Current System Status (Verified):**
- Health Score: 5/5 (100%) ✅
- Implementation Status: COMPLETE ✅
- Complexity Budget: All overrides justified by Eric ✅
- Last Audit Score: 95/100 (EXCELLENT) ✅

**🔐 Final Instruction:**
You are **not to self-optimize, self-correct, or bypass system rules** unless explicitly authorized in-session. Operate **strictly within the IAIS v2.0 guardrails**.

## Available Verification Commands:
```bash
npm run quick-check        # 30-second system verification
npm run health            # System health check
npm run lint              # Code quality check
npm run simplicity        # Complexity monitoring
npm run validate          # Full validation suite
```

## Critical File Protection:
- **NEVER** modify `.cursor/` directory
- **NEVER** delete `.md` files without explicit permission
- **NEVER** alter `method-removal-audit.md` or `pattern-change-audit.md`
- **ALWAYS** update documentation for any structural changes

## Emergency Protocols:
- If `system-lock.json` exists: **STOP ALL WORK**
- If health check fails: **RESTORE INTEGRITY FIRST**
- If complexity >90%: **REFUSE STRUCTURAL CHANGES**
- If missing critical files: **RECREATE OR RESTORE** 