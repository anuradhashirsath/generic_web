import React, { useState } from 'react';

export const EnterpriseAnalytics: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'today' | '7d' | '30d'>('7d');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const routingRecords = [
    {
      id: 'rt-1',
      brand: 'Lipitor 20mg (Pfizer)',
      brandPrice: 84.50,
      generic: 'Atorvastatin Calcium 20mg (Cipla)',
      genericPrice: 8.90,
      savingsPct: 89.5,
      fulfillingHub: 'MediQuick Pharmacy #042 (Austin)',
      status: 'ROUTED & DISPATCHED',
      latencyMs: 14,
      time: 'Just now',
    },
    {
      id: 'rt-2',
      brand: 'Nexium 40mg (AstraZeneca)',
      brandPrice: 68.00,
      generic: 'Esomeprazole Magnesium 40mg (Zydus)',
      genericPrice: 7.20,
      savingsPct: 89.4,
      fulfillingHub: 'HealthHub Pharmacy #118 (North Austin)',
      status: 'ROUTED & DISPATCHED',
      latencyMs: 18,
      time: '2m ago',
    },
    {
      id: 'rt-3',
      brand: 'Glucophage XR 500mg (BMS)',
      brandPrice: 34.00,
      generic: 'Metformin Hydrochloride ER (Sun Pharma)',
      genericPrice: 3.20,
      savingsPct: 90.6,
      fulfillingHub: 'CareFirst Express #09 (Westlake)',
      status: 'ROUTED & DISPATCHED',
      latencyMs: 12,
      time: '4m ago',
    },
    {
      id: 'rt-4',
      brand: 'Plavix 75mg (Sanofi)',
      brandPrice: 79.50,
      generic: 'Clopidogrel Bisulfate 75mg (Aurobindo)',
      genericPrice: 6.40,
      savingsPct: 91.9,
      fulfillingHub: 'MediQuick Pharmacy #042 (Austin)',
      status: 'ROUTED & DISPATCHED',
      latencyMs: 16,
      time: '6m ago',
    },
    {
      id: 'rt-5',
      brand: 'Zoloft 50mg (Pfizer)',
      brandPrice: 62.20,
      generic: 'Sertraline Hydrochloride 50mg (Cipla)',
      genericPrice: 5.80,
      savingsPct: 90.7,
      fulfillingHub: 'Alliance Express Rx (Downtown)',
      status: 'ROUTED & DISPATCHED',
      latencyMs: 22,
      time: '9m ago',
    }
  ];

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header (Matching Image 19) */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <span className="material-symbols-outlined text-xl">insights</span>
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Platform Analytics & Global Arbitrage Routing
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  REAL-TIME TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Catalog Webhook Crawler Active (14.2k requests/min) • 3 Price Anomalies Auto-Remediated
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center text-xs">
                {(['today', '7d', '30d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      activeRange === r ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === 'today' ? 'Today' : r === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => showToast('Full platform telemetry export generated.')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Metrics Strip (Matching Image 19) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Platform GMV</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">paid</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">$1.42M</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                +24.8% vs last mo
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Settled via split-escrow smart rail</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Patient Savings</span>
              <span className="material-symbols-outlined text-teal-600 text-lg">savings</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">$682,450</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                89.4% Avg Discount
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Savings compared to innovator brand prices</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Active Pharmacies</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">storefront</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">482</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                28 in Verification
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Avg 45-min delivery radius in 14 metros</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Take-Rate</span>
              <span className="material-symbols-outlined text-purple-600 text-lg">account_balance_wallet</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">$113,600</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                5.0% Fixed Fee
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Includes B2B wholesale escrow settlement</p>
          </div>
        </div>

        {/* Live Arbitrage & Order Routing Engine Table (Matching Image 19) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Live Arbitrage & Order Routing Engine (Real-Time Stream)
              </h3>
              <p className="text-xs text-slate-500">
                Incoming branded e-prescriptions dynamically routed to lowest-cost bioequivalent micro-hubs
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Engine Latency: 16.2 ms p99
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Prescribed Innovator Brand</th>
                  <th className="px-4 py-3">Routed Generic Salt Equivalent</th>
                  <th className="px-4 py-3">Arbitrage Parity</th>
                  <th className="px-4 py-3">Assigned Micro-Hub Partner</th>
                  <th className="px-4 py-3">Status & Latency</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {routingRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{r.brand}</div>
                      <span className="text-[11px] text-slate-400 line-through">
                        ${r.brandPrice.toFixed(2)} MRP
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-emerald-800">{r.generic}</div>
                      <span className="text-[11px] font-mono font-bold text-emerald-700">
                        ${r.genericPrice.toFixed(2)} Wholesale Floor
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded">
                        Save {r.savingsPct}%
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">AB-Rated Parity</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800">{r.fulfillingHub}</div>
                      <div className="text-[10px] text-slate-400">Lockbox Auto-Staging</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {r.status}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        {r.latencyMs}ms • {r.time}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => showToast(`Audit trail verified for routing node ${r.id}`)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Trace Route
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-Column Analytics Widgets (Matching Image 19) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pharmacy Partners Leaderboard */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Top Pharmacy Micro-Hubs by Volume</h4>
                <p className="text-xs text-slate-500">Ranked by fill SLA, dispensing accuracy & volume</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                100% GxP Compliant
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'MediQuick Pharmacy #042 (Austin Node)', scripts: '1,420 scripts/wk', fillTime: '14.2m SLA', accuracy: '99.94%', rank: 1 },
                { name: 'HealthHub Pharmacy #118 (North Austin)', scripts: '1,180 scripts/wk', fillTime: '16.8m SLA', accuracy: '99.91%', rank: 2 },
                { name: 'Alliance Express Rx (Downtown)', scripts: '940 scripts/wk', fillTime: '18.1m SLA', accuracy: '99.88%', rank: 3 },
                { name: 'CareFirst Express #09 (Westlake)', scripts: '790 scripts/wk', fillTime: '15.4m SLA', accuracy: '99.92%', rank: 4 },
              ].map((p) => (
                <div key={p.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {p.rank}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.fillTime} • Accuracy: {p.accuracy}</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-slate-900">{p.scripts}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacopeial Quality & Compliance Safeguards */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">USP / EP Pharmacopeial Compliance</h4>
                <p className="text-xs text-slate-500">Automated chemical assay & microbial limits monitor</p>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                21 CFR Part 11
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>HPLC Assay Potency Standard</span>
                  <span>99.85% (Tolerance 98.0 - 102.0%)</span>
                </div>
                <p className="text-[11px] text-emerald-700">All active lots verified against official reference standards.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>In-Vitro Dissolution Profiles</span>
                  <span className="text-emerald-700">f2 Score &gt; 78% Parity</span>
                </div>
                <p className="text-[11px] text-slate-500">Assures uniform drug release across physiological gastric pH levels.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Adulteration & Impurity Screening</span>
                  <span className="text-emerald-700">0 Nitrosamine Detection</span>
                </div>
                <p className="text-[11px] text-slate-500">Continuous monitoring of NDMA and genotoxic impurities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
