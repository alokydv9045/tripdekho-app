import { VendorEntity } from '../../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';

export const IVendorRepository = Symbol('IVendorRepository');

export interface IVendorRepository {
  create(userId: string, data: CreateVendorDto): Promise<VendorEntity>;
  findById(id: string): Promise<VendorEntity | null>;
  findByUserId(userId: string): Promise<VendorEntity | null>;
}
