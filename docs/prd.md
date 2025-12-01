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
-   **Smart Versioning (ACC-Style):**
    -   **File Stacking:** Uploading a file with the same name automatically creates a new version (V1 -> V2) stacked on top of the old one, keeping the folder clean.
    -   **Version History & Rollback:** Dropdown menu to view all previous versions with a **"Make Current"** or **"Restore"** button to easily revert changes.
-   **Container Management:** Support for all file types (Models, Documents, Data).

### 3.2 Delivery Phase (ISO 19650-2)
-   **Strategic Planning (Owner Tools):** Interactive generators for **OIR, PIR, AIR, and EIR** with built-in **Indonesian Language Templates** to simplify ISO 19650 adoption.
-   **Tender Module:** Secure data room for EIR and Reference Information.
-   **Planning Tools:** Online editors for BEP, TIDP, and MIDP with Gantt chart visualization.

### 3.2.3 Design Collaboration Suite (Structure, Arch, MEP)
Tools specifically for design teams to manage their engineering workflows:
-   **WIP Privacy:** Dedicated private workspaces for each discipline (Structure, Arch, MEP) inaccessible to others until "Shared".
-   **Reference Management:** Ability to load other disciplines' models as background references (XREF/Link) without copying files.
-   **Design Review:** Internal markup and redlining tools for checking drawings/models before submission.
-   **Engineering Data:** Support for discipline-specific file formats (RVT, DWG, DGN, IFC) and calculation reports.
-   **Clash Avoidance:** "Pre-coordination" tools to check own model against shared models before formal clash detection.

-   **Mobilization:** Team onboarding checklist and capability assessment forms.
-   **Model Federation & Coordination:**
    -   **Multi-Format Merging:** Ability to combine **RVT, IFC, NWD, and DWG** files into a single "Federated Model" for coordination.
    -   **Automated Conversion:** Background service to convert proprietary formats (like RVT) into a lightweight web-friendly format (e.g., IFC/GLTF) so they can be viewed together without requiring Revit.
    -   **Clash Detection:** Run interference checks between these merged models.
-   **Approval Workflows:** Configurable "Gateways" for moving data between states (e.g., Shared to Published).

### 3.2.6 Construction Monitoring Suite (Field Execution)
Comprehensive dashboard tools for Contractors to monitor execution:
-   **Technical Monitoring:** Track progress and issues for **Structure**, **Architecture**, and **MEP** disciplines.
-   **Document Control:**
    -   **Shop Drawings:** Status tracking (Submitted, Reviewed, Approved, RFI).
    -   **Method Statements:** Approval status and implementation tracking.
    -   **Material Approvals:** Digital submittal log for material samples and specs.
-   **Commercial & Procurement:**
    -   **Procurement:** Tracking **Long Lead Items** and delivery schedules.
    -   **BQ Monitoring:** Tracking Bill of Quantities usage vs. actual.
    -   **Payment & Billing:** Monitoring **Progress Claims**, **Variations (VO)**, and **Invoicing** status.
-   **Project Control:**
    -   **S-Curve:** Real-time progress visualization (Planned vs. Actual).
    -   **Modeling:** BIM Model development progress tracking.
-   **Data Compliance (COBie):**
    -   **COBie Health Check:** Real-time dashboard showing percentage of completed asset data (e.g., "70% of Doors have FireRating").
    -   **Parameter Validation:** Automated alerts for missing or incorrect COBie parameters before handover.
-   **Correspondence:** Centralized log for **Site Memos** and **Instruction Letters (SI)** from MK/Owner.

### 3.2.7 HSE Management & Monitoring (K3)
Complete digitization of Health, Safety, and Environment (HSE) operations:
-   **Safety Dashboard (Performance Metrics):**
    -   **Manhours & Free Days:** Real-time tracking of Total Manhours, LTI Free (Days/Hours), Recordable Incident Free, and Hurt Free stats (Current vs. Previous Best).
    -   **Incident Rates:** Automated calculation of Fatality Rate, LTI Rate, TRI Rate, and Total Hurt Incident Rate.
-   **Incident Management:**
    -   **Reporting:** Digital logging for First Aid, MTI, RWI, LTI, Fatality, Illness, Vehicle/Equipment Incidents, Spills, Near Miss, and Unsafe Acts/Conditions.
    -   **Resolution:** Integrated Investigation, Root Cause Analysis, and Corrective Action Tracking.
-   **Operational Safety:**
    -   **Inspections:** Digital checklists for Pre-Mobilization, Monthly Inspections (Heavy Equipment, Lifting Gear, Vehicles, Tools).
    -   **Meetings:** Logs for TBM, Safety Induction, General Safety Talk, Weekly Meetings, and P2K3 Committee.
    -   **Risk Control:** Tracking High-Risk Activities and mitigation measures.
