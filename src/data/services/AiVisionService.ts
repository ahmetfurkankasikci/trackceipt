import { GEMINI_API_KEY } from '@env';
export interface AnalyzedExpenseData {
    totalAmount: number | null;
    shopName: string | null;
    transactionDate: string | null; 
}

export class AiVisionService {
    private readonly API_KEY = GEMINI_API_KEY;
    private readonly API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.API_KEY}`;


    async analyzeReceipt(base64Image: string): Promise<AnalyzedExpenseData> {
        const prompt = `
      Bu bir alışveriş fişinin görselidir. Lütfen bu fişi analiz et ve aşağıdaki bilgileri içeren, başka hiçbir açıklama olmadan, sadece geçerli bir JSON nesnesi döndür:
      - "totalAmount": Fiştin genel toplam tutarı (sayı olarak).
      - "shopName": Mağazanın veya işletmenin adı (metin olarak).
      - "transactionDate": Fişin tarihi (YYYY-MM-DD formatında).
      Eğer bir bilgiyi bulamazsan, alanı null olarak bırak.
    `;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
        };

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                
                const errorBody = await response.json();
                console.error('API Hata Detayı:', JSON.stringify(errorBody, null, 2));
                throw new Error(`API isteği başarısız oldu: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();

            
            let jsonText = responseData.candidates[0].content.parts[0].text;
            jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData: AnalyzedExpenseData = JSON.parse(jsonText);

            return parsedData;

        } catch (error) {
            console.error('Gemini API analizi sırasında hata oluştu:', error);
            throw new Error('Fiş analizi yapılamadı.');
        }
    }
}
