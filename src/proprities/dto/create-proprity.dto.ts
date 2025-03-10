import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export enum Status {
  AVAILABLE = 'available',
  SOLD = 'sold',
  PENDING = 'pending',
}

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

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có Kiểu dự án' })
  @IsInt()
  @Type(() => Number)
  type_propertiesID: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có tên dự án' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có Giá dự án' })
  public_price: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có diện tích dự án' })
  area: string;
  
  
  @Transform(({ value }) => (value === '' || value === undefined ? Status.AVAILABLE : value))
  @ApiProperty()
  
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh của Sản Phẩm',
  })
  @IsNotEmpty({ message: 'Phải có ảnh dự án' })
  img: any; 

  @ApiHideProperty()
  thumbnail_url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có địa chỉ cụ thể' })
  province: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có địa chỉ cụ thể' })
  district: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có địa chỉ cụ thể' })
  ward: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có địa chỉ cụ thể' })
  house_number: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' || value === undefined ))
  @IsEnum(Direction)
  house_direction?: Direction;

  @ApiProperty({ required: false })
  number_of_bedrooms?: number;

  @ApiProperty({ required: false })
  legal_status?: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value === '' || value === undefined))
  @IsEnum(Direction)
  balcony_direction?: Direction;

  @ApiProperty({ required: false })
  number_of_bathrooms?: number;

  @ApiProperty({ required: false })
  furniture?: string;

  @ApiProperty({ required: false })
  @IsString()
  road_surface?: string;
}
