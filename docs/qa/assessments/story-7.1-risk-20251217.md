# Risk Assessment: Story 7.1 - Mobile Offline Mode

**Date**: 2025-12-17
**Story**: [Story 7.1](docs/stories/epic-7/story-7.1-mobile-offline-mode.md)

## Risk Profile

### 1. Data Consistency (High Risk)
- **Risk**: Conflicts between offline edits (local SQLite) and server updates (PostgreSQL).
- **Likelihood**: High (Field teams working offline for hours).
- **Impact**: High (Data loss or overwritten work).
- **Mitigation**: Implement "Last-Write-Wins" with a Conflict Resolution UI. Use `updatedAt` timestamps for delta verification.

### 2. Large File Storage (Medium Risk)
- **Risk**: Mobile devices running out of storage when downloading heavy BIM models/Drawings.
- **Likelihood**: Medium.
- **Impact**: Medium (App crash or inability to download).
- **Mitigation**: Implement strict storage quotas and "Selective Sync" (download only what's needed).

### 3. Sync Performance (Medium Risk)
- **Risk**: App freezing during sync of thousands of items.
- **Likelihood**: Medium.
- **Mitigation**: Use background workers (Background Fetch/Sync) and paginated sync API.

## Risk Score
**Score**: 7/10 (High Risk)
**Recommendation**: Proceed with caution. Prioritize Conflict Resolution mechanism.
