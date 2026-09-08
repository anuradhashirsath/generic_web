export type AppViewMode = 
  | 'clinical-os' 
  | 'catalog-bioeq' 
  | 'infrastructure' 
  | 'consumer-web' 
  | 'enterprise-analytics' 
  | 'salt-mapping' 
  | 'architecture-prd';

export type ConsumerSubView = 'compare' | 'medicine-details' | 'rx-vault' | 'cart';

export interface DispenseQueueItem {
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
  priority: 'RUSH <30m' | 'High' | 'Normal';
  status: 'OCR Verified' | 'Awaiting Seal' | 'Staged for Pickup' | 'In Isolator' | 'Clinical Hold';
  coldChainRequired: boolean;
  temperatureCelsius?: number;
  targetBin: string;
  pillCount: number;
  interactionWarning?: string;
  courierPin?: string;
  courierId?: string;
  price: number;
  innovatorPrice: number;
  fdaAbRated: boolean;
}

export interface FormulationItem {
  id: string;
  chemicalName: string;
  casNumber: string;
  innovatorReferenceBrand: string;
  innovatorOwner: string;
  dosageStrength: string;
  therapeuticCategory: string;
  fdaApprovalCode: string; // e.g. ANDA #210482
  bioequivalenceRating: 'AB' | 'AB1' | 'AB2' | 'AP';
  f2DissolutionSimilarity: number; // e.g. 78.4% (>50 is equivalent)
  aucRatioConfidenceInterval: string; // e.g. 98.6% (90% CI: 94.2% - 103.8%)
  cMaxRatioConfidenceInterval: string; // e.g. 99.1% (90% CI: 93.8% - 104.5%)
  activeLot: string;
  lotExpDate: string;
  unitDoseInventory: number;
  hubAllocationCount: number;
  tier1Price: number;
  tier2Price: number;
  tier3Price: number;
  innovatorWacPrice: number;
  savingsPercentage: number;
  coAStatus: 'Verified cGMP' | 'Pending QC' | 'Quarantined';
}

export interface TenantSchemaRecord {
  id: string;
  organizationName: string;
  tenantType: 'Retail Pharmacy' | 'Hospital GPO' | 'Pharma Manufacturer' | 'Telehealth Partner';
  schemaIdentifier: string; // e.g. tenant_mediquick_042
  rlsPolicyCount: number;
  encryptionAlgorithm: string;
  totalRecords: number;
  dailyQueryVolume: string;
  avgQueryLatencyMs: number;
  storageMb: number;
  status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  pricingTier: 'Enterprise Dedicated' | 'Regional Tier II' | 'Micro-Hub Pilot';
  contractBillingRate: string;
}

export interface ConsumerMedicine {
  id: string;
  genericName: string;
  brandName: string;
  tagline: string;
  category: string;
  strength: string;
  dosageType: string;
  rxRequired: boolean;
  ndcCode: string;
  fdaAbRated: boolean;
  bioSameness: number; // e.g. 99.4%
  chemicalParity: number; // 100%
  innovatorPrice: number;
  genericFloorPrice: number;
  indication: string;
  instructions: string;
  packOptions: {
    quantity: number;
    price: number;
    savingsPct: number;
    popular?: boolean;
  }[];
  partnerPharmacies: {
    id: string;
    pharmacyName: string;
    genericBrandLabel: string;
    manufacturer: string;
    price: number;
    distanceMiles: number;
    deliveryEstimateMinutes: number;
    rating: number;
    reviewCount: number;
    stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  }[];
}

export interface PrescriptionRecord {
  id: string;
  rxNumber: string;
  genericName: string;
  dosage: string;
  brandReference: string;
  prescribingDoctor: string;
  daysSupplyRemaining: number;
  tabletsRemaining: number;
  totalTablets: number;
  refillsRemaining: number;
  autoRefillEnabled: boolean;
  urgency: 'critical' | 'moderate' | 'stable';
  verificationStage: 'Neural OCR' | 'PharmD Review' | 'Dispense Ready';
  estimatedDeliveryDate: string;
  unitCost: number;
  innovatorCost: number;
  dailyDosageUnits: number;
  dosageFrequencyLabel: string;
  notificationLeadDays?: number;
  preferredAlertTime?: string;
  pushAlertEnabled?: boolean;
}

export interface ScheduledRefillAlert {
  id: string;
  rxId: string;
  genericName: string;
  brandReference: string;
  dosageInstructions: string;
  tabletsRemaining: number;
  dailyDosageUnits: number;
  daysSupplyRemaining: number;
  runOutDate: string;
  alertDate: string;
  scheduledTime: string;
  leadDays: number;
  status: 'SCHEDULED' | 'TRIGGERED_TODAY' | 'DELIVERED' | 'DISMISSED';
  channel: 'push' | 'sms' | 'email';
}

export interface CartItem {
  medicineId: string;
  genericName: string;
  brandName: string;
  dosage: string;
  quantity: number;
  pharmacyId: string;
  pharmacyName: string;
  price: number;
  innovatorPrice: number;
  deliveryEta: string;
  rxVerified: boolean;
}

export interface ArbitrageMappingRule {
  id: string;
  innovatorBrand: string;
  brandOwner: string;
  innovatorPriceUsd: number;
  genericSalt: string;
  dosageForm: string;
  genericFloorUsd: number;
  arbitrageYieldPercentage: number;
  mappedGenericSkus: number;
  therapeuticCategory: string;
  usPatentExpiryYear: number;
  fdaOrangeBookCode: string;
  activeManufacturers: string[];
}

export interface PriceAlert {
  id: string;
  medicineId: string;
  genericSalt: string;
  brandName: string;
  strength: string;
  currentFloorPrice: number;
  targetPrice: number;
  notificationChannels: ('email' | 'sms' | 'push')[];
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  isActive: boolean;
  status: 'active' | 'triggered';
}
