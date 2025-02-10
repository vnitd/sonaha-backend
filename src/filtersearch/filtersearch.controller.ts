import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FiltersearchService } from './filtersearch.service';
import { CreateFiltersearchDto } from './dto/create-filtersearch.dto';
import { UpdateFiltersearchDto } from './dto/update-filtersearch.dto';
import { Response } from 'express';

@Controller('filtersearch')
export class FiltersearchController {
  constructor(private readonly filtersearchService: FiltersearchService) {}

  @Get('/filterProperties')
  async getFilter(
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
      const results = await this.filtersearchService.filterPhanTrang(
        +page,
        +limit,
        search,
      );
      res.status(HttpStatus.OK).json(results);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filtersearchService.findOne(+id);
  }
}
