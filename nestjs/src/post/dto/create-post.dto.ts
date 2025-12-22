import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Post category', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ description: 'Is post published', default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ description: 'Author user ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
