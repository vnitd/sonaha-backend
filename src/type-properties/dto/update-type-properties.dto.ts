import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CreateTypePropertiesDto } from "./create-type-properties.dto";

export class UpdateTypePropertiesDto extends PartialType(CreateTypePropertiesDto) {
   @ApiProperty({ description: "Tên loại bất động sản", required: false })
   @IsOptional()
   @IsString()
   typePropertiesName?: string;
}
