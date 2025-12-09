# Story 5.1: Safety Dashboard & Performance Metrics

## 1. User Story
**As a** Safety Officer / Project Manager
**I want to** view a real-time dashboard of HSE performance metrics
**So that** I can monitor project safety health and identify trends immediately.

## 2. Requirements (ISO 45001 / PRD)

### 2.1 Key Performance Indicators (KPIs)
- **Total Manhours:** Cumulative sum of manhours from daily reports.
- **LTI Free Days/Hours:** Counter of days/hours since last Lost Time Injury.
- **Recordable Incident Free Days:** Counter since last recordable incident.
- **Hurt Free Days:** Counter since last injury of any kind.
- **Comparison:** Show "Current" vs "Previous Best" for the above free-day counters.

### 2.2 Incident Rates (Automated Calculation)
Formulas (typically per 1,000,000 manhours):
- **Fatality Rate**
- **LTI Rate (Lost Time Injury)**
- **TRI Rate (Total Recordable Incident)**
- **Total Hurt Incident Rate**

### 2.3 Visualizations
- **S-Curve (Safety):** Cumulative Manhours vs Plan? (Or just cumulative).
- **Incident Trend:** Bar chart of incidents by type per month.
- **Pyramid:** Safety Triangle (Near Miss > First Aid > LTI > Fatality).

## 3. Acceptance Criteria
- [ ] Dashboard page `/dashboard/hse` exists.
- [ ] Displays 4 main KPI cards (Manhours, LTI Free, etc.).
- [ ] "Previous Best" is stored and updated if current streak exceeds it.
- [ ] Incident Rates are calculated automatically based on stored incident logs and manhours.
- [ ] Charts are interactive (tooltip on hover).

## 4. Technical Approach
### Backend (NestJS)
- **Module:** `HseModule`
- **Controller:** `HseDashboardController`
- **Service:** `HseDashboardService`
- **Endpoints:**
    - `GET /hse/dashboard/stats`: Returns aggregated KPIs.
    - `GET /hse/dashboard/charts`: Returns time-series data for charts.

### Database (Prisma)
- Need `HseDailyReport` table for manhours.
- Need `HseIncident` table for calculating rates and free days.
- **Aggregation:** Queries effectively summing manhours and counting incidents.

### Frontend (Next.js)
- **Page:** `app/(dashboard)/hse/page.tsx`
- **Components:**
    - `HseStatCard`: Reusable card for KPIs.
    - `HseTrendChart`: Recharts implementation.
    - `HsePyramid`: Custom visualization? (Or just a bar chart for now).
