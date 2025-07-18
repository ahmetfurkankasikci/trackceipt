// src/domain/usecases/AnalyzeAndAddExpenseUseCase.ts

import { AiVisionService, AnalyzedExpenseData } from '../../data/services/AiVisionService';
import type { IExpenseRepository } from '../repositories/IExpenseRepository';
import { Expense } from '../models/Expense';
import { injectable, inject } from 'tsyringe';

/**
 * Bu UseCase, bir fiş görselini alıp, yapay zeka ile analiz edip,
 * sonucu bir masraf olarak veritabanına ekleme iş akışını yönetir.
 */
@injectable()
export class AnalyzeAndAddExpenseUseCase {
    constructor(
        @inject(AiVisionService) private readonly aiVisionService: AiVisionService,
        @inject('IExpenseRepository') private readonly expenseRepository: IExpenseRepository,
    ) { }

    async execute(base64Image: string): Promise<void> {
        try {
            // 1. Adım: AI servisi ile fişi analiz et.
            const analyzedData: AnalyzedExpenseData = await this.aiVisionService.analyzeReceipt(base64Image);

            // 2. Adım: Gelen veriyi doğrula ve bir Expense modeline dönüştür.
            if (!analyzedData.totalAmount || !analyzedData.transactionDate) {
                throw new Error('Yapay zeka fişten yeterli bilgiyi alamadı.');
            }

            const newExpense: Expense = {
                amount: analyzedData.totalAmount,
                category: 'Analiz Edildi', // Veya kullanıcıya seçtirilebilir
                description: analyzedData.shopName || 'İsimsiz Mağaza',
                date: new Date(analyzedData.transactionDate),
                // İleride resim URL'si de saklanabilir.
            };

            // 3. Adım: Oluşturulan masrafı repository aracılığıyla veritabanına ekle.
            await this.expenseRepository.addExpense(newExpense);

        } catch (error) {
            console.error('AnalyzeAndAddExpenseUseCase hatası:', error);
            // Hatanın kaynağını koruyarak yeniden fırlat.
            throw error;
        }
    }
}