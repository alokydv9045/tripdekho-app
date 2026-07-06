export class AdminUpdateTripStatusCommand {
  constructor(
    public readonly tripId: string,
    public readonly status: string,
    public readonly reason?: string,
  ) {}
}
