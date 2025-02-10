import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { SaveService } from './save.service';
import { CreateSaveDto } from './dto/create-save.dto';
import { UpdateSaveDto } from './dto/update-save.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { Response } from 'express';

@Controller('save')
export class SaveController {
  constructor(private readonly saveService: SaveService,
   
  ) {}

@Post('/saveProperties/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async create(
  @Param('id') id: number,
  @Req() req,
  @Res() res: Response,
): Promise<void> { 
  try {
    const userId = req.user.userId;
    const hehe = await this.saveService.create(+id, +userId);
     res.status(HttpStatus.OK).json({ message: hehe });
  } catch (error) {
     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

  // lấy tất cả mục mà cái ông user lưu
  @Get('/getAllUserSave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(@Req() req,
  @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      if (!userId) {
          res.status(401).json({
          message: 'Token không hợp lệ hoặc không tồn tại',
        });
      }
  
      const result = await this.saveService.findAll(+userId);
      res.status(200).json({ result });
    } catch (error) {
      console.error('Error in findAll controller:', error.message);
      res.status(500).json({
        message: 'Failed to fetch saved properties',
        error: error.message,
      });
    }
  }
  
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  // thực hiện thao tác xóa phần lưu
  @Delete('/deleteSave/:id')
  async remove(@Param('id') id: number,
  @Req() req, 
  @Res() res:Response
  ) {
    const userId = req.user.userId
    try {
      const result = await this.saveService.remove(+id,userId)
      res.status(200).json({result}) 
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }
}
