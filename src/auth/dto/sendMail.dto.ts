import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class sendMailDto{
   @ApiProperty()
   @IsEmail({}, { message: 'không đúng định dạng' })
   email: string;
}