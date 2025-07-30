import { injectable, inject } from 'tsyringe';
import type { IAuthRepository } from '../repositories/IAuthRepository';

@injectable()
export class LogoutUseCase {
  constructor(
    @inject('IAuthRepository') private readonly authRepository: IAuthRepository,
  ) {}


  execute(): Promise<void> {
    return this.authRepository.logout();
  }
}