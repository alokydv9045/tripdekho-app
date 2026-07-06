import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private static readonly algorithm = 'aes-256-gcm';

  private static readonly keyStr =
    process.env.ENCRYPTION_KEY ||
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  private static getKey(): Buffer {
    const key = Buffer.from(this.keyStr, 'hex');
    if (key.length !== 32) {
      return crypto.createHash('sha256').update(String(this.keyStr)).digest();
    }
    return key;
  }

  static encrypt(plaintext: string): string {
    if (!plaintext) return plaintext;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.getKey(), iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  static decrypt(ciphertext: string): string {
    if (!ciphertext) return ciphertext;

    if (!ciphertext.includes(':')) return ciphertext;

    try {
      const [ivHex, authTagHex, encrypted] = ciphertext.split(':');
      if (!ivHex || !authTagHex || !encrypted) return ciphertext;

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.getKey(),
        Buffer.from(ivHex, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Decryption failed, returning original ciphertext', error);
      return ciphertext;
    }
  }
}
