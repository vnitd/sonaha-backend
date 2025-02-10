import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class StatsService {

  prisma = new PrismaClient()
  async findAll(userId: number) {
    try {
      // Kiểm tra quyền của user
      const checkAdmin = await this.prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
  
      if (!checkAdmin) {
        throw new Error('User không tồn tại');
      }
  
      if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
        // Lấy danh sách daily_transactions_stats
        const list = await this.prisma.daily_transactions_stats.findMany();
        return list; 
      } else {
        throw new Error('Unauthorized: Bạn không có quyền truy cập danh sách này');
      }
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách: ${error.message}`);
    }
  }
  async delete(userId:number,id:number){
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
  
      if (!checkAdmin) {
        throw new Error('User không tồn tại');
      }
  
      if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
        // Lấy danh sách daily_transactions_stats
        await this.prisma.daily_transactions_stats.delete({
          where:{
            stat_id:Number(id)
          }
        });
        return 'Delete success'; 
      } else {
        throw new Error('Unauthorized: Bạn không có quyền truy cập danh sách này');
      }
    } catch (error) {
      throw new Error(error)
    }
  }


}
