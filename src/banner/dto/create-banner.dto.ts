import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNotEmpty } from "class-validator";

export class CreateBannerDto {
  @ApiProperty({ description: "Tiêu đề của banner" })
  @IsNotEmpty({ message: "Tiêu đề không được để trống" })
  tittle: string;

  @ApiProperty({ type: 'string', format: 'binary', description: "Ảnh của banner" })
  img: any;

  @ApiHideProperty()
  img_url: string;

  @ApiProperty({ description: "Liên kết URL của banner" })
  @IsNotEmpty({ message: "Link URL không được để trống" })
  link_url: string;

  @ApiProperty({ description: "Ngày kết thúc của banner", type: Date })
  @IsNotEmpty({ message: "Ngày kết thúc không được để trống" })
  @IsDateString()
  end_date: string; 

  @ApiHideProperty()
  end_date_hide:Date
}
