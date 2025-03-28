import {
  Body,
  Controller,
  Delete, Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { CreatePropertyDto } from './dto/create-proprity.dto';
import { SearchDto } from './dto/search-properties.dto';
import { UpdatePropertyDto } from './dto/update-proprity.dto';
import { PropertyService } from './proprities.service';

@ApiTags('Proprities')
@Controller('proprities')
export class PropritiesController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly cloudUploadService: CloudUploadService,
  ) {}
  

  @Get('/banner')
  async findBanner() {
    try {
      return this.propertyService.findBanner();
    } catch (error) {
      console.log(error)
    }
  }

  @Get('/AllBanner')
  async findallbanner() {
    try {
      return this.propertyService.findAllBanners();
    } catch (error) {
      console.log(error)
    }
  }

  @Get('/trash')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTrashedProperties(@Req() req) {
      return this.propertyService.getTrashedProperties(req.user.userId);
      
  }

  @Post('/createProprity')
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
        const result = await this.propertyService.create(
          +checkAdmin,
          createProprityDto,
        );

        return res.status(HttpStatus.CREATED).json({ id: result });
      } catch (error) {
        return res
          .status(error.getStatus ? error.getStatus() : HttpStatus.BAD_REQUEST)
          .json({
            message: error.message || 'Lỗi khi tạo property',
          });
      }
    }
  }

  @ApiOperation({ summary: 'Get all properties with search filters' })
  @ApiResponse({
    status: 200,
    description: 'List of properties found based on the search criteria', // You should replace this with the actual type of property response
  })
  @Get()
  async findAll(@Query() query: SearchDto) {
    if (query.all) {
      return this.propertyService.findAllnoQuery();
    }
    return this.propertyService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const detailProperty = await this.propertyService.findOne(+id);
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
     @Param('id') id: string, // Thay number thành string vì route params mặc định là string
     @Body() updatePropertyDto: UpdatePropertyDto,
     @Req() req,
     @Res() res: Response,
     @UploadedFile() file: Express.Multer.File,
   ): Promise<void> {
     // Thay Promise<string> thành Promise<void> vì không return string trực tiếp
     try {
       const userId = req.user.userId; // Lấy userId từ JWT
       const propertyId = Number(id); // Chuyển id từ string sang number
 
       // Kiểm tra xem property có tồn tại không
      
 
       // Xử lý upload ảnh nếu có file
       if (file) {
         const uploadResult = await this.cloudUploadService.uploadImage(
           file,
           'thumbnail',
         );
         updatePropertyDto.thumbnail_url = uploadResult.secure_url;
 
         // Xóa ảnh cũ nếu tồn tại
        //  if (currentProperty.thumbnail_url) {
        //    const urlParts = currentProperty.thumbnail_url.split('/');
        //    const publicId = urlParts.slice(-2).join('/').split('.')[0];
        //    await this.cloudUploadService.deleteImage(publicId);
        //  }
       }
 
       // Gọi service để cập nhật property
       const updatedPropertyId = await this.propertyService.update(
         userId, // userId trước
         propertyId, // propertyId sau
         updatePropertyDto,
       );
 
       // Trả về response thành công
       res.status(200).json({
         message: 'Update success',
         propertyId: updatedPropertyId,
       });
     } catch (error) {
       res.status(500).json({ message: error.message });
       return;
     }
   }
  // ===============================================================================================
  // tắt banner
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('banners/:id/disable')
  async disableBanner(
    @Param('id')
    id: number,
    @Req() req,
  ) {
    return this.propertyService.disableBanner(Number(id),req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('banners/:id/enable')
  async enableBanner(
    @Param('id')
    id: number,
    @Req() req,
  ) {
    return this.propertyService.enableBanner(Number(id) , req.user.userId);
  }

//  ====================================================================================================

  // Di chuyển tài sản vào thùng rác
  @Patch('/move-to-trash/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async moveToTrash(
    @Param('id') id: string,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const propertyId = Number(id);

      const movedPropertyId = await this.propertyService.moveToTrash(
        userId,
        propertyId,
      );

      res.status(200).json({
        message: 'Moved to trash successfully',
        propertyId: movedPropertyId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }

  // Khôi phục tài sản từ thùng rác
  @Patch('/restore-from-trash/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async restoreFromTrash(
    @Param('id') id: string,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const propertyId = Number(id);

      const restoredPropertyId = await this.propertyService.restoreFromTrash(
        userId,
        propertyId,
      );

      res.status(200).json({
        message: 'Restored from trash successfully',
        propertyId: restoredPropertyId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }

  // Xóa vĩnh viễn tài sản
  @Delete('/delete-permanently/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePermanently(
    @Param('id') id: string,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const propertyId = Number(id);

      await this.propertyService.deletePermanently(userId, propertyId);

      res.status(200).json({
        message: 'Deleted permanently successfully',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
}
