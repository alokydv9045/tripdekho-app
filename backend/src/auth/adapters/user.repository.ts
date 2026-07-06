import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { IUserRepository } from '../ports/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.passwordHash')
      .addSelect('user.mfaSecret')
      .getOne();
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const cleanPhone = phone.replace(/\D/g, '');
    const last10 = cleanPhone.slice(-10);

    const query = this.userRepo.createQueryBuilder('user');

    if (last10.length === 10) {
      query.where(
        'user.phone = :phone OR user.phone = :last10 OR user.phone = :withPlus91 OR user.phone = :with91',
        {
          phone,
          last10,
          withPlus91: `+91${last10}`,
          with91: `91${last10}`,
        },
      );
    } else {
      query.where('user.phone = :phone', { phone });
    }

    return query
      .addSelect('user.passwordHash')
      .addSelect('user.mfaSecret')
      .getOne();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepo.save(user);
  }
}
