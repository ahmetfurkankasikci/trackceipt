// src/domain/usecases/GetExpensesUseCase.ts
import { injectable, inject } from 'tsyringe';
import type { IExpenseRepository } from '../repositories/IExpenseRepository';
import { Expense } from '../models/Expense';

@injectable()
export class GetExpensesUseCase {
  constructor(
    @inject('IExpenseRepository') private readonly expenseRepository: IExpenseRepository,
  ) {}

  /**
   * Masrafları dinlemeye başlar ve her güncellemede callback'i tetikler.
   * @param onUpdate Güncel masraf listesini alan fonksiyon.
   * @returns Dinlemeyi durdurmak için bir unsubscribe fonksiyonu.
   */
  execute(onUpdate: (expenses: Expense[]) => void): () => void {
    return this.expenseRepository.getAllExpenses(onUpdate);
  }
}
