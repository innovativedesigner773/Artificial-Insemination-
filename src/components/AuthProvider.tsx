import { ReactNode } from 'react';
import { AuthProvider as AuthProviderHook } from '../hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthProviderHook>
      {children}
    </AuthProviderHook>
  );
}

export { useAuth } from '../hooks/useAuth';