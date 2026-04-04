import { createContext, useContext } from 'react';

interface AuthContextValue {
  user: null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
});

// TODO: route protection
export const useAuth = () => useContext(AuthContext);
