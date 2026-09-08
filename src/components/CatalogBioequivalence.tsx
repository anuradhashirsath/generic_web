import React, { useState } from 'react';
import { FormulationItem } from '../types';
import { FORMULATIONS } from '../data/mockData';
import { BatchCoAModal } from './modals/BatchCoAModal';

export const CatalogBioequivalence: React.FC = () => {
  const [formulations, setFormulations] = useState<FormulationItem[]>(FORMULATIONS);
  const [showCoAModal, setShowCoAModal] = useState(false);
  const [selectedFormulation, setSelectedFormulation] = useState<FormulationItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = formulations.filter((f) => {
    if (statusFilter === 'verified') return f.coAStatus === 'Verified cGMP';
    if (statusFilter === 'pending') return f.coAStatus === 'Pending QC';
    return true;
  });

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Manufacturer Header (Matching Image 3) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Cipla Global Therapeutics Ltd
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  cGMP Certified (0 Warning Letters)
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">
                  TENANT #CGT-NA-09
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>FDA FEI: <strong className="text-slate-700 font-mono">#3002819401</strong></span>
                <span>•</span>
                <span>DUNS: <strong className="text-slate-700 font-mono">08-392-1104</strong></span>
                <span>•</span>
                <span>Site: <strong className="text-slate-700">Formulation Site #4 (Piscataway, NJ)</strong></span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Orange Book AB Parity 100%</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCoAModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                <span>Upload Batch Lot Release (CoA)</span>
              </button>
              <button
                onClick={() => showToast('FDA ANDA Dossier creation wizard opened.')}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>Register Generic Salt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Metric KPI Cards (Matching Image 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Active Formulations</span>
              <span className="material-symbols-outlined text-teal-600 text-lg">science</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">42</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                100% AB Rated
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">All registered under US FDA ANDA</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Allocated Inventory</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">inventory_2</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">1.42M</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                Unit Doses
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Staged across 6 regional micro-hubs</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">B2B Wholesale GMV</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">paid</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">$428,500</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Settled
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">$184.2k active escrow balance</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Bioequivalence</span>
              <span className="material-symbols-outlined text-purple-600 text-lg">stacked_line_chart</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">99.8%</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                90% CI Parity
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Exceeds FDA ±20% equivalence bounds</p>
          </div>
        </div>

        {/* Latest Lot Release Alert Strip */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300">
              <span className="material-symbols-outlined text-xl">new_releases</span>
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Latest Lot Release: Atorvastatin Calcium 20mg (Lot #CP-2025-0819)</span>
                <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-2 py-0.2 rounded font-mono">
                  640,000 Doses Released
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                In-vitro dissolution similarity f2: <strong className="text-white">78.4%</strong> • AUC ratio: <strong className="text-white">99.4%</strong> • Micro-hub allocation active.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Full CoA PDF with HPLC Mass Spec Chromatograms opened.')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              View Full CoA Spec
            </button>
            <button
              onClick={() => showToast('Lot pushed to regional micro-hub auto-replenishment rail.')}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Push to Micro-Hub Rail
            </button>
          </div>
        </div>

        {/* Registered Formulations Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/60">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Registered Formulations & Bioequivalence Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Validated in-vitro dissolution (f2) & in-vivo pharmacokinetic parameters
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 bg-white border border-slate-200'
                }`}
              >
                All (4)
              </button>
              <button
                onClick={() => setStatusFilter('verified')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                }`}
              >
                Verified cGMP (3)
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-700 bg-amber-50 border border-amber-200'
                }`}
              >
                Pending QC (1)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Molecule & Chemical Entity</th>
                  <th className="px-4 py-3">FDA Approval & ANDA</th>
                  <th className="px-4 py-3">Dissolution (f2)</th>
                  <th className="px-4 py-3">PK AUC Ratio (90% CI)</th>
                  <th className="px-4 py-3">Active Lot & Stock</th>
                  <th className="px-4 py-3">Tier Pricing (Unit)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900 text-xs">{item.chemicalName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Innovator: <span className="font-semibold text-slate-700">{item.innovatorReferenceBrand}</span> ({item.innovatorOwner})
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">CAS: {item.casNumber}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-slate-800 text-[11px] block">{item.fdaApprovalCode}</span>
                      <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                        Rating: {item.bioequivalenceRating}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {item.f2DissolutionSimilarity}%
                      </div>
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-teal-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, item.f2DissolutionSimilarity)}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400">&gt;50 is equivalent</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono text-xs font-semibold text-slate-800">
                        {item.aucRatioConfidenceInterval}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Cmax: {item.cMaxRatioConfidenceInterval}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {item.unitDoseInventory.toLocaleString()} doses
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Lot <code className="font-bold">{item.activeLot}</code> (Exp {item.lotExpDate})
                      </div>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        item.coAStatus === 'Verified cGMP' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.coAStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900">
                        ${item.tier2Price.toFixed(3)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Tier I: ${item.tier1Price.toFixed(3)} | III: ${item.tier3Price.toFixed(3)}
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600">
                        {item.savingsPercentage}% vs Brand
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedFormulation(item)}
                        className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                      >
                        Inspect CoA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-Tenant Volume Pricing Tiers & Regional Logistics (Matching Image 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Volume Pricing Tiers (1 col) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Multi-Tenant Volume Pricing Tiers</h3>
              <p className="text-xs text-slate-500">Automated rebate & wholesale discounting schedule</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800">Tier I — Micro-Hub Rail (&lt;50k doses)</span>
                  <span className="font-mono text-slate-900">$0.065 / tab</span>
                </div>
                <p className="text-[11px] text-slate-500">Baseline for independent retail pharmacy micro-hubs</p>
              </div>

              <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/50 space-y-1 relative">
                <span className="absolute top-2 right-2 text-[9px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  Most Popular
                </span>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900">Tier II — Regional GPO (50k - 250k doses)</span>
                  <span className="font-mono text-emerald-700">$0.054 / tab</span>
                </div>
                <p className="text-[11px] text-slate-600">-16.9% discount. Used by Austin Health GPO</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800">Tier III — Enterprise Master (&gt;250k doses)</span>
                  <span className="font-mono text-slate-900">$0.046 / tab</span>
                </div>
                <p className="text-[11px] text-slate-500">-29.2% discount under Master Purchasing Agreement</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">B2B Escrow Engine:</span>
              <span className="font-bold text-slate-700">T+1 Automated ACH Settlement</span>
            </div>
          </div>

          {/* Regional Hub Logistics & Depots (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Regional Hub Logistics & Micro-Depot Allocation</h3>
                <p className="text-xs text-slate-500">Active supply staging from Piscataway Formulation Site #4</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                4 Hubs Receiving
              </span>
            </div>

            {/* Interactive Regional Map / Nodes Simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>HUB-01 (Edison, NJ Depot)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">640k tabs</span>
                </div>
                <p className="text-[11px] text-slate-500">Serving 32 East Coast pharmacy micro-hubs</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span>Transit SLA: 4.2 hrs</span>
                  <span className="text-emerald-600 font-bold">100% Stock Health</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>HUB-04 (Raleigh, NC Hub)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">420k caps</span>
                </div>
                <p className="text-[11px] text-slate-500">Dedicated Esomeprazole DR buffer node</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span>Transit SLA: 6.8 hrs</span>
                  <span className="text-emerald-600 font-bold">Cold Room Ready</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>HUB-06 (Austin, TX Node)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">280k tabs</span>
                </div>
                <p className="text-[11px] text-slate-500">MediQuick Pharmacy #042 primary supply feeder</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span>Transit SLA: 8.5 hrs</span>
                  <span className="text-emerald-600 font-bold">Daily Restock Active</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>HUB-02 (Columbus, OH Gateway)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">310k tabs</span>
                </div>
                <p className="text-[11px] text-slate-500">Midwest cross-dock facility</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span>Transit SLA: 5.4 hrs</span>
                  <span className="text-blue-600 font-bold">Re-routing Inbound</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CoA Inspection Modal */}
      {selectedFormulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">{selectedFormulation.chemicalName}</h4>
                <p className="text-[11px] text-emerald-400 font-mono">Lot #{selectedFormulation.activeLot} • {selectedFormulation.fdaApprovalCode}</p>
              </div>
              <button 
                onClick={() => setSelectedFormulation(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Innovator Reference:</span>
                  <span className="font-bold text-slate-800">{selectedFormulation.innovatorReferenceBrand} ({selectedFormulation.innovatorOwner})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">In-Vitro Dissolution f2:</span>
                  <span className="font-bold text-emerald-700">{selectedFormulation.f2DissolutionSimilarity}% (FDA Passing)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AUC 90% Confidence Interval:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedFormulation.aucRatioConfidenceInterval}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cmax Ratio CI:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedFormulation.cMaxRatioConfidenceInterval}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Micro-Hubs:</span>
                  <span className="font-bold text-slate-800">{selectedFormulation.hubAllocationCount} Active Nodes</span>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                This formulation conforms to USP/EP pharmacopeial monographs with chromatographic purity exceeding 99.85%. Release signed by Dr. Vikram Mehta (QC Directorate).
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedFormulation(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Close Spec Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload CoA Modal */}
      {showCoAModal && (
        <BatchCoAModal
          onClose={() => setShowCoAModal(false)}
          onLotAdded={(lot) => {
            showToast(`Batch Lot #${lot.lotNumber} (${lot.chemicalName}) released with ${lot.units.toLocaleString()} doses!`);
          }}
        />
      )}
    </div>
  );
};
