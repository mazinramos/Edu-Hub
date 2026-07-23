import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, Presentation, Users } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { translateFirebaseError } from '../utils/firebaseErrors'

const ROLES = [
  { key: 'student', label: 'طالب', desc: 'أبحث عن دروس وكورسات', icon: GraduationCap },
  { key: 'teacher', label: 'مدرس', desc: 'أقدّم دروس وكورسات', icon: Presentation },
  { key: 'parent', label: 'ولي أمر', desc: 'أتابع أبنائي', icon: Users }
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('كلمة المرور لازم تكون 6 أحرف على الأقل.')
      return
    }

    setSubmitting(true)
    try {
      await register({ name, email, password, role })
      navigate(`/${role}`, { replace: true })
    } catch (err) {
      setError(translateFirebaseError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">إنشاء حساب جديد</h1>
          <p className="text-slate-500 text-center text-sm mb-6">
            اختار نوع حسابك وابدأ رحلتك التعليمية
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            {ROLES.map(({ key, label, desc, icon: Icon }) => {
              const active = role === key
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setRole(key)}
                  className={`text-center rounded-xl border-2 p-3 transition-colors focus-ring ${
                    active
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 w-9 h-9 rounded-lg flex items-center justify-center ${
                      active ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="text-sm font-bold text-slate-800">{label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{desc}</div>
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">الاسم كامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك بالكامل"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-4 text-sm focus-ring focus:border-primary-400"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 أحرف على الأقل"
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
              {submitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            عندك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
