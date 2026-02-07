import ContentLayout from "@/layouts/content-layout";
import { Link } from "@inertiajs/react";
import { ArrowLeftToLine, CircleCheck, CircleX, Home, RotateCcw, Trophy } from "lucide-react";
import { ContenidoJson } from "./quiz";
import estudiante from "@/routes/estudiante";
import { BreadcrumbItem } from "@/types";
import { Curso } from "@/pages/dashboard";
import { useQuizStore } from "@/store/quiz";

export default function ResultView({
  breadcrumbs,
  contenido,
  curso,
  title
}: {
  breadcrumbs: BreadcrumbItem[]
  contenido: ContenidoJson
  curso: Curso
  title: string
}) {

  const { answers, reset } = useQuizStore()

  // Para los resultados  
  const correctAnswers = contenido.questions.filter(question => question.correctAnswer === answers[question.id]).length
  const percentage = Math.floor(((correctAnswers) / contenido.questions.length) * 100)

  const getBackgroundColor = () => {
    if (percentage >= 80) return "bg-emerald-600/10 border-emerald-600";
    if (percentage >= 60) return "bg-amber-600/10 border-amber-600";
    if (percentage >= 50) return "bg-yellow-600/10 border-yellow-600";
    if (percentage >= 30) return "bg-rose-600/10 border-rose-600";
    return "bg-red-600/20";
  }

  const getTextColor = () => {
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 60) return "text-amber-600";
    if (percentage >= 50) return "text-yellow-500";
    if (percentage >= 30) return "text-rose-600";
    return "text-red-600";
  }

  return (<ContentLayout breadcrumbs={breadcrumbs}>
    <section className="quiz flex flex-col gap-4">
      <header className="flex flex-row items-center gap-2 relative">
        <Link
          className="absolute left-0 flex flex-row gap-2"
          href={estudiante.subjects({
            course: curso.id,
          })}
        >
          <ArrowLeftToLine className="size-6" />
          <span className="hidden md:block">Salir</span>
        </Link>
        <h2 className="text-2xl font-bold w-full text-center">Resultados de la prueba de: {title}</h2>
      </header>
      <section className="results grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="qualification">
          <div className={`border-2 rounded-md grid place-content-center min-h-50 ${getBackgroundColor()}`}>
            <Trophy className={`size-10 mx-auto ${getTextColor()}`} />
            <span className={`result mx-auto text-4xl font-black ${getTextColor()}`}>
              {percentage} %
            </span>
          </div>
          <div className="buttons grid grid-cols-2 gap-2 w-full py-2">
            <button className="grow p-2 border border-gray-200 rounded-md shadow-xs font-semibold flex justify-center gap-2 items-center hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              onClick={reset}
            >
              <RotateCcw /> Reintentar
            </button>
            <Link 
              href={estudiante.dashboard().url}
              className="grow p-2 border border-gray-800 bg-gray-800 text-white rounded-md shadow-xs font-semibold flex justify-center gap-2 items-center hover:bg-gray-900 transition-colors duration-300 cursor-pointer">
              <Home /> Inicio
            </Link>
          </div>
        </div>
        <div className="review col-span-1 md:col-span-2">
          <h3 className="text-xl font-medium">Revisa tus respuestas</h3>
          <ul className="flex flex-col gap-2">
            {
              contenido?.questions?.map((question, index) => {
                const isCorrect = question.correctAnswer === answers[question.id]
                return (
                  <li className={`border-2 rounded-md p-2 flex gap-2 items-start ${isCorrect ? 'bg-green-200/30 border-green-300' : 'bg-red-200/30 border-red-300'}`}>
                    <div className={`icon ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? <CircleCheck /> : <CircleX />}
                    </div>
                    <div className="response flex flex-col">
                      <span className="question text-gray-600 text-sm dark:text-gray-300">Pregunta {index + 1}</span>
                      <p className="font-semibold">{question.text}</p>
                      {!isCorrect && (<span className="incorrect text-sm text-gray-600 dark:text-gray-300">Tu respuesta: <span className="font-bold text-base text-red-800 dark:text-red-200">{question.options[answers[question.id]]}</span></span>)}
                      <span className="correct text-sm text-gray-600 dark:text-gray-300">Correcta: <span className="font-bold text-base text-green-800 dark:text-green-100">{question.options[question.correctAnswer]}</span></span>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </section>
    </section>
  </ContentLayout>)
}