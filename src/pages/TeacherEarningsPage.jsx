import { Wallet, TrendingUp, Receipt, Download } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useTeacherCollection } from '../hooks/useTeacherCollection'
import { exportToExcel } from '../utils/exportExcel'
import { teacherNavItems } from './TeacherCoursesPage'

export default function TeacherEarningsPage() {
  const { items: payments, loading, error } = useTeacherCollection('payments')

  const paidPayments = payments.filter((p) => !p.status || p.status === 'paid')
  const total = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const thisMonth = paidPayments
    .filter((p) => {
      const d = p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000) : null
      const now = new Date()
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  function handleExport() {
    const rows = paidPayments.map((p) => ({
      الطالب: p.studentName,
      الكورس: p.courseName,
      'المبلغ (جنيه)': p.amount,
      التاريخ: p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : ''
    }))
    exportToExcel([{ name: 'الأرباح', rows }], 'أرباح-EduHub.xlsx')
  }

  return (
    <DashboardShell
      navItems={teacherNavItems}
      activeKey="earnings"
      title="الأرباح"
      subtitle="تابع مدفوعات طلابك من كل كورس"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800">{total} جنيه</div>
            <div className="text-sm text-slate-500">إجمالي الأرباح</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800">{thisMonth} جنيه</div>
            <div className="text-sm text-slate-500">أرباح الشهر الحالي</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
            <Receipt size={20} />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800">{paidPayments.length}</div>
            <div className="text-sm text-slate-500">عدد عمليات الشراء</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-slate-800">سجل المدفوعات</h2>
          {paidPayments.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm font-semibold text-primary-600 border border-primary-200 rounded-lg px-3 py-1.5 hover:bg-primary-50"
            >
              <Download size={14} /> تصدير Excel
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && paidPayments.length === 0 && (
          <p className="text-slate-500 text-sm">لسه معملتش أي أرباح، حط سعر لكورساتك وانتظر تسجيل الطلاب.</p>
        )}

        <div className="space-y-3">
          {paidPayments.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-slate-100 rounded-xl p-4"
            >
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{p.studentName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{p.courseName}</p>
              </div>
              <span className="text-sm font-semibold text-emerald-600">{p.amount} جنيه</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        ملاحظة: الأرباح دي بتتأكد فعليًا عن طريق بوابة الدفع Paymob — أي عملية "معلّقة" (Pending)
        معناها إن الطالب لسه ما خلّصش الدفع أو إن الـ Webhook لسه مستنّي التأكيد.
      </p>
    </DashboardShell>
  )
}
