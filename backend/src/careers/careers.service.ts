import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerPositionEntity } from '../entities/career-position.entity';
import {
  CareerApplicationEntity,
  ApplicationStatus,
} from '../entities/career-application.entity';
import { ApplyCareerDto } from './dto/apply-career.dto';

import { CareerGalleryEntity } from '../entities/career-gallery.entity';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(CareerPositionEntity)
    private readonly positionRepo: Repository<CareerPositionEntity>,
    @InjectRepository(CareerApplicationEntity)
    private readonly applicationRepo: Repository<CareerApplicationEntity>,
    @InjectRepository(CareerGalleryEntity)
    private readonly galleryRepo: Repository<CareerGalleryEntity>,
  ) {}

  // ─── Public Methods ───

  async getActivePositions() {
    const positions = await this.positionRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return { positions };
  }

  async getGalleryImages() {
    const images = await this.galleryRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { images };
  }

  async getPositionById(id: string) {
    const position = await this.positionRepo.findOne({ where: { id } });
    if (!position) throw new NotFoundException('Position not found');
    return { position };
  }

  async submitApplication(data: ApplyCareerDto) {
    const application = new CareerApplicationEntity();
    application.name = data.name;
    application.email = data.email;
    if (data.phone) application.phone = data.phone;
    if (data.positionId) application.position_id = data.positionId;
    if (data.resumeUrl) application.resumeUrl = data.resumeUrl;
    if (data.coverLetter) application.coverLetter = data.coverLetter;
    application.status = ApplicationStatus.PENDING;
    await this.applicationRepo.save(application);
    return { success: true, message: 'Application submitted successfully' };
  }

  // ─── Admin Methods ───

  async getAllPositions(query: any) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const [positions, total] = await this.positionRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: { applications: true },
    });

    // Append application count
    const positionsWithCount = positions.map((p) => ({
      ...p,
      applicationCount: p.applications?.length || 0,
      applications: undefined,
    }));

    return {
      positions: positionsWithCount,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  }

  async createPosition(data: any) {
    const position = this.positionRepo.create({
      title: data.title,
      department: data.department,
      location: data.location || 'Remote',
      type: data.type || 'full_time',
      description: data.description || '',
      requirements: data.requirements || null,
      salary: data.salary || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
    const saved = await this.positionRepo.save(position);
    return { position: saved };
  }

  async updatePosition(id: string, data: any) {
    const position = await this.positionRepo.findOne({ where: { id } });
    if (!position) throw new NotFoundException('Position not found');
    await this.positionRepo.update(id, data);
    const updated = await this.positionRepo.findOne({ where: { id } });
    return { position: updated };
  }

  async togglePosition(id: string) {
    const position = await this.positionRepo.findOne({ where: { id } });
    if (!position) throw new NotFoundException('Position not found');
    position.isActive = !position.isActive;
    const saved = await this.positionRepo.save(position);
    return { position: saved };
  }

  async deletePosition(id: string) {
    const position = await this.positionRepo.findOne({ where: { id } });
    if (!position) throw new NotFoundException('Position not found');
    await this.positionRepo.remove(position);
    return { success: true };
  }

  async getApplications(query: any) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const qb = this.applicationRepo
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.position', 'position')
      .orderBy('app.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.status) {
      qb.andWhere('app.status = :status', { status: query.status });
    }

    if (query.positionId) {
      qb.andWhere('app.position_id = :positionId', {
        positionId: query.positionId,
      });
    }

    const [applications, total] = await qb.getManyAndCount();

    return {
      applications,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    const application = await this.applicationRepo.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    application.status = status;
    const saved = await this.applicationRepo.save(application);
    return { application: saved };
  }

  // ─── Admin Gallery Methods ───

  async getAllGalleryImages() {
    const images = await this.galleryRepo.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { images };
  }

  async createGalleryImage(data: any) {
    const image = this.galleryRepo.create({
      imageUrl: data.imageUrl,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
    const saved = await this.galleryRepo.save(image);
    return { image: saved };
  }

  async toggleGalleryImage(id: string) {
    const image = await this.galleryRepo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    image.isActive = !image.isActive;
    const saved = await this.galleryRepo.save(image);
    return { image: saved };
  }

  async deleteGalleryImage(id: string) {
    const image = await this.galleryRepo.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    await this.galleryRepo.remove(image);
    return { success: true };
  }
}
