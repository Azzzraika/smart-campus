'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <p className="p-10 opacity-70">Загрузка...</p>
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-1">Привет, {user.email}!</h1>
        <p className="opacity-70 mb-8">Добро пожаловать в Smart Campus</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ссылки-карточки со стилями card и плавным ховером */}
          <Link href="/tasks" className="card hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">📚 Задачи</h2>
            <p className="opacity-80 text-sm">Управляйте учебными заданиями</p>
          </Link>
          
          <Link href="/events" className="card hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">🎉 События</h2>
            <p className="opacity-80 text-sm">Мероприятия кампуса</p>
          </Link>
          
          <Link href="/profile" className="card hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">👤 Профиль</h2>
            <p className="opacity-80 text-sm">Редактируйте свои данные</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
