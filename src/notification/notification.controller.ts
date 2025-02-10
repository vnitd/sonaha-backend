import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { Response } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // thông báo sẽ gán ở comment cho, transiaction cho moderator
  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(@Req() req, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const result = await this.notificationService.hehe(+userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }


  // khi xem thông báothif nó tự động sửa cái status đi
  // lấy id của cái notification
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Req()req,
    @Res() res:Response,

): Promise<void> {
  try {
    const userId = req.user.userId
    const result = await this.notificationService.update(+userId,+id);
    res.status(HttpStatus.OK).json(result)
  } catch (error) {
    console.log('hehe');
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error)
  }    
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
