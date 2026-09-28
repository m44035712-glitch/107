import { GroundingValidator } from '../src/grounding/grounding-validator';
import { ConfidenceLevel, Evidence, StandardStatus } from '@bis/shared-types';

describe('GroundingValidator', () => {
  const validator = new GroundingValidator();

  const sampleEvidence: Evidence[] = [
    {
      id: 'ev-1',
      documentTitle: 'Stainless Steel Vacuum Flasks and Bottles',
      standardNumber: 'IS 17526:2021',
      clause: '5.1',
      page: 8,
      publicationDate: '2021-04-15',
      status: StandardStatus.ACTIVE,
      sourceUrl: 'https://services.bis.gov.in',
      excerpt: 'Thermal retention test requires water to remain above 60°C after 6 hours from 95°C boiling point.',
      similarityScore: 0.95
    }
  ];

  it('should validate answer that references supported standard and clause with HIGH confidence', () => {
    const answer = 'Under IS 17526:2021 Clause 5.1, the thermal insulation performance mandates water to remain above 60°C.';
    const result = validator.validate(answer, sampleEvidence);

    expect(result.isFullyGrounded).toBe(true);
    expect(result.confidenceLevel).toBe(ConfidenceLevel.HIGH);
    expect(result.supportedClaimsCount).toBeGreaterThan(0);
    expect(result.unsupportedClaimsCount).toBe(0);
  });

  it('should flag unsupported standard numbers with LOW or MEDIUM confidence', () => {
    const fabricatedAnswer = 'According to fabricated standard IS 99999:2099 Clause 99.9, this product is mandatory.';
    const result = validator.validate(fabricatedAnswer, sampleEvidence);

    expect(result.isFullyGrounded).toBe(false);
    expect(result.unsupportedClaimsCount).toBeGreaterThan(0);
    expect(result.confidenceLevel).not.toBe(ConfidenceLevel.HIGH);
  });

  it('should return LOW confidence when no evidence is provided', () => {
    const result = validator.validate('Some claim without evidence', []);
    expect(result.isFullyGrounded).toBe(false);
    expect(result.confidenceLevel).toBe(ConfidenceLevel.LOW);
  });
});
