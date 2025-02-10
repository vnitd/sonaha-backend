import { Module } from '@nestjs/common';
import { SaveService } from './save.service';
import { SaveController } from './save.controller';
import { JwtModule } from '@nestjs/jwt';
import { KeyModule } from 'src/proprities/key/key.module';
import { ShareModule } from 'src/shared/sharedModule';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule],
  controllers: [SaveController],
  providers: [SaveService],
})
export class SaveModule {}
