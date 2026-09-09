# genericMed — Monorepo Architecture (Frontend & Backend Separated)

`genericMed` is a production-grade **B2B Health OS & Generic Medicine Rail** platform. The codebase is organized into completely decoupled `frontend/` and `backend/` subfolders.

---

## Directory Structure

```
genericMed/
├── frontend/                  # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── components/        # UI components & AuthScreen
│   │   ├── context/           # AuthContext (React Auth Provider)
│   │   ├── utils/             # apiService.ts (API client & JWT headers)
│   │   ├── types.ts           # Domain models & UserRole definition
│   │   └── App.tsx            # Main App layout wrapped in AuthProvider
│   ├── public/                # Static public assets
│   ├── index.html             # HTML entry point
│   ├── vite.config.ts         # Vite configuration with /api backend proxy
│   ├── tsconfig.json          # Frontend TypeScript configuration
│   ├── package.json           # Frontend dependencies
│   └── .env                   # VITE_API_BASE_URL=http://localhost:3001/api
│
├── backend/                   # Express REST API + MongoDB Atlas + JWT Auth Engine
│   ├── src/
│   │   ├── server.ts          # Express API endpoints & middleware setup
│   │   ├── db.ts              # MongoDB Atlas connection & auto-seeder
│   │   ├── models/            # Mongoose Schemas (User, Tenant, DispenseQueue, Medicine)
│   │   ├── routes/            # Auth API routes (/api/auth)
│   │   ├── middleware/        # authMiddleware (JWT verification) & roleMiddleware (RBAC)
│   │   └── utils/             # Input validators (validateRegisterInput, validateLoginInput)
│   ├── tsconfig.json          # Backend Node.js TypeScript configuration
│   ├── package.json           # Backend dependencies
│   └── .env                   # PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN
│
├── package.json               # Root monorepo orchestration & concurrent runner
├── README.md                  # System setup & authentication documentation
└── .gitignore                 # Monorepo git ignore rules
```

---

## Quick Start Guide

### 1. Installing Dependencies

Install all dependencies across the entire monorepo in one command from the root directory:

```bash
npm run install:all
```

Or install frontend and backend dependencies individually:

```bash
# Frontend Dependencies
cd frontend
npm install

# Backend Dependencies
cd ../backend
npm install
```

---

### 2. Environment Setup

Copy `.env.example` to `.env` in `backend/`:

```env
# Backend Environment Variables (backend/.env)
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://anuradhashirsath6_db_user:hpA4SYWsPxG1dLoz@cluster0.qc5umqq.mongodb.net/genericmed?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=super_secret_jwt_key_genericmed_2026_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

---

### 3. Running Frontend and Backend Together

From the root directory, run:

```bash
npm run dev
```

This launches both the **Express Backend Server** (Port `3001`) and **Vite Frontend Dev Server** (Port `3000`) concurrently.

---

## Authentication & Security System

The system implements full-stack JWT authentication, password hashing, and Role-Based Access Control (RBAC).

### Key Features
1. **Password Hashing**: Passwords are automatically hashed using `bcryptjs` (10 rounds) via Mongoose pre-save hooks.
2. **JWT Authorization**: Issued via HTTP-Only cookies & Bearer tokens valid for 7 days.
3. **Role-Based Access Control (RBAC)**: Supports 4 roles: `patient`, `pharmacist`, `wholesaler`, `admin`.
4. **Input Validation**: Sanitizes emails, enforces password length/complexity, and verifies mandatory role credentials (e.g. NPI for pharmacists).
5. **Session Persistence**: React `AuthContext` verifies current token on application load via `GET /api/auth/me`.

### Default Authenticated Accounts
The backend automatically seeds these accounts into MongoDB Atlas on startup with password `GenericMed#2026`:

| Role | Email | Default Password | Access Hub |
|---|---|---|---|
| **Patient** | `sarah.jenkins@healthmail.com` | `GenericMed#2026` | Patient Mobile Web & Savings |
| **Pharmacist** | `aris.thorne@mediquick-rx.com` | `GenericMed#2026` | Dispensing Queue & Clinical OS |
| **Wholesaler** | `supply.lead@cipla-generics.com` | `GenericMed#2026` | ANDA Catalog & Supply Chain |
| **Admin** | `admin@genericmed.health` | `GenericMed#2026` | Health OS Core Platform |

---

## API Endpoints Reference

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register`: Create a new user account with role validation.
- `POST /api/auth/login`: Authenticate email/identifier & password, returns JWT token.
- `POST /api/auth/logout`: Invalidate session and clear auth cookies.
- `GET /api/auth/me`: Fetch currently authenticated user profile (Protected by `authMiddleware`).

### System & Business Endpoints
- `GET /api/health`: 21 CFR Part 11 & GxP validation status + MongoDB connection check.
- `GET /api/tenants`: Multi-tenant schema isolation metrics.
- `GET /api/dispense-queue`: Real-time micro-hub pharmacy dispensing queue.
- `GET /api/medicines`: Generic medicine catalog bioequivalence records.
- `GET /api/dispense-queue/stream`: Server-Sent Events (SSE) live updates.
- `POST /api/stripe/checkout-session`: Checkout payment processing intent.

---

## Verification & Build

```bash
# Verify backend TypeScript compilation
npm run lint --prefix backend

# Build frontend and backend for production
npm run build
```
