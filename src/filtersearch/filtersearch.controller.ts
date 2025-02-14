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


  // phân trang theo types 
  @Get('/filterTypes')
  async getFilterTypes(
    @Res() res,
    @Query('type') type :string ,
    @Query('page') page :number ,
    @Query('limit') limit :number,
  ) {
    try {
      const data = await this.filtersearchService.filterTheoType(
        type,
        Number(page),
        Number(limit),
      );

      return res.status(200).json({
        data: data.data,
        pagination: data.pagination,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  // phân trang theo province
  @Get('/filterPropertiesProvince')
  async getFilterProvince(
    // trang mặc định là 1, limit là 10
    @Query('Province') search: string,
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<void> {
    try {
      const queryConditions = {};
      if (search) {
        queryConditions['name'] = { $regex: search, $options: 'i' }; // tìm kiếm không phân biệt chữ hoa/thường
      }
      const results = await this.filtersearchService.filterTheoProvince(
        +page,
        +limit,
        search,
      );
      res.status(HttpStatus.OK).json(results);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
