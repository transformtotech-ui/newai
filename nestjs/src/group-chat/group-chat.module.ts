import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { GroupChatResolver } from './group-chat.resolver';
import { GroupChat } from './entities/group-chat.entity';
import { GroupMember } from './entities/group-member.entity';
import { Message } from '../chat/entities/message.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupChat, GroupMember, Message, User]),
  ],
  providers: [GroupChatService, GroupChatResolver],
  controllers: [GroupChatController],
  exports: [GroupChatService],
})
export class GroupChatModule {}
