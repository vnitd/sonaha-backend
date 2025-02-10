import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { userDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt'
import { CloudUploadService } from 'src/shared/cloudUpload.service';
@Injectable()
export class UserService {
  constructor(
    private readonly cloudUploadService :CloudUploadService
  ){}
  prisma = new PrismaClient()
  // á cái này chưa có tạo user
  
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAllUser(id: number): Promise<userDto[]> {
    // Tìm user để kiểm tra quyền
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: Number(id) },
    });

    if (!checkAdmin) {
      throw new NotFoundException('User không tồn tại');
    }

    if (
      checkAdmin.role_name === 'admin' ||
      checkAdmin.role_name === 'moderator' ||
      checkAdmin.role_name === 'employee'
    ) {
      const users = await this.prisma.users.findMany();
      return plainToInstance(userDto, users); // Trả về mảng DTO
    }

    throw new UnauthorizedException('Không có quyền truy cập');
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  // check lại phần này ha
  async update(id: number, updateUserDto: UpdateUserDto, idUser: number) {
    try {
      
      const checkAdmin = await this.prisma.users.findFirst({
        where: { user_id: Number(idUser) },
      });
       const check = await this.prisma.users.findFirst({
        where: { user_id: id },
      });
  
      if (!check) {
        throw new Error('User không tồn tại');
      }
  
      if (check.role_name === 'admin') {
        throw new Error('Không thể sửa admin');
      }
  
      // Kiểm tra quyền của user
      if (
        checkAdmin.role_name === 'admin' ||
        checkAdmin.role_name === 'moderator' ||
        checkAdmin.role_name === 'employee'
      ) {
        // Lấy thông tin user hiện tại
        const currentUser = await this.prisma.users.findFirst({
          where: { user_id: id },
        });
  
        // Lấy dữ liệu từ DTO, nếu không có giá trị thì giữ nguyên giá trị cũ
        const {
          full_name = currentUser.name,
          email = currentUser.email,
          phone_number = currentUser.phone,
          password,
          avartar_url = currentUser.avartar_url,
        } = updateUserDto;
  
        const hashedPassword = password
          ? await bcrypt.hash(password, 10)
          : currentUser.password;
  

        await this.prisma.users.update({
          where: { user_id: id },
          data: {
            name: full_name,
            email,
            phone: phone_number,
            password: hashedPassword,
            avartar_url,
          },
        });
  
        return 'Update Thành Công';
      }
  
      return 'Bạn không có quyền thực hiện thao tác này!';
    } catch (error) {
      throw new Error(error.message || 'Đã xảy ra lỗi khi cập nhật');
    }
  }
  
  // check lại chỗ này vì nó có liên quan đến bảng trans, nên xóa sẽ có lỗi
  async remove(id: number, userId: number) {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: { user_id: Number(userId) },
      });
  
      if (checkAdmin.role_name === 'employee' || checkAdmin.role_name === 'user') {
        throw new Error('Employee và user không có quyền động tới user');
      }

      const check = await this.prisma.users.findFirst({
        where: { user_id: id },
      });
  
      if (!check) {
        throw new Error('User không tồn tại');
      }
  
      if (check.role_name === 'admin') {
        throw new Error('Không thể xóa admin');
      }
  
      const saves = await this.prisma.save.findMany({
        where: { user_id: id },
      });
  
      if (saves.length > 0) {
        await this.prisma.save.deleteMany({
          where: { user_id: id },
        });
      }
      // xóa user trong trans 
      const trans = await this.prisma.transactions.findMany({
        where: { moderator_id: id },
      });
  
      if (trans.length > 0) {
        await this.prisma.transactions.deleteMany({
          where: { moderator_id: id },
        });
      }
      //
      const comments = await this.prisma.comments.findMany({
        where: { user_id: id },
      });
      if (comments.length > 0) {
        const publicId = check.avartar_url.split('/').slice(-2).join('/').split('.')[0].replace('%20', ' ')
        await this.cloudUploadService.deleteImage(publicId)
        
        await this.prisma.comments.deleteMany({
          where: { user_id: id },
        });
      }
      
      if(check?.avartar_url){
          const checkImg = check.avartar_url.split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]
          .replace('%20', ' ');
          await this.cloudUploadService.deleteImage(checkImg)
      }      
      await this.prisma.users.delete({
        where: { user_id: id },
      });
  
      return 'Xóa user thành công';
    } catch (error) {
      throw new Error(error.message); 
    }
  }
  // update myself
  async updateBySelf(id: number, updateUserDto: UpdateUserDto): Promise<string> {
    try {
      const currentUser = await this.prisma.users.findFirst({
        where: { user_id: id },
      });
  
      if (!currentUser) {
        throw new Error('User không tồn tại');
      }
  
      const { full_name, email, phone_number, password, img,avartar_url } = updateUserDto;
  
      const updatedData: any = {
        name: full_name || currentUser.name,
        email: email || currentUser.email,
        phone: phone_number || currentUser.phone,
        avartar_url,  // Giữ nguyên URL cũ nếu không có ảnh mới
      };
  
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }
      
      // chỗ này có vấn đề
      if (img) {
        updatedData.avartar_url = avartar_url;
      }
  
      await this.prisma.users.update({
        where: { user_id: id },
        data: updatedData,
      });
  
      return 'Update thành công';
    } catch (error) {
      throw new Error(error.message || 'Có lỗi xảy ra khi cập nhật');
    }
  }
  // chưa có create
  
  
  
}
