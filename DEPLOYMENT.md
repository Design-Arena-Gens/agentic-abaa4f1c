# Deployment Guide

## Enterprise LMS + ERP + CRM Platform

### Build Status
✅ Build completed successfully locally

### Deployment Instructions

#### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Set your Vercel token
export VERCEL_TOKEN=your_vercel_token_here

# Deploy
vercel --prod --yes --token $VERCEL_TOKEN
```

#### Option 2: GitHub Integration
1. Connect this repository to Vercel via GitHub integration
2. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Random secret for auth
   - `NEXTAUTH_URL` - Production URL (https://agentic-abaa4f1c.vercel.app)
   - `OPENAI_API_KEY` - OpenAI API key
   - `JWT_SECRET` - Random secret for JWT

3. Vercel will auto-deploy on git push

#### Option 3: Manual Deployment
```bash
# Build locally
npm run build

# Deploy build artifact
vercel deploy --prebuilt --prod
```

### Environment Variables Required

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://agentic-abaa4f1c.vercel.app"
OPENAI_API_KEY="sk-..."
JWT_SECRET="generate-with-openssl-rand-base64-32"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create tables
npx prisma db push

# Or use migrations
npx prisma migrate deploy
```

### Post-Deployment Steps

1. **Verify deployment**:
   ```bash
   curl https://agentic-abaa4f1c.vercel.app
   ```

2. **Test API endpoints**:
   ```bash
   curl https://agentic-abaa4f1c.vercel.app/api/health
   ```

3. **Create admin user** via register endpoint

4. **Configure database** with production PostgreSQL

### Production Checklist

- [ ] Environment variables configured
- [ ] Database provisioned (PostgreSQL)
- [ ] Database schema deployed
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] CDN configured for static assets

### Features Deployed

✅ **LMS Core**
- Course management
- Module and lesson structure
- Assessments and quizzes
- Progress tracking
- Enrollment system

✅ **CRM Systems**
- Student CRM (incl. orphans, special needs)
- Donor CRM with donation tracking
- Instructor management
- Employer portal

✅ **AI Integration**
- OpenAI-powered tutoring
- Bilingual AI support (EN/AR)
- Adaptive learning recommendations

✅ **Certificates**
- PDF generation
- QR code verification
- Blockchain-ready architecture
- Secure verification hashes

✅ **Analytics**
- Admin dashboard
- Real-time metrics
- Enrollment trends
- Activity logs

✅ **Accessibility**
- Bilingual UI (English & Arabic)
- RTL support for Arabic
- Special needs tracking
- Offline-first PWA

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (production) / SQLite (dev)
- **AI**: OpenAI GPT-4o-mini
- **Auth**: JWT-based authentication
- **Charts**: Recharts
- **PDF**: pdf-lib with QR codes

### Troubleshooting

**Build fails with Prisma error:**
```bash
npx prisma generate
npm run build
```

**Database connection issues:**
- Verify DATABASE_URL format
- Check firewall rules
- Ensure PostgreSQL version compatibility (v12+)

**Environment variables not loading:**
- Check .env file in production
- Verify Vercel environment variable configuration
- Restart deployment after adding variables

### Support

For deployment issues:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test database connectivity
4. Review API route logs

### License

Proprietary - All rights reserved
