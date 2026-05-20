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
    full_name: '',
    specialty: '',
    group_name: '',
    bio: '',
    avatar_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) setProfile(data as Profile)
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id)

      if (!error) {
        setMessage('Профиль обновлён!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        console.error('Ошибка обновления:', error)
      }
    } catch (error) {
      console.error('Ошибка:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto p-4 md:p-6">
          <div aria-live="polite" aria-label="Загрузка профиля">
            <p>Загрузка...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Мой профиль</h1>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className="success-message"
          >
            {message}
          </div>
        )}

        <form
          onSubmit={updateProfile}
          className="card space-y-4"
          aria-busy={isSubmitting}
          aria-label="Редактирование профиля"
          noValidate
        >
          {/* ФИО */}
          <div>
            <label htmlFor="full_name" className="form-label">
              ФИО
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name || ''}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className="input"
              aria-required="false"
            />
          </div>

          {/* Специальность */}
          <div>
            <label htmlFor="specialty" className="form-label">
              Специальность
            </label>
            <input
              id="specialty"
              type="text"
              value={profile.specialty || ''}
              onChange={(e) =>
                setProfile({ ...profile, specialty: e.target.value })
              }
              className="input"
              aria-required="false"
            />
          </div>

          {/* Группа */}
          <div>
            <label htmlFor="group_name" className="form-label">
              Группа
            </label>
            <input
              id="group_name"
              type="text"
              value={profile.group_name || ''}
              onChange={(e) =>
                setProfile({ ...profile, group_name: e.target.value })
              }
              className="input"
              aria-required="false"
            />
          </div>

          {/* О себе */}
          <div>
            <label htmlFor="bio" className="form-label">
              О себе
            </label>
            <textarea
              id="bio"
              value={profile.bio || ''}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              className="input"
              rows={3}
              aria-required="false"
            />
          </div>

          {/* Кнопка сохранения */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </main>
    </div>
  )
}