import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, CheckCircle2, Star, SlidersHorizontal } from 'lucide-react'
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'
import { useAllCourses } from '../hooks/useAllCourses'
import { useAllCollection } from '../hooks/useAllCollection'
import { useStudentCollection } from '../hooks/useStudentCollection'
import { db, functions } from '../firebase'
import { createNotification } from '../utils/notify'
import { studentNavItems } from './StudentDashboard'

export default function StudentCoursesPage() {
  const { currentUser, profile } = useAuth()
  const { items: allCourses, loading } = useAllCourses()
  const { items: enrollments } = useStudentCollection('enrollments')
  const { items: allRatings } = useAllCollection('ratings')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [enrollingId, setEnrollingId] = useState(null)
  const [payError, setPayError] = useState('')

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId))
  const myCourses = allCourses.filter((c) => enrolledCourseIds.has(c.id))

  const categories = useMemo(
    () => [...new Set(allCourses.map((c) => c.category).filter(Boolean))],
    [allCourses]
  )

  const ratingByCourse = useMemo(() => {
    const map = {}
    allRatings.forEach((r) => {
      if (!map[r.courseId]) map[r.courseId] = []
      map[r.courseId].push(r.rating)
    })
    const avg = {}
    Object.entries(map).forEach(([courseId, ratings]) => {
      avg[courseId] = {
        value: ratings.reduce((a, b) => a + b, 0) / ratings.length,
        count: ratings.length
      }
    })
    return avg
  }, [allRatings])

  const otherCourses = useMemo(() => {
    let list = allCourses.filter(
      (c) =>
        !enrolledCourseIds.has(c.id) &&
        (c.title?.includes(search) || c.category?.includes(search) || search.trim() === '')
    )
    if (category !== 'all') list = list.filter((c) => c.category === category)
    if (priceFilter === 'free') list = list.filter((c) => !c.price)
    if (priceFilter === 'paid') list = list.filter((c) => c.price > 0)

    if (sortBy === 'rating') {
      list = [...list].sort(
        (a, b) => (ratingByCourse[b.id]?.value || 0) - (ratingByCourse[a.id]?.value || 0)
      )
    } else if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0))
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCourses, enrolledCourseIds, search, category, priceFilter, sortBy, ratingByCourse])

  async function handleEnroll(course) {
    setEnrollingId(course.id)
    setPayError('')
    try {
      if (course.price) {
        // كورس مدفوع: نفتح بوابة دفع Paymob الحقيقية عن طريق Cloud Function
        const createPaymobPayment = httpsCallable(functions, 'createPaymobPayment')
        const result = await createPaymobPayment({ courseId: course.id })
        window.location.href = result.data.iframeUrl
        return
      }

      // كورس مجاني: تسجيل فوري بدون دفع
      await addDoc(collection(db, 'enrollments'), {
        studentId: currentUser.uid,
        studentName: profile?.name || '',
        courseId: course.id,
        courseName: course.title,
        teacherId: course.teacherId,
        progress: 0,
        createdAt: serverTimestamp()
      })
      await updateDoc(doc(db, 'courses', course.id), {
        studentsCount: increment(1)
      })

      createNotification({
        userId: course.teacherId,
        type: 'enrollment',
        title: 'طالب جديد سجّل في كورسك',
        body: `${profile?.name || 'طالب'} سجّل في "${course.title}"`,
        link: '/teacher/students'
      })
    } catch (err) {
      console.error(err)
      setPayError(
        err.code === 'functions/failed-precondition'
          ? 'بوابة الدفع مش متظبطة على السيرفر لسه، كلّم صاحب المنصة.'
          : 'تعذر إتمام العملية، حاول تاني.'
      )
    } finally {
      setEnrollingId(null)
    }
  }

  return (
    <DashboardShell
      navItems={studentNavItems}
      activeKey="courses"
      title="الكورسات"
      subtitle="سجّل في كورسات جديدة وتابع كورساتك"
    >
      {myCourses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-5">كورساتي</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.map((course) => (
              <Link
                key={course.id}
                to={`/student/course/${course.id}`}
                className="border border-slate-100 rounded-xl p-4 hover:border-primary-200 transition-colors"
              >
                <div className="w-full h-24 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold mb-3">
                  {course.category}
                </div>
                <h3 className="font-bold text-slate-800">{course.title}</h3>
                <p className="text-xs text-primary-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 size={14} /> مسجّل بالفعل
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-slate-800">كل الكورسات المتاحة</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن كورس أو مادة"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-sm focus-ring focus:border-primary-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6 pb-5 border-b border-slate-100">
          <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3"
          >
            <option value="all">كل المواد</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3"
          >
            <option value="all">كل الأسعار</option>
            <option value="free">مجاني</option>
            <option value="paid">مدفوع</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-3"
          >
            <option value="newest">الأحدث</option>
            <option value="rating">الأعلى تقييمًا</option>
            <option value="price_asc">السعر: من الأقل</option>
            <option value="price_desc">السعر: من الأعلى</option>
          </select>
        </div>

        {payError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {payError}
          </div>
        )}

        {loading && <p className="text-slate-500 text-sm">جاري التحميل...</p>}
        {!loading && otherCourses.length === 0 && (
          <p className="text-slate-500 text-sm">مفيش كورسات متاحة دلوقتي، تابعنا قريبًا.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherCourses.map((course) => (
            <div key={course.id} className="border border-slate-100 rounded-xl p-4">
              <div className="w-full h-24 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold mb-3">
                {course.category}
              </div>
              <h3 className="font-bold text-slate-800">{course.title}</h3>
              {ratingByCourse[course.id] && (
                <p className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {ratingByCourse[course.id].value.toFixed(1)}
                  <span className="text-slate-400 font-normal">({ratingByCourse[course.id].count})</span>
                </p>
              )}
              {course.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Users size={12} /> {course.studentsCount || 0} طالب
                </p>
                <span className="text-xs font-semibold text-primary-600">
                  {course.price ? `${course.price} جنيه` : 'مجاني'}
                </span>
              </div>
              <button
                onClick={() => handleEnroll(course)}
                disabled={enrollingId === course.id}
                className="w-full mt-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg py-2 transition-colors"
              >
                {enrollingId === course.id
                  ? 'جاري التجهيز...'
                  : course.price
                  ? 'ادفع واشترك الآن'
                  : 'سجّل مجانًا'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
