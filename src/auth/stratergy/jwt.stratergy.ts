import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { KeyService } from 'src/proprities/key/key.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    keyService: KeyService, // truyền cái keyService vào
  ) {
    const publicKey = keyService.getPublicKey();
    // giải mã dùng public key, login xài private key
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }
  prisma = new PrismaClient();
  // tokenDecode là thông tin cùa passPort, cụ thể là jwt stratery
  //Passport sẽ tự động giải mã token khi người dùng gửi request có chứa Bearer token trong header Authorization.
  async validate(tokenDecode: any) {
    console.log(tokenDecode); // nhờ cái token được set trong login qua đây
    let userId = tokenDecode.data.userId;
    const checkUser = await this.prisma.users.findFirst({
      where: {
        user_id: userId,
      },
    });
    if (!checkUser) {
      throw new Error('admin not found');
    }
    return tokenDecode;
  }
}
