# Rukon CDE - ISO 19650 Platform

## Overview
Rukon CDE is a SaaS platform designed to democratize ISO 19650 standards for the AEC industry.

## Tech Stack
- **Monorepo**: Turborepo
- **Backend**: NestJS + Prisma + PostgreSQL (`apps/api`)
- **Frontend**: Next.js 14 + Tailwind CSS + Shadcn UI (`apps/web`)
- **Infrastructure**: Docker, Terraform (`infra`)

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Installation
```bash
npm install
```

### Development
```bash
# Start database
docker-compose up -d

# Start dev server (both api and web)
npm run dev
```

## Project Structure
- `apps/api`: Backend API
- `apps/web`: Frontend Web App
- `infra`: Infrastructure as Code (Terraform)
- `docs`: Documentation & User Stories
