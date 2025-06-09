# 🏈 OneShot Team Testing Guide

## 🚀 Quick Start (2 minutes)

### For Your Son's Team Testing:

1. **Open in Browser**: `http://localhost:3000/test-profile`
2. **Test Mobile**: Scan this QR with your phone 📱
3. **Switch Profiles**: Click between "Test Player 1" and "Test Player 2"

## ✅ What to Test

### 📱 Mobile Experience
- [ ] QR code scanning works
- [ ] Profile loads fast on mobile
- [ ] "Add to Homescreen" option appears
- [ ] Contact card download works
- [ ] Share button functions

### 🏃‍♂️ Profile Features  
- [ ] All stats display correctly
- [ ] Photos load properly
- [ ] Video links work
- [ ] Profile switching is smooth

### 🎯 Recruiter Simulation
- [ ] Profile looks professional 
- [ ] Key info visible in <5 seconds
- [ ] QR code readable from printed paper
- [ ] Contact info downloads properly

## 🔧 Available Test Pages

- **`/test-profile`** - Main testing dashboard
- **`/athlete/1`** - Individual profile view
- **`/athlete/2`** - Second test profile
- **`/dashboard`** - Authenticated dashboard (after login)
- **`/register`** - Sign up flow

## 📝 Team Feedback Form

**What works great?**
- [ ] QR scanning
- [ ] Mobile display
- [ ] Profile switching
- [ ] Contact download

**What needs fixing?**
- [ ] Loading speed
- [ ] Mobile layout
- [ ] Missing features
- [ ] Confusing parts

## 🏁 Ready for Real Use?

Once testing looks good:
1. Athletes create accounts at `/register`
2. Fill out profiles at `/dashboard/profile` 
3. Generate QR codes for recruiting
4. Share profiles with coaches

---
**Need Help?** The system auto-detects issues and uses mock data if API is down. 