import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User  from '../../../domain/models/User';

// Bu slice'ın yöneteceği durumun (state) yapısını tanımlıyoruz.
interface AuthState {
    user: User | null;      // Giriş yapmış kullanıcı bilgisi veya null
    isLoading: boolean;     // Kimlik doğrulama durumu kontrol ediliyor mu?
    authReady: boolean;     // Firebase'in ilk durum kontrolü bitti mi?
    error: string | null;   // Hata mesajı
}

// Başlangıç durumu
const initialState: AuthState = {
    user: null,
    isLoading: false,
    authReady: false, // Uygulama ilk açıldığında auth durumu henüz bilinmiyor.
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Yüklenme durumunu başlatan reducer
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        // Kullanıcı durumunu güncelleyen reducer
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isLoading = false;
            state.authReady = true; // İlk kullanıcı bilgisi geldiğinde, auth hazır demektir.
        },
        // Hata durumunu ayarlayan reducer
        setAuthError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

// Action'ları dışa aktarıyoruz ki uygulama içinden çağrılabilsinler.
export const { setAuthLoading, setUser, setAuthError } = authSlice.actions;

// Reducer'ı dışa aktarıyoruz ki store'da birleştirilebilsin.
export default authSlice.reducer;