import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
@ObjectType()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'conversation_participants',
    joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  @Field(() => [User])
  participants: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  @Field(() => [Message], { nullable: true })
  messages: Message[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
