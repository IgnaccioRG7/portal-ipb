// resources/js/lib/quiz-utils.ts
export interface Question {
  id: string;
  type: 'select' | 'input';
  text: string;
  options: string[];
}

/**
 * Mezcla aleatoriamente un array (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Mezcla las opciones de respuesta y ajusta la respuesta correcta
 */
export function shuffleOptions(question: Question): Question {
  const shuffled = shuffleArray(question.options);
  return {
    ...question,
    options: shuffled
  };
}

/**
 * Prepara las preguntas según la configuración del tema
 */
export function prepareQuestions(
  questions: Question[],
  config: {
    randomizar_preguntas: boolean;
    randomizar_respuestas: boolean;
  }
): Question[] {
  let prepared = [...questions];
  
  // 1. Randomizar preguntas
  if (config.randomizar_preguntas) {
    prepared = shuffleArray(prepared);
  }
  
  // 2. Randomizar respuestas
  if (config.randomizar_respuestas) {
    prepared = prepared.map(q => shuffleOptions(q));
  }
  
  return prepared;
}