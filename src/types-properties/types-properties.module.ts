import { Module } from '@nestjs/common';
import { TypesPropertiesService } from './types-properties.service';
import { TypesPropertiesController } from './types-properties.controller';

@Module({
  controllers: [TypesPropertiesController],
  providers: [TypesPropertiesService],
})
export class TypesPropertiesModule {}
