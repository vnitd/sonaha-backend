import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('Banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly cloudUploadService: CloudUploadService
  ) {}

  @Post('/newBanner')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img')) // lấy tên từ dto
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req
  ): Promise<any> {
    if (file) {
      try {
        const { end_date } = createBannerDto;
        const parsedEndDate = new Date(end_date);
        if (isNaN(parsedEndDate.getTime())) {
          throw new BadRequestException('Ngày kết thúc không hợp lệ');
        }
        createBannerDto.end_date_hide = parsedEndDate; 
        const uploadResult = await this.cloudUploadService.uploadImage(file, 'Banner Image');
        createBannerDto.img_url = uploadResult.secure_url;
        const checkAdmin = req.user.userId
        await this.bannerService.create(createBannerDto,checkAdmin);
        return res.status(200).json({message:'oce'})
      } catch (error) {
        console.error(error);
        throw new BadRequestException('Lỗi trong quá trình xử lý');
      }
    } else {
      throw new BadRequestException('Ảnh không được để trống');
    }
  }

  @Get('/getAllBanner')
  async findAll(): Promise<any[]> {
    return await this.bannerService.findAllBanner();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  async update(@Param('id') id: number,
  @UploadedFile() file: Express.Multer.File,
   @Body() updateBannerDto: UpdateBannerDto,
   @Req() req,
   @Res() res:Response
):Promise<any> {
  if (file) {
    try {
      const uploadResult = await this.cloudUploadService.uploadImage(file, 'Banner Image');
      updateBannerDto.img_url = uploadResult.secure_url;
    
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Lỗi trong quá trình xử lý');
    }
  } else {
    const { end_date } = updateBannerDto;
    const parsedEndDate = new Date(end_date);
    if (isNaN(parsedEndDate.getTime())) {
      throw new BadRequestException('Ngày kết thúc không hợp lệ');
    }
    updateBannerDto.end_date_hide = parsedEndDate; 
    const checkAdmin = req.user.userId
    await this.bannerService.update(id,updateBannerDto,checkAdmin);
    return res.status(200).json({message:'oce'})
  } }

  @Delete('/deleteBanner/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Banner deleted successfully',
    type: String,
  })
  async remove(@Param('id') id: string,
  @Req() req,
  @Res() res:Response
) {
  const checkAmin = req.user.userId
     await this.bannerService.remove(+id,+checkAmin);
    return res.status(200).json({message:'delete success'})
  }
  // kiểm tra lại 
  @Get('check-expired')
  async checkExpiredBanners() {
    try {
      await this.bannerService.checkExpiredBanners();
      return { message: 'Expired banners have been checked and updated successfully.' };
    } catch (error) {
      return { message: 'Error while checking expired banners.', error: error.message };
    }
  }
}
