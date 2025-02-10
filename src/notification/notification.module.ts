import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { JwtModule } from '@nestjs/jwt';
import { KeyModule } from 'src/proprities/key/key.module';
import { ShareModule } from 'src/shared/sharedModule';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
