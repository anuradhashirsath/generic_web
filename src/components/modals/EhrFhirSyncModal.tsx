import React, { useState } from 'react';
import { fhirAdapter, FhirMedicationRequest } from '../../utils/fhirAdapter';
import { DispenseQueueItem, PrescriptionRecord } from '../../types';

interface EhrFhirSyncModalProps {
  onClose: () => void;
  onImportPrescription?: (rx: PrescriptionRecord, queueItem: DispenseQueueItem) => void;
}

export const EhrFhirSyncModal: React.FC<EhrFhirSyncModalProps> = ({
  onClose,
  onImportPrescription,
}) => {
  const [selectedEhr, setSelectedEhr] = useState<'epic' | 'cerner' | 'athena'>('epic');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [importedItems, setImportedItems] = useState<FhirMedicationRequest[]>([]);

  const handleSmartLaunch = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      setImportedItems([
        {
          resourceType: 'MedicationRequest',
          id: 'epic-rx-948201',
          status: 'active',
          intent: 'order',
          medicationCodeableConcept: {
            coding: [
              {
                system: 'http://hl7.org/fhir/sid/ndc',
                code: '00093-7155-98',
                display: 'Atorvastatin Calcium 20mg (Lipitor Equivalent)',
              },
            ],
            text: 'Atorvastatin Calcium 20 mg (Lipitor Equivalent)',
          },
          subject: { reference: 'Patient/PT-8829-TX', display: 'Sarah Jenkins' },
          requester: { reference: 'Practitioner/PR-189201948', display: 'Dr. Elena Vance, MD' },
          dosageInstruction: [{ text: '1 tablet PO at bedtime' }],
          dispenseRequest: {
            numberOfRepeatsAllowed: 3,
            quantity: { value: 30, unit: 'TAB' },
            expectedSupplyDuration: { value: 30, unit: 'd' },
          },
        },
        {
          resourceType: 'MedicationRequest',
          id: 'epic-rx-948202',
          status: 'active',
          intent: 'order',
          medicationCodeableConcept: {
            coding: [
              {
                system: 'http://hl7.org/fhir/sid/ndc',
                code: '00378-0142-01',
                display: 'Esomeprazole Magnesium 40mg (Nexium Equivalent)',
              },
            ],
            text: 'Esomeprazole Magnesium 40 mg (Nexium Equivalent)',
          },
          subject: { reference: 'Patient/PT-8829-TX', display: 'Sarah Jenkins' },
          requester: { reference: 'Practitioner/PR-189201948', display: 'Dr. Elena Vance, MD' },
          dosageInstruction: [{ text: '1 capsule PO 30 mins before breakfast' }],
          dispenseRequest: {
            numberOfRepeatsAllowed: 2,
            quantity: { value: 30, unit: 'CAP' },
            expectedSupplyDuration: { value: 30, unit: 'd' },
          },
        },
      ]);
    }, 1400);
  };

  const handleConfirmImport = (req: FhirMedicationRequest) => {
    const rx = fhirAdapter.mapFhirRequestToPrescription(req, 'Sarah Jenkins');
    const qItem = fhirAdapter.mapFhirRequestToDispenseQueue(req, 'Sarah Jenkins');

    if (onImportPrescription) {
      onImportPrescription(rx, qItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">hub</span>
            <div>
              <span className="font-bold text-base">HL7 FHIR R4 EHR Integration</span>
              <p className="text-[11px] text-emerald-300">SMART on FHIR OAuth 2.0 PKCE Launch Connector</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!connected ? (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Select Enterprise Health System Node:</span>
                <p className="text-slate-500">Connect to hospital Electronic Health Record (EHR) systems via HL7 FHIR R4 standard endpoint.</p>
              </div>

              {/* EHR System Provider Options */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'epic', name: 'Epic Systems', logo: 'local_hospital', node: 'Epic MyChart API' },
                  { id: 'cerner', name: 'Cerner / Oracle', logo: 'health_metrics', node: 'Millennium FHIR' },
                  { id: 'athena', name: 'Athenahealth', logo: 'clinical_notes', node: 'AthenaNet R4' },
                ].map((ehr) => (
                  <button
                    key={ehr.id}
                    onClick={() => setSelectedEhr(ehr.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedEhr === ehr.id
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl text-emerald-700 block mb-1">
                      {ehr.logo}
                    </span>
                    <span className="font-bold text-xs text-slate-900 block">{ehr.name}</span>
                    <span className="text-[10px] text-slate-500 block">{ehr.node}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSmartLaunch}
                  disabled={connecting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {connecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating SMART on FHIR OAuth 2.0 PKCE...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">lock_open</span>
                      <span>Launch SMART on FHIR OAuth 2.0 Handshake</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">verified</span>
                  <span className="font-bold text-emerald-900">SMART on FHIR Session Active: Epic System US-East</span>
                </div>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                  HL7 R4 Bundle
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Available FHIR MedicationRequest Resources ({importedItems.length}):</span>
                {importedItems.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.medicationCodeableConcept.text}</div>
                      <div className="text-[11px] text-slate-500">{item.dosageInstruction[0]?.text}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Prescriber: {item.requester.display} • Refills: {item.dispenseRequest?.numberOfRepeatsAllowed}
                      </div>
                    </div>
                    <button
                      onClick={() => handleConfirmImport(item)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      Import Rx
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg cursor-pointer hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
