import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateGroupChatDto {
  @ApiProperty({
    description: 'Name of the group chat',
    example: 'Project Team',
  })
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @ApiProperty({
    description: 'Description of the group chat',
    example: 'Discussion for our project',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @ApiProperty({
    description: 'URL of group avatar',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Array of user IDs to add as members',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @Field(() => [String])
  memberIds: string[];
}
