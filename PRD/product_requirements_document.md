# Product Requirements Document (PRD): ISO 19650 Compliant SaaS CDE

## 1. Introduction
### 1.1 Vision
To build the world's most compliant and user-friendly **Common Data Environment (CDE)** SaaS platform that democratizes ISO 19650 standards for the AEC (Architecture, Engineering, Construction) industry.

### 1.2 Goals
-   **Compliance:** Full adherence to ISO 19650 Parts 1-7.
-   **Interoperability:** Native support for Open BIM (IFC, BCF) and Classification Systems.
-   **Security:** Enterprise-grade security (ISO 19650-5) to protect critical asset data.
-   **Usability:** Simplifying complex ISO standards into intuitive UI/UX workflows.

## 2. Target Audience (User Personas)
Based on ISO 19650 roles:
1.  **Appointing Party (Client/Owner):** Needs dashboard for project progress, approval gateways, and asset data (AIR).
2.  **Lead Appointed Party (PM/Lead Architect):** Needs tools for planning (BEP, MIDP), coordination, and checking.
3.  **Appointed Party (Sub-contractors):** Needs simple upload interface, task lists (TIDP), and issue tracking.
4.  **Information Manager:** Needs configuration tools for metadata, classification, and permission rules.

## 3. Functional Requirements

### 3.1 Core CDE (ISO 19650-1)
-   **Unique ID Generation:** Automatic naming convention enforcement (Project-Originator-Volume-Level-Type-Role-Number).
-   **CDE States:** Strict workflow states: *Work In Progress (WIP) -> Shared -> Published -> Archived*.
-   **Revision Control:** Automatic versioning (P01, P02) and revision history.
-   **Container Management:** Support for all file types (Models, Documents, Data).

### 3.2 Delivery Phase (ISO 19650-2)
-   **Tender Module:** Secure data room for EIR and Reference Information.
-   **Planning Tools:** Online editors for BEP, TIDP, and MIDP with Gantt chart visualization.
-   **Mobilization:** Team onboarding checklist and capability assessment forms.
-   **Coordination:** Federated model viewing and clash detection.
-   **Approval Workflows:** Configurable "Gateways" for moving data between states (e.g., Shared to Published).

### 3.3 Operational Phase (ISO 19650-3)
-   **Asset Twin:** Live AIM (Asset Information Model) database.
-   **Trigger Events:** Maintenance scheduler and issue reporting tickets.
-   **Handover Wizard:** Tools to migrate PIM (Construction data) to AIM (Operational data).

### 3.4 Information Exchange (ISO 19650-4)
-   **Quality Gate:** Automated checking of file integrity, naming, and metadata completeness before acceptance.
-   **Open BIM Support:**
    -   **IFC Viewer:** Web-based 3D viewer for IFC files.
    -   **BCF Server:** Issue tracking system compatible with BCF API v2.1/v3.0.

### 3.5 Security & Compliance (ISO 19650-5)
-   **Triage System:** Mandatory "Sensitivity Check" upon upload.
-   **Redaction Tools:** Feature to obscure sensitive model elements.
-   **Audit Trail:** Immutable logs of all user actions (View, Download, Delete).
-   **Watermarking:** Dynamic overlay on document viewer.

### 3.6 Health & Safety (ISO 19650-6)
-   **Risk Register:** Database of project risks linked to model locations.
-   **Visual Safety:** 3D tagging of hazardous areas in the viewer.

### 3.7 Deconstruction (ISO 19650-7)
-   **HazMat Mapping:** Layer for hazardous materials in 3D view.
-   **Material Passport:** Metadata for material recyclability and salvage value.

### 3.8 Technical Enablers
-   **Classification:** Built-in dictionary for **Uniclass 2015** and **OmniClass**. Auto-suggest based on file content.
-   **LOIN Manager:** **IDS (Information Delivery Specification)** editor and validator to check information completeness (EN 17412-1).

## 4. Technology Stack Recommendation

### 4.1 Frontend (Web Client)
-   **Framework:** **Next.js (React)** - For SEO, performance, and server-side rendering.
-   **UI Library:** **Tailwind CSS** + **Shadcn UI** - For modern, responsive, and accessible design.
-   **3D Engine:** **That Open Platform (formerly IFC.js)** or **Autodesk Platform Services (APS)**.
    -   *Recommendation:* **That Open Platform** (Open Source, Free, runs in browser) for cost efficiency, or **APS** for enterprise-grade stability if budget allows.
-   **State Management:** **Zustand** or **TanStack Query**.

### 4.2 Backend (API & Logic)
-   **Runtime:** **Node.js** (with **NestJS** framework) - For scalable, modular architecture.
-   **Language:** **TypeScript** - For type safety and maintainability.
-   **API:** **REST** for general CRUD, **GraphQL** for complex data fetching (e.g., model metadata).

### 4.3 Database
-   **Relational (Metadata):** **PostgreSQL** - For users, projects, permissions, and file metadata.
-   **NoSQL (Logs & Attributes):** **MongoDB** - For audit trails and flexible IFC property sets.
-   **Graph (Relationships):** **Neo4j** (Optional) - For complex relationships between assets, systems, and spaces (Digital Twin).

### 4.4 Infrastructure & Storage
-   **Cloud Provider:** **AWS** or **Google Cloud Platform (GCP)**.
-   **Object Storage:** **AWS S3** - For storing actual files (IFC, PDF, RVT).
-   **Auth:** **Keycloak** or **Auth0** - For MFA, SSO, and complex RBAC.
-   **Search:** **Elasticsearch** or **Meilisearch** - For high-speed search across millions of file attributes.

## 5. Roadmap

### Phase 1: MVP (The "Compliant Drive")
-   User/Project Management.
-   CDE States (WIP, Shared, Published).
-   File Upload with Naming Convention Enforcement.
-   Basic 3D Viewer (IFC).

### Phase 2: Process & Planning
-   TIDP/MIDP Planning Tools.
-   Approval Workflows.
-   BCF Issue Tracking.

### Phase 3: Advanced Intelligence
-   Classification (Uniclass) integration.
-   LOIN/IDS Validation.
-   Security (ISO 19650-5) features.

### Phase 4: Lifecycle & Twin
-   Asset Information Model (AIM).
-   Health & Safety Risk Maps.
-   Deconstruction Tools.
