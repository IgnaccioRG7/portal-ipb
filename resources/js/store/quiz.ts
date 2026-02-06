import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type QuizMode = 'tema' | 'mix'

interface QuizState {
  startedQuiz: boolean
  currentQuestion: number
  answers: Record<string, number>,
  subjectId: number | null,
  isCompleteQuiz: boolean

  setCurrentQuestion: (n: number) => void
  setSubjectId: (n: number) => void
  answerQuestion: (id: string, answer: number) => void
  reset: () => void
  completeQuiz: (val: boolean) => void
  startQuiz: (val: boolean) => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({

      startedQuiz: false,
      currentQuestion: 0,
      answers: {},
      subjectId: null,
      isCompleteQuiz: false,

      setSubjectId: (n) => {
        set({
          subjectId: n
        })
      },

      setCurrentQuestion: (n) => {
        set({
          currentQuestion: n
        })
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

      reset: () => {
        set({
          currentQuestion: 0,
          answers: {},
          isCompleteQuiz: false
        })
      },

      completeQuiz: (val) => {
        set({
          isCompleteQuiz: val
        })
      },

      startQuiz: (val) => {
        set({
          startedQuiz: val
        })
      }

    }),
    {
      name: 'quiz-progress'
    }
  )
)