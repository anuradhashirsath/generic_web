import React, { useState } from 'react';

export const ArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'prd' | 'ddl'>('architecture');

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <span className="material-symbols-outlined text-xl">account_tree</span>
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  System Architecture & Production PRD Specification
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  ENTERPRISE SPECIFICATION v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Architectural topology, PostgreSQL 16 schema isolation invariants, and FDA 21 CFR Part 11 requirements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'architecture' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                System Architecture
              </button>
              <button
                onClick={() => setActiveTab('prd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'prd' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Product PRD Specs
              </button>
              <button
                onClick={() => setActiveTab('ddl')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ddl' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Database Schema (DDL)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* Architectural Diagram Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">
                  genericMed Multi-Tenant SaaS Topology
                </h3>
                <p className="text-xs text-slate-500">
                  Interactive layered breakdown of Ingress, Application Core, Multi-Tenant Schemas, and Compliance Bus
                </p>
              </div>

              {/* Layer 1: Clients & Ingress */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Layer 1 • Multi-Channel Client Surfaces
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">smartphone</span>
                      <span>Consumer Mobile Web</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Compare, Rx Vault, Split-cart & Courier tracking</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-600 text-sm">local_pharmacy</span>
                      <span>Micro-Hub Clinical OS</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Cleanroom CAM, Tesseract OCR, Tamper Print</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-teal-600 text-sm">science</span>
                      <span>Manufacturer Tenant</span>
                    </div>
                    <p className="text-[11px] text-slate-500">CoA Lot Releases, f2 dissolution & Tier pricing</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-purple-600 text-sm">dns</span>
                      <span>Super Admin Console</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Postgres Schema Isolation, RLS audits, Arbitrage</p>
                  </div>
                </div>
              </div>

              {/* Layer 2: Edge Gateway & Security */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Layer 2 • Zero-Trust Edge Gateway
                </span>
                <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-teal-400 text-2xl">shield</span>
                    <div>
                      <div className="font-bold">Cloudflare CDN + Envoy Edge Gateway (18.4ms p99)</div>
                      <div className="text-slate-400 text-[11px]">Tenant Context Injection via JWT (X-Tenant-ID) • WAF & Rate Limiting</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <span>TLS 1.3</span>
                    <span>•</span>
                    <span>mTLS Micro-Services</span>
                    <span>•</span>
                    <span>HIPAA Compliant</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Application Core & Algorithmic Engines */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Layer 3 • Core Microservices & Arbitrage Engines
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1.5">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">schema</span>
                      <span>Chemical Arbitrage Router</span>
                    </div>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      Matches branded drugs to active generic salts using FDA Orange Book AB ratings with algorithmic price floor calculation.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1.5">
                    <div className="font-bold text-blue-950 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-600 text-sm">document_scanner</span>
                      <span>Neural OCR & PDMP Engine</span>
                    </div>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      Tesseract v5.2 parses doctor prescriptions, validates NPI/DEA numbers, and cross-references state PDMP registries.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-1.5">
                    <div className="font-bold text-purple-950 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-purple-600 text-sm">route</span>
                      <span>Courier Dispatch & Cold-Chain</span>
                    </div>
                    <p className="text-purple-800 text-[11px] leading-relaxed">
                      Synchronizes multi-depot routes with one-time handshake PIN verification and IoT temperature telemetry logging.
                    </p>
                  </div>
                </div>
              </div>

              {/* Layer 4: Multi-Tenant Data Tier */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Layer 4 • Schema-per-Tenant Database Cluster & Cache
                </span>
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="font-bold text-slate-900">PostgreSQL 16 Multi-Tenant Namespaces</div>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                      Zero-Trust Row-Level Security
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-white rounded border border-slate-200 text-slate-800">
                      <code>tenant_mediquick_042</code>
                      <span className="block text-[10px] text-slate-400 font-sans mt-0.5">Dispensing & Lockbox State</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200 text-slate-800">
                      <code>tenant_cipla_global</code>
                      <span className="block text-[10px] text-slate-400 font-sans mt-0.5">CoA Lots & Dissolution (f2)</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200 text-slate-800">
                      <code>shared_pharmacopeia</code>
                      <span className="block text-[10px] text-slate-400 font-sans mt-0.5">FDA Orange Book & CAS Registry</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prd' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-slate-800">
            <div>
              <h2 className="text-xl font-black text-slate-900">genericMed — Product Requirements Document (PRD)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Author: Architecture & Clinical Systems Engineering • Status: APPROVED FOR PRODUCTION
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-1">
                  1. Executive Summary & Problem Statement
                </h3>
                <p>
                  American patients pay up to 800% premiums for branded off-patent pharmaceuticals due to pharmacy benefit manager (PBM) rebate friction, lack of chemical bioequivalence transparency, and fragmented distribution. <strong>genericMed</strong> creates an algorithmic health operating system that connects pharmaceutical manufacturers (Cipla, Sun Pharma, Zydus) directly to licensed micro-hub pharmacies for on-demand 45-minute delivery at generic floor prices.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-1">
                  2. Core Functional Requirements (FR)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li>
                    <strong>FR-1 (Orange Book AB Bioequivalence):</strong> Every substituted medication must present a validated FDA ANDA approval code, bioequivalence rating (AB/AP), and in-vitro dissolution score (f2 &gt; 50%).
                  </li>
                  <li>
                    <strong>FR-2 (Micro-Hub Dispense Queue):</strong> Pharmacists must have a real-time intake queue with SLA timer tracking, cleanroom camera feed integration, and 1-click 21 CFR Part 11 tamper label printing.
                  </li>
                  <li>
                    <strong>FR-3 (Multi-Courier PIN Handshake):</strong> Split orders sourced from multiple partner micro-hubs must bundle into synchronized delivery routes verified by a 4-digit cryptographic OTP courier handshake.
                  </li>
                  <li>
                    <strong>FR-4 (IoT Cold Chain Enforcement):</strong> Biologics and peptides (e.g. Liraglutide, Semaglutide) must stream temperature sensor logs (2°C - 8°C); out-of-range deviations immediately trigger automated lot quarantine.
                  </li>
                  <li>
                    <strong>FR-5 (Schema-per-Tenant Isolation):</strong> Every pharmacy and manufacturer tenant must operate inside an isolated database schema with encrypted PII columns and Row-Level Security policies.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-1">
                  3. Non-Functional Requirements & Security
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block">p99 Latency &lt; 20ms</span>
                    <span className="text-[11px] text-slate-500">Redis 7 caching layer ensures sub-20ms price comparisons across 14,000+ SKUs.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block">21 CFR Part 11 Compliance</span>
                    <span className="text-[11px] text-slate-500">Every override, lot release, and dispense approval produces an immutable SHA-256 digital signature.</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'ddl' && (
          <div className="bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-emerald-400 font-bold">PostgreSQL 16 Multi-Tenant DDL Schema</span>
              <span className="text-slate-400 text-[11px]">schema.sql • 21 CFR Part 11 Compliant</span>
            </div>

            <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
{`-- 1. TENANT SCHEMA PROVISIONING FUNCTION
CREATE OR REPLACE FUNCTION provision_tenant_namespace(tenant_slug TEXT, kms_key_arn TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS tenant_%I', tenant_slug);
    
    -- Prescriptions Table with RLS
    EXECUTE format('
        CREATE TABLE tenant_%I.prescriptions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            rx_number VARCHAR(32) NOT NULL,
            patient_name_encrypted BYTEA NOT NULL,
            generic_salt_ndc VARCHAR(16) NOT NULL,
            dosage_strength VARCHAR(32) NOT NULL,
            fda_ab_rating VARCHAR(4) DEFAULT ''AB'',
            status VARCHAR(32) DEFAULT ''QUEUED'',
            tamper_seal_hash VARCHAR(64),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE tenant_%I.prescriptions ENABLE ROW LEVEL SECURITY;
        CREATE POLICY tenant_isolation_policy ON tenant_%I.prescriptions
            FOR ALL USING (current_setting(''app.current_tenant'') = %L);
    ', tenant_slug, tenant_slug, tenant_slug, tenant_slug);
END;
$$ LANGUAGE plpgsql;

-- 2. IMMUTABLE AUDIT LOG (21 CFR PART 11)
CREATE TABLE public.regulatory_audit_ledger (
    entry_id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT clock_timestamp(),
    tenant_id VARCHAR(64) NOT NULL,
    actor_pharmacist_id VARCHAR(64) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    payload_snapshot JSONB NOT NULL,
    previous_block_hash VARCHAR(64) NOT NULL,
    signature_hash VARCHAR(64) GENERATED ALWAYS AS (
        encode(digest(payload_snapshot::text || previous_block_hash, 'sha256'), 'hex')
    ) STORED
);`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
