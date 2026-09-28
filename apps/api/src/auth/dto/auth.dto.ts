import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator';
import { UserRole } from '@bis/shared-types';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsIn([
    UserRole.CONSUMER,
    UserRole.INDUSTRY,
    UserRole.STUDENT_RESEARCHER
  ])
  @IsOptional()
  role?: UserRole = UserRole.INDUSTRY;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  preferredLanguage?: string = 'en';
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}