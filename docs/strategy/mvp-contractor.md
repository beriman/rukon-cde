---
title: MVP Contractor
author: Beriman Juliano
project: Ruang Konstruksi
status: active
updated: 2026-09-20
---

# MVP Contractor

## 1. Foundation

- Organization
- Project
- User
- Role
- Permission
- Multi-tenant isolation

## 2. CDE

Workflow minimum:

```text
WIP -> Shared -> For Review -> Approved / Need Revision / Rejected -> Published -> Superseded
```

Aturan penting:
- file terbaru tidak otomatis menjadi versi resmi,
- approval selalu terikat ke exact revision,
- revisi baru tidak menghapus history revisi lama,
- audit trail append-oriented.

## 3. Mobile / PWA

Field user harus dapat:
- membuka latest published drawing,
- filter project / floor / zone / discipline,
- scan QR ke drawing atau location,
- melihat issue terkait,
- upload photo / issue sesuai permission,
- menerima stale-data warning saat cache/offline.

## 4. 2D Viewer

Minimum:
- PDF pan / zoom,
- page navigation,
- metadata,
- revision status,
- current valid revision,
- linked issue,
- linked BIM model / element.

## 5. BIM 3D Viewer

3D adalah bagian MVP karena identitas produk berbasis BIM.

Minimum:
- orbit,
- zoom,
- fit,
- isolate,
- hide/show,
- floor/zone/discipline selection,
- element selection,
- basic metadata,
- linked drawing,
- linked issue.

RVT mentah tidak dibuka langsung di browser/mobile. Gunakan derivative / web-optimized representation.

## 6. Project Control

- approved baseline,
- actual progress,
- S-curve,
- variance,
- basic forecast.

Baseline yang sudah disetujui tidak boleh berubah karena update aktual.

## 7. AI Command Center

MVP AI:
- Q&A berbasis data proyek,
- document retrieval,
- status explanation,
- controlled commands,
- confirmation gate untuk write/high-impact action.

## Non-MVP Awal

- full autonomous Revit authoring,
- full CAD automation,
- planner workspace,
- digital twin penuh,
- autonomous approval / publication.
