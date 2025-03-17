'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

type User = {
    _id: string;
    fullName: string;
    email: string;
} | null;

type AuthContextType = {
    user: User;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (fullName: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await authApi.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            loadUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await authApi.login(email, password);

            if (response.token) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                toast.success('Đăng nhập thành công');
                return true;
            } else {
                toast.error('Đăng nhập thất bại: Không nhận được token');
                return false;
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
            toast.error(`Đăng nhập thất bại: ${errorMessage}`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (fullName: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await authApi.register({ fullName, email, password });

            if (response.token) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                toast.success('Đăng ký thành công');
                return true;
            } else {
                toast.success('Đăng ký thành công. Vui lòng đăng nhập.');
                return true;
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';
            toast.error(`Đăng ký thất bại: ${errorMessage}`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authApi.logout();
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Đã đăng xuất');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 