import { PartialType } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(30, { message: 'First name must be less than 30 characters' })
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(30, { message: 'Last name must be less than 30 characters' })
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
}