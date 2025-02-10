import { Body, Get, Injectable, NotFoundException, Patch, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UpdateProprityDto } from './dto/update-proprity.dto';
import { CreatePropertyDto } from './dto/create-proprity.dto';
import { PrismaClient } from '@prisma/client';
import { GetAllPropertiesDto } from './dto/getall-proprities.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { SearchDto } from './dto/search-properties.dto';
import { getBannerDto } from 'src/banner/dto/get-banner.dto';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class PropritiesService {
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

    const {
      name,
      description,
      public_price,
      area,
      status,
      cost_price,
      province,
      district,
      ward,
      house_direction,
      number_of_bedrooms,
      legal_status,
      balcony_direction,
      number_of_bathrooms,
      furniture,
      house_number,
      description_detail,
      thumbnail_url,
    } = createProprityDto;

    if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
      const newProperty = await this.prisma.properties.create({
        data: {
          name,
          description,
          public_price : Number(createProprityDto.public_price),  // Không cần chuyển đổi nữa vì đã là kiểu number
          area : Number(createProprityDto.area),           // Không cần chuyển đổi nữa vì đã là kiểu number
          status,
          thumbnail_url,
          cost_price : Number(createProprityDto.cost_price),     // Không cần chuyển đổi nữa vì đã là kiểu number
          province,
          district,
          ward,
          house_direction,
          number_of_bedrooms : Number(createProprityDto.number_of_bathrooms),  // Không cần chuyển đổi nữa vì đã là kiểu number
          legal_status,
          balcony_direction,
          number_of_bathrooms : Number(createProprityDto.number_of_bedrooms), // Không cần chuyển đổi nữa vì đã là kiểu number
          furniture,
          house_number,
          description_detail,
        },
      });

      return `Property with ID: ${newProperty.property_id} created successfully`;
    } else {
      throw new Error('Permission denied');
    }
  }
  async findAll(): Promise<any> {
    try {
      const renderAllProperties = await this.prisma.properties.findMany({
        include: {
          transactions: {
            include: {
              users_transactions_moderator_idTousers: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
          save: {
            select: {
              users: true,
            },
          },
          type_properties:true
        },
      
      });
  
      return renderAllProperties
    } catch (error) {
      throw new Error(error);
    }
  }
  
// nếu như trong này cập nhật là sold thì bên khác cũng cập nhật bản ghi
  //search
  // bảng save sẽ cho admin biết ai là người đang lưu
  // lấy data để thực hiện tư vấn
    
  async search(keyword: string) {
    if (!keyword) {
      throw new NotFoundException('Keyword is required');
    }

    try {
      const properties = await this.prisma.properties.findMany({
        where: {
          name: {
            contains: keyword.toLowerCase(),
          },
        },
      });

      if (properties.length === 0) {
        throw new NotFoundException('No properties found for this keyword');
      }

      return properties;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit; 
    const [data, total] = await this.prisma.$transaction([
      this.prisma.properties.findMany({
        skip: offset,
        take: limit, 
        include: {
          transactions: {
            include: {
              users_transactions_moderator_idTousers: {
                select: { name: true, phone: true },
              },
            },
          },
          save: { select: { users: true } },
          type_properties:true
        },
      }),
      this.prisma.properties.count(), // Đếm tổng số bản ghi
    ]);
  
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  

  
  async findOne(id: number):Promise<any> {
    try {
      const detail = await this.prisma.properties.findFirst({
        where: {
          property_id: id, // Điều kiện lọc
        },
        include: {
          transactions: { // Quan hệ 1-n hoặc n-n
            include: { // Bao gồm thêm quan hệ trong bảng transactions
              users_transactions_moderator_idTousers:true, // Bao gồm dữ liệu của bảng users
            },
          },
          property_images: true, // Bao gồm dữ liệu của bảng property_images
          type_properties: true, // Bao gồm dữ liệu của bảng type_properties
        },
      });
      
      return detail
    } catch (error) {
      return error
    }
  }
  // cập nhật là sold thì nó sẽ tự update trong bảng thống kê khi cập nhật là sold xong thì nó không cho cập nhật nữa
  // cái này mình sẽ làm bên phần fe
  // chỉ có admin với manager mới được update cái properties
  async updateProperty(
    idProperty: number,
    userId: number,
    updateProprityDto: UpdateProprityDto
  ): Promise<string> {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: {
          user_id: Number(userId),
        },
      });
  
      if (!checkAdmin) {
        throw new Error('User không tồn tại');
      }
  
      if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
        // Cập nhật property
        await this.prisma.properties.update({
          where: {
            property_id: Number(idProperty),
          },
          data: {
            name: updateProprityDto.name,
            description: updateProprityDto.description,
            public_price: Number(updateProprityDto.public_price),
            area: Number(updateProprityDto.area),
            status: updateProprityDto.status,
            thumbnail_url: updateProprityDto.thumbnail_url,
            cost_price: Number(updateProprityDto.cost_price),
            province: updateProprityDto.province,
            district: updateProprityDto.district,
            ward: updateProprityDto.ward,
            house_direction: updateProprityDto.house_direction,
            number_of_bedrooms: Number(updateProprityDto.number_of_bedrooms),
            legal_status: updateProprityDto.legal_status,
            balcony_direction: updateProprityDto.balcony_direction,
            number_of_bathrooms: Number(updateProprityDto.number_of_bathrooms),
            furniture: updateProprityDto.furniture,
            house_number: updateProprityDto.house_number,
            address: updateProprityDto.address,
            description_detail: updateProprityDto.description_detail,
          },
        });
  
        // Nếu status là "sold", cập nhật bảng daily_transactions_stats
        if (updateProprityDto.status === 'sold') {
          const today = new Date();
          const formattedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Chỉ lấy ngày, không lấy giờ
  
          // Tìm hoặc tạo mới thống kê hàng ngày
          await this.prisma.daily_transactions_stats.upsert({
            where: {
              transaction_date: formattedDate, // Cần đảm bảo transaction_date là unique
            },
            update: {
              transaction_total_perday: { increment: 1 }, // Tăng số lượng giao dịch
              total_revenue_perday: {
                increment: Number(updateProprityDto.public_price) || 0, // Tăng doanh thu
              },
            },
            create: {
              transaction_date: formattedDate,
              transaction_total_perday: 1,
              total_revenue_perday: Number(updateProprityDto.public_price) || 0,
            },
          });
        }
  
        return 'Update Thành Công';
      } else {
        throw new Error('Unauthorized: Bạn không có quyền cập nhật');
      }
    } catch (error) {
      throw new Error(`Cập nhật thất bại: ${error.message}`);
    }
  }
  
  
