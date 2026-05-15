import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-blue-800 mb-4">Smart Campus</h1>
      <p className="text-xl text-gray-700 mb-8">Портал для студентов колледжа</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Войти
        </Link>
        <Link href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50">
          Регистрация
        </Link>
      </div>
    </div>
  )
}