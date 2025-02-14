import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { Response } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // người dùng comment, có đẩy lên cái notification của người morderator để họ trả lời
  // comment xong update trong cái noti, cho chính cái moderator đó
  // cái này truyền propertiesId vào id rồi 
@Post('/cmProperties/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async create(
  @Body() createCommentDto: CreateCommentDto,
  @Param('id') id: number,
  @Req() req,
  @Res() res: Response,
): Promise<void> {
  try {
    const userId = req.user.userId;
    console.log('createCommentDto:', createCommentDto); // Log để debug
    console.log('userId:', userId);
    const result = await this.commentService.create(+id, +userId, createCommentDto);
    res.status(HttpStatus.OK).json({ message: result });
  } catch (error) {
    console.error('Error:', error); // Log lỗi
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
}
// tạo thêm 1 cái để rep comment nữa ha
// POST /comment/reply/123?propertyId=456
@Post('/reply/:commentId')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async replyComment(
  @Body() createCommentDto: CreateCommentDto,
  @Param('commentId') commentId: number,
  @Req() req,
  @Res() res: Response,
): Promise<any> {
  try {
    const userId = req.user.userId; // Lấy userId từ JWT
    const propertyId = req.query.propertyId; // Lấy propertyId từ query string
    if (!propertyId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'propertyId is required' });
    }
    const result = await this.commentService.replyComment(createCommentDto, +userId, +commentId, +propertyId);
    res.status(HttpStatus.OK).json({ message: 'Reply added successfully', data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to reply to comment', error });
  }
}


@Get(':id')
async getComment(
  @Param('id') id: number,
  @Res() res: Response,
) {
  try {
    const result = await this.commentService.getCommet(+id);
    res.status(HttpStatus.OK).json({ data: result }); // Gửi response thủ công
  } catch (error) {
    console.error('Error:', error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error', error });
  }
}
}
