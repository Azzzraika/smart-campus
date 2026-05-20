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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="p-10">
          <div aria-live="polite" aria-label="Загрузка панели управления">
            <p className="opacity-70">Загрузка...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Приветственная секция */}
        <section aria-labelledby="welcome-heading">
          <h1 id="welcome-heading" className="text-3xl font-bold mb-1">
            Привет, <span className="break-all">{user.email}</span>!
          </h1>
          <p className="opacity-70 mb-8">Добро пожаловать в Smart Campus</p>
        </section>

        {/* Секция с карточками-ссылками */}
        <section aria-labelledby="navigation-cards-heading">
          <h2 id="navigation-cards-heading" className="sr-only">
            Быстрая навигация по разделам
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Карточка "Задачи" */}
            <Link
              href="/tasks"
              className="card hover:-translate-y-1 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Перейти к задачам"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  📚 Задачи
                </h3>
                <p className="opacity-80 text-sm">
                  Управляйте учебными заданиями
                </p>
              </div>
            </Link>

            {/* Карточка "События" */}
            <Link
              href="/events"
              className="card hover:-translate-y-1 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Перейти к событиям"
            >
              <div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                  🎉 События
                </h3>
                <p className="opacity-80 text-sm">
                  Мероприятия кампуса
                </p>
              </div>
            </Link>

            {/* Карточка "Профиль" */}
            <Link
              href="/profile"
              className="card hover:-translate-y-1 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Перейти в профиль"
            >
              <div>
                <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  👤 Профиль
                </h3>
                <p className="opacity-80 text-sm">
                  Редактируйте свои данные
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Дополнительная секция: статистика или быстрые действия (опционально) */}
        <section aria-labelledby="quick-actions-heading" className="mt-12">
          <h2 id="quick-actions-heading" className="text-xl font-semibold mb-4">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/tasks/new"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Создать новую задачу"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium">Создать задачу</p>
                <p className="text-sm opacity-70">Добавьте новую учебную задачу</p>
              </div>
            </Link>
            
            <Link
              href="/events"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Посмотреть ближайшие события"
            >
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-medium">Ближайшие события</p>
                <p className="text-sm opacity-70">Узнайте о предстоящих мероприятиях</p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}