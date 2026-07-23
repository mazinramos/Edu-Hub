import { useState } from 'react'
import { UserPlus, Trash2, GraduationCap } from 'lucide-react'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'
import { useParentCollection } from '../hooks/useParentCollection'
import { db } from '../firebase'
import { parentNavItems } from './ParentDashboard'

export default function ParentChildrenPage() {
  const { currentUser } = useAuth()
  const { items: children, loading, error } = useParentCollection('parentLinks')

  const [email, setEmail] = useState('')
  const [searching, setSearching] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleAddChild(e) {
    e.preventDefault()
    setFormError('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) return setFormError('اكتب البريد الإلكتروني للطالب.')

    if (children.some((c) => c.studentEmail?.toLowerCase() === cleanEmail)) {
      setFormError('الطالب ده متربط بحسابك بالفعل.')
      return
    }

    setSearching(true)
    try {
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail), where('role', '==', 'student'))
      const snap = await getDocs(q)

      if (snap.empty) {
        setFormError('مفيش حساب طالب بالبريد الإلكتروني ده.')
        return
      }

      const studentDoc = snap.docs[0]
      await addDoc(collection(db, 'parentLinks'), {
        parentId: currentUser.uid,
        studentId: studentDoc.id,
        studentName: studentDoc.data().name,
        studentEmail: studentDoc.data().email,
        createdAt: serverTimestamp()
      })
      setEmail('')
    } catch (err) {
      console.error(err)
      setFormError('حصل خطأ أثناء البحث، حاول تاني.')
    } finally {
      setSearching(false)
    }
  }

  async function handleRemove(id) {
    if (!confirm('متأكد إنك عايز تفك الربط مع الطالب ده؟')) return
    try {
      await deleteDoc(doc(db, 'parentLinks', id))
    } catch (err) {
      console.error(err)
      alert('تعذر فك الربط.')
    }
  }

  return (
    <DashboardShell
      navItems={parentNavItems}
      activeKey="children"
      title="أبنائي"
      subtitle="اربط حسابك بحسابات أبنائك الطلاب لمتابعتهم"
    >
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">ربط طالب جديد</h2>

        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddChild} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني لحساب الطالب"
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
          />
          <button
            type="submit"
            disabled={searching}
            className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 px-6 text-sm"
          >
            <UserPlus size={16} /> {searching ? 'جاري البحث...' : 'ربط الطالب'}
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-2">
          لازم يكون ابنك عامل حساب "طالب" على المنصة بنفس البريد الإلكتروني.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-5">الأبناء المرتبطين</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && children.length === 0 && (
          <p className="text-slate-500 text-sm">لسه مربطتش أي طالب، اربط أول طالب من فوق.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <div key={child.id} className="border border-slate-100 rounded-xl p-4 relative">
              <button
                onClick={() => handleRemove(child.id)}
                className="absolute left-3 top-3 text-slate-300 hover:text-red-500 transition-colors"
                title="فك الربط"
              >
                <Trash2 size={16} />
              </button>
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-3">
                <GraduationCap size={18} />
              </div>
              <h3 className="font-bold text-slate-800">{child.studentName}</h3>
              <p className="text-xs text-slate-500 mt-1">{child.studentEmail}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
