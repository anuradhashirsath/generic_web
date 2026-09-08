import React from 'react';
import { PrescriptionRecord } from '../../types';

interface PushNotificationBannerProps {
  prescription: PrescriptionRecord;
  onDismiss: () => void;
  onRefill: (rx: PrescriptionRecord) => void;
  onSnooze: (rx: PrescriptionRecord) => void;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  prescription,
  onDismiss,
  onRefill,
  onSnooze,
}) => {
  const daysLeft = prescription.daysSupplyRemaining;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-3 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-amber-500/40 ring-2 ring-amber-500/20">
        {/* Native Notification Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
              <span className="material-symbols-outlined text-[14px]">notifications_active</span>
            </div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Web Push Notification • Refill Radar
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Just now</span>
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              title="Dismiss"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* Notification Body */}
        <div className="py-3 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-2xl">medication_liquid</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-white">
                5-Day Supply Alert: {prescription.genericName}
              </h4>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                {daysLeft} Days Left
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Based on your dosage of <strong className="text-white">{prescription.dosageFrequencyLabel}</strong>, you have{' '}
              <strong className="text-amber-300">{prescription.tabletsRemaining} tablets</strong> left. Reorder now to guarantee delivery before depletion on{' '}
              <strong className="text-white">
                {new Date(Date.now() + daysLeft * 86400000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </strong>.
            </p>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5">
              <span>Arbitrage Generic: <strong className="text-emerald-400 font-mono">${prescription.unitCost.toFixed(2)}</strong></span>
              <span>•</span>
              <span>Innovator: <span className="line-through text-slate-500 font-mono">${prescription.innovatorCost.toFixed(2)}</span></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onSnooze(prescription)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Snooze 24h
          </button>
          <button
            onClick={() => onRefill(prescription)}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">bolt</span>
            <span>1-Tap Refill Generic (${prescription.unitCost.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
