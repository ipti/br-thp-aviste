import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'TRIADOR' | 'MEDICO';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  schoolIds: number[];
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  isAdmin: boolean;
  isTriador: boolean;
  isMedico: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAdmin: false,
      isTriador: false,
      isMedico: false,

      setSession: (token, user) =>
        set({
          token,
          user,
          isAdmin: user.role === 'ADMIN',
          isTriador: user.role === 'TRIADOR',
          isMedico: user.role === 'MEDICO',
        }),

      clearSession: () =>
        set({ token: null, user: null, isAdmin: false, isTriador: false, isMedico: false }),
    }),
    { name: 'aviste-auth' },
  ),
);
