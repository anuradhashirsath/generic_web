# Project Decision Log (decisions.md)

This document records all significant technical, architectural, and product decisions for **genericMed — B2B Health OS & Generic Medicine Platform**.

---

## Decision Index

| ID | Title | Date | Status |
| :--- | :--- | :--- | :--- |
| [ADR-001](#adr-001-vite--react-19--typescript-tech-stack) | Vite + React 19 + TypeScript for High-Performance Health OS Dashboard | 2026-08-15 | **Approved** |
| [ADR-002](#adr-002-multi-tenant-schema-isolation-rls) | Multi-Tenant Schema-per-Tenant & Row-Level Security (RLS) Isolation | 2026-08-20 | **Approved** |
| [ADR-003](#adr-003-server-side--client-side-gemini-ai-ocr) | Neural OCR & FDA Bioequivalence Analysis via Google Gemini API | 2026-08-28 | **Approved** |
| [ADR-004](#adr-004-client-side-state-management--localstorage-session) | Hybrid State Management & Persistent Session Strategy | 2026-09-01 | **Approved** |
| [ADR-005](#adr-005-unified-b2b--b2c-multi-view-interface) | Unified Single-Page Multi-Role Architecture (`AppViewMode`) | 2026-09-04 | **Approved** |
| [ADR-006](#adr-006-21-cfr-part-11--gxp-compliance-audit-logging) | 21 CFR Part 11 Audit Trail & GxP Verification Engine | 2026-09-06 | **Approved** |

---

## ADR-001: Vite + React 19 + TypeScript Tech Stack

- **Date:** 2026-08-15
- **Status:** Approved

### Context / Problem
The platform requires a real-time, zero-latency clinical dashboard capable of managing micro-hub dispensing queues, live cold-chain telemetry, interactive price arbitrage charts, and instant prescription vault updates. Traditional server-rendered frameworks introduced unacceptable UI latency during high-frequency barcode scans and clinical triage.

### Decision Taken
Adopt **Vite 6** as the build tool, combined with **React 19**, **TypeScript 5.8**, **Tailwind CSS v4**, and **Lucide React** for component iconography.

### Reasoning
- **Sub-second HMR:** Instant developer feedback and ultra-fast production bundle compilation.
- **React 19 Capabilities:** Improved concurrent rendering, streamlined transition hooks, and optimized DOM reconciliation for real-time charting with Recharts.
- **Type Safety:** Strict TypeScript interfaces (`types.ts`) prevent runtime crashes when handling multi-tenant records and chemical formulations.
- **Tailwind v4:** Utility-first styling enabling precise GxP-compliant design systems with dark/light clinical palettes.

### Alternatives Considered
1. **Next.js (App Router):** Rejected due to unnecessary SSR complexity for offline-capable clinical workstations and higher latency in websockets/state-heavy micro-hubs.
2. **Vue 3 + Vite:** Rejected due to developer team expertise and broader ecosystem alignment with React clinical UI libraries.

### Impact on Project
- Standardized file structure across `src/components/`, `src/data/`, and `src/utils/`.
- Fast build times (<2s build execution) and zero runtime type errors.

---

## ADR-002: Multi-Tenant Schema Isolation (RLS)

- **Date:** 2026-08-20
- **Status:** Approved

### Context / Problem
Hospital GPOs, retail pharmacy micro-hubs, and pharma manufacturers require strict data partitioning for HIPAA compliance, trade secret protection (COA lot numbers), and custom price tier protection. Shared table architectures pose risk of accidental cross-tenant data leaks.

### Decision Taken
Implement **Schema-Isolated Multi-Tenancy** backed by PostgreSQL Row-Level Security (RLS) policies. Each organization (e.g. `tenant_mediquick_042`) operates within its isolated schema space while inheriting shared FDA catalog reference data.

### Reasoning
- **Regulatory Guarantee:** Physical schema separation ensures zero cross-tenant query contamination.
- **Granular Auditability:** RLS policies enforce tenant access rules at the database engine layer.
- **Infrastructure Dashboard Visibility:** Allows system administrators to inspect active schema record counts, daily query volume, and AES-256 encryption status via `InfrastructureCore.tsx`.

### Alternatives Considered
1. **Single Database with `tenant_id` Column Filter:** Disqualified due to higher risk of developer oversight in SQL queries resulting in data leaks.
2. **Database-per-Tenant:** Disqualified due to excessive connection pooling overhead and infrastructure costs for smaller micro-hubs.

### Impact on Project
- Infrastructure management UI (`InfrastructureCore.tsx`) built to monitor real-time tenant metrics (`TenantSchemaRecord`).
- API middleware enforced to pass `X-Tenant-ID` headers on all data operations.

---

## ADR-003: Server-Side & Client-Side Gemini AI OCR

- **Date:** 2026-08-28
- **Status:** Approved

### Context / Problem
Pharmacists manual data entry from handwritten or printed prescriptions creates bottlenecks and verification errors. Furthermore, patients need instant generic substitution recommendations when uploading prescription images.

### Decision Taken
Integrate `@google/genai` (Google Gemini 2.5 Flash / Pro model) to perform:
1. Neural OCR parsing of uploaded prescriptions into structured JSON (NDC code, generic salt name, dosage, doctor details).
2. FDA Bioequivalence sameness verification and salt mapping assistance.

### Reasoning
- **Multimodal Capabilities:** High accuracy on handwritten medical prescriptions and structured lab CoA documents.
- **Speed & Latency:** Gemini 2.5 Flash provides sub-second parsing response times required for clinical dispensing workflow.
- **Structured JSON Schema Output:** Directly maps to `PrescriptionRecord` and `DispenseQueueItem` models.

### Alternatives Considered
1. **Tesseract.js / Traditional OCR:** High error rate on medical abbreviations (e.g. "q.d.", "b.i.d.") and handwritten doctor signatures.
2. **AWS Textract:** Higher per-request pricing and lack of integrated medical salt reasoning LLM capabilities.

### Impact on Project
- Added `PrescriptionScanModal.tsx` for real-time document analysis.
- Configured environment variables `GEMINI_API_KEY` for server and client fallbacks.

---

## ADR-004: Hybrid State Management & Persistent Session Strategy

- **Date:** 2026-09-01
- **Status:** Approved

### Context / Problem
Users switch seamlessly between 3 roles (Patient, Pharmacist, Wholesaler) during platform demonstrations and multi-device clinical operation. State must persist across page refreshes without requiring external OAuth service dependencies during offline micro-hub operation.

### Decision Taken
Use React local state hooks paired with `localStorage` persistence under key `genericmed_auth_user`. Demo accounts (`DEMO_ACCOUNTS`) pre-seeded for instant role switching across all 8 application views.

### Reasoning
- **Zero Friction:** Instant authentication switching between Dr. Sarah Jenkins (Pharmacist), Alex Morgan (Patient), and Apex Pharma (Wholesaler).
- **Offline Resilience:** Local storage ensures micro-hub dispatch state is preserved even during intermittent network drops.

### Alternatives Considered
1. **Redux Toolkit:** Overkill for current single-page clinical view architecture.
2. **Cookie-only Sessions:** Requires constant server validation, limiting offline clinical UI demo capability.

### Impact on Project
- Session hook in `App.tsx` initializes active user state automatically.
- Cart items and refill schedules sync with active user profile.

---

## ADR-005: Unified Single-Page Multi-Role Architecture (`AppViewMode`)

- **Date:** 2026-09-04
- **Status:** Approved

### Context / Problem
Stakeholders need to evaluate all facets of the generic medicine ecosystem (Clinical OS, Manufacturer Catalog, Infrastructure, Consumer Portal, Enterprise Analytics, Salt Mapping Engine, System Architecture PRD) without navigating complex multi-page routing reloads.

### Decision Taken
Implement a central `AppViewMode` state discriminator in `App.tsx` controlling top-level layout rendering via a unified header navigation bar (`Navigation.tsx`).

### Views Supported:
- `clinical-os`: Micro-hub dispensing queue & cold-chain monitor.
- `catalog-bioeq`: FDA bioequivalence catalog & batch CoA viewer.
- `infrastructure`: Multi-tenant database RLS metrics & schema health.
- `consumer-web`: Patient e-commerce mobile web & prescription vault.
- `enterprise-analytics`: Financial yield, arbitrage trends & stock metrics.
- `salt-mapping`: Innovator-to-generic chemical parity mapping engine.
- `architecture-prd`: Interactive product specification viewer.
- `auth`: Multi-role login and registration portal.

### Impact on Project
- Accelerated demonstration and testing workflow.
- Clean component isolation under `src/components/`.

---

## ADR-006: 21 CFR Part 11 Compliance & Audit Trail Logging Strategy

- **Date:** 2026-09-06
- **Status:** Approved

### Context / Problem
Pharmaceutical dispensing platform deployment requires compliance with FDA 21 CFR Part 11 for electronic signatures, tamper-evident batch labels, and immutable event auditing.

### Decision Taken
Integrate digital tamper-proof hash generation for batch labels (`TamperLabelModal.tsx`) and client-side PDF verification output using `jspdf` (`generatePrescriptionPdf.ts`).

### Reasoning
- **Audit Preparedness:** Every dispense action records timestamp, PharmD license number, NDC code, and digital checksum.
- **Client-Side PDF Generation:** Instant generation of official batch labels and CoA certificates without server processing roundtrips.

### Alternatives Considered
1. **Server-Side Puppeteer PDF Generation:** Too heavy for micro-hub edge devices and slow PDF render times.

### Impact on Project
- Integrated `jspdf` utility for instant CoA and Prescription download.
- Standardized GxP badge footers across all administrative UI views.
