import { CreateTripDto } from '../dto/create-trip.dto';

export class CreateTripCommand {
  constructor(
    public readonly userId: string,
    public readonly createTripDto: CreateTripDto,
  ) {}
}
