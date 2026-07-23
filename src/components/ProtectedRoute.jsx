import { Navigate, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowRoles }) {
  const { currentUser, profile, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        جاري التحقق من الحساب...
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (profile?.disabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <ShieldAlert size={26} />
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-1">تم تعطيل حسابك</h1>
        <p className="text-slate-500 text-sm mb-6">تواصل مع إدارة المنصة لمزيد من التفاصيل.</p>
        <button
          onClick={logout}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg py-2 px-6 text-sm"
        >
          تسجيل الخروج
        </button>
      </div>
    )
  }

  if (allowRoles && profile && !allowRoles.includes(profile.role)) {
    return <Navigate to={`/${profile.role}`} replace />
  }

  return children
}
