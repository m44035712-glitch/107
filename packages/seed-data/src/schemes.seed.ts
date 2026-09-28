import { CertificationSchemeType } from '@bis/shared-types';

export const SEED_SCHEMES = [
  {
    schemeType: CertificationSchemeType.SCHEME_I_ISI,
    name: 'Scheme I — Product Certification Scheme (ISI Mark)',
    code: 'SCHEME-I',
    description: 'The premier BIS Product Certification Scheme granting licence to use the prestigious ISI Mark. Involves factory infrastructure audit, in-house laboratory evaluation, drawing of independent samples, and grant of CM/L licence.',
    applicability: 'Applicable to all domestic manufacturing facilities producing products covered under Indian Standards with mandatory QCO or voluntary demand.',
    applicableSectors: ['Food & Beverages', 'Steel & Cement', 'Pipes & Cables', 'Automotive Components', 'Consumer Appliances', 'Chemicals'],
    mandatoryProductCategories: ['Packaged Drinking Water', 'TMT Steel Bars', 'Portland Cement', 'LPG Cylinders', 'Infant Milk Formula', 'Electric Iron & Water Heaters'],
    keySteps: [
      { stepNumber: 1, title: 'Standard & Scope Identification', description: 'Determine applicable IS number, product grade, and in-house testing capability.', responsibleParty: 'Applicant', estimatedDuration: '1-3 days' },
      { stepNumber: 2, title: 'Online Manakonline Application', description: 'Submit Form-I on Manakonline portal with plant layout, machinery list, manufacturing process flow, and test personnel details.', responsibleParty: 'Applicant', estimatedDuration: '2-5 days' },
      { stepNumber: 3, title: 'Preliminary Factory Inspection', description: 'BIS Inspecting Officer visits factory, evaluates QA systems, witnesses test verification, and draws independent sample.', responsibleParty: 'BIS / Applicant', estimatedDuration: '10-20 days' },
      { stepNumber: 4, title: 'Sample Testing in BIS/NABL Lab', description: 'Drawn sample is tested for all parameters in recognized lab. Test report must show 100% compliance.', responsibleParty: 'Recognized Laboratory', estimatedDuration: '15-30 days' },
      { stepNumber: 5, title: 'Grant of Licence (CM/L Number)', description: 'Upon satisfactory verification of report and payment of marking fee, BIS issues the 7 or 8-digit CM/L licence number.', responsibleParty: 'BIS', estimatedDuration: '7-14 days' }
    ],
    requiredDocuments: [
      'Factory Registration / MSME Udyam Certificate',
      'Manufacturing Machinery & Calibrated Equipment List',
      'In-house Quality Control Personnel Qualifications',
      'Plant Layout & Process Flow Diagram',
      'Test Reports of Raw Materials & Finished Product',
      'Consent to Operate from State Pollution Control Board'
    ],
    feeStructureSummary: 'Application Fee: ₹1,000; Factory Audit Charge: ₹7,000 per man-day; Annual Marking Fee: based on actual production volume (concessional for MSME).',
    surveillanceFrequency: 'Periodic unannounced factory audits and market sample testing twice a year.',
    validityPeriod: 'Initial licence valid for 1 to 2 years; renewable up to 5 years.',
    officialGuidelineUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/schemes/scheme-1'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_II_CRS,
    name: 'Scheme II — Compulsory Registration Scheme (CRS)',
    code: 'SCHEME-II-CRS',
    description: 'Self-declaration of conformity based on testing of product in BIS-recognized labs. Primarily mandated by MeitY, MNRE, and MoP for electronics, IT goods, and solar products.',
    applicability: 'Applicable to manufacturers (both domestic and overseas) of notified electronic, IT, solar PV, and lighting equipment.',
    applicableSectors: ['Electronics & IT Goods', 'Solar Photovoltaic Systems', 'LED Lighting', 'Smart Watches & Consumer Devices', 'Power Banks & Batteries'],
    mandatoryProductCategories: ['Mobile Phones', 'Lithium-ion Batteries & Power Banks', 'Laptops & Tablets', 'LED Drivers', 'Solar Inverters', 'Smart Speakers'],
    keySteps: [
      { stepNumber: 1, title: 'Sample Testing in BIS Recognized Lab', description: 'Submit product sample to a BIS recognized Indian laboratory for full safety testing as per relevant IS/IEC standard.', responsibleParty: 'Applicant / Lab', estimatedDuration: '15-25 days' },
      { stepNumber: 2, title: 'Obtain Test Report', description: 'Receive valid, accredited test report (must be within 90 days of generation for registration).', responsibleParty: 'Recognized Laboratory', estimatedDuration: '3-5 days' },
      { stepNumber: 3, title: 'Online Registration Submission', description: 'Apply on CRS portal (crsbis.in) with test report, Undertaking (Affidavit), Brand Authorization, and Foreign/Domestic Manufacturer details.', responsibleParty: 'Applicant', estimatedDuration: '2-4 days' },
      { stepNumber: 4, title: 'Scrutiny & Grant of R-Number', description: 'BIS officer verifies report compliance and issues unique 8-digit Registration Number (R-XXXXXXXX).', responsibleParty: 'BIS', estimatedDuration: '10-18 days' }
    ],
    requiredDocuments: [
      'Accredited Test Report from BIS-recognized Lab (within 90 days)',
      'Brand Owner Authorization Letter & Trademark Certificate',
      'Authorized Indian Representative (AIR) appointment (for foreign manufacturers)',
      'Manufacturer Business Registration (ISO / Factory License)'
    ],
    feeStructureSummary: 'Government Processing Fee: ₹53,000 per application (including 2 years registration); Model addition: ₹20,000.',
    surveillanceFrequency: 'Market surveillance sample picking and laboratory re-testing.',
    validityPeriod: '2 Years initially; renewable for 2 to 5 years.',
    officialGuidelineUrl: 'https://www.crsbis.in/BIS/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_HALLMARK,
    name: 'Hallmarking Scheme for Precious Metals (Gold & Silver)',
    code: 'SCHEME-HALLMARK',
    description: 'Mandatory quality certification for gold jewellery and artefacts, ensuring accurate fineness and consumer protection through Assaying & Hallmarking (A&H) centres.',
    applicability: 'All jewellers manufacturing or retailing gold jewellery and artefacts in notified districts across India.',
    applicableSectors: ['Precious Metal Retailing', 'Jewellery Manufacturing', 'Bullion & Refining'],
    mandatoryProductCategories: ['Gold Jewellery (14K, 18K, 20K, 22K, 23K, 24K)', 'Gold Artefacts', 'Silver Articles (voluntary)'],
    keySteps: [
      { stepNumber: 1, title: 'Jeweller Registration on Manakonline', description: 'Jeweller registers retail outlet online; registration is granted instantly with zero government fee for MSMEs.', responsibleParty: 'Jeweller / BIS', estimatedDuration: '1 day' },
      { stepNumber: 2, title: 'Submission to A&H Centre', description: 'Jeweller submits batch of manufactured jewellery to BIS Recognized Assaying & Hallmarking Centre.', responsibleParty: 'Jeweller', estimatedDuration: '1-2 days' },
      { stepNumber: 3, title: 'Assaying (Fire Assay / XRF)', description: 'A&H Centre tests purity of alloy using fire assay method as per IS 1417.', responsibleParty: 'A&H Centre', estimatedDuration: '6-12 hours' },
      { stepNumber: 4, title: 'Laser Inscription of HUID', description: 'Centre inscribes BIS Logo, Fineness Mark (e.g. 22K916), and unique 6-digit alphanumeric HUID onto the jewellery piece.', responsibleParty: 'A&H Centre', estimatedDuration: '1-2 hours' }
    ],
    requiredDocuments: [
      'GST Registration Certificate',
      'PAN Card & Proof of Business Outlet',
      'Self-Declaration of Turnover / MSME Certificate'
    ],
    feeStructureSummary: 'Jeweller Registration: Free (per recent BIS notification); Hallmarking Charge: ₹45 + GST per piece for gold jewellery.',
    surveillanceFrequency: 'Periodic quality audits of A&H Centres and mystery shopping of jewellery stores.',
    validityPeriod: 'Lifetime registration for jewellers.',
    officialGuidelineUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/schemes/hallmarking'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_III_COPC,
    name: 'Scheme III — Certificate of Conformity for Batch/Lot Inspection',
    code: 'SCHEME-III-COPC',
    description: 'Certification granted for a specific, identified consignment or production batch following physical sampling and testing without requiring permanent factory licensing.',
    applicability: 'Manufacturers, importers, or procurement authorities dealing with discrete consignments, project-specific bulk supplies, or specialized non-continuous production runs.',
    applicableSectors: [
      'Structural Steel Imports',
      'Heavy Electrical Transformers',
      'Bulk Railway Equipment',
      'Specialty Pipe Fittings'
    ],
    mandatoryProductCategories: [
      'Imported Structural Steel Lots',
      'Special Alloy Billets',
      'High-Capacity Power Transformers',
      'Substation Gas-Insulated Switchgear'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Consignment Notification',
        description: 'Notify BIS of the declared lot, batch size, bill of lading/invoice details, and customs storage location.',
        responsibleParty: 'Applicant / Importer',
        estimatedDuration: '2-4 days'
      },
      {
        stepNumber: 2,
        title: 'Lot Inspection & Sampling',
        description: 'BIS inspecting officer inspects the declared lot, verifies quantities, and extracts representative samples using statistical sampling tables.',
        responsibleParty: 'BIS Inspecting Officer',
        estimatedDuration: '2-5 days'
      },
      {
        stepNumber: 3,
        title: 'Batch Testing',
        description: 'Samples undergo physical and chemical testing at an approved government or BIS laboratory.',
        responsibleParty: 'BIS Recognized Lab',
        estimatedDuration: '10-20 days'
      },
      {
        stepNumber: 4,
        title: 'Issuance of Certificate of Conformity',
        description: 'Upon satisfactory test clearance, BIS issues a Certificate of Conformity strictly applicable to the verified batch.',
        responsibleParty: 'BIS',
        estimatedDuration: '3-7 days'
      }
    ],
    requiredDocuments: [
      'Commercial Invoice and Packing List',
      'Bill of Lading / Airway Bill',
      'Manufacturer Internal Test Certificate (MTC)',
      'Customs Out of Charge / Warehouse Entry Declaration'
    ],
    feeStructureSummary: 'Application fee: ₹5,000; Inspection fee: ₹7,000 per man-day plus actual laboratory testing charges.',
    surveillanceFrequency: 'None (certificate terminates upon clearance of the specific lot).',
    validityPeriod: 'Valid only for the specified batch and quantity.',
    officialGuidelineUrl: 'https://www.bis.gov.in/product-certification/conformity-assessment-schemes/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_IV_COPC_PROCESS,
    name: 'Scheme IV — Certificate of Conformity for Continuous Processes',
    code: 'SCHEME-IV-COPC-PROCESS',
    description: 'Conformity assessment scheme designed for products manufactured via complex, continuous chemical or metallurgical process plants where traditional discrete unit sampling is impractical.',
    applicability: 'Manufacturers operating continuous processing plants where conformity depends strictly on validated process controls, automation integrity, and regular line sampling.',
    applicableSectors: [
      'Continuous Chemical Synthesis',
      'Bulk Petrochemical Resins',
      'Float Glass Plants',
      'Refined Petroleum Additives'
    ],
    mandatoryProductCategories: [
      'Bulk Polymer Granules (Polyethylene, Polypropylene)',
      'Technical Grade Chemicals',
      'Float Sheet Glass',
      'Continuous Process Industrial Gases'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Process Validation Dossier Submission',
        description: 'Submit process flow diagrams, critical control point (CCP) automation schemes, and continuous in-line sampling protocols.',
        responsibleParty: 'Applicant',
        estimatedDuration: '5-10 days'
      },
      {
        stepNumber: 2,
        title: 'Plant & Process Audit',
        description: 'BIS technical officers audit continuous processing mechanisms, online analytical instrumentation, and SCADA validation systems.',
        responsibleParty: 'BIS',
        estimatedDuration: '3-5 days'
      },
      {
        stepNumber: 3,
        title: 'Process Stream Sampling',
        description: 'Representative samples pulled across operational shifts during steady-state manufacturing.',
        responsibleParty: 'BIS / Lab',
        estimatedDuration: '15-25 days'
      },
      {
        stepNumber: 4,
        title: 'Certificate of Conformity Grant',
        description: 'BIS approves compliance and issues the CoC under Scheme IV.',
        responsibleParty: 'BIS',
        estimatedDuration: '10-15 days'
      }
    ],
    requiredDocuments: [
      'Piping and Instrumentation Diagrams (P&ID)',
      'Standard Operating Procedures for Process Stabilization',
      'Instrument Calibration Records (Online Spectrometers, Chromatographs)',
      'Hazard and Operability (HAZOP) Compliance Documents'
    ],
    feeStructureSummary: 'Application fee: ₹10,000; Audit fee: ₹7,000 per man-day; Annual conformity fee based on production throughput.',
    surveillanceFrequency: 'Biannual process audit and quarterly verification of continuous telemetry/sampling records.',
    validityPeriod: '2 Years; renewable based on continued process compliance.',
    officialGuidelineUrl: 'https://www.bis.gov.in/product-certification/conformity-assessment-schemes/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_V_MANAGEMENT_PROCESS,
    name: 'Scheme V — Quality Assurance and Process Certification',
    code: 'SCHEME-V-QA',
    description: 'Product conformity scheme combining ISO 9001-aligned quality management system auditing with comprehensive product sample testing.',
    applicability: 'Manufacturers seeking structured export-grade quality compliance or satisfying regulatory tenders requiring certified system-integrated product guarantees.',
    applicableSectors: [
      'Precision Engineering',
      'Aerospace Fasteners & Hardware',
      'Specialty Medical Devices',
      'Heavy Electrical Switchboards'
    ],
    mandatoryProductCategories: [
      'Industrial High-Tensile Fasteners',
      'Custom Switchgear Panels',
      'Specialty Industrial Fluid Valves',
      'Reinforced Thermoset Composites'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'System & Product Documentation Review',
        description: 'Submit factory Quality Manual, Quality Assurance Plan (QAP), and product engineering drawings.',
        responsibleParty: 'Applicant',
        estimatedDuration: '7-14 days'
      },
      {
        stepNumber: 2,
        title: 'Integrated Audit (Stage 1 & 2)',
        description: 'BIS auditors evaluate shop-floor quality procedures, statistical process control, and product verification stages.',
        responsibleParty: 'BIS Audit Team',
        estimatedDuration: '2-4 days'
      },
      {
        stepNumber: 3,
        title: 'Type & Routine Testing',
        description: 'Execute type testing on sample units to verify adherence to targeted Indian Standards.',
        responsibleParty: 'Accredited Lab',
        estimatedDuration: '20-30 days'
      },
      {
        stepNumber: 4,
        title: 'Certification Issuance',
        description: 'Grant of Scheme V certification validating both the operating quality system and output product batches.',
        responsibleParty: 'BIS',
        estimatedDuration: '10-15 days'
      }
    ],
    requiredDocuments: [
      'Quality Assurance Plan (QAP) aligned with ISO 9001',
      'Process flow chart detailing inline inspection gates',
      'Machinery preventive maintenance and calibration schedules',
      'Raw material test certificates from verified suppliers'
    ],
    feeStructureSummary: 'Application fee: ₹15,000; Certification audit fee: ₹7,000 per auditor per day; Annual monitoring fee: ₹30,000.',
    surveillanceFrequency: 'Annual comprehensive management system review plus bi-annual factory inspection.',
    validityPeriod: '3 Years; subject to satisfactory annual surveillance.',
    officialGuidelineUrl: 'https://www.bis.gov.in/product-certification/conformity-assessment-schemes/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_VI_SUPPLIER_DECLARATION,
    name: 'Scheme VI — Supplier’s Declaration of Conformity (SDoC)',
    code: 'SCHEME-VI-SDOC',
    description: 'Simplified compliance framework allowing manufacturers to place a product in the market based on an authenticated internal declaration of standard compliance.',
    applicability: 'Manufacturers of low-to-medium risk consumer goods or non-critical components under designated low-hazard standards.',
    applicableSectors: [
      'Non-Critical Light Consumer Durables',
      'Passive Electronic Assemblies',
      'Hand Tools & Hardware',
      'Non-Electrical Household Utensils'
    ],
    mandatoryProductCategories: [
      'Manual Hand Tools',
      'Household Stainless Steel Utensils',
      'Decorative Fittings',
      'Passive Mechanical Fasteners'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Internal / Accredited Testing',
        description: 'Test product in manufacturer’s internal laboratory (if accredited) or independent NABL lab to prove conformance.',
        responsibleParty: 'Manufacturer / Lab',
        estimatedDuration: '7-15 days'
      },
      {
        stepNumber: 2,
        title: 'Compilation of Technical File',
        description: 'Assemble design files, risk analysis, bill of materials, and test results into a standard technical dossier.',
        responsibleParty: 'Manufacturer',
        estimatedDuration: '3-5 days'
      },
      {
        stepNumber: 3,
        title: 'Submission of SDoC on Portal',
        description: 'Upload declaration of conformity and sign legal undertakings on the BIS digital repository.',
        responsibleParty: 'Manufacturer',
        estimatedDuration: '1-2 days'
      },
      {
        stepNumber: 4,
        title: 'Repository Acknowledgment',
        description: 'BIS system logs declaration and issues an automated confirmation reference number.',
        responsibleParty: 'BIS System',
        estimatedDuration: '1-3 days'
      }
    ],
    requiredDocuments: [
      'Formal Signed Supplier Declaration of Conformity (SDoC)',
      'Comprehensive Technical Construction File (TCF)',
      'Product drawing specifications and user manual',
      'Factory quality control test records'
    ],
    feeStructureSummary: 'Portal Registration Fee: ₹10,000; Annual maintenance fee: ₹5,000.',
    surveillanceFrequency: 'Market surveillance based on consumer risk reports and randomized retail sampling.',
    validityPeriod: '3 Years; renewable upon re-submission of updated SDoC dossier.',
    officialGuidelineUrl: 'https://www.bis.gov.in/product-certification/conformity-assessment-schemes/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_VII_PILOT_PRODUCTION,
    name: 'Scheme VII — Verification of Pilot Production & Pre-Market Testing',
    code: 'SCHEME-VII-PILOT',
    description: 'Conformity assessment path for pilot production batches, pre-commercial scale manufacturing, and newly engineered prototypes under draft or fresh Indian Standards.',
    applicability: 'Enterprises commercializing R&D innovations, high-technology hardware, or pilot runs before establishing full-scale continuous lines.',
    applicableSectors: [
      'Electric Vehicle Powertrains & Swappable Packs',
      'Green Hydrogen Electrolyzers',
      'Advanced Nanomaterials',
      'Medical Diagnostic Prototypes'
    ],
    mandatoryProductCategories: [
      'Pilot Electric Vehicle Battery Systems',
      'Stationary Energy Storage Prototypes',
      'Biopolymer Packaging Materials',
      'Specialty Filter Media'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Pilot Protocol Evaluation',
        description: 'Present prototype technical documentation, pilot manufacturing scale, and target standard alignment.',
        responsibleParty: 'Applicant',
        estimatedDuration: '5-10 days'
      },
      {
        stepNumber: 2,
        title: 'Pilot Line Verification',
        description: 'BIS technical officers visit the pilot development facility to verify process controls and batch tagging.',
        responsibleParty: 'BIS',
        estimatedDuration: '2-3 days'
      },
      {
        stepNumber: 3,
        title: 'Extensive Prototype Testing',
        description: 'Pilot samples undergo accelerated lifetime, safety, and stress testing in specialized national labs.',
        responsibleParty: 'BIS / National Laboratory',
        estimatedDuration: '25-45 days'
      },
      {
        stepNumber: 4,
        title: 'Grant of Pilot Compliance Certificate',
        description: 'BIS grants a limited-run certificate permitting monitored pilot deployment in market trials.',
        responsibleParty: 'BIS',
        estimatedDuration: '7-14 days'
      }
    ],
    requiredDocuments: [
      'R&D / Pilot Production Dossier and Process Architecture',
      'Failure Mode and Effects Analysis (FMEA) report',
      'Detailed component origin matrix',
      'Pilot deployment and tracking protocol'
    ],
    feeStructureSummary: 'Application fee: ₹20,000; Pilot assessment fee: ₹14,000; Lab testing at actual costs.',
    surveillanceFrequency: 'Continuous batch tracking through deployment reporting.',
    validityPeriod: '1 Year (non-renewable; must convert to Scheme I or II for mass manufacturing).',
    officialGuidelineUrl: 'https://www.bis.gov.in/product-certification/conformity-assessment-schemes/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_VIII_CUSTOM_IMPORT,
    name: 'Scheme VIII — Project Import & Custom-Engineered Equipment Clearance',
    code: 'SCHEME-VIII-PROJECT',
    description: 'Targeted compliance clearance framework for large-scale, custom-designed industrial equipment imported for national infrastructure or single-site mega industrial installations.',
    applicability: 'Engineering procurement contractors (EPC), energy utilities, and industrial consortiums importing unique plant machinery.',
    applicableSectors: [
      'Hydroelectric & Thermal Power Plants',
      'Metro Rail & Freight Corridors',
      'Heavy Chemical Refineries',
      'Semiconductor Fabrication Utilities'
    ],
    mandatoryProductCategories: [
      'Custom Hydro Turbines',
      'Mega Tunnel Boring Machine Components',
      'High-Pressure Cracking Vessels',
      'Railway Signaling Infrastructure'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Project Exemption/Clearance Dossier',
        description: 'File application identifying single-use project parameters, international equivalence mappings, and import credentials.',
        responsibleParty: 'Project Authority / EPC',
        estimatedDuration: '7-14 days'
      },
      {
        stepNumber: 2,
        title: 'Third-Party Pre-Shipment Inspection (TPIA)',
        description: 'Authorized third-party inspection agency witnesses final acceptance testing at overseas manufacturing facility.',
        responsibleParty: 'Overseas Factory / TPIA',
        estimatedDuration: '10-20 days'
      },
      {
        stepNumber: 3,
        title: 'Site Receipt Verification',
        description: 'BIS or designated authority conducts physical verification and reviews MTCs upon arrival at project site.',
        responsibleParty: 'BIS / Port Authority',
        estimatedDuration: '5-10 days'
      },
      {
        stepNumber: 4,
        title: 'Clearance Issuance',
        description: 'Issuance of Project Conformity Certificate permitting customs out-of-charge and site commissioning.',
        responsibleParty: 'BIS',
        estimatedDuration: '5-8 days'
      }
    ],
    requiredDocuments: [
      'Project Import License / Ministry EPC Recommendation',
      'International Standard Equivalence Documentation',
      'Factory Acceptance Test (FAT) witness records',
      'Third-Party Inspection Agency (TPIA) Certificate'
    ],
    feeStructureSummary: 'Application fee: ₹50,000; Site verification charges: ₹10,000 per man-day plus travel overheads.',
    surveillanceFrequency: 'Post-commissioning performance report submission within 6 months.',
    validityPeriod: 'Valid strictly for the duration of the project commissioning phase.',
    officialGuidelineUrl: 'https://www.bis.gov.in/product-certification/conformity-assessment-schemes/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_IX_ECO_MARK,
    name: 'Scheme IX — Eco-Mark (Environmentally Friendly Products)',
    code: 'SCHEME-IX-ECOMARK',
    description: 'Dual certification scheme granting an Eco-Mark label alongside the standard ISI mark to products fulfilling specific ecological safety criteria in addition to standard Indian Standards.',
    applicability: 'Manufacturers producing consumer goods engineered to minimize environmental footprint across life cycle (raw materials, production, use, and disposal).',
    applicableSectors: [
      'Paper & Pulp Packaging',
      'Paints, Enamels & Varnishes',
      'Detergents & Cleaning Chemicals',
      'Batteries & Electronic Components',
      'Wood Alternatives & Architectural Boards'
    ],
    mandatoryProductCategories: [
      'Lead-Free Architectural Paints',
      'Biodegradable Detergents',
      'Recycled Paper & Board Products',
      'Eco-Certified Dry Cell Batteries'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Dual Criteria Application',
        description: 'Apply under Scheme IX submitting proof of existing/simultaneous ISI certification alongside environmental threshold compliance.',
        responsibleParty: 'Applicant',
        estimatedDuration: '5-7 days'
      },
      {
        stepNumber: 2,
        title: 'Environmental Audit & Factory Assessment',
        description: 'Inspect plant to evaluate raw material sourcing, waste-water recycling (ETP), and absence of banned heavy metals/chlorofluorocarbons.',
        responsibleParty: 'BIS Audit Team',
        estimatedDuration: '2-4 days'
      },
      {
        stepNumber: 3,
        title: 'Ecological Parameter Testing',
        description: 'Independent testing in BIS/CPCB recognized labs for biodegradability, heavy metal leaching, VOC limits, and recyclability.',
        responsibleParty: 'Recognized Environmental Lab',
        estimatedDuration: '20-40 days'
      },
      {
        stepNumber: 4,
        title: 'Grant of Eco-Mark License',
        description: 'Awarding of license to use the combined \'Earthen Pot\' Eco-Mark logo alongside standard ISI marking.',
        responsibleParty: 'BIS',
        estimatedDuration: '10-15 days'
      }
    ],
    requiredDocuments: [
      'Consent to Establish (CTE) & Consent to Operate (CTO) from State Pollution Control Board',
      'Life-Cycle Assessment (LCA) data sheet',
      'Test reports confirming absence of banned toxic ingredients/heavy metals',
      'Recyclability and packaging degradation audit reports'
    ],
    feeStructureSummary: 'Application fee: ₹1,000; Marking fee: 20% surcharge over standard Scheme I annual marking fees.',
    surveillanceFrequency: 'Biannual factory visits and annual independent environmental testing.',
    validityPeriod: '1 to 2 Years; aligned with parent ISI license renewal.',
    officialGuidelineUrl: 'https://www.bis.gov.in/product-certification/eco-mark-scheme/'
  },
  {
    schemeType: CertificationSchemeType.SCHEME_X_FOREIGN_MANUFACTURERS,
    name: 'Scheme X — Foreign Manufacturers Certification Scheme (FMCS)',
    code: 'SCHEME-X-FMCS',
    description: 'Dedicated ISI certification pathway for overseas manufacturing units exporting goods to India under mandatory Quality Control Orders (QCOs).',
    applicability: 'Manufacturers located outside India wishing to sell goods bearing the ISI mark into the Indian domestic market.',
    applicableSectors: [
      'Overseas Chemical & Polymer Plants',
      'Automotive Parts & Assemblies Exporters',
      'International Steel & Wire Manufacturers',
      'Consumer Home Appliances'
    ],
    mandatoryProductCategories: [
      'Foreign Steel Wire Rods & Plates',
      'Imported Automotive Safety Glass',
      'Refrigerators & Air Conditioners',
      'Chemical Precursors (PVC, Phthalic Anhydride)'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Foreign Application & AIR Appointment',
        description: 'File application online and formally appoint an Authorized Indian Representative (AIR) under statutory power of attorney.',
        responsibleParty: 'Foreign Applicant / AIR',
        estimatedDuration: '7-14 days'
      },
      {
        stepNumber: 2,
        title: 'BIS Officer Overseas Audit',
        description: 'BIS delegation travels to the foreign manufacturing facility for physical factory audit and witness testing.',
        responsibleParty: 'BIS Delegation',
        estimatedDuration: '3-6 days'
      },
      {
        stepNumber: 3,
        title: 'Sample Dispatch to India',
        description: 'Drawn samples are counter-sealed and dispatched by the applicant to BIS-designated test labs inside India.',
        responsibleParty: 'Applicant / Indian Lab',
        estimatedDuration: '20-40 days'
      },
      {
        stepNumber: 4,
        title: 'Performance Bank Guarantee & Grant',
        description: 'Applicant submits USD 10,000 Performance Bank Guarantee (PBG), pays marking fees, and receives CM/L foreign license.',
        responsibleParty: 'Applicant / BIS',
        estimatedDuration: '15-25 days'
      }
    ],
    requiredDocuments: [
      'Authorized Indian Representative (AIR) formal agreement and nomination',
      'Overseas business license and government factory registration',
      'Plant layout, list of manufacturing machinery, and in-house laboratory calibration chart',
      'Performance Bank Guarantee (PBG) of USD 10,000 from an RBI-recognized bank'
    ],
    feeStructureSummary: 'Application fee: USD 1,000; Inspection fee: USD 7,000 per auditor plus international business-class airfare and lodging; Annual marking fees.',
    surveillanceFrequency: 'Annual factory surveillance audit and market surveillance draws within India.',
    validityPeriod: '1 to 2 Years; renewable up to 5 years.',
    officialGuidelineUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails'
  },
  {
    schemeType: CertificationSchemeType.MANAGEMENT_SYSTEMS_MSCS,
    name: 'Management Systems Certification Scheme (MSCS)',
    code: 'SCHEME-MSCS',
    description: 'Assessment and certification of organizations conforming to international and Indian management system standards across quality, environment, safety, and operational domains.',
    applicability: 'Enterprises, public entities, hospitals, laboratories, and industrial units seeking management system certification under accredited BIS frameworks.',
    applicableSectors: [
      'Manufacturing & Processing Industries',
      'Information Technology & Data Centers',
      'Healthcare & Food Processing',
      'Supply Chain & Logistics'
    ],
    mandatoryProductCategories: [
      'ISO 9001 (Quality Management Systems - QMS)',
      'ISO 14001 (Environmental Management Systems - EMS)',
      'ISO 22000 / FSMS (Food Safety Management Systems)',
      'ISO 45001 (Occupational Health and Safety - OHSMS)',
      'ISO/IEC 27001 (Information Security Management Systems - ISMS)',
      'ISO 50001 (Energy Management Systems - EnMS)'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'Application & Document Review',
        description: 'Submit system manual, internal audit reports, and management review records via the MSCS portal.',
        responsibleParty: 'Applicant',
        estimatedDuration: '7-10 days'
      },
      {
        stepNumber: 2,
        title: 'Stage 1 Audit (Adequacy Assessment)',
        description: 'BIS certification team verifies site readiness, policy documentation, and scope definitions.',
        responsibleParty: 'BIS Audit Team',
        estimatedDuration: '1-2 days'
      },
      {
        stepNumber: 3,
        title: 'Stage 2 Audit (On-Site Certification Audit)',
        description: 'Comprehensive evaluation of operational implementation, objective metrics, and non-conformity resolutions.',
        responsibleParty: 'BIS Audit Team',
        estimatedDuration: '2-5 days'
      },
      {
        stepNumber: 4,
        title: 'Grant of Management System Certificate',
        description: 'Approval by BIS Certification Advisory Committee and release of MSCS certificate.',
        responsibleParty: 'BIS',
        estimatedDuration: '10-15 days'
      }
    ],
    requiredDocuments: [
      'Apex Management System Manual and standard operating procedures',
      'Internal audit report covering all departmental processes',
      'Management Review Meeting (MRM) minutes',
      'Statutory and regulatory compliance registers (Factory Act, pollution permits)'
    ],
    feeStructureSummary: 'Application fee: ₹15,000; Audit fee: ₹7,000 per auditor-day; Annual license/surveillance fee: ₹25,000–₹50,000.',
    surveillanceFrequency: 'Annual surveillance audits (Surveillance 1 and Surveillance 2) across the 3-year cycle.',
    validityPeriod: '3 Years; renewable through full recertification audit.',
    officialGuidelineUrl: 'https://www.bis.gov.in/conformity-assessment/management-systems-certification/'
  },
  {
    schemeType: CertificationSchemeType.LABORATORY_RECOGNITION_LRS,
    name: 'Laboratory Recognition Scheme (LRS)',
    code: 'SCHEME-LRS',
    description: 'Rigorous appraisal and recognition of external commercial and government laboratories based on ISO/IEC 17025 to perform third-party testing for BIS product certification schemes.',
    applicability: 'Third-party testing laboratories, academic research institutions, and specialized testing facilities seeking BIS conformity assessment assignments.',
    applicableSectors: [
      'Physical & Mechanical Material Testing',
      'Chemical & Toxicology Analysis',
      'Electrical Safety & Electromagnetic Compatibility (EMC)',
      'Microbiology & Food Testing'
    ],
    mandatoryProductCategories: [
      'Electronic & IT Safety Testing Units',
      'Chemical & Toxic Metal Testing Laboratories',
      'Cement & Concrete Specimen Testing Stations',
      'Textile & Polymer Testing Facilities'
    ],
    keySteps: [
      {
        stepNumber: 1,
        title: 'LRS Application Submission',
        description: 'Apply on LRS portal with NABL accreditation scope, equipment calibration sheets, and staff competence files.',
        responsibleParty: 'Applicant Laboratory',
        estimatedDuration: '7-10 days'
      },
      {
        stepNumber: 2,
        title: 'On-Site Assessment',
        description: 'BIS technical officers audit laboratory testing benches, environmental controls, reference standards, and blind proficiency testing results.',
        responsibleParty: 'BIS Assessment Team',
        estimatedDuration: '2-4 days'
      },
      {
        stepNumber: 3,
        title: 'Proficiency & Inter-Lab Comparison Verification',
        description: 'Review of the laboratory\'s historical performance in National/International Proficiency Testing (PT) programs.',
        responsibleParty: 'BIS / Assessment Board',
        estimatedDuration: '10-20 days'
      },
      {
        stepNumber: 4,
        title: 'Grant of Recognition',
        description: 'Formal inclusion of the lab in the BIS Recognized Labs repository for designated test standards.',
        responsibleParty: 'BIS',
        estimatedDuration: '10-15 days'
      }
    ],
    requiredDocuments: [
      'Valid ISO/IEC 17025:2017 NABL Accreditation Certificate and approved scope',
      'Traceability certificates for all primary measuring standards/calibrators',
      'Proficiency Testing (PT) and Inter-Laboratory Comparison (ILC) reports',
      'Technical personnel resumes and authorized signatory authorization'
    ],
    feeStructureSummary: 'Application fee: ₹20,000; Assessment charges: ₹15,000 per auditor per day; Annual renewal fee: ₹20,000 per standard group.',
    surveillanceFrequency: 'Biannual desktop audit, annual blind sample testing checks, and reassessment every 3 years.',
    validityPeriod: '3 Years; synchronized with ISO/IEC 17025 NABL accreditation validity.',
    officialGuidelineUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/laboratory_recognition'
  }
];
