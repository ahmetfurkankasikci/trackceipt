// src/presentation/screens/HomeScreen/useHomeViewModel.ts

import { useState, useEffect, useMemo } from 'react'; // useMemo eklendi
import { container } from 'tsyringe';
import { GetExpensesUseCase } from '../../../domain/usecases/GetExpensesUseCase';
import type Expense from '../../../domain/models/Expense';
import { useSelector } from 'react-redux';
import { AppRootState } from '../../../core/redux/store';

export const useHomeViewModel = () => {
  // UseCase'i dosya import edilirken değil, hook çalıştırıldığında istiyoruz.
  // useMemo, UseCase'in her render'da yeniden istenmesini engeller, performansı artırır.
  const getExpensesUseCase = useMemo(() => container.resolve(GetExpensesUseCase), []);

  const user = useSelector((state: AppRootState) => state.auth.user);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    expenses,
    isLoading,
  };
};
