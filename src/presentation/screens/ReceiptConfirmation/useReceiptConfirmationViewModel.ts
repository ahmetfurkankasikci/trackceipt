import { useState, useMemo, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { container } from 'tsyringe';
import { AddExpenseUseCase } from '../../../domain/usecases/AddExpenseUseCase';
import type { AppNavigationProp, ScanStackParamList } from '../../navigation/types';
import type { AppRootState } from '../../../core/redux/store';
import type Expense from '../../../domain/models/Expense';
import Logger from '../../../utils/Logger';

type ReceiptConfirmationRouteProp = RouteProp<ScanStackParamList, 'ReceiptConfirmation'>;

export const useReceiptConfirmationViewModel = () => {
    const route = useRoute<ReceiptConfirmationRouteProp>();
    const navigation = useNavigation<AppNavigationProp>();
    const { user } = useSelector((state: AppRootState) => state.auth);

    // Gerekli UseCase'i DI container'dan alıyoruz.
    const addExpenseUseCase = useMemo(() => container.resolve(AddExpenseUseCase), []);

    const { extractedData, imageUri } = route.params;

    // Formun durumunu tutan state'ler - Initialize with API data
    const [amount, setAmount] = useState('');
    const [shopName, setShopName] = useState('');
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Populate form with extracted data when component mounts
    useEffect(() => {
        if (extractedData) {
            // Set amount
            if (extractedData.amount !== null && extractedData.amount !== undefined) {
                setAmount(extractedData.amount.toString());
            }

            // Set description (shop name)
            const data = extractedData as any;
            if (data.shopName) {
                setShopName(data.shopName);
            } else if (data.description) {
                setShopName(data.description);
            }

            // Set date
            if (extractedData.date) {
                setDate(new Date(extractedData.date));
            }
        }
    }, [extractedData]);

    const handleCancel = () => {
        navigation.navigate('ScanStack', { screen: 'Scan' });
    };

    const handleSave = async () => {
        if (!user) {
            setError('Kullanıcı bulunamadı.');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Lütfen geçerli bir tutar girin.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const expenseToSave: Omit<Expense, 'id'> = {
                category: 'Analiz Edildi',
                userId: user.uid,
                amount: parsedAmount,
                shopName,
                date,
                categoryId: null, // Kategori daha sonra atanabilir
                //receiptImageUrl: null, // TODO: Firebase Storage'a yükleme eklenecek
            };
            await addExpenseUseCase.execute(expenseToSave);
            // Başarıyla kaydedildikten sonra ana ekrana dön ve güncelleme olduğunu bildir.
            navigation.navigate('Home', { newExpenseAdded: true });
        } catch (err) {
            Logger.error('Masraf kaydedilirken hata oluştu:', err);
            setError('Masraf kaydedilemedi. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        amount,
        setAmount,
        shopName,
        setShopName,
        date,
        setDate,
        isLoading,
        error,
        handleSave,
        handleCancel,
        imageUri,
    };
};