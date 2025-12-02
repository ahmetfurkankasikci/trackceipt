import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useEffect, useRef, useMemo, useState } from 'react';
import { container } from 'tsyringe';
import { AnalyzeReceiptUseCase } from '../../../domain/usecases/AnalyzeReceiptUseCase';
import type { AppNavigationProp, ScanStackParamList } from '../../navigation/types';

type ReceiptAnalysisLoadingRouteProp = RouteProp<ScanStackParamList, 'ReceiptAnalysisLoading'>;

export const useReceiptAnalysisLoadingViewModel = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const route = useRoute<ReceiptAnalysisLoadingRouteProp>();
    const analyzeReceiptUseCase = useMemo(() => container.resolve(AnalyzeReceiptUseCase), []);

    const abortControllerRef = useRef<AbortController | null>(null);
    const { base64Image, imageUri } = route.params;

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Start analysis when component mounts
        const analyzeReceipt = async () => {
            abortControllerRef.current = new AbortController();
            setError(null);

            try {
                const extractedData = await analyzeReceiptUseCase.execute(
                    base64Image,
                    abortControllerRef.current.signal
                );

                // Navigate to confirmation screen on success
                navigation.navigate('ScanStack', {
                    screen: 'ReceiptConfirmation',
                    params: {
                        extractedData,
                        imageUri,
                        base64Image,
                    },
                });
            } catch (error: any) {
                // If request was aborted, don't show error (user cancelled)
                if (error.name === 'AbortError') {
                    console.log('Analysis cancelled by user');
                    return;
                }

                // For other errors, show error state
                console.error('Analysis failed:', error);
                setError('Analiz başarısız oldu.');
            }
        };

        analyzeReceipt();

        // Cleanup: abort request if component unmounts
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [base64Image, imageUri, analyzeReceiptUseCase, navigation]);

    const handleCancel = () => {
        // Abort the ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Navigate back to scan screen
        navigation.navigate('ScanStack', { screen: 'Scan' });
    };

    const handleRetry = () => {
        navigation.navigate('ScanStack', { screen: 'Scan' });
    };

    return {
        handleCancel,
        error,
        handleRetry,
    };
};
