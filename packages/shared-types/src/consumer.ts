export interface IsiVerificationResult {
  cmlNumber: string;
  isValidFormat: boolean;
  standardNumber?: string;
  licenseeName?: string;
  productName?: string;
  brandName?: string;
  validityStatus?: 'OPERATIVE' | 'DEFERRED' | 'CANCELLED' | 'EXPIRED' | 'UNVERIFIED';
  guidance: string;
  stepsToVerify: string[];
  authenticityChecklist: string[];
  fraudIndicators: string[];
  bisCareAppLink: string;
}

export interface ConsumerComplaintGuidance {
  topic: string;
  steps: string[];
  requiredEvidence: string[];
  redressalPortals: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  tollFreeHelpline: string;
}
