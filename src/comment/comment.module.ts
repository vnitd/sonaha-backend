import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { JwtModule } from '@nestjs/jwt';
import { KeyModule } from 'src/proprities/key/key.module';
import { ShareModule } from 'src/shared/sharedModule';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
