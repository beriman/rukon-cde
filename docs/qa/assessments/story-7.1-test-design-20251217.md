# Test Design: Story 7.1 - Mobile Offline Mode

**Story**: [Story 7.1](docs/stories/epic-7/story-7.1-mobile-offline-mode.md)

## Test Strategy

### 1. Unit Tests (Backend)
- `SyncService`: Test delta sync logic (only send items changed since `lastSync`).
- `ConflictResolver`: Test automatic resolution rules.

### 2. Integration Tests (API)
- `POST /api/sync/pull`: Verify correct data subsets returned.
- `POST /api/sync/push`: Verify batch updates applied correctly.

### 3. Manual/E2E Tests (Mobile)
- **Scenario 1: Offline Download**
  - Go offline -> View downloaded drawing -> Success.
- **Scenario 2: Offline Edit**
  - Go offline -> Edit form -> Save -> Reconnect -> Verify sync.
- **Scenario 3: Conflict**
  - User A edits Item X (Online). Node A goes offline. User B edits Item X. Node A reconnects.
  - Verify Conflict UI appears.

## Priority
- **P0**: Sync mechanism (Push/Pull).
- **P0**: Local Storage (SQLite access).
- **P1**: Conflict UI.
