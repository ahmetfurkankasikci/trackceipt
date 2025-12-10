import crashlytics from '@react-native-firebase/crashlytics';

// Hassas anahtar kelimeler listesi. Bu kelimeleri içeren verileri maskeleyeceğiz.
const SENSITIVE_KEYS = ['password', 'token', 'auth', 'secret', 'bearer', 'credit_card'];

class Logger {

    // Veriyi temizleyen yardımcı fonksiyon (Sanitization)
    private sanitize(data: any): any {
        if (!data) return data;

        // Eğer veri bir obje ise içini tara
        if (typeof data === 'object') {
            const sanitizedData: any = Array.isArray(data) ? [] : {};

            for (const key in data) {
                // Anahtar hassas kelimelerden birini içeriyor mu?
                const isSensitive = SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k));

                if (isSensitive) {
                    sanitizedData[key] = '***REDACTED***'; // Veriyi gizle
                } else if (typeof data[key] === 'object') {
                    sanitizedData[key] = this.sanitize(data[key]); // İç içe objeleri de tara
                } else {
                    sanitizedData[key] = data[key];
                }
            }
            return sanitizedData;
        }
        return data;
    }

    // Hata Kaydı Fonksiyonu
    error(message: string, error?: any) {
        // 1. Geliştirme Ortamı (DEV) ise: Konsola bas geç
        if (__DEV__) {
            console.error(`[DEV-ERROR] ${message}`, error);
            return;
        }

        // 2. Canlı Ortam (PROD) ise: Firebase Crashlytics'e gönder
        try {
            // Mesajı logla
            crashlytics().log(`Error: ${message}`);

            if (error) {
                // Hata objesindeki hassas verileri temizle
                const safeError = this.sanitize(error);

                // Crashlytics'e "non-fatal" (çökme olmayan) hata olarak kaydet
                if (error instanceof Error) {
                    crashlytics().recordError(error);
                } else {
                    // Eğer gelen şey bir Error objesi değilse (örn: string), Error'a çevir
                    crashlytics().recordError(new Error(JSON.stringify(safeError)));
                }
            }
        } catch (e) {
            // Logger'ın kendisi hata verirse yapacak bir şey yok, sessiz kal.
        }
    }

    // Bilgi Kaydı Fonksiyonu (İsteğe bağlı)
    info(message: string, data?: any) {
        if (__DEV__) {
            console.log(`[DEV-INFO] ${message}`, data);
        } else {
            // Prod ortamında gereksiz log kalabalığı yapma, sadece çok önemliyse Crashlytics loguna ekle
            crashlytics().log(`Info: ${message}`);
        }
    }
}

export default new Logger();