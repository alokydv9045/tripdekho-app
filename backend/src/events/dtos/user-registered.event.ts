export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly referralCode?: string,
    public readonly generatedPassword?: string,
    public readonly phone?: string,
  ) {}
}
