import { StandardsService } from '../src/standards/standards.service';
import { PrismaService } from '../src/common/prisma.service';

describe('StandardsService', () => {
  let service: StandardsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      standard: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null)
      }
    };
    service = new StandardsService(mockPrisma as PrismaService);
  });

  it('should search standards and match keywords accurately', async () => {
    const res = await service.searchStandards('water bottle');
    expect(res.standards.length).toBeGreaterThan(0);
    expect(res.standards.some(s => s.standardNumber.includes('17526'))).toBe(true);
  });

  it('should recommend standards based on product profile inputs', async () => {
    const result = await service.recommendStandards({
      productName: 'Stainless steel vacuum insulated water bottle',
      material: 'SS 304',
      intendedApplication: 'Drinking water'
    });

    expect(result.matches.length).toBeGreaterThan(0);
    const top = result.matches[0];
    expect(top.standard.standardNumber).toBe('IS 17526:2021');
    expect(top.relevanceScore).toBeGreaterThanOrEqual(70);
    expect(top.matchingAttributes.length).toBeGreaterThan(0);
  });

  it('should retrieve standard by standard number', async () => {
    const std = await service.getStandardById('IS 10500:2012');
    expect(std).toBeDefined();
    expect(std.title).toContain('Drinking Water');
    expect(std.isMandatory).toBe(true);
  });
});
