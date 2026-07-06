import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetVendorQuery } from '../get-vendor.query';
import { IVendorRepository } from '../../ports/vendor.repository.interface';
import { VendorEntity } from '../../../entities/vendor.entity';

@QueryHandler(GetVendorQuery)
export class GetVendorHandler implements IQueryHandler<GetVendorQuery> {
  constructor(
    @Inject(IVendorRepository)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(query: GetVendorQuery): Promise<VendorEntity> {
    const { vendorId } = query;
    const vendor = await this.vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }
}
