'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

type Task = {
  id: string
  title: string
  description: string
  category: string
  status: string
  due_date: string
  created_at: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [newTask, setNewTask] = useState({ title: '', description: '', category: 'academic', due_date: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (data) setTasks(data as Task[])
    setLoading(false)
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Сначала войдите!')

    const { error } = await supabase.from('tasks').insert({ ...newTask, user_id: user.id })
    if (error) {
      alert('Ошибка: ' + error.message)
    } else {
      setNewTask({ title: '', description: '', category: 'academic', due_date: '' })
      fetchTasks()
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Удалить задачу?')) return
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category,
      due_date: task.due_date
    })
  }

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    await supabase.from('tasks').update(newTask).eq('id', editingId)
    setEditingId(null)
    setNewTask({ title: '', description: '', category: 'academic', due_date: '' })
    fetchTasks()
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category ? task.category === category : true
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'due_date') return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Мои задачи</h1>

        {/* Форма добавления/редактирования */}
        <form onSubmit={editingId ? updateTask : addTask} className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Редактировать' : 'Новая задача'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Название"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="input"
              required
            />
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({...newTask, category: e.target.value})}
              className="input cursor-pointer"
            >
              <option value="academic">📚 Учебная</option>
              <option value="personal">🏠 Личная</option>
              <option value="urgent">🔥 Срочная</option>
            </select>
            <input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
              className="input"
            />
            <input
              placeholder="Описание"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="input"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="btn-primary">
              {editingId ? 'Сохранить' : 'Добавить'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {setEditingId(null); setNewTask({ title: '', description: '', category: 'academic', due_date: '' })}}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Отмена
              </button>
            )}
          </div>
        </form>

        {/* Поиск и фильтр */}
        <div className="card mb-6 flex flex-col md:flex-row gap-4 !p-4">
          <input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input md:w-48 cursor-pointer">
            <option value="">Все категории</option>
            <option value="academic">📚 Учебная</option>
            <option value="personal">🏠 Личная</option>
            <option value="urgent">🔥 Срочная</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input md:w-48 cursor-pointer">
            <option value="created_at">📅 По дате создания</option>
            <option value="due_date">⏳ По дедлайну</option>
          </select>
        </div>

        {/* Список задач */}
        {loading ? (
          <p className="opacity-70">Загрузка...</p>
        ) : (
          <div className="space-y-3">
            {filteredTasks.length === 0 && (
              <p className="opacity-70">Нет задач</p>
            )}
            {filteredTasks.map(task => (
              <div key={task.id} className="card flex flex-col md:flex-row justify-between md:items-start gap-4 !p-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="opacity-80 text-sm mt-0.5">{task.description}</p>
                  
                  {/* Цветные теги внутри карточки */}
                  <div className="flex flex-wrap gap-2 mt-3 text-xs font-medium">
                    <span className="bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded border border-blue-200/50 dark:border-blue-900/50">
                      {task.category === 'academic' && '📚 Учебная'}
                      {task.category === 'personal' && '🏠 Личная'}
                      {task.category === 'urgent' && '🔥 Срочная'}
                    </span>
                    <span className={`px-2.5 py-1 rounded border ${
                      task.status === 'done' 
                        ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-900/50' 
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/50'
                    }`}>
                      {task.status === 'done' ? '✅ Выполнено' : '⏳ В процессе'}
                    </span>
                    {task.due_date && (
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded border border-gray-200/50 dark:border-gray-700/50">
                        📅 до {new Date(task.due_date).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Кнопки действий */}
                <div className="flex gap-3">
                  <button onClick={() => startEdit(task)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer">
                    Изменить
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-600 dark:text-red-400 hover:underline text-sm cursor-pointer">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
