import axiosClient from '../api/axiosClient'

import type {
  LoginCredentials,
  LoginResponse,
} from '../../types/auth'

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const formData = new URLSearchParams()

  formData.append('email', credentials.email)
  formData.append('password', credentials.password)

  const response = await axiosClient.post<LoginResponse>(
    '/tokens',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  return response.data
}