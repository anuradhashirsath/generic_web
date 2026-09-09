# AI Development Rules & System Directives (rules.md)

This document contains mandatory guidelines and operational rules for AI coding assistants working on **genericMed — B2B Health OS & Generic Medicine Platform**. All rules MUST be strictly followed across all edits, refactors, and feature additions.

---

## Executive Directives

> [!IMPORTANT]
> **CRITICAL RULE: NEVER BREAK EXISTING FUNCTIONALITY**
> Do not remove, replace, or alter working components, view modes, types, export signatures, or mock datasets unless explicitly instructed by the user. Always extend existing interfaces backward-compatibly.

---

## 1. Coding Standards

### TypeScript Strictness
- **Strict Typing:** Avoid `any` at all costs. Explicitly type all component props, state variables, function returns, and API payloads using types defined in `src/types.ts`.
- **Interface & Type Exporting:** All core data models must reside in `src/types.ts`. Component-specific local interfaces can reside inside their respective component file.
- **Null & Undefined Safety:** Use optional chaining (`?.`) and nullish coalescing (`??`) when accessing optional properties (e.g. `user?.patientId ?? 'N/A'`).

### React 19 Best Practices
- **Functional Components:** Write pure functional components using standard standard React declaration: `export function ComponentName() { ... }` or `export const ComponentName: React.FC = () => { ... }`.
- **Hook Dependencies:** Maintain complete, exact dependency arrays for `useEffect`, `useCallback`, and `useMemo`.
- **State Immutability:** Never mutate state directly. Always use spread syntax or functional state updates:
  ```typescript
  // CORRECT
  setCart((prev) => [...prev, newItem]);
  
  // WRONG
  cart.push(newItem); setCart(cart);
  ```

### Code Formatting & Cleanliness
- **Indent & Spacing:** Use 2-space indentation.
- **Imports:** Group imports logically:
  1. External React / NPM libraries (`react`, `lucide-react`, `recharts`, `motion`)
  2. Types and interfaces (`../types`)
  3. Child components (`./modals/BatchCoAModal`)
  4. Utilities & mock data (`../data/mockData`)

---

## 2. Folder Structure Rules

Maintain strict modular organization under `src/`:

```
src/
├── App.tsx                        # Main application container & view mode switcher
├── main.tsx                       # React root entrypoint
├── index.css                      # Tailwind v4 import & custom styles
├── types.ts                       # Global TypeScript types & interfaces
├── data/
│   └── mockData.ts                # Production-grade seed datasets (tenants, queue, catalog)
├── utils/
│   └── generatePrescriptionPdf.ts # PDF export & GxP validation helper scripts
└── components/
    ├── Navigation.tsx             # Top navigation & view switcher bar
    ├── AuthScreen.tsx             # Multi-role login & registration component
    ├── ClinicalHealthOS.tsx       # B2B Micro-hub dispensing queue & cold-chain dashboard
    ├── CatalogBioequivalence.tsx  # FDA bioequivalence catalog & batch CoA inspector
    ├── InfrastructureCore.tsx     # Multi-tenant schema health & RLS security dashboard
    ├── ConsumerApp.tsx            # Patient e-commerce mobile web & prescription vault
    ├── EnterpriseAnalytics.tsx    # Financial yield & inventory analytics dashboard
    ├── SaltMappingEngine.tsx      # Innovator vs generic chemical parity engine
    ├── ArchitectureViewer.tsx     # Interactive system PRD specification viewer
    ├── charts/                    # Reusable Recharts charting components
    │   └── MedicinePriceTrendChart.tsx
    ├── modals/                    # Contextual popups & inspection modals
    │   ├── BatchCoAModal.tsx
    │   ├── DrugInteractionModal.tsx
    │   ├── PrescriptionHistoryModal.tsx
    │   ├── PrescriptionScanModal.tsx
    │   ├── RefillScheduleModal.tsx
    │   ├── SetPriceAlertModal.tsx
    │   └── TamperLabelModal.tsx
    └── notifications/             # Alert banners & scheduler widgets
        ├── PushNotificationBanner.tsx
        └── PushRefillScheduler.tsx
```

### File Placement Rules:
- **New Views:** Add to `src/components/` and register in `AppViewMode` type in `src/types.ts`.
- **New Modals:** Place inside `src/components/modals/` with naming convention `[Feature]Modal.tsx`.
- **New Charts:** Place inside `src/components/charts/` with naming convention `[Metric]Chart.tsx`.
- **Utilities:** Place in `src/utils/` with clear functional naming.

