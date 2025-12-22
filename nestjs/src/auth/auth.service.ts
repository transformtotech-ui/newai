import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log(`Validating user: ${email}`);
    
    const user = await this.userService.findByEmailWithPassword(email);
    
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      return null;
    }

    if (!user.isActive) {
      this.logger.warn(`Inactive user attempted login: ${email}`);
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      return null;
    }

    // Remove password from the returned user object
    const { password: _, ...result } = user;
    this.logger.log(`User validation successful: ${email}`);
    
    return result;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.getTokenExpirationTime();

    this.logger.log(`Login successful for: ${loginDto.email}`);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    this.logger.log(`Registration attempt for: ${registerDto.email}`);
    
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    
    if (existingUser) {
      this.logger.warn(`Registration failed - user already exists: ${registerDto.email}`);
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Create new user
      const newUser = await this.userService.create(registerDto);
      
      // Generate JWT token
      const payload = { email: newUser.email, sub: newUser.id };
      const accessToken = this.jwtService.sign(payload);
      const expiresIn = this.getTokenExpirationTime();

      this.logger.log(`Registration successful for: ${registerDto.email}`);

      return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn,
        user: newUser,
      };
    } catch (error) {
      this.logger.error(`Registration error for ${registerDto.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async refreshToken(user: any): Promise<AuthResponse> {
    this.logger.log(`Token refresh for: ${user.email}`);
    
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.getTokenExpirationTime();

    // Get fresh user data
    const freshUser = await this.userService.findOne(user.id);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: freshUser,
    };
  }

  private getTokenExpirationTime(): number {
    const expiresIn = this.configService.get('JWT_EXPIRES_IN') || '7d';
    
    // Convert to seconds
    if (typeof expiresIn === 'string') {
      const unit = expiresIn.slice(-1);
      const value = parseInt(expiresIn.slice(0, -1));
      
      switch (unit) {
        case 'd':
          return value * 24 * 60 * 60;
        case 'h':
          return value * 60 * 60;
        case 'm':
          return value * 60;
        case 's':
          return value;
        default:
          return 7 * 24 * 60 * 60; // Default 7 days
      }
    }
    
    return typeof expiresIn === 'number' ? expiresIn : 7 * 24 * 60 * 60;
  }

  async getUserProfile(userId: string): Promise<User> {
    this.logger.log(`Getting profile for user ID: ${userId}`);
    return this.userService.findOne(userId);
  }
}