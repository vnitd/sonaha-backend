import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ShareModule } from 'src/shared/sharedModule';
import { AuthModule } from 'src/auth/auth.module';
import { KeyModule } from 'src/proprities/key/key.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ShareModule, AuthModule, KeyModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
