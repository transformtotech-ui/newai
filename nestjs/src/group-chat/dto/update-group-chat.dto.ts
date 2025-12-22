import { IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateGroupChatDto {
  @ApiProperty({
    description: 'Name of the group chat',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({
    description: 'Description of the group chat',
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
}
