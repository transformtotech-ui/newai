import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'securePassword123',
    minLength: 6,
  })
  @Field()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password must be less than 50 characters' })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @Field()
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(30, { message: 'First name must be less than 30 characters' })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @Field()
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(30, { message: 'Last name must be less than 30 characters' })
  lastName: string;

  @ApiProperty({
    description: 'User phone number (optional)',
    example: '+1234567890',
    required: false,
  })
  @Field({ nullable: true })
  @IsOptional()
  // @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  phoneNumber?: string;
}