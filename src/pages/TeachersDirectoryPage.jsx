import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Star, BookOpen, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'
import { useAllCollection } from '../hooks/useAllCollection'

export default function TeachersDirectoryPage() {
  const { items: users, loading } = useAllCollection('users')
  const { items: courses } = useAllCollection('courses')
  const { items: ratings } = useAllCollection('ratings')

  const teachers = users.filter((u) => u.role === 'teacher' && !u.disabled)

  const ratingByTeacher = useMemo(() => {
    const map = {}
    ratings.forEach((r) => {
      if (!map[r.teacherId]) map[r.teacherId] = []
      map[r.teacherId].push(r.rating)
    })
    const avg = {}
    Object.entries(map).forEach(([id, list]) => {
      avg[id] = (list.reduce((a, b) => a + b, 0) / list.length).toFixed(1)
    })
    return avg
  }, [ratings])

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-primary-600 border border-primary-200 rounded-lg px-4 py-2 hover:bg-primary-50">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline mb-4">
          <ArrowRight size={16} /> الرئيسية
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">مدرسينا</h1>
        <p className="text-slate-500 mb-8">تصفّح نخبة من المدرسين على منصة EduHub وسجّل مجانًا لمتابعة كورساتهم.</p>

        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && teachers.length === 0 && (
          <p className="text-slate-500 text-sm">لسه مفيش مدرسين على المنصة.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teachers.map((t) => {
            const courseCount = courses.filter((c) => c.teacherId === t.id).length
            const rating = ratingByTeacher[t.id]
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 text-center">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.name} className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mx-auto mb-4 text-xl font-extrabold">
                    {t.name?.[0] || 'م'}
                  </div>
                )}
                <h3 className="font-bold text-slate-800 mb-1">{t.name}</h3>
                {rating && (
                  <p className="flex items-center justify-center gap-1 text-xs text-amber-500 font-semibold mb-2">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {rating}
                  </p>
                )}
                <p className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-4">
                  <BookOpen size={12} /> {courseCount} كورس
                </p>
                <Link
                  to="/register"
                  className="inline-block text-sm font-semibold bg-primary-50 text-primary-600 rounded-lg px-4 py-2 hover:bg-primary-100"
                >
                  سجّل لمتابعته
                </Link>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
