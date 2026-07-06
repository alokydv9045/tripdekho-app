import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  SUPER_ADMIN = 'super_admin',
  TECH_ADMIN = 'tech_admin',
  PLATFORM_ADMIN = 'platform_admin',
  FINANCE_ADMIN = 'finance_admin',
  GROWTH_ADMIN = 'growth_admin',
  SUPPORT_ADMIN = 'support_admin',
  OPERATIONS_ADMIN = 'operations_admin',
  ONBOARDING_ADMIN = 'onboarding_admin',
  CONTENT_ADMIN = 'content_admin',
  ADMIN = 'admin',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  name: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ select: false, nullable: true })
  passwordHash: string;

  @Column({ select: false, nullable: true })
  plainTextPassword: string;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @ManyToOne(() => RoleEntity, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  roleEntity: RoleEntity;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  avatar: { url: string; publicId: string } | null;

  @Column({ nullable: true })
  nickname: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'jsonb', nullable: true })
  location: any;

  @Column({ nullable: true, select: false })
  mfaSecret: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  resetPasswordOtp: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  resetPasswordOtpExpiresAt: Date | null;

  @Column({ default: false })
  isMfaEnabled: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  mustChangePassword: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
