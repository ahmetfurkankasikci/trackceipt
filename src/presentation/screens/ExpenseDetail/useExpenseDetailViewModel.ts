import { useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { container } from 'tsyringe';
import { UpdateExpenseUseCase } from '../../../domain/usecases/UpdateExpenseUseCase';
import type { ExpenseDetailScreenRouteProp, AppNavigationProp } from '../../navigation/types'; // Yeni tip
import { Alert } from 'react-native';

export const useExpenseDetailViewModel = () => {
    const route = useRoute<ExpenseDetailScreenRouteProp>();
    const navigation = useNavigation<AppNavigationProp>();
    const updateExpenseUseCase = useMemo(() => container.resolve(UpdateExpenseUseCase), []);

    const initialExpense = route.params.expense;

    // Düzenleme modu ve form state'leri
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(initialExpense.description ?? "");
    const [amount, setAmount] = useState(initialExpense.amount.toString());
    const [date, setDate] = useState(new Date(initialExpense.date));

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        if (!description.trim() || !amount.trim()) {
            Alert.alert('Hata', 'Açıklama ve tutar alanları boş bırakılamaz.');
            return;
        }
        setIsLoading(true);
        try {
            const updatedExpense = {
                ...initialExpense,
                description,
                amount: parseFloat(amount.replace(',', '.')) || 0,
                date,
            };
            await updateExpenseUseCase.execute(updatedExpense);
            setIsEditing(false); // Düzenleme modunu kapat
             navigation.navigate('Home', { newExpenseAdded: true });
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            Alert.alert('Güncelleme Başarısız', 'Masraf güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.');

            // Hata uyarısı gösterilebilir.
        } finally {
            setIsLoading(false);
        }
    };

    return { isEditing, setIsEditing, description, setDescription, amount, setAmount, date, setDate, isLoading, handleUpdate, initialExpense };
};