-   **HSE Administration:**
    -   **Permit to Work (PTW):** Digital issuance and tracking of work permits.
    -   **Documentation:** Central repository for SOP HSE, JSA, SDS/MSDS, and Legal Requirements.
    -   **Personnel:** Tracking of Safety Cards, Qualifications, Certifications, and Training history.
-   **Emergency & Audit:**
    -   **Emergency:** Emergency Response Plans, Drill/Simulation logs, Org Charts, and Contact lists.
    -   **Audits:** Internal Audit management for ISO 45001, 9001, 14001, and 31000.

### 3.2.8 Smart Review & Change Analysis (MK/Owner Tools)
Tools to instantly spot changes between versions without manual checking:
-   **2D Overlay (Smart Diff):** Visual comparison of drawings (PDF/DWG) by overlaying versions with color-coding (e.g., **Red** = Deleted, **Green** = Added).
-   **3D Model Compare:** Automated geometric comparison between two model versions to isolate and highlight:
    -   **Added Elements** (New objects).
    -   **Removed Elements** (Deleted objects).
    -   **Modified Elements** (Moved or resized objects).
-   **Property Diff:** Side-by-side comparison of metadata changes (e.g., "FireRating changed from 60 to 120").
-   **Slider Mode:** "Before/After" slider to visually sweep between old and new versions.

### 3.2.9 4D & 5D Advanced Simulation
Tools to integrate Time (4D) and Cost (5D) into the model environment:
-   **4D Scheduling (Time):**
    -   **Schedule Import:** Native import of **MS Project (.mpp)**, **Primavera P6 (.xml)**, and **Standardized CSV Templates**.
    -   **ID-Based Linking:** Precision linking mechanism where users populate the CSV with **Family IDs** (or Element IDs) to automatically map schedule tasks to specific 3D model elements.
    -   **Timeline Simulation:** Playable animation showing construction sequence with "Planned vs. Actual" visualization (e.g., Late items colored Red).
-   **5D Cost Estimation (Budget):**
    -   **BQ Integration:** Link 3D elements to Bill of Quantities (BQ) items.
    -   **Cash Flow Simulation:** Visualize spending over time by combining 4D Schedule + 5D Cost (e.g., "How much will be spent in Month 5?").
    -   **Quantity Take-off:** Automated extraction of volumes and areas from the model for progress verification.

### 3.2.10 Mobile Field App (Offline-First)
Native mobile application for field teams working in low-connectivity areas:
-   **Offline Mode:** Download drawings/models/checklists for offline use. Auto-sync when connectivity returns.
-   **Site Capture:** Take photos/videos directly linked to specific locations or issues on the floor plan.
-   **QR Scanning:** Scan QR codes on rooms or equipment to instantly pull up relevant drawings and data.

### 3.2.11 AI Project Assistant (RAG)
Intelligent chatbot to query project data:
-   **Document Search:** "Show me all RFIs related to Column C1" or "What is the concrete spec?" (Retrieval-Augmented Generation).
-   **Automated Insights:** AI analysis of project risks based on late tasks and open issues.

### 3.2.12 Integrated Meeting Management
Tools to link meetings directly to project data:
-   **Smart Minutes:** Create items with Status (Open/Closed), Attachments (Images/Docs), and Due Dates.
-   **Auto-Carry Over:** Unresolved issues ("Open" status) from the previous meeting are automatically added to the agenda of the next meeting.
-   **BCF-Linked:** Link meeting items directly to BCF Issues or 3D Viewpoints.

### 3.2.13 Automated Reporting Engine
Generate professional reports instantly from project data:
-   **One-Click Reports:** Auto-generate **Weekly** and **Monthly** Progress Reports compiling data from:
    -   S-Curve & Physical Progress.
    -   HSE Stats (Manhours, Incidents).
    -   Document Status (Shop Drawings, RFI).
    -   Photos & Site Activity Logs.
-   **Custom Layouts:** Drag-and-drop report builder to define what data sections to include.

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

### 4.1.1 Frontend Implementation Strategy (ACC-Quality Target)
To achieve a professional, "Enterprise-Grade" UI similar to Autodesk Construction Cloud (ACC), the development will follow these strategies:
-   **Component-Driven Development:** Utilize **Shadcn UI** for a consistent, clean, and data-dense design system.
-   **High-Density Data Tables:** Implement **TanStack Table** for all list views to support advanced sorting, filtering, row selection, and pagination, mimicking Excel-like functionality found in ACC.
-   **Persistent Layouts:** Use Next.js Layouts for stable Sidebars and Headers that do not re-render on navigation, providing a "Desktop App" feel.
-   **AI-Guided Workflow:**
    -   *Atomic Design:* Build components in isolation (e.g., `StatusBadge`, `FileRow`) before assembling pages.
    -   *Detailed Specifications:* Define visual states (Hover, Active, Disabled) and data types explicitly in prompts.

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
