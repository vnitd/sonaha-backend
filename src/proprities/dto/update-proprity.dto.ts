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

export class UpdateProprityDto {
   @ApiProperty({ required: false })
   name?: string;

   @ApiProperty({ required: false })
   description?: string;

   @ApiProperty({ required: false })
   public_price?: number;

   @ApiProperty({ required: false })
   area?: number;

   @ApiProperty({
      required: false,
      enum: Status,
      default: Status.AVAILABLE, // Giá trị mặc định
   })
   @IsEnum(Status)
   status: Status = Status.AVAILABLE;

   @ApiProperty({
      type: 'string',
      format: 'binary',
      description: "Ảnh của Sản Phẩm",
      required: false,
   })
   img: any; // file

   @ApiHideProperty() // hide
   thumbnail_url: string;

   @ApiProperty({ required: false })
   cost_price: number;

   @ApiProperty({ required: false })
   province: string;

   @ApiProperty({ required: false })
   district: string;

   @ApiProperty({ required: false })
   ward: string;

   @ApiProperty({
      required: false,
      enum: StatusDirection,
      default: StatusDirection.NORTH, // Giá trị mặc định
   })
   @IsEnum(StatusDirection)
   house_direction: StatusDirection = StatusDirection.NORTH;

   @ApiProperty({ required: false })
   number_of_bedrooms?: number;

   @ApiProperty({ required: false })
   legal_status: string;

   @ApiProperty({
      required: false,
      enum: StatusDirection,
      default: StatusDirection.NORTH, // Giá trị mặc định
   })
   @IsEnum(StatusDirection)
   balcony_direction: StatusDirection = StatusDirection.NORTH;

   @ApiProperty({ required: false })
   number_of_bathrooms?: number;

   @ApiProperty({ required: false })
   furniture: string;

   @ApiProperty({ required: false })
   house_number: string;

   @ApiHideProperty()
   address: string;

   @ApiProperty({ required: false })
   description_detail: string;
}
