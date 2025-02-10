import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TransistorService } from './transistor.service';
import { CreateTransistorDto } from './dto/create-transistor.dto';
import { UpdateTransistorDto } from './dto/update-transistor.dto';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { Response } from 'express';
import { GetAllTras } from './dto/get-all.dto';
import { json } from 'stream/consumers';

@Controller('transactions')
export class TransistorController {
  constructor(private readonly transistorService: TransistorService) {}

  // admin
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() createTransistorDto: CreateTransistorDto,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    // chỉ định ông nào làm dự án nào
    try {
      const userId = req.user.userId;
      const hehe = await this.transistorService.create(
        createTransistorDto,
        +userId,
      );
      console.log(createTransistorDto);
      res.status(HttpStatus.OK).json({ message: hehe });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  //
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [GetAllTras] })
  async findAll(@Req() req, @Res() res: Response): Promise<any> {
    try {
      const userId = req.user.userId;
      const users = await this.transistorService.findAll(+userId);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({});
    }
  }

  // xóa theo cái moderator
  @Delete('/deleteModerator/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(
    @Param('id') id: number,
    @Req() req,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const users = await this.transistorService.remove(+id,+userId);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({});
    }
  }

  @Patch(':id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async update(
  @Body() updateTransistorDto: UpdateTransistorDto,
  @Param('id') id: number,
  @Req() req,
  @Res() res: Response,
): Promise<void> {
  try {
    const userId = req.user.userId;
    const result = await this.transistorService.update(updateTransistorDto, +id, +userId);
    res.status(HttpStatus.OK).json(result); 
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
}
