import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { ChatModule } from './chat/chat.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Winston Logger
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    }),

    // Database module
    DatabaseModule,

    // GraphQL module
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get('NODE_ENV') !== 'production',
        introspection: true,
        context: ({ req, res }) => ({ req, res }),
        formatError: (error) => {
          console.error('GraphQL Error:', error);
          return {
            message: error.message,
            code: error.extensions?.code,
            path: error.path,
          };
        },
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UserModule,
    CommonModule,
    ChatModule,
    GroupChatModule,
    PostModule,
  ],
})
export class AppModule {}