# Rukon CDE - ISO 19650 Compliant Common Data Environment

A multi-tenant SaaS platform for construction document management, compliant with ISO 19650 standards.

## 🏗️ Project Structure

```
rukon/
├── apps/
│   ├── api/          # NestJS Backend API
│   └── web/          # Next.js Frontend
├── docs/             # Documentation
└── .github/          # CI/CD Workflows
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- Docker & Docker Compose (recommended)
- PostgreSQL 15+ (or use Supabase)

### Local Development (with Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/rukon.git
   cd rukon
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api

### Local Development (without Docker)

1. **Install dependencies**
   ```bash
   npm install
   cd apps/api && npm install
   cd ../web && npm install
   ```

2. **Setup database**
   ```bash
   cd apps/api
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Run applications**
   ```bash
   # Terminal 1 - API
   cd apps/api
   npm run start:dev

   # Terminal 2 - Web
   cd apps/web
   npm run dev
   ```

## 🧪 Testing

### Run all tests
```bash
# API tests
cd apps/api
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage report

# Web tests
cd apps/web
npm run test
```

### Linting
```bash
cd apps/api && npm run lint
cd apps/web && npm run lint
```

## 📦 Building for Production

```bash
# Build API
cd apps/api
npm run build

# Build Web
cd apps/web
npm run build
```

## 🚢 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy
- **Frontend**: Deploy to Vercel
  ```bash
  cd apps/web
  vercel --prod
  ```

- **Backend**: Deploy to Railway/Render
  ```bash
  # Follow platform-specific instructions
  ```

> [!IMPORTANT]
> **RVT Conversion Support**
> To enable automatic conversion of Revit (.rvt) files to IFC, you MUST install **ODA File Converter** on the backend server.
> 1. Download: [ODA File Converter](https://www.opendesign.com/guestfiles/oda_file_converter)
> 2. Install using default settings.
> 3. Set `ODA_PATH` in `.env` if installed in a custom location (Default: `C:\Program Files\ODA\ODAFileConverter 25.x.x\ODAFileConverter.exe`).
> If not installed, the system will use a MOCK simulation for demonstration purposes.

## 🛠️ Tech Stack

### Backend
- NestJS (Node.js framework)
- Prisma ORM
- PostgreSQL (via Supabase)
- JWT Authentication
- AWS S3 (file storage)

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- ESLint & Prettier

## 📝 Environment Variables

See [.env.example](./.env.example) for all required variables.

### Essential Variables
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software.

## 👥 Team

- Backend: NestJS Team
- Frontend: Next.js Team
- DevOps: Infrastructure Team
