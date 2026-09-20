---
title: Security Policy
author: Beriman Juliano
project: Ruang Konstruksi
status: active
updated: 2026-09-20
---

# Security Policy

Ruang Konstruksi mengelola data proyek konstruksi, drawing, model BIM, penawaran vendor, approval, dan informasi komersial. Keamanan multi-tenant adalah requirement inti.

## Do Not Commit

Jangan pernah commit:
- production API key,
- Supabase service-role key,
- database password,
- OpenAI API key,
- Autodesk credentials/token,
- customer document yang tidak diizinkan,
- private certificate / signing key.

Gunakan environment variables dan secret manager.

## Core Security Rules

- RLS untuk tenant/project isolation.
- Authorization dicek server-side.
- Private storage secara default.
- Signed temporary URL untuk protected file access.
- Service-role key tidak pernah dikirim ke browser.
- AI menggunakan permission user yang memerintah.
- Audit log merekam authenticated actor sebenarnya.
- Vendor A tidak boleh melihat quotation Vendor B.
- Project A tidak boleh membaca data Project B.
- High-impact action menggunakan confirmation/approval gate.

## Reporting

Untuk security issue, jangan membuat public issue berisi detail exploit atau customer data. Hubungi maintainer repository secara privat.
