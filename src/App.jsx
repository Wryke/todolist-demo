import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false },
    { id: 2, text: 'Go for a walk', done: true },
    { id: 3, text: 'Write some code', done: false },
  ])
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')

  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingDueDate, setEditingDueDate] = useState('')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([
      ...todos,
      { id: Date.now(), text, done: false, dueDate: dueDate || undefined },
    ])
    setInput('')
    setDueDate('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
    setEditingDueDate(todo.dueDate || '')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText('')
    setEditingDueDate('')
  }

  const saveEdit = (id) => {
    const text = editingText.trim()

    if (!text) {
      deleteTodo(id)
    } else {
      setTodos(
        todos.map((t) =>
          t.id === id
            ? { ...t, text, dueDate: editingDueDate || undefined }
            : t,
        ),
      )
    }

    setEditingId(null)
    setEditingText('')
    setEditingDueDate('')
  }

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  const remaining = todos.filter((t) => !t.done).length

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="New todo description"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="New todo due date"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={tabClass('all')}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={tabClass('active')}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={tabClass('completed')}>
            Completed
          </button>
        </div>

        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col gap-2 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              {editingId === todo.id ? (
                <div onBlur={() => saveEdit(todo.id)}>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit(todo.id)
                      } else if (e.key === 'Escape') {
                        cancelEditing()
                      }
                    }}
                    autoFocus
                    className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Edit todo text"
                  />
                  <input
                    type="date"
                    value={editingDueDate}
                    onChange={(e) => setEditingDueDate(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit(todo.id)
                      } else if (e.key === 'Escape') {
                        cancelEditing()
                      }
                    }}
                    className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Edit todo due date"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 w-full">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    onDoubleClick={() => startEditing(todo)}
                    className={`flex-1 text-left ${
                      todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    <span>{todo.text}</span>
                    {todo.dueDate ? (
                      <time className="ml-2 text-xs text-slate-500">
                        due {new Date(todo.dueDate).toLocaleDateString()}
                      </time>
                    ) : null}
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                    aria-label="Delete todo"
                  >
                    ×
                  </button>
                </div>
              )}
            </li>
          ))}

          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 text-sm text-slate-500">
          {remaining} {remaining === 1 ? 'item' : 'items'} left
        </div>
      </div>
    </div>
  )
}