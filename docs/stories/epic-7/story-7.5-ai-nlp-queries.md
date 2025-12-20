# Story 7.5: AI Assistant - Natural Language Queries

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Done
**Priority**: Medium
**Estimation**: 8 Points

## User Story
**As a** Construction Specialist,
**I want to** ask specific technical questions (e.g., "What is the concrete spec for the foundation?"),
**So that** the AI extracts the exact answer from the specifications without me reading the whole document.

## Acceptance Criteria
- [ ] AI provides a direct text answer extracted from documents.
- [ ] Answer includes specific citations (Document Name, Page Number).
- [ ] AI admits when it doesn't know the answer (low confidence) rather than hallucinating.
- [ ] User can ask follow-up questions in a conversational context.

## Technical Tasks
- [ ] **Backend**: Implement RAG (Retrieval-Augmented Generation) logic.
- [ ] **Backend**: Refine prompt engineering for factual accuracy.
- [ ] **Backend**: Implement context window management for conversation history.
- [ ] **Frontend**: Display citations/references in the chat UI.

## Dependencies
- Story 7.4 (Vector DB Infrastructure)

## Risks
- **Hallucinations**: AI generating incorrect technical specs.
