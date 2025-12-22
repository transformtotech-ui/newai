import { IsNotEmpty, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateConversationDto {
  @ApiProperty({
    description: 'ID of the user to start conversation with',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  @Field()
  participantId: string;
}
