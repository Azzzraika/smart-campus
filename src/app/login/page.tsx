'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Использование утилиты card вместо жесткого bg-white */}
      <form onSubmit={handleSubmit} className="card w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>
        
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4 text-sm text-center bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200/50 dark:border-red-900/50">
            {error}
          </p>
        )}
        
        <div className="space-y-4 mb-6">
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
