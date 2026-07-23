import {
  LayoutGrid,
  BookOpen,
  ClipboardCheck,
  Award,
  User,
  PlayCircle,
  Video,
  Users,
  Wallet,
  Star,
  MessageCircle,
  TrendingUp
} from 'lucide-react'

export const studentNavItems = [
  { key: 'home', label: 'الرئيسية', icon: LayoutGrid, to: '/student' },
  { key: 'courses', label: 'الكورسات', icon: BookOpen, to: '/student/courses' },
  { key: 'tests', label: 'الاختبارات', icon: ClipboardCheck, to: '/student/tests' },
  { key: 'certs', label: 'الشهادات', icon: Award, to: '/student/certs' },
  { key: 'profile', label: 'الملف الشخصي', icon: User, to: '/student/profile' }
]

export const teacherNavItems = [
  { key: 'home', label: 'الرئيسية', icon: LayoutGrid, to: '/teacher' },
  { key: 'courses', label: 'الكورسات', icon: PlayCircle, to: '/teacher/courses' },
  { key: 'lessons', label: 'الدروس', icon: Video, to: '/teacher/lessons' },
  { key: 'tests', label: 'الاختبارات', icon: ClipboardCheck, to: '/teacher/tests' },
  { key: 'students', label: 'الطلاب', icon: Users, to: '/teacher/students' },
  { key: 'messages', label: 'الرسائل', icon: MessageCircle, to: '/teacher/messages' },
  { key: 'earnings', label: 'الأرباح', icon: Wallet, to: '/teacher/earnings' },
  { key: 'ratings', label: 'التقييمات', icon: Star, to: '/teacher/ratings' },
  { key: 'profile', label: 'الملف الشخصي', icon: User, to: '/teacher/profile' }
]

export const parentNavItems = [
  { key: 'home', label: 'الرئيسية', icon: LayoutGrid, to: '/parent' },
  { key: 'children', label: 'أبنائي', icon: Users, to: '/parent/children' },
  { key: 'progress', label: 'التقدم الدراسي', icon: TrendingUp, to: '/parent/progress' },
  { key: 'tests', label: 'نتائج الاختبارات', icon: ClipboardCheck, to: '/parent/tests' },
  { key: 'contact', label: 'التواصل مع المدرسين', icon: MessageCircle, to: '/parent/contact' },
  { key: 'profile', label: 'الملف الشخصي', icon: User, to: '/parent/profile' }
]
