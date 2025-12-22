import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how are you?',
  })
  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;

  @ApiProperty({
    description: 'URL of attachment if any',
    example: 'https://example.com/file.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  attachmentUrl?: string;

  @ApiProperty({
    description: 'ID of the conversation (for one-on-one chat)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  conversationId?: string;

  @ApiProperty({
    description: 'ID of the group chat',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  groupChatId?: string;
}
