import Category from "../../domain/models/Category";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import firestore from '@react-native-firebase/firestore';
import Logger from '../../utils/Logger';


export class FirestoreCategoryRepositoryImpl implements ICategoryRepository {
    private readonly collection = firestore().collection('categories');

    getAllCategories(userId: string, onUpdate: (categories: Category[]) => void): () => void {
        const query = this.collection.where("userId", "==", userId);
        return query.onSnapshot((querySnapShot) => {
            const categories = querySnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            onUpdate(categories);
        })
    }
    async addCategory(category: Category): Promise<void> {
        try {
            Logger.info('Adding category', category);
            await this.collection.add(category);
        } catch (error) {
            Logger.error("Firestore'a kategori eklenirken hata oluştu: ", error);
            throw new Error('Kategori eklenemedi.');
        }


    }
    async updateCategory(category: Category): Promise<void> {
        const { id, ...data } = category;
        await this.collection.doc(id).update(data);
    }
    async deleteCategory(categoryId: string): Promise<void> {
        await this.collection.doc(categoryId).delete();
    }
} 