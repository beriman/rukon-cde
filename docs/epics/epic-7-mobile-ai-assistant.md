# Epic 7: Mobile Field App & AI Assistant

**Epic ID**: `epic-7`  
**Priority**: P2 (Medium)  
**Estimated Effort**: Medium (5-7 weeks)  
**Target Phase**: Phase 3-4

## Description

Native mobile application untuk field teams dengan offline-first architecture, AI Project Assistant menggunakan RAG (Retrieval-Augmented Generation), integrated meeting management, dan automated reporting engine.

## Business Value

- **Field Productivity**: Offline access allows work di location tanpa internet
- **Data Capture**: Site photos/videos linked langsung to drawings
- **AI Efficiency**: Instant answers to project queries reduces email chains
- **Automated Reports**: Save hours pada weekly/monthly report generation

## Functional Requirements (From PRD)

### 3.2.10 Mobile Field App
- Offline mode: Download drawings/models/checklists
- Site capture: Photos/videos linked to floor plan locations
- QR Scanning: Pull up drawings for specific rooms/equipment

### 3.2.11 AI Project Assistant (RAG)
- Document search: Natural language queries
- Automated insights: Risk analysis based on project data

### 3.2.12 Meeting Management
- Smart Minutes: Status tracking untuk action items
- Auto-carry over: Unresolved items to next meeting
- BCF-linked: Connect meeting items to 3D viewpoints

### 3.2.13 Automated Reporting
- One-click Weekly/Monthly reports
- Data sources: S-Curve, HSE stats, Document status, Photos
- Custom layouts: Drag-and-drop report builder

## User Stories (High-Level)

1. **Mobile App - Offline Mode**
   - [ ] User dapat download project drawings untuk offline use
   - [ ] Downloaded content stored di local SQLite database
   - [ ] Auto-sync saat internet connection restored
   - [ ] Conflict resolution untuk offline edits

2. **Mobile App - Site Capture**
   - [ ] User dapat take photo dengan GPS location tagging
   - [ ] Pin photo to specific location pada floor plan
   - [ ] Video recording dengan commentary
   - [ ] Batch upload saat back online

3. **Mobile App - QR Scanning**
   - [ ] Admin dapat generate QR codes untuk rooms/equipment
   - [ ] User scans QR code dengan camera
   - [ ] System pulls up relevant drawings, specs, maintenance logs
   - [ ] Quick access to asset information

4. **AI Assistant - Document Search**
   - [ ] User asks: "Show me all RFIs related to Column C1"
   - [ ] AI searches across documents, BCF issues, emails
   - [ ] Results ranked by relevance
   - [ ] Provides direct links to source documents

5. **AI Assistant - Natural Language Queries**
   - [ ] User asks: "What is the concrete spec for foundation?"
   - [ ] AI extracts answer from specifications documents
   - [ ] Cites source (document name, page number)
   - [ ] Conversational follow-up questions supported

6. **AI Assistant - Risk Insights**
   - [ ] AI analyzes: Late tasks, Open high-priority issues, Weather delays
   - [ ] Generates risk report dengan recommendations
   - [ ] Proactive alerts untuk potential problems

7. **Meeting Management**
   - [ ] User creates meeting dengan agenda items
   - [ ] During meeting: Add action items dengan assignee dan due date
   - [ ] Items marked as Open/Closed
   - [ ] Photo/document attachments per item

8. **Auto-Carry Over**
   - [ ] When scheduling next meeting, Open items auto-added to agenda
   - [ ] User can prioritize/reorder carried-over items
   - [ ] History shows item age (e.g., "Open for 3 meetings")

9. **BCF-Linked Items**
   - [ ] Meeting items can link to BCF issues
   - [ ] Clicking item opens 3D viewer at relevant viewpoint
   - [ ] BCF status synced dengan meeting item status

10. **Automated Reporting**
    - [ ] User selects: Weekly atau Monthly report
    - [ ] System auto-compiles: S-Curve, HSE stats, Shop Drawing status, Progress photos
    - [ ] Preview before generate
    - [ ] Export to PDF/DOCX dengan company branding

11. **Custom Report Builder**
    - [ ] Drag-and-drop interface untuk select report sections
    - [ ] Sections: Cover page, Executive summary, Progress charts, Photo gallery, Issues list
    - [ ] Save templates untuk reuse
    - [ ] Schedule automatic report generation (e.g., every Friday)

## Acceptance Criteria

- [ ] Mobile app works 100% offline untuk core features (view drawings, add photos)
- [ ] AI assistant response time <5 seconds untuk document queries
- [ ] AI accuracy ≥90% for factual questions from project docs
- [ ] Meeting auto-carry over works reliably
- [ ] Automated reports require <5 min user setup time

## Technical Notes

### Mobile App Stack
- **React Native** atau **Flutter**
- Local database: SQLite atau Realm
- Sync framework: PouchDB/CouchDB atau custom implementation
- Camera integration: expo-camera atau similar

### AI/RAG Architecture
- **Vector Database**: Pinecone, Weaviate, atau Qdrant
- **Embedding Model**: OpenAI Ada-002 atau open-source alternative
- **LLM**: GPT-4 atau Claude untuk answer generation
- **Chunking**: Documents split to 500-token chunks untuk context

### Report Generation
- **Template Engine**: Handlebars atau Pug
- **PDF Generation**: Puppeteer atau PDFKit
- **Chart Rendering**: Recharts (server-side rendering)

## Dependencies

- Epic 1 (Core CDE) - Required
- Epic 4 (Construction Monitoring) untuk report data
- Epic 6 (BCF) untuk meeting-BCF linking

## Risks

| Risk | Mitigation |
|------|------------|
| Mobile offline sync conflicts | Last-write-wins dengan conflict UI |
| AI hallucinations (incorrect answers) | Citation requirement, confidence scores |
| Report generation performance | Pre-compute charts, async generation |

---

**Related Epics**: Epic 1, Epic 4, Epic 6  
**Updated**: 2025-12-01
