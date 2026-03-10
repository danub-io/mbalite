import { useEffect, useState } from 'react'

export default function ProgressGuard({ requiredId, fallbackLink }) {
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (!requiredId) return;
    const progress = JSON.parse(localStorage.getItem('mbalite_progress') || '{}')
    if (!progress[requiredId]) {
      setLocked(true)
      setTimeout(() => { window.location.href = fallbackLink }, 3500)
    }
  }, [requiredId, fallbackLink])

  if (locked) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <div className="text-7xl mb-6">🏆</div>
        <h1 className="text-4xl font-black mb-4 text-center">Acesso Restrito</h1>
        <p className="text-xl text-slate-400 text-center max-w-md leading-relaxed">
          você? precisa concluir a lição anterior para desbloquear esta etapa da trilha.
        </p>
        <p className="mt-10 text-sm font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
          Redirecionando de volta...
        </p>
      </div>
    )
  }
  return null
}