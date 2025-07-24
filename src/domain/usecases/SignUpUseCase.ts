import { injectable, inject } from 'tsyringe';
import type { IAuthRepository } from '../repositories/IAuthRepository';
import User  from '../models/User';

@injectable()
export class SignUpUseCase {
  constructor(
    @inject('IAuthRepository') private readonly authRepository: IAuthRepository,
  ) {}

  execute(email: string, password: string): Promise<User | null> {
    return this.authRepository.signUp(email, password);
  }
}