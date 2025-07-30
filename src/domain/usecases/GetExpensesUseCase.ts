import { injectable, inject } from 'tsyringe';
import type { IExpenseRepository } from '../repositories/IExpenseRepository';
import Expense from '../models/Expense';

@injectable()
export class GetExpensesUseCase {
  constructor(
    @inject('IExpenseRepository') private readonly expenseRepository: IExpenseRepository,
  ) {}


  execute(userId: string, onUpdate: (expenses: Expense[]) => void): () => void {
    return this.expenseRepository.getAllExpenses(userId,onUpdate);
  }
}
