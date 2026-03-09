import { useState, useEffect } from 'react'

export default function LessonTracker({ id, nextStep, nextLink }) {
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('mbalite_progress') || '{}')
    if (progress[id]) setCompleted(true)
  }, [id])

  const markAsComplete = () => {
    const progress = JSON.parse(localStorage.getItem('mbalite_progress') || '{}')
    progress[id] = true
    localStorage.setItem('mbalite_progress', JSON.stringify(progress))
    setCompleted(true)
    setTimeout(() => { window.location.href = nextLink }, 500)
  }

  return (
    <div className="my-10 flex flex-col items-center border-t border-slate-200 dark:border-slate-800 pt-8 font-sans">
      {completed ? (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-xl border border-green-500">
          <span className="text-lg">✅</span>
          <span className="text-lg font-black text-green-700 dark:text-green-400 uppercase tracking-tight">
            Missão Cumprida
          </span>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center">
          <button 
            onClick={markAsComplete}
            className="inline-block bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-lg py-4 px-10 rounded-xl shadow-md hover:scale-105 transition-all uppercase tracking-tight"
          >
            Concluir Atividade
          </button>
          <div className="mt-4 text-lg font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">
            Próximo: {nextStep}
          </div>
        </div>
      )}
    </div>
  )
}