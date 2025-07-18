import { GEMINI_API_KEY } from '@env';
// Bu interface, AI'dan beklediğimiz yanıtın yapısını tanımlar.
export interface AnalyzedExpenseData {
    totalAmount: number | null;
    shopName: string | null;
    transactionDate: string | null; // YYYY-MM-DD formatında
}

export class AiVisionService {
    // NOT: API anahtarınızı asla kodun içine doğrudan yazmayın.
    // Güvenli bir şekilde saklamak için bir ortam değişkeni (environment variable) kullanın.
    private readonly API_KEY = GEMINI_API_KEY;
    private readonly API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.API_KEY}`;

    /**
     * Verilen bir fiş görselini (Base64 formatında) Gemini API'sine gönderir
     * ve analiz edilmiş masraf verilerini döndürür.
     * @param base64Image Analiz edilecek fişin Base64 formatındaki hali.
     * @returns Analiz edilmiş masraf verilerini içeren bir Promise.
     */
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
                // Google'dan gelen hata mesajını okumaya çalışıyoruz.
                const errorBody = await response.json();
                console.error('API Hata Detayı:', JSON.stringify(errorBody, null, 2));
                throw new Error(`API isteği başarısız oldu: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();

            // AI'dan gelen yanıtın içindeki metin kısmını alıp JSON olarak parse ediyoruz.
            let jsonText = responseData.candidates[0].content.parts[0].text;
            jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData: AnalyzedExpenseData = JSON.parse(jsonText);
            console.log(parsedData);
            return parsedData;

        } catch (error) {
            console.error('Gemini API analizi sırasında hata oluştu:', error);
            throw new Error('Fiş analizi yapılamadı.');
        }
    }
}
