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
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { userDto } from './dto/user.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClient } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudUploadService: CloudUploadService,
  ) {}
  prisma = new PrismaClient();

  @Post('/createNewUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/get-all-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [userDto] }) // Mô tả cấu trúc dữ liệu trả về
  async findAllUser(@Req() req, @Res() res: Response): Promise<any> {
    try {
      const userId = req.user.userId; // Lấy ID từ token
      const users = await this.userService.findAllUser(+userId);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  //
  @Get('/get-detail-user/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('/UpdateUser/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<any> {
    const userId = req.user.userId;
    if (file) {
      const uploadResult = await this.cloudUploadService.uploadImage(
        file,
        'avatars',
      );
      updateUserDto.avartar_url = uploadResult.secure_url;

      const currendUser = await this.prisma.users.findFirst({
        where: {
          user_id: Number(id),
        },
      });

      if (currendUser?.avartar_url) {
        const publicId = currendUser.avartar_url
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]
          .replace('%20', ' ');
        await this.cloudUploadService.deleteImage(publicId);
      }

      await this.userService.update(+id, updateUserDto, +userId);
      return res.status(200).json({ message: 'success' });
    }

    await this.userService.update(+id, updateUserDto, +userId);
    return res.status(200).json({ message: 'success' });
  }

  // check update xong qua đây
  @Delete('/deleteUser/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(
    @Param('id') id: number,
    @Req() req,
    @Res() res: Response,
  ): Promise<any> {
    const userId = req.user.userId;
    try {
      await this.userService.remove(+id, +userId);
      return res.status(200).json({ message: 'User deleted successfully' }); // Trả về phản hồi thành công
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error deleting user', error: error.message }); // Xử lý lỗi
    }
  }
  // chỗ update mình đang để kiểu string, nhớ làm chặt chẽ trong font-end
  @Patch('/updateUserByUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  async updatehehe(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const self = req.user.userId;
      const currentUser = await this.prisma.users.findFirst({
        where:{user_id:Number(self)}
      })
      if (file) {
        const uploadResult = await this.cloudUploadService.uploadImage(
          file,
          'avatars',
        );
        updateUserDto.avartar_url = uploadResult.secure_url;

        const currendUser = await this.prisma.users.findFirst({
          where: {
            user_id: Number(self),
          },
        });
        if (currendUser?.avartar_url) {
          const publicId = currendUser.avartar_url
            .split('/')
            .slice(-2)
            .join('/')
            .split('.')[0]
            .replace('%20', ' ');
          await this.cloudUploadService.deleteImage(publicId);
          console.log("hehe",publicId);
        }

      }
      else if(!file){
        updateUserDto.avartar_url = currentUser.avartar_url;
      }
      await this.userService.updateBySelf(+self, updateUserDto);
      return res.status(200).json({ message: 'success' });
    } catch (error) {
      throw new Error(error);
    }
  }
}
