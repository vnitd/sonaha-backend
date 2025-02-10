import { Expose } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export enum STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class GetAllTras {
  @Expose()
  @ApiProperty()
  property_id: number;
  @Expose()
  moderator_id: number;
  @Expose()
  status: STATUS = STATUS.PENDING;
}
