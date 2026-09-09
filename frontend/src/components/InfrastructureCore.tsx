import React, { useState } from 'react';
import { TenantSchemaRecord } from '../types';
import { TENANT_SCHEMAS } from '../data/mockData';

export const InfrastructureCore: React.FC = () => {
  const [tenants, setTenants] = useState<TenantSchemaRecord[]>(TENANT_SCHEMAS);
  const [selectedTenant, setSelectedTenant] = useState<TenantSchemaRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'schemas' | 'cluster' | 'audit'>('schemas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateRLSCheck = (id: string) => {
    showToast('Zero-trust RLS leak simulation passed with 0 row cross-contamination.');
  };

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header (Matching Image 5) */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <span className="material-symbols-outlined text-xl">dns</span>
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Multi-Tenant Database & Schema Isolation
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  POSTGRESQL 16 • SCHEMA-PER-TENANT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Active Fleet Context: <strong className="text-slate-200">All Organizations (Global Infrastructure)</strong> • Zero Data Leakage Architecture
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateRLSCheck('all')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">security</span>
                <span>Run RLS Leak Simulation</span>
              </button>
              <button
                onClick={() => showToast('Tenant Provisioning CLI wizard triggered.')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_box</span>
                <span>Provision New Tenant Schema</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Fleet KPI Metrics (Matching Image 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Multi-Tenant Fleet</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">domain_verification</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">148</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                +12% MoM
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">84 pharmacies, 36 GPOs, 28 manufacturers</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Isolation Assurance</span>
              <span className="material-symbols-outlined text-teal-600 text-lg">shield</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">100%</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Schema-per-tenant + RLS, 0 leak incidents</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Gross MTD Volume</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">account_balance</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">$1.42M</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                4.8% avg fee
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">$71.2k platform fees, $380.5k in escrow</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Edge API Gateway</span>
              <span className="material-symbols-outlined text-purple-600 text-lg">bolt</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">4,820</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                req/sec
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">18.4ms p99 latency • 94.6% cache hit rate</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('schemas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schemas'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tenant Schema Fleet (148 Isolated Schemas)
          </button>
          <button
            onClick={() => setActiveTab('cluster')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cluster'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Data Cluster & Asynchronous Bus
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Immutable Audit Ledger (21 CFR Part 11)
          </button>
        </div>

        {activeTab === 'schemas' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Active Tenant Schema Isolation Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Each tenant owns an independent PostgreSQL namespace with cryptographic column encryption and Row-Level Security.
                </p>
              </div>
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                RLS Enforcement: ACTIVE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tenant Organization</th>
                    <th className="px-4 py-3">Schema Identifier</th>
                    <th className="px-4 py-3">Tenant Category</th>
                    <th className="px-4 py-3">RLS Policies</th>
                    <th className="px-4 py-3">p99 Latency</th>
                    <th className="px-4 py-3">Storage Allocation</th>
                    <th className="px-4 py-3">Monetization Plan</th>
                    <th className="px-4 py-3 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-slate-900 text-xs">{t.organizationName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.encryptionAlgorithm}</div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-emerald-700 font-bold text-xs">
                        <span className="bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          {t.schemaIdentifier}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-semibold text-slate-700">{t.tenantType}</span>
                        <div className="text-[10px] text-slate-400">{t.pricingTier}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-900">{t.rlsPolicyCount} Policies</span>
                        <div className="text-[10px] text-emerald-600 font-semibold">Strict Zero-Trust</div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-800">
                        {t.avgQueryLatencyMs} ms
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-mono text-slate-900">{t.storageMb.toFixed(1)} MB</div>
                        <div className="text-[10px] text-slate-400">{t.totalRecords.toLocaleString()} rows</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-medium text-slate-800">{t.contractBillingRate}</span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedTenant(t);
                            showToast(`Inspecting schema isolation for ${t.schemaIdentifier}`);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Inspect RLS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cluster' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">database</span>
                  <h4 className="font-bold text-slate-900 text-sm">PostgreSQL 16 Primary</h4>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  LEADER
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between"><span>Node ID:</span><code className="font-bold">pg-master-us-east-1</code></div>
                <div className="flex justify-between"><span>Active Connections:</span><span className="font-bold">242 / 1000</span></div>
                <div className="flex justify-between"><span>Replication Lag:</span><span className="text-emerald-600 font-bold">0 ms (sync)</span></div>
                <div className="flex justify-between"><span>Disk I/O:</span><span>14,200 IOPS</span></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">cached</span>
                  <h4 className="font-bold text-slate-900 text-sm">Redis 7 Global Cache</h4>
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  CLUSTER
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between"><span>Hit Ratio:</span><span className="font-bold text-emerald-600">94.6%</span></div>
                <div className="flex justify-between"><span>Keys in Store:</span><span className="font-bold">482,104 keys</span></div>
                <div className="flex justify-between"><span>Memory Used:</span><span>2.8 GB / 8 GB</span></div>
                <div className="flex justify-between"><span>Avg Ops/Sec:</span><span>18,400 ops/s</span></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">hub</span>
                  <h4 className="font-bold text-slate-900 text-sm">Kafka Work Queue Bus</h4>
                </div>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  3 BROKERS
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between"><span>Event Topics:</span><span className="font-bold">rx.dispensed, coa.released</span></div>
                <div className="flex justify-between"><span>Consumer Lag:</span><span className="text-emerald-600 font-bold">0 ms</span></div>
                <div className="flex justify-between"><span>Throughput:</span><span>1.8M msg/hr</span></div>
                <div className="flex justify-between"><span>Encryption:</span><span>mTLS + TLS 1.3</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Cryptographic Ledger & 21 CFR Part 11 Audit Trail
                </h3>
                <p className="text-xs text-slate-500">
                  Every schema change, drug release, and pharmacist override is appended to an append-only cryptographic log.
                </p>
              </div>
              <button 
                onClick={() => showToast('Full regulatory log downloaded as cryptographic JSON.')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { time: '12:04:18 UTC', event: 'CoA Batch Released', tenant: 'tenant_cipla_global', hash: 'e9a4f7c182b...', actor: 'Dr. Vikram Mehta, QC' },
                { time: '11:48:02 UTC', event: 'RLS Leak Simulation Passed', tenant: 'tenant_mediquick_042', hash: '8f2a1b94c01...', actor: 'System Daemon (Zero Trust)' },
                { time: '11:15:39 UTC', event: 'Pharmacist Override Signed', tenant: 'tenant_mediquick_042', hash: '3d8819a022f...', actor: 'Dr. Aris Thorne, PharmD' },
                { time: '10:30:12 UTC', event: 'Schema Migration v4.8 Applied', tenant: 'All 148 Tenants', hash: '7c40b8a194e...', actor: 'Automated Migration CI' }
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{log.time}</span>
                    <span className="font-bold text-slate-800 text-[11px] font-sans">{log.event}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                      {log.tenant}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    <span>Actor: {log.actor} • Hash: <code className="text-slate-700 font-bold">{log.hash}</code></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RLS Inspector Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">{selectedTenant.organizationName}</h4>
                <p className="text-xs text-emerald-400 font-mono">Schema: {selectedTenant.schemaIdentifier}</p>
              </div>
              <button onClick={() => setSelectedTenant(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 font-mono">
                <div className="font-bold text-slate-800 text-xs font-sans">Active Postgres RLS Policies:</div>
                <div className="text-[11px] text-emerald-700">✓ POLICY tenant_isolation_select ON prescriptions FOR SELECT USING (tenant_id = current_setting(&apos;app.current_tenant&apos;));</div>
                <div className="text-[11px] text-emerald-700">✓ POLICY tenant_isolation_insert ON prescriptions FOR INSERT WITH CHECK (tenant_id = current_setting(&apos;app.current_tenant&apos;));</div>
                <div className="text-[11px] text-emerald-700">✓ POLICY pii_encryption_guard ON patient_identities USING (pgp_sym_encrypt(ssn, current_tenant_kms_key()));</div>
              </div>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                Zero-trust testing validates that cross-tenant queries return 0 rows under all adversarial conditions.
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTenant(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
