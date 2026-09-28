import { UserRole } from '@bis/shared-types';

export const SEED_USERS = [
  {
    email: 'industry.msme@example.gov.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'Rajesh Sharma',
    role: UserRole.INDUSTRY,
    organization: 'Apex Stainless Steel & Metal Fab Pvt Ltd',
    designation: 'Director of Quality & Compliance',
    preferredLanguage: 'en'
  },
  {
    email: 'consumer@example.gov.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'Priya Iyer',
    role: UserRole.CONSUMER,
    organization: 'Consumer Voice Initiative',
    designation: 'Advocate & Consumer',
    preferredLanguage: 'hi'
  },
  {
    email: 'researcher@example.gov.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'Dr. Ananya Mukherjee',
    role: UserRole.STUDENT_RESEARCHER,
    organization: 'National Institute of Technology Materials Dept',
    designation: 'Senior Standards Researcher',
    preferredLanguage: 'en'
  },
  {
    email: 'admin.bis@example.gov.in',
    passwordHash: '$2a$10$w8T0MhNfR4p8z9D8S5WkAeA2Z6iY9jT0V7q1u2x3y4z5a6b7c8d9e',
    fullName: 'BIS System Administrator',
    role: UserRole.ADMIN,
    organization: 'Bureau of Indian Standards',
    designation: 'Standards Ingestion & QA Lead',
    preferredLanguage: 'en'
  }
];
