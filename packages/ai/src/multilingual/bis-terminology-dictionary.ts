/**
 * Configurable, extensible BIS Terminology Dictionary for Hinglish & Indian Language normalizations.
 */

export interface BISTermEntry {
  canonicalEnglish: string;
  intentKey: string;
  synonyms: string[];
}

export const BIS_TERMINOLOGY_DICTIONARY: Record<string, BISTermEntry> = {
  standard: {
    canonicalEnglish: 'Indian Standard specification',
    intentKey: 'FIND_STANDARD',
    synonyms: [
      'standard',
      'manak',
      'manako',
      'मानक',
      'मानकों',
      'kaunsa standard',
      'konsa standard',
      'kaun sa standard',
      'standard kya hai',
      'standard lagega',
      'applicable standard',
      'kis standard',
      'standard number',
      'is code'
    ]
  },
  certification: {
    canonicalEnglish: 'BIS certification scheme licence',
    intentKey: 'CERTIFICATION_GUIDANCE',
    synonyms: [
      'certification',
      'certificate',
      'pramanit',
      'pramanan',
      'प्रमाणन',
      'प्रमाणपत्र',
      'certificate kaise milega',
      'certification kaise milega',
      'compulsory hai kya',
      'mandatory hai kya',
      'anivarya',
      'anivarya hai',
      'licence',
      'license',
      'scheme-1',
      'scheme-i',
      'scheme 1',
      'crs',
      'fmcs'
    ]
  },
  testing: {
    canonicalEnglish: 'testing requirements and acceptance criteria',
    intentKey: 'TESTING_REQUIREMENTS',
    synonyms: [
      'testing',
      'test',
      'tests',
      'parikshan',
      'परीक्षण',
      'kaunse tests',
      'kaunsa test',
      'kahan test karwayein',
      'testing kahan hogi',
      'test required',
      'sampling schedule',
      'routine test',
      'type test',
      'batch test'
    ]
  },
  hallmarking: {
    canonicalEnglish: 'gold and silver hallmarking HUID verification',
    intentKey: 'HALLMARKING_VERIFICATION',
    synonyms: [
      'hallmark',
      'hallmarking',
      'हॉलमार्क',
      'हॉलमार्किंग',
      'gold hallmark',
      'sone ka hallmark',
      'huid',
      'huid verify',
      'huid kaise check kare',
      'purity check',
      '916 purity',
      '22k gold',
      '18k gold',
      '14k gold',
      'ahc centre'
    ]
  },
  consumer_isi: {
    canonicalEnglish: 'genuine ISI mark verification and consumer protection',
    intentKey: 'CONSUMER_ISI_CHECK',
    synonyms: [
      'isi mark',
      'isi',
      'nakli isi',
      'fake isi',
      'asli isi',
      'cml number',
      'cm/l',
      'licence verify',
      'consumer grievance',
      'shikayat',
      'bis care app',
      'शिकायत',
      'नकली आईएसआई'
    ]
  },
  clause_explanation: {
    canonicalEnglish: 'standard clause technical explanation and limits',
    intentKey: 'CLAUSE_EXPLANATION',
    synonyms: [
      'clause',
      'dhara',
      'धारा',
      'clause samjhao',
      'simple language mein',
      'simple hindi mein',
      'kya matlab hai',
      'explain clause',
      'clause meaning'
    ]
  },
  laboratory: {
    canonicalEnglish: 'BIS recognized accredited testing laboratories',
    intentKey: 'LABORATORY_LOOKUP',
    synonyms: [
      'lab',
      'laboratory',
      'prayogshala',
      'प्रयोगशाला',
      'nabl lab',
      'bis recognized lab',
      'testing centre',
      'kahan test karein'
    ]
  },
  qco: {
    canonicalEnglish: 'mandatory Quality Control Order (QCO) gazette notification',
    intentKey: 'CERTIFICATION_GUIDANCE',
    synonyms: [
      'qco',
      'quality control order',
      'qco order',
      'anivarya aadesh',
      'gazette order'
    ]
  }
};
