# OneShot MVP Startup Scripts

## Quick Usage

From your `OneShot-Active` directory, you can now start the server in multiple ways:

### PowerShell (Recommended)
```powershell
# Basic start
.\start-server.ps1

# Development mode
.\start-server.ps1 dev

# Quick start (minimal output)
.\quick-start.ps1

# System health check
.\start-server.ps1 health

# Run tests
.\start-server.ps1 test

# Verify a profile
.\verify-profile.ps1 marcus-johnson

# Log feature completion
.\log-feature.ps1 feat profile-generator
.\log-feature.ps1 fix server-startup -Interactive

# Complete feature workflow (IAIS v2.0)
.\complete-feature.ps1 athlete-slug
```

### Command Prompt (Alternative)
```cmd
REM Basic start
start-server.bat

REM Development mode
start-server.bat dev

REM Quick start
start-server.bat quick

REM System health check
start-server.bat health
```

## What These Scripts Do

1. **Automatically navigate** to the `oneshot-mvp` directory
2. **Check for dependencies** and install them if missing
3. **Start the server** using the appropriate npm script
4. **Handle errors gracefully** with clear messages
5. **Return to original directory** when done

## Script Files

- `start-server.ps1` - Full-featured PowerShell launcher with options
- `start-server.bat` - Windows batch file version (works in CMD)
- `quick-start.ps1` - Minimal PowerShell script for fastest startup
- `generate-marcus.ps1` - Example profile generation script
- `verify-profile.ps1` - IAIS v2.0 verification script for profiles
- `log-feature.ps1` - IAIS v2.0 changelog automation script
- `complete-feature.ps1` - IAIS v2.0 feature completion orchestrator

## Profile Generation & Verification

### Generate a Profile
```powershell
# Generate Marcus Johnson example
.\generate-marcus.ps1

# Or create your own profile script with athlete data
```

### Verify a Profile
```powershell
# Verify the Marcus Johnson profile
.\verify-profile.ps1 marcus-johnson

# Verify any other profile by slug
.\verify-profile.ps1 athlete-name
```

The verification script checks:
- ✅ Server health (responds on port 3000)
- ✅ Profile file exists (HTML generated successfully)
- ✅ QR code present (embedded PNG data found)

## IAIS v2.0 Changelog Automation

### Log Feature Completion
```powershell
# Automatic entry with smart defaults
.\log-feature.ps1 feat profile-generator
.\log-feature.ps1 fix server-startup
.\log-feature.ps1 chore refactor-validation
.\log-feature.ps1 docs api-endpoints

# Interactive mode for custom details
.\log-feature.ps1 feat new-feature -Interactive
```

### Changelog Features
- **Automatic timestamps** - Each entry includes completion date
- **Intelligent defaults** - Context-aware content based on type/scope
- **IAIS v2.0 format** - Includes "What/How/Verified/4-Questions" sections
- **Proper ordering** - New entries appear at top of changelog
- **Error handling** - Validates input and creates missing directories

The changelog captures:
- 📝 What was built (feature description)
- 🔧 How it was implemented (technical approach)
- ✅ How it was verified (testing methods)
- 🎯 IAIS 4-question test results

## IAIS v2.0 Feature Completion Orchestrator

### Complete Feature Workflow
```powershell
# Run full post-feature automation
.\complete-feature.ps1 athlete-name

# This automatically:
# 1. Verifies profile generation works
# 2. Logs changelog entry
# 3. Provides system checkpoint prompt for Claude
```

### What the Orchestrator Does
1. **Profile Verification** - Runs all quality checks
2. **Changelog Logging** - Creates feature completion entry
3. **System Checkpoint** - Provides Claude prompt for anti-drift verification

The orchestrator provides this checkpoint prompt:
```
🚨 SYSTEM CHECKPOINT — Before we proceed, confirm that the full Anti-Drift System was run:

1. ✅ Was the reload routine executed?
2. 📓 Was the changelog updated?
3. 📚 Was documentation synced?
4. 🧠 Was the AI context file refreshed?
5. 🧪 Did tests run and pass (with coverage noted)?
6. 🔐 Were all auth rules or pattern constraints enforced?
7. 📊 What's the current system health status?

Do not proceed to next task until these are confirmed.
```

## NPM Script Integration

You can also use npm scripts directly from the `oneshot-mvp` directory:

```bash
# Profile-specific automation
npm run profile-complete marcus-johnson
npm run verify-profile marcus-johnson
npm run log-feature feat profile-generator

# System automation (existing)
npm run feature-complete
npm run system-health
npm run ai-refresh
```

## Troubleshooting

### PowerShell Execution Policy
If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Permission Issues
If the scripts won't run, make them executable:
```powershell
# In PowerShell as Administrator
Unblock-File .\start-server.ps1
Unblock-File .\quick-start.ps1
Unblock-File .\verify-profile.ps1
Unblock-File .\log-feature.ps1
Unblock-File .\complete-feature.ps1
```

### Still Having Issues?
Try the batch file version instead:
```cmd
start-server.bat
```

## Server URLs After Startup

Once running, your server will be available at:
- **Main Server**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Endpoint**: http://localhost:3000/api/generate-profile
- **Generated Profiles**: http://localhost:3000/profiles/

## Complete IAIS v2.0 Workflow

```powershell
# 1. Start server
.\start-server.ps1

# 2. Build feature (via Menu-Driven Development)
# ... implement feature ...

# 3. Run complete post-feature automation
.\complete-feature.ps1 athlete-name

# 4. Follow Claude checkpoint prompt
# ... confirm anti-drift system status ...

# 5. Continue to next feature
```

This workflow ensures:
- ✅ **Quality verification** - Every feature is tested before completion
- 📝 **Documentation consistency** - All changes tracked in changelog
- 🎯 **System integrity** - Anti-drift checks prevent technical debt
- 🚀 **Development velocity** - Automated post-feature tasks

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the server gracefully. 