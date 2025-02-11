import { Injectable } from '@nestjs/common';
import { CreateTransistorDto } from './dto/create-transistor.dto';
import { UpdateTransistorDto } from './dto/update-transistor.dto';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetAllTras } from './dto/get-all.dto';

@Injectable()
export class TransistorService {
prisma = new PrismaClient()
// kiểu chỉ định ông nào làm dự án nào
 async create(createTransistorDto: CreateTransistorDto,userId:number) {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where:{
          user_id:userId
        }
      })
      if(checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager'){
        await this.prisma.transactions.create({
          data: {
            property_id: Number(createTransistorDto.property_id),
            moderator_id: Number(createTransistorDto.moderator_id),
            status: undefined,
          }
        });
        await this.prisma.notifications.create({
          data:{
            user_id:userId,
            title:'Bạn nhận được 1 dự án mới',
            status:'unread',
            message:'',
          }
        })
      }
      return 'Tạo thành công'
    } catch (error) {
      return error.message
    }  
  }
  
// tìm tất cả giao dịch
  async findAll(userId:number):Promise<GetAllTras[]>{
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where:{
          user_id : userId
        }
      })
      if(checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager'){
        const hehe = await this.prisma.transactions.findMany()
        return plainToInstance(GetAllTras,hehe) //
      }
    } catch (error) {
      return error.message
    }
  }


  // xóa tất cả giao dịch của người bán
  async remove(id: number, userId: number): Promise<string> {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
  
      if (!checkAdmin || (checkAdmin.role_name !== 'admin' && checkAdmin.role_name !== 'manager')) {
        throw new Error('Người dùng không có quyền thực hiện hành động này');
      }
  
      // Kiểm tra xem giao dịch có tồn tại hay không
      const transaction = await this.prisma.transactions.findFirst({
        where: {
          moderator_id: id,
        },
      });
      
      if (!transaction) {
        throw new Error('Không tìm thấy giao dịch cần xóa');
      }
      await this.prisma.transactions.deleteMany({
        where: {
          moderator_id: Number(id),
        },
      });
  
      return 'Xóa giao dịch thành công';
    } catch (error) {
      console.error(`Error removing transaction: ${error.message}`);
      return error.message;
    }
  }
  
  // transaction chuyển từ pending sang complete
  async updateTransistorDto(updateTransistorDto: UpdateTransistorDto, transId: number, userId: number) {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: { user_id: userId },
      });
  
      if (!['admin', 'manager', 'moderator'].includes(checkAdmin.role_name)) {
        throw new Error('Unauthorized access');
      }
  
      const transaction = await this.prisma.transactions.findFirst({
        where: { inquiry_id: Number(transId) },
      });
  
      if (!transaction) {
        throw new Error('Transaction not found');
      }
  
      const previousStatus = transaction.status;
      const newStatus = updateTransistorDto.status;
  
      const validStatuses = ['pending', 'completed', 'failed', 'canceled'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status value: ${newStatus}`);
      }
  
      await this.prisma.transactions.update({
        where: { inquiry_id: Number(transId) },
        data: { status: newStatus },
      });
  
      const property = await this.prisma.properties.findFirst({
        where: { property_id: transaction.property_id },
      });
  
      if (!property) {
        throw new Error('Property not found');
      }
  
      const currentDate = new Date().toISOString().split('T')[0];
  
      const dailyStats = await this.prisma.daily_transactions_stats.findUnique({
        where: { transaction_date: new Date(currentDate) },
      });
  
      if (previousStatus === 'pending' && newStatus === 'completed') {
        await this.prisma.properties.update({
          where: { property_id: transaction.property_id },
          data: { status: 'sold' },
        });
  
        if (!dailyStats) {
          await this.prisma.daily_transactions_stats.create({
            data: {
              transaction_date: new Date(currentDate),
              transaction_total_perday: 1,
              total_revenue_perday: property.price_difference || 0,
            },
          });
        } else {
          await this.prisma.daily_transactions_stats.update({
            where: { transaction_date: new Date(currentDate) },
            data: {
              transaction_total_perday: dailyStats.transaction_total_perday + 1,
              total_revenue_perday: dailyStats.total_revenue_perday + (property.price_difference || 0),
            },
          });
        }
      } else if (previousStatus === 'completed' && newStatus === 'pending') {
        if (dailyStats) {
          const updatedTransactions = Math.max(0, dailyStats.transaction_total_perday - 1);
          const updatedRevenue = Math.max(0, dailyStats.total_revenue_perday - (property.price_difference || 0));
  
          await this.prisma.daily_transactions_stats.update({
            where: { transaction_date: new Date(currentDate) },
            data: {
              transaction_total_perday: updatedTransactions,
              total_revenue_perday: updatedRevenue,
            },
          });
        }
  
        await this.prisma.properties.update({
          where: { property_id: transaction.property_id },
          data: { status: 'available' },
        });
      }
  
      return 'Update successful';
    } catch (error) {
      return error.message;
    }
  }
  
  
}
