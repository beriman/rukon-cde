---
title: Lovable Implementation Planning Brief
author: Beriman Juliano
project: Ruang Konstruksi
status: active
updated: 2026-09-20
---

# Lovable Implementation Planning Brief

Gunakan **Plan Mode** terlebih dahulu. Jangan coding sebelum fondasi di bawah direview.

## Tujuan

Ubah prototype Ruang Konstruksi menjadi production-ready AI-first CDE untuk kontraktor.

## Fokus Review Sebelum Coding

Empat area wajib disetujui founder:

1. **Database schema + RLS**
2. **CDE state machine**
3. **3D viewer architecture**
4. **Revit worker + job architecture**

## Output Plan yang Diharapkan

Lovable harus menghasilkan:

- prototype assessment,
- recommended production architecture,
- Mermaid architecture diagram,
- relational data model,
- tenancy + RLS strategy,
- authentication/authorization design,
- file/revision architecture,
- CDE state machine,
- project control architecture,
- AI orchestration architecture,
- worker/job architecture,
- 2D viewer architecture,
- 3D viewer technology comparison + recommendation,
- PWA/mobile architecture,
- threat model,
- backup/disaster recovery plan,
- measurable cost drivers,
- phased implementation roadmap,
- epic backlog with Definition of Done and acceptance criteria,
- explicit MVP definition,
- founder decisions that truly require business/product judgment.

## Planning Principle

Jangan membuat ratusan coding task di awal.

Gunakan:

```text
Business Plan
  -> PRD
  -> Architecture
  -> Epic
  -> Acceptance Criteria
  -> Coding Agent
  -> Engineering Tasks
```

## Quality Bar

Plan harus menandai:
- architecture risks,
- scaling traps,
- security risks,
- AI hallucination risks,
- BIM limitations,
- licensing dependencies,
- vendor lock-in,
- cost risks,
- assumptions yang belum tervalidasi.

Jangan membuat placeholder yang berpura-pura terintegrasi. Jika service belum tersambung, UI harus mengatakan **Belum terhubung**.
