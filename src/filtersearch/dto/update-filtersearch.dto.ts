import { PartialType } from '@nestjs/swagger';
import { CreateFiltersearchDto } from './create-filtersearch.dto';

export class UpdateFiltersearchDto extends PartialType(CreateFiltersearchDto) {}
