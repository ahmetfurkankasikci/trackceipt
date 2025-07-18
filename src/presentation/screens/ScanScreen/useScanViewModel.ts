// src/presentation/screens/ScanScreen/useScanViewModel.ts

import { useState } from 'react';
import { AnalyzeAndAddExpenseUseCase } from '../../../domain/usecases/AnalyzeAndAddExpenseUseCase';
import { container } from 'tsyringe';

// --- Bağımlılıkların Kurulumu (Dependency Injection) ---
// Gerçek bir uygulamada bu kısım bir DI container (InversifyJS, Tsyringe vb.)
// tarafından yönetilir. Şimdilik manuel olarak oluşturuyoruz.
const analyzeAndAddExpenseUseCase = container.resolve(AnalyzeAndAddExpenseUseCase);
// ---------------------------------------------------------

/**
 * ScanScreen için tüm mantığı ve durumu yöneten ViewModel kancası.
 */
export const useScanViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verilen base64 formatındaki resmi analiz edip veritabanına ekler.
   * @param base64Image Analiz edilecek resim.
   * @returns İşlemin başarılı olup olmadığını belirten bir boolean.
   */
  const analyzeReceipt = async (base64Image: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await analyzeAndAddExpenseUseCase.execute(base64Image);
      setIsLoading(false);
      return true; // Başarılı
    } catch (e: any) {
      setError(e.message || 'Bilinmeyen bir hata oluştu.');
      setIsLoading(false);
      return false; // Başarısız
    }
  };

  return {
    isLoading,
    error,
    analyzeReceipt,
  };
};