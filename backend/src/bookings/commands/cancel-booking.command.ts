export class CancelBookingCommand {
  constructor(
    public readonly userId: string,
    public readonly bookingId: string,
  ) {}
}
