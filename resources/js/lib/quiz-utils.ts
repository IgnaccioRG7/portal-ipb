// resources/js/lib/quiz-utils.ts
export interface Question {
  id: string;
  type: 'select' | 'input';
  text: string;
  options: string[];
  correctAnswer: number;
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
  // Crear pares [opción, índiceOriginal]
  const optionPairs = question.options.map((opt, idx) => ({ 
    text: opt, 
    originalIndex: idx 
  }));
  
  // Mezclar
  const shuffledPairs = shuffleArray(optionPairs);
  
  // Encontrar dónde quedó la respuesta correcta
  const correctOriginalIndex = question.correctAnswer;
  const newCorrectIndex = shuffledPairs.findIndex(
    pair => pair.originalIndex === correctOriginalIndex
  );
  
  return {
    ...question,
    options: shuffledPairs.map(p => p.text),
    correctAnswer: newCorrectIndex
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
  
  // 1. Randomizar preguntas (si está activado)
  if (config.randomizar_preguntas) {
    prepared = shuffleArray(prepared);
  }
  
  // 2. Randomizar respuestas (si está activado)
  if (config.randomizar_respuestas) {
    prepared = prepared.map(q => shuffleOptions(q));
  }
  
  return prepared;
}