import { Tema } from "@/pages/Student/topics";
import { useEffect, useMemo, useRef } from "react";
import Progress from "./progress";
import { useQuizStore } from "@/store/quiz";
import { prepareQuestions } from "@/lib/quiz-utils";

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
    currentQuestion,
    setCurrentQuestion,
    answers,
    answerQuestion,
    enviarExamen,
    isSubmitting,
    reset
  } = useQuizStore()

  // Para randomizar las preguntas y/o respuestas
  const { questions, config } = useMemo(() => {
    const rawContent = JSON.parse(tema.contenido_json);
    const rawQuestions = rawContent.questions || [];

    const config = {
      randomizar_preguntas: tema.randomizar_preguntas || false,
      randomizar_respuestas: tema.randomizar_respuestas || false
    };

    const preparedQuestions = prepareQuestions(rawQuestions, config);

    return {
      questions: preparedQuestions,
      config,
      rawContent
    };
  }, [tema.contenido_json, tema.randomizar_preguntas, tema.randomizar_respuestas]);

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
  const selectedOption = answers[question?.id] ?? null

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

  // const selectOption = (n: number) => {
  //   answerQuestion(question.id, n)
  // }
  const selectOption = (n: number) => {
    const valorRespuesta = question.options[n];
    answerQuestion(question.id, valorRespuesta);
  }

  return (
    <section className="space-y-6">
      <Progress total={total} current={currentQuestion} />

      <div className="space-y-4">
        <header className="flex flex-col gap-2">
          <span className="tag px-4 py-1 flex items-center leading-normal bg-gray-200 shadow-xs w-fit rounded-full text-xs font-black uppercase mx-auto dark:bg-gray-600">
            {`Pregunta ${currentQuestion + 1}`}
          </span>
          <h3 className="text-lg font-semibold border border-gray-200 px-2 py-4 rounded-md text-center shadow-xs">
            {question?.text}
          </h3>
        </header>

        <ul className="space-y-3">
          {question?.options.map((opt, i) => (
            <li
              key={i}
              className={`p-3 rounded-lg border-4 flex items-center gap-2 cursor-pointer ${
                selectedOption === opt
                  ? 'border-[#fde047] bg-[#fde047]/20 dark:bg-yellow-700 dark:border-[#d4b61c]'
                  : 'dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 border-gray-200'
                }`}
              onClick={() => selectOption(i)}
            >
              <span className={`font-black size-8 grid place-content-center rounded-full leading-0 
          ${
                selectedOption === opt
                  ? 'bg-[#fddd3c] text-gray-800'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-300'
                }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <p>{opt}</p>
            </li>
          ))}
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
          disabled={selectedOption === null || isSubmitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {currentQuestion === total - 1 ? 'Enviar' : 'Siguiente'}
        </button>
      </div>
    </section>
  );
}