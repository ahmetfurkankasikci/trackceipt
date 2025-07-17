import { Expense } from "../models/Expense";

export interface IExpenseRepository {
    getAllExpenses(onExpensesUpdate: (expenses: Expense[]) => void): () => void;
    getExpenseById(id: number): Promise<Expense | null>;
    addExpense(expense: Expense): Promise<void>;
}
