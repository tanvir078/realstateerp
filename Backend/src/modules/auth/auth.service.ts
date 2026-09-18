import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuditService } from '../audit/audit.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash, randomUUID } from 'node:crypto';
import { RefreshSession } from './entities/refresh-session.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
    @InjectRepository(RefreshSession) private refreshSessions: Repository<RefreshSession>,
  ) {}

  async login(user: any) {
    await this.auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: 'LOGIN',
      module: 'AUTH',
      details: { role: user.role },
    });
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const tokenId = randomUUID();
    const refreshToken = this.jwtService.sign({ ...payload, jti: tokenId }, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d',
    });
    await this.refreshSessions.save(this.refreshSessions.create({
      userId: user.id,
      tokenId,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: this.getRefreshExpiry(),
    }));

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto, actor?: { id: string; role: UserRole }) {
    const existingUserCount = await this.usersService.count();
    if (existingUserCount > 0 && actor?.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Administrator authentication is required to create users');
    }
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create({
      ...registerDto,
      role: existingUserCount === 0 ? UserRole.ADMIN : registerDto.role,
    });
    await this.auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: 'REGISTER',
      module: 'AUTH',
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; jti?: string }>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      if (!payload.jti) throw new UnauthorizedException('Invalid refresh token');
      const session = await this.refreshSessions.findOne({ where: { tokenId: payload.jti, tokenHash: this.hashToken(refreshToken) } });
      if (!session || session.revokedAt || session.expiresAt <= new Date()) throw new UnauthorizedException('Refresh token has been revoked');
      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      const newTokenId = randomUUID();
      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign({ ...newPayload, jti: newTokenId }, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d',
      });
      session.revokedAt = new Date();
      session.replacedByTokenId = newTokenId;
      await this.refreshSessions.save(session);
      await this.refreshSessions.save(this.refreshSessions.create({
        userId: user.id,
        tokenId: newTokenId,
        tokenHash: this.hashToken(newRefreshToken),
        expiresAt: this.getRefreshExpiry(),
      }));

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(user: any, refreshToken?: string) {
    if (refreshToken) {
      const payload = this.jwtService.decode<{ jti?: string }>(refreshToken);
      if (payload?.jti) {
        await this.refreshSessions.update({ tokenId: payload.jti, userId: user.id, revokedAt: undefined }, { revokedAt: new Date() });
      }
    } else {
      await this.refreshSessions.update({ userId: user.id, revokedAt: undefined }, { revokedAt: new Date() });
    }
    await this.auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: 'LOGOUT',
      module: 'AUTH',
    });
    return {
      message: 'Logged out successfully',
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private getRefreshExpiry() {
    const configured = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
    const match = configured.match(/^(\d+)([dhm])$/);
    const durationMs = match
      ? Number(match[1]) * ({ d: 86400000, h: 3600000, m: 60000 } as Record<string, number>)[match[2]]
      : 30 * 86400000;
    return new Date(Date.now() + durationMs);
  }

  async getProfile(user: any) {
    const userProfile = await this.usersService.findById(user.sub);
    if (!userProfile) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      role: userProfile.role,
      createdAt: userProfile.createdAt,
    };
  }
}
