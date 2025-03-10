import { Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendMailDto } from './dto/sendMail.dto';
import { LoginFacebookDto } from './dto/loginface.dto';
import { PrismaClient } from '@prisma/client';
import { createTokenAsyncKey } from 'src/utils/token.utils';
import { JwtAuthGuard } from './stratergy/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudUploadService: CloudUploadService
  ) {}

  @Post("/login")
  async Login(
    @Body() body: LoginDto,
    @Res() res: Response,
  ): Promise<Response<string>> {
    const result = await this.authService.Login(body);
    return res.status(200).json({ result });
  }

  // register
  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  @ApiBody({
    type: RegisterDto,
  })
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    if (file) {
      try {
        const uploadResult = await this.cloudUploadService.uploadImage(file, 'avatars');
        registerDto.avartar_url = uploadResult.secure_url;
      } catch (error) {
        return res.status(500).json(error.message);
      }
    }
    const newUser = await this.authService.Register(registerDto);
    return res.status(200).json(newUser);
  }

  // resetpass
  @Post('/send_mail_reset_token')
  async sendMail(
    @Body() body: SendMailDto,
    @Res() res: Response
  ): Promise<Response<any>> {
    await this.authService.sendResetKey(body.email);
    return res.status(200).json({ message: 'Đã gửi token, check mail để nhận token' });
  }


@Get("/detail")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async self(
  @Req() req,
  @Res() res: Response
): Promise<Response<any>> {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }
    const result = await this.authService.self(+userId);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({...result, password: undefined, access_token: undefined, refresh_token: undefined});
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}


@Post('reset_pass')
async resetPass(@Body() payload: { password: string; reset_token: string }) {
    try {
        // Kiểm tra đầu vào
        if (!payload.password || !payload.reset_token) {
            return {
                statusCode: 400,
                message: 'mật khẩu hoặc reset token không đúng',
            };
        }

        // Gọi service để xử lý
        const result = await this.authService.resetPass(payload.password, payload.reset_token);
        return {
            statusCode: 200,
            message: result,
        };
    } catch (error) {
        console.error('Error in resetPass:', error.message || error);
        return {
            statusCode: 500,
            message: error.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu',
        };
    }
}

  
  // login FaceBook;
  @Post('/loginFacebook')
  async LoginFacebook(
    @Body() body: LoginFacebookDto,
    @Res() res: Response
  ): Promise<Response<string>> {
    await this.authService.LoginFacebook(body.id, body.email, body.full_name, body.avartar_url);
    return res.status(200).json({ message: 'Đăng nhập thành công' });
  }

  prisma = new PrismaClient();

  @Get("/checkToken")
async checkToken(
  @Req() req: Request,
  @Res() res: Response,
  @Query('token') token: string, 
): Promise<Response<any>> {
  try {
   const userRole =  await this.authService.checkToken(token);  
    return res.status(200).json({ role: userRole});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ role: null });
  }
}


  @Post('/extend-token')
  async extendToken(@Req() req: Request, @Res() res: Response) {
    try {
      // Truy cập refresh token từ cookies
      const refreshToken = req.cookies.refreshToken;

      // Kiểm tra nếu không có refresh token
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
      }

      // Tìm user với refresh token
      const user = await this.prisma.users.findFirst({
        where: { refresh_token: refreshToken },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      // Tạo Access Token mới (ví dụ sử dụng một hàm tạo token)
      const newAccessToken =  createTokenAsyncKey({ user_id: user.user_id });

      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  
}
