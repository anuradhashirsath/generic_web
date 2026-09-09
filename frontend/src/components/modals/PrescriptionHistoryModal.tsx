import React, { useState } from 'react';
import { PrescriptionRecord } from '../../types';
import { downloadPrescriptionSummaryPdf, PdfExportOptions } from '../../utils/generatePrescriptionPdf';

interface PrescriptionHistoryModalProps {
  prescriptions: PrescriptionRecord[];
  onClose: () => void;
  onDownloaded?: (filename: string) => void;
}

export const PrescriptionHistoryModal: React.FC<PrescriptionHistoryModalProps> = ({
  prescriptions,
  onClose,
  onDownloaded,
}) => {
  const [patientName, setPatientName] = useState('Sarah Jenkins');
  const [patientDob, setPatientDob] = useState('May 14, 1984');
  const [patientId, setPatientId] = useState('PT-8829-TX');
  const [consultationDoctor, setConsultationDoctor] = useState('Dr. Elena Vance, MD');
  const [clinicName, setClinicName] = useState('Austin Heart & Vascular Institute');
  const [consultationPurpose, setConsultationPurpose] = useState('Routine Clinical Review & Medication Reconciliation');
  const [selectedIds, setSelectedIds] = useState<string[]>(prescriptions.map((p) => p.id));
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');

  const filteredPrescriptions = prescriptions.filter((p) => selectedIds.includes(p.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      const options: PdfExportOptions = {
        patientName,
        patientDob,
        patientId,
        consultationDoctor,
        clinicName,
        consultationPurpose,
      };
      const filename = downloadPrescriptionSummaryPdf(filteredPrescriptions, options);
      if (onDownloaded) {
        onDownloaded(filename);
      }
      setTimeout(() => {
        setIsGenerating(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('PDF generation error:', err);
      setIsGenerating(false);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Prescription History Summary PDF
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Doctor Consultation
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official clinical regimen export with AB bioequivalence ratings, dosage schedules, & physician attestation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>Document Preview ({filteredPrescriptions.length} Meds)</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">tune</span>
                <span>Patient & Doctor Info</span>
              </div>
            </button>
          </div>
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            HIPAA 45 CFR § 164.502 Verified
          </div>
        </div>

        {/* Tab 1: Live Consultation Preview Document */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            {/* Sheet Mockup */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 font-sans text-xs max-h-[340px] overflow-y-auto shadow-inner">
              {/* Top Banner on Document */}
              <div className="bg-slate-900 text-white rounded-xl p-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm tracking-tight text-white">genericMed Health OS</span>
                    <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded">
                      CLINICAL SUMMARY
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                    Official Active Prescription & Regimen Record
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Prepared for Physician Consultation • 256-Bit Encrypted Vault Export
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <div className="text-white font-mono font-bold">RXV-2026-99482</div>
                  <div>Generated: {todayStr}</div>
                </div>
              </div>

              {/* Patient & Clinic Metadata Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Patient Profile</span>
                  <div className="font-bold text-slate-900 text-xs">{patientName}</div>
                  <div className="text-[11px] text-slate-600">DOB: {patientDob} • ID: {patientId}</div>
                  <div className="text-[10px] text-slate-500">Hub: MediQuick Pharmacy #042 (Austin, TX)</div>
                </div>
                <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-3">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Consultation Context</span>
                  <div className="font-bold text-slate-900 text-xs">{consultationDoctor}</div>
                  <div className="text-[11px] text-slate-600">{clinicName}</div>
                  <div className="text-[10px] text-slate-500 italic">Purpose: {consultationPurpose}</div>
                </div>
              </div>

              {/* Medicines Summary Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Included Active Medications ({filteredPrescriptions.length})</span>
                  <span className="text-[10px] text-slate-400">Select to include/exclude</span>
                </div>

                <div className="space-y-2">
                  {prescriptions.map((rx) => {
                    const isSelected = selectedIds.includes(rx.id);
                    const isLow = rx.daysSupplyRemaining <= 5;

                    return (
                      <div
                        key={rx.id}
                        onClick={() => toggleSelect(rx.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-white border-slate-200 shadow-xs'
                            : 'bg-slate-100/60 border-slate-200 opacity-60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-xs text-slate-900">{rx.genericName}</span>
                                <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  AB Rated
                                </span>
                                {isLow && (
                                  <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    Low Supply ({rx.daysSupplyRemaining}d)
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {rx.dosage} • {rx.brandReference}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-xs font-black text-emerald-700">
                                ${rx.unitCost.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 block line-through">
                                ${rx.innovatorCost.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                            <div>
                              <span className="text-slate-400 block">Regimen:</span>
                              <span className="font-semibold text-slate-800">{rx.dosageFrequencyLabel}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Inventory:</span>
                              <span className="font-semibold text-slate-800">
                                {rx.tabletsRemaining} / {rx.totalTablets} tablets ({rx.daysSupplyRemaining}d)
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Prescriber:</span>
                              <span className="font-semibold text-slate-800 truncate block">
                                {rx.prescribingDoctor}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attestation Preview Snippet */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">
                  Physician Consultation Attestation Block Included
                </span>
                <p>
                  Includes physical signature line, NPI number blank, and reconciliation checkboxes (Continue / Adjust / Discontinue) for your doctor to sign and file into electronic health records (EHR).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customization Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 block">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 block">Date of Birth</label>
                <input
                  type="text"
                  value={patientDob}
                  onChange={(e) => setPatientDob(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 block">Patient Record ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-900 block">Consultation Physician Name</label>
                <input
                  type="text"
                  value={consultationDoctor}
                  onChange={(e) => setConsultationDoctor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-900 block">Clinic / Hospital / Health Facility</label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-900 block">Consultation Purpose / Reason</label>
              <input
                type="text"
                value={consultationPurpose}
                onChange={(e) => setConsultationPurpose(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className="material-symbols-outlined text-base text-emerald-600">verified_user</span>
            <span>Formatted for A4 Clinical Print & EHR Upload</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating || filteredPrescriptions.length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">
                {isGenerating ? 'progress_activity' : 'download'}
              </span>
              <span>
                {isGenerating ? 'Generating PDF...' : 'Download Prescription History (PDF)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
