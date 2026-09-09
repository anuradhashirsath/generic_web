import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '10mb' }));

// CORS Header Setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Tenant-ID');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 1. Health & GxP Validation Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'genericMed B2B Health OS Engine',
    version: '1.2.0',
    gxpCompliance: '21 CFR Part 11 Validated',
    timestamp: new Date().toISOString(),
  });
});

// 2. Multi-Tenant Schema Isolation Metrics Endpoint
app.get('/api/tenants', (req: Request, res: Response) => {
  res.json([
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
});

// 3. Micro-Hub Dispensing Queue Endpoint
app.get('/api/dispense-queue', (req: Request, res: Response) => {
  res.json([
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
  ]);
});

// 4. Real-time Server-Sent Events (SSE) Stream for Dispensing Queue
app.get('/api/dispense-queue/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendHeartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(sendHeartbeat);
  });
});

// 5. Payment Checkout Intent Endpoint
app.post('/api/stripe/checkout-session', (req: Request, res: Response) => {
  const { amount, paymentMethod } = req.body;
  res.json({
    success: true,
    transactionId: `TXN-STRIPE-${Date.now()}`,
    amountCharged: amount || 9.80,
    paymentMethod: paymentMethod || 'apple_pay',
    status: 'succeeded',
    receiptUrl: 'https://genericmed.health/receipts/txn-latest',
  });
});

// Start Server if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[genericMed Engine] Backend Express Server listening on port ${PORT}`);
  });
}

export default app;
