import { ApiProperty } from "@nestjs/swagger";

export class changePassDto{
   @ApiProperty()
   password:string
   @ApiProperty()
   reset_token:string
}