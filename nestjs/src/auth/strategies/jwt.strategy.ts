import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.log(`Validating JWT for user: ${payload.email}`);
    
    const user = await this.userService.findOne(payload.sub);
    
    if (!user) {
      this.logger.warn(`User not found for JWT payload: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      this.logger.warn(`Inactive user attempted access: ${payload.email}`);
      throw new UnauthorizedException('User account is inactive');
    }

    this.logger.log(`JWT validated successfully for user: ${user.email}`);
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
  }
}