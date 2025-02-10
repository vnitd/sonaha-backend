import { Optional } from "@nestjs/common";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class registerDto {
   @ApiProperty()
   @IsEmail({}, { message: 'không đúng định dạng' })
   email: string;

   @ApiProperty()
   @IsNotEmpty()
   password: string;

   @ApiProperty()
   @IsOptional()
   phone: string;

   @ApiProperty()
   name: string;

   @ApiProperty({ type: 'string', format: 'binary',required:false })
   img?: any;

   @ApiHideProperty()
   avartar_url: string;
}
