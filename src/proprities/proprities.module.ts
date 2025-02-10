import { Module } from '@nestjs/common';
import { PropritiesService } from './proprities.service';
import { PropritiesController } from './proprities.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ShareModule } from 'src/shared/sharedModule';
import { JwtModule } from '@nestjs/jwt';
import { KeyModule } from 'src/proprities/key/key.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule, AlbumModule],
  controllers: [PropritiesController],
  providers: [PropritiesService],
})
export class PropritiesModule {}
