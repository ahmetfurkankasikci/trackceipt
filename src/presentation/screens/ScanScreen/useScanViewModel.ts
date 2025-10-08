import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { container } from 'tsyringe';
import { AnalyzeReceiptUseCase } from '../../../domain/usecases/AnalyzeReceiptUseCase';
import type { AppNavigationProp } from '../../navigation/types';

export const useScanViewModel = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const analyzeReceiptUseCase = useMemo(() => container.resolve(AnalyzeReceiptUseCase), []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeReceipt = async (base64Image: string, imageUri: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const extractedData = await analyzeReceiptUseCase.execute(base64Image);
      // Başarılı analizden sonra, artık aynı yığın (stack) içinde olan Onay Ekranı'na yönlendiriyoruz.
      navigation.navigate('ScanStack', {
        screen: 'ReceiptConfirmation', params: {
          extractedData,
          imageUri,
          base64Image,
        }
      });
      return true;
    } catch (err: any) {
      console.error('Fiş analiz edilirken hata oluştu:', err);
      setError(err.message || 'Fiş analiz edilemedi.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    analyzeReceipt,
  };
};