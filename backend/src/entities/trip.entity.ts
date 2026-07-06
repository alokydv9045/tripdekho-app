import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { VendorEntity } from './vendor.entity';
import { TripLocationEntity } from './trip-location.entity';
import { TripPriceEntity } from './trip-price.entity';
import { TripDateEntity } from './trip-date.entity';
import { TripItineraryEntity } from './trip-itinerary.entity';
import { TripMediaEntity } from './trip-media.entity';

export enum TripCategory {
  ADVENTURE = 'adventure',
  CULTURAL = 'cultural',
  RELIGIOUS = 'religious',
  NATURE = 'nature',
  BEACH = 'beach',
  MOUNTAIN = 'mountain',
  WILDLIFE = 'wildlife',
  HERITAGE = 'heritage',
  WELLNESS = 'wellness',
  OFFBEAT = 'offbeat',
  HIKE = 'hike',
  SPIRITUAL = 'spiritual',
  OTHER = 'other',
  MULTIPLE = 'multiple',
}

export enum TripDifficulty {
  EASY = 'easy',
  MODERATE = 'moderate',
  CHALLENGING = 'challenging',
  EXTREME = 'extreme',
  NONE = 'none',
}

export enum TripStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('trips')
export class TripEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  vendor: VendorEntity;

  @Column('simple-array', { nullable: true })
  category: string[];

  @Column({
    type: 'simple-enum',
    enum: TripDifficulty,
    default: TripDifficulty.MODERATE,
  })
  difficulty: TripDifficulty;

  @Column()
  durationDays: number;

  @Column()
  durationNights: number;

  @Column({ default: 1 })
  minGroupSize: number;

  @Column({ default: 20 })
  maxGroupSize: number;

  @Column('simple-array', { nullable: true })
  highlights: string[];

  @Column('simple-array', { nullable: true })
  inclusions: string[];

  @Column('simple-array', { nullable: true })
  exclusions: string[];

  @Column('simple-array', { nullable: true })
  requirements: string[];

  @Column('simple-array', { nullable: true })
  thingsToCarry: string[];

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  importantNote: string;

  @Column('simple-array', { nullable: true })
  pickupLocations: string[];

  @Column('simple-array', { nullable: true })
  travelingLocations: string[];

  @Column({ type: 'simple-json', nullable: true })
  thumbnail: any;

  @Column({ type: 'simple-json', nullable: true })
  routeMapImage: any;

  @Column({ default: false })
  isCustomizable: boolean;

  @Column({ nullable: true })
  contactWhatsApp: string;

  @Column({ type: 'simple-enum', enum: TripStatus, default: TripStatus.DRAFT })
  status: TripStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @OneToOne(() => TripLocationEntity, (location) => location.trip, {
    cascade: true,
  })
  location: TripLocationEntity;

  @OneToOne(() => TripPriceEntity, (price) => price.trip, { cascade: true })
  price: TripPriceEntity;

  @OneToMany(() => TripDateEntity, (date) => date.trip, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  dates: TripDateEntity[];

  @OneToMany(() => TripItineraryEntity, (itinerary) => itinerary.trip, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  itinerary: TripItineraryEntity[];

  @OneToMany(() => TripMediaEntity, (media) => media.trip, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  media: TripMediaEntity[];

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
