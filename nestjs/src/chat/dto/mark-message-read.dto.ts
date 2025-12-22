import { IsBoolean } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class MarkMessageReadDto {
  @ApiProperty({
    description: 'Mark message as read',
    example: true,
  })
  @IsBoolean()
  @Field()
  isRead: boolean;
}
