import { injectable, inject } from 'tsyringe';
import type { IExpenseRepository } from '../repositories/IExpenseRepository';
import Expense from '../models/Expense';

@injectable()
export class UpdateExpenseUseCase {
    constructor(
        @inject('IExpenseRepository') private readonly expenseRepository: IExpenseRepository,
    ) { }

    execute(expense: Expense): Promise<void> {
        return this.expenseRepository.updateExpense(expense);
    }
}