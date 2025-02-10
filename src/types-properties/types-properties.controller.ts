import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypesPropertiesService } from './types-properties.service';
import { CreateTypesPropertyDto } from './dto/create-types-property.dto';
import { UpdateTypesPropertyDto } from './dto/update-types-property.dto';

@Controller('types-properties')
export class TypesPropertiesController {
  constructor(private readonly typesPropertiesService: TypesPropertiesService) {}

  @Post()
  create(@Body() createTypesPropertyDto: CreateTypesPropertyDto) {
    return this.typesPropertiesService.create(createTypesPropertyDto);
  }

  @Get()
  findAll() {
    return this.typesPropertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesPropertiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypesPropertyDto: UpdateTypesPropertyDto) {
    return this.typesPropertiesService.update(+id, updateTypesPropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesPropertiesService.remove(+id);
  }
}
