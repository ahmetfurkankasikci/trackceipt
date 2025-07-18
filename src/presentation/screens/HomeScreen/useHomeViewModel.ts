// src/presentation/screens/HomeScreen/useHomeViewModel.ts

import { useState, useEffect, useMemo } from 'react'; // useMemo eklendi
import { container } from 'tsyringe';
import { GetExpensesUseCase } from '../../../domain/usecases/GetExpensesUseCase';
import type { Expense } from '../../../domain/models/Expense';

export const useHomeViewModel = () => {
  // UseCase'i dosya import edilirken değil, hook çalıştırıldığında istiyoruz.
  // useMemo, UseCase'in her render'da yeniden istenmesini engeller, performansı artırır.
  const getExpensesUseCase = useMemo(() => container.resolve(GetExpensesUseCase), []);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firestore'dan gelen gerçek zamanlı güncellemeleri dinliyoruz.
    const unsubscribe = getExpensesUseCase.execute((updatedExpenses) => {
      setExpenses(updatedExpenses);
      if (isLoading) {
        setIsLoading(false);
      }
    });

    // Component ekrandan kaldırıldığında dinleyiciyi kapatarak
    // hafıza sızıntılarını önlüyoruz.
    return () => {
      unsubscribe();
    };
  }, [getExpensesUseCase, isLoading]); // Dependency array'e ekledik.

  return {
    expenses,
    isLoading,
  };
};
