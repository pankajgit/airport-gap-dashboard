import type {
  AuthAction,
  AuthState,
} from '../types/auth'

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
      }

    case 'LOGOUT':
      return {
        ...state,
        token: null,
        isAuthenticated: false,
      }

    default:
      return state
  }
}