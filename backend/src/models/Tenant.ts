import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  id: string;
  organizationName: string;
  tenantType: string;
  schemaIdentifier: string;
  rlsPolicyCount: number;
  encryptionAlgorithm: string;
  totalRecords: number;
  dailyQueryVolume: string;
  avgQueryLatencyMs: number;
  storageMb: number;
  status: string;
  pricingTier: string;
  contractBillingRate: string;
}

const TenantSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    organizationName: { type: String, required: true },
    tenantType: { type: String, required: true },
    schemaIdentifier: { type: String, required: true },
    rlsPolicyCount: { type: Number, required: true },
    encryptionAlgorithm: { type: String, required: true },
    totalRecords: { type: Number, required: true },
    dailyQueryVolume: { type: String, required: true },
    avgQueryLatencyMs: { type: Number, required: true },
    storageMb: { type: Number, required: true },
    status: { type: String, required: true, default: 'HEALTHY' },
    pricingTier: { type: String, required: true },
    contractBillingRate: { type: String, required: true },
  },
  { timestamps: true }
);

export const TenantModel = mongoose.model<ITenant>('Tenant', TenantSchema);
