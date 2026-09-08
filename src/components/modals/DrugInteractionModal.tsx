import React, { useState } from 'react';
import { DispenseQueueItem } from '../../types';

interface DrugInteractionModalProps {
  item: DispenseQueueItem | null;
  onClose: () => void;
  onOverrideWarning?: () => void;
}

export const DrugInteractionModal: React.FC<DrugInteractionModalProps> = ({
  item,
  onClose,
  onOverrideWarning,
}) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [isOverriding, setIsOverriding] = useState(false);

  if (!item) return null;

  const handleOverride = () => {
    if (!overrideReason.trim()) return;
    setIsOverriding(true);
    setTimeout(() => {
      setIsOverriding(false);
      if (onOverrideWarning) onOverrideWarning();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-rose-950 text-white px-6 py-4 flex items-center justify-between border-b border-rose-800">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-400">warning</span>
            <div>
              <span className="font-bold text-base">Clinical Pharmacokinetic Interaction Audit</span>
              <p className="text-[11px] text-rose-300">PDMP & EHR Live Cross-Check Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-rose-300 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900 uppercase tracking-wide">
                CYP3A4 Enzyme & Bleeding Risk Matrix
              </span>
              <span className="bg-rose-200 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                Severity: Moderate-High
              </span>
            </div>
            <p className="text-rose-800 leading-relaxed">
              Patient <strong className="text-slate-900">{item.patientName}</strong> has an active prescription for concomitant antiplatelet therapy. Concurrent administration of statin/GLP-1 therapy requires metabolic pathway monitoring.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
            <div className="font-bold text-slate-700">Prescription Under Review:</div>
            <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">{item.genericName} {item.dosage}</div>
                <div className="text-[11px] text-slate-500">Mfr: {item.manufacturer} • Ref: {item.brandEquivalent}</div>
              </div>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                AB Rated
              </span>
            </div>

            <div className="font-bold text-slate-700 pt-2">Active PDMP Registry Records:</div>
            <div className="space-y-1.5">
              <div className="p-2 bg-white rounded border border-slate-200 flex justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Clopidogrel Bisulfate 75mg</span>
                <span className="text-slate-500">Filled 12 days ago • Austin Heart</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200 flex justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Lisinopril 10mg</span>
                <span className="text-slate-500">Filled 24 days ago • MediQuick #042</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Pharmacist Clinical Override Justification (21 CFR Part 11 Audit Trail):
            </label>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Consulted with Dr. Vance; dosage staggered by 4 hours. Renal and hepatic panels checked and normal..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden h-20"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Keep on Clinical Hold
          </button>
          
          <button
            onClick={handleOverride}
            disabled={!overrideReason.trim() || isOverriding}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-700/20"
          >
            <span className="material-symbols-outlined text-sm">signature</span>
            <span>{isOverriding ? 'Signing Cryptographic Log...' : 'Sign & Override Hold'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
