import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import User  from '../../domain/models/User';

export class FirebaseAuthRepositoryImpl implements IAuthRepository {

    async login(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const firebaseUser = userCredential.user;
            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
            };
        } catch (error: any) {
            console.error("Login Error:", error.code, error.message);
            throw new Error('Giriş işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
        }
    }

    async signUp(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const firebaseUser = userCredential.user;
            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
            };
        } catch (error: any) {
            // Hata kodlarına göre kullanıcıya daha anlaşılır mesajlar verilebilir.
            console.error("SignUp Error:", error.code, error.message);
            throw new Error('Kayıt işlemi başarısız oldu.');
        }
    }

    async logout(): Promise<void> {
        try {
            await auth().signOut();
        } catch (error: any) {
            console.error("Logout Error:", error.message);
            throw new Error('Çıkış işlemi başarısız oldu.');
        }
    }
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        const unsubscribe = auth().onAuthStateChanged((firebaseUser: FirebaseAuthTypes.User | null) => {
            if (firebaseUser) {
                // Firebase'den gelen kullanıcı nesnesini, kendi Domain modelimize dönüştürüyoruz.
                const appUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                };
                callback(appUser);
            } else {
                callback(null);
            }
        });

        return unsubscribe;
    }

}