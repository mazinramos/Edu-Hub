import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import Logo from './Logo'
import NotificationBell from './NotificationBell'
import { useAuth } from '../context/AuthContext'

export default function DashboardShell({ navItems = [], activeKey, title, subtitle, children }) {
  const { profile, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = (
    <>
      <div className="h-16 flex items-center justify-center border-b border-slate-100 relative">
        <Logo size="sm" />
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              item.key === activeKey
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <item.icon size={18} className="shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col md:flex-row" dir="rtl">
      {/* شريط علوي بالموبايل */}
      <div className="md:hidden h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
        <Logo size="sm" />
        <button onClick={() => setMobileOpen(true)} className="text-slate-600">
          <Menu size={22} />
        </button>
      </div>

      {/* القائمة الجانبية - ثابتة على الشاشات الكبيرة */}
      <aside className="hidden md:flex w-64 bg-white border-s border-slate-100 flex-col shrink-0">
        {SidebarContent}
      </aside>

      {/* القائمة الجانبية - منسدلة على الموبايل */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-72 max-w-[80%] bg-white flex flex-col shadow-xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* المحتوى */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-soft border border-slate-100 px-5 sm:px-6 py-5 mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              {title || `مرحباً، ${profile?.name || '...'} 👋`}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{subtitle || 'إليك ملخص نشاطك اليوم'}</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                {profile?.name?.[0] || '؟'}
              </div>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
