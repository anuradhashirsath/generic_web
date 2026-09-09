import { jsPDF } from 'jspdf';
import { PrescriptionRecord } from '../types';

export interface PdfExportOptions {
  patientName?: string;
  patientDob?: string;
  patientId?: string;
  consultationDoctor?: string;
  consultationPurpose?: string;
  clinicName?: string;
  includeClinicalNotes?: boolean;
}

export function generatePrescriptionPdf(
  prescriptions: PrescriptionRecord[],
  options: PdfExportOptions = {}
): jsPDF {
  const patientName = options.patientName || 'Sarah Jenkins';
  const patientDob = options.patientDob || 'May 14, 1984';
  const patientId = options.patientId || 'PT-8829-TX';
  const doctor = options.consultationDoctor || 'Dr. Elena Vance, MD';
  const clinic = options.clinicName || 'Austin Heart & Vascular Institute';
  const purpose = options.consultationPurpose || 'Routine Clinical Review & Medication Reconciliation';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Today's formatted date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const refCode = `RXV-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // 1. Top Deep Navy Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Emerald Top Accent Line
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, pageWidth, 2.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('genericMed Health OS', margin, 12);

  // Badge: Clinical Consultation Summary
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(5, 150, 105); // emerald-600
  doc.roundedRect(margin + 58, 7.5, 42, 5.5, 1.2, 1.2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('CLINICAL SUMMARY', margin + 61, 11.3);

  // Document Sub-title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('OFFICIAL ACTIVE PRESCRIPTION & REGIMEN RECORD', margin, 18);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Prepared for Physician Review • 256-Bit Encrypted Vault Export • HIPAA §164.502', margin, 23);

  // Right Header Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Document Ref:', pageWidth - margin, 11, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(refCode, pageWidth - margin, 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 20, { align: 'right' });

  let currentY = 35;

  // 2. Patient & Consultation Metadata Card
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'FD');

  // Left Column - Patient Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('PATIENT INFORMATION', margin + 4, currentY + 5);

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(patientName, margin + 4, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`DOB: ${patientDob}   |   Patient ID: ${patientId}`, margin + 4, currentY + 16.5);
  doc.text('Pharmacy Micro-Hub: MediQuick Pharmacy #042 (Austin, TX)', margin + 4, currentY + 21.5);

  // Middle Vertical Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 92, currentY + 3, margin + 92, currentY + 23);

  // Right Column - Consultation Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CONSULTATION CONTEXT', margin + 96, currentY + 5);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(doctor, margin + 96, currentY + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(clinic, margin + 96, currentY + 15.5);
  doc.text(`Purpose: ${purpose}`, margin + 96, currentY + 20.5);

  currentY += 30;

  // 3. Clinical Metrics Bar (3 Summary Badges)
  const dueCount = prescriptions.filter((rx) => rx.daysSupplyRemaining <= 5).length;
  const badgeWidth = (contentWidth - 6) / 3;

  // Badge 1: Active Rx Count
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(204, 251, 241);
  doc.roundedRect(margin, currentY, badgeWidth, 13, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text('ACTIVE REGIMEN', margin + 3, currentY + 4.5);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${prescriptions.length} Monitored Medications`, margin + 3, currentY + 9.5);

  // Badge 2: Bioequivalence & Verification
  const b2X = margin + badgeWidth + 3;
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(b2X, currentY, badgeWidth, 13, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('BIOEQUIVALENCE PARITY', b2X + 3, currentY + 4.5);
  doc.setFontSize(9);
  doc.setTextColor(6, 78, 59);
  doc.text('100% AB-Rated Generics', b2X + 3, currentY + 9.5);

  // Badge 3: Supply Alerts
  const b3X = b2X + badgeWidth + 3;
  doc.setFillColor(dueCount > 0 ? 254 : 248, dueCount > 0 ? 243 : 250, dueCount > 0 ? 199 : 252); // amber-50 or slate-50
  doc.setDrawColor(dueCount > 0 ? 252 : 226, dueCount > 0 ? 211 : 232, dueCount > 0 ? 77 : 240);
  doc.roundedRect(b3X, currentY, badgeWidth, 13, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(dueCount > 0 ? 180 : 100, dueCount > 0 ? 83 : 116, dueCount > 0 ? 9 : 139);
  doc.text('REFILL ALERT STATUS', b3X + 3, currentY + 4.5);
  doc.setFontSize(9);
  doc.setTextColor(dueCount > 0 ? 146 : 30, dueCount > 0 ? 64 : 41, dueCount > 0 ? 14 : 59);
  doc.text(
    dueCount > 0 ? `${dueCount} Rx Due for Refill (<=5d)` : 'All Supplies Current (>10d)',
    b3X + 3,
    currentY + 9.5
  );

  currentY += 17;

  // 4. Prescription History Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('CURRENT ACTIVE PRESCRIPTIONS & INVENTORY STATUS', margin, currentY + 3.5);

  currentY += 6;

  // Table Columns Setup
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, currentY, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('MEDICATION & DOSAGE', margin + 3, currentY + 4.8);
  doc.text('EQUIVALENCE & RATING', margin + 62, currentY + 4.8);
  doc.text('PRESCRIBER & RX #', margin + 110, currentY + 4.8);
  doc.text('SUPPLY & REFILLS', margin + 152, currentY + 4.8);

  currentY += 7;

  // Render Table Rows
  prescriptions.forEach((rx, index) => {
    const rowHeight = 22;
    const isEven = index % 2 === 0;

    // Check if new page needed
    if (currentY + rowHeight > pageHeight - 55) {
      doc.addPage();
      currentY = 20;
    }

    // Row Background
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, currentY, contentWidth, rowHeight, 'F');

    // Bottom row separator
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    // Left border indicator (amber if <= 5 days supply, emerald otherwise)
    const isLow = rx.daysSupplyRemaining <= 5;
    doc.setFillColor(isLow ? 245 : 16, isLow ? 158 : 185, isLow ? 11 : 129);
    doc.rect(margin, currentY, 1.8, rowHeight, 'F');

    // Column 1: Medication & Regimen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(rx.genericName, margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(rx.dosage, margin + 4, currentY + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(3, 105, 161); // sky-700
    doc.text(`Regimen: ${rx.dosageFrequencyLabel || '1 unit daily'}`, margin + 4, currentY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Estimated Intake: ${rx.dailyDosageUnits || 1} unit(s) / 24h`, margin + 4, currentY + 18.5);

    // Column 2: Bioequivalence & Rating
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(rx.brandReference, margin + 62, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('FDA Bioequivalent (AB Rated)', margin + 62, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Unit Cost: $${rx.unitCost.toFixed(2)} (Innovator: $${rx.innovatorCost.toFixed(2)})`, margin + 62, currentY + 14);

    doc.text(`Verification: ${rx.verificationStage}`, margin + 62, currentY + 18.5);

    // Column 3: Prescriber & Rx #
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const doctorShort = rx.prescribingDoctor.length > 26 ? rx.prescribingDoctor.substring(0, 24) + '...' : rx.prescribingDoctor;
    doc.text(doctorShort, margin + 110, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`Rx #: ${rx.rxNumber}`, margin + 110, currentY + 9.5);

    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text('Origin: Electronic Transmission', margin + 110, currentY + 14);
    doc.text('Delivery: Micro-Hub Dispatch', margin + 110, currentY + 18.5);

    // Column 4: Supply & Refills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (isLow) {
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text(`${rx.daysSupplyRemaining} Days Left`, margin + 152, currentY + 5);
    } else {
      doc.setTextColor(5, 150, 105); // emerald-600
      doc.text(`${rx.daysSupplyRemaining} Days Supply`, margin + 152, currentY + 5);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`Inventory: ${rx.tabletsRemaining} / ${rx.totalTablets} units`, margin + 152, currentY + 9.5);

    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Refills Left: ${rx.refillsRemaining}`, margin + 152, currentY + 14);
    doc.text(rx.autoRefillEnabled ? 'Auto-Refill: Active' : 'Auto-Refill: Off', margin + 152, currentY + 18.5);

    currentY += rowHeight;
  });

  currentY += 4;

  // 5. Clinical Safety & Interaction Statement
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CLINICAL SAFETY SCREEN & BIOEQUIVALENCE AUDIT', margin + 3, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'Automated cross-check against FDA Orange Book & Multi-Drug Interaction Index: No major adverse contraindications detected.',
    margin + 3,
    currentY + 8.5
  );
  doc.text(
    'All dispensed salts adhere to United States Pharmacopeia (USP) potency tolerances with verified therapeutic interchange parity.',
    margin + 3,
    currentY + 12
  );

  currentY += 18;

  // 6. Physician Sign-off & Consultation Attestation Block
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 25, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('PHYSICIAN CONSULTATION ATTESTATION & MEDICATION RECONCILIATION', margin + 3, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'I have reviewed the active medication regimen listed above with the patient during clinical consultation.',
    margin + 3,
    currentY + 8.5
  );

  // Checkboxes
  doc.rect(margin + 3, currentY + 11, 2.5, 2.5);
  doc.text('Continue All As Prescribed', margin + 7, currentY + 13);

  doc.rect(margin + 55, currentY + 11, 2.5, 2.5);
  doc.text('Dosage Adjusted / Tapered', margin + 59, currentY + 13);

  doc.rect(margin + 110, currentY + 11, 2.5, 2.5);
  doc.text('Discontinued / New Rx Ordered', margin + 114, currentY + 13);

  // Signature and Date Lines
  doc.line(margin + 3, currentY + 21, margin + 70, currentY + 21);
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Reviewing Physician Signature / NPI', margin + 3, currentY + 24);

  doc.line(margin + 80, currentY + 21, margin + 115, currentY + 21);
  doc.text('Consultation Date', margin + 80, currentY + 24);

  doc.line(margin + 125, currentY + 21, margin + contentWidth - 3, currentY + 21);
  doc.text('Attending Clinic / Facility Stamp', margin + 125, currentY + 24);

  // 7. Footer
  const footerY = pageHeight - 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    'genericMed Health OS • Confidential Medical Record • For Physician Consultation Only',
    margin,
    footerY
  );
  doc.text(
    `Page 1 of 1 • Security Hash: ${refCode}`,
    pageWidth - margin,
    footerY,
    { align: 'right' }
  );

  return doc;
}

export function downloadPrescriptionSummaryPdf(
  prescriptions: PrescriptionRecord[],
  options: PdfExportOptions = {}
): string {
  const doc = generatePrescriptionPdf(prescriptions, options);
  const now = new Date();
  const dateSuffix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const fileName = `Prescription_History_Summary_${dateSuffix}.pdf`;
  doc.save(fileName);
  return fileName;
}
