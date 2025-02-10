import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
export class CreateCommentDto {
  @ApiProperty() 
  @IsNotEmpty()
  comment: string;
  @ApiProperty() 
  @IsNotEmpty()
  link: string;
}
