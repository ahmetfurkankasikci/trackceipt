import { AiVisionService, AnalyzedExpenseData } from '../../data/services/AiVisionService';
import type { IExpenseRepository } from '../repositories/IExpenseRepository';
import Expense from '../models/Expense';
import { injectable, inject } from 'tsyringe';

@injectable()
export class AnalyzeAndAddExpenseUseCase {
    constructor(
        @inject(AiVisionService) private readonly aiVisionService: AiVisionService,
        @inject('IExpenseRepository') private readonly expenseRepository: IExpenseRepository,
    ) { }

    async execute(base64Image: string, userId: string): Promise<void> {
        try {
          
            const analyzedData: AnalyzedExpenseData = await this.aiVisionService.analyzeReceipt(base64Image);

       
            if (!analyzedData.totalAmount || !analyzedData.transactionDate) {
                throw new Error('Yapay zeka fişten yeterli bilgiyi alamadı.');
            }

            const newExpense: Expense = {
                amount: analyzedData.totalAmount,
                userId: userId,
                category: 'Analiz Edildi',
                description: analyzedData.shopName || 'İsimsiz Mağaza',
                date: new Date(analyzedData.transactionDate),
                categoryId: null
            };

            await this.expenseRepository.addExpense(newExpense);

        } catch (error) {
            console.error('AnalyzeAndAddExpenseUseCase hatası:', error);
            throw error;
        }
    }
}