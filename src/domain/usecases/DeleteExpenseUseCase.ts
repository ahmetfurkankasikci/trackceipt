import { injectable, inject } from 'tsyringe';
import type { IExpenseRepository } from '../repositories/IExpenseRepository';

@injectable()
export class DeleteExpenseUseCase {
  constructor(
    @inject('IExpenseRepository') private readonly expenseRepository: IExpenseRepository,
  ) {}

  execute(expenseId: string): Promise<void> {
    return this.expenseRepository.deleteExpense(expenseId);
  }
}