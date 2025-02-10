import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  prisma = new PrismaClient();

  // có thể là mình sẽ để cái link ở chỗ createCommentDto
  async create(id: number, userId: number, createCommentDto: CreateCommentDto) {
    try {
      // Kiểm tra người dùng
      const checkUser = await this.prisma.users.findFirst({
        where: { user_id: userId },
      });

      // Kiểm tra quyền của người dùng, nếu là admin hoặc moderator
      if (
        checkUser
      ) {
        // Tạo bình luận
        await this.prisma.comments.create({
          data: {
            user_id: checkUser.user_id,
            property_id: id,
            comment_text: createCommentDto.comment,
          },
        });

        // Gửi thông báo cho admin và moderator
        const adminsAndModerators = await this.prisma.users.findMany({
          where: {
            OR: [{ role_name: 'admin' }, { role_name: 'moderator' }],
            NOT:{user_id:userId}
          },
          select: { user_id: true, role_name: true },
        });

        // Tạo thông báo cho mỗi admin/moderator
        for (const user of adminsAndModerators) {
          await this.prisma.notifications.create({
            data: {
              user_id: user.user_id, // Gửi thông báo cho admin/moderator
              title: 'Có bình luận mới từ người dùng',
              link:createCommentDto.link, // tạm thời để null đã
              message: `${checkUser.name} đã bình luận một bài.`,
              type: 'comment',
              status: 'unread',
              created_at: new Date(),
            
            },
          });
        }
        return 'Bình luận đã được tạo và thông báo đã được gửi tới admin/moderator';
      }

      return 'Đăng nhập trước khi tạo bình luận'; // Trường hợp người dùng không phải admin hoặc moderator
    } catch (error) {
      console.error('Error while creating comment:', error);
      return error;
    }
  }

  async getCommet(id: number) {
    try {
      const data = await this.prisma.comments.findMany({
        where: {
          property_id: id,
        },
        include: {
          users: true,
        },
        orderBy: {
          created_at: 'asc', // Sắp xếp theo thời gian
        },
      });

      // Tổ chức lại dữ liệu theo cấu trúc nested (cây)
      const nestedComments = this.buildNestedComments(data);
      return nestedComments;
    } catch (error) {
      return error;
    }
  }

  // Hàm tổ chức dữ liệu theo cấu trúc cây
  buildNestedComments(comments: any[]) {
    const map = new Map();
    const roots = [];
    // Tạo map dựa trên comment_id
    comments.forEach((comment) => {
      map.set(comment.comment_id, { ...comment, replies: [] });
    });

    // Xây dựng cây
    comments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(map.get(comment.comment_id));
        }
      } else {
        roots.push(map.get(comment.comment_id)); // Nếu không có parent, nó là root
      }
    });

    return roots;
  }
  // nhớ check trong xóa, với chỗ này không truyền cái properties_id vào nhen
  async replyComment(
    createCommentDto: CreateCommentDto,
    userId: number,
    commentId: number,
    propertyId: number,
  ): Promise<any> {
    const userInformation = await this.prisma.users.findFirst({
      where:{
        user_id:userId
      }
    })
    try {
      // Tạo comment trả lời
      const reply = await this.prisma.comments.create({
        data: {
          parent_comment_id: commentId,
          user_id: userId,
          property_id: propertyId,
          comment_text: createCommentDto.comment,
        },
      });

      // Lấy thông tin người bình luận gốc
      const parentComment = await this.prisma.comments.findUnique({
        where: { comment_id: commentId },
        select: { user_id: true },
      });

      // Tạo thông báo cho người bình luận gốc
      if (parentComment) {
        await this.prisma.notifications.create({
          data: {
            user_id: parentComment.user_id, // Người nhận là người đã bình luận gốc
            title: 'Có người trả lời bình luận của bạn',
            message: `${userInformation.name} đã trả lời bình luận của bạn`,
            type: 'comment',
            status: 'unread',
            created_at: new Date(),
          },
        });
      }
      // Tạo thông báo cho quản trị viên (hoặc moderator)
      const adminsAndModerators = await this.prisma.users.findMany({
        where: {
          OR: [{ role_name: 'admin' }, { role_name: 'moderator' }],
        },
        select: { user_id: true },
      });

      // Tạo thông báo cho mỗi admin/moderator
      for (const admin of adminsAndModerators) {
        const notificationForAdmin = await this.prisma.notifications.create({
          data: {
            user_id: admin.user_id, // Người nhận là admin hoặc moderator
            title: 'Có người trả lời bình luận',
            message: `Người dùng ${userId} đã trả lời một bình luận`,
            type: 'comment',
            status: 'unread',
            created_at: new Date(),
          },
        });
      }

      return reply;
    } catch (error) {
      console.error('Error while replying to comment:', error);
      throw new Error('Failed to add reply');
    }
  }
}
