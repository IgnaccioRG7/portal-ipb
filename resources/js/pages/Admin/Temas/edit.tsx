// TODOHOY: VER SI BORRAR ESTE ARCHIVO DE UNA VEZ YA QUE SE ESTA CREANDO EN LA RUTA DE PROFESOR

import ContentLayout from '@/layouts/content-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, X } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import cursos from '@/routes/cursos';
import InputError from '@/components/input-error';

type Question = {
  id: string;
  type: 'select';
  text: string;
  options: string[];
  correctAnswer: number;
};

type TemaContent = {
  reading?: string;
  questions: Question[];
};

export default function TemaEdit({ tema }: any) {
  const { data, setData, put, processing, errors } = useForm<{
    nombre: string;
    descripcion: string;
    tipo: string;
    estado: string;
    contenido: TemaContent;
    curso_id: number;
    materia_id: number;
  }>({
    nombre: tema.nombre || '',
    descripcion: tema.descripcion || '',
    tipo: tema.tipo,
    estado: tema.estado,
    contenido: tema.contenido,
    curso_id: tema.curso_id,
    materia_id: tema.materia.id
  });

  console.log(tema);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cursos', href: cursos.index().url },
    { title: tema.materia.nombre, href: '#' },
    { title: tema.nombre || 'Editar Quiz', href: '#' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(cursos.temas.update({
      modulo: tema.modulo_materia_id,
      curso: tema.curso_id,
      materia: tema.materia_id,
      tema: tema.id
    }).url);
  };

  // ✅ Manejar cambio de tipo
  const handleTipoChange = (newTipo: string) => {
    setData('tipo', newTipo);

    // Si cambia de "lectura" a otro tipo, limpiar el reading
    if (newTipo !== 'lectura' && data.contenido.reading) {
      const { reading, ...rest } = data.contenido;
      setData('contenido', rest);
    }
    // Si cambia a "lectura" y no tiene reading, inicializarlo
    else if (newTipo === 'lectura' && !data.contenido.reading) {
      setData('contenido', { ...data.contenido, reading: '' });
    }
  };

  // Agregar nueva pregunta con 2 opciones mínimas
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: 'select',
      text: '',
      options: ['', ''],
      correctAnswer: 0
    };
    setData('contenido', {
      ...data.contenido,
      questions: [...data.contenido.questions, newQuestion]
    });
  };

  // Eliminar pregunta
  const removeQuestion = (index: number) => {
    const updated = data.contenido.questions.filter((_, i) => i !== index);
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Actualizar texto de pregunta
  const updateQuestionText = (index: number, text: string) => {
    const updated = [...data.contenido.questions];
    updated[index].text = text;
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Actualizar opción
  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...data.contenido.questions];
    updated[qIndex].options[optIndex] = value;
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Cambiar respuesta correcta
  const setCorrectAnswer = (qIndex: number, optIndex: number) => {
    const updated = [...data.contenido.questions];
    updated[qIndex].correctAnswer = optIndex;
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Agregar nueva opción a una pregunta
  const addOption = (qIndex: number) => {
    const updated = [...data.contenido.questions];
    updated[qIndex].options.push('');
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Eliminar opción (mínimo 2)
  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...data.contenido.questions];

    if (updated[qIndex].options.length <= 2) {
      alert('Debe haber al menos 2 opciones');
      return;
    }

    if (updated[qIndex].correctAnswer === optIndex) {
      updated[qIndex].correctAnswer = 0;
    }
    else if (updated[qIndex].correctAnswer > optIndex) {
      updated[qIndex].correctAnswer -= 1;
    }

    updated[qIndex].options.splice(optIndex, 1);
    setData('contenido', { ...data.contenido, questions: updated });
  };

  // Helper para obtener errores específicos
  const getQuestionError = (qIndex: number, field: 'text' | 'options') => {
    const key = `contenido.questions.${qIndex}.${field}`;
    return errors[key as keyof typeof errors];
  };

  const getOptionError = (qIndex: number, optIndex: number) => {
    const key = `contenido.questions.${qIndex}.options.${optIndex}`;
    return errors[key as keyof typeof errors];
  };

  return (
    <ContentLayout
      title={`Editar Quiz: ${tema.nombre || 'Sin nombre'}`}
      subtitle={`Materia: ${tema.materia.nombre}`}
      breadcrumbs={breadcrumbs}
    >
      <Head title="Editar Quiz" />

      {/* Truco para que el sticky se quede arriba */}
      <form onSubmit={handleSubmit} className="space-y-4 relative"
        style={{
          // height: '700px',
          // overflowY: 'scroll'
          height: 'calc(100vh - 300px)'
        }}
      >
        {/* Info básica */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre del Tema</Label>
            <Input
              id="nombre"
              value={data.nombre}
              onChange={e => setData('nombre', e.target.value)}
              placeholder="Ej: Deforestación y cambio climático"
            />
            <InputError message={errors.nombre} />
          </div>

          {/* ✅ SELECTOR DE TIPO */}
          <div>
            <Label htmlFor="tipo">Tipo de Tema *</Label>
            <select
              id="tipo"
              value={data.tipo}
              onChange={e => handleTipoChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="opcional">Opcional</option>
              <option value="lectura">Lectura</option>
              <option value="configurable">Configurable</option>
            </select>
            <InputError message={errors.tipo} />
            <p className="text-xs text-gray-500 mt-1">
              {data.tipo === 'lectura' && '📖 Incluye texto de lectura'}
              {data.tipo === 'opcional' && '📝 Quiz estándar'}
              {data.tipo === 'configurable' && '⚙️ Quiz personalizable'}
            </p>
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <select
              id="estado"
              value={data.estado}
              onChange={e => setData('estado', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="borrador">Borrador</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={data.descripcion}
            onChange={e => setData('descripcion', e.target.value)}
            rows={2}
            placeholder="Describe brevemente el tema..."
          />
        </div>

        {/* ✅ Lectura (solo visible si tipo === "lectura") */}
        {data.tipo === 'lectura' && (
          <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg pt-4 pb-2 bg-blue-50 dark:bg-blue-950 animate-in fade-in duration-200">
            <Label htmlFor="reading" className="text-base font-semibold flex items-center gap-2">
              📖 Texto de Lectura
              <span className="text-xs font-normal text-red-600 dark:text-red-400">(Obligatorio)</span>
            </Label>
            <Textarea
              id="reading"
              value={data.contenido.reading || ''}
              onChange={e => setData('contenido', { ...data.contenido, reading: e.target.value })}
              rows={10}
              placeholder="Escribe aquí el texto completo de la lectura que los estudiantes deberán leer antes de responder las preguntas.

Ejemplo:
La región andina de Bolivia ha experimentado una transformación profunda en las últimas décadas. Los cambios climáticos han afectado significativamente los ecosistemas locales..."
              className="mt-2 font-serif text-base leading-relaxed"
            />
            <InputError message={errors['contenido.reading' as keyof typeof errors]} />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-start gap-1">
              <span>💡</span>
              <span>
                Este texto se mostrará antes de las preguntas. Los estudiantes deberán leerlo y comprenderlo
                para poder responder correctamente.
              </span>
            </p>
          </div>
        )}

        {/* Preguntas */}
        <div className="">
          <div className="flex justify-between items-center sticky top-0 bg-white pb-6 pt-4 dark:bg-black">
            <h3 className="text-lg font-semibold">Preguntas del Quiz</h3>
            <Button type="button" onClick={addQuestion} variant="outline">
              <Plus size={16} className="mr-1" /> Agregar Pregunta
            </Button>
          </div>

          {/* Error general de preguntas */}
          <InputError message={errors['contenido.questions' as keyof typeof errors]} />

          {data.contenido.questions.map((question, qIndex) => (
            <div
              key={question.id}
              className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                <Label className="text-base font-semibold">Pregunta {qIndex + 1}</Label>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                  disabled={data.contenido.questions.length === 1}
                  title={data.contenido.questions.length === 1 ? 'Debe haber al menos 1 pregunta' : 'Eliminar pregunta'}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div>
                <Label htmlFor={`question-${qIndex}`} className="text-sm">
                  Texto de la pregunta *
                </Label>
                <Textarea
                  id={`question-${qIndex}`}
                  value={question.text}
                  onChange={e => updateQuestionText(qIndex, e.target.value)}
                  placeholder="Escribe la pregunta..."
                  rows={2}
                  className={getQuestionError(qIndex, 'text') ? 'border-red-500' : ''}
                />
                <InputError message={getQuestionError(qIndex, 'text')} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Opciones de respuesta (mín. 2) *</Label>
                  <Button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus size={14} className="mr-1" /> Opción
                  </Button>
                </div>

                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`correct-${qIndex}-${optIndex}`}
                      name={`correct-${qIndex}`}
                      checked={question.correctAnswer === optIndex}
                      onChange={() => setCorrectAnswer(qIndex, optIndex)}
                      className="w-4 h-4 cursor-pointer"
                      title="Marcar como correcta"
                    />
                    <div className="flex-1">
                      <Input
                        id={`option-${qIndex}-${optIndex}`}
                        value={option}
                        onChange={e => updateOption(qIndex, optIndex, e.target.value)}
                        placeholder={`Opción ${optIndex + 1}`}
                        className={getOptionError(qIndex, optIndex) ? 'border-red-500' : ''}
                      />
                      <InputError message={getOptionError(qIndex, optIndex)} />
                    </div>
                    <span className="text-xs text-gray-500 min-w-[80px]">
                      {question.correctAnswer === optIndex && '✅ Correcta'}
                    </span>
                    {question.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(qIndex, optIndex)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        title="Eliminar opción"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t pb-12">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </ContentLayout>
  );
}