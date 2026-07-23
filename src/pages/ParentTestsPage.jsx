import { ClipboardCheck } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useParentCollection } from '../hooks/useParentCollection'
import { useCollectionByStudentIds } from '../hooks/useCollectionByStudentIds'
import { parentNavItems } from './ParentDashboard'

export default function ParentTestsPage() {
  const { items: children, loading: loadingChildren } = useParentCollection('parentLinks')
  const studentIds = children.map((c) => c.studentId)
  const { items: results, loading } = useCollectionByStudentIds('testResults', studentIds)

  const nameById = {}
  children.forEach((c) => {
    nameById[c.studentId] = c.studentName
  })

  return (
    <DashboardShell
      navItems={parentNavItems}
      activeKey="tests"
      title="نتائج الاختبارات"
      subtitle="تابع درجات أبنائك في الاختبارات"
    >
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        {!loadingChildren && children.length === 0 && (
          <p className="text-slate-500 text-sm">لازم تربط طالب الأول من صفحة "أبنائي".</p>
        )}

        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && children.length > 0 && results.length === 0 && (
          <p className="text-slate-500 text-sm">أبناؤك لسه معملوش أي اختبار.</p>
        )}

        <div className="space-y-3">
          {results.map((r) => (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-100 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                  <ClipboardCheck size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{r.testTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {nameById[r.studentId] || r.studentName} · {r.courseName}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-emerald-600 shrink-0">
                {r.score} / {r.totalScore}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
