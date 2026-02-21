import { Link, router } from "@inertiajs/react";
import { ArrowLeftToLine, CircleCheck, CircleX, Home, RotateCcw, Trophy } from "lucide-react";
import { ContenidoJson } from "../student/quiz";
import estudiante from "@/routes/estudiante";;
import { useQuizStore } from "@/store/quiz";
import { useEffect, useState } from 'react';

interface Answer {
  correcto: string
  respondido: string
  esCorrecta: boolean
}

interface Question {
  id: string,
  text: string
}

export function StudentResults({
  percentage,
  questions = [],
  answers = {}
}: {
  percentage: number
  questions: Question[]
  answers: Record<string, Answer>
}) {

  console.log("Lo que llega");
  console.log({
    percentage,
    questions,
    answers
  });


  const objQuestions = Object.fromEntries(questions?.map(q => [q.id, q.text]))
  const arrayAnswers = Object.entries(answers)

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

  return (
    <section className="quiz flex flex-col gap-4">
      <h2 className="text-2xl font-bold w-full text-center">Resultados</h2>
      <section className="results">
        {/* Columna izquierda - Resultado actual */}
        <div className="lg:col-span-1">
          <div className="qualification">
            <div className={`border-2 rounded-md grid place-content-center min-h-50 ${getBackgroundColor()}`}>
              <Trophy className={`size-10 mx-auto ${getTextColor()}`} />
              <span className={`result mx-auto text-4xl font-black ${getTextColor()}`}>
                {percentage} %
              </span>
            </div>
          </div>
          <div className="review col-span-1 md:col-span-2">
            <h3 className="text-xl font-medium my-4">Revisa tus respuestas</h3>
            <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {
                arrayAnswers?.map((answer, index) => {

                  const [key, response] = answer
                  const isCorrect = response.esCorrecta
                  const userAnswer = response.respondido
                  const quizAnswer = response.correcto

                  return (
                    <li
                      key={key}
                      className={`border-2 rounded-md p-2 flex gap-2 items-start ${isCorrect ? 'bg-green-200/30 border-green-300' : 'bg-red-200/30 border-red-300'}`}>
                      <div className={`icon ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? <CircleCheck /> : <CircleX />}
                      </div>
                      <div className="response flex flex-col">
                        <span className="question text-gray-600 text-sm dark:text-gray-300">Pregunta {index + 1}</span>
                        <p className="font-semibold">{objQuestions[key]}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-base">
                          <span>Tu respuesta: </span>
                          <span className={`font-medium text-base ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                            {userAnswer}
                          </span>
                          <br />
                          <span className={`${isCorrect ? 'hidden' : ''}`}>
                            <span>Correcta: </span>
                            <span className={`font-medium text-base text-green-800 dark:text-green-200'`}>
                              {quizAnswer}
                            </span>
                          </span>
                        </p>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </section>
    </section>
  )
};