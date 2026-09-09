# Project Changelog (changelog.md)

All notable changes to **genericMed — B2B Health OS & Generic Medicine Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Scheduled background auto-refill notification queue with customizable SMS and Push alert channels.
- HL7/FHIR EHR API endpoint schemas for future clinical integration.

## [1.3.0] - 2026-09-08

### Added
- **Phase 6:** Express backend server (`server/server.ts`), PostgreSQL multi-tenant schema isolation migration (`server/schema.sql`), real-time Server-Sent Events (SSE) stream, and client API service (`src/utils/apiService.ts`).
- **Phase 7:** HL7 FHIR R4 integration adapter (`src/utils/fhirAdapter.ts`), SMART on FHIR OAuth 2.0 PKCE launch modal (`EhrFhirSyncModal.tsx`), and one-click EHR prescription ingestion into dispensing queue.
- **Phase 8:** MQTT protocol IoT hardware bridge (`src/utils/mqttIotBridge.ts`) for cleanroom robotic pill isolators and Gemini 2.5 Pro powered AI Formulator Copilot (`AiFormulatorModal.tsx`) for predictive ANDA patent expiry forecasting.

---

## [1.2.0] - 2026-09-08

### Added
- Persistent AI Context files (`decisions.md`, `rules.md`, `memory.md`, `changelog.md`) for automated project governance and developer reference.
- Multi-role demo session switcher supporting Patient, Pharmacist, and Wholesaler accounts in `AuthScreen.tsx`.
- GxP 21 CFR Part 11 compliant PDF prescription batch label export engine (`generatePrescriptionPdf.ts`).
- Digital tamper-evident checksum verification modal (`TamperLabelModal.tsx`) for micro-hub dispatch packages.

### Changed
- Refactored `App.tsx` global header navigation to support responsive drawer layouts on mobile devices.
- Upgraded `recharts` price comparison charts with custom tooltips displaying innovator WAC vs generic floor savings percentage.
- Standardized cold-chain safety telemetry threshold checks across dispensing queues (`ClinicalHealthOS.tsx`).

### Fixed
- Resolved state sync issue in cart items when switching between Patient view and Pharmacist view mode.
- Fixed TypeScript type mismatch in `TenantSchemaRecord` query throughput property.
- Fixed dark mode contrast accessibility in FDA bioequivalence rating badges.

---

## [1.1.0] - 2026-09-01

### Added
- Google Gemini 2.5 Flash Neural OCR Integration (`PrescriptionScanModal.tsx`) for automated NDC and prescription document scanning.
- Interactive Batch Certificate of Analysis (CoA) Inspector modal (`BatchCoAModal.tsx`).
- Drug Interaction Alert Modal (`DrugInteractionModal.tsx`) for clinical triage.
- Price Alert setting modal (`SetPriceAlertModal.tsx`) allowing patients to subscribe to floor price drops.

### Changed
- Updated Tailwind CSS configuration to version 4 with custom health OS theme colors (emerald, slate, rose, amber).
- Enhanced mock dataset in `mockData.ts` with real-world NDC codes, CAS numbers, and ANDA approval numbers.

### Fixed
- Fixed local storage JSON parse exception handling during page initialization.
- Corrected f2 dissolution similarity calculation formula edge cases in catalog view.

---

## [1.0.0] - 2026-08-20

### Added
- Initial production release of **genericMed Health OS**.
- Integrated B2B Clinical Micro-Hub Dispensing Queue view mode (`ClinicalHealthOS.tsx`).
- FDA Bioequivalence & Formulation Catalog view mode (`CatalogBioequivalence.tsx`).
- Multi-Tenant Schema Isolation & RLS Security Infrastructure Core view mode (`InfrastructureCore.tsx`).
- Patient E-Commerce Mobile Web & Prescription Vault view mode (`ConsumerApp.tsx`).
- Salt Mapping & Financial Arbitrage Engine view mode (`SaltMappingEngine.tsx`).
- Enterprise Financial Analytics Dashboard (`EnterpriseAnalytics.tsx`).
- Interactive System Specification & PRD Viewer (`ArchitectureViewer.tsx`).

---

## [0.9.0] - 2026-08-15

### Added
- Project initialization with Vite 6, React 19, and TypeScript 5.8.
- Basic component structure and type definitions (`src/types.ts`).
- Development and build scripts in `package.json`.
