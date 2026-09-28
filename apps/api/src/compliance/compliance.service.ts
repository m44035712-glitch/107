import { Injectable } from '@nestjs/common';
import {
  ProductComplianceReport,
  ProductProfileQuery
} from '@bis/shared-types';
import { StandardsService } from '../standards/standards.service';
import { CertificationService } from '../certification/certification.service';
import { TestingService } from '../testing/testing.service';
import { LaboratoriesService } from '../laboratories/laboratories.service';

@Injectable()
export class ComplianceService {
  constructor(
    private standardsService: StandardsService,
    private certificationService: CertificationService,
    private testingService: TestingService,
    private laboratoriesService: LaboratoriesService
  ) {}

  async generateReport(profile: ProductProfileQuery): Promise<ProductComplianceReport> {
    const rec = await this.standardsService.recommendStandards(profile);
    const topMatch = rec.matches.length > 0 ? rec.matches[0].standard : null;
    const stdNumber = topMatch ? topMatch.standardNumber : 'IS 17526:2021';

    const schemes = await this.certificationService.getSchemes();
    const primaryScheme = schemes[0];

    const roadmap = await this.certificationService.getRoadmap(stdNumber, profile.productName);
    const testReqs = await this.testingService.getTestingRequirements({ standardNumber: stdNumber });
    const labs = await this.laboratoriesService.searchLaboratories({ standardNumber: stdNumber });

    return {
      id: `report-${Date.now()}`,
      productName: profile.productName || 'Industrial / MSME Manufactured Product',
      manufacturerType: 'INDIAN_MSME',
      generationDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      applicableStandards: rec.matches.map(m => ({
        standardNumber: m.standard.standardNumber,
        title: m.standard.title,
        isMandatory: m.standard.isMandatory,
        qcoDetails: m.standard.qcoNotificationNumber || 'Mandatory Quality Control Order',
        keyClauses: ['Clause 4 Material Specifications', 'Clause 5 Performance & Safety', 'Clause 8 Marking & Labelling']
      })),
      certificationScheme: primaryScheme,
      testingChecklist: testReqs.map(t => ({
        testName: t.testName,
        clause: t.clauseNumber,
        isMandatory: t.isMandatoryRoutineTest,
        samplingRule: t.samplingRequirements
      })),
      accreditedLaboratories: labs.laboratories.map(l => ({
        name: l.name,
        location: `${l.city}, ${l.state}`,
        accreditationStatus: l.recognitionStatus
      })),
      roadmap: roadmap.steps,
      documentationChecklist: [
        'MSME Udyam Registration / Factory License',
        'Process Flow Diagram & Plant Layout Blueprint',
        'List of Calibrated In-House QC Testing Equipment',
        'QC Chemist & Inspection Personnel Degree Certificates',
        'Raw Material Mill Test Certificates (MTC) for Food Grade Steel'
      ],
      potentialPitfalls: [
        'Attempting commercial retail distribution prior to formal grant of CM/L licence number',
        'Using raw materials lacking traceability or test certificates',
        'Discrepancy between model numbers in test reports and trade catalog'
      ],
      citations: rec.matches.flatMap(m => m.evidence),
      disclaimer: 'This BIS Compliance Report is synthesized via SentinelX based on current Bureau of Indian Standards publications and Gazette Quality Control Orders. Prior to statutory implementation, verify final requirements on manakonline.in.'
    };
  }
}
