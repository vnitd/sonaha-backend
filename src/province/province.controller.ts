import { Controller, Get, Param } from '@nestjs/common';
import { ProvinceService } from './province.service';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  // Lấy tất cả các tỉnh
  @Get()
  findAllProvinces() {
    return this.provinceService.findAllProvinces();
  }

  // Lấy tất cả các quận/huyện theo provinceId
  @Get(':provinceId/districts')
  findDistrictsByProvince(@Param('provinceId') provinceId: string) {
    return this.provinceService.findDistrictsByProvince(+provinceId);
  }

  // Lấy tất cả các xã/phường theo districtId
  @Get('district/:districtId/wards')
  findWardsByDistrict(@Param('districtId') districtId: string) {
    return this.provinceService.findWardsByDistrict(+districtId);
  }
}
