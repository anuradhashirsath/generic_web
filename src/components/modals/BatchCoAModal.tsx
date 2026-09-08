import React, { useState } from 'react';

interface BatchCoAModalProps {
  onClose: () => void;
  onLotAdded?: (lot: {
    lotNumber: string;
    chemicalName: string;
    f2Score: number;
    units: number;
  }) => void;
}

export const BatchCoAModal: React.FC<BatchCoAModalProps> = ({
  onClose,
  onLotAdded,
}) => {
  const [lotNumber, setLotNumber] = useState('CP-2025-0902');
  const [chemicalName, setChemicalName] = useState('Atorvastatin Calcium Trihydrate 20mg');
  const [units, setUnits] = useState(500000);
  const [f2Score, setF2Score] = useState(79.2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onLotAdded) {
        onLotAdded({
          lotNumber,
          chemicalName,
          f2Score,
          units,
        });
      }
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">upload_file</span>
            <div>
              <span className="font-bold text-base">Upload Batch Lot Release (CoA)</span>
              <p className="text-[11px] text-emerald-300">Cipla Global Formulation Site #4 • cGMP Validated</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900 leading-relaxed">
            <span className="font-bold">21 CFR Part 11 Audit Trail Enabled:</span> Uploading this Certificate of Analysis (CoA) triggers automated HPLC chromatogram parsing and assigns cryptographic batch tokens to all downstream micro-hubs.
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batch Lot Number</label>
              <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Generic Chemical Salt & Strength</label>
              <input
                type="text"
                value={chemicalName}
                onChange={(e) => setChemicalName(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">In-Vitro Dissolution (f2)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={f2Score}
                    onChange={(e) => setF2Score(parseFloat(e.target.value))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-500">FDA AB standard &gt;50%</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Allocated Unit Doses</label>
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value))}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden font-semibold"
                />
                <span className="text-[10px] text-slate-500">Micro-hub inventory reserve</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500">description</span>
                <div>
                  <div className="font-bold text-slate-800">CoA_Lot_CP20250902_HPLC.pdf</div>
                  <div className="text-[10px] text-slate-500">2.4 MB • Cryptographically Signed by QC Lead</div>
                </div>
              </div>
              <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">
                Ready
              </span>
            </div>
          </div>

          <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-4 border-t border-slate-200 flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                {isSubmitting ? 'sync' : 'publish'}
              </span>
              <span>{isSubmitting ? 'Validating cGMP Signatures...' : 'Release Batch Lot to Hubs'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
