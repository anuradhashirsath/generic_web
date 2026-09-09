import React, { useState } from 'react';
import { DispenseQueueItem } from '../../types';

interface TamperLabelModalProps {
  item: DispenseQueueItem | null;
  onClose: () => void;
  onConfirmDispense: (id: string) => void;
}

export const TamperLabelModal: React.FC<TamperLabelModalProps> = ({
  item,
  onClose,
  onConfirmDispense,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [tamperSealVerified, setTamperSealVerified] = useState(false);

  if (!item) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setTamperSealVerified(true);
    }, 1200);
  };

  const handleComplete = () => {
    onConfirmDispense(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">qr_code_2</span>
            <span className="font-bold text-base">21 CFR Part 11 Tamper-Evident Label Generation</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
            <span className="material-symbols-outlined text-amber-600 mt-0.5">verified</span>
            <div>
              <span className="font-bold">FDA AB-Rated Bioequivalence Parity Verified</span>
              <p className="text-amber-800">
                This tamper-proof label binds the physical container to digital ledger hash <code className="font-mono text-[10px] bg-amber-100 px-1 py-0.5 rounded">#SHA256:8f2a...1b9</code>.
              </p>
            </div>
          </div>

          {/* Physical Label Preview Box */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-white relative shadow-xs">
            <div className="border-b border-slate-200 pb-3 mb-3 flex items-start justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">MediQuick Pharmacy #042</h4>
                <p className="text-[11px] text-slate-500">License #PH-99201-B • Austin Central Node</p>
                <p className="text-[11px] text-slate-500">Tel: (512) 555-0199 • DEA #BD8912401</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  RX #{item.rxNumber}
                </span>
                <p className="text-[10px] text-slate-400 font-mono mt-1">{item.orderNumber}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Patient:</span>
                <span className="font-bold text-slate-900">{item.patientName} (Age: {item.patientAge})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Prescriber:</span>
                <span className="font-semibold text-slate-800">{item.prescribingDoctor}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                <div className="text-sm font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">pill</span>
                  {item.genericName} {item.dosage}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Bioequivalent substitute for <span className="font-semibold">{item.brandEquivalent}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Qty: {item.pillCount} {item.dosageForm} • NDC: {item.ndc}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Mfr: {item.manufacturer} • Bin: {item.targetBin}
                </div>
              </div>
            </div>

            {/* Tamper Seal & Barcode simulation */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 bg-slate-900 text-white rounded p-1 flex items-center justify-center font-mono text-[9px] text-center leading-tight">
                  [QR-CODE 21CFR-11 #89421]
                </div>
                <div className="text-[10px] text-slate-500 space-y-0.5">
                  <div className="font-mono font-bold text-slate-700">TAG: RFID-CRYPT-8942</div>
                  <div>Lead RPh: Dr. Aris Thorne</div>
                  <div>Dispense Lock: ACTIVE</div>
                </div>
              </div>

              {tamperSealVerified ? (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Seal Applied & Logged</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">
                  Awaiting label print...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                {isPrinting ? 'sync' : 'print'}
              </span>
              <span>{isPrinting ? 'Generating Thermal Label...' : 'Thermal Print Label'}</span>
            </button>

            <button
              onClick={handleComplete}
              disabled={!tamperSealVerified}
              className={`px-5 py-2 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                tamperSealVerified 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' 
                  : 'bg-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-sm">done_all</span>
              <span>Approve & Move to Staging</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
