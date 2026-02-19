import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { router } from '@inertiajs/react'
import { ContenidoJson, Question } from '@/components/student/quiz'
import estudiante from '@/routes/estudiante'
import { useEffect, useState } from 'react'

export type QuizMode = 'tema' | 'mix'

interface QuizState {
  isSubmitting: boolean
  startedQuiz: boolean
  currentQuestion: number
  subjectId: number | null
  isCompleteQuiz: boolean
  tiempoInicio: number | null
  tiempoFin: number | null
  examenEnviado: boolean
  cantidadPreguntas: number | null
  shuffledQuestions: Question[] | null
  answers: Record<string, { valor: string | number; indiceSeleccionado: number }>

  setCantidadPreguntas: (n: number | null) => void
  answerQuestion: (id: string, answer: string | number, index: number) => void
  setCurrentQuestion: (n: number) => void
  setSubjectId: (n: number) => void
  setShuffledQuestions: (questions: Question[]) => void
  reset: () => void
  completeQuiz: (val: boolean) => void
  startQuiz: (val: boolean) => void
  iniciarTiempo: () => void
  enviarExamen: (params: {
    cursoId: number
    moduloId: number
    materiaId: number
    temaId: number
    contenido: ContenidoJson
    tiempoInicio: number
  }) => Promise<void>
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      startedQuiz: false,
      currentQuestion: 0,
      answers: {},
      subjectId: null,
      isCompleteQuiz: false,
      tiempoInicio: null,
      tiempoFin: null,
      examenEnviado: false,
      isSubmitting: false,
      shuffledQuestions: null,
      cantidadPreguntas: null,      

      setCantidadPreguntas: (n) => set({ cantidadPreguntas: n }),
      setShuffledQuestions: (questions) => set({ shuffledQuestions: questions }),
      setSubjectId: (n) => set({ subjectId: n }),
      setCurrentQuestion: (n) => set({ currentQuestion: n }),

      answerQuestion: (id, answer, index) => {
        const answers = get().answers
        set({
          answers: {
            ...answers,
            [id]: { valor: answer, indiceSeleccionado: index }
          }
        })
      },

      iniciarTiempo: () => {
        const currentTiempoInicio = get().tiempoInicio
        if (currentTiempoInicio === null) {
          const nuevoTiempo = Date.now()
          set({ tiempoInicio: nuevoTiempo })
        }
      },

      reset: () => {
        set({
          currentQuestion: 0,
          answers: {},
          isCompleteQuiz: false,
          tiempoInicio: null,
          tiempoFin: null,
          examenEnviado: false,
          isSubmitting: false,
          shuffledQuestions: null,
          cantidadPreguntas: null,
          subjectId: null,
        })
      },

      completeQuiz: (val) => set({ isCompleteQuiz: val, tiempoFin: Date.now() }),
      startQuiz: (val) => set({ startedQuiz: val }),

      enviarExamen: async ({ cursoId, moduloId, materiaId, temaId, contenido, tiempoInicio }) => {
        const state = get()
        if (state.isSubmitting) return

        const tiempoFin = Date.now()
        let tiempoUtilizado = Math.floor((tiempoFin - tiempoInicio) / 1000)
        if (tiempoUtilizado < 1) tiempoUtilizado = 1

        set({ isSubmitting: true, isCompleteQuiz: true, tiempoFin })

        const answers = state.answers
        const respuestas = Object.keys(answers).reduce((acc, questionId) => {
          acc[questionId] = { respuesta: answers[questionId].valor }
          return acc
        }, {} as Record<string, any>)

        router.post(
          estudiante.examen.guardar({
            curso: cursoId,
            modulo: moduloId,
            materia: materiaId,
            tema: temaId
          }),
          {
            respuestas,
            tiempo_utilizado: tiempoUtilizado,
          },
          {
            preserveScroll: true,
            onSuccess: () => set({ examenEnviado: true, isSubmitting: false }),
            onError: (errors) => {
              set({ isSubmitting: false })
              console.error('❌ Error al guardar examen:', errors)
            }
          }
        )
      }
    }),
    {
      name: 'quiz-progress',
      partialize: (state) => ({
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        subjectId: state.subjectId,
        isCompleteQuiz: state.isCompleteQuiz,
        tiempoInicio: state.tiempoInicio,
        tiempoFin: state.tiempoFin,
        examenEnviado: state.examenEnviado,
        shuffledQuestions: state.shuffledQuestions,
        cantidadPreguntas: state.cantidadPreguntas,
      })
    }
  )
)



export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Si ya hidró antes de que montara el componente
    const alreadyHydrated = useQuizStore.persist.hasHydrated()
    if (alreadyHydrated) {
      setHydrated(true)
      return
    }

    // Si no, esperar
    const unsubHydrate = useQuizStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    return () => unsubHydrate()
  }, [])

  return hydrated
}