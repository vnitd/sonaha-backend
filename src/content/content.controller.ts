import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { ContentService } from './content.service';
import { ContentDto } from './dto/content.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly propertyService: ContentService,
    private readonly cloudUploadService: CloudUploadService,
  ) {}

  @Post('/contentProperty')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiConsumes('multipart/form-data')
@UseInterceptors(FilesInterceptor('img'))
async create(
  @Body() body: any,
  @UploadedFiles() files: Array<Express.Multer.File> = [],
  @Res() res: Response,
  @Req() req,
): Promise<any> {
  try {
    console.log('body', body);

    let contents: any[] = [];
    // Trường hợp body.contents là mảng JSON
    if (Array.isArray(body.contents)) {
      contents = body.contents.map((content: any) => ({
        property_id: +body.propertyId,
        title: content.title,
        content: content.content,
      }));
    } else {
      // Trường hợp field riêng lẻ contents[*][*]
      Object.keys(body).forEach((key) => {
        const match = key.match(/contents\[(\d+)\]\[(title|content)\]/i);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          if (!contents[index]) contents[index] = { property_id: +body.propertyId };
          contents[index][field] = body[key];
        }
      });
    }

    console.log('contents', contents);

    if (contents.length === 0) {
      throw new BadRequestException('At least one content item is required');
    }

    if (files && files.length > 0) {
      const uploadResult = await this.cloudUploadService.uploadMultipleImages(
        files,
        'thumbnail',
      );

      const imageUrls = uploadResult.map((result) => {
        if (!result.secure_url) {
          throw new BadRequestException('Each uploaded file must have a secure_url');
        }
        return result.secure_url;
      });

      imageUrls.forEach((url, index) => {
        if (contents[index]) {
          contents[index].imagecontent_url = url;
        }
      });
    }

    contents.forEach((content) => {
      if (!content.imagecontent_url) {
        content.imagecontent_url = '';
      }
    });

    const contentDto: ContentDto = { contents };
    const checkAdmin = req.user.userId;
    const result = await this.propertyService.create(+checkAdmin, contentDto);

    return res.status(HttpStatus.CREATED).json({
      message: 'Content property created successfully',
      data: result,
    });
  } catch (error) {
    return res
      .status(error.getStatus ? error.getStatus() : HttpStatus.BAD_REQUEST)
      .json({
        message: error.message || 'Lỗi khi tạo property',
      });
  }
}}