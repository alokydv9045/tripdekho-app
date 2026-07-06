import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VendorEntity } from './vendor.entity';
import { encryptionTransformer } from '../common/crypto/encryption.transformer';

@Entity('vendor_bank_accounts')
export class VendorBankAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  vendor: VendorEntity;

  @Column()
  accountHolderName: string;

  @Column({ transformer: encryptionTransformer })
  accountNumberEncrypted: string;

  @Column({ length: 11 })
  ifscCode: string;

  @Column()
  bankName: string;

  @Column({ nullable: true })
  branchName: string;

  @Column({ default: 'savings' })
  accountType: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ default: false })
  isPrimary: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
