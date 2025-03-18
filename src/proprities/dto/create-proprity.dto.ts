import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export enum Status {
  AVAILABLE = 'available',
  SOLD = 'sold',
  PENDING = 'pending',
}
class CreateContentDto{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title : string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
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

  @ApiProperty({ required: false, description: 'Giá tổng của dự án' })
  @IsOptional()
  @IsNumber({}, { message: 'Giá tổng phải là số' })
  @Type(() => Number)
  price?: number;


  @ApiProperty()
  @IsNotEmpty({ message: 'Phải có diện tích dự án' })
  area: string;
  
  
  @Transform(({ value }) => (value === '' || value === undefined ? Status.AVAILABLE : value))
  @ApiProperty({required : false})
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh của Sản Phẩm',
  })
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
  house_direction?: string;

  @ApiProperty({ required: false })
  number_of_bedrooms?: number;

  @ApiProperty({ required: false })
  legal_status?: string;

  @ApiProperty({ required: false })
  balcony_direction?: string;

  @ApiProperty({ required: false })
  number_of_bathrooms?: number;

  @ApiProperty({ required: false })
  furniture?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  road_surface?: string;
  
  @ApiProperty(
    {
      type: [CreateContentDto], 
      isArray:true,
      description: 'Danh sách nội dung với tiêu đề và nội dung',
    }
  )
  @Transform(({ value }) => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch (e) {
      return [];
    }
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({each:true})
  @Type(()=>CreateContentDto)
  content_property? : CreateContentDto[];
}
