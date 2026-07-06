import { LoginDto } from '../dto/login.dto';

export class LoginUserCommand {
  constructor(public readonly loginDto: LoginDto) {}
}
