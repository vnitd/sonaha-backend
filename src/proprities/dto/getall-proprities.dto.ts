import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Expose } from 'class-transformer';
export class GetAllPropertiesDto {
  @Expose() property_id?: number;
  @Expose() name?: string;
  @Expose() description?: string;
  @Expose() public_price?: number;
  @Expose() area?: Decimal;
  @Expose() status?: string;
  @Expose() thumbnail_url?: string;
  @Expose() created_at?: string;
  @Expose() updated_at?: string;
  @Expose() cost_price?: number;
  @Expose() price_difference?: number;
  @Expose() province?: string;
  @Expose() district?: string;
  @Expose() ward?: string;
  @Expose() coordinates?: string;
  @Expose() house_direction?: string;
  @Expose() number_of_bedrooms?: number;
  @Expose() legal_status?: string;
  @Expose() balcony_direction?: string;
  @Expose() number_of_bathrooms?: number;
  @Expose() furniture?: string;
  @Expose() house_number?: string;
  @Expose() address?: string;
  @Expose() description_detail?: string;
}
