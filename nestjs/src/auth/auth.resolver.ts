import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { User } from '../user/entities/user.entity';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard)
  async refreshToken(@Context() context): Promise<AuthResponse> {
    return this.authService.refreshToken(context.req.user);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async profile(@Context() context): Promise<User> {
    return this.authService.getUserProfile(context.req.user.id);
  }
}