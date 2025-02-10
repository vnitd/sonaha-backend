import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export enum Status {
   AVAILABLE = 'available',
   SOLD = 'sold',
   PENDING = 'pending',
}

export enum StatusDirection {
   NORTH = 'North', 
   NORTHEAST = 'Northeast', 
   EAST = 'East', 
   SOUTHEAST = 'Southeast', 
   SOUTH = 'South', 
   SOUTHWEST = 'Southwest', 
   WEST = 'West', 
   NORTHWEST = 'Northwest',
}

export class CreatePropertyDto {
   @ApiProperty()
   @IsNotEmpty()
   name: string;

   @ApiProperty() 
   @IsNotEmpty()
   description: string;

   @ApiProperty() 
   @IsNotEmpty()
   public_price: number;

   @ApiProperty() 
   @IsNotEmpty()
   area: number;

   @ApiProperty() 
   @IsNotEmpty()
   @IsEnum(Status)
   status: Status;

   @ApiProperty({ type: 'string', format: 'binary', description: "Ảnh của Sản Phẩm" })
   img: any; // file

   @ApiHideProperty()
   thumbnail_url: string;

   @ApiProperty() 
   @IsNotEmpty()
   cost_price: number;

   @ApiProperty()
   @IsNotEmpty()
   province: string;

   @ApiProperty()
   @IsNotEmpty()
   district: string;

   @ApiProperty()
   @IsNotEmpty()
   ward: string;

   @ApiProperty()
   @IsNotEmpty()
   @IsEnum(StatusDirection)
   house_direction: StatusDirection;

   @ApiProperty({ required: false })
   number_of_bedrooms?: number;

   @ApiProperty()
   @IsNotEmpty()
   legal_status: string;

   @ApiProperty()
   @IsNotEmpty()
   @IsEnum(StatusDirection)
   balcony_direction: StatusDirection;

   @ApiProperty({ required: false })
   number_of_bathrooms?: number;

   @ApiProperty()
   @IsNotEmpty()
   furniture: string;

   @ApiProperty()
   @IsNotEmpty()
   house_number: string;

   @ApiHideProperty()
   address: string;

   @ApiProperty({ required: false })
   @IsNotEmpty()
   description_detail: string;
}
