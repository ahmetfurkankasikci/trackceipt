// src/presentation/screens/ScanScreen/useScanViewModel.ts

import { useMemo, useState } from 'react';
import { AnalyzeAndAddExpenseUseCase } from '../../../domain/usecases/AnalyzeAndAddExpenseUseCase';
import { container } from 'tsyringe';
import { AppRootState } from '../../../core/redux/store';
import { useSelector } from 'react-redux';

// --- Bağımlılıkların Kurulumu (Dependency Injection) ---
// Gerçek bir uygulamada bu kısım bir DI container (InversifyJS, Tsyringe vb.)
// tarafından yönetilir. Şimdilik manuel olarak oluşturuyoruz.
// ---------------------------------------------------------

/**
 * ScanScreen için tüm mantığı ve durumu yöneten ViewModel kancası.
 */
export const useScanViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: AppRootState) => state.auth.user);
  const analyzeAndAddExpenseUseCase = useMemo(() => container.resolve(AnalyzeAndAddExpenseUseCase), []);


  /**
   * Verilen base64 formatındaki resmi analiz edip veritabanına ekler.
   * @param base64Image Analiz edilecek resim.
   * @returns İşlemin başarılı olup olmadığını belirten bir boolean.
   */
  const analyzeReceipt = async (base64Image: string): Promise<boolean> => {
    if (!user) {
      setError('Bu işlemi yapmak için giriş yapmalısınız.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      await analyzeAndAddExpenseUseCase.execute(base64Image, user.uid);
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