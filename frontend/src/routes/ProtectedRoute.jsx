import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, isCustomer } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isCustomer)      return <Navigate to="/" replace />

  return <Outlet />
}