// admin với manager có quyền xóa
async remove(userId: number, id: number): Promise<string> {
  try {
    const checkAdmin = await this.prisma.users.findFirst({
      where: {
        user_id: Number(userId),
      },
    });
    if (checkAdmin.role_name === 'admin' || checkAdmin.role_name === 'manager') {
      // Xóa các bản ghi trong bảng `save`
      const save = await this.prisma.save.findMany({
        where: {
          property_id: Number(id),
        },
      });
      if (save.length > 0) {
        await this.prisma.save.deleteMany({
          where: {
            property_id: Number(id),
          },
        });
      }
      const commentTest = await this.prisma.comments.findMany({
        where: {
          property_id: Number(id),
        },
      });
      let commentIds: number[] = [];
      if (commentTest.length > 0) {
        commentIds = commentTest.map((comment) => comment.comment_id); // Lấy ra danh sách `comment_id`
        console.log('Danh sách comment_id:', commentIds);
        await this.prisma.comments.deleteMany({
          where: {
            property_id: Number(id),
          },
        });
      }

    }
    const transDelete = await this.prisma.transactions.findMany({
      where: {
        property_id: Number(id),
      },
    });
    if (transDelete.length > 0) {
      await this.prisma.transactions.deleteMany({
        where: { property_id: Number(id) },
      });
    }
    const type = await this.prisma.type_properties.findMany({
      where: {
        propertyId: Number(id),
      },
    });
    if (type.length > 0) {
      await this.prisma.type_properties.deleteMany({
        where: {
          propertyId: Number(id),
        },
      });
    }

    await this.albumService.removeAll(id,userId)
    await this.prisma.properties.delete({
      where: {
        property_id: Number(id),
      },
    });
    // check kĩ lại chỗ delete
    return 'Property and related resources deleted successfully';
  } catch (error) {
    console.error(`Error removing property: ${error.message}`);
    throw new Error(`Error removing property: ${error.message}`);
  }
}}
