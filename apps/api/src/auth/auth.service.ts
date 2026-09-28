import {
  Injectable,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import {
  AuthResponse,
  UserProfile,
  UserRole
} from '@bis/shared-types';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Administrator accounts cannot be created through public registration.
    if (dto.role === UserRole.ADMIN) {
      throw new UnauthorizedException(
        'Administrator accounts cannot be created through public registration'
      );
    }

    let user: any;

    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

      if (existing) {
        throw new ConflictException(
          'An account with this email address already exists'
        );
      }

      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          fullName: dto.fullName,
          role: dto.role || UserRole.INDUSTRY,
          organization: dto.organization,
          designation: dto.designation,
          preferredLanguage: dto.preferredLanguage || 'en'
        }
      });
    } catch (err: any) {
      if (err instanceof ConflictException) {
        throw err;
      }

      throw new Error('Unable to access the user database');
    }

    const tokens = this.generateTokens(user);

    return {
      user: this.formatUserProfile(user),
      tokens
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    let user: any;

    try {
      user = await this.prisma.user.findUnique({
        where: { email: dto.email }
      });
    } catch {
      throw new Error('Unable to access the user database');
    }

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password'
      );
    }

    // Verify password against the stored bcrypt hash.
    const isPasswordValid = await bcrypt
      .compare(dto.password, user.passwordHash)
      .catch(() => false);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid email or password'
      );
    }

    const tokens = this.generateTokens(user);

    return {
      user: this.formatUserProfile(user),
      tokens
    };
  }

  private generateTokens(user: any) {
    const jwtSecret =
      this.configService.get<string>('JWT_SECRET');

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');

    const accessExpiresIn =
      this.configService.get<string>('JWT_EXPIRES_IN');

    const refreshExpiresIn =
      this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN'
      );

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    if (!refreshSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not configured'
      );
    }

    if (!accessExpiresIn) {
      throw new Error(
        'JWT_EXPIRES_IN is not configured'
      );
    }

    if (!refreshExpiresIn) {
      throw new Error(
        'JWT_REFRESH_EXPIRES_IN is not configured'
      );
    }

    const payload = {
      sub: user.id || user.email,
      email: user.email,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: accessExpiresIn as any
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any
    });

    return {
      accessToken,
      refreshToken,

      // AuthResponse expects expiresIn in seconds.
      expiresIn:
        this.parseExpirationToSeconds(accessExpiresIn)
    };
  }

  private parseExpirationToSeconds(value: string): number {
    const match = value
      .trim()
      .match(/^(\d+)\s*(s|m|h|d|w)$/i);

    if (!match) {
      throw new Error(
        'JWT_EXPIRES_IN must use a valid duration such as 15m, 1h, 1d, or 7d'
      );
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
      w: 7 * 24 * 60 * 60
    };

    return amount * multipliers[unit];
  }

  private formatUserProfile(user: any): UserProfile {
    return {
      id: user.id || `user-${user.email}`,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organization: user.organization || undefined,
      designation: user.designation || undefined,
      preferredLanguage:
        user.preferredLanguage || 'en',
      createdAt:
        user.createdAt?.toString() ||
        new Date().toISOString(),
      updatedAt:
        user.updatedAt?.toString() ||
        new Date().toISOString()
    };
  }
}