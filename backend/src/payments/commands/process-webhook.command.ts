export class ProcessRazorpayWebhookCommand {
  constructor(
    public readonly signature: string,
    public readonly rawBody: string,
    public readonly event: string,
    public readonly payload: any,
  ) {}
}
