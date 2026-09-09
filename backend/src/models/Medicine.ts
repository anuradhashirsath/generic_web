import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  id: string;
  genericName: string;
  brandName: string;
  tagline: string;
  category: string;
  strength: string;
  dosageType: string;
  ndcCode: string;
  fdaAbRated: boolean;
  bioSameness: number;
  chemicalParity: number;
  innovatorPrice: number;
  genericFloorPrice: number;
  indication: string;
  instructions: string;
}

const MedicineSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    genericName: { type: String, required: true },
    brandName: { type: String, required: true },
    tagline: { type: String, required: true },
    category: { type: String, required: true },
    strength: { type: String, required: true },
    dosageType: { type: String, required: true },
    ndcCode: { type: String, required: true },
    fdaAbRated: { type: Boolean, default: true },
    bioSameness: { type: Number, required: true },
    chemicalParity: { type: Number, required: true },
    innovatorPrice: { type: Number, required: true },
    genericFloorPrice: { type: Number, required: true },
    indication: { type: String, required: true },
    instructions: { type: String, required: true },
  },
  { timestamps: true }
);

export const MedicineModel = mongoose.model<IMedicine>('Medicine', MedicineSchema);
