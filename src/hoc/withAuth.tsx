import type { ComponentType } from 'react'
import {
  Navigate,
  useLocation,
} from 'react-router'

import { useAuth } from '../hooks/useAuth'

const withAuth = <P extends object>(
  Component: ComponentType<P>,
) => {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
      return (
        <Navigate
          to="/login"
          replace
          state={{
            from: location,
          }}
        />
      )
    }

    return <Component {...props} />
  }

  return AuthenticatedComponent
}

export default withAuth