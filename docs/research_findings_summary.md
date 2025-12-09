# Research Summary: CDE, ISO 19650, and Project Rukon

## 1. Project Overview (Rukon)
**Rukon** is a SaaS-based Common Data Environment (CDE) designed to democratize ISO 19650 standards for the Indonesian AEC (Architecture, Engineering, Construction) industry.
*   **Vision:** A "Compliant Drive" that simplifies complex standards into intuitive workflows.
*   **Target Audience:** Owners, Lead Appointed Parties (PMs), and Sub-contractors.
*   **Tech Stack:** Next.js (Frontend), Node.js/NestJS (Backend), PostgreSQL + MongoDB (Database), AWS/GCP (Infra).

## 2. ISO 19650 Core Concepts
The project documentation demonstrates a deep understanding of ISO 19650 Parts 1-7:
*   **Part 1 (Concepts):** CDE as a combination of technology and *workflow*. Information Containers with unique IDs.
*   **Part 2 (Delivery):** Focus on OIR, PIR, AIR, EIR, and BEP.
*   **Part 5 (Security):** Triage systems, redaction, and audit trails.
*   **CDE States:** Strict adherence to **WIP -> Shared -> Published -> Archived**.

## 3. Key Findings & Requirements
### Essential CDE Features (MVP)
1.  **Naming Convention Validator:** Enforcing the `Project-Originator-Volume-Level-Type-Role-Number` format.
2.  **Workflow Engine:** "Promote" mechanism to move files between states with status codes (S0, S1, A1, etc.).
3.  **Smart Versioning:** Stacking versions (P01 -> P02) automatically.
4.  **Metadata:** Mandatory classification (Uniclass/OmniClass).

### Advanced Capabilities (Roadmap)
*   **BIM Integration:** IFC/Revit model viewing and federation.
*   **Project Controls:** 4D/5D simulation (Time/Cost).
*   **AI Assistant:** RAG-based document search and risk analysis.

## 4. Gap Analysis (Self-Reflection)
*   **Doc vs Code:** While documentation is extensive (`docs/stories`), I need to verify how much of this is currently *implemented* in `apps/web` and `apps/backend`.
*   **Actionable Next Steps:** The immediate focus should be ensuring the **DOE framework** (Directives, Orchestration, Execution) is populated with specific directives to implement these features (e.g., a `naming_convention_check.py` in Execution layer).
