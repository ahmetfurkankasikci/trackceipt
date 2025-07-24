import { useMemo, useState } from "react";
import { setAuthError, setAuthLoading } from "../../../core/redux/slices/authSlice";
import { container } from "tsyringe";
import { SignUpUseCase } from "../../../domain/usecases/SignUpUseCase";
import { LoginUseCase } from "../../../domain/usecases/LoginUseCase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../core/redux/store";

export const useAuthViewModel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    const loginUseCase = useMemo(() => container.resolve(LoginUseCase), []);
    const signUpUseCase = useMemo(() => container.resolve(SignUpUseCase), []);

    const handleLogin = async () => {
        dispatch(setAuthLoading(true));
        try {
            await loginUseCase.execute(email, password);
            // Başarılı giriş sonrası Redux store onAuthStateChanged tarafından güncellenecek.
        } catch (error: any) {
            dispatch(setAuthError(error.message));
        }
    };

    const handleSignUp = async () => {
        dispatch(setAuthLoading(true));
        try {
            await signUpUseCase.execute(email, password);
            // Başarılı kayıt sonrası Redux store onAuthStateChanged tarafından güncellenecek.
        } catch (error: any) {
            dispatch(setAuthError(error.message));
        }
    };

    return { email, setEmail, password, setPassword, handleLogin, handleSignUp };
};