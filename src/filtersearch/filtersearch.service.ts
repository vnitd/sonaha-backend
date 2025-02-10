import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FiltersearchService {
  prisma = new PrismaClient();

  // lỗi 
  async filterTheoType() {
    try {
      const results = await this.prisma.properties.findMany({
        include: {
          type_properties: true,
        },
      });
      return {
        data: results,
      };
    } catch (error) {
      console.log('Error in filterTheoType:', error);
      throw new Error(`Error while fetching properties: ${error.message}`);
    }
  }

  async filterTheoProvince(page: number, limit: number, province: string) {
    try {
      const skip = (page - 1) * limit;
      const results = await this.prisma.properties.findMany({
        where: {
          province: {
            contains: province, // Lọc theo tỉnh thành
          },
        },
        skip: skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      });

      const total = await this.prisma.properties.count({
        where: {
          province: {
            contains: province, // Lọc theo tỉnh thành
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
