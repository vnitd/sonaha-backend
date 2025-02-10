import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Upload multiple image files',
  })
  img: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ApiHideProperty()
  imageUrls: any[];


}
// video
export class createVideoDto{
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Upload a video file (optional)',
    required: false,
  })
  video: Express.Multer.File;

  @IsOptional()
  @ApiHideProperty()
  videoUrl: string;
}

