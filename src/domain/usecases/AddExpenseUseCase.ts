import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import type { IExpenseRepository } from '../repositories/IExpenseRepository';
import type Expense from '../models/Expense';

@injectable()
export class AddExpenseUseCase {
    constructor(
        @inject('IExpenseRepository') private readonly expenseRepository: IExpenseRepository,
    ) { }

    async execute(expenseData: Omit<Expense, 'id'>): Promise<void> {
        await this.expenseRepository.addExpense(expenseData);
    }
}