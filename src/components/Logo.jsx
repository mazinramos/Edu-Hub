import { GraduationCap } from 'lucide-react'

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-lg', icon: 16 },
    md: { box: 'w-10 h-10', text: 'text-xl', icon: 20 }
  }
  const s = sizes[size]
  return (
    <div className="flex items-center gap-2 select-none">
      <span className={`${s.box} rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-soft`}>
        <GraduationCap size={s.icon} />
      </span>
      <span className={`font-extrabold ${s.text} text-slate-800`}>EduHub</span>
    </div>
  )
}
