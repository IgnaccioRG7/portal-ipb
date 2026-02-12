// store/quiz.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { router } from '@inertiajs/react'
import { ContenidoJson } from '@/components/student/quiz'
import estudiante from '@/routes/estudiante'

export type QuizMode = 'tema' | 'mix'

interface QuizState {
  isSubmitting: boolean
  startedQuiz: boolean
  currentQuestion: number
  // answers: Record<string, number>
  subjectId: number | null
  isCompleteQuiz: boolean
  tiempoInicio: number | null
  tiempoFin: number | null
  examenEnviado: boolean

  answers: Record<string, string | number> // Acepta ambos por si acaso
  answerQuestion: (id: string, answer: string | number) => void

  setCurrentQuestion: (n: number) => void
  setSubjectId: (n: number) => void
  // answerQuestion: (id: string, answer: number) => void
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

      setSubjectId: (n) => {
        set({ subjectId: n })
      },

      setCurrentQuestion: (n) => {
        set({ currentQuestion: n })
      },

      answerQuestion: (id, answer) => {
        const answers = get().answers
        set({
          answers: {
            ...answers,
            [id]: answer
          }
        })
      },

      iniciarTiempo: () => {
        const currentTiempoInicio = get().tiempoInicio
        if (currentTiempoInicio === null) {
          const nuevoTiempo = Date.now()
          set({ tiempoInicio: nuevoTiempo })
          console.log('⏱️ Tiempo iniciado en store:', nuevoTiempo)
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
          isSubmitting: false
        })
      },

      completeQuiz: (val) => {
        set({
          isCompleteQuiz: val,
          tiempoFin: Date.now()
        })
      },

      startQuiz: (val) => {
        set({ startedQuiz: val })
      },

      enviarExamen: async ({ cursoId, moduloId, materiaId, temaId, contenido, tiempoInicio }) => {
        const state = get()

        if (state.isSubmitting) {
          return
        }

        const tiempoFin = Date.now()
        let tiempoUtilizado = Math.floor((tiempoFin - tiempoInicio) / 1000)

        if (tiempoUtilizado < 1) {
          tiempoUtilizado = 1
        }

        // console.log('⏰ Tiempo Inicio:', new Date(tiempoInicio).toISOString())
        // console.log('⏰ Tiempo Fin:', new Date(tiempoFin).toISOString())
        // console.log('📊 Tiempo utilizado:', tiempoUtilizado, 'segundos')

        set({
          isSubmitting: true,
          isCompleteQuiz: true,
          tiempoFin: tiempoFin
        })

        const answers = state.answers
        // const correctAnswers = contenido.questions.filter(
        //   q => q.correctAnswer === answers[q.id]
        // ).length
        // const puntajeTotal = correctAnswers
        const totalPreguntas = contenido.questions.length
        // const porcentaje = Math.floor((correctAnswers / totalPreguntas) * 100)

        // const respuestas = contenido.questions.reduce((acc, q) => {
        //   acc[q.id] = {
        //     respuesta: answers[q.id],
        //     esCorrecta: answers[q.id] === q.correctAnswer
        //   }
        //   return acc
        // }, {} as Record<string, any>)
        const respuestas = Object.keys(answers).reduce((acc, questionId) => {
          acc[questionId] = {
            respuesta: answers[questionId]
          }
          return acc
        }, {} as Record<string, any>)

        console.log(contenido);
        console.log(answers);


        router.post(
          estudiante.examen.guardar({
            curso: cursoId,
            modulo: moduloId,
            materia: materiaId,
            tema: temaId
          }),
          {
            respuestas: respuestas,
            tiempo_utilizado: tiempoUtilizado,
            // puntaje_total: puntajeTotal,
            // porcentaje: porcentaje,
          },
          {
            preserveScroll: true,
            onSuccess: () => {
              set({ examenEnviado: true, isSubmitting: false })
            },
            onError: (errors) => {
              set({ isSubmitting: false })
              console.error('❌ Error al guardar examen:', errors)
            }
          }
        )
      }
    }),
    {
      name: 'quiz-progress'
    }
  )
)