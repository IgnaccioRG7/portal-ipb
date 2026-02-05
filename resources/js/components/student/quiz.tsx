import { Tema } from "@/pages/Student/topics";
import { useMemo, useState } from "react";
import Progress from "./progress";

// Contenido JSON (solo estructura base, sin interpretar)
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
}

export function Quiz({ tema }: DirectTopicProps) {
  console.log(tema);

  const contenido: ContenidoJson = useMemo<ContenidoJson>(() => {
    return JSON.parse(tema.contenido_json);
  }, [tema.contenido_json]);

  const [current, setCurrent] = useState(0);
  const total = contenido.questions.length;

  const next = () => {
    if (current < total - 1) setCurrent(p => p + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent(p => p - 1);
  };

  const question = contenido.questions[current];

  return (
    <section className="space-y-6">

      {/* Progress */}
      <Progress total={total} current={current} />

      {/* Question */}
      <div className="space-y-4">
        <header className="flex flex-col gap-2"> 
          <span className="tag px-4 py-1 flex items-center leading-normal bg-gray-200 shadow-xs w-fit rounded-full text-xs font-black uppercase mx-auto"> {`Pregunta ${current + 1}`} </span>
          <h3 className="text-lg font-semibold border border-gray-200 px-2 py-4 rounded-md text-center shadow-xs">
            {question.text}
          </h3>
        </header>

        <ul className="space-y-3">
          {question.options.map((opt, i) => (
            <li
              key={i}
              className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {opt}
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={prev}
          disabled={current === 0}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <span className="text-sm text-gray-500">
          {current + 1} / {total}
        </span>

        <button
          onClick={next}
          disabled={current === total - 1}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

    </section>
  );
}
