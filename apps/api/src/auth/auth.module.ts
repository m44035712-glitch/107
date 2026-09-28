import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
       const secret = config.get<string>('JWT_SECRET');
       const expiresIn = config.get<string>('JWT_EXPIRES_IN');

      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      if (!expiresIn) {
        throw new Error('JWT_EXPIRES_IN is not configured');
      }

    return {
      secret,
      signOptions: { expiresIn }
    };
  }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService, JwtStrategy, PassportModule]
})
export class AuthModule {}
