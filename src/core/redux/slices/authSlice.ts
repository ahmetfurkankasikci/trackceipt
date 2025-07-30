import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User  from '../../../domain/models/User';


interface AuthState {
    user: User | null;     
    isLoading: boolean;     
    authReady: boolean;     
    error: string | null;   
}


const initialState: AuthState = {
    user: null,
    isLoading: false,
    authReady: false, 
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isLoading = false;
            state.authReady = true;
        },
       
        setAuthError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});


export const { setAuthLoading, setUser, setAuthError } = authSlice.actions;


export default authSlice.reducer;