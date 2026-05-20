'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const { error } = await signUp(email, password, fullName)
    
    setIsSubmitting(false)

    if (error) {
      setError(error.message)
    } else {
      alert('Регистрация успешна! Теперь войдите.')
      router.push('/login')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm"
        aria-label="Форма регистрации"
        aria-busy={isSubmitting}
        noValidate
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 p-2 rounded border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm text-center"
          >
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {/* ФИО */}
          <div>
            <label htmlFor="full_name" className="form-label">
              ФИО
            </label>
            <input
              id="full_name"
              type="text"
              placeholder="Иванов Иван Иванович"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
              required
              aria-required="true"
            />
          </div>

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
              Пароль (мин. 6 символов)
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              minLength={6}
              aria-required="true"
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-xs opacity-70 mt-1">
              Минимум 6 символов
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-2.5 font-medium"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="mt-6 text-center text-sm opacity-80">
          Уже есть аккаунт?{' '}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Вход
          </Link>
        </p>
      </form>
    </main>
  )
}