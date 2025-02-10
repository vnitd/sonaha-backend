import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';


export enum STATUS {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}
export class CreateTransistorDto {
  @ApiProperty()
  property_id: number;
  // @ApiHideProperty()
  // buyer_id: number;
  @ApiProperty()
  moderator_id: number;
  @ApiHideProperty()
  status: STATUS = STATUS.PENDING; 
}
