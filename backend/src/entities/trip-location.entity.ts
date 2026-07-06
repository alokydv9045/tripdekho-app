import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TripEntity } from './trip.entity';

@Entity('trip_locations')
export class TripLocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => TripEntity, (trip) => trip.location, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip: TripEntity;

  @Index()
  @Column()
  city: string;

  @Index()
  @Column({ nullable: true })
  state: string;

  @Index()
  @Column()
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ nullable: true })
  startLocation: string;

  @Column({ nullable: true })
  endLocation: string;

  @Column('simple-array', { nullable: true })
  pickupLocations: string[];
}
