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
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await signUp(email, password, fullName)
    if (error) {
      setError(error.message)
    } else {
      alert('Регистрация успешна! Теперь войдите.')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Использование утилиты card вместо жесткого bg-white */}
      <form onSubmit={handleSubmit} className="card w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>
        
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4 text-sm text-center bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200/50 dark:border-red-900/50">
            {error}
          </p>
        )}
        
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input"
            required
          />
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
            placeholder="Пароль (мин. 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>

        {/* Кнопка использует класс btn-primary для соответствия дизайну входа */}
        <button type="submit" className="btn-primary w-full py-2.5 font-medium">
          Зарегистрироваться
        </button>
        
        <p className="mt-6 text-center text-sm opacity-80">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Вход
          </Link>
        </p>
      </form>
    </div>
  )
}
