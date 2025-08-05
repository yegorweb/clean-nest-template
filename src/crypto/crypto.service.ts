import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt'

@Injectable()
export class CryptoService {
  createSHA256(str: string) {
    return crypto.createHash('sha256').update(str).digest('hex')
  }
  async createPasswordHash(password: string) {
    return await bcrypt.hash(password, 10)
  }
  async comparePasswords(password1: string, password2: string) {
    return await bcrypt.compare(password1, password2)
  }
}
