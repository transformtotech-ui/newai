import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';

/**
 * PostModule - Demonstrates raw SQL queries without Repository pattern
 * 
 * Key differences from typical NestJS modules:
 * 1. Post entity is imported for TypeORM schema generation
 * 2. PostService uses DataSource instead of @InjectRepository
 * 3. All database operations are done via raw SQL queries
 */
@Module({
  imports: [
    // Import entity for TypeORM to create the table schema
    // Even though we don't use Repository, TypeORM needs the entity definition
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
