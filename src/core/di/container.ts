
import 'reflect-metadata';
import { container } from 'tsyringe';


import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import { FirestoreExpenseRepositoryImpl } from '../../data/repositories/FirestoreExpenseRepositoryImpl';
import { AiVisionService } from '../../data/services/AiVisionService';
import { GetExpensesUseCase } from '../../domain/usecases/GetExpensesUseCase';
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
import { AnalyzeReceiptUseCase } from '../../domain/usecases/AnalyzeReceiptUseCase';
import { AddExpenseUseCase } from '../../domain/usecases/AddExpenseUseCase';


container.registerSingleton(AiVisionService);

container.registerSingleton<IExpenseRepository>('IExpenseRepository', FirestoreExpenseRepositoryImpl);

container.register(DeleteExpenseUseCase, {
  useFactory: (c) => new DeleteExpenseUseCase(c.resolve('IExpenseRepository'))
})

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
container.register(AnalyzeReceiptUseCase, {
  useFactory: c => new AnalyzeReceiptUseCase(c.resolve(AiVisionService)),
});

container.register(AddExpenseUseCase, {
  useFactory: c => new AddExpenseUseCase(c.resolve('IExpenseRepository')),
});
export default container;