import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { JwtModule } from '@nestjs/jwt';
import { KeyModule } from 'src/proprities/key/key.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
@Module({
  imports: [ AuthModule, KeyModule, JwtModule,EmailModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
