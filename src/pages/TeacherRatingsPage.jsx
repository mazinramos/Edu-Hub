import { Star } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useTeacherCollection } from '../hooks/useTeacherCollection'
import { teacherNavItems } from './TeacherCoursesPage'

function Stars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

export default function TeacherRatingsPage() {
  const { items: ratings, loading, error } = useTeacherCollection('ratings')

  const avg = ratings.length
    ? (ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length).toFixed(1)
    : '—'

  return (
    <DashboardShell
      navItems={teacherNavItems}
      activeKey="ratings"
      title="التقييمات"
      subtitle="آراء طلابك في كورساتك"
    >
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 mb-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl font-extrabold shrink-0">
          {avg}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">متوسط التقييم</h2>
          <p className="text-sm text-slate-500">من {ratings.length} تقييم</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-5">آراء الطلاب</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && ratings.length === 0 && (
          <p className="text-slate-500 text-sm">لسه معندكش أي تقييمات.</p>
        )}

        <div className="space-y-3">
          {ratings.map((r) => (
            <div key={r.id} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800 text-sm">{r.studentName}</h3>
                <Stars value={r.rating} />
              </div>
              <p className="text-xs text-slate-500 mb-2">{r.courseName}</p>
              {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
