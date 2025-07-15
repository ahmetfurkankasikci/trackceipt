import { IExpenseRepository } from "../../domain/repositories/IExpenseRepository";
import { Expense } from "../../domain/models/Expense";

export class MockExpenseRepositoryImpl implements IExpenseRepository {
    private expenses: Expense[] = [
        new Expense(1, "Food", 50, new Date("2023-01-01"), "Lunch with friends"),
        new Expense(2, "Transport", 25, new Date("2023-01-02"), "Bus fare"),
        new Expense(3, "Shopping", 100, new Date("2023-01-03"), "New shirt"),
        new Expense(4, "Utilities", 75, new Date("2023-01-04"), "Electricity bill"),
        new Expense(5, "Entertainment", 30, new Date("2023-01-05"), "Movie ticket"),
    ];

    async getAllExpenses(): Promise<Expense[]> {
        return this.expenses;
    }

    async getExpenseById(id: number): Promise<Expense | null> {
        const expense = this.expenses.find(exp => exp.id === id);
        return expense || null;
    }

    async addExpense(expense: Expense): Promise<void> {
        this.expenses.push(expense);
    }
}
