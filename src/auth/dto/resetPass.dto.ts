import { ApiProperty } from "@nestjs/swagger";

export class ChangePassDto{
   @ApiProperty()
   password:string
   @ApiProperty()
   reset_token:string
}