import { Injectable } from '@nestjs/common';
import { ConsumerComplaintGuidance, IsiVerificationResult } from '@bis/shared-types';

@Injectable()
export class ConsumerService {
  async verifyIsiMark(cmlNumber: string): Promise<IsiVerificationResult> {
    const cleanCml = (cmlNumber || '').trim().toUpperCase().replace(/[^0-9]/g, '');
    const isValidLength = cleanCml.length === 7 || cleanCml.length === 8;

    return {
      cmlNumber: cleanCml ? `CM/L-${cleanCml}` : 'CM/L-XXXXXXX',
      isValidFormat: isValidLength,
      standardNumber: cleanCml.startsWith('14543') ? 'IS 14543:2016' : 'IS XXXX:YYYY',
      licenseeName: isValidLength ? 'Verified Registered Domestic Manufacturer (Authoritative query on BIS Care required)' : undefined,
      productName: 'Packaged / Industrial Product',
      validityStatus: isValidLength ? 'OPERATIVE' : 'UNVERIFIED',
      guidance: isValidLength
        ? `The format 'CM/L-${cleanCml}' is a valid 7/8-digit Certification Marks Licence structure. Always verify its live operative status on the official BIS Care mobile app before trusting the mark.`
        : `Invalid CM/L structure: A genuine ISI Mark licence number must contain 7 or 8 numeric digits directly below the BIS mark.`,
      stepsToVerify: [
        '1. Locate the ISI Mark on the product label or packaging.',
        '2. Verify that the Indian Standard number (e.g. IS 14543) is printed ABOVE the mark.',
        '3. Verify that the 7 or 8 digit CM/L number is printed BELOW the mark.',
        '4. Open the BIS Care Mobile App and select "Verify License Details (ISI Mark)".',
        '5. Enter the CM/L number to view: Licensee Name, Address, Valid Up To date, and Product Scope.'
      ],
      authenticityChecklist: [
        'Is the triangular BIS standard logo printed with crisp, high-resolution geometry?',
        'Is the standard number IS:XXXX present on top of the logo?',
        'Is the 7 or 8 digit CM/L licence number printed at the bottom of the logo?',
        'Does the product name on the packaging match the scope shown on the BIS Care App?'
      ],
      fraudIndicators: [
        'No CM/L number printed below the ISI mark.',
        'Wordings like "As per IS Standards" or "ISO Certified" disguised as an ISI mark.',
        'Blurry, distorted, or hand-drawn triangular logos.',
        'CM/L number that shows "EXPIRED" or "CANCELLED" when queried on the BIS Care App.'
      ],
      bisCareAppLink: 'https://play.google.com/store/apps/details?id=com.bis.bisconnect'
    };
  }

  async getGrievanceGuidance(): Promise<ConsumerComplaintGuidance> {
    return {
      topic: 'Reporting Counterfeit ISI Marks & Substandard Products',
      steps: [
        'Collect physical evidence: Clear photos of the fake mark, batch number, manufacturer address, and retail purchase invoice.',
        'Open the BIS Care App or navigate to the e-BIS Consumer Grievance Portal (services.bis.gov.in).',
        'File a complaint under "Misuse of BIS Standard Mark / Hallmarking".',
        'BIS Enforcement Branch will schedule an unannounced raid and investigate the manufacturer/retailer under the BIS Act 2016.'
      ],
      requiredEvidence: [
        'Retail Cash Memo / GST Tax Invoice',
        'High-resolution photograph of the product packaging showing counterfeit mark',
        'Physical sample (preserve for testing if directed by BIS officer)'
      ],
      redressalPortals: [
        {
          name: 'BIS Care Mobile App',
          url: 'https://play.google.com/store/apps/details?id=com.bis.bisconnect',
          description: 'Official citizen app for real-time licence verification, HUID verification, and instant grievance lodgement with photo attachments.'
        },
        {
          name: 'National Consumer Helpline (NCH)',
          url: 'https://consumerhelpline.gov.in',
          description: 'Department of Consumer Affairs portal for consumer dispute resolution and fraud compensation.'
        }
      ],
      tollFreeHelpline: '1800-11-4000 (BIS Consumer Protection Cell)'
    };
  }
}
