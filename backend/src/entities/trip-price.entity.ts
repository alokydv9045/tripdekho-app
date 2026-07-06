import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TripEntity } from './trip.entity';

export enum PriceType {
  PER_PERSON = 'per_person',
  PER_GROUP = 'per_group',
}

@Entity('trip_prices')
export class TripPriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => TripEntity, (trip) => trip.price, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip: TripEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ type: 'simple-enum', enum: PriceType, default: PriceType.PER_PERSON })
  priceType: PriceType;

  @Column({ type: 'simple-json', nullable: true })
  occupancyOptions: any;
}
