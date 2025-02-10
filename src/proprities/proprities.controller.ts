import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { PropritiesService } from './proprities.service';
import { CreatePropertyDto } from './dto/create-proprity.dto';
import { UpdateProprityDto } from './dto/update-proprity.dto';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GetAllPropertiesDto } from './dto/getall-proprities.dto';
import { SearchDto } from './dto/search-properties.dto';
import { getBannerDto } from 'src/banner/dto/get-banner.dto';
import { PrismaClient } from '@prisma/client';
@Controller('proprities')
export class PropritiesController {
  constructor(
    private readonly propritiesService: PropritiesService,
    private readonly cloudUploadService: CloudUploadService,
  ) {}
  prisma = new PrismaClient();
  @Post('/createProprityDto')
  // role thì chắc là để admin với manager tạo
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() createProprityDto: CreatePropertyDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req,
  ): Promise<any> {
    if (file) {
      try {
        const uploadResult = await this.cloudUploadService.uploadImage(
          file,
          'thumbnail',
        );
        createProprityDto.thumbnail_url = uploadResult.secure_url;

        const checkAdmin = req.user.userId;
        await this.propritiesService.create(+checkAdmin, createProprityDto);

        return res.status(200).json({ message: 'create success' }); // Trả về thông điệp thành công
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  // sẽ có 2 phương thức là getall và getDetail
  // ví dụ như get all là lấy hết thì get detail nó sẽ nhả ra save-user với moderator-name chẳng hạn
  // cái này cần xác thực, kiểu moderator hoặc manager hoặc admin sẽ lấy ra được chẳng hạn
  @Get()
  async findAll(@Res() res: Response): Promise<any> {
    try {
      const listProperties = await this.propritiesService.findAll();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');

      if (listProperties.length === 0) {
        res.status(404).json({ message: 'No properties found' });
      } else {
        res.status(200).json(listProperties);
      }
      return listProperties; 
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
      throw new Error(error.message);
    }
  }

  @Get('/getAllProprities')
  async PhanTrang(
    // GET /proprities/getAllProprities?page=2&limit=5
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const data = await this.propritiesService.findAllWithPagination(
        +page,
        +limit,
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
      throw new Error(error.message);
    }
  }

  @Get('/search')
  async search(@Query() query: SearchDto) {
    return this.propritiesService.search(query.keyword);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const detailProperty = await this.propritiesService.findOne(+id);
      return res.status(HttpStatus.OK).json({ detailProperty });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  // update
  @Patch('/update-property/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: number,
    @Body() updateProprityDto: UpdateProprityDto,
    @Req() req,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    try {
      const userId = req.user.userId;
      const currentProperty = await this.prisma.properties.findFirst({
        where: { property_id: Number(id) },
      });
      if (!currentProperty) {
        res.status(404).send({ message: 'Property not found' });
        return;
      }
      if (file) {
        const uploadResult = await this.cloudUploadService.uploadImage(
          file,
          'thumbnail',
        );
        updateProprityDto.thumbnail_url = uploadResult.secure_url;
        if (currentProperty.thumbnail_url) {
          const urlParts = currentProperty.thumbnail_url.split('/');
          const publicId = urlParts.slice(-2).join('/').split('.')[0];
          await this.cloudUploadService.deleteImage(publicId);
        }
      }
      await this.propritiesService.updateProperty(
        +id,
        +userId,
        updateProprityDto,
      );
      res.status(200).send({ message: 'Update success' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  // xóa properties, kiêm luôn xóa ảnh/ video trong cloud
  @Delete('/deleteProperties/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() req,
  ): Promise<any> {
    try {
      const userId = req.user.userId;
      await this.propritiesService.remove(+userId, +id);
      return res.status(200).json({ message: 'Delete success' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
