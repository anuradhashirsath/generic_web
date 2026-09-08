import React, { useState } from 'react';
import { DispenseQueueItem } from '../types';
import { DISPENSE_QUEUE } from '../data/mockData';
import { TamperLabelModal } from './modals/TamperLabelModal';
import { DrugInteractionModal } from './modals/DrugInteractionModal';
import { PrescriptionScanModal } from './modals/PrescriptionScanModal';

export const ClinicalHealthOS: React.FC = () => {
  const [queue, setQueue] = useState<DispenseQueueItem[]>(DISPENSE_QUEUE);
  const [filterTab, setFilterTab] = useState<'all' | 'rush' | 'cold'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQueuePaused, setIsQueuePaused] = useState(false);
  const [activeLabelItem, setActiveLabelItem] = useState<DispenseQueueItem | null>(null);
  const [activeInteractionItem, setActiveInteractionItem] = useState<DispenseQueueItem | null>(null);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDispenseItem = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Staged for Pickup' } : item
      )
    );
    showToast('Tamper label generated and RFID sealed to lockbox.');
  };

  const handleDriverRelease = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    showToast('Handshake PIN validated. Courier departed with thermal container.');
  };

  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brandEquivalent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'rush') return item.priority === 'RUSH <30m';
    if (filterTab === 'cold') return item.coldChainRequired;
    return true;
  });

  return (
    <div className="bg-slate-100 min-h-screen pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Operational Command Status Strip (Matching Image 1) */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 -ml-5"></span>
              <span className="font-bold text-sm text-emerald-400">DISPENSING HUB LIVE</span>
            </div>
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <div className="text-xs">
              <span className="text-slate-400">Micro-Hub: </span>
              <span className="font-semibold text-slate-200">MediQuick Rx #042 (Austin Central Node)</span>
            </div>
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <div className="text-xs">
              <span className="text-slate-400">Duty Pharmacist: </span>
              <span className="font-semibold text-slate-200">Dr. Marcus Brody, RPh (License #TX-48921)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              <span className="text-slate-400">Avg Fill SLA:</span>
              <span className="font-bold text-emerald-400 font-mono">14.2m</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              <span className="text-slate-400">Dispense Accuracy:</span>
              <span className="font-bold text-teal-300 font-mono">99.94%</span>
            </div>
            <button
              onClick={() => setIsQueuePaused(!isQueuePaused)}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                isQueuePaused
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isQueuePaused ? 'play_arrow' : 'pause'}
              </span>
              <span>{isQueuePaused ? 'Resume Intake' : 'Pause Intake'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Queue Velocity</span>
              <span className="material-symbols-outlined text-blue-500 text-lg">speed</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{queue.length}</span>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                5 RUSH &lt;30m
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Throughput: 42 scripts/hr</span>
              <span className="text-emerald-600 font-semibold">+18% vs yesterday</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">OCR Clinical Match</span>
              <span className="material-symbols-outlined text-teal-500 text-lg">document_scanner</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">98.4%</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                Tesseract v5.2
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>6 pending auto-scans</span>
              <button 
                onClick={() => setShowOcrModal(true)}
                className="text-teal-600 font-bold hover:underline cursor-pointer"
              >
                Scan Doctor Rx
              </button>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Cold Storage Vault</span>
              <span className="material-symbols-outlined text-cyan-600 text-lg">ac_unit</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">3.8°C</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                CHILL-V-02 Stable
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Target 2°C - 8°C</span>
              <span className="text-emerald-600 font-semibold">100% GxP Compliant</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Daily Volume & Margin</span>
              <span className="material-symbols-outlined text-emerald-600 text-lg">payments</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">$8,420</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                +$1,180 Net Yield
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Patient Savings: $41,200</span>
              <span className="text-slate-600 font-medium">14.01% Hub Margin</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Clinical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Active Dispense Queue (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    filterTab === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  Active Queue ({queue.length})
                </button>
                <button
                  onClick={() => setFilterTab('rush')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                    filterTab === 'rush'
                      ? 'bg-rose-600 text-white'
                      : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">bolt</span>
                  <span>RUSH &lt;30m</span>
                </button>
                <button
                  onClick={() => setFilterTab('cold')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                    filterTab === 'cold'
                      ? 'bg-cyan-600 text-white'
                      : 'text-cyan-700 bg-cyan-50 hover:bg-cyan-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">thermostat</span>
                  <span>Cold Chain</span>
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search salt, patient, order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">
                  search
                </span>
              </div>
            </div>

            {/* Queue Cards List */}
            <div className="space-y-4">
              {filteredQueue.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
                  No prescription orders matching current filter.
                </div>
              ) : (
                filteredQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 space-y-4"
                  >
                    {/* Top Order Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded">
                          {item.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.priority === 'RUSH <30m'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-blue-50 text-blue-800'
                        }`}>
                          {item.priority}
                        </span>
                        {item.coldChainRequired && (
                          <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">ac_unit</span>
                            Cold Chain {item.temperatureCelsius}°C
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">Received {item.receivedTimeAgo}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">RX: {item.rxNumber}</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          item.status === 'Staged for Pickup'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'In Isolator'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle Detail Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Drug & Bioequivalence info */}
                      <div className="md:col-span-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900">
                            {item.genericName} {item.dosage}
                          </h4>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                            AB Rated
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs">
                          Innovator Equivalent: <span className="font-bold text-slate-800">{item.brandEquivalent}</span>
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Mfr: <span className="font-semibold text-slate-700">{item.manufacturer}</span> • NDC: {item.ndc}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Target Lockbox: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">{item.targetBin}</code> • Pill Count: {item.pillCount} tabs
                        </p>
                        
                        {item.interactionWarning && (
                          <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-rose-600 text-sm">warning</span>
                              <span>{item.interactionWarning}</span>
                            </div>
                            <button
                              onClick={() => setActiveInteractionItem(item)}
                              className="text-rose-900 font-bold hover:underline ml-2 whitespace-nowrap cursor-pointer"
                            >
                              Review PDMP
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Patient & Prescribing Doctor info */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                        <div className="font-bold text-slate-900 text-xs">
                          {item.patientName} ({item.patientGender}, {item.patientAge})
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Prescriber: <span className="font-semibold">{item.prescribingDoctor}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.doctorClinic}
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Arbitrage Price:</span>
                          <div className="text-right">
                            <span className="line-through text-slate-400 mr-1.5">${item.innovatorPrice.toFixed(2)}</span>
                            <span className="font-black text-emerald-700 text-xs">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pharmacist Actions */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowOcrModal(true)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">image</span>
                          <span>View Digital Rx Scan</span>
                        </button>
                        <button
                          onClick={() => setActiveInteractionItem(item)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">sync_problem</span>
                          <span>Check Interactions</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.courierPin ? (
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg text-xs font-mono">
                              <span className="text-slate-500 mr-1">COURIER PIN:</span>
                              <span className="font-black text-blue-900">{item.courierPin}</span>
                            </div>
                            <button
                              onClick={() => handleDriverRelease(item.id)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">local_shipping</span>
                              <span>Confirm Driver Release</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveLabelItem(item)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">qr_code_scanner</span>
                            <span>Approve & Print Tamper Label</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Cleanroom Camera, Courier Dock, Salt Sync (1 col) */}
          <div className="space-y-4">
            {/* Cleanroom CAM 02 Simulation (Matching Image 1) */}
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-md text-white">
              <div className="p-3 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="font-bold text-slate-200">Cleanroom CAM 02 • DISPENSE ISOLATOR #1</span>
                </div>
                <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded">
                  ISO Class 7 Zone
                </span>
              </div>
              <div className="h-44 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                {/* Simulated isolator visual */}
                <div className="absolute inset-0 bg-radial from-slate-700/60 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                  <span className="material-symbols-outlined text-4xl text-teal-400 mb-1 animate-pulse">
                    precision_manufacturing
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-300">AUTOMATED PILL COUNTER #4</p>
                  <p className="text-[10px] text-teal-400 font-mono mt-0.5">FEED: 120 FPS • HEPA FLOW 0.45 m/s</p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono bg-slate-950/80 px-2.5 py-1 rounded border border-slate-700">
                    <span className="text-emerald-400">ACTIVE BATCH: ATORVA-20</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300">84% CAPACITY</span>
                  </div>
                </div>
                <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-1.5 py-0.5 rounded">
                  LIVE 1080p
                </div>
              </div>
            </div>

            {/* Courier Dock & EV Fleet Dispatch */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-600 text-sm">local_shipping</span>
                  <h4 className="font-extrabold text-slate-900 text-xs">Courier Dispatch Dock</h4>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                  Austin Zone A
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span>EV-Courier #08</span>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1 rounded">DOCK 1</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Assigned: Nexium Equiv (David Miller)</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-800">ETA 04:12</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">At Gate</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span>EV-Van #14 (Cold)</span>
                      <span className="text-[10px] font-mono bg-cyan-100 text-cyan-800 px-1 rounded">DOCK 2</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Assigned: Liraglutide (Victoza equiv)</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-800">ETA 11:45</div>
                    <span className="text-[10px] text-amber-600 font-semibold">En Route</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bioequivalent Salt Inventory Sync */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-teal-600 text-sm">inventory_2</span>
                  <h4 className="font-extrabold text-slate-900 text-xs">Bioequivalent Salt Sync</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Micro-Hub Stock</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'Amoxicillin/Pot Clav 875mg', stock: 120, status: 'Adequate', brand: 'Augmentin' },
                  { name: 'Levothyroxine Sodium 50mcg', stock: 48, status: 'Reorder Soon', brand: 'Synthroid' },
                  { name: 'Lisinopril/HCTZ 20/12.5mg', stock: 240, status: 'Optimal', brand: 'Zestoretic' },
                  { name: 'Rosuvastatin Calcium 10mg', stock: 180, status: 'Optimal', brand: 'Crestor' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800">{s.name}</div>
                      <div className="text-[10px] text-slate-500">Ref: {s.brand}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">{s.stock} tabs</div>
                      <span className={`text-[10px] font-semibold ${
                        s.status === 'Reorder Soon' ? 'text-amber-600 font-bold' : 'text-slate-500'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeLabelItem && (
        <TamperLabelModal
          item={activeLabelItem}
          onClose={() => setActiveLabelItem(null)}
          onConfirmDispense={handleDispenseItem}
        />
      )}

      {activeInteractionItem && (
        <DrugInteractionModal
          item={activeInteractionItem}
          onClose={() => setActiveInteractionItem(null)}
          onOverrideWarning={() => showToast('Pharmacist clinical override signed and saved to audit ledger.')}
        />
      )}

      {showOcrModal && (
        <PrescriptionScanModal
          onClose={() => setShowOcrModal(false)}
          onPrescriptionParsed={(parsed) => {
            showToast(`Prescription for ${parsed.patientName} (${parsed.genericSalt}) parsed with ${parsed.confidencePct}% confidence!`);
          }}
        />
      )}
    </div>
  );
};
