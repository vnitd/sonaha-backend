import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FiltersearchService } from './filtersearch.service';
import { Response } from 'express';

@Controller('filtersearch')
export class FiltersearchController {
  constructor(private readonly filtersearchService: FiltersearchService) {}
// lỗi đây 
  @Get('/filterTypes')
  async getFilterTypes(@Res() res: Response) {
    try {
      const data = await this.filtersearchService.filterTheoType();

      // Trả kết quả về dưới dạng JSON
      return res.status(200).json({
        data: data.data,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  @Get('/filterProperties')
  async getFilterProvince(
    // trang mặc định là 1, limit là 10
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string,
    @Res() res: Response,
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
