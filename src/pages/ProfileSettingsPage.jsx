import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { Mail, Save } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import AvatarUpload from '../components/AvatarUpload'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'

export default function ProfileSettingsPage({ navItems }) {
  const { currentUser, profile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile(currentUser, { displayName: name })
      await updateDoc(doc(db, 'users', currentUser.uid), { name })
      setSaved(true)
    } catch (err) {
      console.error(err)
      alert('تعذر حفظ التعديلات.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardShell navItems={navItems} activeKey="profile" title="الملف الشخصي">
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 sm:p-8 max-w-lg space-y-6">
        <AvatarUpload
          userId={currentUser.uid}
          avatarUrl={avatarUrl}
          name={profile?.name}
          onUploaded={setAvatarUrl}
        />

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus-ring focus:border-primary-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-100 py-2.5 pr-10 pl-4 text-sm text-slate-500"
              />
            </div>
          </div>

          {saved && <p className="text-emerald-600 text-sm">تم حفظ التعديلات ✅</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 px-6 text-sm"
          >
            <Save size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </form>
      </div>
    </DashboardShell>
  )
}
