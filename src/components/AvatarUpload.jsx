import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { Camera, User } from 'lucide-react'
import { db, storage } from '../firebase'

export default function AvatarUpload({ userId, avatarUrl, name, onUploaded }) {
  const [uploading, setUploading] = useState(false)

  async function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fileRef = ref(storage, `avatars/${userId}/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      await updateDoc(doc(db, 'users', userId), { avatarUrl: url })
      onUploaded?.(url)
    } catch (err) {
      console.error(err)
      alert('تعذر رفع الصورة، حاول تاني.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center">
            <User size={24} />
          </div>
        )}
        <label className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center cursor-pointer shadow-soft">
          <Camera size={12} />
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{name}</p>
        <p className="text-xs text-slate-400">{uploading ? 'جاري رفع الصورة...' : 'اضغط على الكاميرا لتغيير الصورة'}</p>
      </div>
    </div>
  )
}
