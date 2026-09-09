import mongoose, { Schema, Document } from 'mongoose';

export interface IDispenseQueue extends Document {
  id: string;
  orderNumber: string;
  genericName: string;
  brandEquivalent: string;
  dosage: string;
  dosageForm: string;
  ndc: string;
  manufacturer: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  prescribingDoctor: string;
  doctorClinic: string;
  rxNumber: string;
  receivedTimeAgo: string;
  priority: string;
  status: string;
  coldChainRequired: boolean;
  targetBin: string;
  pillCount: number;
  price: number;
  innovatorPrice: number;
  fdaAbRated: boolean;
}

const DispenseQueueSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    orderNumber: { type: String, required: true },
    genericName: { type: String, required: true },
    brandEquivalent: { type: String, required: true },
    dosage: { type: String, required: true },
    dosageForm: { type: String, required: true },
    ndc: { type: String, required: true },
    manufacturer: { type: String, required: true },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, required: true },
    prescribingDoctor: { type: String, required: true },
    doctorClinic: { type: String, required: true },
    rxNumber: { type: String, required: true },
    receivedTimeAgo: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    coldChainRequired: { type: Boolean, default: false },
    targetBin: { type: String, required: true },
    pillCount: { type: Number, required: true },
    price: { type: Number, required: true },
    innovatorPrice: { type: Number, required: true },
    fdaAbRated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DispenseQueueModel = mongoose.model<IDispenseQueue>('DispenseQueue', DispenseQueueSchema);
