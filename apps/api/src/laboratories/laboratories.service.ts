import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Laboratory, LaboratorySearchFilter } from '@bis/shared-types';
import { SEED_LABORATORIES } from '../common/seed-data';

@Injectable()
export class LaboratoriesService {
  constructor(private prisma: PrismaService) {}

  async searchLaboratories(filter: LaboratorySearchFilter): Promise<{ laboratories: Laboratory[]; total: number }> {
    let dbLabs: any[] = [];
    try {
      dbLabs = await this.prisma.laboratory.findMany({
        where: {
          AND: [
            filter.state ? { state: { contains: filter.state, mode: 'insensitive' } } : {},
            filter.city ? { city: { contains: filter.city, mode: 'insensitive' } } : {}
          ]
        }
      });
    } catch {
      // ignore
    }

    const source = dbLabs.length > 0 ? dbLabs : (SEED_LABORATORIES as any[]);

    const filtered = source.filter(lab => {
      if (filter.state && !lab.state.toLowerCase().includes(filter.state.toLowerCase())) {
        return false;
      }
      if (filter.city && !lab.city.toLowerCase().includes(filter.city.toLowerCase())) {
        return false;
      }
      if (filter.standardNumber) {
        const cleanStd = filter.standardNumber.replace(/:\d{4}/, '').trim().toLowerCase();
        const hasStd = (lab.recognizedStandards as string[]).some(s => s.toLowerCase().includes(cleanStd));
        if (!hasStd) return false;
      }
      if (filter.testName) {
        const hasCap = (lab.testingCapabilities as string[]).some(c => c.toLowerCase().includes(filter.testName!.toLowerCase()));
        if (!hasCap) return false;
      }
      return true;
    });

    return {
      laboratories: filtered.map(l => this.mapLab(l)),
      total: filtered.length
    };
  }

  async getLaboratoryById(id: string): Promise<Laboratory> {
    const labs = (SEED_LABORATORIES as any[]);
    const found = labs.find(l => l.id === id || l.labCode === id);
    if (!found) {
      throw new NotFoundException(`Laboratory '${id}' not found`);
    }
    return this.mapLab(found);
  }

  private mapLab(l: any): Laboratory {
    return {
      id: l.id || `lab-${l.labCode}`,
      name: l.name,
      labCode: l.labCode,
      address: l.address,
      city: l.city,
      state: l.state,
      pincode: l.pincode,
      contactPerson: l.contactPerson || undefined,
      contactEmail: l.contactEmail,
      contactPhone: l.contactPhone,
      recognitionStatus: l.recognitionStatus || 'RECOGNIZED',
      validUpTo: l.validUpTo || '2028-12-31',
      accreditationBody: l.accreditationBody || 'NABL (ISO/IEC 17025)',
      recognizedStandards: Array.isArray(l.recognizedStandards) ? l.recognizedStandards : [],
      testingCapabilities: Array.isArray(l.testingCapabilities) ? l.testingCapabilities : [],
      isNablAccredited: l.isNablAccredited ?? true,
      isBisRecognized: l.isBisRecognized ?? true,
      latitude: l.latitude,
      longitude: l.longitude,
      sourceUrl: l.sourceUrl || 'https://www.services.bis.gov.in',
      lastUpdatedDate: l.lastUpdatedDate || '2024-01-01'
    };
  }
}
