import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';

class ContentItem {
  @ApiProperty()
    @IsString()
  title: string;
  
  @ApiProperty()
  @IsString()
  content: string;
}

export class CreateContentPropertyDto {
  @IsInt()
  property_id: number;

  @ApiHideProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentItem)
  contents: ContentItem[];
}


