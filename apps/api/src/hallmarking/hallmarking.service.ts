import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  HallmarkingCentre,
  HallmarkingGuidance,
  HuidValidationResult,
  PurityFineness
} from '@bis/shared-types';
import { SEED_HALLMARKING_CENTRES } from '../common/seed-data';

@Injectable()
export class HallmarkingService {
  constructor(private prisma: PrismaService) {}

  async getGuidance(): Promise<HallmarkingGuidance> {
    const purityGrades: PurityFineness[] = [
      {
        metal: 'GOLD',
        karatDisplay: '24K',
        finenessNumber: 999,
        description: 'Fine Gold (99.9% pure). Primary standard for gold bullion, coins, and high-purity investment bars.',
        usageType: 'Bullion / Investment Coins',
        officialStandard: 'IS 1417',
        mandatoryMarkings: [
          { name: 'BIS Logo', description: 'Standard triangular BIS emblem', iconOrRepresentation: 'BIS_TRIANGLE' },
          { name: 'Purity/Fineness', description: '24K999 (999 parts per thousand)', iconOrRepresentation: '24K999' },
          { name: '6-digit HUID', description: 'Unique alphanumeric identifier', iconOrRepresentation: 'HUID_CODE' }
        ]
      },
      {
        metal: 'GOLD',
        karatDisplay: '22K',
        finenessNumber: 916,
        description: '22 Karat Gold (91.6% pure). Most popular standard in India for traditional and bridal jewellery.',
        usageType: 'Traditional Jewellery',
        officialStandard: 'IS 1417',
        mandatoryMarkings: [
          { name: 'BIS Logo', description: 'Standard triangular BIS emblem', iconOrRepresentation: 'BIS_TRIANGLE' },
          { name: 'Purity/Fineness', description: '22K916 (916 parts per thousand)', iconOrRepresentation: '22K916' },
          { name: '6-digit HUID', description: 'Laser marked 6-character unique code', iconOrRepresentation: 'HUID_CODE' }
        ]
      },
      {
        metal: 'GOLD',
        karatDisplay: '18K',
        finenessNumber: 750,
        description: '18 Karat Gold (75.0% pure). Widely used for diamond-studded jewellery, rings, and modern designer pieces.',
        usageType: 'Studded & Contemporary Jewellery',
        officialStandard: 'IS 1417',
        mandatoryMarkings: [
          { name: 'BIS Logo', description: 'Standard triangular BIS emblem', iconOrRepresentation: 'BIS_TRIANGLE' },
          { name: 'Purity/Fineness', description: '18K750 (750 parts per thousand)', iconOrRepresentation: '18K750' },
          { name: '6-digit HUID', description: 'Laser marked 6-character unique code', iconOrRepresentation: 'HUID_CODE' }
        ]
      },
      {
        metal: 'GOLD',
        karatDisplay: '14K',
        finenessNumber: 585,
        description: '14 Karat Gold (58.5% pure). High durability, budget-friendly and lightweight jewellery.',
        usageType: 'Lightweight & Daily Wear Jewellery',
        officialStandard: 'IS 1417',
        mandatoryMarkings: [
          { name: 'BIS Logo', description: 'Standard triangular BIS emblem', iconOrRepresentation: 'BIS_TRIANGLE' },
          { name: 'Purity/Fineness', description: '14K585 (585 parts per thousand)', iconOrRepresentation: '14K585' },
          { name: '6-digit HUID', description: 'Laser marked 6-character unique code', iconOrRepresentation: 'HUID_CODE' }
        ]
      },
      {
        metal: 'SILVER',
        karatDisplay: '925 Sterling',
        finenessNumber: 925,
        description: 'Sterling Silver (92.5% pure). International standard for fine silver jewellery and luxury tableware.',
        usageType: 'Silver Jewellery & Utensils',
        officialStandard: 'IS 2112',
        mandatoryMarkings: [
          { name: 'BIS Logo', description: 'Standard triangular BIS emblem', iconOrRepresentation: 'BIS_TRIANGLE' },
          { name: 'Purity/Fineness', description: '925 (925 parts per thousand)', iconOrRepresentation: '925' },
          { name: 'A&H Centre Mark', description: 'Assaying centre identification', iconOrRepresentation: 'CENTRE_LOGO' }
        ]
      }
    ];

    return {
      purityGrades,
      huidExplanation: 'Hallmark Unique Identification (HUID) is a 6-digit alphanumeric code laser-inscribed onto each individual piece of gold jewellery at a BIS-recognized Assaying and Hallmarking Centre. It guarantees traceability, genuine purity, and prevents re-stamping fraud.',
      threeMandatoryMarks: [
        {
          markNumber: 1,
          title: 'BIS Triangular Logo',
          detail: 'Signifies that the purity has been verified and certified by a BIS-recognized Assaying and Hallmarking Centre.'
        },
        {
          markNumber: 2,
          title: 'Purity / Fineness Grade',
          detail: 'Clearly displays the karatage and fineness (e.g., 22K916, 18K750, 14K585).'
        },
        {
          markNumber: 3,
          title: '6-Digit Alphanumeric HUID',
          detail: 'Unique laser-marked code giving each piece of jewellery a distinct identity verifiable on the official BIS Care App.'
        }
      ],
      consumerRights: [
        'Every consumer has the statutory right to verify the 6-digit HUID code on the BIS Care App before purchasing.',
        'Jewellers must provide a retail invoice clearly mentioning the HUID, weight, purity grade, and hallmarking charges (₹45 + GST).',
        'Consumers can test hallmarked jewellery at any BIS Recognized A&H Centre for a nominal testing fee of ₹200.'
      ],
      compensationPolicy: 'If a consumer tests hallmarked jewellery at a recognized A&H centre and finds lower purity than stamped, the jeweller is legally bound under BIS Act 2016 to compensate the consumer with two times (2x) the purity difference amount along with testing expenses.'
    };
  }

