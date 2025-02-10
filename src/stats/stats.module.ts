import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { JwtModule } from '@nestjs/jwt';
import { KeyModule } from 'src/proprities/key/key.module';
import { ShareModule } from 'src/shared/sharedModule';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, ShareModule, KeyModule, JwtModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
