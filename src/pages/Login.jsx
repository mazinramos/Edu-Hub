import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { translateFirebaseError } from '../utils/firebaseErrors'

const ROLE_HOME = {
  student: '/student',
  teacher: '/teacher',
  parent: '/parent'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login({ email, password })
      // نحاول نجيب الدور من الداتابيز عبر السياق بعد اللوجن
      const dest = location.state?.from || null
      // التوجيه الفعلي حسب الدور بيتم جوه App.jsx (RoleRedirect) لو مفيش state
      navigate(dest || '/redirecting', { replace: true })
    } catch (err) {
      setError(translateFirebaseError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">تسجيل الدخول</h1>
          <p className="text-slate-500 text-center text-sm mb-6">
            أهلاً بيك تاني في منصتك التعليمية
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-4 text-sm focus-ring focus:border-primary-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-10 text-sm focus-ring focus:border-primary-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors focus-ring"
            >
              {submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            لسه معندكش حساب؟{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
