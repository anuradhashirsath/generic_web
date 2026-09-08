import React, { useState } from 'react';
import { ArbitrageMappingRule } from '../types';
import { ARBITRAGE_RULES } from '../data/mockData';

export const SaltMappingEngine: React.FC = () => {
  const [rules, setRules] = useState<ArbitrageMappingRule[]>(ARBITRAGE_RULES);
  const [search, setSearch] = useState('');
  const [strictBioeqOnly, setStrictBioeqOnly] = useState(true);
  const [slaWeighting, setSlaWeighting] = useState(true);
  const [takeRate, setTakeRate] = useState(5.0);
  const [selectedRule, setSelectedRule] = useState<ArbitrageMappingRule | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunAudit = () => {
    showToast('Automated price parity audit completed. 14,820 SKUs synchronized.');
  };

  const filtered = rules.filter(
    (r) =>
      r.innovatorBrand.toLowerCase().includes(search.toLowerCase()) ||
      r.genericSalt.toLowerCase().includes(search.toLowerCase()) ||
      r.therapeuticCategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header (Matching Image 17) */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <span className="material-symbols-outlined text-xl">schema</span>
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Generic Salt Mapping & Price Arbitrage Engine
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  VERSION 4.8 ALGORITHM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                14,820 Mapped Formulations • 98.2% FDA Orange Book Bioequivalence Coverage • $4.2M Patient Savings Generated
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunAudit}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">sync</span>
                <span>Run Parity Audit</span>
              </button>
              <button
                onClick={() => showToast('Master manufacturer wholesale feed sync scheduled.')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">cloud_download</span>
                <span>Sync Master Feeds</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Visual Arbitrage Distribution Bar (Matching Image 17) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Therapeutic Category Arbitrage Yield Distribution
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Average Arbitrage Yield: 88.7%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {[
              { cat: 'Cardiovascular', discount: '-89.5%', color: 'bg-emerald-500', skus: '4,210 SKUs' },
              { cat: 'Gastrointestinal', discount: '-89.4%', color: 'bg-teal-500', skus: '2,890 SKUs' },
              { cat: 'Antidiabetic', discount: '-90.6%', color: 'bg-blue-500', skus: '3,410 SKUs' },
              { cat: 'Antibiotics', discount: '-78.2%', color: 'bg-amber-500', skus: '1,980 SKUs' },
              { cat: 'Neurology / CNS', discount: '-90.7%', color: 'bg-purple-500', skus: '2,330 SKUs' },
            ].map((c) => (
              <div key={c.cat} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${c.color}`}></span>
                  <span className="font-bold text-slate-800 text-[11px] truncate">{c.cat}</span>
                </div>
                <div className="text-base font-black text-slate-900">{c.discount}</div>
                <div className="text-[10px] text-slate-400">{c.skus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main 2-Column Rules & Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Mapped Salt Matrix Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search branded drug (Lipitor, Nexium, Plavix) or generic salt..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-base">
                  search
                </span>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
                {filtered.length} Formulations Mapped
              </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Innovator Drug Reference</th>
                      <th className="px-4 py-3">Generic Active Salt Entity</th>
                      <th className="px-4 py-3">Price Arbitrage</th>
                      <th className="px-4 py-3">Mapped SKUs</th>
                      <th className="px-4 py-3 text-right">Configure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filtered.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-slate-900">{rule.innovatorBrand}</div>
                          <div className="text-[11px] text-slate-500">Mfr: {rule.brandOwner}</div>
                          <span className="text-[10px] font-mono text-slate-400">${rule.innovatorPriceUsd.toFixed(2)} MRP</span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-emerald-800">{rule.genericSalt}</div>
                          <div className="text-[11px] text-slate-500">{rule.dosageForm}</div>
                          <span className="inline-block mt-0.5 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Orange Book: {rule.fdaOrangeBookCode}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-black text-emerald-700 text-sm">
                            Save {rule.arbitrageYieldPercentage}%
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Floor: ${rule.genericFloorUsd.toFixed(2)} / unit
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-slate-800">
                            {rule.mappedGenericSkus} SKUs
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {rule.activeManufacturers.slice(0, 2).join(', ')}...
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedRule(rule)}
                            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                          >
                            Edit Rule
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Col: Arbitrage Rule Engine Sidebar Panel (Matching Image 17) */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="font-extrabold text-slate-900 text-sm">Arbitrage Rule Engine Parameters</h4>
                <p className="text-xs text-slate-500">Live dynamic pricing & substitution controls</p>
              </div>

              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-bold text-slate-900 block">Strict Bioequivalence Only</span>
                  <p className="text-[11px] text-slate-500">Enforce FDA Orange Book AB/AP rating only</p>
                </div>
                <input
                  type="checkbox"
                  checked={strictBioeqOnly}
                  onChange={(e) => setStrictBioeqOnly(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-bold text-slate-900 block">Transit SLA Route Weighting</span>
                  <p className="text-[11px] text-slate-500">Prioritize local hubs within 45-min transit radius</p>
                </div>
                <input
                  type="checkbox"
                  checked={slaWeighting}
                  onChange={(e) => setSlaWeighting(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Slider: Platform Take-Rate */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Platform Monetization Take-Rate</span>
                  <span className="font-mono font-bold text-emerald-700">{takeRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={takeRate}
                  onChange={(e) => setTakeRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1.0% wholesale</span>
                  <span>5.0% standard</span>
                  <span>10.0% max</span>
                </div>
              </div>

              <button
                onClick={() => showToast('Arbitrage parameters updated across all 148 tenant nodes.')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Apply Engine Rules
              </button>
            </div>

            {/* Quality Standards Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-emerald-600">verified</span>
                <span>HPLC Mass-Spec Quality Audit</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Automated chemical cross-verification guarantees 100% active moiety bio-sameness before generic substitution is unlocked in the consumer store.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Rule Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">{selectedRule.innovatorBrand} Mapping Rule</h4>
                <p className="text-xs text-emerald-400">{selectedRule.genericSalt}</p>
              </div>
              <button onClick={() => setSelectedRule(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Generic Wholesale Floor Price ($)</label>
                <input
                  type="number"
                  step="0.10"
                  defaultValue={selectedRule.genericFloorUsd}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Approved Manufacturers</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedRule.activeManufacturers.map((m) => (
                    <span key={m} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRule(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedRule(null);
                  showToast(`Arbitrage rule for ${selectedRule.innovatorBrand} updated.`);
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-pointer hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
