# Epic 5: HSE Management & Monitoring (K3)

## 1. Vision
Complete digitization of Health, Safety, and Environment (HSE) operations to ensure zero accidents and full compliance with ISO 45001/14001/9001 standards.

## 2. Scope
This epic covers the "K3" (Keselamatan dan Kesehatan Kerja) aspect of the platform.

### Stories
1.  **Story 5.1: Safety Dashboard**
    - Real-time Manhours tracking
    - Incident Rates auto-calculation (LTI, TRI)
    - "Free Days" counter

2.  **Story 5.2: Incident Management**
    - Unified reporting form (First Aid, Near Miss, LTI, etc.)
    - Investigation & RCA workflow
    - Corrective Action Tracking

3.  **Story 5.3: Operational Safety**
    - Digital Inspections (Vehicles, Tools)
    - Meeting Logs (TBM, Safety Induction)
    - Risk Control monitoring

4.  **Story 5.4: HSE Administration**
    - Permit to Work (PTW) digitisation
    - Personnel Safety Cards & Training tracking
    - HSE Document Repository

5.  **Story 5.5: Emergency & Audit**
    - Emergency Response Plans
    - Internal Audit Management

## 3. Technology Strategy
- **Charts:** Use `recharts` for S-Curves and Incident Rate graphs.
- **Forms:** Heavy use of `react-hook-form` + `zod` for complex safety forms.
- **Database:** Postgres for structured logs, Prisma for relations.
