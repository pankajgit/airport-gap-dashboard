import { createContext } from 'react'

import type {
  AuthState,
  LoginCredentials,
} from '../types/auth'

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)