import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { KeyService } from 'src/proprities/key/key.service';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { EmailDto } from './stratergy/email.stratergy.dto';
import { sendMailDto } from './dto/sendMail.dto';
import { promises } from 'dns';
@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private keyService: KeyService,
    private cloudUploadService: CloudUploadService,
    private emailService: EmailService,
  ) {}

  // login với register nằm ở đây
  async Login(body: loginDto): Promise<string> {
    try {
      const { email, password } = body;
      const checkUserAdmin = await this.prisma.users.findFirst({
        where: { email },
      });

      if (!checkUserAdmin) {
        throw new Error('không có trong hệ thống');
      }

      const checkPass = await bcrypt.compare(password, checkUserAdmin.password);
      if (!checkPass) {
        throw new Error('sai password');
      }

      const token = this.jwtService.sign(
        { data: { userId: checkUserAdmin.user_id } },
        {
          expiresIn: '7d',
          secret: this.keyService.getPrivateKey(),
          algorithm: 'RS256',
        },
      );

      const refToken = this.jwtService.sign(
        { data: { userId: checkUserAdmin.user_id } },
        {
          expiresIn: '7d',
          secret: this.keyService.getRefTokenPrivateKey(),
          algorithm: 'RS256',
        },
      );

      await this.prisma.users.update({
        where: { user_id: checkUserAdmin.user_id },
        data: { refresh_token: refToken, access_token: token },
      });

      return token;
    } catch (error) {
      throw new Error(error);
    }
  }

  async Register(body: registerDto): Promise<string> {
    try {
      const { email, password, phone, name, avartar_url } = body;

      // Kiểm tra xem email đã tồn tại trong hệ thống chưa
      const existingUser = await this.prisma.users.findFirst({
        where: { email },
      });

      if (existingUser) {
        throw new Error('Email đã được đăng ký');
      }
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      // Tạo người dùng mới
      const newUser = await this.prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          phone,
          name,
          avartar_url, // Lưu URL ảnh đại diện
          role_name: 'user', // Gán role mặc định là user
        },
      });

      return 'Đăng ký thành công';
    } catch (error) {
      // Trả về thông báo lỗi chi tiết
      throw new Error(error);
    }
  }
  async sendResetKey(email: string): Promise<any> {
    try {
      const checkUser = await this.prisma.users.findFirst({
        where: {
          email: email, // Sử dụng email từ tham số
        },
      });

      if (!checkUser) {
        throw new Error('User not found');
      }

      const resetKey = uuidv4().slice(0, 7);
      await this.prisma.users.update({
        where: { email: email },
        data: { reset_token: resetKey },
      });

      await this.emailService.sendMail(
        checkUser.email,
        `Dear ${checkUser.name}`,
        `Here is your reset token: ${resetKey}`,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  async resetPass(newPass: string, resetToken: string): Promise<string> {
    try {
        // Kiểm tra đầu vào
        if (!newPass || !resetToken) {
            throw new Error('Thiếu thông tin mật khẩu mới hoặc reset token');
        }

        // Tìm người dùng có reset_token khớp
        const checkUser = await this.prisma.users.findFirst({
            where: {
                reset_token: resetToken,
            },
        });

        if (!checkUser) {
            throw new Error('Reset token không hợp lệ hoặc đã hết hạn');
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPass, 10);

        // Cập nhật mật khẩu và xóa reset_token
        await this.prisma.users.update({
            where: { user_id: checkUser.user_id },
            data: {
                password: hashedPassword,
                reset_token: null, // Reset token bị vô hiệu hóa sau khi sử dụng
            },
        });

        return 'Mật khẩu đã được cập nhật thành công';
    } catch (error) {
        console.error('Error in resetPass:', error.message || error);
        throw new Error('Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.');
    }
}

  
  // 
  async LoginFacebook(
    id: string,
    email: string,
    full_name: string,
    avatar_url: string,
  ): Promise<string> {
    try {
      // Kiểm tra xem người dùng đã tồn tại trong hệ thống chưa
      let checkUser = await this.prisma.users.findFirst({
        where: { email },
      });

      // Nếu người dùng chưa tồn tại, tạo mới người dùng
      if (!checkUser) {
        checkUser = await this.prisma.users.create({
          data: {
            face_id: id,
            email,
            password: uuidv4(),
            name: full_name,
            role_name: 'user', // Gán role mặc định là user
            avartar_url: avatar_url,
          },
        });
      }

      await this.prisma.users.update({
        where: { email },
        data: { face_id: id },
      });

      // Tạo token JWT cho người dùng
      const token = this.jwtService.sign(
        { data: { userId: checkUser.user_id } },
        {
          expiresIn: '7d',
          secret: this.keyService.getPrivateKey(),
          algorithm: 'RS256',
        },
      );

      // Cập nhật lại refresh token nếu cần thiết
      const refToken = this.jwtService.sign(
        { data: { userId: checkUser.user_id } },
        {
          expiresIn: '7d',
          secret: this.keyService.getRefTokenPrivateKey(),
          algorithm: 'RS256',
        },
      );

      await this.prisma.users.update({
        where: { user_id: checkUser.user_id },
        data: { refresh_token: refToken, access_token: token },
      });

      return token;
    } catch (error) {
      throw new Error('Lỗi đăng nhập qua Facebook: ' + error.message);
    }
  }
  async self(userId:number){
    const checkAdmin = await this.prisma.users.findFirst({
      where:{
        user_id:userId
      }
    })
    if(checkAdmin.role_name){
      return checkAdmin
    }
  }
 
}
