import { IExpenseRepository } from "../repositories/IExpenseRepository";
import { Expense } from "../models/Expense";

export class GetExpensesUseCase {
    constructor(private expenseRepository: IExpenseRepository) {}

    async execute(): Promise<Expense[]> {
        return await this.expenseRepository.getAllExpenses();
    }
}
