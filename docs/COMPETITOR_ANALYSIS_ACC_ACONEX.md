# Competitor Analysis & Strategic Roadmap: ACC vs. Aconex for Rukon CDE

**Date:** January 30, 2026
**Target:** Rukon CDE (Hybrid of ACC & Aconex + AI)
**Author:** Osmo (Clawdbot)

## 1. Executive Summary
The goal for **Rukon CDE** is to bridge the gap between the **Model-Centric** approach of Autodesk Construction Cloud (ACC) and the **Process/Correspondence-Centric** approach of Oracle Aconex. By integrating AI, Rukon aims to automate the friction between these two worlds.

---

## 2. Autodesk Construction Cloud (ACC) - The "Model First" Approach
ACC (formerly BIM 360) is the industry standard for design-to-build workflows, heavily tied to the Revit ecosystem.

### Core Philosophy
- **Single Source of Truth (Geometry):** The 3D model is the center of the universe.
- **Integration:** Seamless connection with authoring tools (Revit, Civil 3D, Navisworks).

### Key Modules & Features to Emulate
1.  **Autodesk Docs (CDE Foundation):**
    -   **ISO 19650 Naming Standards:** Enforced naming conventions (Project-Originator-Zone-Level-Type-Role-Number).
    -   **Review Workflows:** Approval steps (1-step to 6-step reviews) before moving files from WIP to Shared.
2.  **Model Coordination (BIM Collaborate):**
    -   **Automatic Clash Detection:** Automatically finding geometric conflicts between disciplines (e.g., Duct vs. Beam).
    -   **Issue Management:** Pinning issues directly onto the 3D model.
3.  **Autodesk Build:**
    -   **RFI & Submittals:** Linked directly to 2D sheets and 3D models.
    -   **Assets:** Tracking equipment status from design to commissioning.

### ⚠️ Weaknesses of ACC
-   **Correspondence:** "Mail" features are weak. Communication often happens outside the platform (Email/Teams), leading to data loss.
-   **Neutrality:** Often perceived as "owned" by the Design Team or Main Contractor, making other parties hesitant to share internal WIP data.

---

## 3. Oracle Aconex - The "Process First" Approach
Aconex is the standard for mega-projects (Infrastructure, Oil & Gas) where liability and audit trails are paramount.

### Core Philosophy
- **Project Neutrality:** No single organization owns the project data. Each party has its own private vault; sharing is an explicit action.
- **Strict Audit Trail:** Nothing can be deleted. Every action is logged.

### Key Modules & Features to Emulate
1.  **Mail (Correspondence):**
    -   **Transmittals:** The formal way of sending documents. It acts as a legal receipt.
    -   **Threaded Mail:** Unlike email, Aconex mail is tagged to the project, searchable, and cannot be deleted.
    -   **Forms:** Configurable workflows for specific processes (Inspection Requests, Site Instructions).
2.  **Workflow Automation:**
    -   Strict "Ball in Court" tracking. You know exactly who is holding up the process.
3.  **Metadata-Driven:** Documents are found via tags/metadata, not just folder structures.

### ⚠️ Weaknesses of Aconex
-   **3D/BIM Experience:** Traditionally clunky. Viewing models feels like a separate, disconnected task compared to ACC.
-   **User Interface:** Often considered dated and rigid.

---

## 4. The Rukon Strategy: The Hybrid "Sweet Spot"

To beat giants, Rukon must offer the **Visual Intuition of ACC** with the **Legal Rigor of Aconex**.

### 🏛️ Module 1: The Repository (ISO 19650)
-   **Implementation:** Structure folders by ISO 19650 containers (WIP, Shared, Published, Archived).
-   **Feature:** **"Smart Upload"** (AI) that auto-suggests metadata/naming based on file content.

### ✉️ Module 2: Correspondence (The "Aconex" Layer)
-   **Feature:** **Integrated Mail System.** Do not rely on external emails.
-   **Innovation:** Link every email/RFI directly to a coordinate in the IFC Model (The "ACC" twist).
-   **Rigor:** Immutable logs. "Who saw what, when."

### 🧊 Module 3: Model Coordination (The "ACC" Layer)
-   **Feature:** **Lightweight IFC Viewer.** (Already in progress with `web-ifc-three`).
-   **Innovation:** **"Contextual Chat."** Chatting *inside* the 3D room. If I talk about "Wall A", the AI highlights "Wall A".

### 🧠 Module 4: The AI Advantage (The Differentiator)
*ACC and Aconex use AI for "Risk Prediction." Rukon can go deeper.*

1.  **Semantic Search:** "Show me all RFIs related to the HVAC leak on Level 2" (Searches PDF text, CAD attributes, and Mail bodies).
2.  **Auto-Clash-Resolution:** Don't just detect clashes; suggest moving the pipe 50mm down (Generative Design).
3.  **Compliance Checker:** AI scans uploaded PDF drawings to ensure title blocks match the metadata (preventing admin errors).
4.  **Meeting Minutes to Action:** AI listens to site meeting audio, generates Minutes of Meeting (MoM), and auto-creates Tasks/RFIs in Rukon.

---

## 5. Implementation Priorities for Rukon (Short Term)

1.  **Neutrality Logic:** Refine the Database Schema to ensure multi-tenant data separation (Aconex style). *Current Prisma schema needs review.*
2.  **The "Transmittal" Engine:** Build a mechanism to formally "send" a bundle of files with a cover sheet.
3.  **Viewer Annotation:** Allow pinning text/issues on the `web-ifc` viewer.
