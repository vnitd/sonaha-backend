import { Injectable } from '@nestjs/common';
import { CreateFiltersearchDto } from './dto/create-filtersearch.dto';
import { UpdateFiltersearchDto } from './dto/update-filtersearch.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FiltersearchService {
  prisma = new PrismaClient();

  // search theo tỉnh, ý là có thể tối ưu được chỗ này nhma đag lười
  async filterPhanTrang(page: number, limit: number, search: string) {
    try {
      const skip = (page - 1) * limit;
      const results = await this.prisma.properties.findMany({
        where: {
          name: {
            contains: search, // Tìm kiếm chuỗi chứa giá trị 'search'
          },          
        },
        skip: skip, // Bắt đầu từ bản ghi ở vị trí offset
        take: limit, // Giới hạn số lượng bản ghi trả về
        orderBy: {
          created_at: 'desc', // Sắp xếp theo ngày tạo (hoặc bạn có thể thay đổi trường khác)
        },
      });

      const total = await this.prisma.properties.count({
        where: {
          name: {
            contains: search,
          },
        },
      });
      return {
        total,
        page,
        limit,
        data: results,
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} filtersearch`;
  }
}
