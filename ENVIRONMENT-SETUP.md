# Environment Setup Guide

## Required Environment Variables

### API Environment Variables (apps/api/.env)

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/oneshot

# API Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# SendGrid Configuration
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@oneshotrecruit.com

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration (comma-separated list)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables (apps/web/.env.local)

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Setup Instructions

1. **API Setup**
   - Copy the API environment variables above
   - Create `apps/api/.env` file
   - Update values as needed

2. **Frontend Setup**
   - Copy the frontend environment variables above
   - Create `apps/web/.env.local` file
   - Update API URL if needed

3. **Database Setup**
   - Install PostgreSQL
   - Create database: `CREATE DATABASE oneshot;`
   - Update DATABASE_URL with your credentials

4. **SendGrid Setup**
   - Sign up for SendGrid account
   - Generate API key
   - Verify sender email address
   - Update SENDGRID_API_KEY and SENDGRID_FROM_EMAIL

## Important Notes

- Never commit `.env` files to version control
- Keep JWT_SECRET secure and random
- Update ALLOWED_ORIGINS for production
- Set NODE_ENV=production for production deployments 