import React, { useState, useEffect, createContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api'

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string
}

type AuthProviderProps = {
  children: ReactNode;
}

type SignInProps = {
  email: string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: '',
    name: '',
    email: '',
    token: ''
  });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      const userInfo = await AsyncStorage.getItem('@unipizza');

      let hasUser: UserProps = JSON.parse(userInfo || '{}');

      if (Object.keys(hasUser).length > 0) {
        api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;

        setUser({
          id: hasUser.id,
          name: hasUser.name,
          email: hasUser.email,
          token: hasUser.token
        });
      }
      setLoading(false);
    }

    getUser();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);

    try {
      const response = await api.post('/session', {
        email,
        password
      });
      const { id, name, token } = response.data;
      const data = {
        ...response.data
      };
      await AsyncStorage.setItem('@unipizza', JSON.stringify(data));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({
        id,
        name,
        email,
        token,
      });
      setLoadingAuth(false);
    } catch (error) {
      console.log('Erro ao acessar ', error);
      setLoadingAuth(false);
    }
  }

  async function signOut() {
    await api.put('/user/logout');
    await AsyncStorage.clear()
      .then(() => {
        setUser({
          id: '',
          name: '',
          email: '',
          token: ''
        })
      });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signOut,
        loadingAuth,
        loading
      }}>
      {children}
    </AuthContext.Provider>
  )
}