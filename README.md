# Ruang Konstruksi

> **AI-first Construction Operating System**  
> CDE sebagai source of truth, dashboard sebagai command center, text/voice sebagai control layer, dan AI/engineering workers sebagai pelaksana terkontrol.

**Product Owner:** Beriman Juliano

## Arah Produk

Ruang Konstruksi ditujukan untuk tim kontraktor yang perlu mengelola dokumen, drawing, model BIM, progress, approval, procurement, dan pekerjaan digital proyek dalam satu lingkungan yang dapat ditelusuri.

Prinsip inti:

- **CDE** = source of truth proyek
- **Dashboard** = command center
- **Text / Voice** = natural control interface
- **AI Agents** = intelligent workers
- **Engineering Workers** = deterministic execution layer
- **Human Approval** = authority / final decision

Target pertama adalah **contractor workspace**. Workspace konsultan perencana direncanakan sebagai fase lanjutan.

## Current Product Scope

MVP diarahkan ke:

- multi-tenant organization / project / role / permission,
- CDE dengan revision + status workflow,
- mobile/PWA field access,
- PDF drawing viewer,
- lightweight BIM 3D viewer,
- project control baseline vs actual,
- basic AI Command Center,
- controlled action + audit trail.

Full Revit automation disiapkan sebagai fase lanjutan melalui **Windows BIM Worker + job queue**, bukan Revit di browser atau Linux container.

## Dokumentasi Strategi Terkini

Mulai dari:

- [Strategy Index](./docs/strategy/README.md)
- [Product Vision](./docs/strategy/product-vision.md)
- [MVP Contractor](./docs/strategy/mvp-contractor.md)
- [Current Architecture](./docs/strategy/architecture-current.md)
- [Decision Log](./docs/strategy/decision-log.md)
- [Lovable Planning Brief](./docs/strategy/lovable-plan-brief.md)
- [Security Policy](./SECURITY.md)
- [Contributing](./CONTRIBUTING.md)

Dokumentasi lama di `docs/` tetap dipertahankan sebagai referensi historis sampai direkonsiliasi secara bertahap.

## Repository Structure

```text
rukon-cde/
├── apps/
│   ├── api/          # Current backend implementation
│   └── web/          # Current frontend implementation
├── docs/
│   ├── strategy/     # Current product decisions and planning
│   └── ...           # Existing technical/research docs
├── execution/
├── infra/
├── tests/
└── docker-compose.yml
```

## Current Technical Implementation

Repository saat ini menggunakan monorepo Node.js dengan:

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- Prisma
- PostgreSQL / Supabase direction

### Platform Direction
- Supabase: PostgreSQL, Auth, RLS, initial Storage
- OpenAI API: AI layer
- GitHub: source control / CI
- Docker: backend/supporting services
- Windows Revit Worker: BIM execution
- Responsive PWA: field access

> Arsitektur target dan implementation repo dapat berbeda selama transisi. Jangan mengubah framework hanya untuk menyamakan dokumen; perubahan stack harus berdasarkan keputusan teknis yang terdokumentasi.

## CDE State Principle

```text
WIP
 -> Shared
 -> For Review
 -> Approved / Need Revision / Rejected
 -> Published
 -> Superseded
```

**Newest upload is not automatically the valid published document.**

Approval dan review harus selalu terikat pada exact revision.

## Development

### Prerequisites

- Node.js 20+
- npm
- Docker & Docker Compose (recommended)
- PostgreSQL/Supabase configuration

### Install

```bash
git clone https://github.com/beriman/rukon-cde.git
cd rukon-cde
npm install
```

### Environment

```bash
cp .env.example .env
```

Jangan commit production secret atau customer project data. Lihat [SECURITY.md](./SECURITY.md).

### Run

```bash
npm run dev
```

Atau gunakan Docker Compose sesuai konfigurasi repository.

## Development Principle

> Natural interaction, formal execution.

AI boleh membantu membaca, menjelaskan, menyiapkan, dan mengorkestrasi pekerjaan. AI tidak boleh melewati permission, publish dokumen resmi, approve technical submission, atau mengubah approved baseline tanpa authority dan workflow yang benar.

## License

Repository saat ini menggunakan model proprietary/internal project. Lisensi distribusi final harus diputuskan sebelum public release atau commercial distribution.
