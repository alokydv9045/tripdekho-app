import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('global_settings')
export class GlobalSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, default: 'default' })
  configName: string;

  @Column({ default: '+91 1800-TRIP-DEKHO' })
  brandPhone: string;

  @Column({ default: 'support@tripdekho.com' })
  brandEmail: string;

  @Column({ type: 'text', nullable: true })
  brandDescription: string;

  @Column({ nullable: true })
  brandAddress: string;

  @Column({ default: '911234567890' })
  whatsappNumber: string;

  @Column({ default: '10am - 12am' })
  operationTiming: string;

  @Column({ type: 'simple-json', nullable: true })
  socialLinks: Record<string, string>;

  @Column({ type: 'simple-json', nullable: true })
  heroStats: Record<string, any>;

  @Column({ default: false })
  isMaintenanceMode: boolean;

  @Column({ type: 'text', nullable: true })
  maintenanceMessage: string;

  @Column({ default: false })
  alertActive: boolean;

  @Column({ type: 'text', nullable: true })
  alertMessage: string;

  @Column({ default: 'info' })
  alertType: string;

  @Column({ type: 'simple-json', nullable: true })
  commissionRates: Record<string, number>;

  @Column({ type: 'simple-json', nullable: true })
  adminModulePermissions: Record<string, string[]>;

  @Column({ type: 'text', nullable: true })
  vlogTrailerUrl: string;

  @Column({ type: 'simple-json', nullable: true })
  creatorSpotlight: any[];

  @Column({ type: 'timestamp', nullable: true })
  lockdownTimestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
