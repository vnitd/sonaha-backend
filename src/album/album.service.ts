import { Injectable } from '@nestjs/common';
import { CreateAlbumDto, createVideoDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaClient } from '@prisma/client';
import { CloudUploadService } from 'src/shared/cloudUpload.service';

@Injectable()
export class AlbumService {
  constructor(private readonly cloudUploadService: CloudUploadService) {}
  prisma = new PrismaClient();
  //
  async createImg(
    createAlbumDto: CreateAlbumDto,
    propertyId: number,
    userId: number,
  ): Promise<string> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (
      checkAdmin.role_name !== 'admin' &&
      checkAdmin.role_name !== 'manager'
    ) {
      throw new Error('User does not have permission to create album');
    }
    try {
      const imageData = createAlbumDto.imageUrls.map((url) => ({
        image_url: url,
        property_id: propertyId,
      }));
      await this.prisma.property_images.createMany({ data: imageData });
      return 'Tạo mới thành công';
    } catch (error) {
      throw new Error(`Error while creating album: ${error.message}`);
    }
  }

  async createVideo(
    createAlbumDto: createVideoDto,
    propertyId: number,
    userId: number,
  ): Promise<string> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (
      checkAdmin.role_name !== 'admin' &&
      checkAdmin.role_name !== 'manager'
    ) {
      throw new Error('User does not have permission to create album');
    }

    try {
      if (createAlbumDto.videoUrl) {
        const imageData = {
          image_url: createAlbumDto.videoUrl,
          property_id: Number(propertyId),
        };

        // Sử dụng create thay vì createMany
        await this.prisma.property_images.create({ data: imageData });
      }

      return 'Tạo mới thành công';
    } catch (error) {
      throw new Error(`Error while creating album: ${error.message}`);
    }
  }

  // xóa từng cái
  async remove(id: number, userId: number): Promise<string> {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: { user_id: userId },
      });
  
      if (!checkAdmin || (checkAdmin.role_name !== 'admin' && checkAdmin.role_name !== 'manager')) {
        throw new Error('Người dùng không có quyền thực hiện hành động này');
      }
      const find = await this.prisma.property_images.findFirst({
        where: { image_id: Number(id) },
      });
  
      if (!find) {
        throw new Error('Không tìm thấy file cần xóa');
      }
  
      const url = find.image_url;
  
      // Hàm xác định loại file
      const getType = (url: string): string => {
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const fileExtension = url.split('.').pop()?.toLowerCase();
  
        if (fileExtension && videoExtensions.includes(fileExtension)) return 'video';
        if (fileExtension && imageExtensions.includes(fileExtension)) return 'image';
        return 'unknown';
      };
  
      const fileType = getType(url);
      // trong trường hợp có nhiều hơn 1 video
      // Lấy publicId từ URL
      const publicId = url.split('/').slice(-2).join('/').split('.')[0].replace(/%20/g, ' ');
      if (fileType === 'video') {
        // Xóa video
        await this.cloudUploadService.deleteVideo(publicId);
      } else if (fileType === 'image') {
        // Xóa ảnh
        await this.cloudUploadService.deleteImage(publicId);
      } else {
        throw new Error('Loại file không được hỗ trợ');
      }
      await this.prisma.property_images.delete({
        where: { image_id: id },
      });
  
      return Promise.resolve('Xóa thành công');
    } catch (error) {
      console.error(`Error removing file: ${error.message}`);
      return Promise.resolve(error.message);
    }
  }
  // xóa tất cả các ảnh với video nếu có liên quan tới properties
  async removeAll(id: number, userId: number): Promise<string> {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: { user_id: userId },
      });
      if (!checkAdmin || (checkAdmin.role_name !== 'admin' && checkAdmin.role_name !== 'manager')) {
        throw new Error('Người dùng không có quyền thực hiện hành động này');
      }
      const find = await this.prisma.property_images.findMany({
        where: { property_id: Number(id) },
      }); 
      if (!find || find.length === 0) {
        throw new Error('Không tìm thấy file cần xóa hehe');
      }
      const url = find.map(hehe => hehe.image_url);
      // Hàm xác định loại file
      const getType = (url: string): string => {
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const fileExtension = url.split('.').pop()?.toLowerCase();
        if (fileExtension && videoExtensions.includes(fileExtension)) return 'video';
        if (fileExtension && imageExtensions.includes(fileExtension)) return 'image';
        return 'unknown';
      };
      for (const u of url) {
        const fileType = getType(u);
        const publicId = u.split('/').slice(-2).join('/').split('.')[0].replace(/%20/g, ' ');
        if (fileType === 'video') {
          await this.cloudUploadService.deleteVideo(publicId);
        } else if (fileType === 'image') {
          await this.cloudUploadService.deleteImage(publicId);
        } else {
          throw new Error('Loại file không được hỗ trợ');
        }
      }
      await this.prisma.property_images.deleteMany({
        where: { property_id: id },
      });
      return Promise.resolve('Xóa thành công');
    } catch (error) { 
      console.error(`Error removing file: ${error.message}`);
      return Promise.resolve(error.message);
    }
  }
}
