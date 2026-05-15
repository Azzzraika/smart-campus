'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-blue-700 dark:bg-gray-800 text-white p-4 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide">Smart Campus</Link>
        
        {/* Desktop меню */}
        <div className="hidden md:flex gap-6 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="nav-link">Главная</Link>
              <Link href="/tasks" className="nav-link">Задачи</Link>
              <Link href="/events" className="nav-link">События</Link>
              <Link href="/profile" className="nav-link">Профиль</Link>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-blue-600 hover:bg-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded transition-colors text-lg cursor-pointer"
                title="Сменить тему"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className="btn-danger">
                Выйти
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-blue-600 hover:bg-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded transition-colors text-lg cursor-pointer mr-2"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <Link href="/login" className="nav-link">Вход</Link>
              <Link href="/register" className="nav-link">Регистрация</Link>
            </>
          )}
        </div>

        {/* Мобильная кнопка бургера */}
        <button 
          className="md:hidden text-2xl p-1 focus:outline-none cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 border-t border-blue-600 dark:border-gray-700 pt-4">
          {user ? (
            <>
              <Link href="/dashboard" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Главная</Link>
              <Link href="/tasks" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Задачи</Link>
              <Link href="/events" className="nav-link py-2" onClick={() => setMobileOpen(false)}>События</Link>
              <Link href="/profile" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Профиль</Link>
              <button 
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileOpen(false); }}
                className="text-left py-2 hover:text-blue-200 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема'}
              </button>
              <button 
                onClick={() => { handleLogout(); setMobileOpen(false); }} 
                className="btn-danger text-center w-full mt-2"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Вход</Link>
              <Link href="/register" className="nav-link py-2" onClick={() => setMobileOpen(false)}>Регистрация</Link>
              <button 
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileOpen(false); }}
                className="text-left py-2 hover:text-blue-200 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема'}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
