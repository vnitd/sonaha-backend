import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTypePropertiesDto } from './dto/create-type-properties.dto';
import { TypePropertiesService } from './type-properties.service';

@ApiTags('Type Properties') // Nhóm API
@Controller('type-properties')
export class TypePropertiesController {
  constructor(private readonly typePropertiesService: TypePropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo loại bất động sản mới' })
  @ApiResponse({ status: 201, description: 'Loại bất động sản được tạo thành công.' })
  create(@Body() createTypePropertiesDto: CreateTypePropertiesDto) {
    return this.typePropertiesService.create(createTypePropertiesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách loại bất động sản' })
  findAll() {
    return this.typePropertiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một loại bất động sản' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID của loại bất động sản' })
  findOne(@Param('id',ParseIntPipe) id: number) {
    
    return this.typePropertiesService.findOne(id);
  }
}
