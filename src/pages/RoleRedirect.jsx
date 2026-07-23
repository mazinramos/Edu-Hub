import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRedirect() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        جاري تجهيز حسابك...
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={`/${profile.role}`} replace />
}
