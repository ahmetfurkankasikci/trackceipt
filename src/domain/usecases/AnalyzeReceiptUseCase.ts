import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { AiVisionService } from '../../data/services/AiVisionService';
import Expense from '../models/Expense';

@injectable()
export class AnalyzeReceiptUseCase {
    constructor(
        @inject(AiVisionService) private readonly aiVisionService: AiVisionService,
    ) { }

    async execute(base64Image: string, signal?: AbortSignal): Promise<Omit<Expense, 'id' | 'userId'>> {
        const analyzedData = await this.aiVisionService.analyzeReceipt(base64Image, signal);
        // userId ve id hariç, AI'dan gelen veriyi döndür.
        return {
            amount: analyzedData.totalAmount,
            category: "", // Kategori onaysız başlasın
            categoryId: null,
            shopName: analyzedData.shopName || 'İsimsiz Mağaza',
            date: analyzedData.transactionDate == null ? new Date : new Date(analyzedData.transactionDate), // Tarihi Date nesnesine çevir
            //receiptImageUrl: null, // Resim URL'si kaydetme sırasında eklenecek
        };
    }
}