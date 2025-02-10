import { Module } from '@nestjs/common';
import { TransistorService } from './transistor.service';
import { TransistorController } from './transistor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ShareModule } from 'src/shared/sharedModule';
import { KeyModule } from 'src/proprities/key/key.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule],
  controllers: [TransistorController],
  providers: [TransistorService],
})
export class TransistorModule {}
