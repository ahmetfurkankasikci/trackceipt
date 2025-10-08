import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { container } from 'tsyringe';
import { AddExpenseUseCase } from '../../../domain/usecases/AddExpenseUseCase';
import type { AppNavigationProp } from '../../navigation/types';
import type { AppRootState } from '../../../core/redux/store';
import type Expense from '../../../domain/models/Expense';

export const useReceiptConfirmationViewModel = () => {
    //const route = useRoute<ReceiptConfirmationScreenRouteProp>();
    const navigation = useNavigation<AppNavigationProp>();
    const { user } = useSelector((state: AppRootState) => state.auth);

    // Gerekli UseCase'i DI container'dan alıyoruz.
    const addExpenseUseCase = useMemo(() => container.resolve(AddExpenseUseCase), []);

    //const { extractedData, imageUri } = route.params;

    // Formun durumunu tutan state'ler
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                description,
                date,
                categoryId: null, // Kategori daha sonra atanabilir
                //receiptImageUrl: null, // TODO: Firebase Storage'a yükleme eklenecek
            };
            await addExpenseUseCase.execute(expenseToSave);
            // Başarıyla kaydedildikten sonra ana ekrana dön ve güncelleme olduğunu bildir.
            navigation.navigate('Home', { newExpenseAdded: true });
        } catch (err) {
            console.error('Masraf kaydedilirken hata oluştu:', err);
            setError('Masraf kaydedilemedi. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        amount,
        setAmount,
        description,
        setDescription,
        date,
        setDate,
        isLoading,
        error,
        handleSave,
    };
};