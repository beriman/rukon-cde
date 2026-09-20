---
title: Contributing Guide
author: Beriman Juliano
project: Ruang Konstruksi
status: active
updated: 2026-09-20
---

# Contributing to Ruang Konstruksi

## Working Model

1. Buat branch dari `main`.
2. Kerjakan satu scope yang jelas.
3. Tambahkan/update tests dan dokumentasi terkait.
4. Buka Pull Request.
5. Jangan merge perubahan schema/workflow/security tanpa review.

## Definition of Done

Sebuah perubahan belum dianggap selesai hanya karena build berhasil.

Minimal:
- requirement terpenuhi,
- permission diuji,
- failure path diuji,
- state persistence diverifikasi,
- tidak ada secret,
- audit/event behavior sesuai,
- dokumentasi diperbarui,
- UI tidak berpura-pura integrasi eksternal sudah aktif.

## Naming

Gunakan branch seperti:
- `feature/...`
- `fix/...`
- `docs/...`
- `infra/...`

## AI-assisted Development

Coding agent boleh melakukan decomposition dan implementasi, tetapi product intent, security constraints, acceptance criteria, dan final review tetap dikendalikan manusia.
