// src/data/repositories/FirestoreExpenseRepositoryImpl.ts

// ÖNEMLİ: Artık web SDK'sı yerine @react-native-firebase kütüphanelerini kullanıyoruz.
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { Expense } from '../../domain/models/Expense';
import { IExpenseRepository } from '../../domain/repositories/IExpenseRepository';

/**
 * Bu sınıf, IExpenseRepository arayüzünü @react-native-firebase/firestore
 * kütüphanesini kullanarak uygular. Bu yaklaşım, native tarafta (Android/iOS)
 * yapılandırılmış Firebase projeleri için en doğru ve performanslı yöntemdir.
 */
export class FirestoreExpenseRepositoryImpl implements IExpenseRepository {
  getExpenseById(id: number): Promise<Expense | null> {
    throw new Error(`Method not implemented.${id}`);
  }
  // Koleksiyon referansını @react-native-firebase'in kendi metoduyla alıyoruz.
  private readonly expensesCollection = firestore().collection('expenses');

  /**
   * Firestore'daki 'expenses' koleksiyonunu dinler ve herhangi bir değişiklik
   * olduğunda güncel masraf listesini bir callback fonksiyonu aracılığıyla döndürür.
   * Bu metot, dinlemeyi durdurmak için çağrılabilecek bir unsubscribe fonksiyonu döndürür.
   * @param onExpensesUpdate Masraflar güncellendiğinde çağrılacak olan callback fonksiyonu.
   * @returns Dinleyiciyi sonlandırmak için kullanılabilecek bir fonksiyon.
   */
  getAllExpenses(onExpensesUpdate: (expenses: Expense[]) => void): () => void {
    // Sorguyu oluşturma şekli web SDK'sından biraz farklıdır.
    // Direkt koleksiyon referansı üzerinden .orderBy() çağrılır.
    const query = this.expensesCollection.orderBy('date', 'desc');
    console.log("query")
    console.log(query);
    // onSnapshot metodu direkt sorgu üzerinden çağrılır.
    const unsubscribe = query.onSnapshot((querySnapshot) => {
      // Hata kontrolü eklemek iyi bir pratiktir.
      if (!querySnapshot) {
        console.error("querySnapshot is null or undefined.");
        return;
      }

      if (querySnapshot?.metadata?.hasPendingWrites) {
        // Veri henüz sunucuya yazılırken gelen lokal değişiklikleri
        // görmezden gelerek çift veri gösterimini engelleyebiliriz.
        // Bu satır isteğe bağlıdır ama kullanıcı deneyimini iyileştirir.
        return;
      }

      const expenses: Expense[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as any;

        try {
          // Veri dönüşümü (mapping) aynı kalır, sadece Timestamp'in tipi değişir.
          return {
            id: doc.id,
            amount: data.amount,
            category: data.category,
            description: data.description,
            // @react-native-firebase/firestore'dan gelen Timestamp nesnesini Date'e çeviriyoruz.
            date: (data.date as FirebaseFirestoreTypes.Timestamp).toDate(),
            receiptImageUrl: data.receiptImageUrl,
          };
        } catch (error) {
          console.error("Error mapping document data:", doc.id, error);
          // If a mapping fails, you might want to return null or a default Expense object
          // rather than crashing the entire application.  Handle this carefully.
          return null as any; // or return a default Expense object
        }
      });

      // Filter out any null expenses that might have resulted from mapping failures.
      const validExpenses = expenses.filter(expense => expense !== null) as Expense[];

      onExpensesUpdate(validExpenses);
    });

    return unsubscribe;
  }

  /**
   * Verilen masraf nesnesini Firestore'a yeni bir belge olarak ekler.
   * @param expense Eklenecek olan masraf nesnesi.
   */
  async addExpense(expense: Omit<Expense, 'id'>): Promise<void> {
    try {
      // Belge ekleme işlemi web SDK'sındaki 'addDoc' yerine '.add' metodu ile yapılır.
      await this.expensesCollection.add(expense);
    } catch (error) {
      console.error("Firestore'a masraf eklenirken hata oluştu: ", error);
      throw new Error('Masraf eklenemedi.');
    }
  }
}
