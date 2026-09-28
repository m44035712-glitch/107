import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CertificationScheme, ComplianceRoadmapStep } from '@bis/shared-types';
import { SEED_SCHEMES } from '../common/seed-data';

@Injectable()
export class CertificationService {
  constructor(private prisma: PrismaService) {}

  async getSchemes(): Promise<CertificationScheme[]> {
    let dbSchemes: any[] = [];
    try {
      dbSchemes = await this.prisma.certificationScheme.findMany();
    } catch {
      // ignore
    }

    if (dbSchemes.length > 0) {
      return dbSchemes.map(s => this.mapScheme(s));
    }

    return (SEED_SCHEMES as any[]).map(s => this.mapScheme(s));
  }

  async getSchemeByCode(code: string): Promise<CertificationScheme> {
    const schemes = await this.getSchemes();
    const found = schemes.find(s => s.code.toLowerCase() === code.toLowerCase() || s.id === code);
    if (!found) {
      throw new NotFoundException(`Certification scheme '${code}' not found`);
    }
    return found;
  }

  async getRoadmap(standardNumber: string, productType?: string): Promise<{ steps: ComplianceRoadmapStep[] }> {
    const isCRS = standardNumber.includes('16046') || (productType && productType.toLowerCase().includes('battery'));

    if (isCRS) {
      return {
        steps: [
          {
            stepNumber: 1,
            phaseName: 'Sample Preparation & Lab Selection',
            title: 'Submit Prototype / Sample to BIS-Recognized Lab',
            status: 'COMPLETED',
            category: 'TESTING',
            description: `Submit representative production models to a BIS-recognized laboratory for testing against ${standardNumber}. Ensure safety chambers and altitude simulation tests are scheduled.`,
            actionItems: [
              'Prepare 5-10 product samples with complete marking labels',
              'Obtain test quotation from NABL/BIS accredited laboratory',
              'Verify component test certificates for critical parts (cells, adapter, PCB)'
            ],
            requiredDocuments: ['Component Specification Sheet', 'Circuit Schematic & PCB Layout', 'User Manual in English & Hindi'],
            estimatedTimeframe: '15 - 25 Days',
            relevantStandards: [standardNumber]
          },
          {
            stepNumber: 2,
            phaseName: 'Laboratory Test Report',
            title: 'Obtain Comprehensive Test Report',
            status: 'IN_PROGRESS',
            category: 'TESTING',
            description: 'Receive full accredited test report from the laboratory. The report remains valid for CRS submission for 90 days from the date of issue.',
            actionItems: [
              'Verify that all test parameters indicate PASS without non-conformances',
              'Check model numbers, brand name, and ratings for exact match with application'
            ],
            requiredDocuments: ['Test Report with QR Code & NABL Symbol', 'Lab Endorsement Form'],
            estimatedTimeframe: '3 - 5 Days',
            relevantStandards: [standardNumber]
          },
          {
            stepNumber: 3,
            phaseName: 'Online CRS Application',
            title: 'Submit Application on CRS Portal (crsbis.in)',
            status: 'PENDING',
            category: 'APPLICATION',
            description: 'Create manufacturer profile on the BIS Compulsory Registration Scheme portal. Upload test report, Brand Authorization Letter, and Undertaking.',
            actionItems: [
              'Appoint Authorized Indian Representative (AIR) if manufacturing overseas',
              'Pay government registration processing fee online'
            ],
            requiredDocuments: ['Brand Trademark Registration', 'AIR Agreement & ID Proof', 'Manufacturer Business License / ISO Certificate'],
            estimatedTimeframe: '2 - 4 Days',
            relevantStandards: [standardNumber]
          },
          {
            stepNumber: 4,
            phaseName: 'Scrutiny & Grant of R-Number',
            title: 'Grant of Unique Registration Number (R-XXXXXXXX)',
            status: 'PENDING',
            category: 'GRANT',
            description: 'BIS scrutiny officer verifies documentation and grants the unique 8-digit R-number. Manufacturer is authorized to apply the Standard Mark.',
            actionItems: [
              'Download official Registration Grant Letter',
              'Incorporate Standard Mark with R-Number and standard reference on product label and retail packaging'
            ],
            requiredDocuments: ['Registration Grant Certificate'],
            estimatedTimeframe: '10 - 15 Days',
            relevantStandards: [standardNumber]
          }
        ]
      };
    }

    // Default Scheme I (ISI Mark) Roadmap
    return {
      steps: [
        {
          stepNumber: 1,
          phaseName: 'Documentation & In-house QC Setup',
          title: 'Establish In-House Quality Control Laboratory',
          status: 'COMPLETED',
          category: 'PREPARATION',
          description: `Set up the in-house testing facility specified in the Scheme of Inspection and Testing (SIT) for ${standardNumber}. Ensure calibrated equipment and qualified QC personnel.`,
          actionItems: [
            'Procure and calibrate mandatory testing instruments',
            'Appoint qualified testing personnel with chemistry/engineering degree',
            'Formulate Scheme of Testing and Inspection (STI) manual'
          ],
          requiredDocuments: ['Machinery List', 'Testing Equipment Calibration Certificates', 'QC Chemist Qualification & Appointment Letter'],
          estimatedTimeframe: '15 - 30 Days',
          relevantStandards: [standardNumber]
        },
        {
          stepNumber: 2,
          phaseName: 'Manakonline Portal Application',
          title: 'Submit Form-I on BIS Manakonline Portal',
          status: 'IN_PROGRESS',
          category: 'APPLICATION',
          description: 'Register enterprise on manakonline.in. Fill out Form-I for Grant of Licence, upload manufacturing flow chart, factory layout, and pay ₹1,000 application fee.',
          actionItems: [
            'Upload factory registration / MSME Udyam Certificate',
            'Submit consent letter from State Pollution Control Board',
            'Pay initial application and factory audit fee'
          ],
          requiredDocuments: ['Udyam MSME Registration', 'Pollution Consent Order', 'Plant Layout Drawing', 'Process Flowchart'],
          estimatedTimeframe: '3 - 7 Days',
          relevantStandards: [standardNumber]
        },
        {
          stepNumber: 3,
          phaseName: 'Factory Inspection & Sample Drawing',
          title: 'Preliminary Factory Audit by BIS Inspecting Officer',
          status: 'PENDING',
          category: 'INSPECTION',
          description: 'A designated BIS Inspecting Officer visits the factory premises, verifies manufacturing line and testing capabilities, witnesses in-house verification, and draws independent samples.',
          actionItems: [
            'Demonstrate complete manufacturing and routine testing in presence of officer',
            'Officer seals and codes samples for dispatch to designated BIS/NABL third-party laboratory'
          ],
          requiredDocuments: ['Inspection Verification Sheet', 'Sample Coding Record'],
          estimatedTimeframe: '10 - 20 Days',
          relevantStandards: [standardNumber]
        },
        {
          stepNumber: 4,
          phaseName: 'Third-Party Sample Testing',
          title: 'Independent Testing in BIS Recognized Lab',
          status: 'PENDING',
          category: 'TESTING',
          description: 'The sealed sample undergoes complete compliance testing in a BIS central/recognized laboratory across all statutory parameters.',
          actionItems: [
            'Track testing status via Manakonline portal',
            'Resolve any minor observations or clarifications raised by laboratory'
          ],
          requiredDocuments: ['Official Laboratory Test Report'],
          estimatedTimeframe: '15 - 30 Days',
          relevantStandards: [standardNumber]
        },
        {
          stepNumber: 5,
          phaseName: 'Grant of CM/L Licence',
          title: 'Issuance of ISI Mark Certification Licence (CM/L)',
          status: 'PENDING',
          category: 'GRANT',
          description: 'Upon confirmation of passing test reports and payment of annual marking fee, BIS issues the prestigious CM/L licence number authorizing use of the ISI Mark.',
          actionItems: [
            'Pay annual advance minimum marking fee',
            'Design product packaging with ISI Mark, standard number, and CM/L number'
          ],
          requiredDocuments: ['Form-II Grant of Licence Certificate', 'Marking Fee Receipt'],
          estimatedTimeframe: '7 - 14 Days',
          relevantStandards: [standardNumber]
        }
      ]
    };
  }

  private mapScheme(s: any): CertificationScheme {
    return {
      id: s.id || `scheme-${s.code}`,
      schemeType: s.schemeType,
      name: s.name,
      code: s.code,
      description: s.description,
      applicability: s.applicability,
      applicableSectors: Array.isArray(s.applicableSectors) ? s.applicableSectors : [],
      mandatoryProductCategories: Array.isArray(s.mandatoryProductCategories) ? s.mandatoryProductCategories : [],
      keySteps: Array.isArray(s.keySteps) ? s.keySteps : [],
      requiredDocuments: Array.isArray(s.requiredDocuments) ? s.requiredDocuments : [],
      feeStructureSummary: s.feeStructureSummary || '',
      surveillanceFrequency: s.surveillanceFrequency || '',
      validityPeriod: s.validityPeriod || '',
      officialGuidelineUrl: s.officialGuidelineUrl || 'https://www.services.bis.gov.in'
    };
  }
}
