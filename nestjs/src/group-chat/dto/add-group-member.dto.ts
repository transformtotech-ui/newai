import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GroupMemberRole } from '../entities/group-member.entity';

@InputType()
export class AddGroupMemberDto {
  @ApiProperty({
    description: 'ID of the user to add to the group',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  @Field()
  userId: string;

  @ApiProperty({
    description: 'Role of the member in the group',
    enum: GroupMemberRole,
    default: GroupMemberRole.MEMBER,
    required: false,
  })
  @IsOptional()
  @IsEnum(GroupMemberRole)
  @Field(() => GroupMemberRole, { nullable: true })
  role?: GroupMemberRole;
}
