import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AlbumModule } from 'src/album/album.module';
import { AuthModule } from 'src/auth/auth.module';
import { KeyModule } from 'src/proprities/key/key.module';
import { ShareModule } from 'src/shared/sharedModule';
import { PropritiesController } from './proprities.controller';
import { PropertyService } from './proprities.service';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule, AlbumModule],
  controllers: [PropritiesController],
  providers: [PropertyService],
  exports:[PropertyService]
})
export class PropertyModule {}
