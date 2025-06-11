# 🚨 OneShot Application Recovery Plan

## Current State Assessment

Based on the comprehensive audit, the OneShot application is experiencing multiple interconnected issues that are preventing successful deployment. The good news is that the core architecture is sound, and all issues are configuration-related rather than fundamental design flaws.

## 🎯 Recovery Strategy Overview

We'll follow a systematic approach to fix issues in order of dependency. The plan is divided into 5 phases:

1. **Phase 1: Environment Stabilization** (Immediate)
2. **Phase 2: Dependency Resolution** (30 minutes)
3. **Phase 3: Configuration Fixes** (30 minutes)
4. **Phase 4: Testing & Verification** (30 minutes)
5. **Phase 5: Deployment Preparation** (30 minutes)

---

## 📋 Phase 1: Environment Stabilization (Immediate)

### Objective
Create a clean, stable environment free from port conflicts and cache corruption.

### Tasks

1. **Kill All Node Processes**
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. **Clear ALL Caches**
   ```powershell
   # Next.js cache
   Remove-Item -Path "apps/web/.next" -Recurse -Force -ErrorAction SilentlyContinue
   
   # npm cache
   npm cache clean --force
   ```

3. **Fix Port Conflicts**
   - Change API port from 5000 to 5001 (already done in index.js)
   - Ensure .env file has PORT=5001

### Success Criteria
- No node processes running
- All cache directories removed
- Ports 3000 and 5001 available

---

## 📋 Phase 2: Dependency Resolution

### Objective
Ensure all dependencies are correctly installed and configured for Tailwind CSS v4.

### Issues to Fix
- Error: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"
- Missing @tailwindcss/postcss package (though it shows as installed)
- QR code import errors

### Tasks

1. **Verify PostCSS Configuration**
   - Check postcss.config.mjs syntax
   - Ensure @tailwindcss/postcss is properly configured

2. **Fix Tailwind Setup**
   - Verify globals.css has correct directives
   - Check tailwind.config.js content paths

3. **Remove Unused Dependencies**
   ```bash
   npm uninstall qrcode.react --workspace=apps/web
   ```

4. **Clean Reinstall**
   ```bash
   npm ci
   ```

### Success Criteria
- No Tailwind CSS compilation errors
- All dependencies resolved
- No import errors

---

## 📋 Phase 3: Configuration Fixes

### Objective
Fix all configuration issues including icons, Next.js config, and environment variables.

### Tasks

1. **Fix Icon Files**
   The current icon files are SVG content with .png extensions. Options:
   - **Option A**: Generate proper PNG files from SVG
   - **Option B**: Rename to .svg and update manifest.json
   - **Option C**: Create simple PNG icons

2. **Update Next.js Configuration**
   - Remove invalid `allowedDevOrigins` from experimental section
   - Clean up any deprecated options

3. **Complete Environment Setup**
   ```bash
   # apps/api/.env
   DATABASE_URL=postgresql://localhost:5432/oneshot
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=dev-secret-key-change-in-production
   SENDGRID_API_KEY=SG.fake-key-for-development
   SENDGRID_FROM_EMAIL=noreply@oneshot.com
   ```

### Success Criteria
- No 404 errors for icons
- No Next.js warnings
- API starts on port 5001

---

## 📋 Phase 4: Testing & Verification

### Objective
Verify all components work correctly before deployment.

### Test Checklist

1. **Service Startup**
   - [ ] API starts on port 5001
   - [ ] Web app starts on port 3000
   - [ ] No port conflicts

2. **Route Testing**
   - [ ] / redirects to /test-profile
   - [ ] /test-profile loads correctly
   - [ ] /athlete/jordan-davis loads correctly
   - [ ] API health check responds at http://localhost:5001/health

3. **Browser Console**
   - [ ] No 404 errors
   - [ ] No JavaScript errors
   - [ ] Icons load properly

4. **Build Test**
   ```bash
   npm run build
   ```

### Success Criteria
- All routes accessible
- No console errors
- Build completes successfully

---

## 📋 Phase 5: Deployment Preparation

### Objective
Prepare for production deployment on Vercel.

### Tasks

1. **Security**
   ```bash
   npm audit fix
   ```

2. **Documentation**
   - Update README.md
   - Create .env.example files
   - Document deployment steps

3. **Production Config**
   - Set up Vercel environment variables
   - Configure production database
   - Set up proper domain

### Success Criteria
- No security vulnerabilities
- Documentation complete
- Ready for deployment

---

## 🚦 Quick Reference

### If Things Go Wrong

**Complete Reset Command:**
```powershell
./clean-start.ps1 --full
```

**Manual Reset:**
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Path "apps/web/.next" -Recurse -Force -ErrorAction SilentlyContinue
npm install
npm run dev
```

### Common Issues

1. **Port in use**: Change port in .env file
2. **Tailwind errors**: Check @tailwindcss/postcss installation
3. **Icon errors**: Verify files in public/ directory
4. **Cache errors**: Delete .next directory

---

## 🎯 Expected Timeline

- **Total Time**: ~2-3 hours
- **Active Work**: ~1.5 hours
- **Testing**: ~30 minutes
- **Buffer**: ~1 hour for issues

---

## 🤝 Let's Discuss

Before we begin:

1. **Which icon solution do you prefer?**
   - Generate PNGs from existing SVG content
   - Use SVG files directly
   - Create new simple PNG icons

2. **Do you have PostgreSQL installed?**
   - If not, we can use SQLite for now
   - Or skip database testing

3. **Deployment target?**
   - Vercel (recommended for Next.js)
   - Other platform?

4. **Any specific concerns or priorities?**

Once we agree on the approach, I can execute this plan phase by phase, with verification at each step.

# 🔧 RECOVERY PLAN – ONE SHOT

## Current Commit
`0c14319` – WORKING BUILD (confirmed with 200 OK responses)

## Verified Fixes
- ✅ Replaced bad QR import with default `qrcode`
- ✅ Tailwind v3 restored
- ✅ PostCSS plugin errors removed
- ✅ Styles load and compile as expected
- ✅ Port conflict resolved: API using PORT=5001 from .env
- ✅ `allowedDevOrigins` not found in any current config; assumed removed during prior recovery step
- ✅ PWA icons converted from SVG to proper PNG format (192x192 and 512x512)
- ✅ Environment variable usage verified consistent and compliant

## Fix Queue
1. 📝 Environment Documentation
   - Create .env.example templates
   - Update README with setup steps
   - Document all required variables

2. 🏗️ Build Process Hardening
   - Implement verification scripts
   - Add proper logging
   - Document deployment process

## Rules
- One fix ➝ verify ➝ lock ➝ proceed
- No fix stacking
- No upgrades without explicit justification
- No cache clearing unless linked to logged error 