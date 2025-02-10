import { PartialType } from '@nestjs/swagger';
import { CreateTypesPropertyDto } from './create-types-property.dto';

export class UpdateTypesPropertyDto extends PartialType(CreateTypesPropertyDto) {}
