import { ConsumerService } from '../src/consumer/consumer.service';

describe('ConsumerService', () => {
  let service: ConsumerService;

  beforeEach(() => {
    service = new ConsumerService();
  });

  it('should validate 7 or 8-digit CM/L licence number structure', async () => {
    const result = await service.verifyIsiMark('1454301');
    expect(result.isValidFormat).toBe(true);
    expect(result.cmlNumber).toBe('CM/L-1454301');
    expect(result.authenticityChecklist.length).toBeGreaterThan(0);
    expect(result.fraudIndicators.length).toBeGreaterThan(0);
  });

  it('should flag short or invalid CM/L code', async () => {
    const result = await service.verifyIsiMark('123');
    expect(result.isValidFormat).toBe(false);
  });

  it('should return consumer complaint helpline and portals', async () => {
    const guidance = await service.getGrievanceGuidance();
    expect(guidance.tollFreeHelpline).toBe('1800-11-4000 (BIS Consumer Protection Cell)');
    expect(guidance.redressalPortals.length).toBeGreaterThan(0);
  });
});
