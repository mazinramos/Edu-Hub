import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth لازم يتنادى جوه AuthProvider')
  return ctx
}

const ROLES = ['student', 'teacher', 'parent']

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null) // { name, role, email }
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthError('')
      if (user) {
        setCurrentUser(user)
        try {
          const snap = await getDoc(doc(db, 'users', user.uid))
          if (snap.exists()) {
            setProfile(snap.data())
          } else {
            setProfile(null)
          }
        } catch (err) {
          console.error('تعذر تحميل بيانات المستخدم:', err)
          setProfile(null)
        }
      } else {
        setCurrentUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function register({ name, email, password, role }) {
    if (!ROLES.includes(role)) {
      throw new Error('نوع الحساب غير صحيح')
    }
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })

    const userDoc = {
      uid: credential.user.uid,
      name,
      email,
      role,
      createdAt: serverTimestamp()
    }
    await setDoc(doc(db, 'users', credential.user.uid), userDoc)
    setProfile(userDoc)
    return credential.user
  }

  async function login({ email, password }) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'users', credential.user.uid))
    if (snap.exists()) {
      setProfile(snap.data())
    }
    return credential.user
  }

  async function logout() {
    await signOut(auth)
  }

  const value = {
    currentUser,
    profile,
    role: profile?.role || null,
    loading,
    authError,
    setAuthError,
    register,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
