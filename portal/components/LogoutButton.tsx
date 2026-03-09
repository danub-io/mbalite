import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/mbalite/'
  }

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 font-bold px-4 py-1.5 rounded-xl transition-colors text-sm ml-2 border border-red-500/20"
    >
      Sair
    </button>
  )
}
