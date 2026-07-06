import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('vendors')
export class VendorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ length: 200 })
  businessName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  logo: { url: string; publicId: string } | null;

  @Column({ type: 'jsonb', nullable: true })
  banner: { url: string; publicId: string } | null;

  @Column()
  contactEmail: string;

  @Column()
  contactPhone: string;

  @Column({ default: 'pending' })
  verificationStatus: string;

  @Column({ default: 'pending' })
  kycStatus: string;

  @Column({ type: 'jsonb', nullable: true })
  kycDocuments: {
    panCard?: { url: string; publicId: string };
    aadharFront?: { url: string; publicId: string };
    aadharBack?: { url: string; publicId: string };
    gstCertificate?: { url: string; publicId: string };
    businessRegistration?: { url: string; publicId: string };
  } | null;

  @Column({ default: 'standard' })
  subscriptionTier: string;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  razorpayAccountId: string;

  @Column({ default: 'pending' })
  razorpayLinkedAccountStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
