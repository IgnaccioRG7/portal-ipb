import { Tema } from "@/pages/Student/topics";
import { useEffect, useMemo, useRef } from "react";
import Progress from "./progress";
import { useQuizStore } from "@/store/quiz";
import { prepareQuestions } from "@/lib/quiz-utils";
import { BookOpen } from "lucide-react";

export interface ContenidoJson {
  reading?: string,
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'select' | 'input';
  text: string;
  options: string[];
  correctAnswer: number;
}

interface DirectTopicProps {
  tema: Tema;
  cursoId: number;
  moduloId: number;
  materiaId: number;
}

export function Quiz({ tema, cursoId, moduloId, materiaId }: DirectTopicProps) {
  const {
    shuffledQuestions,
    setShuffledQuestions,
    currentQuestion,
    setCurrentQuestion,
    answers,
    answerQuestion,
    enviarExamen,
    isSubmitting,
    reset,
    cantidadPreguntas
  } = useQuizStore()

  console.log(tema);

  // Para randomizar las preguntas y/o respuestas
  const questions = useMemo(() => {
    // Si ya hay preguntas shuffleadas, usarlas
    if (shuffledQuestions && shuffledQuestions.length > 0) {
      return shuffledQuestions
    }

    // Si no, calcular por primera vez
    const rawContent = JSON.parse(tema.contenido_json)
    const rawQuestions = rawContent.questions || []

    const config = {
      randomizar_preguntas: tema.randomizar_preguntas || false,
      randomizar_respuestas: tema.randomizar_respuestas || false
    }

    let prepared = prepareQuestions(rawQuestions, config)

    if (tema.tipo === 'configurable' && cantidadPreguntas) {
      prepared = prepared.slice(0, cantidadPreguntas)
    }

    return prepared;
  }, [tema.id, shuffledQuestions, cantidadPreguntas])

  useEffect(() => {
    if (!shuffledQuestions || shuffledQuestions.length === 0) {
      setShuffledQuestions(questions as Question[])
    }
  }, [questions])

  const contenido: ContenidoJson = useMemo<ContenidoJson>(() => {
    return JSON.parse(tema.contenido_json)
  }, [tema.contenido_json])

  // Guardar tiempo de inicio en ref local (no se pierde)
  const tiempoInicioRef = useRef<number>(Date.now())
  const temaIdRef = useRef(tema.id)

  useEffect(() => {
    // Si cambió el tema, resetear
    if (temaIdRef.current !== tema.id) {
      console.log('🔄 Nuevo tema, reseteando')
      reset()
      temaIdRef.current = tema.id
      tiempoInicioRef.current = Date.now()
    }
  }, [tema.id, reset])

  const total = questions.length;
  const question = total >= currentQuestion ? questions[currentQuestion] : questions[0]
  // const selectedOption = answers[question?.id] ?? null
  const selectedAnswer = answers[question?.id] ?? null
  const selectedIndex = selectedAnswer?.indiceSeleccionado ?? null

  const next = () => {
    if (currentQuestion < total - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      enviarResultados()
    }
  };

  const enviarResultados = async () => {
    console.log('📤 Enviando con tiempo:', tiempoInicioRef.current)

    await enviarExamen({
      cursoId,
      moduloId,
      materiaId,
      temaId: tema.id,
      contenido,
      tiempoInicio: tiempoInicioRef.current
    })
  }

  const prev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const selectOption = (n: number) => {
    const valorRespuesta = question.options[n];
    answerQuestion(question.id, valorRespuesta, n);
  }

  const tipo = tema?.tipo || 'opcional'
  const reading = contenido.reading || ''

  return (
    <section className="space-y-6">
      <Progress total={total} current={currentQuestion} />

      {
        tipo === 'lectura' && (
          <div className="card border border-dashed border-cyan-700 rounded-md px-2 py-4 md:px-4 bg-cyan-800/20">
            <h3 className="title flex flex-row gap-2 items-center text-base md:text-lg font-bold pb-2 md:pb-3">
              <BookOpen />
              {tema.nombre}
            </h3>
            <p className="py-4 h-auto max-h-64 overflow-x-hidden overflow-y-auto text-pretty text-sm md:text-base">{reading}</p>
          </div>
        )
      }

      <div className="space-y-4">
        <header className="flex flex-col gap-2">
          <span className="tag px-4 py-1 flex items-center leading-normal bg-gray-200 shadow-xs w-fit rounded-full text-xs font-black uppercase mx-auto dark:bg-gray-600">
            {`Pregunta ${currentQuestion + 1}`}
          </span>
          <h3 className="text-base md:text-lg font-semibold border border-gray-200 px-2 py-4 rounded-md text-center shadow-xs">
            {question?.text}
          </h3>
        </header>

        <ul className="space-y-3">
          {question?.options.map((opt, i) => (
            <li
              key={i}
              className={`p-3 rounded-lg border-4 flex items-center gap-2 cursor-pointer ${selectedIndex === i  // <-- comparar por ÍNDICE, no por texto
                ? 'border-[#fde047] bg-[#fde047]/20 dark:bg-yellow-700 dark:border-[#d4b61c]'
                : 'dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              onClick={() => selectOption(i)}
            >
              <span className={`font-black size-8 min-w-8 grid place-content-center rounded-full leading-0 
      ${selectedIndex === i  // <-- también aquí
                  ? 'bg-[#fddd3c] text-gray-800'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-300'
                }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <p className="text-sm md:text-base">{opt}</p>
            </li>
          ))}
          {/* {question?.options.map((opt, i) => (
            <li
              key={i}
              className={`p-3 rounded-lg border-4 flex items-center gap-2 cursor-pointer ${selectedOption === opt
                ? 'border-[#fde047] bg-[#fde047]/20 dark:bg-yellow-700 dark:border-[#d4b61c]'
                : 'dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              onClick={() => selectOption(i)}
            >
              <span className={`font-black size-8 min-w-8 grid place-content-center rounded-full leading-0 
          ${selectedOption === opt
                  ? 'bg-[#fddd3c] text-gray-800'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-300'
                }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <p className="text-sm md:text-base">{opt}</p>
            </li>
          ))} */}
        </ul>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={prev}
          disabled={currentQuestion === 0}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Anterior
        </button>

        <span className="text-sm text-gray-500">
          {currentQuestion + 1} / {total}
        </span>

        <button
          onClick={next}
          // disabled={selectedOption === null || isSubmitting}
          disabled={selectedAnswer === null || isSubmitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {currentQuestion === total - 1 ? 'Enviar' : 'Siguiente'}
        </button>
      </div>
    </section>
  );
}