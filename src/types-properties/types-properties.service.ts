import { Injectable } from '@nestjs/common';
import { CreateTypesPropertyDto } from './dto/create-types-property.dto';
import { UpdateTypesPropertyDto } from './dto/update-types-property.dto';

@Injectable()
export class TypesPropertiesService {
  create(createTypesPropertyDto: CreateTypesPropertyDto) {
    return 'This action adds a new typesProperty';
  }

  findAll() {
    return `This action returns all typesProperties`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typesProperty`;
  }

  update(id: number, updateTypesPropertyDto: UpdateTypesPropertyDto) {
    return `This action updates a #${id} typesProperty`;
  }

  remove(id: number) {
    return `This action removes a #${id} typesProperty`;
  }
}
