// import { BadRequestException, Body, Controller, NotFoundException, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
// import { Response } from 'express';
// import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
// import { PropertyService } from 'src/proprities/proprities.service'; // Thêm import
// import { CloudUploadService } from 'src/shared/cloudUpload.service';
// import { BannerService } from './banner.service';
// import { CreateBannerDto } from './dto/create-banner.dto';

// @Controller('Banner')
// export class BannerController {
//   constructor(
//     private readonly bannerService: BannerService,
//     private readonly cloudUploadService: CloudUploadService,
//     private readonly propertyService: PropertyService // Thêm service để lấy thông tin property
//   ) {}

//   @Post('/newBanner')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiConsumes('multipart/form-data')
//   @UseInterceptors(FileInterceptor('img')) // lấy tên từ DTO
//   async create(
//     @Body() createBannerDto: CreateBannerDto,
//     @UploadedFile() file: Express.Multer.File,
//     @Res() res: Response,
//     @Req() req
//   ): Promise<any> {
//     if (!file) {
//       throw new BadRequestException('Ảnh không được để trống');
//     }

//     try {
//       const { propertyID, end_date } = createBannerDto;

//       // Kiểm tra ngày kết thúc
//       const parsedEndDate = new Date(end_date);
//       if (isNaN(parsedEndDate.getTime())) {
//         throw new BadRequestException('Ngày kết thúc không hợp lệ');
//       }

//       // Kiểm tra property có tồn tại không
//       const property = await this.propertyService.findOne(propertyID);
//       if (!property) {
//         throw new NotFoundException('Không tìm thấy sản phẩm liên kết');
//       }

//       // Upload ảnh lên Cloudinary hoặc server
//       const uploadResult = await this.cloudUploadService.uploadImage(file, 'Banner Image');

//       const checkAdmin = req.user.userId;

//       // Tạo banner mới
//       const newBanner = await this.bannerService.create({
//         title: createBannerDto.title,
//         img_url: uploadResult.secure_url,
//         propertyID: createBannerDto.propertyID, // Chỉ lưu propertyId, không lưu dư thừa propertyDetail
//         end_date: createBannerDto.end_date,
//       }, checkAdmin);

//       return res.status(200).json({
//         message: 'Tạo banner thành công',
//         banner: newBanner,
//         property: property // Trả về luôn thông tin property để frontend hiển thị
//       });

//     } catch (error) {
//       console.error(error);
//       throw new BadRequestException('Lỗi trong quá trình xử lý');
//     }
//   }
// }
