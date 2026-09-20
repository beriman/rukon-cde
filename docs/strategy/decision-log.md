---
title: Decision Log
author: Beriman Juliano
project: Ruang Konstruksi
status: active
updated: 2026-09-20
---

# Decision Log

| ID | Keputusan | Status |
|---|---|---|
| D-001 | Kontraktor menjadi target pertama | Accepted |
| D-002 | Planner menjadi future workspace | Accepted |
| D-003 | CDE menjadi source of truth | Accepted |
| D-004 | Dashboard adalah UI utama, bukan chat log | Accepted |
| D-005 | Text dan voice menjadi control interface | Accepted |
| D-006 | Supabase menjadi database utama | Accepted |
| D-007 | Google Drive bukan primary database | Accepted |
| D-008 | Puter bukan core dependency | Accepted |
| D-009 | OpenAI API menjadi AI layer awal | Accepted |
| D-010 | Docker digunakan untuk backend services, bukan per project | Accepted |
| D-011 | Revit berjalan melalui Windows BIM Worker | Accepted |
| D-012 | Satu worker dapat menangani banyak project melalui queue | Accepted |
| D-013 | 3D viewer masuk MVP | Accepted |
| D-014 | Mobile memakai responsive PWA sebelum native app | Accepted |
| D-015 | Approved baseline immutable terhadap actual progress | Accepted |
| D-016 | AI tidak memiliki authority approval final | Accepted |
| D-017 | Business-critical state tidak disimpan hanya di chat history | Accepted |
| D-018 | File terbaru tidak otomatis menjadi published/current-valid document | Accepted |

## Open Decisions

- Viewer utama: Autodesk APS vs IFC/web viewer vs hybrid.
- Supabase Cloud vs self-host production.
- Storage threshold sebelum R2.
- Local Windows worker vs cloud VM vs Autodesk Automation untuk production.
- Revit version support.
- Maximum model size dan mobile/offline BIM scope.
- Pricing AI/BIM automation.
