import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KeyService {
  private readKeyFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Could not find key file at path: ${filePath}. Error: ${error.message}`);
    }
  }

  getPrivateKey(): string {
    const privateKeyPath = path.resolve(__dirname, '../../../keys/private.key');
    return this.readKeyFile(privateKeyPath);
  }

  getPublicKey(): string {
    const publicKeyPath = path.resolve(__dirname, '../../../keys/public.key');
    return  this.readKeyFile(publicKeyPath);
  }

  getRefTokenPrivateKey(): string {
const refreshTokenPath = path.resolve(__dirname, '../../../keys/refresh_private.key');
return this.readKeyFile(refreshTokenPath);
  }
}
