import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [progress, setProgress] = useState({})
  const [mounted, setMounted] = useState(false)

  // O useEffect garante que a leitura dos dados ocorra apenas no navegador do cliente (evita erros de hidrata��o)
  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('mbalite_progress') || '{}')
    setProgress(storedProgress)
    setMounted(true)
  }, [])

  if (!mounted) return null 

  // Configura��o das metas (45 li��es no total)
  const totalQualidade = 15;
  const totalPessoas = 15;
  const totalProjetos = 15;
  const totalGeral = totalQualidade + totalPessoas + totalProjetos;

  // Fun��o que varre a mem�ria e conta quantas li��es o aluno concluiu em cada trilha
  const calcTrilha = (prefix, total) => {
    let count = 0;
    for (let i = 1; i <= total; i++) {
      const id = `${prefix}-${String(i).padStart(2, '0')}`;
      if (progress[id]) count++;
    }
    return count;
  }

  const compQualidade = calcTrilha('qualidade', totalQualidade);
  const compPessoas = calcTrilha('pessoas', totalPessoas);
  const compProjetos = calcTrilha('projetos', totalProjetos);
  const compGeral = compQualidade + compPessoas + compProjetos;

  // C�lculo das porcentagens de conclus�o
  const percQualidade = Math.round((compQualidade / totalQualidade) * 100);
  const percPessoas = Math.round((compPessoas / totalPessoas) * 100);
  const percProjetos = Math.round((compProjetos / totalProjetos) * 100);
  const percGeral = Math.round((compGeral / totalGeral) * 100);

  // Subcomponente visual da barra
  const ProgressBar = ({ percent, colorClass }) => (
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 mt-4 overflow-hidden shadow-inner">
      <div className={`${colorClass} h-4 rounded-full transition-all duration-1000 ease-out relative`} style={{ width: `${percent}%` }}>
        {/* Efeito visual de brilho na barra */}
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20"></div>
      </div>
    </div>
  )

  return (
    <div className="my-10 font-sans">
      
      {/* 1. CARD PRINCIPAL: PROGRESSO GLOBAL */}
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2rem] shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between border-4 border-slate-800 relative overflow-hidden">
        {/* Detalhe visual de fundo */}
        <div className="absolute -right-10 -top-10 text-9xl opacity-5">??</div>
        
        <div className="mb-8 md:mb-0 text-center md:text-left z-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Seu MBA Lite</h2>
          <p className="text-slate-400 font-medium text-lg md:text-xl uppercase tracking-widest">
            Vis�o Geral Estrat�gica
          </p>
        </div>
        
        <div className="flex flex-col items-center z-10 bg-black/30 p-6 rounded-3xl border border-white/10">
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 leading-none">
            {percGeral}%
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">
            {compGeral} de {totalGeral} Miss�es Conclu�das
          </div>
        </div>
      </div>

      {/* 2. CARDS DAS TRILHAS ESPEC�FICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Trilha Qualidade */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl">??</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Qualidade</h3>
          </div>
          <div className="flex justify-between items-end mb-2">
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">{compQualidade} / {totalQualidade} Aulas</p>
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{percQualidade}%</span>
          </div>
          <ProgressBar percent={percQualidade} colorClass="bg-indigo-600 dark:bg-indigo-500" />
        </div>

        {/* Trilha Pessoas */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl bg-purple-100 dark:bg-purple-900/30 p-3 rounded-2xl">??</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Pessoas</h3>
          </div>
          <div className="flex justify-between items-end mb-2">
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">{compPessoas} / {totalPessoas} Aulas</p>
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400">{percPessoas}%</span>
          </div>
          <ProgressBar percent={percPessoas} colorClass="bg-purple-600 dark:bg-purple-500" />
        </div>

        {/* Trilha Projetos */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl bg-orange-100 dark:bg-orange-900/30 p-3 rounded-2xl">??</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Projetos</h3>
          </div>
          <div className="flex justify-between items-end mb-2">
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">{compProjetos} / {totalProjetos} Aulas</p>
            <span className="text-3xl font-black text-orange-600 dark:text-orange-400">{percProjetos}%</span>
          </div>
          <ProgressBar percent={percProjetos} colorClass="bg-orange-600 dark:bg-orange-500" />
        </div>

      </div>
    </div>
  )
}