import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PropertyType } from './dto/create-filtersearch.dto';

@Injectable()
export class FiltersearchService {
  prisma = new PrismaClient();

  // Service to search properties_name by properties_type
  // Service method to search by name and province
  async searchPropertiesByNameAndProvince(name: string, province: string) {
    try {
      // Lấy danh sách tất cả các bất động sản theo tỉnh
      const Listprovince = await this.prisma.properties.findMany({
        where: {
          province, // Lọc theo tỉnh
        },
      });
  
      // Sau đó lọc theo tên
      const results = Listprovince.filter(property =>
        property.name.toLowerCase().includes(name.toLowerCase())
      );
  
      return results;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  

  // mới fix xong
  public getPagination(total: number, page: number, limit: number) {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async filterTheoType(type: string, page: number = 1, limit: number = 10) {
    try {
      if (!type) {
        throw new Error('Property type is required');
      }

      // Validate if 'type' is a valid enum value
      if (!Object.values(PropertyType).includes(type as PropertyType)) {
        throw new Error(`Invalid property type: ${type}`);
      }

      const skip = (page - 1) * limit;

      const [results, totalCount] = await Promise.all([
        this.prisma.properties.findMany({
          where: {
            type_properties: {
              some: {
                typePropertiesName: type as PropertyType, // Cast to enum
              },
            },
          },
          include: {
            type_properties: true,
          },
          skip,
          take: limit,
        }),
        this.prisma.properties.count({
          where: {
            type_properties: {
              some: {
                typePropertiesName: type as PropertyType, // Cast to enum
              },
            },
          },
        }),
      ]);

      return {
        data: results,
        pagination: this.getPagination(totalCount, page, limit),
      };
    } catch (error) {
      console.error('Error in filterTheoType:', error);
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
      console.log(error);
      throw new error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} filtersearch`;
  }
}
