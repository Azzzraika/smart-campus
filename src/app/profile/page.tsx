'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

type Profile = {
  full_name: string
  specialty: string
  group_name: string
  bio: string
  avatar_url: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ 
    full_name: '', specialty: '', group_name: '', bio: '', avatar_url: '' 
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) setProfile(data as Profile)
    setLoading(false)
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update(profile).eq('id', user.id)
    if (!error) {
      setMessage('Профиль обновлён!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <p className="p-6 opacity-70">Загрузка...</p>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Мой профиль</h1>
        
        {message && (
          <div className="bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 p-3 rounded border border-green-200/50 dark:border-green-900/50 mb-4 transition-colors">
            {message}
          </div>
        )}
        
        {/* Заменено на кастомный класс card */}
        <form onSubmit={updateProfile} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-90">ФИО</label>
            <input
              value={profile.full_name || ''}
              onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-90">Специальность</label>
            <input
              value={profile.specialty || ''}
              onChange={(e) => setProfile({...profile, specialty: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-90">Группа</label>
            <input
              value={profile.group_name || ''}
              onChange={(e) => setProfile({...profile, group_name: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-90">О себе</label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className="input"
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary">
            Сохранить
          </button>
        </form>
      </div>
    </div>
  )
}
