import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePropertyDto } from './dto/create-proprity.dto';
import { SearchDto } from './dto/search-properties.dto';
import { UpdatePropertyDto } from './dto/update-proprity.dto';

@Injectable()
export class PropertyService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(
    id: number,
    createProprityDto: CreatePropertyDto,
  ): Promise<object> {
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

    if (
      checkAdmin.role_name === 'admin' ||
      checkAdmin.role_name === 'manager'
    ) {
      const newProperty = await this.prisma.properties.create({
        data: {
          name: createProprityDto.name,
          area: createProprityDto.area,
          status: createProprityDto.status,
          thumbnail_url: createProprityDto.thumbnail_url,
          province: createProprityDto.province,
          district: createProprityDto.district,
          ward: createProprityDto.ward,
          house_direction: createProprityDto.house_direction,
          number_of_bedrooms: Number(createProprityDto.number_of_bedrooms),
          legal_status: createProprityDto.legal_status,
          balcony_direction: createProprityDto.balcony_direction,
          number_of_bathrooms: Number(createProprityDto.number_of_bathrooms),
          furniture: createProprityDto.furniture,
          road_surface: createProprityDto.road_surface,
          house_number: createProprityDto.house_number,
          type_propertiesID: createProprityDto.type_propertiesID,
          price: Number(createProprityDto.price),
        },
      });

      return {
        message: 'Property created successfully',
        property: newProperty, // Trả về toàn bộ dữ liệu property mới
        property_ID: newProperty.property_id,
        createdAt: new Date(), // Thêm thông tin về thời gian
        status: 'success', 
      };
    } else {
      throw new Error('Permission denied');
    }
  }
  async findAllnoQuery() {
    const properties = await this.prisma.properties.findMany({
      where: {
        deleted_at: null,
      },
      include:{
        content_property: true,
        property_images:true,
        comments:true,
      }
    });
    return properties;
  }
  
  async findAll(searchDto: SearchDto) {
    const {name, province, type_propertiesID, status, page, limit} = searchDto;
    const type_propertiesID_number = +type_propertiesID;

    const whereConditions: any = {
      AND: [
        name ? { name: { contains: name } } : {},
        province ? { province: { contains: province } } : {},
        type_propertiesID ? { type_propertiesID: type_propertiesID_number } : {},
        status ? { status: status } : {},
        {deleted_at: null}
      ],
    };

    const properties = await this.prisma.properties.findMany({
      where: whereConditions,
      include:{
          content_property: true,
          property_images:true,
          comments:true,
      },
      skip: (+page - 1) * +limit,  // Calculate the skip based on page number
      take: +limit
    });
    const totalProperties = await this.prisma.properties.count({
      where: whereConditions
    });
    return {
      properties,
      totalPage: Math.ceil(totalProperties/limit),
      currentPage: page,
      totalItems: totalProperties
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const detail = await this.prisma.properties.findFirst({
        where: {
          property_id: id,
        },
        include: {
          property_images: true,
          content_property: true,
          comments: true,
        },
      });

      return detail;
    } catch (error) {
      return error;
    }
  }
  async update(
    id: number,
    property_id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<string> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: id },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (
      checkAdmin.role_name === 'admin' ||
      checkAdmin.role_name === 'manager'
    ) {
      const updatedProperty = await this.prisma.properties.update({
        where: { property_id: property_id }, // Giả sử bạn truyền property_id trong DTO hoặc từ param
        data: {
          name: updatePropertyDto.name,
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
  // ==========================================? Banner

  async findBanner() {
    try {
      const banners = await this.prisma.properties.findMany({
       where: {
        deleted_at: null,
        banner_status: true,
       },
       select: {
        property_id:true,
        name: true,
        thumbnail_url: true,
        status: true,
       },
      });
      
     if (banners.length === 0) {
       throw new NotFoundException('No banners found');
     }

     return {
       message: 'Banners fetched successfully',
       count: banners.length,
       data: banners,
    };
   } catch (error) {
    throw new InternalServerErrorException(`Error fetching banners: ${error.message}`);
   }}

   async findAllBanners() {
    try {
      const banners = await this.prisma.properties.findMany({
        where: {
          deleted_at: null,
         },
        select: {
          property_id:true,
          name: true,
          thumbnail_url: true,
          status: true,
          banner_status: true,
        },
      });
  
      return {
        message: 'Banners fetched successfully',
        count: banners.length,
        data: banners,
      };
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw new InternalServerErrorException('Failed to fetch banners.');
    }
  }


  async disableBanner(propertyId: number, userId: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { user_id: userId },
        select: { role_name: true },
      });

      if (!user || user.role_name !== 'admin') {
        throw new ForbiddenException('Only admin can disable banners');
      }
      const updatedBanner = await this.prisma.properties.update({
        where: {
          property_id: propertyId,
        },
        data: {
          banner_status: false, // Cập nhật trạng thái thành false
        },
      });

      return {
        message: 'Banner disabled successfully',
        banner: updatedBanner,
      };
    } catch (error) {
      throw new Error(`Error disabling banner: ${error.message}`);
    }
  }

  async enableBanner(propertyId: number, userId: number) {
    try {
      // Kiểm tra quyền admin
      const user = await this.prisma.users.findUnique({
        where: { user_id: userId },
        select: { role_name: true },
      });

      if (!user || user.role_name !== 'admin') {
        throw new ForbiddenException('Only admin can enable banners');
      }

      // Kiểm tra property có tồn tại không
      const property = await this.prisma.properties.findUnique({
        where: { property_id: propertyId },
        select: { status: true, banner_status: true, deleted_at: true },
      });

      if (!property) {
        throw new NotFoundException('Property not found');
      }

      if (property.deleted_at !== null) {
        throw new BadRequestException('Property has been deleted');
      }

      if (property.status === 'sold') {
        throw new BadRequestException('Cannot enable banner for sold property');
      }

      if (property.banner_status) {
        throw new BadRequestException('Banner is already enabled');
      }

      // Cập nhật trạng thái banner
      const updatedBanner = await this.prisma.properties.update({
        where: { property_id: propertyId },
        data: { banner_status: true },
      });

      return {
        message: 'Banner enabled successfully',
        banner: updatedBanner,
      };
    } catch (error) {
      throw new BadRequestException(`Error enabling banner: ${error.message}`);
    }
  }
  //  ======================================================? Thùng rác
  async getTrashedProperties(userId: number) {
    try {
      // Kiểm tra user có tồn tại không
      const user = await this.prisma.users.findUnique({
        where: { user_id: userId },
        select: { role_name: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Chỉ admin hoặc manager mới có quyền xem
      if (user.role_name !== 'admin' && user.role_name !== 'manager') {
        throw new ForbiddenException('Permission denied');
      }

      // Lấy danh sách properties đã bị xóa
      const trashedProperties = await this.prisma.properties.findMany({
        where: {
          deleted_at: { not: null },
        },
        select: {
          property_id: true,
          name: true,
          thumbnail_url: true,
          deleted_at: true,
        },
      });

      return {
        message: 'Trashed properties fetched successfully',
        count: trashedProperties.length,
        data: trashedProperties,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch trashed properties: ${error.message}`,
      );
    }
  }

  // Di chuyển tài sản vào thùng rác
  async moveToTrash(userId: number, propertyId: number): Promise<string> {
    const checkAdmin = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkAdmin) {
      throw new Error('User not found');
    }

    if (
      checkAdmin.role_name === 'admin' ||
      checkAdmin.role_name === 'manager'
    ) {
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

    if (
      checkAdmin.role_name === 'admin' ||
      checkAdmin.role_name === 'manager'
    ) {
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

    if (
      checkAdmin.role_name === 'admin' ||
      checkAdmin.role_name === 'manager'
    ) {
      // Kiểm tra xem tài sản có trong thùng rác không
      const currentProperty = await this.prisma.properties.findFirst({
        where: { property_id: propertyId },
      });

      if (!currentProperty) {
        throw new Error('Property not found');
      }

      if (!currentProperty.deleted_at) {
        throw new Error('Property must be in trash to delete permanently');
      }
      await this.prisma.$transaction([
        this.prisma.comments.deleteMany({ where: { property_id: propertyId } }),
        this.prisma.content_property.deleteMany({
          where: { property_id: propertyId },
        }),
        this.prisma.property_images.deleteMany({
          where: { property_id: propertyId },
        }),
        this.prisma.properties.delete({ where: { property_id: propertyId } }),
      ]);
    } else {
      throw new Error('Permission denied');
    }
  }
}
