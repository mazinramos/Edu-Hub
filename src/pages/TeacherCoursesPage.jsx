import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'
import { useTeacherCollection } from '../hooks/useTeacherCollection'
import { db } from '../firebase'
import { teacherNavItems } from '../navItems'

export { teacherNavItems }


export default function TeacherCoursesPage() {
  const { currentUser } = useAuth()
  const { items: courses, loading, error } = useTeacherCollection('courses')

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    if (!title.trim()) {
      setFormError('اكتب اسم الكورس.')
      return
    }
    setSaving(true)
    try {
      await addDoc(collection(db, 'courses'), {
        teacherId: currentUser.uid,
        title: title.trim(),
        category: category.trim() || 'عام',
        description: description.trim(),
        price: Number(price) || 0,
        studentsCount: 0,
        createdAt: serverTimestamp()
      })
      setTitle('')
      setCategory('')
      setDescription('')
      setPrice('')
    } catch (err) {
      console.error(err)
      setFormError('حصل خطأ أثناء حفظ الكورس، حاول تاني.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('متأكد إنك عايز تحذف الكورس ده؟')) return
    try {
      await deleteDoc(doc(db, 'courses', id))
    } catch (err) {
      console.error(err)
      alert('تعذر حذف الكورس.')
    }
  }

  return (
    <DashboardShell
      navItems={teacherNavItems}
      activeKey="courses"
      title="إدارة الكورسات"
      subtitle="أضف وتابع كورساتك التعليمية"
    >
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">إنشاء كورس جديد</h2>

        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">اسم الكورس</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: الرياضيات المتقدمة"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">التصنيف / المادة</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="مثال: رياضيات"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">السعر (جنيه) — اتركه فارغ لو مجاني</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">وصف الكورس</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="وصف مختصر عن محتوى الكورس"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 px-6 text-sm transition-colors focus-ring"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ الكورس'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-5">قائمة الكورسات</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && courses.length === 0 && (
          <p className="text-slate-500 text-sm">لسه معملتش أي كورس، ابدأ بإضافة أول كورس من فوق.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border border-slate-100 rounded-xl p-4 relative">
              <button
                onClick={() => handleDelete(course.id)}
                className="absolute left-3 top-3 text-slate-300 hover:text-red-500 transition-colors"
                title="حذف الكورس"
              >
                <Trash2 size={16} />
              </button>
              <div className="w-full h-24 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold mb-3">
                {course.category}
              </div>
              <h3 className="font-bold text-slate-800">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-1">عدد الطلاب: {course.studentsCount || 0}</p>
              <p className="text-sm font-semibold text-primary-600 mt-1">
                {course.price ? `${course.price} جنيه` : 'مجاني'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
