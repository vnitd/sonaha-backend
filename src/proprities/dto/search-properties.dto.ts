import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Status } from './create-proprity.dto'; // Assuming you have Status enum imported

// src/search/dto/search.dto.ts
export class SearchDto {
  @ApiProperty({ required: false, description: 'Property name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Property province' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({ required: false, description: 'Property type ID' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  type_propertiesID?: number;

  @ApiProperty({
    required: false,
    description: 'Property status',
    enum: Status, // Assuming `Status` is an enum, e.g., available, sold, etc.
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({ required: false, description: 'Page number for pagination', default: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number) 
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Limit number for pagination', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) 
  @Max(100) // You can set a maximum limit for performance reasons
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Get all properties' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  all?: boolean;
}
