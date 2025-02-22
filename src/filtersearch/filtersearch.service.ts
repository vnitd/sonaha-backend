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
      const skip = (page - 1) * limit; // cái này mặc định nên khỏi nói
      const take = limit; // này cũng z
      let resultByType :any;
      // Nếu không có 'filter' (type), lấy tất cả các type
      // có 1 lỗi ở đây, cái này bắt đầu lọc từ bảng type chứ kh phải là lọc từ bảng sản phẩm chính
      // nên nếu hông có gì nhập vô
      if (filter === null && khoanggia === null && province === null && district === null) {
        // Nếu không có điều kiện lọc nào, lấy tất cả dữ liệu
        resultByType = await this.prisma.properties.findMany();
    }else{ if (!filter) {
        resultByType = await this.prisma.type_properties.findMany({
          include: {
            properties: true,
          },
        });
      } else {
        resultByType = await this.prisma.type_properties.findMany({
          where: {
            typePropertiesName: filter as type_properties_typePropertiesName,
          },
          include: {
            properties: true,
          },
        });
      }
    }
      let resultProvince = resultByType;
      // Nếu có 'province', lọc theo tỉnh
      console.log(resultByType );
      
      if (province) {
        resultProvince = resultProvince.filter((item:any) => item.properties.province === province);
      }

      // Nếu có 'district', lọc theo quận
      if (district) {
        resultProvince = resultProvince.filter((item:any) => item.properties.district === district);
      }
      // test được cái tỉnh với distric với type rồi

      // Lọc theo khoảng giá
      let minPrice: number, maxPrice: number;
      if (Array.isArray(khoanggia)) {
        [minPrice, maxPrice] = khoanggia;
      } else if (khoanggia) {
        minPrice = khoanggia;
        maxPrice = khoanggia;
      } else {
        minPrice = 0; // Mặc định 0 nếu không có khoảng giá
        maxPrice = Number.MAX_SAFE_INTEGER; // Mặc định vô hạn nếu không có khoảng giá
      }

      const filteredResults = resultProvince.filter((item:any) => {
        const propertyPrice = item.properties.public_price;
        return propertyPrice >= minPrice && propertyPrice <= maxPrice;
      });

      const totalCount = filteredResults.length;
      const totalPages = Math.ceil(totalCount / limit);
      const paginatedResults = filteredResults.slice(skip, skip + take);

      return {
        paginatedResults,
        totalCount,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching data: ' + error.message);
    }
}

}
