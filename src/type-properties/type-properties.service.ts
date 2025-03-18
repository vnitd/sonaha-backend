import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTypePropertiesDto } from './dto/create-type-properties.dto';
import { UpdateTypePropertiesDto } from './dto/update-type-properties.dto';

@Injectable()
export class TypePropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTypePropertiesDto) {
    return this.prisma.type_properties.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.type_properties.findMany({
    });
  }

  async findOne(id: number) {
    const typeProperty = await this.prisma.type_properties.findUnique({
      where: { typePropertiesId: id },
      include: { properties: true },
    });

    if (!typeProperty) {
      throw new NotFoundException('TypeProperty not found');
    }

    return typeProperty;
  }

  async update(id: number, dto: UpdateTypePropertiesDto) {
    return this.prisma.type_properties.update({
      where: { typePropertiesId: id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.type_properties.delete({
      where: { typePropertiesId: id },
    });
  }
}
