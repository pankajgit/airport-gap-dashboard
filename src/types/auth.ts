export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export type AuthAction =
  | {
      type: 'LOGIN'
      payload: string
    }
  | {
      type: 'LOGOUT'
    }