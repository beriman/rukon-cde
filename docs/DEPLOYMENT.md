# Deployment Guide - Rukon CDE

This guide covers deployment strategies for the Rukon CDE platform.

## Overview

The Rukon platform consists of:
- **Backend API** (NestJS) - Stateless, can be deployed to any Node.js host
- **Frontend Web** (Next.js) - Static + SSR, best deployed to Vercel/Netlify
- **Database** (PostgreSQL) - Managed via Supabase (recommended)
- **File Storage** (S3/Local) - AWS S3 or local filesystem

---

## Deployment Options

### Option 1: Recommended (Managed Services)
- **Frontend**: Vercel
- **Backend**: Railway/Render/Fly.io
- **Database**: Supabase (PostgreSQL)
- **Storage**: AWS S3

**Pros**: Easy setup, auto-scaling, minimal DevOps
**Cons**: Monthly costs (~$20-50 for staging)

### Option 2: Self-Hosted (VPS)
- **All services**: Single VPS (DigitalOcean, Linode)
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2

**Pros**: Full control, lower cost for high traffic
**Cons**: More DevOps work, manual scaling

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   cd apps/web
   vercel --prod
   ```

4. **Configure environment variables in Vercel dashboard**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

### Automatic Deployments
- Connect GitHub repository to Vercel
- Auto-deploy on push to `main` branch

---

## Backend Deployment (Railway)

### Prerequisites
- Railway account
- GitHub repository

### Steps

1. **Create new project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure build settings**
   - Root Directory: `apps/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

3. **Add environment variables**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-production-secret
   PORT=3001
   ```

4. **Add PostgreSQL addon** (or use external Supabase)
   - Railway → Add Plugin → PostgreSQL
   - Copy `DATABASE_URL` to environment variables

5. **Run migrations**
   ```bash
   railway run npx prisma migrate deploy
   ```

### Alternative: Render

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service → Connect Git repository

2. **Configure**
   - Build Command: `cd apps/api && npm install && npm run build`
   - Start Command: `cd apps/api && npm run start:prod`
   - Add environment variables

---

## Database Setup (Supabase)

### Steps

1. **Create project on Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Get connection string**
   - Project Settings → Database
   - Copy "Connection Pooling" URL (pgBouncer)

3. **Run migrations**
   ```bash
   cd apps/api
   DATABASE_URL="your-supabase-url" npx prisma migrate deploy
   ```

4. **Update environment variables**
   - Add `DATABASE_URL` to Railway/Render

---

## File Storage (AWS S3)

### Setup

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://rukon-cde-files-prod
   ```

2. **Create IAM Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::rukon-cde-files-prod/*"
       }
     ]
   }
   ```

3. **Create IAM User**
   - Attach policy to user
   - Generate access keys

4. **Add to environment variables**
   ```
   AWS_S3_BUCKET=rukon-cde-files-prod
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=ap-south-1
   ```

---

## Environment Variables Checklist

### Backend (API)
- [ ] `DATABASE_URL`
- [ ] `JWT_SECRET`
- [ ] `PORT`
- [ ] `AWS_S3_BUCKET` (optional)
- [ ] `AWS_ACCESS_KEY_ID` (optional)
- [ ] `AWS_SECRET_ACCESS_KEY` (optional)

### Frontend (Web)
- [ ] `NEXT_PUBLIC_API_URL`

---

## Post-Deployment Checklist

- [ ] Run database migrations
- [ ] Verify API health endpoint (`/api/health`)
- [ ] Test user registration & login
- [ ] Test file upload
- [ ] Configure custom domain (if applicable)
- [ ] Setup SSL certificates (auto via Vercel/Railway)
- [ ] Configure CORS (allow frontend domain)

---

## Rollback Strategy

### Vercel (Frontend)
- Go to Deployments → Select previous deployment → Promote to Production

### Railway (Backend)
- Go to Deployments → Select previous deployment → Redeploy

### Database
- Rollback migration:
  ```bash
  npx prisma migrate resolve --rolled-back <migration_name>
  ```

---

## Monitoring & Logs

### Railway
- View logs: Project → Deployments → View Logs

### Vercel
- View logs: Project → Functions → Logs

### Supabase
- View SQL logs: Database → Logs

---

## Cost Estimates (Monthly)

### Staging Environment
- Vercel: Free (Hobby tier)
- Railway: $5 (500 hrs)
- Supabase: Free (500MB database)
- **Total**: ~$5/month

### Production Environment
- Vercel: $20 (Pro tier)
- Railway/Render: $10-25
- Supabase: $25 (8GB database)
- AWS S3: $1-5 (1GB storage)
- **Total**: ~$50-75/month

---

## CI/CD Integration

The GitHub Actions workflow automatically runs tests on every PR.

To enable auto-deployment:
1. Add deployment secrets to GitHub repository
2. Uncomment CD step in `.github/workflows/ci.yml`

---

## Support

For deployment issues:
- Backend: Check Railway/Render logs
- Frontend: Check Vercel deployment logs
- Database: Check Supabase logs

Common issues:
- **Build fails**: Check Node version (should be 20.x)
- **Database connection fails**: Verify `DATABASE_URL` format
- **CORS errors**: Add frontend domain to backend CORS whitelist
