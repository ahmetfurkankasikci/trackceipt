// src/core/di/container.ts

// Bu import, tsyringe'in çalışması için her zaman en üstte olmalıdır!
import 'reflect-metadata';
import { container } from 'tsyringe';

// Bağımlılıkları import ediyoruz
import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { FirestoreExpenseRepositoryImpl } from '../../data/repositories/FirestoreExpenseRepositoryImpl';
import { AiVisionService } from '../../data/services/AiVisionService';
import { GetExpensesUseCase } from '../../domain/usecases/GetExpensesUseCase';
import { AnalyzeAndAddExpenseUseCase } from '../../domain/usecases/AnalyzeAndAddExpenseUseCase';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { FirebaseAuthRepositoryImpl } from '../../data/repositories/FirebaseAuthRepositoryImpl';
import { OnAuthStateChangedUseCase } from '../../domain/usecases/OnAuthStateChangedUseCase';
import { LogoutUseCase } from '../../domain/usecases/LogoutUseCase';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { SignUpUseCase } from '../../domain/usecases/SignUpUseCase';
import { DeleteExpenseUseCase } from '../../domain/usecases/DeleteExpenseUseCase';
import { UpdateExpenseUseCase } from '../../domain/usecases/UpdateExpenseUseCase';
import { AddCategoryUseCase, DeleteCategoryUseCase, GetAllCategoriesUseCase, UpdateCategoryUseCase } from '../../domain/usecases/CategoryUseCases';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { FirestoreCategoryRepositoryImpl } from '../../data/repositories/FirestoreCategoryRepositoryImpl';

// --- Bağımlılıkların Kaydedilmesi (Dependency Registration) ---

// Kural: Somut sınıfları (class) doğrudan, arayüzleri (interface) ise
// bir "token" (string) kullanarak kaydederiz.

// AiVisionService'i bir singleton olarak kaydediyoruz.
// Bu, uygulama boyunca sadece tek bir AiVisionService örneği oluşturulacağı anlamına gelir.
container.registerSingleton(AiVisionService);

// FirestoreExpenseRepositoryImpl'i, 'IExpenseRepository' token'ı için kaydediyoruz.
// Kodun herhangi bir yerinde bir 'IExpenseRepository' istendiğinde,
// tsyringe otomatik olarak bir FirestoreExpenseRepositoryImpl örneği sağlayacaktır.
container.registerSingleton<IExpenseRepository>('IExpenseRepository', FirestoreExpenseRepositoryImpl);

container.register(DeleteExpenseUseCase, {
  useFactory: (c) => new DeleteExpenseUseCase(c.resolve('IExpenseRepository'))
})
container.register(AnalyzeAndAddExpenseUseCase, {
  useFactory: (c) => new AnalyzeAndAddExpenseUseCase(
    c.resolve(AiVisionService),
    c.resolve('IExpenseRepository')
  )
});

container.register(GetExpensesUseCase, {
  useFactory: (c) => new GetExpensesUseCase(c.resolve('IExpenseRepository'))
});
container.registerSingleton<IAuthRepository>('IAuthRepository', FirebaseAuthRepositoryImpl);
container.registerSingleton<ICategoryRepository>('ICategoryRepository', FirestoreCategoryRepositoryImpl);

container.register(SignUpUseCase, {
  useFactory: (c) => new SignUpUseCase(c.resolve('IAuthRepository'))
});

container.register(LoginUseCase, {
  useFactory: (c) => new LoginUseCase(c.resolve('IAuthRepository'))
});

container.register(LogoutUseCase, {
  useFactory: (c) => new LogoutUseCase(c.resolve('IAuthRepository'))
});

container.register(OnAuthStateChangedUseCase, {
  useFactory: (c) => new OnAuthStateChangedUseCase(c.resolve('IAuthRepository'))
});
container.register(UpdateExpenseUseCase, {
  useFactory: (c) => new UpdateExpenseUseCase(c.resolve('IExpenseRepository'))
});

container.register(GetAllCategoriesUseCase, {
  useFactory: (c) => new GetAllCategoriesUseCase(c.resolve('ICategoryRepository'))
});

container.register(AddCategoryUseCase, {
  useFactory: (c) => new AddCategoryUseCase(c.resolve('ICategoryRepository'))
});

container.register(UpdateCategoryUseCase, {
  useFactory: (c) => new UpdateCategoryUseCase(c.resolve('ICategoryRepository'))
});

container.register(DeleteCategoryUseCase, {
  useFactory: (c) => new DeleteCategoryUseCase(c.resolve('ICategoryRepository'))
});

export default container;