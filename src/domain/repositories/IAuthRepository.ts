import User  from "../models/User";

export interface IAuthRepository {
    login(email: string, password: string): Promise<User | null>;
    signUp(email: string, password: string): Promise<User | null>;
    logout(): Promise<void>;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}