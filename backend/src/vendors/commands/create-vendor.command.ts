import { CreateVendorDto } from '../dto/create-vendor.dto';

export class CreateVendorCommand {
  constructor(
    public readonly userId: string,
    public readonly createVendorDto: CreateVendorDto,
  ) {}
}
