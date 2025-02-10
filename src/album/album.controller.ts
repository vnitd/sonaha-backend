import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UploadedFiles,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, createVideoDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly cloudUploadService: CloudUploadService,
  ) {}

  @Post('/createImgList/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('img'))
  async create(
    @Param('id') id: number,
    @Body() createAlbumDto: CreateAlbumDto,
    @Req() req,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    const userId = req.user.userId;
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      const uploadResult = await this.cloudUploadService.uploadMultipleImages(
        files,
        'albumproperties',
      );
      const imageUrls = uploadResult.map((result) => {
        if (!result.secure_url) {
          throw new BadRequestException(
            'Each uploaded file must have a secure_url',
          );
        }
        return result.secure_url;
      });
      createAlbumDto.imageUrls = imageUrls
      // chỗ này
      await this.albumService.createImg(createAlbumDto, +id, +userId);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Album created successfully' });
    } catch (error) {
      console.error('Error in createNewAlbum:', error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  @Post('/createVideo/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video'))
  async createVideo(
    @Param('id') id: number,
    @Body() createAlbumDto: createVideoDto, // đoạn này
    @Req() req,
    @Res() res: Response,
    @UploadedFile() video: Express.Multer.File,
  ):Promise<any>{
    const userId = req.user.userId;
    try {
      if (video) {
        const videoUploadResult = await this.cloudUploadService.uploadVideo(
          video,
          'albumproperties',
        );
        createAlbumDto.videoUrl = videoUploadResult.secure_url;
      }
   
      await this.albumService.createVideo(  createAlbumDto, +id, +userId);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Album created successfully' });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // xóa từng cái, vừa img vừa video
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: number,
  @Req() req,
  @Res() res:Response,
):Promise<void>{
  try {
    const userId = req.user.userId
    const resutl = await this.albumService.removeAll(+id,+userId)
    res.status(HttpStatus.OK).json(resutl)
  } catch (error) {
     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message})
  }
  }
}
