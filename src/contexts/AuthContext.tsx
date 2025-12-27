import { useContext } from 'react';
import { AuthContext as AuthContextValue } from '../components/AuthProvider/AuthProvider';

/**
 * Hook to access authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContextValue);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

