export class CalculatePriceQuery {
  constructor(
    public readonly tripId: string,
    public readonly departureId: string,
    public readonly numberOfGuests: number,
    public readonly userId?: string,
    public readonly pointsToRedeem?: number,
  ) {}
}
