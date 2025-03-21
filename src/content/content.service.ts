import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContentDto } from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: number, contentDTO: ContentDto): Promise<object> {
    try {
      // Kiểm tra vai trò người dùng
      const checkAdmin = await this.prisma.users.findUnique({
        where: { user_id: id },
      });

      if (!checkAdmin) {
        throw new NotFoundException('User not found');
      }

      if (checkAdmin.role_name !== 'admin' && checkAdmin.role_name !== 'manager') {
        throw new UnauthorizedException('Permission denied');
      }

      // Kiểm tra nếu contents rỗng
      if (!contentDTO.contents || contentDTO.contents.length === 0) {
        throw new BadRequestException('At least one content item is required');
      }

      const createdContents = [];
      for (const content of contentDTO.contents) {
        // Kiểm tra dữ liệu đầu vào
        if (!content.property_id || !content.title || !content.content) {
          throw new BadRequestException('Each content must have property_id, title, and content');
        }

        // Kiểm tra property_id có tồn tại không
        const typeExists = await this.prisma.properties.findUnique({
          where: { property_id: content.property_id },
        });

        if (!typeExists) {
          throw new NotFoundException(
            `Property with ID ${content.property_id} does not exist!`,
          );
        }

        // Tạo property content mới
        const newProperty = await this.prisma.content_property.create({
          data: {
            property_id: content.property_id,
            title: content.title,
            content: content.content,
            imagecontent_url: content.imagecontent_url || '',
          },
        });

        createdContents.push(newProperty);
      }

      return {
        message: 'Property contents created successfully',
        properties: createdContents,
        createdAt: new Date(),
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  }
}