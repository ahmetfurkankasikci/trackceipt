import { GetExpensesUseCase } from "../../../domain/usecases/GetExpensesUseCase";
import { Expense } from "../../../domain/models/Expense";

export class HomeViewModel {
    expenses: Expense[] = [];
    isLoading: boolean = false;
    error: string | null = null;

    constructor(private getExpensesUseCase: GetExpensesUseCase) { }

     async loadExpenses() {
        this.isLoading = true;
        this.error = null;
        try {
            this.expenses = await this.getExpensesUseCase.execute();
        } catch (error: any) {
            console.error("Expenses yüklenirken hata oluştu:", error);
            this.error = error.message || "Failed to load expenses";

        } finally {
            this.isLoading = false;
        }
    }
}
