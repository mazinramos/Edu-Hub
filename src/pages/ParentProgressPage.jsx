import { BookOpen } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useParentCollection } from '../hooks/useParentCollection'
import { useCollectionByStudentIds } from '../hooks/useCollectionByStudentIds'
import { parentNavItems } from './ParentDashboard'

export default function ParentProgressPage() {
  const { items: children, loading: loadingChildren } = useParentCollection('parentLinks')
  const studentIds = children.map((c) => c.studentId)
  const { items: enrollments, loading } = useCollectionByStudentIds('enrollments', studentIds)

  return (
    <DashboardShell
      navItems={parentNavItems}
      activeKey="progress"
      title="التقدم الدراسي"
      subtitle="تابع كورسات أبنائك ونسب تقدمهم"
    >
      {!loadingChildren && children.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 text-center text-slate-500">
          لازم تربط طالب الأول من صفحة "أبنائي".
        </div>
      )}

      {children.map((child) => {
        const childEnrollments = enrollments.filter((e) => e.studentId === child.studentId)
        return (
          <div key={child.id} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">{child.studentName}</h2>

            {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
            {!loading && childEnrollments.length === 0 && (
              <p className="text-slate-500 text-sm">لسه مسجّلش في أي كورس.</p>
            )}

            <div className="space-y-3">
              {childEnrollments.map((en) => (
                <div key={en.id} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-primary-500" />
                      <span className="font-semibold text-slate-800 text-sm">{en.courseName}</span>
                    </div>
                    <span className="text-xs text-slate-500">{en.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${en.progress || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </DashboardShell>
  )
}
