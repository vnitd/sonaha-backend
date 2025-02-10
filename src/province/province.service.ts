import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProvinceService {
  prisma = new PrismaClient();

  // Lấy tất cả các tỉnh
  async findAllProvinces() {
    return this.prisma.provinces.findMany({
      select: {
        code: true,
        name: true,
        full_name: true,
        full_name_en: true,
        code_name: true,
      },
    });
  }

  // Lấy tất cả các quận/huyện theo provinceId
  async findDistrictsByProvince(provinceId: number) {
    return this.prisma.districts.findMany({
      where: {
        province_code: provinceId.toString(),
      },
      select: {
        code: true,
        name: true,
        full_name: true,
        full_name_en: true,
        code_name: true,
      },
    });
  }

  // Lấy tất cả các xã/phường theo districtId
  async findWardsByDistrict(districtId: number) {
    return this.prisma.wards.findMany({
      where: {
        district_code: districtId.toString(),
      },
      select: {
        code: true,
        name: true,
        full_name: true,
        full_name_en: true,
        code_name: true,
      },
    });
  }
}
