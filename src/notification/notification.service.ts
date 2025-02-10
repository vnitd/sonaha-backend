import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NotificationService {
prisma = new PrismaClient()
  async hehe(id: number) {
    try {
      const result = await this.prisma.notifications.findMany({
        where:{
          user_id:id
        }
      })
      return result
    } catch (error) {
        throw new Error(error)
    }
  }

// chỗ nào xài cái update thì đắp vô
  async update(userId: number,id:number) {
    try {
      const result = await this.prisma.notifications.update({
        where: { user_id: userId,notification_id:id }, 
        data: { status: 'read' },     
      });
      return result; 
    } catch (error) {
      console.log(error);
      throw new Error(`Error updating notifications: ${error.message}`);
    }
  }
  

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
