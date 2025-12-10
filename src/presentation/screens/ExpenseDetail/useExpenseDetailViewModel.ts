import { useState, useMemo, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { container } from 'tsyringe';
import { UpdateExpenseUseCase } from '../../../domain/usecases/UpdateExpenseUseCase';
import type { ExpenseDetailScreenRouteProp, AppNavigationProp } from '../../navigation/types';
import { Alert } from 'react-native';
import { GetAllCategoriesUseCase } from '../../../domain/usecases/CategoryUseCases';
import Category from '../../../domain/models/Category';
import { AppRootState } from '../../../core/redux/store';
import { useSelector } from 'react-redux';
import Logger from '../../../utils/Logger';

export const useExpenseDetailViewModel = () => {
    const route = useRoute<ExpenseDetailScreenRouteProp>();
    const navigation = useNavigation<AppNavigationProp>();
    const updateExpenseUseCase = useMemo(() => container.resolve(UpdateExpenseUseCase), []);

    const initialExpense = route.params.expense;

    const getAllCategoriesUseCase = useMemo(() => container.resolve(GetAllCategoriesUseCase), []);
    const [categoryId, setCategoryId] = useState(initialExpense.categoryId);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);


    const [isEditing, setIsEditing] = useState(false);
    const [shopName, setShopName] = useState(initialExpense.shopName ?? "");
    const [amount, setAmount] = useState(initialExpense.amount ? initialExpense.amount.toString() : "");
    const [date, setDate] = useState(new Date(initialExpense.date));

    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state: AppRootState) => state.auth.user);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = getAllCategoriesUseCase.execute(user.uid, setCategories);
        return unsubscribe;
    }, [user, getAllCategoriesUseCase]);


    const handleUpdate = async () => {
        if (!shopName.trim() || !amount.trim()) {
            Alert.alert('Hata', 'Satıcı ve tutar alanları boş bırakılamaz.');
            return;
        }
        setIsLoading(true);
        try {
            const updatedExpense = {
                ...initialExpense,
                shopName,
                amount: parseFloat(amount.replace(',', '.')) || 0,
                categoryId,
                date,
            };
            await updateExpenseUseCase.execute(updatedExpense);
            setIsEditing(false);
            navigation.navigate('Home', { newExpenseAdded: true });
        } catch (error) {
            Logger.error("Güncelleme hatası:", error);
            Alert.alert('Güncelleme Başarısız', 'Masraf güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.');


        } finally {
            setIsLoading(false);
        }
    };

    return { isEditing, setIsEditing, shopName, setShopName, amount, setAmount, date, setDate, isLoading, handleUpdate, initialExpense, setCategoryId, categories, categoryId, setCategoryModalVisible, isCategoryModalVisible, };
};