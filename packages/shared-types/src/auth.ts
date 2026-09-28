import { UserRole } from './enums';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization?: string;
  designation?: string;
  phoneNumber?: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
