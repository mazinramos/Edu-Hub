import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { GraduationCap, Printer, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStudentCollection } from '../hooks/useStudentCollection'
import { useCollectionByCourseIds } from '../hooks/useCollectionByCourseIds'
import { db } from '../firebase'

export default function CertificatePage() {
  const { courseId } = useParams()
  const { currentUser, profile } = useAuth()
  const { items: enrollments, loading: loadingEnrollments } = useStudentCollection('enrollments')
  const { items: results } = useStudentCollection('testResults')
  const { items: tests } = useCollectionByCourseIds('tests', [courseId])

  const [course, setCourse] = useState(null)
  const [teacherName, setTeacherName] = useState('')
  const [certId, setCertId] = useState('')
  const [ready, setReady] = useState(false)

  const enrollment = enrollments.find((e) => e.courseId === courseId)
  const courseResults = results.filter((r) => r.courseId === courseId)
  const eligible = tests.length === 0 ? true : courseResults.length >= tests.length

  useEffect(() => {
    async function loadAndIssue() {
      if (!enrollment) return

      const courseSnap = await getDoc(doc(db, 'courses', courseId))
      if (courseSnap.exists()) {
        setCourse(courseSnap.data())
        const teacherSnap = await getDoc(doc(db, 'users', courseSnap.data().teacherId))
        if (teacherSnap.exists()) setTeacherName(teacherSnap.data().name)
      }

      const q = query(
        collection(db, 'certificates'),
        where('studentId', '==', currentUser.uid),
        where('courseId', '==', courseId)
      )
      const existing = await getDocs(q)
      if (!existing.empty) {
        setCertId(existing.docs[0].id)
      } else {
        const newCert = await addDoc(collection(db, 'certificates'), {
          studentId: currentUser.uid,
          studentName: profile?.name || '',
          courseId,
          courseName: enrollment.courseName,
          teacherId: enrollment.teacherId,
          issuedAt: serverTimestamp()
        })
        setCertId(newCert.id)
      }
      setReady(true)
    }
    if (enrollment && eligible) loadAndIssue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment?.id, eligible])

  if (loadingEnrollments) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">جاري التحميل...</div>
  }

  if (!enrollment) {
    return <Navigate to="/student/certs" replace />
  }

  if (!eligible) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-slate-600 mb-4">لسه معملتش كل اختبارات الكورس ده عشان تستخرج الشهادة.</p>
        <Link to="/student/certs" className="text-primary-600 font-semibold hover:underline">
          رجوع
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <Link to="/student/certs" className="inline-flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
          <ArrowRight size={16} /> رجوع للشهادات
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg py-2 px-5 text-sm"
        >
          <Printer size={16} /> طباعة / حفظ PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft border-8 border-primary-100 p-10 sm:p-14 text-center print:border-primary-200 print:shadow-none">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white">
            <GraduationCap size={30} />
          </div>
        </div>

        <p className="text-sm tracking-widest text-primary-500 font-semibold mb-2">EDUHUB</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-8">شهادة إتمام كورس</h1>

        <p className="text-slate-500 mb-2">تشهد منصة EduHub بأن الطالب</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-600 mb-4">
          {enrollment.studentName || profile?.name}
        </h2>
        <p className="text-slate-500 mb-2">قد أتم بنجاح كورس</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8">{enrollment.courseName}</h3>

        {teacherName && <p className="text-slate-500 mb-1">تحت إشراف المدرس: {teacherName}</p>}

        <div className="flex items-center justify-center gap-10 mt-10 pt-6 border-t border-slate-100 text-sm text-slate-400">
          <span>تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</span>
          {ready && <span>رقم الشهادة: {certId.slice(0, 8).toUpperCase()}</span>}
        </div>
      </div>
    </div>
  )
}
