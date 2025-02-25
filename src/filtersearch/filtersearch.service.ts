import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  type_properties_typePropertiesName,
} from '@prisma/client';
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
      const results = Listprovince.filter((property) =>
        property.name.toLowerCase().includes(name.toLowerCase()),
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

  
  async getFuckFilter(
    filter: string,
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      // Validate the filter
      if (!(filter in type_properties_typePropertiesName)) {
        throw new Error(`Invalid filter value: ${filter}`);
      }

      // Calculate the pagination offset
      const skip = (page - 1) * limit;

      // Get filtered results with pagination
      const result = await this.prisma.type_properties.findMany({
        where: {
          typePropertiesName: filter as type_properties_typePropertiesName,
        },
        include: {
          properties: true,
        },
        skip, // Skip the items from previous pages
        take: limit, // Take the number of items for the current page
      });

      // Count the total number of items to calculate the total pages
      const totalCount = await this.prisma.type_properties.count({
        where: {
          typePropertiesName: filter as type_properties_typePropertiesName,
        },
      });

      const totalPages = Math.ceil(totalCount / limit);

      return {
        result,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // không có bất kì tham số nào thì lấy hết
  // cái này lọc cho tới quận huyện
  // không có tỉnh thì lấy hết theo những field khác, không co cótype thì lấy hết theo những fiels khác
  // trước hết tất cả dự án bds phải cho nó có đúng 1 cái type, để nó lấy ra theo bảng type
  async FilterTheoProvinceTypeKhoangGia(
    filter: string,
    province: string | null,
    page: number,
    limit: number,
    khoanggia: number | [number, number] | null,
    district: string | null
): Promise<any> {
    try {
      const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
      const skip = (page - 1) * parsedLimit;
      const take = parsedLimit;

        // Xây dựng điều kiện lọc
        const whereClause: any = {};

        // Lọc theo type
        if (filter) {
            whereClause.typePropertiesName = filter as type_properties_typePropertiesName;
        }

        // Lọc theo province và district
        if (province || district) {
            whereClause.properties = {};
            if (province) {
                whereClause.properties.province = province;
            }
            if (district) {
                whereClause.properties.district = district;
            }
        }

        // Lọc theo khoảng giá
        let minPrice: number = 0;
        let maxPrice: number = Number.MAX_SAFE_INTEGER;
        if (Array.isArray(khoanggia)) {
            [minPrice, maxPrice] = khoanggia;
        } else if (khoanggia) {
            minPrice = khoanggia;
            maxPrice = khoanggia;
        }
        whereClause.properties = {
            ...whereClause.properties,
            public_price: { gte: minPrice, lte: maxPrice }
        };

        // Truy vấn dữ liệu đã lọc và phân trang
        const [results, totalCount] = await Promise.all([
            this.prisma.type_properties.findMany({
                where: whereClause,
                include: { properties: true },
                skip: skip,
                take: take,
            }),
            this.prisma.type_properties.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            paginatedResults: results,
            totalCount,
            totalPages,
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data: ' + error.message);
    }
}

}
