import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { GroupChat } from './group-chat.entity';

export enum GroupMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

registerEnumType(GroupMemberRole, {
  name: 'GroupMemberRole',
  description: 'Role of a member in a group chat',
});

@Entity('group_members')
@ObjectType()
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_chat_id' })
  @Field(() => GroupChat)
  groupChat: GroupChat;

  @Column({ name: 'group_chat_id' })
  groupChatId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: GroupMemberRole,
    default: GroupMemberRole.MEMBER,
  })
  @Field(() => GroupMemberRole)
  role: GroupMemberRole;

  @CreateDateColumn()
  @Field()
  joinedAt: Date;
}
