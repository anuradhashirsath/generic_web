import React, { useState } from 'react';

interface PrescriptionScanModalProps {
  onClose: () => void;
  onPrescriptionParsed?: (parsedData: {
    doctorName: string;
    patientName: string;
    genericSalt: string;
    dosage: string;
    frequency: string;
    confidencePct: number;
  }) => void;
}

export const PrescriptionScanModal: React.FC<PrescriptionScanModalProps> = ({
  onClose,
  onPrescriptionParsed,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<{
    doctorName: string;
    patientName: string;
    genericSalt: string;
    dosage: string;
    frequency: string;
    confidencePct: number;
  } | null>(null);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedResult({
        doctorName: 'Dr. Elena Vance, MD (NPI: 189201948)',
        patientName: 'Sarah Jenkins',
        genericSalt: 'Atorvastatin Calcium Trihydrate',
        dosage: '20 mg Oral Tablets #30',
        frequency: 'Sig: 1 tab PO qHS (at bedtime) for hyperlipidemia',
        confidencePct: 98.4,
      });
    }, 1500);
  };

  const handleConfirm = () => {
    if (scannedResult && onPrescriptionParsed) {
      onPrescriptionParsed(scannedResult);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400">document_scanner</span>
            <div>
              <span className="font-bold text-base">Neural OCR Prescription Parser</span>
              <p className="text-[11px] text-teal-300">Tesseract v5.2 + Bioequivalence Mapping Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!scannedResult ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
                 onClick={handleSimulateScan}>
              {scanning ? (
                <div className="space-y-3 py-6">
                  <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-bold text-slate-700">Analyzing Handwriting & DEA Watermark...</p>
                  <p className="text-[11px] text-slate-500">Extracting NPI, NDC Salt Candidate, Sig Frequency</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Upload Doctor Prescription Image</p>
                    <p className="text-xs text-slate-500 mt-0.5">Drag & drop PNG/PDF or click to run OCR test</p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 px-4 py-1.5 bg-teal-600 text-white font-semibold text-xs rounded-lg shadow-sm hover:bg-teal-700"
                  >
                    Select File or Run Test Scan
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span className="font-bold text-emerald-900">Neural OCR Extracted with {scannedResult.confidencePct}% Confidence</span>
                </div>
                <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Validated
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Patient</span>
                    <span className="font-bold text-slate-800">{scannedResult.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Doctor NPI</span>
                    <span className="font-bold text-slate-800">{scannedResult.doctorName}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Generic Active Salt Detected</span>
                  <span className="text-sm font-extrabold text-emerald-700">{scannedResult.genericSalt}</span>
                  <div className="text-[11px] font-semibold text-slate-700 mt-1">{scannedResult.dosage}</div>
                  <div className="text-[11px] text-slate-500 italic mt-0.5">{scannedResult.frequency}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
                  <span>Orange Book Therapeutic Equiv:</span>
                  <span className="font-bold text-emerald-600">AB Rated (Lipitor Parity)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          {scannedResult && (
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/20"
            >
              <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
              <span>Accept & Push to Dispense Queue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
