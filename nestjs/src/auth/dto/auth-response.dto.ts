import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Field()
  accessToken: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    default: 'Bearer',
  })
  @Field()
  tokenType: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 604800,
  })
  @Field()
  expiresIn: number;

  @ApiProperty({
    description: 'Authenticated user information',
    type: User,
  })
  @Field(() => User)
  user: User;
}