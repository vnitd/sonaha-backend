import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ContentItemDto {
  @ApiProperty({ description: 'ID của property' })
  @IsNotEmpty({ message: 'Phải có dự án' })
  @IsInt()
  @Type(() => Number)
  property_id: number;

  @ApiProperty({ description: 'Tiêu đề của content' })
  @IsNotEmpty({ message: 'Phải có tên Content' })
  title: string;

  @ApiProperty({ description: 'Nội dung của content' })
  @IsNotEmpty({ message: 'Phải có Content dự án' })
  content: string;

  @ApiProperty({ description: 'URL ảnh sau khi upload', required: false })
  @IsOptional()
  imagecontent_url?: string;
}

export class ContentDto {
  @ApiProperty({ type: [ContentItemDto], description: 'Mảng các content' })
  @IsArray()
  @Type(() => ContentItemDto)
  contents: ContentItemDto[];
}