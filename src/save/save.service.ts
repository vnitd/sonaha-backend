import { Injectable } from '@nestjs/common';
import { CreateSaveDto } from './dto/create-save.dto';
import { UpdateSaveDto } from './dto/update-save.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SaveService {
  prisma = new PrismaClient()
  async create(id: number, userId: number): Promise<string> {
    try {
      const checkUser = await this.prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
  
      if (!checkUser?.role_name) {
        throw new Error('Không xác thực');
      }
      const existingSave = await this.prisma.save.findFirst({
        where: {
          user_id: userId,
          property_id: id,
        },
      });
  
      if (existingSave) {
        return 'Mục đã tồn tại';
      }
      await this.prisma.save.create({
        data: {
          user_id: userId,
          property_id: id,
        },
      });
      return 'Save success';
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

  async findAll(userId: number) {
    try {
      const listSave = await this.prisma.save.findMany({
        where: { user_id: +userId },
        select: {
          properties: true, 
        },
      });
      if (!listSave || listSave.length === 0) {
        return 'No saved properties found';
      }
      return listSave;
    } catch (error) {
      console.error('Error fetching saved properties:', error); // Ghi log lỗi
      throw new Error('Failed to fetch saved properties'); // Trả về thông báo lỗi rõ ràng
    }
  }

  async remove(id: number, userId: number): Promise<string> {
    try {
      // Kiểm tra xem bản ghi có tồn tại không
      const existingSave = await this.prisma.save.findUnique({
        where: {
          user_id_property_id: {
            user_id: userId,
            property_id: id,
          },
        },
      });
  
      // Nếu không có bản ghi nào, ném lỗi
      if (!existingSave) {
        throw new Error('No matching save found to delete');
      }
  
      // Nếu có, thực hiện xóa
      await this.prisma.save.delete({
        where: {
          user_id_property_id: {
            user_id: userId,
            property_id: id,
          },
        },
      });
  
      return 'Save deleted successfully';
    } catch (error) {
      console.error('Error deleting save:', error);
      throw new Error(error.message || 'Failed to delete save');
    }
  }
  
  
}
