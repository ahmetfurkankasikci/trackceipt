
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import Expense from '../../domain/models/Expense';
import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';
import Logger from '../../utils/Logger';

export class FirestoreExpenseRepositoryImpl implements IExpenseRepository {
  async updateExpense(expense: Expense): Promise<void> {
    try {
      const { id, ...dataToUpdate } = expense;
      const expenseDocRef = this.expensesCollection.doc(id);
      await expenseDocRef.update(dataToUpdate);
    } catch (error) {
      Logger.error("Firestore'da masraf güncellenirken hata oluştu: ", error);
      throw new Error('Masraf güncellenemedi.');
    }
  }
  async deleteExpense(expenseId: string): Promise<void> {
    try {

      await firestore().collection('expenses').doc(expenseId).delete();
    } catch (error) {
      Logger.error("Firestore'dan masraf silinirken hata oluştu: ", error);
      throw new Error('Masraf silinemedi.');
    }
  }
  getExpenseById(id: number): Promise<Expense | null> {
    throw new Error(`Method not implemented.${id}`);
  }

  private readonly expensesCollection = firestore().collection('expenses');


  getAllExpenses(userId: string, onExpensesUpdate: (expenses: Expense[]) => void): () => void {

    const query = this.expensesCollection.where("userId", "==", userId);


    const unsubscribe = query.onSnapshot((querySnapshot) => {

      if (!querySnapshot) {
        Logger.error("querySnapshot is null or undefined.");
        return;
      }



      const expenses: Expense[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as any;

        try {

          return {
            id: doc.id,
            userId: data.userId,
            amount: data.amount,
            category: data.category,
            categoryId: data.categoryId,
            shopName: data.shopName,
            date: (data.date as FirebaseFirestoreTypes.Timestamp).toDate(),
          };
        } catch (error) {
          Logger.error("Error mapping document data:", error);

          return null as any;
        }
      });

      const validExpenses = expenses.filter(expense => expense !== null) as Expense[];

      onExpensesUpdate(validExpenses);
    });

    return unsubscribe;
  }


  async addExpense(expense: Expense): Promise<void> {
    try {

      await this.expensesCollection.add(expense);
    } catch (error) {
      Logger.error("Firestore'a masraf eklenirken hata oluştu: ", error);
      throw new Error('Masraf eklenemedi.');
    }
  }
}