---

## 3. Naming Conventions

| Category | Style | Example |
| :--- | :--- | :--- |
| **Components** | PascalCase | `ClinicalHealthOS.tsx`, `BatchCoAModal.tsx` |
| **Interfaces / Types** | PascalCase | `DispenseQueueItem`, `TenantSchemaRecord` |
| **Type Discriminations** | kebab-case strings | `'clinical-os'`, `'catalog-bioeq'`, `'consumer-web'` |
| **Functions / Variables** | camelCase | `handleAddToCart`, `calculateArbitrageYield` |
| **Constants** | UPPER_SNAKE_CASE | `DEMO_ACCOUNTS`, `FDA_RATING_CODES` |
| **CSS Classes** | Tailwind utilities | `flex items-center text-emerald-600 font-bold` |

---

## 4. UI/UX Consistency Rules

### Color Palette (Tailwind CSS v4)
- **Primary / Health OS:** Slate dark backgrounds (`bg-slate-900`), Emerald accents (`bg-emerald-500`, `text-emerald-400`).
- **Clinical Badges:**
  - Rush Priority / Critical Alert: `bg-rose-500/10 text-rose-600 border-rose-200`
  - High Priority / Warning: `bg-amber-500/10 text-amber-600 border-amber-200`
  - Verified / Normal / Healthy: `bg-emerald-500/10 text-emerald-600 border-emerald-200`
  - Information / System: `bg-indigo-500/10 text-indigo-600 border-indigo-200`

### Typography & Spacing
- Primary Font: Standard sans-serif (`font-sans`).
- Data & System Identifiers: Monospace font (`font-mono`) for NDC codes, Rx numbers, CAS numbers, and RLS schema names.
- Card & Container Spacing: `p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm`.

### Iconography & Motion
- Use `lucide-react` icons exclusively. Set consistent sizing (`w-4 h-4` for inline text, `w-5 h-5` for buttons, `w-6 h-6` for headers).
- Use `framer-motion` (`motion` package) for modal pop-ups, view transitions, and tab switches.

---

## 5. Git Commit Rules

All git commits MUST follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>
```

### Approved Commit Types:
- `feat`: A new user-facing feature or view mode.
- `fix`: Bug fix in clinical calculations, state persistence, or UI rendering.
- `docs`: Updates to `decisions.md`, `rules.md`, `memory.md`, `changelog.md`, or code inline JSDoc.
- `style`: Cosmetic tweaks, layout adjustments, or Tailwind styling changes without logic impact.
- `refactor`: Code reorganization (e.g. splitting components) with zero visual/functional behavior change.
- `test`: Addition or modification of unit/integration test logic.
- `chore`: Updating `package.json`, Vite configuration, or build scripts.

### Examples:
```bash
git commit -m "feat(clinical-os): add cold-chain temperature telemetry alert modal"
git commit -m "fix(ocr): resolve missing NDC fallback parsing in prescription scanner"
git commit -m "docs(rules): document mandatory non-breaking feature guidelines"
```

---

## 6. Security & Environment Variable Rules

### Environment Variables
- Secrets MUST NOT be hardcoded in client components.
- Store keys in `.env` (git-ignored) and mirror placeholders in `.env.example`.
- Access variables via `import.meta.env.VITE_GEMINI_API_KEY` (client) or `process.env.GEMINI_API_KEY` (server).

### Data Protection & Compliance
- **Zero Raw PII Exposure:** Patient names in mock datasets must use anonymized identifiers in public logs.
- **Tenant Data Isolation:** Ensure mock API operations sanitize data according to active `tenantId`.
- **Sanitized HTML/Text:** Avoid `dangerouslySetInnerHTML`. Sanitize any user-generated markdown before rendering.

---

## Checklist Before Finishing Any Coding Task

- [ ] Code compiles cleanly with zero TypeScript errors (`npm run lint` or `tsc --noEmit`).
- [ ] Existing view modes (`AppViewMode`) function without regression.
- [ ] Data models added or edited are defined in `src/types.ts`.
- [ ] Code is formatted cleanly with 2-space indents and standard imports.
- [ ] `changelog.md` and `memory.md` updated if new features or API models were created.
