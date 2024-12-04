import { useRefreshTokenMutation } from '@/services/electionsApi';
import { jwtDecode } from 'jwt-decode';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthContextType = {
  isLoading: boolean;
  accessToken?: string;
  updateAccessToken: (newAccessToken?: string) => void;
};

type DecodedToken = {
  id: string;
  role: 'admin' | 'clerk' | 'user' | 'guest';
};

type UserInfo = {
  userId?: string;
  role: 'admin' | 'clerk' | 'user' | 'guest';
};

const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  updateAccessToken: () => {
    console.warn('Missing auth context');
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [refreshToken, { data: tokenData, error }] = useRefreshTokenMutation();

  // on first render, refresh the token from the server
  useEffect(() => {
    if (!accessToken) {
      refreshToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tokenData?.accessToken) {
      setAccessToken(tokenData.accessToken);
      setIsLoading(false);
    }
  }, [tokenData]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  const updateAccessToken = (newAccessToken?: string) => {
    setAccessToken(newAccessToken);
  };

  return (
    <AuthContext.Provider value={{ isLoading, accessToken, updateAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

/* Hooks */

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    console.warn('Missing auth context');
  }

  return context;
}

export const useUserInfo = (): UserInfo => {
  const guestUser: UserInfo = { userId: '', role: 'guest' };
  
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.warn('Missing auth context');
    return guestUser;
  }

  try {
    const { id: userId, role } = jwtDecode<DecodedToken>(
      context.accessToken ?? '',
    );
    return { userId, role };
  } catch (error) {
    console.error('Error decoding token', error);
    return guestUser;
  }
};
