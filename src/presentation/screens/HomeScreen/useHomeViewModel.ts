import { useState, useEffect, useMemo } from 'react';
import { container } from 'tsyringe';
import { GetExpensesUseCase } from '../../../domain/usecases/GetExpensesUseCase';
import type Expense from '../../../domain/models/Expense';
import { useSelector } from 'react-redux';
import { DeleteExpenseUseCase } from '../../../domain/usecases/DeleteExpenseUseCase';
import { AppRootState } from '../../../core/redux/store';
import Category from '../../../domain/models/Category';
import { GetAllCategoriesUseCase } from '../../../domain/usecases/CategoryUseCases';
import Logger from '../../../utils/Logger';

export const useHomeViewModel = () => {
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

  const handleDeleteExpense = async (expenseId: string) => {
    setDeletingId(expenseId);
    try {
      await deleteExpenseUseCase.execute(expenseId);
    } catch (error) {
      Logger.error("Masraf silinemedi:", error);
    } finally {
      setDeletingId(null);
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
