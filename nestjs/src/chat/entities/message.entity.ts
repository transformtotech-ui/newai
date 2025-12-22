import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';
import { GroupChat } from '../../group-chat/entities/group-chat.entity';

@Entity('messages')
@ObjectType()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field()
  content: string;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  attachmentUrl?: string;

  @Column({ default: false })
  @Field()
  isRead: boolean;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  @Field(() => User)
  sender: User;

  @Column({ name: 'sender_id' })
  senderId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  @Field(() => Conversation, { nullable: true })
  conversation?: Conversation;

  @Column({ name: 'conversation_id', nullable: true })
  conversationId?: string;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.messages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_chat_id' })
  @Field(() => GroupChat, { nullable: true })
  groupChat?: GroupChat;

  @Column({ name: 'group_chat_id', nullable: true })
  groupChatId?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
