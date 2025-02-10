import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBannerDto } from './create-banner.dto';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateBannerDto {
   @ApiProperty({ description: "Tiêu đề của banner",required:false })
  tittle: string;

  @ApiProperty({ type: 'string', format: 'binary', description: "Ảnh của banner",required:false })
  img: any;

  @ApiHideProperty()
  img_url: string;

  @ApiProperty({ description: "Liên kết URL của banner",required:false })
  link_url: string;

  @ApiProperty({ description: "Ngày kết thúc của banner", type: Date,required:false })
  @IsDateString()
  end_date: string; 

  @ApiHideProperty()
  end_date_hide:Date

}
