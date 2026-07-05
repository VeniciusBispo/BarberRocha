/* eslint-disable react/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import type { LoginData, RegisterData, AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega o usuário persistido e token ao inicializar o app
    const storedToken = localStorage.getItem('@Rocha20:token');
    const storedUser = localStorage.getItem('@Rocha20:user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('[AuthContext] Falha ao analisar usuário armazenado:', err);
        localStorage.removeItem('@Rocha20:token');
        localStorage.removeItem('@Rocha20:user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const result = await AuthService.login(data);
      const { token, user: loggedUser } = result;

      // Salva de forma persistente
      localStorage.setItem('@Rocha20:token', token);
      localStorage.setItem('@Rocha20:user', JSON.stringify(loggedUser));

      setUser(loggedUser);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao realizar login. Tente novamente.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      await AuthService.register(data);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao cadastrar conta.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('@Rocha20:token');
    localStorage.removeItem('@Rocha20:user');
    setUser(null);
  };

  const completePasswordChange = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      localStorage.setItem('@Rocha20:user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, completePasswordChange }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
