import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TripEntity } from './trip.entity';

@Entity('trip_itineraries')
export class TripItineraryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TripEntity, (trip) => trip.itinerary, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  trip: TripEntity;

  @Column()
  dayNumber: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  accommodation?: string | null;

  @Column({ type: 'simple-json', nullable: true })
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };

  @Column({ type: 'simple-json', nullable: true })
  activities: Array<{
    title: string;
    time?: string;
    description?: string;
    location?: string;
  }>;
}