  async validateHuid(huid: string): Promise<HuidValidationResult> {
    const cleanHuid = (huid || '').trim().toUpperCase();
    const isValid = /^[A-Z0-9]{6}$/.test(cleanHuid);

    return {
      huid: cleanHuid,
      isValidFormat: isValid,
      length: cleanHuid.length,
      explanation: isValid
        ? `Format valid! '${cleanHuid}' conforms to the official BIS 6-digit alphanumeric HUID structure.`
        : `Invalid format: HUID must be exactly 6 alphanumeric characters (capital letters and numbers without spaces or symbols).`,
      mandatoryComponents: [
        '6 alphanumeric laser-inscribed characters',
        'Direct synchronization with BIS national hallmarking server',
        'Linked to registered jeweller ID and A&H Centre dispatch date'
      ],
      howToVerifyOnBisCare: [
        '1. Download the official "BIS CARE" App from Google Play Store or Apple App Store.',
        '2. Open the app and tap on "Verify HUID" on the home dashboard.',
        `3. Enter the 6-character code '${cleanHuid || 'XXXXXX'}'.`,
        '4. The app will display: Jeweller Name, Registration Number, Assaying Centre Name, Article Type, Date of Hallmarking, and Certified Purity.'
      ],
      consumerSafetyTips: [
        'Always demand a 10x magnifying loupe from the jeweller to inspect the HUID with your own eyes.',
        'Ensure the HUID on the jewellery article exactly matches the HUID printed on your retail tax invoice.',
        'Never accept unhallmarked gold jewellery in mandatory hallmarking districts.'
      ]
    };
  }

  async searchCentres(state?: string, city?: string): Promise<HallmarkingCentre[]> {
    let list = (SEED_HALLMARKING_CENTRES as any[]);
    if (state) {
      list = list.filter(c => c.state.toLowerCase().includes(state.toLowerCase()));
    }
    if (city) {
      list = list.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
    }
    return list.map(c => ({
      id: c.id || `ahc-${c.centreCode}`,
      centreName: c.centreName,
      centreCode: c.centreCode,
      address: c.address,
      city: c.city,
      state: c.state,
      pincode: c.pincode,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      recognizedMetals: c.recognizedMetals,
      recognitionStatus: c.recognitionStatus || 'ACTIVE',
      validUpTo: c.validUpTo || '2029-12-31',
      sourceUrl: c.sourceUrl || 'https://www.services.bis.gov.in'
    }));
  }
}
