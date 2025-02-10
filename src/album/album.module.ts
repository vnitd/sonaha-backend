import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ShareModule } from 'src/shared/sharedModule'
import { JwtModule } from '@nestjs/jwt';
import { KeyModule } from 'src/proprities/key/key.module';

@Module({
  imports:[AuthModule,ShareModule,KeyModule,JwtModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports:[AlbumService]
})
export class AlbumModule {}
