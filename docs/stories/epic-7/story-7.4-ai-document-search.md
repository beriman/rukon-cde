# Story 7.4: AI Assistant - Document Search (RAG)

**Epic**: Epic 7: Mobile Field App & AI Assistant
**Status**: Pending
**Priority**: High
**Estimation**: 8 Points

## User Story
**As a** Project Manager,
**I want to** ask the AI to find specific documents using natural language (e.g., "Show me RFIs about Column C1"),
**So that** I don't have to manually browse through complex folder structures.

## Acceptance Criteria
- [ ] User can input natural language queries via chat interface.
- [ ] AI retrieves relevant documents, BCF issues, and correspondence.
- [ ] Results are ranked by semantic relevance (Vector Search).
- [ ] Response includes clickable links to the source documents.
- [ ] System handles "No results found" gracefully.

## Technical Tasks
- [ ] **Backend**: Setup Vector Database (Pinecone/Weaviate).
- [ ] **Backend**: Implement Document Ingestion Pipeline (Text Extraction -> Chunking -> Embedding).
- [ ] **Backend**: Create "Chat" API endpoint.
- [ ] **Frontend**: Build Chat UI with streaming response support.

## Dependencies
- Epic 1 (File Storage)
- OpenAI/LLM API Key

## Risks
- **Privacy**: Ensuring sensitive project data sent to LLM is protected.
- **Cost**: Token usage for embeddings and queries.
