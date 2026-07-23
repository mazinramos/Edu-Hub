import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  PlayCircle,
  BarChart3,
  BookOpen,
  Video,
  CreditCard,
  QrCode,
  ClipboardCheck,
  UserPlus,
  Search,
  CalendarCheck,
  Award,
  ChevronDown,
  Mail,
  Phone
} from 'lucide-react'
import Logo from '../components/Logo'
import { useAllCollection } from '../hooks/useAllCollection'

const FAQS = [
  {
    q: 'هل المنصة مجانية؟',
    a: 'التسجيل في المنصة مجاني تمامًا. المدرسين بيحددوا سعر كل كورس بنفسهم، وفي كورسات كتير متاحة مجانًا.'
  },
  {
    q: 'إزاي أسجّل كمدرس؟',
    a: 'من صفحة "إنشاء حساب"، اختار نوع الحساب "مدرس" واملى بياناتك، وابدأ تضيف كورساتك فورًا.'
  },
  {
    q: 'هل ولي الأمر يقدر يتابع أكتر من ابن؟',
    a: 'أيوه، ولي الأمر يقدر يربط حسابه بأي عدد من حسابات أبنائه الطلاب ويتابع الكل من مكان واحد.'
  },
  {
    q: 'إزاي بيتم الدفع مقابل الكورسات؟',
    a: 'عن طريق بوابة دفع إلكتروني آمنة (فيزا، ماستركارد، محافظ إلكترونية) — بياناتك المالية متشفّرة ومحمية بالكامل.'
  }
]

const FEATURES = [
  { icon: BarChart3, title: 'تحليلات وتقارير', desc: 'تقارير ذكية عن أداء الطلاب، الحضور، الإيرادات، ونسب الإنجاز.' },
  { icon: BookOpen, title: 'إدارة الكورسات', desc: 'إنشاء الدروس، رفع الفيديوهات، وتنظيم المحتوى التعليمي.' },
  { icon: Video, title: 'دروس وفيديوهات', desc: 'رفع دروس فيديو وملفات لكل كورس، متاحة للطلاب المسجّلين.' },
  { icon: CreditCard, title: 'إدارة المدفوعات', desc: 'متابعة الاشتراكات والمدفوعات والأرباح بسهولة.' },
  { icon: QrCode, title: 'حضور ذكي', desc: 'تتبع تقدم الطالب في الدروس لحظة بلحظة.' },
  { icon: ClipboardCheck, title: 'اختبارات وواجبات', desc: 'إنشاء اختبارات إلكترونية وبنك أسئلة لمتابعة مستوى الطلاب.' }
]

const STEPS = [
  { num: '01', icon: UserPlus, title: 'إنشاء حساب', desc: 'اختر نوع الحساب المناسب: طالب، مدرس، أو ولي أمر.' },
  { num: '02', icon: Search, title: 'اختيار المدرس', desc: 'تصفح المدرسين والكورسات واختر الأنسب لك.' },
  { num: '03', icon: CalendarCheck, title: 'حجز الحصة', desc: 'حدد الموعد وابدأ التعلم أونلاين أو حضوريًا.' },
  { num: '04', icon: Award, title: 'حقق النجاح', desc: 'تابع تقدمك واحصل على التقارير والشهادات.' }
]

export default function LandingPage() {
  const { items: courses } = useAllCollection('courses')
  const { items: users } = useAllCollection('users')
  const teachersCount = users.filter((u) => u.role === 'teacher').length
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* شريط التنقل */}
      <header className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600">المميزات</a>
            <a href="#how" className="hover:text-primary-600">كيف تعمل المنصة</a>
            <Link to="/teachers" className="hover:text-primary-600">المدرسين</Link>
            <a href="#faq" className="hover:text-primary-600">الأسئلة الشائعة</a>
            <a href="#contact" className="hover:text-primary-600">تواصل معنا</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-primary-600 border border-primary-200 rounded-lg px-4 py-2 hover:bg-primary-50"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold rounded-full px-3 py-1.5 mb-5">
            منصة تعليمية متكاملة
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 leading-tight mb-5">
            أفضل الفرص التعليمية <span className="text-primary-500">بشكل احترافي</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg mb-8 leading-relaxed">
            منصة حديثة تجمع الطالب والمدرس وولي الأمر والإدارة في مكان واحد، مع إدارة الكورسات،
            الحضور، الاختبارات، المدفوعات، الفصول المباشرة، والتقارير الذكية.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg px-6 py-3 text-sm"
            >
              ابدأ مجانًا
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 border border-slate-200 rounded-lg px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <PlayCircle size={18} /> مشاهدة المنصة
            </a>
          </div>

          <div className="flex gap-10 mt-12">
            <div>
              <p className="text-2xl font-extrabold text-primary-600">+{courses.length}</p>
              <p className="text-sm text-slate-500 mt-1">كورس</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary-600">+{teachersCount}</p>
              <p className="text-sm text-slate-500 mt-1">مدرس</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <div className="w-40 h-40 rounded-3xl bg-primary-500 flex items-center justify-center text-white shadow-soft">
              <GraduationCap size={72} />
            </div>
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section id="features" className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold rounded-full px-3 py-1.5 mb-4">
              مميزات المنصة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">
              كل ما تحتاجه لإدارة العملية التعليمية
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              حل متكامل يساعد المدرسين والطلاب وأولياء الأمور على تنظيم ومتابعة الدروس بسهولة.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* كيف تعمل المنصة */}
      <section id="how" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold rounded-full px-3 py-1.5 mb-4">
              كيف تعمل المنصة؟
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              ابدأ رحلتك التعليمية في خطوات بسيطة
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 text-center">
                <span className="text-3xl font-extrabold text-primary-100">{num}</span>
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mx-auto -mt-2 mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الأسئلة الشائعة */}
      <section id="faq" className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold rounded-full px-3 py-1.5 mb-4">
              الأسئلة الشائعة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">عندك سؤال؟</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-right"
                >
                  <span className="font-bold text-slate-800 text-sm">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تواصل معنا */}
      <section id="contact" className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold rounded-full px-3 py-1.5 mb-4">
            تواصل معنا
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4">محتاج مساعدة؟</h2>
          <p className="text-slate-500 mb-8">فريقنا جاهز يساعدك في أي وقت.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:support@eduhub.app"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Mail size={16} /> support@eduhub.app
            </a>
            <a
              href="tel:+20000000000"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Phone size={16} /> تواصل هاتفيًا
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            جاهز تبدأ رحلتك التعليمية؟
          </h2>
          <p className="text-primary-100 mb-7">انضم لـ EduHub اليوم مجانًا وابدأ التعلم أو التدريس بشكل احترافي.</p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 font-bold rounded-lg px-8 py-3 text-sm hover:bg-primary-50"
          >
            إنشاء حساب مجاني
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} EduHub. كل الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
