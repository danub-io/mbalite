import { useState, useEffect } from 'react'

export default function QuizTracker({ id, nextStep, nextLink, videoUrl, questions }) {
  const [completed, setCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  
  // NOVOS ESTADOS PARA CONTROLAR O FEEDBACK VISUAL
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('mbalite_progress') || '{}')
    if (progress[id]) setCompleted(true)
  }, [id])

  // Fun🏆o disparada ao clicar em uma opção
  const handleAnswer = (selectedIndex) => {
    if (isAnswered) return; // Impede duplo clique

    setSelectedAnswer(selectedIndex)
    setIsAnswered(true)

    if (selectedIndex === questions[currentQuestionIndex].correct) {
      setScore(prev => prev + 1)
    }
  }

  // Fun🏆o disparada ao clicar no bot?o "Pr?xima Pergunta"
  const handleNextQuestion = () => {
    setIsAnswered(false)
    setSelectedAnswer(null)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowResults(false)
    setIsAnswered(false)
    setSelectedAnswer(null)
  }

  const markAsComplete = () => {
    const progress = JSON.parse(localStorage.getItem('mbalite_progress') || '{}')
    progress[id] = true
    localStorage.setItem('mbalite_progress', JSON.stringify(progress))
    setCompleted(true)
    setTimeout(() => { window.location.href = nextLink }, 500)
  }

  const percentage = Math.round((score / questions.length) * 100)
  const passed = percentage >= 80

  if (completed) {
    return (
      <div className="my-10 flex flex-col items-center border-t border-slate-200 dark:border-slate-800 pt-8 font-sans">
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-xl border border-green-500">
          <span className="text-lg">?</span>
          <span className="text-lg font-black text-green-700 dark:text-green-400 uppercase tracking-tight">
            Missão Cumprida
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="my-12 font-sans w-full max-w-3xl mx-auto">
      {/* V?DEO DA AULA */}
      {videoUrl && (
        <div className="mb-12 aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-800">
          <iframe src={videoUrl} className="w-full h-full" allowFullScreen></iframe>
        </div>
      )}

      {/* QUESTION?RIO */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl">
        {!showResults ? (
          <>
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
              {questions[currentQuestionIndex].question}
            </h3>
            <div className="space-y-3">
              {questions[currentQuestionIndex].options.map((option, index) => {
                const isCorrect = index === questions[currentQuestionIndex].correct;
                const isSelected = index === selectedAnswer;

                // Estilo padr?o (antes de responder)
                let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20";

                // Estilos ap?s o aluno clicar (Feedback Visual)
                if (isAnswered) {
                  if (isCorrect) {
                    buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-bold bg-green-100 border-green-500 text-green-800 dark:bg-green-900/40 dark:border-green-400 dark:text-green-100";
                  } else if (isSelected) {
                    buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-bold bg-red-100 border-red-500 text-red-800 dark:bg-red-900/40 dark:border-red-400 dark:text-red-100";
                  } else {
                    buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium opacity-40 border-slate-100 dark:border-slate-800 text-slate-500 cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={isAnswered}
                    className={buttonClass}
                  >
                    <span className="font-bold mr-3">{['A', 'B', 'C', 'D', 'E'][index]}.</span>
                    {option}
                  </button>
                )
              })}
            </div>

            {/* Bot?o para avan?ar s? aparece depois que o aluno responde */}
            {isAnswered && (
              <div className="mt-8 flex Jáustify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 text-white font-black py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-wide shadow-md"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Pr?xima Pergunta ?" : "Ver Resultado ?"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Resultado do Teste</h3>
            <div className={`text-5xl font-black mb-6 ${passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {percentage}%
            </div>
            {passed ? (
              <>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">
                  Excelente! você? atingiu a nota de corte e provou seu domínio no assunto.
                </p>
                <div className="flex flex-col items-center">
                  <button onClick={markAsComplete} className="inline-block bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black text-lg py-4 px-10 rounded-xl shadow-md hover:scale-105 transition-all uppercase tracking-tight">
                    Concluir Atividade
                  </button>
                  <div className="mt-4 text-lg font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                    Pr?ximo: {nextStep}
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">
                  você? precisa de pelo menos 80% para avan?ar. Revise o material e tente novamente.
                </p>
                <button onClick={resetQuiz} className="inline-block bg-red-600 text-white font-black text-lg py-4 px-10 rounded-xl shadow-md hover:bg-red-700 transition-all uppercase tracking-tight">
                  Refazer Question?rio
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}