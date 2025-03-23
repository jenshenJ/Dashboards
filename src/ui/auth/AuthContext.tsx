import { createContext, PropsWithChildren, useEffect, useReducer, Reducer } from 'react';
import { instance } from '@/sdk';

import { User } from '@/sdk/types/users';
import { sdk } from '@/sdk';
import { AxiosError } from 'axios';


type AuthContextState = {
    isAuthenticated: boolean,
    user: User | null,
}
const initialState: AuthContextState = {
  isAuthenticated: false,
  user: null,
};

type AuthAction = {
    type: 'LOGIN' | 'LOGOUT',
    payload?: {
        user: User,
    }
};

const authReducer: Reducer<AuthContextState, AuthAction> = (state, { type, payload }) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: payload?.user || null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
  }
};

const AuthContext = createContext({
  ...initialState,
  logIn: (username: string, password: string): Promise<string | void> => Promise.resolve(),
  register: (username: string, password: string): Promise<string | void> => Promise.resolve(),
  logOut: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const getUserInfo = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        instance.defaults.headers.common['x-auth-token'] = token;
        const res = await sdk.getUserInfo();

        dispatch({
          type: 'LOGIN',
          payload: {
            user: res.data,
          },
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      delete instance.defaults.headers.common['x-auth-token'];
    }
  };

  // verify user on reducer state init or changes
  useEffect(() => {
    const getUser = async () => {
        if (!state.user) {
            await getUserInfo();
        }
    }

    void getUser();
  }, []);

  const logIn = async (username: string, password: string) => {
      try {
        const res = await sdk.login(username, password);
        localStorage.setItem('token', res.data.token);
        await getUserInfo();
      }  catch (err) {
        console.log(err);
        if (err instanceof AxiosError) {
          return String(err.response?.data?.msg);
        }   
      } 
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await sdk.register(username, password);
      localStorage.setItem('token', res.data.token);
      await getUserInfo();
    } catch (err) {
      if (err instanceof AxiosError) {
        return String(err.response?.data?.error);
      }   
    }
  };

  const logOut = async () => {
    try {
      localStorage.removeItem('token');
      dispatch({
        type: 'LOGOUT',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, logIn, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;