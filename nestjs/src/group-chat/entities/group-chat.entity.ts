import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { GroupMember } from './group-member.entity';
import { Message } from '../../chat/entities/message.entity';

@Entity('group_chats')
@ObjectType()
export class GroupChat {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  avatarUrl?: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'creator_id' })
  @Field(() => User)
  creator: User;

  @Column({ name: 'creator_id' })
  creatorId: string;

  @OneToMany(() => GroupMember, (member) => member.groupChat, { cascade: true })
  @Field(() => [GroupMember])
  members: GroupMember[];

  @OneToMany(() => Message, (message) => message.groupChat)
  @Field(() => [Message], { nullable: true })
  messages: Message[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
