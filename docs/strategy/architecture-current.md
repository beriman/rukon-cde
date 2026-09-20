---
title: Current Target Architecture
author: Beriman Juliano
project: Ruang Konstruksi
status: active
updated: 2026-09-20
---

# Current Target Architecture

## Logical Architecture

```text
Desktop / Mobile PWA
        |
React + TypeScript UI
        |
Application / API Layer
        |
+----------------------+----------------------+
|                                             |
Supabase                                      OpenAI
|                                             |
PostgreSQL / Auth / Storage / RLS         AI Orchestration
|                                             |
Structured Project Data                    Tool Calls
|                                             |
+---------------------------+-----------------+
                            |
                         Job Queue
                            |
                    Windows BIM Worker
                            |
                          Revit
                            |
                    Revit API / Add-in
                            |
                     Outputs + QC Logs
                            |
                         CDE WIP
```

## Current Technology Direction

- Frontend: React + TypeScript; framework mengikuti implementasi repo yang benar-benar digunakan.
- Current repo implementation: Next.js frontend + NestJS API.
- Core database/auth: Supabase / PostgreSQL.
- Initial file storage: Supabase Storage.
- AI layer: OpenAI API.
- Source control: GitHub.
- Backend packaging: Docker.
- BIM execution: Windows Revit Worker.
- Mobile: responsive PWA.

## Docker

Docker digunakan untuk backend/supporting services. **Bukan satu Docker per project/customer.**

## Revit Worker

Revit tidak diasumsikan berjalan di Linux container.

Job flow:

```text
Ruang Konstruksi -> worker_job -> queue -> Windows Worker -> Revit -> validation -> upload -> WIP review
```

Satu worker dapat memproses banyak project secara antre. Scaling dilakukan dengan menambah worker.

## Storage

Google Drive bukan primary database. Dapat menjadi optional connector/import source.

Puter bukan dependency inti selama OpenAI digunakan langsung untuk AI layer.

Future object storage seperti Cloudflare R2 dapat dievaluasi bila file BIM besar dan egress menjadi cost driver.

## Security

- Supabase RLS
- backend authorization
- private storage
- temporary signed access
- real actor audit logs
- service key tidak pernah diekspos ke browser
- AI mewarisi permission user yang memerintah
