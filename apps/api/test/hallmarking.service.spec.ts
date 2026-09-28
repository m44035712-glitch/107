import { HallmarkingService } from '../src/hallmarking/hallmarking.service';
import { PrismaService } from '../src/common/prisma.service';

describe('HallmarkingService', () => {
  let service: HallmarkingService;

  beforeEach(() => {
    service = new HallmarkingService({} as PrismaService);
  });

  it('should validate correct 6-digit alphanumeric HUID format', async () => {
    const result = await service.validateHuid('AB12CD');
    expect(result.isValidFormat).toBe(true);
    expect(result.length).toBe(6);
    expect(result.howToVerifyOnBisCare.length).toBeGreaterThan(0);
  });

  it('should reject invalid length or symbol containing HUID', async () => {
    const resultShort = await service.validateHuid('AB12');
    expect(resultShort.isValidFormat).toBe(false);

    const resultSymbol = await service.validateHuid('AB-12!');
    expect(resultSymbol.isValidFormat).toBe(false);
  });

  it('should provide statutory 2X compensation guidance', async () => {
    const guidance = await service.getGuidance();
    expect(guidance.purityGrades.length).toBeGreaterThan(0);
    expect(guidance.threeMandatoryMarks.length).toBe(3);
    expect(guidance.compensationPolicy).toContain('two times');
  });
});
