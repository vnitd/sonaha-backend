import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AlbumService } from 'src/album/album.service';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { CreatePropertyDto } from './dto/create-proprity.dto';
import { UpdatePropertyDto } from './dto/update-proprity.dto';

@Injectable()
export class PropertyService {
  prisma = new PrismaClient();
  constructor(
    private readonly cloudUploadService :CloudUploadService,
    private readonly albumService:AlbumService
  ){}
  async create(id: number, createProprityDto: CreatePropertyDto): Promise<string> {
    // Kiểm tra vai trò người dùng
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: id },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }
    const typeId = Number(createProprityDto.type_propertiesID);

    // Kiểm tra type_propertiesID có tồn tại không
    const typeExists = await this.prisma.type_properties.findUnique({
      where: { typePropertiesId: typeId },
    });

    if (!typeExists) {
      throw new Error(`Type Property với ID ${typeId} không tồn tại!`);
    }
    const {
      name,
      public_price,
      area,
      status,
      thumbnail_url,
      province,
      district,
      ward,
      house_direction,
      house_number,
      balcony_direction,
      legal_status,
      road_surface,
      furniture,
      type_propertiesID
    } = createProprityDto;
    if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
      const newProperty = await this.prisma.properties.create({
        data: {
          name,
          public_price ,  
          area ,           
          status,
          thumbnail_url,    
          province,
          district,
          ward,
          house_direction,
          number_of_bedrooms : Number(createProprityDto.number_of_bedrooms),  // Không cần chuyển đổi nữa vì đã là kiểu number
          legal_status,
          balcony_direction,
          number_of_bathrooms : Number(createProprityDto.number_of_bathrooms), // Không cần chuyển đổi nữa vì đã là kiểu number
          furniture,
          road_surface,
          house_number,
          type_propertiesID : Number(createProprityDto.type_propertiesID),
        },
      });

      return `${newProperty.property_id}`;
    } else {
      throw new Error('Permission denied');
    }
  }
  
  async findAll({
    page = 1,
    limit = 10,
    search = '',
    sort = 'property_id:asc',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;
  
      const [sortField, sortOrder] = sort.split(':');
      const orderBy = sortField
        ? { [sortField]: sortOrder === 'desc' ? 'desc' : 'asc' }
        : { property_id: 'asc' };
  
      const where = {
        deleted_at: null,
        ...(search && {
          name: {
            contains: search.toLowerCase(),
            mode: 'insensitive',
          },
        }),
      };
  
      const [data, total] = await this.prisma.$transaction([
        this.prisma.properties.findMany({
          where,
          skip: offset,
          take: limit,
          include: {
            property_images: true,
            content_property: true,
            comments: true,
            banners: true,
          },
        }),
        this.prisma.properties.count({ where }),
      ]);
  
      if (data.length === 0 && search) {
        throw new NotFoundException('No properties found for this keyword');
      }
  
      const formattedData = data.map((property) => ({
        ...property,
        groupedData: {
          comments: property.comments,
          property_images: property.property_images,
          banners: property.banners,
          content_property: property.content_property,
        },
        comments: undefined,
        property_images: undefined,
        banners: undefined,
        content_property: undefined,
      }));
  
      return {
        data: formattedData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error fetching properties: ${error.message}`);
    }
  }
  
  
  async findOne(id: number):Promise<any> {
    try {
      const detail = await this.prisma.properties.findFirst({
        where: {
          property_id: id,
        },
        include: {
          property_images:true,
          content_property: true,
          comments: true,
        },
      });
      
      return detail
    } catch (error) {
      return error
    }
  }
  async update(id: number,property_id:number, updatePropertyDto: UpdatePropertyDto): Promise<string> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: id },
    });
  
    if (!checkAdmin) {
      throw new Error('User not found');
    }
  
    if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
      const updatedProperty = await this.prisma.properties.update({
        where: { property_id: property_id }, // Giả sử bạn truyền property_id trong DTO hoặc từ param
        data: {
          name: updatePropertyDto.name,
          public_price: updatePropertyDto.public_price,
          area: updatePropertyDto.area,
          status: updatePropertyDto.status,
          thumbnail_url: updatePropertyDto.thumbnail_url,
          province: updatePropertyDto.province,
          district: updatePropertyDto.district,
          ward: updatePropertyDto.ward,
          house_direction: updatePropertyDto.house_direction,
          number_of_bedrooms: updatePropertyDto.number_of_bedrooms
            ? Number(updatePropertyDto.number_of_bedrooms)
            : undefined,
          legal_status: updatePropertyDto.legal_status,
          balcony_direction: updatePropertyDto.balcony_direction,
          number_of_bathrooms: updatePropertyDto.number_of_bathrooms
            ? Number(updatePropertyDto.number_of_bathrooms)
            : undefined,
          furniture: updatePropertyDto.furniture,
          house_number: updatePropertyDto.house_number,
          road_surface: updatePropertyDto.road_surface,
          type_propertiesID: updatePropertyDto.type_propertiesID,
        },
      });
  
      return `${updatedProperty.property_id}`;
    } else {
      throw new Error('Permission denied');
    }
  }
  async getTrashedProperties(userId: number): Promise<any[]> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (checkAdmin.role_name !== 'admin' && checkAdmin.role_name !== 'manager') {
      throw new Error('Permission denied');
    }

    const trashedProperties = await this.prisma.properties.findMany({
      where: {
        deleted_at: {
           not: null ,
        },
      },
    });
    console.log(trashedProperties);
    return trashedProperties;
  } catch (error: any) {
    console.error('Error fetching trashed properties:', error);
    throw new Error('Failed to fetch trashed properties');
  }
  // Di chuyển tài sản vào thùng rác
  async moveToTrash(userId: number, propertyId: number): Promise<string> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
      // Kiểm tra xem tài sản đã bị xóa chưa (deleted_at không null)
      const currentProperty = await this.prisma.properties.findUnique({
        where: { property_id: propertyId },
      });

      if (!currentProperty) {
        throw new Error('Property not found');
      }

      if (currentProperty.deleted_at) {
        throw new Error('Property is already in trash');
      }

      const updatedProperty = await this.prisma.properties.update({
        where: { property_id: propertyId },
        data: {
          deleted_at: new Date(), // Đặt deleted_at thành thời gian hiện tại
        },
      });

      return `${updatedProperty.property_id}`;
    } else {
      throw new Error('Permission denied');
    }
  }

  // Khôi phục tài sản từ thùng rác
  async restoreFromTrash(userId: number, propertyId: number): Promise<string> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
      // Kiểm tra xem tài sản có trong thùng rác không
      const currentProperty = await this.prisma.properties.findUnique({
        where: { property_id: propertyId },
      });

      if (!currentProperty) {
        throw new Error('Property not found');
      }

      if (!currentProperty.deleted_at) {
        throw new Error('Property is not in trash');
      }

      const updatedProperty = await this.prisma.properties.update({
        where: { property_id: propertyId },
        data: {
          deleted_at: null, // Đặt deleted_at về null
        },
      });

      return `${updatedProperty.property_id}`;
    } else {
      throw new Error('Permission denied');
    }
  }

  // Xóa vĩnh viễn tài sản
  async deletePermanently(userId: number, propertyId: number): Promise<void> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
      // Kiểm tra xem tài sản có trong thùng rác không
      const currentProperty = await this.prisma.properties.findUnique({
        where: { property_id: propertyId },
      });

      if (!currentProperty) {
        throw new Error('Property not found');
      }

      if (!currentProperty.deleted_at) {
        throw new Error('Property must be in trash to delete permanently');
      }

      await this.prisma.properties.delete({
        where: { property_id: propertyId },
      });
    } else {
      throw new Error('Permission denied');
    }
  }
}
