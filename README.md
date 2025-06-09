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

## Quick Start

```bash
# Install dependencies
npm install

# Start both API and web in development
npm run dev

# Or start individually
npm run dev:api    # API only (port 3001)
npm run dev:web    # Web only (port 3000)
```

## Environment Setup

1. Copy `.env.example` to `.env` in the root directory
2. Configure your environment variables
3. Start the development servers

## Deployment

- **API**: Deploys to Vercel as serverless functions
- **Web**: Deploys to Vercel as static site with SSR
- **Database**: Configure your preferred database provider

## Development

- API runs on port 3001
- Web runs on port 3000
- Both support hot reload
- Shared packages are automatically linked

## Scripts

- `npm run dev` - Start both API and web
- `npm run build` - Build all apps
- `npm run test` - Run tests across all packages
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all build artifacts
 