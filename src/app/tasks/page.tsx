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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (data) setTasks(data as Task[])
    setLoading(false)
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      showMessage('error', 'Введите название задачи')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showMessage('error', 'Сначала войдите в систему!')
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.from('tasks').insert({ ...newTask, user_id: user.id })
    setIsSubmitting(false)

    if (error) {
      showMessage('error', 'Ошибка: ' + error.message)
    } else {
      setNewTask({ title: '', description: '', category: 'academic', due_date: '' })
      showMessage('success', 'Задача добавлена!')
      fetchTasks()
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Удалить задачу?')) return
    await supabase.from('tasks').delete().eq('id', id)
    showMessage('success', 'Задача удалена')
    fetchTasks()
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category,
      due_date: task.due_date || ''
    })
  }

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    setIsSubmitting(true)
    await supabase.from('tasks').update(newTask).eq('id', editingId)
    setIsSubmitting(false)

    setEditingId(null)
    setNewTask({ title: '', description: '', category: 'academic', due_date: '' })
    showMessage('success', 'Задача обновлена')
    fetchTasks()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNewTask({ title: '', description: '', category: 'academic', due_date: '' })
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category ? task.category === category : true
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'due_date') {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Мои задачи</h1>

        {/* Сообщения */}
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

        {/* Форма добавления/редактирования */}
        <form onSubmit={editingId ? updateTask : addTask} className="card mb-6" aria-label={editingId ? 'Форма редактирования задачи' : 'Форма добавления задачи'}>
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Редактировать задачу' : 'Новая задача'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-title" className="form-label">
                Название *
              </label>
              <input
                id="task-title"
                placeholder="Название задачи"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="task-category" className="form-label">
                Категория
              </label>
              <select
                id="task-category"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="input cursor-pointer"
                aria-label="Выберите категорию"
              >
                <option value="academic">📚 Учебная</option>
                <option value="personal">🏠 Личная</option>
                <option value="urgent">🔥 Срочная</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-due-date" className="form-label">
                Дедлайн
              </label>
              <input
                id="task-due-date"
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="task-description" className="form-label">
                Описание
              </label>
              <input
                id="task-description"
                placeholder="Описание задачи"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : (editingId ? 'Сохранить' : 'Добавить')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors cursor-pointer"
                aria-label="Отменить редактирование"
              >
                Отмена
              </button>
            )}
          </div>
        </form>

        {/* Поиск и фильтр */}
        <div className="card mb-6 flex flex-col md:flex-row gap-4 !p-4" aria-label="Фильтры поиска">
          <div className="flex-1">
            <label htmlFor="search-input" className="form-label sr-only">
              Поиск задач
            </label>
            <input
              id="search-input"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              aria-label="Поиск задач по названию"
            />
          </div>
          <div className="md:w-48">
            <label htmlFor="category-filter" className="form-label sr-only">
              Фильтр по категории
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input cursor-pointer"
              aria-label="Фильтр по категории"
            >
              <option value="">Все категории</option>
              <option value="academic">📚 Учебная</option>
              <option value="personal">🏠 Личная</option>
              <option value="urgent">🔥 Срочная</option>
            </select>
          </div>
          <div className="md:w-48">
            <label htmlFor="sort-by" className="form-label sr-only">
              Сортировка
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input cursor-pointer"
              aria-label="Сортировка задач"
            >
              <option value="created_at">📅 По дате создания</option>
              <option value="due_date">⏳ По дедлайну</option>
            </select>
          </div>
        </div>

        {/* Список задач */}
        {loading ? (
          <div aria-live="polite" aria-label="Загрузка задач">
            <p className="opacity-70">Загрузка...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.length === 0 && (
              <p className="opacity-70 text-center py-8">Нет задач</p>
            )}
            {filteredTasks.map(task => (
              <article key={task.id} className="card flex flex-col md:flex-row justify-between md:items-start gap-4 !p-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  {task.description && (
                    <p className="opacity-80 text-sm mt-0.5">{task.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3 text-xs font-medium">
                    <span
                      className="bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded border border-blue-200/50 dark:border-blue-900/50"
                      aria-label={`Категория: ${task.category === 'academic' ? 'Учебная' : task.category === 'personal' ? 'Личная' : 'Срочная'}`}
                    >
                      {task.category === 'academic' && '📚 Учебная'}
                      {task.category === 'personal' && '🏠 Личная'}
                      {task.category === 'urgent' && '🔥 Срочная'}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded border ${
                        task.status === 'done'
                          ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-900/50'
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/50'
                      }`}
                      aria-label={`Статус: ${task.status === 'done' ? 'Выполнено' : 'В процессе'}`}
                    >
                      {task.status === 'done' ? '✅ Выполнено' : '⏳ В процессе'}
                    </span>
                    {task.due_date && (
                      <span
                        className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded border border-gray-200/50 dark:border-gray-700/50"
                        aria-label={`Дедлайн: ${new Date(task.due_date).toLocaleDateString('ru-RU')}`}
                      >
                        📅 до {new Date(task.due_date).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer"
                    aria-label={`Редактировать задачу ${task.title}`}
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 dark:text-red-400 hover:underline text-sm cursor-pointer"
                    aria-label={`Удалить задачу ${task.title}`}
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}