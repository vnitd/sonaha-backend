import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTypePropertiesDto {
   @ApiProperty({ description: "Tên loại bất động sản" })
   @IsNotEmpty()
   @IsString()
   typePropertiesName: string;

   @ApiHideProperty()
   id?: number;
}
