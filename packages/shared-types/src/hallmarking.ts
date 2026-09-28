export interface PurityFineness {
  metal: 'GOLD' | 'SILVER';
  karatDisplay: string; // e.g., "24K", "22K", "18K", "14K", "9K"
  finenessNumber: number; // e.g., 999, 916, 750, 585, 375 for Gold; 999, 925, 900, 800 for Silver
  description: string;
  usageType: string;
  officialStandard: string; // "IS 1417" for Gold, "IS 2112" for Silver
  mandatoryMarkings: Array<{
    name: string;
    description: string;
    iconOrRepresentation: string;
  }>;
}

export interface HuidValidationResult {
  huid: string;
  isValidFormat: boolean;
  length: number;
  explanation: string;
  mandatoryComponents: string[];
  howToVerifyOnBisCare: string[];
  consumerSafetyTips: string[];
}

export interface HallmarkingCentre {
  id: string;
  centreName: string;
  centreCode: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  contactPhone: string;
  recognizedMetals: Array<'GOLD' | 'SILVER'>;
  recognitionStatus: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  validUpTo: string;
  sourceUrl: string;
}

export interface HallmarkingGuidance {
  purityGrades: PurityFineness[];
  huidExplanation: string;
  threeMandatoryMarks: Array<{
    markNumber: number;
    title: string;
    detail: string;
  }>;
  consumerRights: string[];
  compensationPolicy: string;
}
