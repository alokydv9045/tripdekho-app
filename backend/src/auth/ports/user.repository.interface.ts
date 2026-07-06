import { UserEntity } from '../../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  create(data: Partial<UserEntity>): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByPhone(phone: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
}
