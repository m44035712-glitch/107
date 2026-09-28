export interface Laboratory {
  id: string;
  name: string;
  labCode: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson?: string;
  contactEmail: string;
  contactPhone: string;
  recognitionStatus: 'RECOGNIZED' | 'PROVISIONAL' | 'SUSPENDED' | 'EXPIRED';
  validUpTo: string;
  accreditationBody: string; // e.g. "NABL (ISO/IEC 17025)"
  recognizedStandards: string[]; // array of IS numbers e.g. ["IS 10500", "IS 14543"]
  testingCapabilities: string[]; // array of test names e.g. ["Chemical", "Microbiological", "Mechanical"]
  isNablAccredited: boolean;
  isBisRecognized: boolean;
  latitude?: number;
  longitude?: number;
  sourceUrl: string;
  lastUpdatedDate: string;
}

export interface LaboratorySearchFilter {
  standardNumber?: string;
  productName?: string;
  testName?: string;
  state?: string;
  city?: string;
  recognitionStatus?: string;
}
