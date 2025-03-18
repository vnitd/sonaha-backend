import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateBannerDto {
  @ApiProperty({ description: "Tiêu đề của banner" })
  @IsNotEmpty({ message: "Tiêu đề không được để trống" })
  title: string;

  @ApiProperty({ type: 'string', format: 'binary', description: "Ảnh của banner (file upload)" })
  @IsNotEmpty({ message: "Ảnh không được để trống" })
  img?: any;

  @ApiHideProperty()
  @IsOptional()
  img_url?: string;  // URL ảnh lưu vào database sau khi upload

  @ApiProperty({ description: "ID của sản phẩm liên kết với banner" })
  @IsNotEmpty({ message: "Property ID không được để trống" })
  @IsNumber({}, { message: "Property ID phải là số" })
  @Type(() => Number) // Chuyển đổi dữ liệu từ request về number
  propertyID: number;

  @ApiProperty({ description: "Ngày kết thúc của banner", type: String, example: "2025-12-31T23:59:59.000Z" })
  @IsNotEmpty({ message: "Ngày kết thúc không được để trống" })
  @IsDateString({}, { message: "Ngày kết thúc phải đúng định dạng ISO 8601" })
  @Type(() => Date) // Chuyển đổi dữ liệu từ string thành Date
  end_date: Date;
}
