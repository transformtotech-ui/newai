import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

/**
 * PostService - Demonstrates direct SQL query execution without Repository pattern
 * 
 * Key Learning Points:
 * 1. Uses DataSource.query() for raw SQL queries
 * 2. Manual SQL construction for CRUD operations
 * 3. Direct database interaction without TypeORM Repository abstraction
 * 4. Parameterized queries to prevent SQL injection
 */
@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(private dataSource: DataSource) {}

  /**
   * Create a new post using raw SQL INSERT query
   * @param createPostDto - Post data
   * @returns Created post with generated ID
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    this.logger.log(`Creating post with title: ${createPostDto.title}`);

    try {
      // Raw SQL INSERT query with RETURNING clause to get the created post
      const query = `
        INSERT INTO posts (title, content, category, "isPublished", "authorId", "viewCount")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const values = [
        createPostDto.title,
        createPostDto.content,
        createPostDto.category || null,
        createPostDto.isPublished !== undefined ? createPostDto.isPublished : true,
        createPostDto.authorId,
        0, // Initial view count
      ];

      // Execute raw query - returns array of results
      const result = await this.dataSource.query(query, values);
      
      this.logger.log(`Post created successfully with ID: ${result[0].id}`);
      return result[0];
    } catch (error) {
      this.logger.error(`Error creating post: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  /**
   * Find all posts using raw SQL SELECT query
   * Includes author information via JOIN
   * @returns Array of posts with author details
   */
  async findAll(): Promise<Post[]> {
    this.logger.log('Fetching all posts');

    try {
      // Raw SQL SELECT with JOIN to include author information
      const query = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'email', u.email,
            'firstName', u."firstName",
            'lastName', u."lastName"
          ) as author
        FROM posts p
        LEFT JOIN users u ON p."authorId" = u.id
        ORDER BY p."createdAt" DESC
      `;

      const posts = await this.dataSource.query(query);
      
      this.logger.log(`Found ${posts.length} posts`);
      return posts;
    } catch (error) {
      this.logger.error(`Error fetching posts: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  /**
   * Find a single post by ID using raw SQL
   * @param id - Post UUID
   * @returns Post with author details
   */
  async findOne(id: string): Promise<Post> {
    this.logger.log(`Finding post with ID: ${id}`);

    try {
      // Raw SQL SELECT with parameterized query
      const query = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'email', u.email,
            'firstName', u."firstName",
            'lastName', u."lastName"
          ) as author
        FROM posts p
        LEFT JOIN users u ON p."authorId" = u.id
        WHERE p.id = $1
      `;

      const result = await this.dataSource.query(query, [id]);

      if (!result || result.length === 0) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return result[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding post: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find post');
    }
  }

  /**
   * Update a post using raw SQL UPDATE query
   * @param id - Post UUID
   * @param updatePostDto - Fields to update
   * @returns Updated post
   */
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    this.logger.log(`Updating post with ID: ${id}`);

    // First check if post exists
    await this.findOne(id);

    try {
      // Build dynamic UPDATE query based on provided fields
      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (updatePostDto.title !== undefined) {
        fields.push(`title = $${paramIndex++}`);
        values.push(updatePostDto.title);
      }
      if (updatePostDto.content !== undefined) {
        fields.push(`content = $${paramIndex++}`);
        values.push(updatePostDto.content);
      }
      if (updatePostDto.category !== undefined) {
        fields.push(`category = $${paramIndex++}`);
        values.push(updatePostDto.category);
      }
      if (updatePostDto.isPublished !== undefined) {
        fields.push(`"isPublished" = $${paramIndex++}`);
        values.push(updatePostDto.isPublished);
      }
      if (updatePostDto.viewCount !== undefined) {
        fields.push(`"viewCount" = $${paramIndex++}`);
        values.push(updatePostDto.viewCount);
      }

      // Always update the updatedAt timestamp
      fields.push(`"updatedAt" = CURRENT_TIMESTAMP`);

      if (fields.length === 1) {
        // Only updatedAt would be updated, return current post
        return this.findOne(id);
      }

      // Add the ID parameter
      values.push(id);

      const query = `
        UPDATE posts
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await this.dataSource.query(query, values);

      this.logger.log(`Post updated successfully with ID: ${id}`);
      return result[0];
    } catch (error) {
      this.logger.error(`Error updating post: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  /**
   * Delete a post using raw SQL DELETE query
   * @param id - Post UUID
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting post with ID: ${id}`);

    // First check if post exists
    await this.findOne(id);

    try {
      const query = `DELETE FROM posts WHERE id = $1`;
      await this.dataSource.query(query, [id]);

      this.logger.log(`Post deleted successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting post: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete post');
    }
  }

  /**
   * Increment view count using raw SQL UPDATE
   * Demonstrates atomic increment operation
   * @param id - Post UUID
   * @returns Updated post
   */
  async incrementViewCount(id: string): Promise<Post> {
    this.logger.log(`Incrementing view count for post ID: ${id}`);

    try {
      // Atomic increment using SQL
      const query = `
        UPDATE posts
        SET "viewCount" = "viewCount" + 1,
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;

      const result = await this.dataSource.query(query, [id]);

      if (!result || result.length === 0) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      this.logger.log(`View count incremented for post ID: ${id}`);
      return result[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error incrementing view count: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to increment view count');
    }
  }

  /**
   * Get posts by category using raw SQL with WHERE clause
   * @param category - Category name
   * @returns Posts in the category
   */
  async findByCategory(category: string): Promise<Post[]> {
    this.logger.log(`Finding posts in category: ${category}`);

    try {
      const query = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'email', u.email,
            'firstName', u."firstName",
            'lastName', u."lastName"
          ) as author
        FROM posts p
        LEFT JOIN users u ON p."authorId" = u.id
        WHERE p.category = $1
        ORDER BY p."createdAt" DESC
      `;

      const posts = await this.dataSource.query(query, [category]);

      this.logger.log(`Found ${posts.length} posts in category: ${category}`);
      return posts;
    } catch (error) {
      this.logger.error(`Error finding posts by category: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to find posts by category');
    }
  }

  /**
   * Get post statistics using raw SQL aggregation
   * Demonstrates COUNT, SUM, and AVG functions
   * @returns Statistics object
   */
  async getStatistics(): Promise<any> {
    this.logger.log('Fetching post statistics');

    try {
      const query = `
        SELECT 
          COUNT(*) as "totalPosts",
          COUNT(CASE WHEN "isPublished" = true THEN 1 END) as "publishedPosts",
          COUNT(CASE WHEN "isPublished" = false THEN 1 END) as "draftPosts",
          COALESCE(SUM("viewCount"), 0) as "totalViews",
          COALESCE(AVG("viewCount"), 0) as "averageViews"
        FROM posts
      `;

      const result = await this.dataSource.query(query);

      this.logger.log('Statistics fetched successfully');
      return result[0];
    } catch (error) {
      this.logger.error(`Error fetching statistics: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch statistics');
    }
  }
}
