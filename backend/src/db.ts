import mongoose from 'mongoose';
import { TenantModel } from './models/Tenant.js';
import { DispenseQueueModel } from './models/DispenseQueue.js';
import { MedicineModel } from './models/Medicine.js';
import { UserModel } from './models/User.js';


let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (isConnected) {
    return true;
  }

  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    console.warn('[genericMed DB Warning] MONGODB_URI environment variable not defined.');
    return false;
  }

  try {
    await mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      tlsAllowInvalidCertificates: true,
    });
    isConnected = true;
    console.log('[genericMed DB] Successfully connected to MongoDB Atlas!');


    // Run initial seed check
    await seedInitialData();

    return true;
  } catch (err) {
    console.error('[genericMed DB Error] Failed to connect to MongoDB Atlas:', err);
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

async function seedInitialData() {
  try {
    // Seed Tenants if empty
    const tenantCount = await TenantModel.countDocuments();
    if (tenantCount === 0) {
      await TenantModel.insertMany([
        {
          id: 'tenant-1',
          organizationName: 'MediQuick Pharmacy #042 (Austin Node)',
          tenantType: 'Retail Pharmacy',
          schemaIdentifier: 'tenant_mediquick_042',
          rlsPolicyCount: 12,
          encryptionAlgorithm: 'AES-256-GCM',
          totalRecords: 14820,
          dailyQueryVolume: '1.4M req/day',
          avgQueryLatencyMs: 14.2,
          storageMb: 248.5,
          status: 'HEALTHY',
          pricingTier: 'Enterprise Dedicated',
          contractBillingRate: '4.8% Transaction Fee',
        },
        {
          id: 'tenant-2',
          organizationName: 'Cipla Global Therapeutics Ltd',
          tenantType: 'Pharma Manufacturer',
          schemaIdentifier: 'tenant_cipla_global',
          rlsPolicyCount: 16,
          encryptionAlgorithm: 'AES-256-GCM + Column PGP',
          totalRecords: 89400,
          dailyQueryVolume: '4.8M req/day',
          avgQueryLatencyMs: 9.8,
          storageMb: 1120.0,
          status: 'HEALTHY',
          pricingTier: 'Enterprise Dedicated',
          contractBillingRate: '$0.004 / unit dose fee',
        },
      ]);
      console.log('[genericMed DB Seeder] Seeded Tenant schema records.');
    }

    // Seed Dispense Queue if empty
    const queueCount = await DispenseQueueModel.countDocuments();
    if (queueCount === 0) {
      await DispenseQueueModel.insertMany([
        {
          id: 'q-1',
          orderNumber: 'ORD-89421',
          genericName: 'Atorvastatin Calcium',
          brandEquivalent: 'Lipitor',
          dosage: '20 mg',
          dosageForm: 'Oral Tablet',
          ndc: '00093-7155-98',
          manufacturer: 'Cipla Global',
          patientName: 'Sarah Jenkins',
          patientAge: 42,
          patientGender: 'F',
          prescribingDoctor: 'Dr. Elena Vance, MD',
          doctorClinic: 'Austin Heart & Vascular',
          rxNumber: 'RX-994201',
          receivedTimeAgo: '4 mins ago',
          priority: 'RUSH <30m',
          status: 'OCR Verified',
          coldChainRequired: false,
          targetBin: 'BIN-A-04',
          pillCount: 30,
          price: 8.90,
          innovatorPrice: 84.50,
          fdaAbRated: true,
        },
        {
          id: 'q-2',
          orderNumber: 'ORD-89422',
          genericName: 'Esomeprazole Magnesium',
          brandEquivalent: 'Nexium',
          dosage: '40 mg',
          dosageForm: 'Delayed-Release Capsule',
          ndc: '68382-315-01',
          manufacturer: 'Zydus Lifesciences',
          patientName: 'Michael Chang',
          patientAge: 58,
          patientGender: 'M',
          prescribingDoctor: 'Dr. Marcus Brody, MD',
          doctorClinic: 'Dell Seton GI',
          rxNumber: 'RX-8994102',
          receivedTimeAgo: '12 mins ago',
          priority: 'High',
          status: 'Staged for Pickup',
          coldChainRequired: false,
          targetBin: 'BIN-B-12',
          pillCount: 30,
          price: 7.20,
          innovatorPrice: 68.00,
          fdaAbRated: true,
        },
      ]);
      console.log('[genericMed DB Seeder] Seeded Dispense Queue records.');
    }

    // Seed Medicines if empty
    const medicineCount = await MedicineModel.countDocuments();
    if (medicineCount === 0) {
      await MedicineModel.insertMany([
        {
          id: 'med-1',
          genericName: 'Atorvastatin Calcium Trihydrate',
          brandName: 'Lipitor',
          tagline: 'Lipid Lowering Statin Parity',
          category: 'Cardiovascular',
          strength: '20 mg',
          dosageType: 'Oral Tablet',
          ndcCode: '00093-7155-98',
          fdaAbRated: true,
          bioSameness: 99.8,
          chemicalParity: 100,
          innovatorPrice: 84.50,
          genericFloorPrice: 8.90,
          indication: 'Lowers LDL cholesterol and triglycerides in adults.',
          instructions: 'Take 1 tablet daily at bedtime.',
        },
        {
          id: 'med-2',
          genericName: 'Esomeprazole Magnesium DR',
          brandName: 'Nexium',
          tagline: 'Proton Pump Inhibitor Acid Reducer',
          category: 'Gastrointestinal',
          strength: '40 mg',
          dosageType: 'Delayed-Release Capsule',
          ndcCode: '68382-315-01',
          fdaAbRated: true,
          bioSameness: 99.1,
          chemicalParity: 100,
          innovatorPrice: 68.00,
          genericFloorPrice: 7.20,
          indication: 'Reduces excess stomach acid production.',
          instructions: 'Take 1 capsule 1 hour before morning meal.',
        },
      ]);
      console.log('[genericMed DB Seeder] Seeded Medicine catalog records.');
    }

    // Seed Default Demo Users if empty
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      const demoUsers = [
        {
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@healthmail.com',
          password: 'GenericMed#2026',
          role: 'patient',
          phone: '+1 (512) 555-0192',
          avatar: 'SJ',
          patientId: 'PT-8829-TX',
          dob: 'May 14, 1984',
          facilityName: 'Austin Community Health Hub #042',
          twoFactorEnabled: true,
        },
        {
          name: 'Dr. Aris Thorne, PharmD',
          email: 'aris.thorne@mediquick-rx.com',
          password: 'GenericMed#2026',
          role: 'pharmacist',
          phone: '+1 (512) 555-8834',
          avatar: 'AT',
          npiNumber: '1948201948',
          licenseState: 'TX - #84920',
          facilityName: 'MediQuick Pharmacy #042 (Austin Node)',
          twoFactorEnabled: true,
        },
        {
          name: 'Rohan Mehta',
          email: 'supply.lead@cipla-generics.com',
          password: 'GenericMed#2026',
          role: 'wholesaler',
          phone: '+1 (737) 555-4920',
          avatar: 'RM',
          facilityName: 'Cipla Global Logistics & ANDA Rail',
          twoFactorEnabled: true,
        },
        {
          name: 'System Admin',
          email: 'admin@genericmed.health',
          password: 'GenericMed#2026',
          role: 'admin',
          phone: '+1 (800) 555-0199',
          avatar: 'AD',
          facilityName: 'genericMed Health OS Platform Core',
          twoFactorEnabled: true,
        },
      ];

      for (const u of demoUsers) {
        const userDoc = new UserModel(u);
        await userDoc.save();
      }
      console.log('[genericMed DB Seeder] Seeded 4 default authenticated demo user accounts.');
    }
  } catch (err) {
    console.error('[genericMed DB Seeder Error]', err);
  }
}


