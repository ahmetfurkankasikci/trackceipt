// src/presentation/screens/HomeScreen/useHomeViewModel.ts

import { useState, useEffect, useMemo } from 'react'; // useMemo eklendi
import { container } from 'tsyringe';
import { GetExpensesUseCase } from '../../../domain/usecases/GetExpensesUseCase';
import type Expense from '../../../domain/models/Expense';
import { useSelector } from 'react-redux';
import { DeleteExpenseUseCase } from '../../../domain/usecases/DeleteExpenseUseCase';
import { AppRootState } from '../../../core/redux/store';

export const useHomeViewModel = () => {
  // UseCase'i dosya import edilirken değil, hook çalıştırıldığında istiyoruz.
  // useMemo, UseCase'in her render'da yeniden istenmesini engeller, performansı artırır.
  const getExpensesUseCase = useMemo(() => container.resolve(GetExpensesUseCase), []);

  const user = useSelector((state: AppRootState) => state.auth.user);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const deleteExpenseUseCase = useMemo(() => container.resolve(DeleteExpenseUseCase), []);
  useEffect(() => {
    // Eğer kullanıcı giriş yapmışsa, onun masraflarını dinlemeye başla.
    if (user) {
      const unsubscribe = getExpensesUseCase.execute(user.uid, (updatedExpenses) => {
        setExpenses(updatedExpenses);
        if (isLoading) setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Kullanıcı giriş yapmamışsa veya çıkış yapmışsa, listeyi boşalt.
      setExpenses([]);
      setIsLoading(false);
    }
  }, [user, getExpensesUseCase, isLoading]);
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
  };
};
