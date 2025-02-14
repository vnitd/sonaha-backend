import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto{
   @ApiProperty()
   @IsEmail({}, {message:'Không đúng định dạng mail'})
   email:string;
   @ApiProperty()
   @IsNotEmpty()
   password:string;
   
}