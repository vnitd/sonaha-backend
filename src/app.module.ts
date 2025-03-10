import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AlbumModule } from './album/album.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { CommentModule } from './comment/comment.module';
import { ContactModule } from './contact/contact.module';
import { NotificationModule } from './notification/notification.module';
import { PrismaService } from './prisma.service';
import { PropertyModule } from './proprities/proprities.module';
import { ProvinceModule } from './province/province.module';
import { StatsModule } from './stats/stats.module';
import { TypePropertiesController } from './type-properties/type-properties.controller';
import { TypePropertiesModule } from './type-properties/type-properties.module';
import { TypePropertiesService } from './type-properties/type-properties.service';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ScheduleModule.forRoot(),
    UserModule,
    BannerModule,
    PropertyModule,
    AuthModule,
    AlbumModule,
    CommentModule,
    NotificationModule,
    StatsModule,
    ProvinceModule,
    ContactModule,  
    TypePropertiesModule,
  ],
  exports: [PrismaService],
  controllers: [AppController, TypePropertiesController],
  providers: [AppService, TypePropertiesService,PrismaService],
})
export class AppModule {}
