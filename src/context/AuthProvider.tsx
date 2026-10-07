import {
  useReducer,
  type ReactNode,
} from 'react'

import { AuthContext } from './AuthContext'

import { authReducer } from '../reducers/authReducer'

import { login as loginService } from '../services/auth/authService'

import { storage } from '../utils/storage'

import type {
  AuthState,
  LoginCredentials,
} from '../types/auth'

interface AuthProviderProps {
  children: ReactNode
}

const getInitialState = (): AuthState => {
  const token = storage.getToken()

  return {
    token,
    isAuthenticated: Boolean(token),
  }
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [state, dispatch] = useReducer(
    authReducer,
    undefined,
    getInitialState,
  )

  const login = async (
    credentials: LoginCredentials,
  ): Promise<void> => {
    const response = await loginService(credentials)

    storage.setToken(response.token)

    dispatch({
      type: 'LOGIN',
      payload: response.token,
    })
  }

  const logout = (): void => {
    storage.removeToken()

    dispatch({
      type: 'LOGOUT',
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}