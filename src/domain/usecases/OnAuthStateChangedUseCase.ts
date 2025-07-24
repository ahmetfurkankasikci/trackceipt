import { injectable, inject } from 'tsyringe';
import type { IAuthRepository } from '../repositories/IAuthRepository';
import User  from '../models/User';
@injectable()
export class OnAuthStateChangedUseCase {
  constructor(
    @inject('IAuthRepository') private readonly authRepository: IAuthRepository,
  ) {}

  /**
   * Firebase'deki kullanıcı oturum durumunu (giriş yaptı/çıkış yaptı)
   * gerçek zamanlı olarak dinlemek için kullanılır. Bu, uygulamanın en başında
   * bir kere çağrılır ve Redux store'u güncel tutar.
   * @param callback Kullanıcı durumu değiştiğinde (giriş/çıkış) tetiklenecek fonksiyon.
   * @returns Dinleyiciyi sonlandırmak için bir unsubscribe fonksiyonu.
   */
  execute(callback: (user: User | null) => void): () => void {
    return this.authRepository.onAuthStateChanged(callback);
  }
}