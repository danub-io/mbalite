import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Conta criada com sucesso! você� Já� pode entrar.')
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/') // Redireciona para o index do portal
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center Jáustify-center bg-slate-950 text-white font-sans p-4">
      <div className="bg-slate-900 p-8 md:p-12 rounded-[2rem] border border-slate-800 shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-9xl opacity-5">🏆</div>
        
        <div className="text-3xl font-black tracking-tighter text-center mb-8 relative z-10">
          MBA<span className="text-indigo-500">Lite.</span>
        </div>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">E-mail Corporativo</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="voce@email.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Senha de Acesso</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="******" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-xl transition-all mt-2 uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
          >
            {loading ? 'Processando...' : (isSignUp ? 'Registrar-se' : 'Entrar no Portal')}
          </button>
        </form>
        
        <div className="mt-8 text-center relative z-10">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4"
          >
            {isSignUp ? 'J� tem uma conta? Fazer login' : 'Primeiro acesso? Crie sua conta gr�tis'}
          </button>
        </div>
      </div>
    </div>
  )
}
