# genericMed — Monorepo Architecture (Frontend & Backend Separated)

`genericMed` is a production-grade **B2B Health OS & Generic Medicine Rail** platform. The codebase is organized into completely decoupled `frontend/` and `backend/` subfolders.

---

## Directory Structure

```
genericMed/
├── frontend/                  # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/                   # React components, pages, utils, types, mock data
│   ├── public/                # Static public assets
│   ├── index.html             # HTML entry point
│   ├── vite.config.ts         # Vite configuration with /api backend proxy
│   ├── tsconfig.json          # Frontend TypeScript configuration
│   ├── package.json           # Frontend dependencies
│   └── .env                   # VITE_API_BASE_URL=http://localhost:3001/api
│
├── backend/                   # Express REST API + SSE + Database Engine
│   ├── src/
│   │   ├── server.ts          # Express API endpoints & SSE stream handlers
│   │   └── schema.sql         # PostgreSQL schema definition & RLS policies
│   ├── tsconfig.json          # Backend Node.js TypeScript configuration
│   ├── package.json           # Backend dependencies
│   └── .env                   # PORT=3001, NODE_ENV=development
│
├── package.json               # Root monorepo orchestration & concurrent runner
├── README.md                  # System setup & startup documentation
└── .gitignore                 # Monorepo git ignore rules
```

---

## Quick Start Guide

### 1. Installing Dependencies

You can install all dependencies across the entire monorepo in one command from the root directory:

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

Copy `.env.example` to `.env` in both `frontend` and `backend` subdirectories:

```bash
# Frontend Environment Variable (frontend/.env)
VITE_API_BASE_URL=http://localhost:3001/api

# Backend Environment Variables (backend/.env)
PORT=3001
NODE_ENV=development
```

---

### 3. Running Frontend and Backend Together (Recommended)

From the root directory, run:

```bash
npm run dev
```

This launches both the **Express Backend Server** (Port `3001`) and **Vite Frontend Dev Server** (Port `3000`) concurrently.

---

### 4. Running Frontend and Backend Independently

#### Option A: Root Orchestrator Shortcuts
- **Backend Only**: `npm run dev:backend`
- **Frontend Only**: `npm run dev:frontend`

#### Option B: Direct Subfolder Execution
```bash
# Start Backend Express API (Port 3001)
cd backend
npm run dev

# Start Frontend React App (Port 3000)
cd frontend
npm run dev
```

---

### 5. Building for Production

To build both frontend and backend for production deployment:

```bash
npm run build
```

Individual build commands:
- **Build Frontend**: `npm run build:frontend`
- **Build Backend**: `npm run build:backend`

---

## API & Backend Integration Details

- **Backend Express Server**: Runs on `http://localhost:3001`
  - `GET /api/health`: 21 CFR Part 11 & GxP health check.
  - `GET /api/tenants`: Multi-tenant schema isolation metrics.
  - `GET /api/dispense-queue`: Real-time pharmacy micro-hub dispatch queue.
  - `GET /api/dispense-queue/stream`: Server-Sent Events (SSE) live updates.
  - `POST /api/stripe/checkout-session`: Payment gateway intent.

- **Vite Dev Proxy**: `frontend/vite.config.ts` proxies all requests to `/api` directly to `http://localhost:3001`.
