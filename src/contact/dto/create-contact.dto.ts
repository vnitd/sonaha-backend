import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreateContactDto {
 @ApiProperty()
 @IsEmail({},{message:"không đúng định dạng"})
 email:string;
 @ApiProperty()
name:string;
@ApiProperty()
phone:string;
@ApiProperty()
content:string;

}
