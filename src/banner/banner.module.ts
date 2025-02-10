import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ShareModule } from 'src/shared/sharedModule';
import { KeyModule } from 'src/proprities/key/key.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
