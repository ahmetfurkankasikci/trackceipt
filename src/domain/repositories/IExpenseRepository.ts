import { Expense } from "../models/Expense";

export interface IExpenseRepository {
    getAllExpenses(): Promise<Expense[]>;
    getExpenseById(id: number): Promise<Expense | null>;
    addExpense(expense: Expense): Promise<void>;
}
