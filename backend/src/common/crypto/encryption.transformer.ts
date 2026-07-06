import { ValueTransformer } from 'typeorm';
import { EncryptionService } from './encryption.service';

export const encryptionTransformer: ValueTransformer = {
  to(value: string): string {
    if (value === null || value === undefined) return value;
    return EncryptionService.encrypt(value);
  },
  from(value: string): string {
    if (value === null || value === undefined) return value;
    return EncryptionService.decrypt(value);
  },
};
