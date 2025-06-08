# OneShot Development Tools

Simple PowerShell scripts to get your local development server running smoothly.

## Quick Start

### 🚀 Start the Server
```powershell
.\devtools\start-dev.ps1
```
Double-click the file or run it from PowerShell. This will:
- Check your project setup
- Ensure dependencies are installed
- Start the OneShot development server

### 🔍 Check Server Health
```powershell
.\devtools\health.ps1
```
Use this anytime to verify your server is running properly.

## Requirements

- **Run from project root** (the main OneShot folder)
- **Environment file**: Make sure `.env` exists in the `/server` folder
  - Copy `server/env.example` to `server/.env` if needed

## Accessing Your App

Once the server starts successfully:
- **Main application**: http://localhost:3000
- **Profile creator**: http://localhost:3000/create-profile.html

## Troubleshooting

- **Server won't start?** Run `health.ps1` to see what's missing
- **Permission errors?** Right-click PowerShell → "Run as Administrator"
- **Still stuck?** Check that you're in the main project folder (not a subfolder)

---
*These tools are designed to "just work" - no technical expertise required!* 