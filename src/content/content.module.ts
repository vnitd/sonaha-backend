import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AlbumModule } from 'src/album/album.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { KeyModule } from 'src/proprities/key/key.module';
import { ShareModule } from 'src/shared/sharedModule';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule, AlbumModule],
  providers: [ContentService, PrismaService],
  controllers: [ContentController],
})
export class ContentModule {}
