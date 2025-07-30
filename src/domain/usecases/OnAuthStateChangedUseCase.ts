import { injectable, inject } from 'tsyringe';
import type { IAuthRepository } from '../repositories/IAuthRepository';
import User  from '../models/User';
@injectable()
export class OnAuthStateChangedUseCase {
  constructor(
    @inject('IAuthRepository') private readonly authRepository: IAuthRepository,
  ) {}


  execute(callback: (user: User | null) => void): () => void {
    return this.authRepository.onAuthStateChanged(callback);
  }
}