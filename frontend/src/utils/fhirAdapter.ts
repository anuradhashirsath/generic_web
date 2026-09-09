// HL7 FHIR R4 Integration Adapter (src/utils/fhirAdapter.ts)
// Fast Healthcare Interoperability Resources (FHIR) R4 MedicationRequest & MedicationDispense Data Transformation Layer

import { DispenseQueueItem, PrescriptionRecord } from '../types';

export interface FhirPatient {
  resourceType: 'Patient';
  id: string;
  name: { given: string[]; family: string }[];
  gender: string;
  birthDate: string;
}

export interface FhirMedicationRequest {
  resourceType: 'MedicationRequest';
  id: string;
  status: 'active' | 'completed' | 'cancelled';
  intent: 'order' | 'plan';
  medicationCodeableConcept: {
    coding: { system: string; code: string; display: string }[];
    text: string;
  };
  subject: { reference: string; display: string };
  requester: { reference: string; display: string };
  dosageInstruction: {
    text: string;
    timing?: { repeat?: { frequency?: number; period?: number; periodUnit?: string } };
  }[];
  dispenseRequest?: {
    numberOfRepeatsAllowed?: number;
    quantity?: { value: number; unit: string };
    expectedSupplyDuration?: { value: number; unit: string };
  };
}

export interface FhirMedicationDispense {
  resourceType: 'MedicationDispense';
  id: string;
  status: 'completed' | 'in-progress' | 'on-hold';
  medicationCodeableConcept: {
    coding: { system: string; code: string; display: string }[];
    text: string;
  };
  subject: { reference: string; display: string };
  authorizingPrescription: { reference: string }[];
  quantity: { value: number; unit: string };
  daysSupply: { value: number; unit: string };
  whenHandedOver?: string;
}

export interface FhirBundle {
  resourceType: 'Bundle';
  type: 'searchset' | 'transaction';
  entry: {
    fullUrl: string;
    resource: FhirMedicationRequest | FhirMedicationDispense | FhirPatient;
  }[];
}

class FhirAdapter {
  /**
   * Convert FHIR R4 MedicationRequest into genericMed PrescriptionRecord
   */
  mapFhirRequestToPrescription(
    req: FhirMedicationRequest,
    patientName: string = 'Sarah Jenkins'
  ): PrescriptionRecord {
    const ndcCode = req.medicationCodeableConcept.coding.find((c) => c.system.includes('ndc'))?.code || '00093-7155-98';
    const rawName = req.medicationCodeableConcept.text || req.medicationCodeableConcept.coding[0]?.display || 'Generic Salt';
    
    // Extract generic vs brand reference
    const parts = rawName.split('(');
    const genericName = parts[0].trim();
    const brandRef = parts[1] ? parts[1].replace(')', '').trim() : 'Lipitor Equivalent';

    const dosageText = req.dosageInstruction[0]?.text || '1 tablet PO daily';
    const daysSupply = req.dispenseRequest?.expectedSupplyDuration?.value || 30;
    const tablets = req.dispenseRequest?.quantity?.value || 30;
    const refills = req.dispenseRequest?.numberOfRepeatsAllowed || 3;

    return {
      id: `fhir-rx-${req.id}`,
      rxNumber: `RX-FHIR-${req.id.substring(0, 6).toUpperCase()}`,
      genericName,
      dosage: dosageText,
      brandReference: brandRef,
      prescribingDoctor: req.requester.display || 'Dr. Elena Vance, MD',
      daysSupplyRemaining: daysSupply,
      tabletsRemaining: tablets,
      totalTablets: tablets,
      refillsRemaining: refills,
      autoRefillEnabled: true,
      urgency: 'stable',
      verificationStage: 'Dispense Ready',
      estimatedDeliveryDate: 'Tomorrow, 4:00 PM',
      unitCost: 8.90,
      innovatorCost: 84.50,
      dailyDosageUnits: 1,
      dosageFrequencyLabel: dosageText,
    };
  }

  /**
   * Convert FHIR R4 MedicationRequest into genericMed DispenseQueueItem
   */
  mapFhirRequestToDispenseQueue(
    req: FhirMedicationRequest,
    patientName: string = 'Sarah Jenkins'
  ): DispenseQueueItem {
    const rx = this.mapFhirRequestToPrescription(req, patientName);
    return {
      id: `fhir-q-${req.id}`,
      orderNumber: `FHIR-${Math.floor(10000 + Math.random() * 90000)}`,
      genericName: rx.genericName,
      brandEquivalent: rx.brandReference,
      dosage: rx.dosage,
      dosageForm: 'Oral Tablet',
      ndc: '00093-7155-98',
      manufacturer: 'Cipla Global Therapeutics',
      patientName,
      patientAge: 42,
      patientGender: 'F',
      prescribingDoctor: rx.prescribingDoctor,
      doctorClinic: 'Epic EHR Health System Node',
      rxNumber: rx.rxNumber,
      receivedTimeAgo: 'Just now (EHR FHIR Sync)',
      priority: 'Normal',
      status: 'OCR Verified',
      coldChainRequired: false,
      targetBin: 'BIN-EHR-01',
      pillCount: rx.totalTablets,
      price: rx.unitCost,
      innovatorPrice: rx.innovatorCost,
      fdaAbRated: true,
    };
  }

  /**
   * Export PrescriptionRecord to FHIR R4 MedicationRequest JSON Bundle
   */
  exportPrescriptionToFhirBundle(rx: PrescriptionRecord): FhirBundle {
    const fhirReq: FhirMedicationRequest = {
      resourceType: 'MedicationRequest',
      id: rx.id.replace('fhir-rx-', ''),
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'http://hl7.org/fhir/sid/ndc',
            code: '00093-7155-98',
            display: `${rx.genericName} (${rx.brandReference})`,
          },
        ],
        text: `${rx.genericName} ${rx.dosage}`,
      },
      subject: {
        reference: 'Patient/PT-8829-TX',
        display: 'Sarah Jenkins',
      },
      requester: {
        reference: 'Practitioner/PR-48921',
        display: rx.prescribingDoctor,
      },
      dosageInstruction: [
        {
          text: rx.dosageFrequencyLabel || rx.dosage,
        },
      ],
      dispenseRequest: {
        numberOfRepeatsAllowed: rx.refillsRemaining,
        quantity: { value: rx.totalTablets, unit: 'TAB' },
        expectedSupplyDuration: { value: rx.daysSupplyRemaining, unit: 'd' },
      },
    };

    return {
      resourceType: 'Bundle',
      type: 'transaction',
      entry: [
        {
          fullUrl: `urn:uuid:${rx.id}`,
          resource: fhirReq,
        },
      ],
    };
  }
}

export const fhirAdapter = new FhirAdapter();
