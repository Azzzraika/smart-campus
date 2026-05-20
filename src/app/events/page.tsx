'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

type Event = {
  id: string
  title: string
  description: string
  category: string
  event_date: string
  location: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [myEvents, setMyEvents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [registeringId, setRegisteringId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
    if (eventsData) setEvents(eventsData as Event[])

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: regData } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)
      if (regData) setMyEvents(regData.map(r => r.event_id))
    }
    setLoading(false)
  }

  const registerEvent = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage({ type: 'error', text: 'Войдите, чтобы записаться на мероприятие!' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setRegisteringId(eventId)
    const { error } = await supabase
      .from('event_registrations')
      .insert({ event_id: eventId, user_id: user.id })

    setRegisteringId(null)

    if (!error) {
      setMyEvents([...myEvents, eventId])
      setMessage({ type: 'success', text: 'Вы успешно записаны на мероприятие!' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'error', text: 'Ошибка при записи. Попробуйте позже.' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Мероприятия кампуса</h1>

        {/* Сообщение об ошибке/успехе */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-4 p-3 rounded border ${
              message.type === 'success'
                ? 'success-message'
                : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50'
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div aria-live="polite" aria-label="Загрузка мероприятий">
            <p className="opacity-70">Загрузка...</p>
          </div>
        ) : events.length === 0 ? (
          <p className="opacity-70">Мероприятий пока нет</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <article key={event.id} className="card flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className="opacity-80 mb-3 text-sm">{event.description}</p>
                  <div className="text-sm opacity-70 mb-4 space-y-1">
                    <p>📍 {event.location}</p>
                    <p>📅 {new Date(event.event_date).toLocaleDateString('ru-RU')}</p>
                    <p>🏷️ {event.category}</p>
                  </div>
                </div>
                <div>
                  {myEvents.includes(event.id) ? (
                    <span
                      className="inline-block bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 px-3 py-1.5 rounded border border-green-200/50 dark:border-green-900/50 text-sm font-medium w-full text-center md:w-auto"
                      aria-label="Вы записаны на это мероприятие"
                    >
                      ✅ Вы записаны
                    </span>
                  ) : (
                    <button
                      onClick={() => registerEvent(event.id)}
                      disabled={registeringId === event.id}
                      aria-disabled={registeringId === event.id}
                      className="btn-primary w-full md:w-auto"
                    >
                      {registeringId === event.id ? 'Запись...' : 'Записаться'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}