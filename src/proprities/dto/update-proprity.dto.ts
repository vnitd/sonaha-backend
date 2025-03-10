import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

// Enum Status (giữ nguyên từ CreatePropertyDto)
export enum Status {
  AVAILABLE = 'available',
  SOLD = 'sold',
  PENDING = 'pending',
}

// Enum Direction (giữ nguyên từ CreatePropertyDto)
export enum Direction {
  North = 'North',
  Northeast = 'Northeast',
  East = 'East',
  Southeast = 'Southeast',
  South = 'South',
  Southwest = 'Southwest',
  West = 'West',
  Northwest = 'Northwest',
}

export class UpdatePropertyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public_price?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiProperty({ required: false, enum: Status })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'Ảnh của Sản Phẩm',
  })
  @IsOptional()
  img?: any; // file

  @ApiHideProperty()
  thumbnail_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({ required: false, enum: Direction })
  @IsOptional()
  @IsEnum(Direction)
  house_direction?: Direction;

  @ApiProperty({ required: false })
  @IsOptional()
  number_of_bedrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  legal_status?: string;

  @ApiProperty({ required: false, enum: Direction })
  @IsOptional()
  @IsEnum(Direction)
  balcony_direction?: Direction;

  @ApiProperty({ required: false })
  @IsOptional()
  number_of_bathrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  furniture?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  house_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  road_surface?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  type_propertiesID?: number;
}