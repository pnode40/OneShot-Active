# OneShot

Modern monorepo for athlete profile generation with Express API and Next.js frontend.

## Architecture

```
oneshot/
├── apps/
│   ├── api/              ← Express + TypeScript backend (port 3001)
│   └── web/              ← Next.js + React frontend (port 3000)
├── packages/
│   ├── shared/           ← Shared utilities and business logic
│   └── types/            ← TypeScript type definitions
├── docs/                 ← Documentation and system files
└── package.json          ← Workspace root
```

## Quick Start (PowerShell Compatible)

```powershell
# Install dependencies
npm install

# Start development servers
cd apps/api
npm install
npm run dev

# In a new terminal
cd apps/web
npm install
npm run dev
```

## Environment Setup

### API Setup (apps/api)
1. Copy `.env.example` to `.env` in the `apps/api` directory
2. Configure required variables:
   ```
   PORT=5001
   NODE_ENV=development
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret
   JWT_EXPIRES_IN=24h
   FRONTEND_URL=http://localhost:3000
   SENDGRID_API_KEY=your_key
   SENDGRID_FROM_EMAIL=your_email
   CONTACT_EMAIL_RECIPIENT=your_email
   ```

### Web Setup (apps/web)
1. Copy `.env.example` to `.env.local` in the `apps/web` directory
2. Configure required variable:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

## Development

### API
- Runs on port 5001
- Health check: `http://localhost:5001/health`
- Supports hot reload

### Web
- Runs on port 3000
- Next.js development server
- Supports hot reload

## Health Verification

```powershell
# From project root
npm run health        # Check system health
npm run lint         # Verify code style
npm test            # Run test suite
```

## System Requirements
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- PowerShell (Windows) or Bash (Unix)

## Deployment

- **API**: Deploys to Vercel as serverless functions
- **Web**: Deploys to Vercel as static site with SSR
- **Database**: Configure your preferred database provider

## Scripts

- `npm run dev` - Start both API and web
- `npm run build` - Build all apps
- `npm run test` - Run tests across all packages
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all build artifacts
 