// src/presentation/screens/HomeScreen/useHomeViewModel.ts

import { useState, useEffect, useMemo } from 'react'; // useMemo eklendi
import { container } from 'tsyringe';
import { GetExpensesUseCase } from '../../../domain/usecases/GetExpensesUseCase';
import type Expense from '../../../domain/models/Expense';
import { useSelector } from 'react-redux';
import { DeleteExpenseUseCase } from '../../../domain/usecases/DeleteExpenseUseCase';
import { AppRootState } from '../../../core/redux/store';
import Category from '../../../domain/models/Category';
import { GetAllCategoriesUseCase } from '../../../domain/usecases/CategoryUseCases';

export const useHomeViewModel = () => {
  // UseCase'i dosya import edilirken değil, hook çalıştırıldığında istiyoruz.
  // useMemo, UseCase'in her render'da yeniden istenmesini engeller, performansı artırır.
  const getExpensesUseCase = useMemo(() => container.resolve(GetExpensesUseCase), []);

  const user = useSelector((state: AppRootState) => state.auth.user);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([]);
  const getAllCategoriesUseCase = useMemo(() => container.resolve(GetAllCategoriesUseCase), []);

  const deleteExpenseUseCase = useMemo(() => container.resolve(DeleteExpenseUseCase), []);

  useEffect(() => {
    if (user) {
      const unsubscribeExpenses = getExpensesUseCase.execute(user.uid, (updatedExpenses) => {
        console.log("Masraflar güncellendi:", updatedExpenses);
        setExpenses(updatedExpenses);
        if (isLoading) setIsLoading(false);
      });
      const unsubscribeCategories = getAllCategoriesUseCase.execute(user.uid, setCategories);

      return () => {
        unsubscribeExpenses();
        unsubscribeCategories();
      };
    } else {
      setExpenses([]);
      setCategories([]);
      setIsLoading(false);
    }
  }, [user, getExpensesUseCase, getAllCategoriesUseCase, isLoading]);

  const categoriesMap = useMemo(() =>
    categories.reduce((map, cat) => {

      map[cat.id ?? ""] = cat;

      return map;
    }, {} as { [key: string]: Category }),
    [categories]
  );

  // Yeni silme fonksiyonu
  const handleDeleteExpense = async (expenseId: string) => {
    setDeletingId(expenseId); // Silme indicator'ını başlat
    try {
      await deleteExpenseUseCase.execute(expenseId);
      // Başarılı silme sonrası, onSnapshot dinleyicisi listeyi otomatik güncelleyecektir.
    } catch (error) {
      console.error("Masraf silinemedi:", error);
      // Burada kullanıcıya bir hata uyarısı gösterilebilir.
    } finally {
      setDeletingId(null); // Indicator'ı kaldır
    }
  };
  return {
    expenses,
    isLoading,
    deletingId,
    handleDeleteExpense,
    categoriesMap
  };
};
