import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
export enum PropertyType {
   Apartment = 'Apartment',
   OfficeBuilding = 'OfficeBuilding',
   ShoppingCenter = 'ShoppingCenter',
   NewUrbanArea = 'NewUrbanArea',
   MixedUseDevelopment = 'MixedUseDevelopment',
   SocialHousing = 'SocialHousing',
   EcoResort = 'EcoResort',
   IndustrialPark = 'IndustrialPark',
   SemiDetachedVilla = 'SemiDetachedVilla',
   Shophouse = 'Shophouse',
   Townhouse = 'Townhouse',
   OtherProject = 'OtherProject',
   BeachLand = 'BeachLand',
   PerennialCropLand = 'PerennialCropLand',
   Villa = 'Villa',
   ResidentialPlot = 'ResidentialPlot',
   StreetHouse = 'StreetHouse',
   LuxuryApartment = 'LuxuryApartment',
 }

 
 export class TypeDto {
   @ApiProperty({
     description: 'Type of the property',
     enum: PropertyType, 
   })
   @IsNotEmpty()
   @IsEnum(PropertyType, { message: 'Invalid property type' })
   type: PropertyType;
 }

 
export class ProvinceDto {
   @ApiProperty()
   @IsNotEmpty()
   province:string
} 
