import { GEMINI_API_KEY } from '@env';
import Logger from '../../utils/Logger';
export interface AnalyzedExpenseData {
    totalAmount: number | null;
    shopName: string | null;
    transactionDate: string | null;
}

export class AiVisionService {
    private readonly API_KEY = GEMINI_API_KEY;

    private readonly API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`;


    async analyzeReceipt(base64Image: string, signal?: AbortSignal): Promise<AnalyzedExpenseData> {
        const prompt = `
      Bu bir alışveriş fişinin görselidir. Lütfen bu fişi analiz et ve aşağıdaki bilgileri içeren, başka hiçbir açıklama olmadan, sadece geçerli bir JSON nesnesi döndür:
      - "totalAmount": Fiştin genel toplam tutarı (sayı olarak).
      - "shopName": Mağazanın veya işletmenin adı (metin olarak ve kelimelerin sadece ilk harfi büyük harf olmalı).
      - "transactionDate": Fişin tarihi (YYYY-MM-DD formatında).
      Eğer bir bilgiyi bulamazsan, alanı null olarak bırak.
    `;

        // Clean base64 string - remove data URI prefix if present
        const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: cleanBase64,
                            },
                        },
                    ],
                },
            ],
        };

        try {
            Logger.info('Sending request to Gemini API...');
            Logger.info('Base64 length:', cleanBase64.length);

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal, // Pass the abort signal to fetch
            });

            if (!response.ok) {
                const errorBody = await response.json();
                Logger.error('API Hata Detayı:', JSON.stringify(errorBody, null, 2));
                Logger.error('Status:', response.status);
                Logger.error('Status Text:', response.statusText);
                throw new Error(`API isteği başarısız oldu: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`);
            }

            const responseData = await response.json();


            const text = responseData.candidates[0].content.parts[0].text;

            // Daha güvenli JSON çıkarma işlemi
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('AI yanıtında geçerli JSON formatı bulunamadı.');
            }

            let parsedData: any;
            try {
                parsedData = JSON.parse(jsonMatch[0]);
            } catch (e: any) {
                throw new Error('JSON ayrıştırma hatası: ' + e.message);
            }

            // Basit veri doğrulama (Validation)
            const validatedData: AnalyzedExpenseData = {
                totalAmount: typeof parsedData.totalAmount === 'number' ? parsedData.totalAmount : null,
                shopName: typeof parsedData.shopName === 'string' ? parsedData.shopName : null,
                transactionDate: typeof parsedData.transactionDate === 'string' ? parsedData.transactionDate : null,
            };

            return validatedData;

        } catch (error) {
            Logger.error('Gemini API analizi sırasında hata oluştu:', error);
            throw error; // Re-throw to preserve error type (including AbortError)
        }
    }
}
