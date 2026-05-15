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

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data: eventsData } = await supabase.from('events').select('*').order('event_date', { ascending: true })
    if (eventsData) setEvents(eventsData as Event[])
    
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: regData } = await supabase.from('event_registrations').select('event_id').eq('user_id', user.id)
      if (regData) setMyEvents(regData.map(r => r.event_id))
    }
    setLoading(false)
  }

  const registerEvent = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Войдите сначала!')
    
    const { error } = await supabase.from('event_registrations').insert({ event_id: eventId, user_id: user.id })
    if (!error) {
      setMyEvents([...myEvents, eventId])
      alert('Вы записаны!')
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Мероприятия кампуса</h1>
        {loading ? (
          <p className="opacity-70">Загрузка...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <div key={event.id} className="card flex flex-col justify-between">
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
                    <span className="inline-block bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 px-3 py-1.5 rounded border border-green-200/50 dark:border-green-900/50 text-sm font-medium w-full text-center md:w-auto">
                      ✅ Вы записаны
                    </span>
                  ) : (
                    <button 
                      onClick={() => registerEvent(event.id)}
                      className="btn-primary w-full md:w-auto"
                    >
                      Записаться
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
