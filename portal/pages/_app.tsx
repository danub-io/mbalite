import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import '../globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Busca a sess?o atual no Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      
      // Se n?o tiver logado e n?o estiver na p?gina de login, expulsa pro login
      if (!session && router.pathname !== '/login') {
        router.push('/login')
      }
    })

    // Fica escutando mudan?as (ex: o usu?rio clicou em "Sair" ou a sess?o expirou)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session && router.pathname !== '/login') {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Mostra uma tela preta enquanto checa o banco de dados (evita piscar a tela do conte?do)
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-500 font-black tracking-widest uppercase">Validando Credenciais...</div>
  }

  // Se n?o tem sess?o e n?o ? a p?gina de login, n?o renderiza nada (j? est? sendo redirecionado)
  if (!session && router.pathname !== '/login') {
    return null
  }

  // Se chegou aqui, ou t? na tela de login, ou est? logado com sucesso!
  return <Component {...pageProps} />
}
