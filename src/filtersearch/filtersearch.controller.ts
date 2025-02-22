import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { FiltersearchService } from './filtersearch.service';
import { Response } from 'express';
@Controller('filtersearch')
export class FiltersearchController {
  constructor(private readonly filtersearchService: FiltersearchService) {}
// province truyền vô phải chuẩn ha
@Get('/searchFilterProvince')  // Single leading slash, no double slashes
async searchProperties(
  @Res() res,
  @Query('name') name: string,
  @Query('province') province: string,
) {
  try {
    const results = await this.filtersearchService.searchPropertiesByNameAndProvince(
      name, province
    );

    return res.status(200).json({
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}




  // phân trang theo kiểu, ở đây, be sẽ quy định số bản ghi mỗi trang
  @Get("/FilterPhanTrangTheoType")
  async getFuckFilter(
    @Query('type') type:string,
    @Query('page') page: number = 1,  // số trang đang đứng
    @Query('limit') limit: number = 10,  // số phần tử của 1 trang
    @Res() res:Response
  ):Promise<void>{

    try {
      const result = await this.filtersearchService.getFuckFilter(type,+page, +limit)
      res.status(HttpStatus.OK).json(result)
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error})
    }
  }

  @Get('filterTinhThanhTypeKhoangGia')
async getFilteredProperties(
  @Query('type') type: string | null, // Loại bất động sản có thể không có
  @Query('province') province: string | null, // Tỉnh có thể không có
  @Query('district') district: string | null, // Quận có thể không có
  @Query('page') page: number = 1, // Phân trang
  @Query('limit') limit: number = 12, // Số lượng trang
  @Query('price') price: string | null, // Khoảng giá có thể không có
) {
  try {
    // Kiểm tra nếu không có 'type' thì lấy tất cả các type
    if (!type) {
      type = ''; // Cập nhật để lấy tất cả các loại
    }
    let khoanggia: number | [number, number] | null = null;
    if (price) {
      const priceRange = price.split('-');
      if (priceRange.length === 2) {
        khoanggia = [parseInt(priceRange[0]), parseInt(priceRange[1])];
      } else {
        khoanggia = parseInt(priceRange[0]);
      }
    }

    console.log(type);
    console.log(province);
    console.log(khoanggia);
    console.log(district);

    // Gọi service để lấy kết quả lọc
    const result = await this.filtersearchService.FilterTheoProvinceTypeKhoangGia(
      type, 
      province, 
      page, 
      limit, 
      khoanggia, 
      district
    );

    return {
      statusCode: 200,
      data: result,
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Internal server error',
    };
  }
}


}

