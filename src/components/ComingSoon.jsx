import { Construction } from 'lucide-react'

export default function ComingSoon({ label }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mx-auto mb-4">
        <Construction size={26} />
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">{label} — قريباً</h2>
      <p className="text-slate-500 text-sm">هنبني القسم ده في مرحلة جاية.</p>
    </div>
  )
}
