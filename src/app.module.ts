import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BannerModule } from './banner/banner.module';
import { PropritiesModule } from './proprities/proprities.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AlbumModule } from './album/album.module';
import { TransistorModule } from './transistor/transistor.module';
import { SaveModule } from './save/save.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { StatsModule } from './stats/stats.module';
import { FiltersearchModule } from './filtersearch/filtersearch.module';
import { ProvinceModule } from './province/province.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ScheduleModule.forRoot(),
    UserModule,
    BannerModule,
    PropritiesModule,
    AuthModule,
    AlbumModule,
    TransistorModule,
    SaveModule,
    CommentModule,
    NotificationModule,
    StatsModule,
    FiltersearchModule,
    ProvinceModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
