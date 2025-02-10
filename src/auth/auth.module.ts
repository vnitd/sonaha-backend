import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './stratergy/jwt.stratergy';
import { ShareModule } from 'src/shared/sharedModule';
import { JwtAuthGuard } from './stratergy/jwt.guard';
import { EmailModule } from 'src/email/email.module';
import { KeyModule } from 'src/proprities/key/key.module';

@Module({
  imports: [JwtModule.register({}), KeyModule, ShareModule,EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule, AuthService], 
})
export class AuthModule {}
