import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CareerApplicationEntity } from './career-application.entity';

export enum PositionType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  CONTRACT = 'contract',
}

@Entity('career_positions')
export class CareerPositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 100, default: 'Remote' })
  location: string;

  @Column({ type: 'enum', enum: PositionType, default: PositionType.FULL_TIME })
  type: PositionType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ length: 100, nullable: true })
  salary: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => CareerApplicationEntity, (app) => app.position)
  applications: CareerApplicationEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
