export enum UserRole {
  CONSUMER = "CONSUMER",
  INDUSTRY = "INDUSTRY",
  STUDENT_RESEARCHER = "STUDENT_RESEARCHER",
  ADMIN = "ADMIN",
}

export enum StandardStatus {
  ACTIVE = "ACTIVE",
  UNDER_REVIEW = "UNDER_REVIEW",
  OUTDATED = "OUTDATED",
  WITHDRAWN = "WITHDRAWN",
  ARCHIVED = "ARCHIVED",
}

export enum CertificationSchemeType {
  SCHEME_I_ISI = 'SCHEME_I_ISI', // Product Certification (ISI Mark)
  SCHEME_II_CRS = 'SCHEME_II_CRS', // Compulsory Registration Scheme (Electronics/IT)
  SCHEME_III_COPC = 'SCHEME_III_COPC', // Certificate of Conformity for Batch/Lot Inspection
  SCHEME_IV_COPC_PROCESS = 'SCHEME_IV_COPC_PROCESS', // Certificate of Conformity for Continuous Processes
  SCHEME_IV_COC = 'SCHEME_IV_COC', // Certificate of Conformity
  SCHEME_V_MANAGEMENT_PROCESS = 'SCHEME_V_MANAGEMENT_PROCESS', // Quality Assurance and Process Certification
  SCHEME_VI_SUPPLIER_DECLARATION = 'SCHEME_VI_SUPPLIER_DECLARATION', // Supplier's Declaration of Conformity (SDoC)
  SCHEME_VII_PILOT_PRODUCTION = 'SCHEME_VII_PILOT_PRODUCTION', // Verification of Pilot Production & Pre-Market Testing
  SCHEME_VIII_CUSTOM_IMPORT = 'SCHEME_VIII_CUSTOM_IMPORT', // Project Import & Custom-Engineered Equipment Clearance
  SCHEME_IX_ECO_MARK = 'SCHEME_IX_ECO_MARK', // Eco-Mark (Environmentally Friendly Products)
  SCHEME_ECO_MARK = 'SCHEME_ECO_MARK', // Eco-Mark for environmentally friendly goods
  SCHEME_X_FOREIGN_MANUFACTURERS = 'SCHEME_X_FOREIGN_MANUFACTURERS', // Foreign Manufacturers Certification Scheme (FMCS)
  SCHEME_FMCS = 'SCHEME_FMCS', // Foreign Manufacturers Certification Scheme
  SCHEME_HALLMARK = 'SCHEME_HALLMARK', // Assaying and Hallmarking
  HALLMARKING = 'HALLMARKING', // Hallmarking
  MANAGEMENT_SYSTEMS_MSCS = 'MANAGEMENT_SYSTEMS_MSCS', // Management Systems Certification Scheme (MSCS)
  LABORATORY_RECOGNITION_LRS = 'LABORATORY_RECOGNITION_LRS' // Laboratory Recognition Scheme (LRS)
}

export enum ConfidenceLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum FeedbackType {
  HELPFUL = "HELPFUL",
  NOT_HELPFUL = "NOT_HELPFUL",
  REPORTED = "REPORTED",
}

export enum QueryIntent {
  FIND_STANDARD = "FIND_STANDARD",
  CERTIFICATION_GUIDANCE = "CERTIFICATION_GUIDANCE",
  TESTING_REQUIREMENTS = "TESTING_REQUIREMENTS",
  LABORATORY_LOOKUP = "LABORATORY_LOOKUP",
  HALLMARKING_VERIFICATION = "HALLMARKING_VERIFICATION",
  CONSUMER_ISI_CHECK = "CONSUMER_ISI_CHECK",
  CLAUSE_EXPLANATION = "CLAUSE_EXPLANATION",
  COMPARE_STANDARDS = "COMPARE_STANDARDS",
  COMPLIANCE_ROADMAP = "COMPLIANCE_ROADMAP",
  GENERAL_BIS_INFO = "GENERAL_BIS_INFO",
}

export enum IndianLanguage {
  EN = "en", // English
  HI = "hi", // Hindi
  BN = "bn", // Bengali
  TE = "te", // Telugu
  MR = "mr", // Marathi
  TA = "ta", // Tamil
  UR = "ur", // Urdu
  GU = "gu", // Gujarati
  KN = "kn", // Kannada
  OR = "or", // Odia
  ML = "ml", // Malayalam
  PA = "pa", // Punjabi
  AS = "as", // Assamese
  MAI = "mai", // Maithili
  SAN = "san", // Sanskrit
  KAS = "kas", // Kashmiri
  NEP = "nep", // Nepali
  KOK = "kok", // Konkani
  DOG = "dog", // Dogri
  MNI = "mni", // Manipuri
  BOD = "bod", // Bodo
  SAT = "sat", // Santali
  SD = "sd", // Sindhi
}
