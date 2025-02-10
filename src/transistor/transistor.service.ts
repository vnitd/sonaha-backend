import { Injectable } from '@nestjs/common';
import { CreateTransistorDto } from './dto/create-transistor.dto';
import { UpdateTransistorDto } from './dto/update-transistor.dto';
import { PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetAllTras } from './dto/get-all.dto';
import { error } from 'console';

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
  // transaction 
  async update(updateTransistorDto: UpdateTransistorDto, transId: number, userId: number) {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
  
      if (
        checkAdmin.role_name === 'admin' ||
        checkAdmin.role_name === 'manager' ||
        checkAdmin.role_name === 'moderator'
      ) {
        // Cập nhật trạng thái giao dịch
        await this.prisma.transactions.update({
          where: {
            inquiry_id: Number(transId),
          },
          data: {
            status: updateTransistorDto.status,
          },
        });
  
        const transaction = await this.prisma.transactions.findFirst({
          where: {
            inquiry_id: Number(transId),
          },
        });
  
        // Nếu trạng thái là "completed", cập nhật bảng properties và daily_transactions_stats
        if (updateTransistorDto.status === 'completed') {
          // Cập nhật trạng thái của property thành 'sold'
          await this.prisma.properties.update({
            where: {
              property_id: transaction.property_id,
            },
            data: {
              status: 'sold',
            },
          });
  
          // Lấy ngày hiện tại
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split('T')[0]; // yyyy-MM-dd
  
          // Lấy thông tin property
          const trans = await this.prisma.properties.findFirst({
            where: {
              property_id: transaction.property_id,
            },
          });
  
          // Kiểm tra xem bản ghi trong daily_transactions_stats đã tồn tại hay chưa
          const existingStats = await this.prisma.daily_transactions_stats.findUnique({
            where: {
              transaction_date: new Date(formattedDate),
            },
          });
  
          if (!existingStats) {
            // Nếu chưa tồn tại, tạo mới
            await this.prisma.daily_transactions_stats.create({
              data: {
                transaction_date: new Date(formattedDate),
                transaction_total_perday: 1,
                total_revenue_perday: trans.price_difference || 0,
              },
            });
          } else {
            // Nếu đã tồn tại, không cập nhật nữa
            throw new Error(`Stats for date ${formattedDate} already exist, skipping update.`)
          }
        }
      }
  
      return 'Update successful';
    } catch (error) {
      return error.message;
    }
  }
  
}
