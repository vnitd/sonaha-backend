import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateNotificationDto{
   @ApiProperty()
   @IsNotEmpty()
   notificationId:number
}
