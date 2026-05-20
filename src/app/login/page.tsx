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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const { error } = await signIn(email, password)
    
    setIsSubmitting(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Введите email, чтобы получить ссылку для восстановления')
      return
    }

    setIsResetting(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/profile`,
    })

    setIsResetting(false)

    if (error) {
      setError(error.message)
    } else {
      // Показываем успешное сообщение вместо alert
      setError('') // очищаем ошибку, если была
      // Используем инлайн-сообщение вместо alert
      const successMessage = document.getElementById('reset-success')
      if (successMessage) {
        successMessage.style.display = 'block'
        setTimeout(() => {
          successMessage.style.display = 'none'
        }, 5000)
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm"
        aria-label="Форма входа"
        aria-busy={isSubmitting}
        noValidate
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>

        {/* Сообщение об успешном сбросе пароля */}
        <div
          id="reset-success"
          role="status"
          aria-live="polite"
          className="success-message hidden"
          style={{ display: 'none' }}
        >
          Инструкции отправлены! Проверьте вашу электронную почту.
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 p-2 rounded border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm text-center"
          >
            {error}
          </div>
        )}

        <div className="space-y-4 mb-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              aria-required="true"
            />
          </div>

          {/* Пароль */}
          <div>
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              aria-required="true"
            />
          </div>
        </div>

        {/* Кнопка "Забыли пароль?" */}
        <div className="text-right mb-6">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={isResetting}
            aria-disabled={isResetting}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? 'Отправка...' : 'Забыли пароль?'}
          </button>
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-2.5 font-medium"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>

        <p className="mt-6 text-center text-sm opacity-80">
          Нет аккаунта?{' '}
          <Link
            href="/register"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Регистрация
          </Link>
        </p>
      </form>
    </main>
  )
}