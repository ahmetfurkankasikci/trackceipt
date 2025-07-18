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


container.register(AnalyzeAndAddExpenseUseCase, {
  useFactory: (c) => new AnalyzeAndAddExpenseUseCase(
    c.resolve(AiVisionService),
    c.resolve('IExpenseRepository')
  )
});

container.register(GetExpensesUseCase, {
  useFactory: (c) => new GetExpensesUseCase(c.resolve('IExpenseRepository'))
});


export default container;