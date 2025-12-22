import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://admin:SXtJSHUrtvkOLPbExEolOeMZEUBfGvRi@dpg-d54nnaggjchc7381i9rg-a.virginia-postgres.render.com/nestjstestdb',
      entities: [User],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        max: 5,
        connectionTimeoutMillis: 10000,
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
