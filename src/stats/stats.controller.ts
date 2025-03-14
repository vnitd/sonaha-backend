import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
// quản lí trạng tháo giao dịch, thay đổi -> cập nhận trong transistion

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
    @Req() req,
    @Res() res:Response
  ): Promise<any> {
    try {
      const userId = req.user.userId
      const result = await this.statsService.findAll(+userId);
      return res.status(200).json({message:result})
    } catch (error) {
     throw new Error(error)
    }
  }
  // xóa dựa theo ngày chẳng hạn
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteByDay(
    @Req() req,
    @Res() res:Response,
    @Param('id') id:number
  ):Promise<any>{
    try {
      const userId = req.user.userId
      const result = await this.statsService.delete(+userId,+id);
      return res.status(200).json({message:result})
    } catch (error) {
     throw new Error(error)
    }
  }

} 
