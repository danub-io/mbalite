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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      
      if (!session && router.pathname !== '/login') {
        router.push('/login')
      } else if (session && router.pathname === '/login') {
        router.push('/')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session && router.pathname !== '/login') {
        router.push('/login')
      } else if (session && router.pathname === '/login') {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router.pathname])

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center Justify-center text-indigo-500 font-black tracking-widest uppercase">Validando Credenciais...</div>
  }

  if (!session && router.pathname !== '/login') {
    return null
  }

  return <Component {...pageProps} />
}