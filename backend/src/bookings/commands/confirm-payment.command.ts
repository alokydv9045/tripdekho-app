export class ConfirmPaymentCommand {
  constructor(
    public readonly userId: string,
    public readonly bookingId: string,
    public readonly razorpayPaymentId: string,
    public readonly razorpaySignature: string,
  ) {}
}
