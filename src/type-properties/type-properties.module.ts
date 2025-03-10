import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TypePropertiesController } from './type-properties.controller';
import { TypePropertiesService } from './type-properties.service';

@Module({
  controllers: [TypePropertiesController],
  providers: [TypePropertiesService, PrismaService],
})
export class TypePropertiesModule {}
