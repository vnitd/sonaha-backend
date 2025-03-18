import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { CreateContentPropertyDto } from './dto/createContent.dto';

@Injectable()
export class ContentPropertyService {
  prisma = new PrismaClient();
  constructor(private readonly cloudUploadService: CloudUploadService) {}

  async createContent(data: CreateContentPropertyDto, id: number) {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: id },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }
    const propertyID = Number(data.property_id);

    // Kiểm tra propertiesID có tồn tại không
    const typeExists = await this.prisma.properties.findUnique({
      where: { property_id: propertyID },
    });
    if (!typeExists) {
      throw new Error(`Property với ID ${propertyID} không tồn tại!`);
    }
    if (
      checkAdmin.role_name !== 'admin' &&
      checkAdmin.role_name !== 'manager'
    ) {
      throw new Error('Không đủ quyền để làm nó');
    }
    try {
        const ContentData = data.contents.map((item) => ({
          title: item.title,
          content: item.content,
          property_id: propertyID,
        }));
        await this.prisma.content_property.createMany({ data: ContentData });
        return 'Tạo mới thành công';
      } catch (error) {
        throw new Error(`Error while creating album: ${error.message}`);
      }
  }
}
