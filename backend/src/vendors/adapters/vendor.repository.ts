import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from '../../entities/vendor.entity';
import { UserEntity } from '../../entities/user.entity';
import { IVendorRepository } from '../ports/vendor.repository.interface';
import { CreateVendorDto } from '../dto/create-vendor.dto';

@Injectable()
export class VendorRepository implements IVendorRepository {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(userId: string, data: CreateVendorDto): Promise<VendorEntity> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const vendor = this.vendorRepo.create({
      ...data,
      user,
    });
    return this.vendorRepo.save(vendor);
  }

  async findById(id: string): Promise<VendorEntity | null> {
    return this.vendorRepo.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<VendorEntity | null> {
    return this.vendorRepo.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
  }
}
