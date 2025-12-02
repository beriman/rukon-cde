# Story 7.4: AI Document Search (RAG Engine)

**Epic**: Epic 7 - Mobile AI Assistant  
**Story ID**: `story-7.4`  
**Story Points**: 8  
**Priority**: P0 (Critical)  
**Sprint**: Sprint 24 (Weeks 47-48)

## User Story

**As a** Project Manager,  
**I want to** search for information using natural language,  
**So that** I don't have to manually open dozens of PDF files to find an answer.

## Acceptance Criteria

### Functional
- [ ] **Indexing**: Automatically index uploaded PDFs, Docs, and Emails
- [ ] **Search**: "Semantic Search" capability (understanding meaning, not just keywords)
- [ ] **Result**: Return relevant document chunks with direct link to source page
- [ ] **Indonesian Context**: Support queries in Bahasa Indonesia (e.g., "Cari spesifikasi beton K-300")

### Technical
- [ ] **RAG Pipeline**: PDF -> Chunking -> Embedding -> Vector DB -> Retrieval

## Technical Tasks

### Backend
- [ ] Setup Vector Database (Pinecone/Weaviate)
- [ ] Implement Ingestion Pipeline (LangChain/LlamaIndex)

## Dependencies
- **Depends on**: Epic 1 (File Storage)
