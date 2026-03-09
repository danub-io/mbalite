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
    // Busca a sessão atual no Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      
      // Se não tiver logado e não estiver na página de login, expulsa pro login
      if (!session && router.pathname !== '/login') {
        router.push('/login')
      }
    })

    // Fica escutando mudanças (ex: o usuário clicou em "Sair" ou a sessão expirou)
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

  // Mostra uma tela preta enquanto checa o banco de dados (evita piscar a tela do conteúdo)
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-500 font-black tracking-widest uppercase">Validando Credenciais...</div>
  }

  // Se não tem sessão e não é a página de login, não renderiza nada (já está sendo redirecionado)
  if (!session && router.pathname !== '/login') {
    return null
  }

  // Se chegou aqui, ou tá na tela de login, ou está logado com sucesso!
  return <Component {...pageProps} />
}
