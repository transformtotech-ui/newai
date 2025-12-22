import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus,
  Query,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts (Raw SQL Queries)')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new post',
    description: 'Creates a post using raw SQL INSERT query instead of TypeORM Repository'
  })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all posts',
    description: 'Retrieves all posts using raw SQL SELECT with JOIN for author information'
  })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  findAll() {
    return this.postService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ 
    summary: 'Get post statistics',
    description: 'Retrieves aggregated statistics using raw SQL COUNT, SUM, and AVG functions'
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStatistics() {
    return this.postService.getStatistics();
  }

  @Get('category/:category')
  @ApiOperation({ 
    summary: 'Get posts by category',
    description: 'Retrieves posts filtered by category using raw SQL WHERE clause'
  })
  @ApiParam({ name: 'category', description: 'Category name' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  findByCategory(@Param('category') category: string) {
    return this.postService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a post by ID',
    description: 'Retrieves a single post using raw SQL SELECT with parameterized query'
  })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a post',
    description: 'Updates a post using raw SQL UPDATE query with dynamic field building'
  })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePostDto: UpdatePostDto
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Patch(':id/increment-views')
  @ApiOperation({ 
    summary: 'Increment post view count',
    description: 'Atomically increments the view count using raw SQL UPDATE'
  })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'View count incremented successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  incrementViews(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.incrementViewCount(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete a post',
    description: 'Deletes a post using raw SQL DELETE query'
  })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 204, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.remove(id);
  }
}
