import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { TestingRequirement, TestingSearchFilter } from '@bis/shared-types';

@Injectable()
export class TestingService {
  constructor(private prisma: PrismaService) {}

  async getTestingRequirements(filter: TestingSearchFilter): Promise<TestingRequirement[]> {
    const defaultRequirements: TestingRequirement[] = [
      {
        id: 'test-17526-1',
        standardNumber: 'IS 17526:2021',
        testName: 'Thermal Insulation Retention Performance Test',
        testMethod: 'IS 17526 Clause 5.1 & Annex B',
        clauseNumber: '5.1',
        description: 'Flask is filled with boiling water at 95°C and kept sealed in ambient temperature of 20°C. Temperature is measured after 6 hours and 24 hours.',
        acceptanceCriteria: 'Water temperature must remain above 60°C after 6 hours (and above 40°C after 24 hours).',
        samplingRequirements: '3 flasks sampled per batch of 5,000 units.',
        testingFrequency: 'Every production lot (100% routine batch test).',
        requiredEquipment: ['Calibrated Digital Thermocouple / Data Logger', 'Constant Temperature Environmental Chamber', 'Precision Stop Watch'],
        isDestructive: false,
        isMandatoryRoutineTest: true,
        applicableProducts: ['Stainless steel insulated flasks', 'Vacuum bottles'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is17526'
      },
      {
        id: 'test-17526-2',
        standardNumber: 'IS 17526:2021',
        testName: 'Material Spectrometric Grade Analysis (Food Grade Stainless Steel)',
        testMethod: 'IS 17526 Clause 4.1 & IS 228',
        clauseNumber: '4.1',
        description: 'Spectrometric chemical analysis of inner and outer body material to verify Chromium (min 16%), Nickel (min 8%) for SS 304 austenitic grade.',
        acceptanceCriteria: 'Chemical composition must conform strictly to Grade SS 304 or SS 316. Leaching of heavy metals (Lead, Cadmium) must be non-detectable.',
        samplingRequirements: '1 sample per raw material coil / heat number.',
        testingFrequency: 'Every raw material incoming lot.',
        requiredEquipment: ['Optical Emission Spectrometer (OES)', 'Inductively Coupled Plasma (ICP-MS)'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['All stainless steel bottles and flasks'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is17526'
      },
      {
        id: 'test-10500-1',
        standardNumber: 'IS 10500:2012',
        testName: 'Total Dissolved Solids (TDS) and pH Determination',
        testMethod: 'IS 3025 (Part 16) / IS 10500 Clause 4 Table 1',
        clauseNumber: '4.2',
        description: 'Gravimetric determination of dissolved solids after filtration and drying at 180°C, and electrometric pH determination.',
        acceptanceCriteria: 'TDS: Acceptable limit max 500 mg/L (permissible max 2000 mg/L). pH: 6.5 to 8.5.',
        samplingRequirements: '2 representative 1-litre sterile glass containers.',
        testingFrequency: 'Daily online monitoring & daily batch verification.',
        requiredEquipment: ['Calibrated pH Meter', 'Analytical Balance (0.1 mg accuracy)', 'Hot Air Drying Oven'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['Drinking water', 'Packaged water'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is10500'
      },
      {
        id: 'test-1786-1',
        standardNumber: 'IS 1786:2008',
        testName: 'Tensile Stress, 0.2% Proof Stress & Total Elongation Test',
        testMethod: 'IS 1608 (Part 1) & IS 1786 Clause 8 Table 3',
        clauseNumber: '8.1',
        description: 'Full cross-section bar undergoes axial tensile pull on Universal Testing Machine until rupture.',
        acceptanceCriteria: 'For Fe 500D: 0.2% proof stress min 500 N/mm², tensile strength min 565 N/mm² (TS/YS ratio ≥ 1.10), total elongation min 16.0%.',
        samplingRequirements: '1 test piece for every 40 tonnes of each size and grade.',
        testingFrequency: 'Every rolling heat / cast.',
        requiredEquipment: ['Universal Testing Machine (UTM) with Extensometer', 'Digital Vernier Caliper'],
        isDestructive: true,
        isMandatoryRoutineTest: true,
        applicableProducts: ['TMT Steel Rebars Fe 500D / Fe 550D'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is1786'
      },
      {
        id: 'test-16046-1',
        standardNumber: 'IS 16046 (Part 2):2018',
        testName: 'External Short Circuit Safety Test at 55°C',
        testMethod: 'IS 16046 (Part 2) / IEC 62133-2 Clause 7.3.2',
        clauseNumber: '7.3.2',
        description: 'Fully charged battery is short-circuited with external resistance <80 mΩ inside a 55°C thermal chamber until case cools down.',
        acceptanceCriteria: 'No explosion, no fire, no rupture. Max casing temperature must not exceed 150°C.',
        samplingRequirements: '5 fully charged battery packs.',
        testingFrequency: 'Type testing & initial registration sample.',
        requiredEquipment: ['High Current Short-Circuit Rig with Shunt', 'Explosion-Proof Thermal Test Chamber', 'Thermal Imaging Camera'],
        isDestructive: true,
        isMandatoryRoutineTest: false,
        applicableProducts: ['Lithium-ion batteries', 'Power banks'],
        sourceUrl: 'https://www.services.bis.gov.in/knowyourstandards/is16046'
      }
    ];

    if (!filter || (!filter.standardNumber && !filter.testName)) {
      return defaultRequirements;
    }

    return defaultRequirements.filter(req => {
      const matchStd = !filter.standardNumber || req.standardNumber.toLowerCase().includes(filter.standardNumber.toLowerCase());
      const matchName = !filter.testName || req.testName.toLowerCase().includes(filter.testName.toLowerCase());
      return matchStd && matchName;
    });
  }
}
