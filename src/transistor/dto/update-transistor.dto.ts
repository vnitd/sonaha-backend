import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum STATUS {
   PENDING = 'pending',
   IN_PROGRESS = 'in_progress',
   COMPLETED = 'completed',
 }
export class UpdateTransistorDto{
  @ApiProperty({required:false})
  status: STATUS = STATUS.PENDING; 
}
