'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  // Функция для отправки письма восстановления
  const handleResetPassword = async () => {
    if (!email) {
      alert('Введите email в поле выше, чтобы получить ссылку!')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile`, // Перенаправим пользователя в профиль для ввода нового пароля
    })
    if (error) {
      alert('Ошибка: ' + error.message)
    } else {
      alert('Инструкции отправлены! Проверьте вашу электронную почту.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>
        
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4 text-sm text-center bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200/50 dark:border-red-900/50">
            {error}
          </p>
        )}
        
        <div className="space-y-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>

        {/* Кнопка "Забыли пароль" адаптированная под Tailwind v4 */}
        <div className="text-right mb-6">
          <button 
            type="button"
            onClick={handleResetPassword}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
          >
            Забыли пароль?
          </button>
        </div>

        <button type="submit" className="btn-primary w-full py-2.5 font-medium">
          Войти
        </button>
        
        <p className="mt-6 text-center text-sm opacity-80">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Регистрация
          </Link>
        </p>
      </form>
    </div>
  )
}
